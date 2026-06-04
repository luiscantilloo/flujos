# Guía para explicar las tablas del sistema — como cuento paso a paso

Esta guía está escrita para que **cualquier persona** entienda el dibujo de tablas (ER),
incluso si tienes **10 años** o nunca viste una base de datos.

Cada **paso** es una pieza del rompecabezas. Léelos del **0 al 31** en orden, como capítulos de un libro.

---

## Antes de empezar (3 ideas fáciles)

1. **Tabla** = una hoja de Excel con muchas filas del mismo tipo (usuarios, bodegas, productos…).
2. **El equipo del programa** (configurador) monta el mundo; **el jefe de la empresa** lo usa.
3. **Empresa** es el nombre grande del cliente; **cuenta** es el salón donde pasa el trabajo cada día.

> Este cuento sigue el PDF **Bodega de Frío V2.0 — Decisiones de diseño** (`BodegaFrio_V2_Decisiones.pdf`).
> Cuando el jefe **pide** una bodega, es un paso extra del diagrama ER (el PDF solo dice que el equipo del programa la **crea**).

### Los tres personajes principales

| Personaje | ¿Quién es? |
|-----------|------------|
| Equipo del programa | Los que crean empresas, bodegas y arreglan el sistema |
| Jefe de empresa (admin) | Pide bodegas, llena listas, asigna trabajadores |
| Trabajadores | Operarios, custodios, choferes… hacen el trabajo en la bodega |

### Cuánto dura contarlo

| Modo | Pasos | Tiempo | Qué cuentas |
|------|-------|--------|-------------|
| Corto | 0–7 | ~20 min | Cómo nace la empresa y la bodega |
| Medio | 8–17 | +20 min | Listas y compras |
| Completo | 0–31 | ~1 hora | Todo el cuento hasta ventas y camión |

---

## El cuento completo (mapa)

```
🏭 El equipo que REPARA el programa (configurador TI)
 │
 ├─ crea la EMPRESA (el cliente, como el "nombre del colegio")
 │     ├─ crea al JEFE de esa empresa (administrador)
 │     └─ crea la CUENTA de trabajo (el "salón" donde ocurre todo)
 │           │
 │           ├─ el jefe PIDE una bodega (nevera / almacén)  → solicitud
 │           ├─ el equipo del programa CREA la bodega
 │           ├─ el jefe se APUNTA a esa bodega
 │           │
 │           ├─ llena listas: proveedores, compradores, camiones, productos…
 │           ├─ compra cosas (pedido → orden de compra)
 │           ├─ guarda y mueve cajas dentro de la bodega
 │           ├─ a veces transforma productos (procesamiento)
 │           └─ vende y manda en camión (venta → viaje → foto de entrega)
```

---

## FASE 0 — Encabezado: configurador TI (plataforma)

**En palabras fáciles:**

Antes de jugar hay reglas: qué personajes existen (jefe del juego, dueño de tienda, trabajador del almacén) y cómo entras con usuario y contraseña.

### Paso 0 — rol — Lista de tipos de personaje en el juego.

**En una frase:** Lista de tipos de personaje en el juego.

**Imagínalo así:**

Como cuando eliges si eres mago, guerrero o curador — aquí eliges si eres jefe del programa, jefe de empresa o trabajador de bodega.

**Quién lo usa o lo crea:** Ya viene escrito en el juego (no lo inventa el cliente)

**Antes de este paso:** Es el capítulo 1 del cuento. Empieza aquí.

**Después sigue:** Después viene la puerta de entrada (correo y contraseña) y luego la empresa.

#### Cuenta esto en voz alta (30–60 segundos)

Hay nueve roles fijos. No los inventa el cliente. El más especial es el configurador: es quien construye el mundo para los demás.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Rol del sistema

Tabla 0 — empieza aquí. Perfiles fijos del WMS. El configurador TI usa id_rol = configurador (nivel plataforma).

**Conexiones en el dibujo ER:**

- Se relaciona con **usuario**: usuarios (cuenta/plataforma)
- Se relaciona con **asignacion_bodega**: asignaciones bodega

**Datos importantes en la tabla:**

- **id_rol** (es el código único de la fila)

**Índices (para que el programa vaya rápido):**

- PK (id_rol)
- IX rol_nivel (nivel)

</details>

### Paso 1 — auth.users — La puerta para entrar con correo y contraseña.

**En una frase:** La puerta para entrar con correo y contraseña.

**Imagínalo así:**

Como el login de Minecraft o Roblox: sin eso no entras.

**Quién lo usa o lo crea:** La puerta de entrada con correo y contraseña (Supabase)

**Antes de este paso:** Ya sabes qué personajes existen (paso 0).

**Después sigue:** Cuando entras, el paso 2 es crear la empresa en el sistema.

#### Cuenta esto en voz alta (30–60 segundos)

No es una tabla de la tienda; es donde vive la contraseña. Después el juego sabe qué personaje eres.

---

## FASE 1 — Empresa y administrador de cuenta

**En palabras fáciles:**

El equipo del programa crea la empresa cliente y el primer jefe de esa empresa.

### Paso 2 — empresa — El nombre de la empresa cliente en el sistema.

**En una frase:** El nombre de la empresa cliente en el sistema.

**Imagínalo así:**

Como el nombre de tu colegio en el carnet: todos los de ese colegio pertenecen ahí.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** Tras entender rol y Auth: el equipo del programa crea la empresa.

**Después sigue:** Paso 3 usuario (administrador de cuenta de esa empresa).

#### Cuenta esto en voz alta (30–60 segundos)

El equipo del programa crea la empresa. Todos los usuarios de ese cliente llevan ese código cuando entran.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Empresa (cliente SaaS)

