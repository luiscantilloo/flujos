# Compras: SOL → OC → Recepción

Flujo end-to-end desde la necesidad de compra hasta stock en bodega.

## Diagrama

```
SOL (borrador)
  → enviar aprobación → pendiente_aprobacion
  → aprobar → aprobada
  → convertir → OC (borrador)
  → emitir → emitida
  → recepción física → parcialmente_recibida / recibida
  → stock en warehouse_state
```

## Roles por etapa

| Etapa | Roles |
| --- | --- |
| Crear SOL | operador_cuenta, admin_cuenta, jefe/admin bodega |
| Aprobar SOL | administrador_cuenta, configurador |
| Convertir a OC | mismos que crean SOL |
| Emitir OC | operador_cuenta, admin_cuenta |
| Cerrar recepción | custodio, jefe_bodega, admin_bodega, admin_cuenta, configurador |

## Estados SOL

| Estado | Significado |
| --- | --- |
| `borrador` | Editable |
| `pendiente_aprobacion` | Esperando admin |
| `aprobada` | Lista para convertir a OC |
| `rechazada` / `cancelada` | Fin del flujo |

## Estados OC

| Estado | Significado |
| --- | --- |
| `borrador` | Editable |
| `emitida` | Enviada a proveedor, esperando mercancía |
| `parcialmente_recibida` | Recepción parcial |
| `recibida` | Completamente recibida |
| `cancelada` | Anulada |

## Recepción física

1. Custodio/jefe abre OC pendiente en `/dashboard/ingreso` o `/dashboard/custodio/orden-compra`
2. Modal recepción: cantidades + temperatura por línea
3. `POST /compras/recepciones/ordenes/:id/cerrar`
4. Backend crea: `lote`, `warehouse_state`, `movimiento_inventario` tipo `recepcion`

## Integraciones automáticas

| Evento | Integración |
| --- | --- |
| Crear SOL | Webhook n8n (`POST /api/solicitud-compra`) |
| Emitir OC | Webhook pedido proveedor (`POST /api/pedido-proveedor`) |

## Preguntas frecuentes (Mateo)

**¿Puedo recibir sin OC?** No en el flujo estándar. La recepción siempre concilia contra una OC emitida.

**¿Qué pasa si llega menos de lo pedido?** La OC queda `parcialmente_recibida`; se puede hacer otra recepción.

**¿Quién ve las compras?** Operadores y admins de cuenta ven SOL/OC. Roles de bodega ven ingreso/recepción.
