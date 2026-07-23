# Ventas y despacho

Ciclo desde orden de venta hasta preparación en bodega.

## Estados OV

| Estado | Significado |
| --- | --- |
| `borrador` | Editable, sin reserva |
| `confirmada` | Emitida, stock reservado |
| `en_preparacion` | Picking en curso |
| `parcialmente_despachada` | Salida parcial |
| `despachada` | Completamente despachada |
| `cancelada` | Anulada |

## Flujo

```
1. Operador cuenta crea OV borrador (/dashboard/ventas/ordenes)
2. Emitir OV → POST /ventas/ordenes/:id/emitir
   - Reserva stock (cantidad_reservada)
   - Movimiento tipo reserva
   - Crea OT + tareas por slot (despacho)
3. Jefe bodega coordina salida (modal Crear Salida)
4. Operario ejecuta tareas picking → zona salida
5. Custodio crea paquete despacho
6. Transportista registra entrega
```

## Roles

| Acción | Roles |
| --- | --- |
| Crear OV borrador | operador_cuenta, admin_cuenta |
| Emitir OV | operador_cuenta, admin_cuenta, admin/jefe bodega |
| Crear salida bodega | jefe_bodega |
| Paquete despacho | custodio |
| OV desde piso | custodio en `/dashboard/custodio/orden-venta` |

## Preguntas frecuentes (Mateo)

**¿Por qué no emite la OV?** Stock insuficiente en `warehouse_state` para las líneas.

**¿OV en borrador quién la ve?** Operador cuenta y custodio (según pantalla).

**¿Qué pasa al emitir?** El stock se reserva; si cancelan después hay que liberar reserva (flujo cancelación).