Cliente jurídico del SaaS. La crea el configurador TI (usuario con rol configurador) tras iniciar sesión en plataforma.

**Conexiones en el dibujo ER:**

- Se relaciona con **usuario**: creada por (configurador TI)
- Se relaciona con **cuenta**: tiene tenants
- Se relaciona con **usuario**: usuarios (login V2)

**Datos importantes en la tabla:**

- **codigo_empresa** (es el código único de la fila)
- **id_creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (codigo_empresa)
- IX empresa_activa (esta_activa) WHERE esta_activa

</details>

### Paso 3 — usuario — Cada persona que usa el sistema.

**En una frase:** Cada persona que usa el sistema.

**Imagínalo así:**

Como una ficha de jugador con nombre, correo y qué rol tiene.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** Lee empresa (2). TI crea administrador_cuenta con codigo_empresa y Auth.

**Después sigue:** Paso 4 cuenta (cuenta de trabajo). Luego más usuarios en tabla 12.

#### Cuenta esto en voz alta (30–60 segundos)

Primero creas al jefe de la empresa. Más tarde el jefe crea a sus ayudantes y a la gente de la bodega.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Usuario

Tabla 3 (admin) y 14 (resto). Configurador TI: codigo_empresa NULL. Admin/operador: pertenecen a empresa y tenant. TI puede crear cualquier rol; admin crea operador_cuenta y equipo de bodega.

**Conexiones en el dibujo ER:**

- Se relaciona con **rol**: rol cuenta/plataforma
- Se relaciona con **empresa**: pertenece a (login)
- Se relaciona con **cuenta**: tenant operativo
- Se relaciona con **sesion_auth**: login
- Se relaciona con **asignacion_bodega**: bodegas
- Se relaciona con **orden_compra**: crea OC
- Se relaciona con **orden_venta**: crea OV
- Se relaciona con **solicitud_compra**: solicita SOL

**Datos importantes en la tabla:**

- **id_usuario** (es el código único de la fila)
- **id_rol** (apunta a otra tabla: rol.id_rol)
- **codigo_empresa** (apunta a otra tabla: empresa.codigo_empresa)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_usuario)
- UNIQUE (correo)
- IX usuario_empresa (codigo_empresa)
- IX usuario_cuenta (codigo_cuenta)
- IX usuario_rol (id_rol)

</details>

---

## FASE 2 — Tenant operativo (cuenta)

**En palabras fáciles:**

Cada empresa puede tener una o más "cuentas de trabajo". Ahí vive el día a día: productos, pedidos, bodegas.

### Paso 4 — cuenta — El "salón de trabajo" donde pasa la operación diaria.

**En una frase:** El "salón de trabajo" donde pasa la operación diaria.

**Imagínalo así:**

La empresa es el colegio; la cuenta es el salón 5B donde guardas tus cosas, listas y tareas — no mezclas con el salón 6A.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** Empresa (2) + admin (3). TI crea codeCuenta bajo codigo_empresa.

**Después sigue:** Paso 5 pedido de bodega.

#### Cuenta esto en voz alta (30–60 segundos)

Una empresa puede tener varias cuentas. Productos, compras y ventas van pegados a la cuenta, no solo al nombre de la empresa.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Tenant (cuenta operativa)

Tenant operativo bajo una empresa. El configurador (TI) lo crea tras empresa y admin cuenta; catálogos y órdenes los crea el admin.

**Conexiones en el dibujo ER:**

- Se relaciona con **empresa**: pertenece a

**Datos importantes en la tabla:**

- **codigo_cuenta** (es el código único de la fila)
- **codigo_empresa** (apunta a otra tabla: empresa.codigo_empresa)
- **id_creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (codigo_cuenta)
- IX cuenta_empresa (codigo_empresa)
- IX cuenta_activa (esta_activa)

</details>

---

## FASE 3 — Petición y alta de bodegas (interna / externa)

**En palabras fáciles:**

El jefe pide una bodega con nombre; el equipo del programa la construye en el sistema; el jefe dice "yo trabajo en esa bodega".

### Paso 5 — solicitud_alta_bodega — El jefe pide: "quiero una bodega con este nombre".

**En una frase:** El jefe pide: "quiero una bodega con este nombre".

**Imagínalo así:**

Como pedir por formulario una casilla nueva en el estacionamiento.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Admin de cuenta pide bodega interna/externa con nombre personalizado.

**Después sigue:** Paso 6 bodega (TI atiende la petición y crea la fila).

#### Cuenta esto en voz alta (30–60 segundos)

El administrador pide. El equipo del programa lee la petición y después crea la bodega de verdad.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Petición de alta de bodega

El administrador de cuenta solicita una bodega interna o externa con nombre personalizado. El configurador TI atiende la petición y crea la fila en bodega.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **usuario**: solicitante
- Se relaciona con **bodega**: bodega creada

**Datos importantes en la tabla:**

- **id_solicitud** (es el código único de la fila)
- **codigo_empresa** (apunta a otra tabla: empresa.codigo_empresa)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_solicitante** (apunta a otra tabla: usuario.id_usuario)
- **id_bodega** (apunta a otra tabla: bodega.id_bodega)
- **id_atendido_por** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_solicitud)
- IX sol_bodega_tenant (codigo_cuenta, estado)
- IX sol_bodega_pendiente (estado) WHERE estado = pendiente

</details>

### Paso 6 — bodega — El almacén frío (de la empresa o afuera).

**En una frase:** El almacén frío (de la empresa o afuera).

**Imagínalo así:**

Una nevera gigante con estantes: adentro guardas cajas de comida.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** Petición (5) o alta directa por TI. Vincula código de la cuenta y tipo interna/externa.

**Después sigue:** Paso 7 quién trabaja en la bodega (admin se asigna).

