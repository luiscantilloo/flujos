# Administrador de cuenta

Sos el responsable de **tu empresa en el sistema**: catálogo, proveedores, clientes, usuarios y aprobar las compras. No recibís camiones ni movés cajas.

## Cómo entrar

1. Correo → (si te pide) elegí **tu empresa** → contraseña.
2. Vas al **Panel administrativo**, con tres tarjetas:
   - **Asignación y creación**
   - **Catálogo**
   - **Reportes**

## Antes de operar: armá la casa

Sin esto, compras y ventas no van a funcionar.

### 1. Catálogo de productos

1. Abrí **Catálogo**.
2. **Nuevo producto** para cada ítem que compran o venden.
3. Si un producto se transforma (primario → secundario), creá también el secundario y la relación (incluye el % de merma esperada).
4. Si tenés lista en Excel, usá **Importar Excel**.
5. El **precio de venta** se carga aparte (precio vigente del producto). Si no hay precio, al armar una venta el sistema muestra **$0**. Pedile a quien carga precios que no deje productos a la venta sin precio.

### 2. Proveedores, clientes, compradores

En **Asignación y creación**:

1. **Proveedores** — a quién le compran.
2. **Clientes** — a quién le venden.
3. **Compradores** — personas o puntos de destino de la venta, si los usan.
4. **Camiones** — placa, tipo (refrigerado / seco) y que esté disponible.
5. **Plantas** — destinos, si aplica.

### 3. Vincular bodegas

1. **Bodega interna** / **Bodega externa**: asociá las bodegas que TI ya creó a tu cuenta.
2. Sin esto, el operador no va a poder elegir destino en una orden de compra.

### 4. Crear el equipo

En **Usuarios**, creá a la gente con el rol correcto:

| Persona | Rol que le das |
| --- | --- |
| Oficina de compras/ventas | Operador de cuenta |
| Supervisor de bodega | Administrador de bodega |
| Jefe de piso | Jefe de bodega |
| Muelle | Custodio |
| Quien mueve cajas | Operario |
| Línea de frío | Procesador |
| Chofer | Transportista |

A los de bodega **asignalos a la bodega** donde trabajan. Si no, van a entrar y ver pantalla vacía.

## Tu trabajo de todos los días

### Aprobar una solicitud de compra

1. El operador crea la solicitud y la manda a aprobación.
2. En **Compras** (o donde veas la solicitud) buscá las que están **pendiente de aprobación**.
3. Revisá proveedor, productos y kilos.
4. Pulsá **Aprobar**.
5. Recién ahí el operador puede convertirla en orden de compra y **Emitir orden** al proveedor.

Si la rechazás, el flujo se corta: hay que armar otra solicitud.

### Reportes

La tarjeta **Reportes** abre la reportería de inventario de mercancía. Sirve para mirar, no para mover stock.

## Qué no te toca

- Recibir el camión, cerrar la recepción física, armar el paquete de despacho.
- Completar tareas de operario.
- Crear empresas o bodegas desde cero (eso es TI / Configurador).

## Si algo no funciona

| Qué pasa | Qué hacer |
| --- | --- |
| No ves el panel administrativo | Tu usuario no es administrador de cuenta. Pedile a TI que revise el rol. |
| No podés aprobar | La solicitud tiene que estar **pendiente de aprobación**, no en borrador. |
| El operador no ve la bodega al emitir la OC | Vinculá la bodega en **Bodega interna**. |
| Un operario entra y no ve nada | Falta asignarlo a la bodega. |
