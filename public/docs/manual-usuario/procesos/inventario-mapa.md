# Inventario y mapa en vivo

El inventario en Polaria WMS se representa en `warehouse_state`: stock por ubicación × producto × lote.

## Canales de lectura

| Canal | Tecnología | Uso |
| --- | --- | --- |
| Web mapa | Supabase Realtime + RLS | Vista «En vivo» en `/dashboard/mapa` |
| API | `GET /inventario/warehouse-state` | Consultas con guards |

## Pantalla mapa (`/dashboard/mapa`)

- Tabla de posiciones con badge **En vivo**
- Muestra: producto, lote, cantidad, temperatura, estado slot
- Roles con acceso: admin_bodega, jefe_bodega, custodio, operario

## Lock / unlock (POL-6, POL-141)

Evita que dos usuarios operen la misma posición simultáneamente.

| Acción | Endpoint | Roles |
| --- | --- | --- |
| Bloquear | `POST .../lock` | admin/jefe bodega, custodio, operario |
| Liberar | `POST .../unlock` | mismos |
| Force unlock | unlock con flag | admin/jefe bodega |

- TTL stale: 5 minutos (lock expira si el usuario abandona)
- Optimistic locking: campo `version` en `warehouse_state`

## FEFO (First Expired, First Out)

Al crear OT de salida, el sistema selecciona lotes por `fecha_vencimiento ASC`.

## Movimientos

Ledger append-only en `movimiento_inventario`:

| Tipo | Cuándo |
| --- | --- |
| `recepcion` | Cerrar recepción compra |
| `transferencia` | Completar tarea / ejecutar OT |
| `reserva` | Emitir OV |
| `despacho` | Paquete despacho |
| `merma` | Cerrar procesamiento |

## Realtime (POL-182)

Tras eventos Realtime, el frontend refetch `ubicacion` para alinear `estado_slot` con `warehouse_state`.

## Preguntas frecuentes (Mateo)

**¿Por qué el mapa no actualiza?** Verificar conexión Realtime, bodega seleccionada y permisos RLS.

**¿No puedo bloquear posición?** Otro usuario la tiene bloqueada; esperar o pedir force unlock al jefe.

**¿Dónde veo historial?** `GET /inventario/movimientos` (API) o reportería según rol.