#### Cuenta esto en voz alta (30–60 segundos)

Solo el equipo del programa la crea en el sistema. Puede ser bodega interna o externa.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Bodega

Bodega interna o externa del tenant. La crea el configurador TI (directo o atendiendo solicitud_alta_bodega). El admin de cuenta se asigna después en asignacion_bodega.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **solicitud_alta_bodega**: desde petición
- Se relaciona con **asignacion_bodega**: equipo

**Datos importantes en la tabla:**

- **id_bodega** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_solicitud_origen** (apunta a otra tabla: solicitud_alta_bodega.id_solicitud)
- **id_creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_bodega)
- IX bodega_tenant (codigo_cuenta)
- IX bodega_tipo (tipo)
- IX bodega_solicitud (id_solicitud) UNIQUE nullable

</details>

### Paso 7 — asignacion_bodega — Quién trabaja en qué bodega y con qué trabajo.

**En una frase:** Quién trabaja en qué bodega y con qué trabajo.

**Imagínalo así:**

La lista del profe: "Pedro es capitan del equipo A, María del equipo B".

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Bodega (6) creada. El admin de cuenta se asigna (y asigna equipo después).

**Después sigue:** Tablas 8–11 catálogos.

#### Cuenta esto en voz alta (30–60 segundos)

El jefe se apunta primero a su bodega. Luego apunta a custodios, operarios y choferes.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Asignación usuario ↔ bodega

Tabla 7 — el administrador de cuenta se auto-asigna a la bodega creada; luego asigna custodio, operario, jefe, etc. Siempre amarrado a bodegas del tenant.

**Conexiones en el dibujo ER:**

- Se relaciona con **usuario**: usuario
- Se relaciona con **bodega**: bodega
- Se relaciona con **rol**: rol bodega

**Datos importantes en la tabla:**

- **id_asignacion** (es el código único de la fila)
- **id_usuario** (apunta a otra tabla: usuario.id_usuario)
- **id_bodega** (apunta a otra tabla: bodega.id_bodega)
- **id_rol** (apunta a otra tabla: rol.id_rol)

**Índices (para que el programa vaya rápido):**

- PK (id_asignacion)
- UNIQUE (id_usuario, id_bodega, id_rol)
- IX asig_bodega (id_bodega)
- IX asig_usuario (id_usuario)

</details>

---

## FASE 4 — Catálogos y operador de cuenta

**En palabras fáciles:**

El jefe llena sus libretas: quién le vende, quién compra, camiones, productos y ayudantes.

### Paso 8 — proveedor — Quién te vende las cosas que compras.

**En una frase:** Quién te vende las cosas que compras.

**Imagínalo así:**

La tienda donde la mamá compra ingredientes.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** cuenta de trabajo (4) activo. Admin de cuenta da de alta proveedores.

**Después sigue:** Paso 9 comprador, 10 camion, 11 planta.

#### Cuenta esto en voz alta (30–60 segundos)

El jefe guarda el nombre de cada proveedor para hacer pedidos después.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Proveedor

Proveedor de compras del tenant. Alta por administrador de cuenta (paso 7).

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **orden_compra**: OC
- Se relaciona con **solicitud_compra**: SOL

**Datos importantes en la tabla:**

- **id_proveedor** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_proveedor)
- IX proveedor_tenant (codigo_cuenta)

</details>

### Paso 9 — comprador — Quién te compra a ti (a quien envías producto).

**En una frase:** Quién te compra a ti (a quien envías producto).

**Imagínalo así:**

El vecino que te encarga un pastel.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Mismo scope cuenta de trabajo (4).

**Después sigue:** Paso 10 camion.

#### Cuenta esto en voz alta (30–60 segundos)

Cuando vendes, eliges a qué comprador va el envío.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Comprador (destino OV)

Destino de ventas / OV. Alta por administrador de cuenta (paso 7).

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **orden_venta**: OV

**Datos importantes en la tabla:**

- **id_comprador** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_comprador)
- IX comprador_tenant (codigo_cuenta)

</details>

### Paso 10 — camion — Los camiones de la empresa.

**En una frase:** Los camiones de la empresa.

**Imagínalo así:**

Los carritos de reparto.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Catálogos del admin.

**Después sigue:** Paso 11 planta, luego 12 cliente.

#### Cuenta esto en voz alta (30–60 segundos)

Cuando mandas una venta, eliges qué camión lleva la carga.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Camión

Flota del tenant. Alta por administrador de cuenta (paso 8).

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **viaje_transporte**: viajes

**Datos importantes en la tabla:**

- **id_camion** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_camion)
- IX camion_tenant (codigo_cuenta)

</details>

### Paso 11 — planta — A dónde puede ir el producto (otra fábrica o sitio).

**En una frase:** A dónde puede ir el producto (otra fábrica o sitio).

**Imagínalo así:**

La dirección de entrega en el mapa.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Catálogos del admin.

**Después sigue:** Paso 12 cliente.

#### Cuenta esto en voz alta (30–60 segundos)

Algunas ventas van a una planta especial.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Planta destino

Planta destino logística. Alta por administrador de cuenta (paso 8).

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **orden_venta**: destino OV

**Datos importantes en la tabla:**

- **id_planta** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_planta)
- IX planta_tenant (codigo_cuenta)

</details>

### Paso 12 — cliente — Dueño de una marca o línea de productos.

**En una frase:** Dueño de una marca o línea de productos.

**Imagínalo así:**

La marca que pone su nombre en el empaque.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** cuenta de trabajo (4). Necesario antes de producto.

**Después sigue:** Paso 13 producto; tabla 14 operador_cuenta (otros usuarios).

#### Cuenta esto en voz alta (30–60 segundos)

Antes de crear un producto, dices de qué cliente es.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Cliente comercial

