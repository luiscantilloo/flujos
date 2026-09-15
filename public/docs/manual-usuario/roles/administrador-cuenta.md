Roles admitidos: administrador_cuenta
Seccionar: False


# Administrador de cuenta

Sos el responsable de **tu empresa en el sistema**: catálogo, precios, proveedores, clientes, usuarios y aprobar las compras. No recibís camiones ni movés cajas.

## Cómo entrar

1. Correo → (si te pide) elegí **tu empresa** → contraseña.
2. Vas al **Panel administrativo**, con **cuatro** tarjetas:
   - **Asignación y creación**
   - **Catálogo**
   - **Lista de precio**
   - **Reportes**

## Antes de operar: armá la casa

Sin esto, compras y ventas no van a funcionar.

### 1. Catálogo de productos

1. Abrí **Catálogo**.
2. **Nuevo producto** para cada ítem que compran o venden.
3. Si un producto se transforma (primario → secundario), creá también el secundario y la relación (incluye el % de merma esperada).
4. Si tenés lista en Excel, usá **Importar Excel**.

### 2. Lista de precio

1. Abrí **Lista de precio**.
2. Ahí está el **precio vigente** de cada producto (el que usa el pedido de venta).
3. Editá las celdas y **Guardar**.
4. Las **equivalencias** de un comprador **no** cambian esta lista: son un precio especial de ese cliente.

Si un producto no tiene fila acá, en el pedido sale **$0** y no conviene emitir.

### 3. Proveedores, clientes, compradores, camiones y plantas

En **Asignación y creación**, usá las pantallas de **Creación** (no las de Asignación):

1. **Proveedores** — a quién le compran.
2. **Clientes** — a quién le venden.
3. **Compradores** — personas o puntos de destino de la venta.
4. **Camiones** — placa, tipo (refrigerado / seco) y que esté disponible.
5. **Plantas** — destinos, si aplica.

En cada tabla hay **Editar** (lápiz) para corregir nombre, teléfono y el resto de datos. El **código** no se cambia.

Los **teléfonos** se muestran siempre con el prefijo del país (ejemplo: `+57 300 111 2238`), aunque en la base estén guardados sin el `+`.

#### Compradores: ficha, equivalencias y alta desde ventas

**Nuevo comprador** abre una ficha completa (fiscales, crédito, centros, contactos, reglas). Las equivalencias **no** se cargan en el alta: se agregan después.

- **Editar** (lápiz) → pestaña **Equivalencia** → **Crear equivalencia**.
- Elegí producto, escribí cómo lo llama el cliente (sandía → patilla) y, si aplica, un **precio especial**. Si el precio queda vacío, se usa la lista de precio.
- Pulsá una **fila** del comprador (no el lápiz) para ver la ficha y las equivalencias.
- El operador también puede dar de alta un comprador desde **Ventas → Nueva venta → Primera vez**.

El catálogo de **producto** no se modifica: la equivalencia vive aparte.

### 4. Vincular bodegas

1. **Bodega interna** / **Bodega externa**: asociá las bodegas que TI ya creó a tu cuenta.
2. Sin esto, el operador no va a poder elegir destino en una orden de compra.
3. La **bodega por defecto** la marca TI en Configurador (Cuentas): el pedido de venta la preselecciona.

### 5. Crear el equipo

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

**Editar usuario** (lápiz): nombre, correo, teléfono. Código, rol y asignación no se cambian ahí.

En el **detalle** del usuario (clic en la fila): **Restablecer contraseña**.

## Tu trabajo de todos los días

### Aprobar una solicitud de compra

1. El operador crea la solicitud y la manda a aprobación.
2. En **Compras** (o donde veas la solicitud) buscá las que están **pendiente de aprobación**.
3. Revisá proveedor, productos y kilos.
4. Pulsá **Aprobar**.
5. Recién ahí el operador puede convertirla en orden de compra y **Emitir orden** al proveedor.

Si la rechazás, el flujo se corta: hay que armar otra solicitud.

### Ventas

Podés armar y **editar** pedidos igual que el operador (ver guía **Ventas y despacho**): **Nueva venta**, IA, imprimir QR, PDF de surtido.

### Reportes

La tarjeta **Reportes** abre la reportería de inventario de mercancía. Sirve para mirar, no para mover stock.

## Qué no te toca

- Recibir el camión, cerrar la recepción física, armar el paquete de despacho.
- Completar tareas de operario.
- Crear empresas, bodegas o impresoras desde cero (eso es TI / Configurador).

## Si algo no funciona

| Qué pasa | Qué hacer |
| --- | --- |
| No ves el panel administrativo | Tu usuario no es administrador de cuenta. Pedile a TI que revise el rol. |
| No ves **Lista de precio** | Recargá. Si no está, pedí a TI que actualice el front. |
| No podés aprobar | La solicitud tiene que estar **pendiente de aprobación**, no en borrador. |
| El operador no ve la bodega al emitir la OC | Vinculá la bodega en **Bodega interna**. |
| Un operario entra y no ve nada | Falta asignarlo a la bodega. |
| El pedido sale a $0 | Cargá el precio en **Lista de precio** o una equivalencia de ese comprador. |
| No se puede **Editar** una OV | Ya está despachada, cerrada o cancelada; o falta la migración 080 (TI). |
| Al guardar un alias/equivalencia sale error de tabla | Pedile a TI las migraciones de alias y precio (067, 073) y recargue. |
