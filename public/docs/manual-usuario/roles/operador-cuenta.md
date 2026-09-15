Roles admitidos: operador_cuenta
Seccionar: False


# Operador de cuenta

Trabajás en **oficina**: pedís compras, emitís la orden al proveedor y armás las ventas. El piso (custodio, operario, jefe) hace el resto.

## Cómo entrar

1. Correo → empresa (si te la pide) → contraseña.
2. Vas a un hub con cuatro tarjetas:
   - **Proveedor** (compras)
   - **Ventas**
   - **Bodega interna**
   - **Bodega externa**

## Comprar (de la necesidad al camión en camino)

### Paso A — Nueva solicitud (SOL)

1. Entrá a **Proveedor**.
2. Pulsá **Nueva solicitud**.
3. Elegí proveedor y productos (buscá por nombre, SKU o categoría).
4. Indicá kilos/cantidad.
5. Guardá y **enviala a aprobación**.

Hasta que el **administrador de cuenta** no apruebe, no podés seguir.

### Paso B — Convertir a orden de compra (OC)

1. Cuando la solicitud esté **aprobada**, convertila a OC.
2. Elegí la **bodega destino**. Si no aparece ninguna, el admin de cuenta todavía no vinculó la bodega.
3. Pulsá **Emitir orden**. Eso avisa al proveedor (automático).

Estados que vas a ver: borrador → emitida → (cuando reciban) parcialmente recibida / recibida.

## Vender

1. Entrá a **Ventas** → **Órdenes venta**.
2. Pulsá **Nueva venta** (no dice “Nueva orden de venta”).
3. Elegí cómo empezar:
   - **Primera vez** — el comprador no existe: llenás la ficha y seguís al pedido.
   - **Venta nueva** — captura a mano.
   - **Tengo el mensaje o archivos** — pegás el WhatsApp/correo o subís PDF/Excel/foto, elegís el **cliente** y pulsá **Leer y llenar el formulario**. Revisá antes de enviar.
4. El precio lo toma de la **lista de precio** o de la **equivalencia** de ese comprador. Si sale **$0**, no lo dejes: avisá al admin.
5. Pulsá **Validar y enviar**. Eso **emite** (reserva stock y avisa a piso).

Si quedó en **Borrador**, abrí el detalle y pulsá **Emitir venta**.

Para corregir una OV en **borrador**, **confirmada** o **en preparación**: **Editar** en la fila. Si ya salió a despacho, no se edita.

**Imprimir** / **Descargar** genera el PDF con QR. En piso escanean ese QR, fotografían la hoja y vos después podés **Descargar PDF actualizado (surtido)**.

Detalle del ciclo: guía **Ventas y despacho**.

## Bodega interna — procesamiento

Si hay que transformar producto (primario → secundario):

1. **Bodega interna** → procesamiento.
2. Creá la solicitud.
3. El **jefe de bodega** y el **procesador** siguen en piso. Vos no declarás merma.

## Bodega externa

1. **Bodega externa** → integración.
2. Pedí a TI que conecte esa bodega (scraping, API o CSV).
3. El **configurador** la activa. Hasta entonces no opera como bodega propia.

## Qué no te toca

- Aprobar solicitudes (eso es el administrador de cuenta).
- Cargar la **lista de precio** (admin de cuenta).
- Configurar impresoras (configurador / TI).
- Cerrar la recepción en muelle.
- Completar tareas de operario ni registrar entregas del chofer.

## Si algo no funciona

| Qué pasa | Qué hacer |
| --- | --- |
| No puedo convertir la SOL a OC | Tiene que estar **aprobada**. Pedile al admin de cuenta. |
| No aparece **Emitir orden** | Falta bodega destino en la OC. |
| No emite la venta | Stock insuficiente, líneas vacías, precio $0, o no está en borrador. |
| El producto sale a $0 | No hay precio en **Lista de precio** ni equivalencia de ese comprador. |
| No aparece **Editar** | La OV ya está despachada, cerrada o cancelada. |
| No imprime | Pedile a TI la impresora de la cuenta. |
| El QR / la foto no carga | Que usen **Safari** y la URL de producción (https). |
