# Custodio

Trabajás en **muelle**: recibís lo que llega y armás lo que se va. Validás kilos, temperatura y documentos. No armás la venta en oficina ni manejás el camión en la calle.

## Cómo entrar

1. Correo → empresa → contraseña.
2. Vas a **Ingreso**.

Arriba tenés tres pestañas:

| Pestaña | Para qué |
| --- | --- |
| **Ingreso** | Recibir mercancía (kilos y temperatura) |
| **Orden de compra** | Las OC que están por llegar o llegando |
| **Orden de venta** | Las OV que hay que despachar |

También podés abrir **Mapa** para ver casilleros (y bloquear uno si estás trabajando ahí).

## Recibir un camión (compra)

La oficina ya tuvo que **emitir** la orden de compra. Si no está emitida, no te va a aparecer.

1. Abrí **Orden de compra** (o **Ingreso**).
2. Buscá la OC en **emitida** o **parcialmente recibida**.
3. Abrí la recepción.
4. Por cada línea: **kilos recibidos** y **temperatura** (ejemplo: `-18`).
5. Cerrá la recepción.

Eso deja el producto en la zona de ingreso y actualiza el inventario. Si llegó **menos** de lo pedido, la OC queda parcialmente recibida: podés recibir el resto después. Si ponés más kilos de los pendientes, el sistema no deja.

## Despachar (venta)

1. El piso ya tuvo que llevar la mercancía a **zona de salida**.
2. En **Orden de venta**, armá el **paquete de despacho**: camión, guías, lo que sale.
3. Confirmá. La venta pasa a despachada (o parcialmente, si no salió todo).
4. El **transportista** ve las guías y entrega con foto y firma.

Sin camión disponible o sin stock en salida, no vas a poder armar el paquete.

## Qué no te toca

- Pulsar **Emitir venta** (oficina).
- Completar las tarjetas de tarea del operario.
- Registrar la entrega en destino (transportista).

## Si algo no funciona

| Qué pasa | Qué hacer |
| --- | --- |
| La OC no aparece | Tiene que estar **emitida**. Pedile a oficina. |
| Error al cerrar | No pongas más kilos que los que faltan por recibir. Completá temperatura. |
| No hay slot de ingreso | El jefe / TI tiene que tener zona de ingreso en el layout. |
| No arma el despacho | Camión no disponible, o la mercancía no está en zona de salida. |