Cliente comercial del tenant. Alta por administrador de cuenta (paso 6).

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **producto**: productos
- Se relaciona con **caja**: lotes

**Datos importantes en la tabla:**

- **id_cliente** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_cliente)
- IX cliente_tenant (codigo_cuenta)

</details>

### Paso 13 — producto — Cada cosa que guardas, compras o vendes (con su código).

**En una frase:** Cada cosa que guardas, compras o vendes (con su código).

**Imagínalo así:**

Cada ítem del inventario del videojuego.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Cliente (12) + cuenta de trabajo (4).

**Después sigue:** Paso 14 más usuarios; FASE 5 reusa quién trabaja en la bodega (7).

#### Cuenta esto en voz alta (30–60 segundos)

Helado de vainilla, caja de 10 kg, etc. Tiene código y nombre.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Producto (SKU)

Catálogo del tenant. Lo crea el administrador de cuenta (paso 6), no el configurador.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: tenant
- Se relaciona con **cliente**: cliente
- Se relaciona con **linea_orden_compra**: líneas OC
- Se relaciona con **linea_orden_venta**: líneas OV

**Datos importantes en la tabla:**

- **id_producto** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_cliente** (apunta a otra tabla: cliente.id_cliente)

**Índices (para que el programa vaya rápido):**

- PK (id_producto)
- IX producto_tenant (codigo_cuenta)
- IX producto_cliente (id_cliente)

</details>

### Paso 14 — usuario — Cada persona que usa el sistema.

**En una frase:** Cada persona que usa el sistema.

**Imagínalo así:**

Como una ficha de jugador con nombre, correo y qué rol tiene.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Misma tabla 3: operador_cuenta lo crea admin; custodio/operario/etc. vía asignacion (7). TI puede crear cualquier rol.

**Después sigue:** FASE 6: solicitud_compra (15).

#### Cuenta esto en voz alta (30–60 segundos)

Primero creas al jefe de la empresa. Más tarde el jefe crea a sus ayudantes y a la gente de la bodega.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Usuario

Tabla 3 (admin) y 14 (resto). Configurador TI: codigo_empresa NULL. Admin/operador: pertenecen a empresa y tenant. TI puede crear cualquier rol; admin crea operador_cuenta y equipo de bodega.

**Conexiones en el dibujo ER:**

- Se relaciona con **rol**: rol cuenta/plataforma
- Se relaciona con **empresa**: pertenece a (login)
- Se relaciona con **cuenta**: tenant operativo
- Se relaciona con **sesion_auth**: login
- Se relaciona con **asignacion_bodega**: bodegas
- Se relaciona con **orden_compra**: crea OC
- Se relaciona con **orden_venta**: crea OV
- Se relaciona con **solicitud_compra**: solicita SOL

**Datos importantes en la tabla:**

- **id_usuario** (es el código único de la fila)
- **id_rol** (apunta a otra tabla: rol.id_rol)
- **codigo_empresa** (apunta a otra tabla: empresa.codigo_empresa)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- Ver orden 3 — mismos índices

</details>

---

## FASE 5 — Equipo de bodega (roles físicos)

**En palabras fáciles:**

Se elige quién trabaja en cada bodega: custodio, operario, chofer, etc.

---

## FASE 6 — Compras (SOL / OC)

**En palabras fáciles:**

Llegan los pedidos de compra: primero un borrador (solicitud), luego el pedido firme con lista de cosas.

### Paso 15 — solicitud_compra — Borrador de "quiero comprar esto".

**En una frase:** Borrador de "quiero comprar esto".

**Imagínalo así:**

La lista del súper antes de ir a pagar.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Catálogos y usuarios de cuenta listos.

**Después sigue:** Paso 16 orden_compra.

#### Cuenta esto en voz alta (30–60 segundos)

Primero la solicitud; si está bien, se convierte en orden de compra.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Solicitud de compra (SOL)

Operador de cuenta solicita material; al aprobarse genera la OC (strip-oc).

**Conexiones en el dibujo ER:**

- Se relaciona con **orden_compra**: genera OC
- Se relaciona con **proveedor**: proveedor

**Datos importantes en la tabla:**

- **id_solicitud_compra** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_proveedor** (apunta a otra tabla: proveedor.id_proveedor)
- **id_solicitante** (apunta a otra tabla: usuario.id_usuario)
- **id_orden_compra** (apunta a otra tabla: orden_compra.id_orden_compra)

**Índices (para que el programa vaya rápido):**

- PK (id_solicitud_compra)
- IX sol_compra_tenant (codigo_cuenta)

</details>

### Paso 16 — orden_compra — Pedido de compra ya en serio.

**En una frase:** Pedido de compra ya en serio.

**Imagínalo así:**

El ticket de compra con fecha y proveedor.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Proveedor (8) + bodega destino (6).

**Después sigue:** Paso 17 líneas del pedido de compra.

#### Cuenta esto en voz alta (30–60 segundos)

Dice qué bodega recibirá las cajas y de qué proveedor vienen.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Orden de compra (OC)

Operador de cuenta / administrador de cuenta. Paso a paso: strip-oc → recepción.

**Conexiones en el dibujo ER:**

- Se relaciona con **linea_orden_compra**: líneas
- Se relaciona con **solicitud_compra**: desde SOL
- Se relaciona con **caja**: ingresos

**Datos importantes en la tabla:**

- **id_orden_compra** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_proveedor** (apunta a otra tabla: proveedor.id_proveedor)
- **id_bodega_destino** (apunta a otra tabla: bodega.id_bodega)
- **id_creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_compra)
- IX oc_tenant (codigo_cuenta)
- IX oc_bodega (id_bodega_destino)
- IX oc_estado (estado)

</details>

