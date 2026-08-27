Roles admitidos: operador de cuenta, configurador
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

1. Entrá a **Ventas** → órdenes.
2. Pulsá **Nueva orden de venta**.
3. Elegí cliente/comprador y productos. El precio lo toma el sistema del **precio de venta vigente**. Si sale **$0**, ese producto no tiene precio cargado: no emitas así; avisá al admin.
4. Guardá el **borrador**. Revisalo.
5. Pulsá **Emitir venta**.

Al emitir, el sistema reserva stock y le aparecen tareas al piso (picking). Si no hay stock, no va a emitir: cambiá líneas o esperá un ingreso.

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
- Cerrar la recepción en muelle.
- Completar tareas de operario ni registrar entregas del chofer.

## Si algo no funciona

| Qué pasa | Qué hacer |
| --- | --- |
| No puedo convertir la SOL a OC | Tiene que estar **aprobada**. Pedile al admin de cuenta. |
| No aparece **Emitir orden** | Falta bodega destino en la OC. |
| No emite la venta | Stock insuficiente, o la OV no está en borrador, o el precio/líneas están mal. |
| El producto sale a $0 | No hay precio de venta cargado para ese producto. |
