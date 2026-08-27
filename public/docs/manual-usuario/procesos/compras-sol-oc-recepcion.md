# Compras: de la solicitud al ingreso

Así entra mercancía a la bodega. Nadie lo hace solo: oficina pide, el jefe de cuenta aprueba, oficina emite, muelle recibe.

## Quién hace qué

| Paso | Quién | En la pantalla |
| --- | --- | --- |
| 1. Pedir | Operador de cuenta | **Proveedor** → **Nueva solicitud** |
| 2. Aprobar | Administrador de cuenta | **Aprobar** (cuando está pendiente) |
| 3. Emitir al proveedor | Operador de cuenta | **Emitir orden** (con bodega destino) |
| 4. Recibir el camión | Custodio (o jefe / admin bodega) | **Ingreso** / **Orden de compra** — kilos y temperatura |

## Paso a paso

### 1. Solicitud (SOL)

Es un pedido interno: “necesitamos comprar esto”. Todavía no es el documento al proveedor.

1. Operador: **Nueva solicitud**, proveedor, productos, kilos.
2. Enviarla a aprobación.
3. Admin de cuenta: **Aprobar** o rechazar.

Estados: **borrador** → **pendiente de aprobación** → **aprobada** (o rechazada).

### 2. Orden de compra (OC)

1. Con la SOL aprobada, se convierte en OC.
2. Hay que elegir **bodega destino**.
3. **Emitir orden**: el proveedor queda notificado.

Estados: **borrador** → **emitida** → **parcialmente recibida** / **recibida**.

### 3. Recepción en muelle

1. El custodio busca la OC **emitida**.
2. Carga lo que realmente llegó y la temperatura.
3. Al cerrar, el producto queda en **ingreso** y aparece en el inventario.

Si llegó de menos, la OC queda parcial y se puede recibir el resto después.

**¿Se puede recibir sin OC?** En el flujo normal, no. Siempre se concilia contra una orden emitida.

## Si se traba

- No sale **Aprobar**: no es administrador de cuenta, o la SOL sigue en borrador.
- No sale **Emitir orden**: falta bodega destino (el admin debe vincular la bodega).
- El custodio no ve la OC: todavía no está emitida.
- Error al cerrar recepción: kilos de más o falta temperatura.