### Paso 17 — linea_orden_compra — Cada línea del ticket: producto y cantidad.

**En una frase:** Cada línea del ticket: producto y cantidad.

**Imagínalo así:**

En el ticket: 3 leches, 2 quesos — cada línea es una fila.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** OC (16) + producto (13).

**Después sigue:** FASE 7 mapa en vivo de la bodega (18).

#### Cuenta esto en voz alta (30–60 segundos)

Sin líneas no sabes cuántas cajas esperar.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Línea OC



**Conexiones en el dibujo ER:**

- Se relaciona con **orden_compra**: OC
- Se relaciona con **producto**: producto

**Datos importantes en la tabla:**

- **id_orden_compra** (es el código único de la fila) (apunta a otra tabla: orden_compra.id_orden_compra)
- **id_linea** (es el código único de la fila)
- **id_producto** (apunta a otra tabla: producto.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_compra, id_linea)
- IX loc_producto (id_producto)

</details>

---

## FASE 7 — Bodega en vivo + historial

**En palabras fáciles:**

Dentro de la bodega se ve en vivo dónde está cada caja; también queda un diario de movimientos.

### Paso 18 — warehouse_state — Foto en vivo de cómo está la bodega ahora mismo.

**En una frase:** Foto en vivo de cómo está la bodega ahora mismo.

**Imagínalo así:**

El mapa del nivel que se actualiza al instante en el juego.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** Bodega (6) con equipo asignado. Una fila por bodega; Realtime.

**Después sigue:** Tablas 19–22 proyección lógica (opcional en SQL).

#### Cuenta esto en voz alta (30–60 segundos)

Un archivo especial por bodega: dónde hay huecos libres, qué cajas hay, alertas. Va muy rápido para ver en pantalla.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Estado en vivo (documento)

Pilar 1 PDF (modelo dual) + R4: una fila jsonb por bodega (state/main). Lectura Realtime; escritura con locking vía NestJS; proyección en slot/caja/OT.

**Conexiones en el dibujo ER:**

- Se relaciona con **bodega**: bodega
- Se relaciona con **slot**: slots
- Se relaciona con **caja**: cajas
- Se relaciona con **orden_trabajo**: OT
- Se relaciona con **tarea_cola**: tareas
- Se relaciona con **alerta**: alertas

**Datos importantes en la tabla:**

- **id_bodega** (es el código único de la fila) (apunta a otra tabla: bodega.id_bodega)

**Índices (para que el programa vaya rápido):**

- PK (id_bodega)
- GIN (estado_json) opcional

</details>

### Paso 19 — slot — Un hueco o estante en la bodega.

**En una frase:** Un hueco o estante en la bodega.

**Imagínalo así:**

Cada casillero del locker del colegio.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** mapa en vivo de la bodega (18).

**Después sigue:** Paso 20 caja.

#### Cuenta esto en voz alta (30–60 segundos)

Puede estar libre, ocupado o reservado.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Casillero (SlotState)

libre | ocupado | reservado | en_proceso — paso locking.

**Conexiones en el dibujo ER:**

- Se relaciona con **estado_bodega**: estado
- Se relaciona con **caja**: caja actual
- Se relaciona con **alerta**: alertas

**Datos importantes en la tabla:**

- **id_bodega** (es el código único de la fila) (apunta a otra tabla: estado_bodega.id_bodega)
- **id_slot** (es el código único de la fila)
- **id_caja** (apunta a otra tabla: caja.id_caja)

**Índices (para que el programa vaya rápido):**

- PK (id_bodega, id_slot) si se normaliza a tabla

</details>

### Paso 20 — caja — Una caja con producto adentro.

**En una frase:** Una caja con producto adentro.

**Imagínalo así:**

Una caja de zapatos con etiqueta que dice qué hay dentro.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Slots (19) + OC (16–17).

**Después sigue:** Paso 21 orden_trabajo.

#### Cuenta esto en voz alta (30–60 segundos)

Entra cuando compras; sale cuando vendes.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Caja / lote (BoxRecord)

Custodio ingresa; operario mueve; zonas según paso a paso.

**Conexiones en el dibujo ER:**

- Se relaciona con **bodega**: bodega
- Se relaciona con **producto**: producto
- Se relaciona con **orden_compra**: ingreso OC
- Se relaciona con **orden_venta**: salida OV
- Se relaciona con **orden_trabajo**: movimientos

**Datos importantes en la tabla:**

- **id_caja** (es el código único de la fila)
- **id_bodega** (apunta a otra tabla: bodega.id_bodega)
- **id_producto** (apunta a otra tabla: producto.id_producto)
- **id_cliente** (apunta a otra tabla: cliente.id_cliente)
- **id_orden_compra** (apunta a otra tabla: orden_compra.id_orden_compra)
- **id_orden_venta** (apunta a otra tabla: orden_venta.id_orden_venta)

**Índices (para que el programa vaya rápido):**

- PK (id_caja)
- IX caja_bodega (id_bodega)
- IX caja_zona (zona)

</details>

### Paso 21 — orden_trabajo — Orden de mover una caja de un sitio a otro.

**En una frase:** Orden de mover una caja de un sitio a otro.

**Imagínalo así:**

Misión del juego: llevar el cofre del punto A al B.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Cajas (20).

**Después sigue:** Paso 22 alerta; 23 historial.

#### Cuenta esto en voz alta (30–60 segundos)

Un operario la hace; el jefe puede crearla.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Orden de trabajo (WorkOrder)

Jefe/custodio crean; operario ejecuta. Tipos: a_bodega | a_salida | revisar.

**Conexiones en el dibujo ER:**

- Se relaciona con **estado_bodega**: bodega
- Se relaciona con **caja**: caja
- Se relaciona con **usuario**: operario

**Datos importantes en la tabla:**

