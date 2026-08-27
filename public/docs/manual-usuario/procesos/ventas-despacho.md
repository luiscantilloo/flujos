Roles admitidos: configurador, operador_cuenta, administrador_cuenta, jefe_bodega, operario, custodio, transportista
Seccionar: False

# Ventas y despacho

Así sale mercancía hacia un cliente: oficina arma y emite, piso prepara, muelle despacha, chofer entrega.

## Quién hace qué

| Paso | Quién | En la pantalla |
| --- | --- | --- |
| 1. Crear la orden | Operador de cuenta | **Ventas** → **Nueva orden de venta** |
| 2. Emitir | Operador (o admin) de cuenta | **Emitir venta** |
| 3. Coordinar salida | Jefe de bodega | **Crear Salida** |
| 4. Picking | Operario | Tarjetas en **Operación** |
| 5. Paquete de despacho | Custodio | **Orden de venta** |
| 6. Entrega | Transportista | **Transporte** — foto y firma |

## Paso a paso

### Crear (borrador)

1. Cliente / comprador, productos y kilos.
2. El precio lo pone el sistema (precio de venta vigente). Si ves **$0**, ese producto no tiene precio: no emitas.
3. Guardá. Todavía **no** reserva stock.

### Emitir

1. Abrí la orden en **borrador**.
2. **Emitir venta**.
3. El sistema reserva stock y crea las tareas de bodega.
4. La orden pasa a **confirmada** y luego a **en preparación** cuando el piso arranca.

Si no hay stock, no emite. Cambiá líneas o esperá un ingreso.

### Piso y muelle

1. Jefe: **Crear Salida** (elige la OV y el slot de salida).
2. Operario: lleva a zona de salida.
3. Custodio: arma el paquete (camión + guías).
4. Transportista: entrega.

Estados: **borrador** → **confirmada** → **en preparación** → **parcialmente despachada** / **despachada**.

## Si se traba

- No aparece **Emitir venta**: no está en borrador, o no tenés permiso.
- No emite: stock corto.
- Precio $0: falta cargar precio de venta de ese producto.
- El jefe no puede crear salida: la OV no está emitida.
- El custodio no arma el paquete: no hay mercancía en zona de salida o el camión no está disponible.
