# Configurador (equipo TI)

Tú armás el sistema **antes** de que el cliente opere. Creás la empresa, la cuenta, las bodegas y el primer administrador. No movés cajas ni hacés compras.

## Cómo entrar

1. Abrí Polaria WMS.
2. Escribí tu **correo** y **contraseña**. No te pide código de empresa.
3. Vas a ir al **Panel** (`/configurador`).

En el menú izquierdo vas a ver: **Panel**, **Creación**, **Asignación**, **Integración**.

## Qué tenés que hacer (onboarding de un cliente nuevo)

Hacelo **en este orden**. Si saltás un paso, el resto no cierra.

### 1. Crear la empresa

1. Menú **Creación** → **Empresas**.
2. Alta de la empresa cliente (código y razón social).
3. Dejala activa.

### 2. Crear la cuenta (el “tenant”)

1. **Creación** → **Cuentas**.
2. La cuenta **pertenece a esa empresa**. Es la unidad operativa: catálogos, compras y ventas van a colgar de acá.
3. Una empresa puede tener varias cuentas (divisiones, marcas).

### 3. Crear la bodega

1. **Creación** → **Bodega interna** (si es bodega propia) o **Bodega externa** (si es de un tercero).
2. El sistema arma el layout de zonas: ingreso, almacenamiento, procesamiento, salida.
3. Si te dice que el layout ya existe, no lo fuerces: la bodega ya está lista.

### 4. Crear al administrador de cuenta

1. **Asignación** → **Usuarios**.
2. Creá el usuario con rol **Administrador de cuenta**, vinculado a la empresa (y a la cuenta).
3. Entregale correo y contraseña inicial. **A partir de acá, él arma el equipo** (operadores, jefe, custodios…).

### 5. (Opcional) Más usuarios

Podés crear más gente desde acá, pero lo normal es que el administrador de cuenta lo haga en su panel.

### 6. Integración de bodega externa

Si el cliente pide conectar una bodega de terceros:

1. Ellos cargan la solicitud desde **Bodega externa**.
2. Vos la ves en **Integración**.
3. Configurás y activás. Hasta que TI no active, el cliente no opera esa bodega como si fuera propia.

## Qué no te toca

- El día a día de compras, ventas, mapa o muelle.
- Aprobar cada solicitud de compra del cliente (eso es el administrador de cuenta), salvo que te lo pidan.

## Si algo no funciona

| Qué pasa | Qué hacer |
| --- | --- |
| “No tengo acceso al configurador” | Ese usuario no es configurador. No le asignes empresa de cliente. |
| Error al crear el layout de la bodega | Suele ser que ya está creado. Seguí con usuarios. |
| No ves solicitudes de integración | Revisá el menú **Integración**, no el dashboard del cliente. |
| El admin de cuenta no entra | Revisá que el correo exista, la empresa esté activa y el rol sea administrador de cuenta. |