- **id_orden_trabajo** (es el código único de la fila)
- **id_bodega** (apunta a otra tabla: estado_bodega.id_bodega)
- **id_caja** (apunta a otra tabla: caja.id_caja)
- **id_slot_destino** (apunta a otra tabla: slot.id_slot)
- **id_asignado** (apunta a otra tabla: usuario.id_usuario)
- **id_solicitante** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_trabajo)
- IX ot_bodega_estado (id_bodega, estado)

</details>

### Paso 22 — alerta — Aviso de que algo va mal.

**En una frase:** Aviso de que algo va mal.

**Imagínalo así:**

Luces rojas en el tablero del carro.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Mapa en vivo (18–21).

**Después sigue:** Paso 23 historial_movimiento.

#### Cuenta esto en voz alta (30–60 segundos)

Ejemplo: un hueco lleva mucho tiempo raro o hay problema de frío.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Alerta operativa

temperatura | demora | orden_reportada — jefe de bodega atiende.

**Conexiones en el dibujo ER:**

- Se relaciona con **estado_bodega**: bodega
- Se relaciona con **slot**: slot
- Se relaciona con **usuario**: jefe bodega

**Datos importantes en la tabla:**

- **id_alerta** (es el código único de la fila)
- **id_bodega** (apunta a otra tabla: estado_bodega.id_bodega)
- **id_slot** (apunta a otra tabla: slot.id_slot)
- **id_responsable** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_alerta)
- IX alerta_bodega_abierta (id_bodega) WHERE motivo_cierre IS NULL

</details>

### Paso 23 — historial_movimiento — Diario de todo lo que se movió.

**En una frase:** Diario de todo lo que se movió.

**Imagínalo así:**

El cuaderno del profe con fecha de cada cambio.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** Operación en bodega en marcha.

**Después sigue:** FASE 8 procesamiento (24).

#### Cuenta esto en voz alta (30–60 segundos)

No borras el pasado: queda guardado para revisar después.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Historial de movimientos



**Conexiones en el dibujo ER:**

- Se relaciona con **bodega**: bodega
- Se relaciona con **usuario**: actor

**Datos importantes en la tabla:**

- **id_movimiento** (es el código único de la fila)
- **id_bodega** (apunta a otra tabla: bodega.id_bodega)
- **id_usuario** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_movimiento)
- IX hist_bodega_fecha (id_bodega, creado_en DESC)

</details>

---

## FASE 8 — Procesamiento y merma

**En palabras fáciles:**

A veces un producto se transforma en otro; si algo se pierde, se anota la merma.

### Paso 24 — solicitud_procesamiento — Pedido de transformar un producto en otro.

**En una frase:** Pedido de transformar un producto en otro.

**Imagínalo así:**

Pedir convertir jugo de naranja en concentrado.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Producto (13) + bodega (6).

**Después sigue:** Paso 25 registro_merma.

#### Cuenta esto en voz alta (30–60 segundos)

Entra materia prima; sale otro producto con cantidades.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Solicitud de procesamiento

Operador de cuenta solicita; procesador ejecuta (paso procesamiento).

**Conexiones en el dibujo ER:**

- Se relaciona con **registro_merma**: merma
- Se relaciona con **bodega**: bodega
- Se relaciona con **producto**: primario/secundario
- Se relaciona con **usuario**: procesador

**Datos importantes en la tabla:**

- **id_solicitud** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_bodega** (apunta a otra tabla: bodega.id_bodega)
- **id_producto_primario** (apunta a otra tabla: producto.id_producto)
- **id_producto_secundario** (apunta a otra tabla: producto.id_producto)
- **id_procesador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_solicitud)
- IX sol_proc_bodega (id_bodega, estado)

</details>

### Paso 25 — registro_merma — Lo que se perdió o no salió bien.

**En una frase:** Lo que se perdió o no salió bien.

**Imagínalo así:**

Si se derramó leche, anotas cuánto se perdió.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Solicitud procesamiento (24).

**Después sigue:** FASE 9 orden_venta (26).

#### Cuenta esto en voz alta (30–60 segundos)

Va ligado al procesamiento.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Registro de merma



**Conexiones en el dibujo ER:**

- Se relaciona con **solicitud_procesamiento**: solicitud
- Se relaciona con **bodega**: bodega

**Datos importantes en la tabla:**

- **id_registro** (es el código único de la fila)
- **id_solicitud** (apunta a otra tabla: solicitud_procesamiento.id_solicitud)
- **id_bodega** (apunta a otra tabla: bodega.id_bodega)

**Índices (para que el programa vaya rápido):**

- PK (id_registro)
- IX merma_bodega_periodo (id_bodega, periodo)

</details>

---

## FASE 9 — Ventas, transporte y sistema

**En palabras fáciles:**

Se vende, sale el camión y se guarda la prueba de que llegó; al final el sistema cuenta números y apunta quién hizo qué.

### Paso 26 — orden_venta — Pedido de venta: quiero mandar esto a alguien.

**En una frase:** Pedido de venta: quiero mandar esto a alguien.

**Imagínalo así:**

La nota del cliente que pide entrega.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Comprador (9) + bodega origen (6).

**Después sigue:** Paso 27 líneas de la venta.

#### Cuenta esto en voz alta (30–60 segundos)

Sale de una bodega hacia un comprador.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Orden de venta (OV)



**Conexiones en el dibujo ER:**

- Se relaciona con **linea_orden_venta**: líneas
- Se relaciona con **viaje_transporte**: TV

**Datos importantes en la tabla:**

- **id_orden_venta** (es el código único de la fila)
- **codigo_cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **id_comprador** (apunta a otra tabla: comprador.id_comprador)
- **id_bodega_origen** (apunta a otra tabla: bodega.id_bodega)
- **id_planta** (apunta a otra tabla: planta.id_planta)
- **id_creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_venta)
- IX ov_tenant (codigo_cuenta)
- IX ov_estado (estado)

