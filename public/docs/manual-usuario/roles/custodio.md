# Custodio

| Campo | Valor |
| --- | --- |
| Rol | `custodio` |
| Nivel | Bodega |
| Pantalla principal | `/dashboard/custodio/ingreso` |
| Creado por | Administrador de cuenta |

## ¿Quién es?

Responsable de **custodia física** en muelle: recibe mercancía, valida documentos y temperatura, y prepara paquetes de despacho.

## Pantallas (tabs propios)

| Ruta | Función |
| --- | --- |
| `/dashboard/custodio/ingreso` | Registro de ingreso físico |
| `/dashboard/custodio/orden-compra` | Gestión OC desde piso |
| `/dashboard/custodio/orden-venta` | Gestión OV desde piso |

También accede a `/dashboard/ingreso` (recepciones generales) y `/dashboard/mapa` (lectura + lock).

## Procesos principales

### Recepción de compra

1. Ver OC pendientes de recepción (`emitida` o `parcialmente_recibida`)
2. Abrir modal de recepción
3. Ingresar cantidades recibidas y temperatura por línea
4. **Cerrar recepción** → crea lotes y actualiza `warehouse_state`

Roles autorizados a cerrar: configurador, admin cuenta, admin/jefe bodega, **custodio**.

### Paquete de despacho

1. Desde zona de salida, crear paquete de despacho
2. Asocia camión, guías y consume stock de zona salida
3. OV pasa a `despachada`

## Permisos

| Acción | ¿Puede? |
| --- | --- |
| Cerrar recepción compra | ✅ |
| Lock/unlock mapa | ✅ |
| Crear paquete despacho | ✅ |
| Emitir OV | ❌ |
| Ejecutar tareas operario | ❌ |
| Registrar entrega transporte | ❌ |

## Errores frecuentes (soporte)

| Síntoma | Solución |
| --- | --- |
| OC no aparece para recepción | Estado debe ser `emitida` o `parcialmente_recibida` |
| Error al cerrar recepción | Cantidades > pendiente en línea OC |
| No puede crear paquete despacho | Camión no disponible o stock insuficiente en zona salida |
