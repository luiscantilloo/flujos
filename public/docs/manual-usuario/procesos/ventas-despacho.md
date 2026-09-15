Roles admitidos: operador_cuenta, administrador_cuenta, jefe_bodega, operario, custodio, transportista
Seccionar: False


# Ventas y despacho

Así sale mercancía hacia un cliente: oficina arma y emite, piso prepara (y puede fotografiar la hoja), muelle despacha, chofer entrega.

## Quién hace qué

| Paso | Quién | En la pantalla |
| --- | --- | --- |
| 1. Crear / emitir la orden | Operador de cuenta | **Ventas** → **Órdenes venta** → **Nueva venta** |
| 2. Editar si hace falta | Operador (o admin) de cuenta | **Editar** en la fila (mientras no esté despachada) |
| 3. Imprimir hoja + QR | Operador (o admin) | **Imprimir** o **Descargar** |
| 4. Foto de la hoja surtida | Quien tiene el teléfono en piso | Escanear el QR (Safari) → **Subir y leer hoja** |
| 5. Coordinar salida | Jefe de bodega | **Crear Salida** |
| 6. Picking | Operario | Tarjetas en **Operación** |
| 7. Paquete de despacho | Custodio | **Orden de venta** |
| 8. Entrega | Transportista | **Transporte** — foto y firma |

## Paso a paso (oficina)

### Nueva venta

1. **Ventas** → **Órdenes venta** → **Nueva venta**.
2. Elegí cómo empezar:
   - **Primera vez** — no está el comprador: se abre **Nuevo comprador** (ficha completa) y después el pedido.
   - **Venta nueva** — formulario vacío.
   - **Tengo el mensaje o archivos** — pegá el texto y/o subí PDF, Excel, CSV, Word, correo (`.eml`) o foto. Elegí el **cliente** (así aplica precios y equivalencias). Pulsá **Leer y llenar el formulario**. Revisá lo que armó la IA.
3. Completá **Datos del pedido**, **Entrega** y **Productos** (cantidad, cajas, presentación, precio). El precio sale de la **lista de precio** o de la **equivalencia** de ese comprador. Si ves **$0**, ese producto no tiene precio: no lo dejes así.
4. Pulsá **Validar y enviar**. Eso **crea y emite**: reserva stock y avisa a bodega.

Si la OV quedó en **Borrador** (no se pudo emitir), abrila y pulsá **Emitir venta**.

Si reintentás emitir una que **ya está confirmada**, el sistema no se queja: ya está emitida.

### Editar

1. En la fila, **Editar** (lápiz).
2. Se puede en **borrador**, **confirmada** y **en preparación**.
3. **Guardar cambios** (si ya no es borrador) o **Validar y enviar** (si sigue en borrador).
4. No se edita si está despachada, cerrada o cancelada.

### Imprimir y QR

1. **Imprimir** (impresora de la cuenta) o **Descargar** el PDF. Lleva un QR: **Escanear y fotografiar**.
2. Si no hay impresora, pedile al **configurador** que la cargue en **Asignación → Impresoras**.

## Captura de surtido (teléfono, sin login)

Cuando el piso ya marcó la hoja a mano:

1. Escaneá el QR del PDF. Se abre **Captura de surtido**.
2. Abrilo en **Safari** (no adentro de WhatsApp ni Mail).
3. **Tomar foto** o **Elegir de galería**.
4. **Subir y leer hoja**. Vas a ver la precisión (Alta / Media / Baja / Muy baja).
5. En oficina, cuando ya hay captura, **Descargar PDF actualizado (surtido)**.

Si la foto no queda y el botón no se activa: recargá en Safari y volvé a elegir la imagen. En producción el QR tiene que ser el de la URL real (https), no una IP de la oficina.

## Piso y muelle

1. Jefe: **Crear Salida** (elige la OV y el slot de salida).
2. Operario: lleva a zona de salida.
3. Custodio: arma el paquete (camión + guías).
4. Transportista: entrega.

Estados: **borrador** → **confirmada** → **en preparación** → **parcialmente despachada** / **despachada**.

## Si se traba

- No aparece **Nueva venta**: no tenés rol de oficina (operador/admin de cuenta).
- No emite: stock corto, líneas vacías o precio $0.
- No aparece **Editar**: la OV ya no está en un estado editable.
- No imprime: falta impresora en Configurador.
- El QR no abre o no deja subir la foto: usá Safari; la captura no pide login.
- El jefe no puede crear salida: la OV no está emitida.
- El custodio no arma el paquete: no hay mercancía en zona de salida o el camión no está disponible.