</details>

### Paso 27 — linea_orden_venta — Cada producto de esa venta.

**En una frase:** Cada producto de esa venta.

**Imagínalo así:**

Cada renglón de la nota de venta.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** OV (26).

**Después sigue:** Paso 28 viaje_transporte.

#### Cuenta esto en voz alta (30–60 segundos)

Cantidad y qué producto van en el camión.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Línea OV



**Conexiones en el dibujo ER:**

- Se relaciona con **orden_venta**: OV
- Se relaciona con **producto**: producto
- Se relaciona con **evidencia_entrega**: evidencias

**Datos importantes en la tabla:**

- **id_orden_venta** (es el código único de la fila) (apunta a otra tabla: orden_venta.id_orden_venta)
- **id_linea** (es el código único de la fila)
- **id_producto** (apunta a otra tabla: producto.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_venta, id_linea)

</details>

### Paso 28 — viaje_transporte — El viaje del camión con la mercancía.

**En una frase:** El viaje del camión con la mercancía.

**Imagínalo así:**

El reparto de Amazon con número de seguimiento.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** OV (26–27) + camion (10).

**Después sigue:** Paso 29 evidencia_entrega.

#### Cuenta esto en voz alta (30–60 segundos)

Une la venta, el camión y el chofer.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Viaje (TV)

Transportista. TV-#### desde contador_documento.

**Conexiones en el dibujo ER:**

- Se relaciona con **evidencia_entrega**: evidencias

**Datos importantes en la tabla:**

- **id_viaje** (es el código único de la fila)
- **id_orden_venta** (apunta a otra tabla: orden_venta.id_orden_venta)
- **id_camion** (apunta a otra tabla: camion.id_camion)
- **id_transportista** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_viaje)
- UNIQUE (numero_documento)
- IX viaje_ov (id_orden_venta)

</details>

### Paso 29 — evidencia_entrega — Prueba de que llegó (foto, firma).

**En una frase:** Prueba de que llegó (foto, firma).

**Imagínalo así:**

La foto que el repartidor manda de la puerta.

**Quién lo usa o lo crea:** transportista

**Antes de este paso:** Viaje (28).

**Después sigue:** Paso 30 contador_documento.

#### Cuenta esto en voz alta (30–60 segundos)

Se guarda cuando termina el viaje.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Evidencia de entrega



**Conexiones en el dibujo ER:**

- Se relaciona con **viaje_transporte**: viaje
- Se relaciona con **linea_orden_venta**: línea OV

**Datos importantes en la tabla:**

- **id_evidencia** (es el código único de la fila)
- **id_viaje** (apunta a otra tabla: viaje_transporte.id_viaje)
- **id_orden_venta** (apunta a otra tabla: orden_venta.id_orden_venta)
- **id_linea** (apunta a otra tabla: linea_orden_venta.id_linea)

**Índices (para que el programa vaya rápido):**

- PK (id_evidencia)
- IX evidencia_viaje (id_viaje)

</details>

### Paso 30 — contador_documento — Contador para números automáticos (viaje 001, 002…).

**En una frase:** Contador para números automáticos (viaje 001, 002…).

**Imagínalo así:**

Como el turno en la fila del banco que sube solo.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** Al implementar numeración automática de viajes.

**Después sigue:** Paso 31 auditoria.

#### Cuenta esto en voz alta (30–60 segundos)

El programa no repite el mismo número dos veces.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Contador de documentos



**Conexiones en el dibujo ER:**

- Se relaciona con **viaje_transporte**: numera TV

**Datos importantes en la tabla:**

- **nombre_contador** (es el código único de la fila)

**Índices (para que el programa vaya rápido):**

- PK (nombre_contador)

</details>

### Paso 31 — auditoria — Cuaderno de "quién hizo qué y cuándo".

**En una frase:** Cuaderno de "quién hizo qué y cuándo".

**Imagínalo así:**

La cámara de seguridad del sistema.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** Cuando todo lo anterior está claro.

**Después sigue:** Fin de la secuencia — repasa FASE 0–9 en diagrama ER onboarding.

#### Cuenta esto en voz alta (30–60 segundos)

Si alguien borra o cambia algo importante, queda anotado.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Auditoría



**Conexiones en el dibujo ER:**

- Se relaciona con **usuario**: usuario

**Datos importantes en la tabla:**

- **id_evento** (es el código único de la fila)
- **id_usuario** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_evento)
- IX audit_usuario_fecha (id_usuario, creado_en DESC)

</details>

---

## Lista rápida — todos los pasos

| Paso | Tabla | De qué trata | Quién |
|------|-------|--------------|-------|
| 0 | `rol` | Lista de tipos de personaje en el juego. | Ya viene escrito en el juego (no lo inventa el cliente) |
| 1 | `auth.users` | La puerta para entrar con correo y contraseña. | La puerta de entrada con correo y contraseña (Supabase) |
| 2 | `empresa` | El nombre de la empresa cliente en el sistema. | El equipo que arregla y crea el programa (como los desarrolladores) |
| 3 | `usuario` | Cada persona que usa el sistema. | El equipo que arregla y crea el programa (como los desarrolladores) |
| 4 | `cuenta` | El "salón de trabajo" donde pasa la operación diaria. | El equipo que arregla y crea el programa (como los desarrolladores) |
| 5 | `solicitud_alta_bodega` | El jefe pide: "quiero una bodega con este nombre". | El jefe de la empresa cliente |
| 6 | `bodega` | El almacén frío (de la empresa o afuera). | El equipo que arregla y crea el programa (como los desarrolladores) |
| 7 | `asignacion_bodega` | Quién trabaja en qué bodega y con qué trabajo. | El jefe de la empresa cliente |
| 8 | `proveedor` | Quién te vende las cosas que compras. | El jefe de la empresa cliente |
| 9 | `comprador` | Quién te compra a ti (a quien envías producto). | El jefe de la empresa cliente |
| 10 | `camion` | Los camiones de la empresa. | El jefe de la empresa cliente |
| 11 | `planta` | A dónde puede ir el producto (otra fábrica o sitio). | El jefe de la empresa cliente |
| 12 | `cliente` | Dueño de una marca o línea de productos. | El jefe de la empresa cliente |
| 13 | `producto` | Cada cosa que guardas, compras o vendes (con su código). | El jefe de la empresa cliente |
| 14 | `usuario` | Cada persona que usa el sistema. | El jefe de la empresa cliente |
| 15 | `solicitud_compra` | Borrador de "quiero comprar esto". | La persona que hace pedidos y papeles en la oficina |
| 16 | `orden_compra` | Pedido de compra ya en serio. | La persona que hace pedidos y papeles en la oficina |
| 17 | `linea_orden_compra` | Cada línea del ticket: producto y cantidad. | La persona que hace pedidos y papeles en la oficina |
| 18 | `warehouse_state` | Foto en vivo de cómo está la bodega ahora mismo. | El programa solo, sin persona |
| 19 | `slot` | Un hueco o estante en la bodega. | El programa solo, sin persona |
| 20 | `caja` | Una caja con producto adentro. | La gente que trabaja dentro del almacén o en el camión |
| 21 | `orden_trabajo` | Orden de mover una caja de un sitio a otro. | La gente que trabaja dentro del almacén o en el camión |
| 22 | `alerta` | Aviso de que algo va mal. | La gente que trabaja dentro del almacén o en el camión |
| 23 | `historial_movimiento` | Diario de todo lo que se movió. | El programa solo, sin persona |
| 24 | `solicitud_procesamiento` | Pedido de transformar un producto en otro. | La persona que hace pedidos y papeles en la oficina |
| 25 | `registro_merma` | Lo que se perdió o no salió bien. | La gente que trabaja dentro del almacén o en el camión |
| 26 | `orden_venta` | Pedido de venta: quiero mandar esto a alguien. | La persona que hace pedidos y papeles en la oficina |
| 27 | `linea_orden_venta` | Cada producto de esa venta. | La persona que hace pedidos y papeles en la oficina |
| 28 | `viaje_transporte` | El viaje del camión con la mercancía. | La gente que trabaja dentro del almacén o en el camión |
| 29 | `evidencia_entrega` | Prueba de que llegó (foto, firma). | transportista |
| 30 | `contador_documento` | Contador para números automáticos (viaje 001, 002…). | El programa solo, sin persona |
| 31 | `auditoria` | Cuaderno de "quién hizo qué y cuándo". | El programa solo, sin persona |

---

## Alineación con Decisiones V2.0 (PDF)

Documento: **Bodega de Frío V2.0 — Decisiones de diseño** (`BodegaFrio_V2_Decisiones.pdf`).

Pilares del PDF: (1) BD jerárquica + modelo dual, (2) módulos por rol, (3) arquitectura front/back/Supabase.

### Requisitos → tablas

| Req | En el PDF | Tablas ER |
| --- | --- | --- |
| R1 | Jerarquía empresa → tenant → bodega con RLS por codigo_cuenta. | `empresa`, `cuenta` |
| R2 | Varias bodegas por tenant; el PDF dice que TI las crea; el ER añade solicitud del admin. | `bodega`, `asignacion_bodega`, `solicitud_alta_bodega` |
| R3 | OC → caja → movimientos → OV → TV → evidencia. | `orden_compra`, `caja`, `historial_movimiento`, `orden_venta`, `viaje_transporte`, `evidencia_entrega` |
| R4 | warehouse_state (jsonb) + Realtime; locking en escritura vía NestJS. | `estado_bodega`, `slot`, `orden_trabajo`, `tarea_cola` |
| R5 | Nueve perfiles; configurador = usuario con rol configurador (sin tabla aparte). | `rol`, `usuario`, `asignacion_bodega` |

### Onboarding

- **PDF (Fase A):** configurador → empresa → tenant → bodegas.
- **ER (refinamiento):** entre tenant y bodega, `solicitud_alta_bodega` registra la petición del administrador de cuenta; TI materializa `bodega` y el admin se asigna en `asignacion_bodega`.
- **Vista ER:** «PDF · Fase A» y «Onboarding completo» muestran el mismo flujo con numeración 0–14.

---

## Preguntas que suele hacer un niño (y la respuesta)

**¿Por qué tantas tablas?**
Porque si metes todo en una sola hoja se hace un lío. Es como tener un cuaderno de tareas, otro de amigos y otro de compras — no uno solo para todo.

**¿Qué es el configurador?**
No es un robot. Es la persona del equipo que construye el programa y crea las empresas en el sistema.

**¿La bodega es un edificio de verdad?**
En la vida real sí. En el programa es una fila que dice "esta nevera existe" y dónde está.

**¿Para qué sirve el mapa en vivo?**
Para ver al instante dónde está cada caja, como un GPS del almacén.

## Checklist — ¿lo entendieron?

- [ ] ¿Saben quién crea la empresa y quién solo la usa?
- [ ] ¿Entienden pedir bodega → crear bodega → apuntarse a la bodega?
- [ ] ¿Ven la diferencia entre empresa y cuenta de trabajo?
- [ ] ¿Sabían que comprar y vender son pasos distintos con sus propias hojas?

---

*32 piezas del rompecabezas · modelo 3NF · Dev Hub Bodega de Frío*
