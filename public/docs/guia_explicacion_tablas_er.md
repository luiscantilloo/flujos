# Guía para explicar las tablas del sistema — como cuento paso a paso

Esta guía está escrita para que **cualquier persona** entienda el dibujo de tablas (ER),
incluso si tienes **10 años** o nunca viste una base de datos.

Cada **paso** es una pieza del rompecabezas. Léelos del **0 al 31** en orden, como capítulos de un libro.

---

## Antes de empezar (3 ideas fáciles)

1. **Tabla** = una hoja de Excel con muchas filas del mismo tipo (usuarios, bodegas, productos…).
2. **El equipo del programa** (configurador) monta el mundo; **el jefe de la empresa** lo usa.
3. **Empresa** es el nombre grande del cliente; **cuenta** es el salón donde pasa el trabajo cada día.

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

## FASE 0 — Configurador TI (plataforma)

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

**Nombre en el sistema:** Rol WMS

✅ Catálogo de 9 roles WMS (seed). Scope plataforma / cuenta / bodega.

**Conexiones en el dibujo ER:**

Todavía no se conecta con otras tablas en el dibujo.

**Índices (para que el programa vaya rápido):**

- PK (id_rol)

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

**Antes de este paso:** Cliente SaaS.

**Después sigue:** usuario admin.

#### Cuenta esto en voz alta (30–60 segundos)

El equipo del programa crea la empresa. Todos los usuarios de ese cliente llevan ese código cuando entran.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Empresa (cliente SaaS)

✅ Cliente jurídico SaaS. Creada por configurador TI.

**Conexiones en el dibujo ER:**

Todavía no se conecta con otras tablas en el dibujo.

**Datos importantes en la tabla:**

- **codigo_empresa** (es el código único de la fila)

**Índices (para que el programa vaya rápido):**

- PK (codigo_empresa)

</details>

### Paso 3 — usuario — Cada persona que usa el sistema.

**En una frase:** Cada persona que usa el sistema.

**Imagínalo así:**

Como una ficha de jugador con nombre, correo y qué rol tiene.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** id_auth → auth.users.

**Después sigue:** cuenta.

#### Cuenta esto en voz alta (30–60 segundos)

Primero creas al jefe de la empresa. Más tarde el jefe crea a sus ayudantes y a la gente de la bodega.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Usuario

✅ Perfil WMS; id_auth → Supabase auth.users (no tabla en public).

**Conexiones en el dibujo ER:**

- Se relaciona con **rol**: rol
- Se relaciona con **empresa**: empresa
- Se relaciona con **cuenta**: cuenta

**Datos importantes en la tabla:**

- **id_usuario** (es el código único de la fila)
- **rol** (apunta a otra tabla: rol.id_rol)
- **empresa** (apunta a otra tabla: empresa.codigo_empresa)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_usuario)
- UNIQUE (correo)

</details>

---

## FASE 2 — Tenant (cuenta)

**En palabras fáciles:**

Cada empresa puede tener una o más "cuentas de trabajo". Ahí vive el día a día: productos, pedidos, bodegas.

### Paso 4 — cuenta — El "salón de trabajo" donde pasa la operación diaria.

**En una frase:** El "salón de trabajo" donde pasa la operación diaria.

**Imagínalo así:**

La empresa es el colegio; la cuenta es el salón 5B donde guardas tus cosas, listas y tareas — no mezclas con el salón 6A.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** código de la cuenta FK empresa.

**Después sigue:** bodega.

#### Cuenta esto en voz alta (30–60 segundos)

Una empresa puede tener varias cuentas. Productos, compras y ventas van pegados a la cuenta, no solo al nombre de la empresa.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Tenant (cuenta)

✅ Tenant operativo (codigo_cuenta). Scope C en catálogos y documentos.

**Conexiones en el dibujo ER:**

- Se relaciona con **empresa**: empresa

**Datos importantes en la tabla:**

- **codigo_cuenta** (es el código único de la fila)
- **empresa** (apunta a otra tabla: empresa.codigo_empresa)

**Índices (para que el programa vaya rápido):**

- PK (codigo_cuenta)

</details>

---

## FASE 3 — Bodegas e integración

**En palabras fáciles:**

El jefe pide una bodega con nombre; el equipo del programa la construye en el sistema; el jefe dice "yo trabajo en esa bodega".

### Paso 5 — solicitud_alta_bodega — El jefe pide: "quiero una bodega con este nombre".

**En una frase:** El jefe pide: "quiero una bodega con este nombre".

**Imagínalo así:**

Como pedir por formulario una casilla nueva en el estacionamiento.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Admin pide bodega.

**Después sigue:** bodega.

#### Cuenta esto en voz alta (30–60 segundos)

El administrador pide. El equipo del programa lee la petición y después crea la bodega de verdad.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Solicitud alta bodega

✅ Admin cuenta solicita bodega; configurador atiende.

**Conexiones en el dibujo ER:**

- Se relaciona con **empresa**: empresa
- Se relaciona con **cuenta**: cuenta
- Se relaciona con **usuario**: solicitante
- Se relaciona con **usuario**: atendido_por
- Se relaciona con **bodega**: bodega_creada

**Datos importantes en la tabla:**

- **id_solicitud** (es el código único de la fila)
- **empresa** (apunta a otra tabla: empresa.codigo_empresa)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **solicitante** (apunta a otra tabla: usuario.id_usuario)
- **atendido_por** (apunta a otra tabla: usuario.id_usuario)
- **bodega_creada** (apunta a otra tabla: bodega.id_bodega)

**Índices (para que el programa vaya rápido):**

- PK (id_solicitud)

</details>

### Paso 6 — bodega — El almacén frío (de la empresa o afuera).

**En una frase:** El almacén frío (de la empresa o afuera).

**Imagínalo así:**

Una nevera gigante con estantes: adentro guardas cajas de comida.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** POST /configuracion/bodegas.

**Después sigue:** quién trabaja en la bodega.

#### Cuenta esto en voz alta (30–60 segundos)

Solo el equipo del programa la crea en el sistema. Puede ser bodega interna o externa.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Bodega

✅ Bodega interna/externa. Alta vía POST /configuracion/bodegas (API).

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **solicitud_origen**: solicitud_origen
- Se relaciona con **usuario**: creador

**Datos importantes en la tabla:**

- **id_bodega** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **solicitud_origen** (apunta a otra tabla: solicitud_origen.id_solicitud)
- **creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_bodega)

</details>

### Paso 7 — solicitud_integracion — Pedido de conectar bodega externa (Fridem, etc.).

**En una frase:** Pedido de conectar bodega externa (Fridem, etc.).

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Operador → configurador.

**Después sigue:** tarea_cuenta.

#### Cuenta esto en voz alta (30–60 segundos)

Operador → bandeja configurador.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Solicitud integración

✅ Operador solicita integración bodega externa → configurador.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **cliente**: cliente
- Se relaciona con **usuario**: solicitante

**Datos importantes en la tabla:**

- **id_solicitud_integracion** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **cliente** (apunta a otra tabla: cliente.id_cliente)
- **solicitante** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_solicitud_integracion)

</details>

### Paso 8 — tarea_cuenta — Tarea pendiente para el configurador en un tenant.

**En una frase:** Tarea pendiente para el configurador en un tenant.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** Bandeja configurador.

**Después sigue:** catálogos.

#### Cuenta esto en voz alta (30–60 segundos)

Complementa solicitud_integracion.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Tarea cuenta

🟡 Tabla tarea_cuenta · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **cliente**: cliente
- Se relaciona con **usuario**: creador

**Datos importantes en la tabla:**

- **id_tarea_cuenta** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **cliente** (apunta a otra tabla: cliente.id_cliente)
- **creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_tarea_cuenta)

</details>

---

## FASE 4 — Catálogos

**En palabras fáciles:**

El jefe llena sus libretas: quién le vende, quién compra, camiones, productos y ayudantes.

### Paso 9 — proveedor — Quién te vende las cosas que compras.

**En una frase:** Quién te vende las cosas que compras.

**Imagínalo así:**

La tienda donde la mamá compra ingredientes.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Scope C.

**Después sigue:** cliente.

#### Cuenta esto en voz alta (30–60 segundos)

El jefe guarda el nombre de cada proveedor para hacer pedidos después.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Proveedor

✅ Tabla proveedor · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta

**Datos importantes en la tabla:**

- **id_proveedor** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_proveedor)

</details>

### Paso 10 — cliente — Dueño de una marca o línea de productos.

**En una frase:** Dueño de una marca o línea de productos.

**Imagínalo así:**

La marca que pone su nombre en el empaque.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Scope C.

**Después sigue:** producto.

#### Cuenta esto en voz alta (30–60 segundos)

Antes de crear un producto, dices de qué cliente es.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Cliente

✅ Tabla cliente · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta

**Datos importantes en la tabla:**

- **id_cliente** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_cliente)

</details>

### Paso 11 — producto — Cada cosa que guardas, compras o vendes (con su código).

**En una frase:** Cada cosa que guardas, compras o vendes (con su código).

**Imagínalo así:**

Cada ítem del inventario del videojuego.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** SKU por cuenta de trabajo.

**Después sigue:** comprador.

#### Cuenta esto en voz alta (30–60 segundos)

Helado de vainilla, caja de 10 kg, etc. Tiene código y nombre.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Producto

✅ Tabla producto · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **cliente**: cliente
- Se relaciona con **producto_primario**: producto_primario

**Datos importantes en la tabla:**

- **id_producto** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **cliente** (apunta a otra tabla: cliente.id_cliente)
- **producto_primario** (apunta a otra tabla: producto_primario.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_producto)

</details>

### Paso 12 — comprador — Quién te compra a ti (a quien envías producto).

**En una frase:** Quién te compra a ti (a quien envías producto).

**Imagínalo así:**

El vecino que te encarga un pastel.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Scope C.

**Después sigue:** planta.

#### Cuenta esto en voz alta (30–60 segundos)

Cuando vendes, eliges a qué comprador va el envío.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Comprador

✅ Tabla comprador · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta

**Datos importantes en la tabla:**

- **id_comprador** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_comprador)

</details>

### Paso 13 — planta — A dónde puede ir el producto (otra fábrica o sitio).

**En una frase:** A dónde puede ir el producto (otra fábrica o sitio).

**Imagínalo así:**

La dirección de entrega en el mapa.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Destino OV.

**Después sigue:** camion.

#### Cuenta esto en voz alta (30–60 segundos)

Algunas ventas van a una planta especial.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Planta

✅ Tabla planta · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta

**Datos importantes en la tabla:**

- **id_planta** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_planta)

</details>

### Paso 14 — camion — Los camiones de la empresa.

**En una frase:** Los camiones de la empresa.

**Imagínalo así:**

Los carritos de reparto.

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Flota cuenta de trabajo.

**Después sigue:** quién trabaja en la bodega.

#### Cuenta esto en voz alta (30–60 segundos)

Cuando mandas una venta, eliges qué camión lleva la carga.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Camión

✅ Tabla camion · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta

**Datos importantes en la tabla:**

- **id_camion** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_camion)

</details>

---

## FASE 5 — Equipo de bodega

**En palabras fáciles:**

Se elige quién trabaja en cada bodega: custodio, operario, chofer, etc.

### Paso 15 — asignacion_bodega — Quién trabaja en qué bodega y con qué trabajo.

**En una frase:** Quién trabaja en qué bodega y con qué trabajo.

**Imagínalo así:**

La lista del profe: "Pedro es capitan del equipo A, María del equipo B".

**Quién lo usa o lo crea:** El jefe de la empresa cliente

**Antes de este paso:** Roles físicos por bodega.

**Después sigue:** SOL.

#### Cuenta esto en voz alta (30–60 segundos)

El jefe se apunta primero a su bodega. Luego apunta a custodios, operarios y choferes.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Asignación bodega

✅ Tabla asignacion_bodega · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **usuario**: usuario
- Se relaciona con **bodega**: bodega
- Se relaciona con **rol**: rol

**Datos importantes en la tabla:**

- **id_asignacion** (es el código único de la fila)
- **usuario** (apunta a otra tabla: usuario.id_usuario)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **rol** (apunta a otra tabla: rol.id_rol)

**Índices (para que el programa vaya rápido):**

- PK (id_asignacion)

</details>

---

## FASE 6 — Compras SOL / OC / recepción

**En palabras fáciles:**

Llegan los pedidos de compra: primero un borrador (solicitud), luego el pedido firme con lista de cosas.

### Paso 16 — solicitud_compra — Borrador de "quiero comprar esto".

**En una frase:** Borrador de "quiero comprar esto".

**Imagínalo así:**

La lista del súper antes de ir a pagar.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Estados aprobación.

**Después sigue:** solicitud_compra_linea.

#### Cuenta esto en voz alta (30–60 segundos)

Primero la solicitud; si está bien, se convierte en orden de compra.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Solicitud compra (SOL)

✅ Tabla solicitud_compra · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **proveedor**: proveedor
- Se relaciona con **orden_compra**: orden_compra
- Se relaciona con **usuario**: solicitante

**Datos importantes en la tabla:**

- **id_solicitud_compra** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **proveedor** (apunta a otra tabla: proveedor.id_proveedor)
- **orden_compra** (apunta a otra tabla: orden_compra.id_orden_compra)
- **solicitante** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_solicitud_compra)

</details>

### Paso 17 — solicitud_compra_linea — Cada producto del borrador de compra (SOL).

**En una frase:** Cada producto del borrador de compra (SOL).

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Detalle SOL.

**Después sigue:** orden_compra.

#### Cuenta esto en voz alta (30–60 segundos)

Detalle de la solicitud antes de convertirla en OC.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Línea SOL

✅ Tabla solicitud_compra_linea · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **solicitud_compra**: solicitud_compra
- Se relaciona con **producto**: producto

**Datos importantes en la tabla:**

- **id_linea_solicitud_compra** (es el código único de la fila)
- **solicitud_compra** (apunta a otra tabla: solicitud_compra.id_solicitud_compra)
- **producto** (apunta a otra tabla: producto.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_linea_solicitud_compra)

</details>

### Paso 18 — orden_compra — Pedido de compra ya en serio.

**En una frase:** Pedido de compra ya en serio.

**Imagínalo así:**

El ticket de compra con fecha y proveedor.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** emitida / recepción.

**Después sigue:** líneas del pedido de compra.

#### Cuenta esto en voz alta (30–60 segundos)

Dice qué bodega recibirá las cajas y de qué proveedor vienen.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Orden compra (OC)

✅ Tabla orden_compra · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **proveedor**: proveedor
- Se relaciona con **solicitud_compra**: solicitud_compra
- Se relaciona con **usuario**: creador

**Datos importantes en la tabla:**

- **id_orden_compra** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **proveedor** (apunta a otra tabla: proveedor.id_proveedor)
- **solicitud_compra** (apunta a otra tabla: solicitud_compra.id_solicitud_compra)
- **creador** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_compra)

</details>

### Paso 19 — orden_compra_linea — Cada línea del ticket: producto y cantidad.

**En una frase:** Cada línea del ticket: producto y cantidad.

**Imagínalo así:**

En el ticket: 3 leches, 2 quesos — cada línea es una fila.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** cantidad_recibida.

**Después sigue:** recepcion_compra.

#### Cuenta esto en voz alta (30–60 segundos)

Sin líneas no sabes cuántas cajas esperar.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Línea OC

✅ Tabla orden_compra_linea · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **orden_compra**: orden_compra
- Se relaciona con **producto**: producto

**Datos importantes en la tabla:**

- **id_linea_orden_compra** (es el código único de la fila)
- **orden_compra** (apunta a otra tabla: orden_compra.id_orden_compra)
- **producto** (apunta a otra tabla: producto.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_linea_orden_compra)

</details>

### Paso 20 — recepcion_compra — Acta de lo que llegó contra la orden de compra.

**En una frase:** Acta de lo que llegó contra la orden de compra.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** 🟡 Schema listo.

**Después sigue:** recepcion_compra_linea.

#### Cuenta esto en voz alta (30–60 segundos)

🟡 Schema listo; API recepción en roadmap.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Recepción compra

🟡 Tabla recepcion_compra · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **orden_compra**: orden_compra
- Se relaciona con **usuario**: usuario_cierre

**Datos importantes en la tabla:**

- **id_recepcion** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **orden_compra** (apunta a otra tabla: orden_compra.id_orden_compra)
- **usuario_cierre** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_recepcion)

</details>

### Paso 21 — recepcion_compra_linea — Línea recepción

**En una frase:** Línea recepción

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Conciliación OC.

**Después sigue:** layout bodega.

#### Cuenta esto en voz alta (30–60 segundos)

Conciliación OC.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Línea recepción

🟡 Tabla recepcion_compra_linea · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **recepcion_compra**: recepcion
- Se relaciona con **orden_compra_linea**: linea_orden_compra
- Se relaciona con **producto**: producto

**Datos importantes en la tabla:**

- **id_linea_recepcion** (es el código único de la fila)
- **recepcion** (apunta a otra tabla: recepcion_compra.id_recepcion)
- **linea_orden_compra** (apunta a otra tabla: orden_compra_linea.id_linea_orden_compra)
- **producto** (apunta a otra tabla: producto.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_linea_recepcion)

</details>

---

## FASE 7 — Layout e inventario

**En palabras fáciles:**

Dentro de la bodega se ve en vivo dónde está cada caja; también queda un diario de movimientos.

### Paso 22 — tipo_ubicacion — Tipos de hueco: recepción, picking, almacén.

**En una frase:** Tipos de hueco: recepción, picking, almacén.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** bootstrap-layout.

**Después sigue:** zona.

#### Cuenta esto en voz alta (30–60 segundos)

Se crean con bootstrap-layout de bodega interna.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Tipo ubicación

🟡 Tabla tipo_ubicacion · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega

**Datos importantes en la tabla:**

- **id_tipo_ubicacion** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)

**Índices (para que el programa vaya rápido):**

- PK (id_tipo_ubicacion)

</details>

### Paso 23 — zona — Zona física dentro de la bodega.

**En una frase:** Zona física dentro de la bodega.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** Agrupa ubicaciones.

**Después sigue:** ubicacion.

#### Cuenta esto en voz alta (30–60 segundos)

Agrupa ubicaciones (slots).

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Zona

🟡 Tabla zona · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega

**Datos importantes en la tabla:**

- **id_zona** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)

**Índices (para que el programa vaya rápido):**

- PK (id_zona)

</details>

### Paso 24 — ubicacion — Un hueco o estante (slot).

**En una frase:** Un hueco o estante (slot).

**Imagínalo así:**

Cada casillero del locker.

**Quién lo usa o lo crea:** El equipo que arregla y crea el programa (como los desarrolladores)

**Antes de este paso:** estado_slot en fila.

**Después sigue:** lote.

#### Cuenta esto en voz alta (30–60 segundos)

estado_slot: libre, ocupado, reservado.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Ubicación (slot)

🟡 Tabla ubicacion · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **zona**: zona
- Se relaciona con **tipo_ubicacion**: tipo_ubicacion

**Datos importantes en la tabla:**

- **id_ubicacion** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **zona** (apunta a otra tabla: zona.id_zona)
- **tipo_ubicacion** (apunta a otra tabla: tipo_ubicacion.id_tipo_ubicacion)

**Índices (para que el programa vaya rápido):**

- PK (id_ubicacion)

</details>

### Paso 25 — lote — Lote trazable de producto.

**En una frase:** Lote trazable de producto.

**Imagínalo así:**

Etiqueta con fecha de vencimiento.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Trazabilidad FEFO.

**Después sigue:** mapa en vivo de la bodega.

#### Cuenta esto en voz alta (30–60 segundos)

FEFO y trazabilidad.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Lote

🟡 Tabla lote · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **producto**: producto
- Se relaciona con **cliente**: cliente

**Datos importantes en la tabla:**

- **id_lote** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **producto** (apunta a otra tabla: producto.id_producto)
- **cliente** (apunta a otra tabla: cliente.id_cliente)

**Índices (para que el programa vaya rápido):**

- PK (id_lote)

</details>

### Paso 26 — warehouse_state — Stock en vivo por ubicación y producto.

**En una frase:** Stock en vivo por ubicación y producto.

**Imagínalo así:**

El mapa del nivel que se actualiza al instante.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** Escritura solo API.

**Después sigue:** movimiento_inventario.

#### Cuenta esto en voz alta (30–60 segundos)

Escritura solo vía API (Prisma). Realtime en web.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Inventario en vivo (warehouse_state)

🟡 Stock en vivo por ubicación+producto+lote. Escritura solo API.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **ubicacion**: ubicacion
- Se relaciona con **producto**: producto
- Se relaciona con **lote**: lote
- Se relaciona con **usuario**: usuario_lock

**Datos importantes en la tabla:**

- **id_warehouse_state** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **ubicacion** (apunta a otra tabla: ubicacion.id_ubicacion)
- **producto** (apunta a otra tabla: producto.id_producto)
- **lote** (apunta a otra tabla: lote.id_lote)

**Índices (para que el programa vaya rápido):**

- PK (id_warehouse_state)

</details>

### Paso 27 — movimiento_inventario — Diario append-only de movimientos.

**En una frase:** Diario append-only de movimientos.

**Imagínalo así:**

Cuaderno del profe con cada cambio.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** Append-only audit.

**Después sigue:** orden_trabajo.

#### Cuenta esto en voz alta (30–60 segundos)

Reemplaza historial_movimiento legacy.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Movimiento inventario

🟡 Historial append-only. Escritura solo API (Prisma bypass RLS).

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **ubicacion_origen**: ubicacion_origen
- Se relaciona con **ubicacion_destino**: ubicacion_destino
- Se relaciona con **producto**: producto
- Se relaciona con **lote**: lote
- Se relaciona con **usuario**: usuario

**Datos importantes en la tabla:**

- **id_movimiento_inventario** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **ubicacion_origen** (apunta a otra tabla: ubicacion_origen.id_ubicacion)
- **ubicacion_destino** (apunta a otra tabla: ubicacion_destino.id_ubicacion)
- **producto** (apunta a otra tabla: producto.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_movimiento_inventario)

</details>

---

## FASE 8 — Cola operativa y procesamiento

**En palabras fáciles:**

A veces un producto se transforma en otro; si algo se pierde, se anota la merma.

### Paso 28 — orden_trabajo — Orden de mover una caja de un sitio a otro.

**En una frase:** Orden de mover una caja de un sitio a otro.

**Imagínalo así:**

Misión del juego: llevar el cofre del punto A al B.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Cola mapa.

**Después sigue:** orden_trabajo_linea.

#### Cuenta esto en voz alta (30–60 segundos)

Un operario la hace; el jefe puede crearla.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Orden trabajo

🟡 Tabla orden_trabajo · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **usuario**: asignado
- Se relaciona con **usuario**: solicitante
- Se relaciona con **lote**: lote
- Se relaciona con **ubicacion_origen**: ubicacion_origen
- Se relaciona con **ubicacion_destino**: ubicacion_destino
- Se relaciona con **solicitud_procesamiento**: solicitud_procesamiento

**Datos importantes en la tabla:**

- **id_orden_trabajo** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **asignado** (apunta a otra tabla: usuario.id_usuario)
- **solicitante** (apunta a otra tabla: usuario.id_usuario)
- **lote** (apunta a otra tabla: lote.id_lote)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_trabajo)

</details>

### Paso 29 — orden_trabajo_linea — Línea OT

**En una frase:** Línea OT

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Entrada/salida OT.

**Después sigue:** alerta_operativa.

#### Cuenta esto en voz alta (30–60 segundos)

Entrada/salida OT.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Línea OT

🟡 Tabla orden_trabajo_linea · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **orden_trabajo**: orden_trabajo
- Se relaciona con **producto**: producto
- Se relaciona con **ubicacion**: ubicacion

**Datos importantes en la tabla:**

- **id_linea_orden_trabajo** (es el código único de la fila)
- **orden_trabajo** (apunta a otra tabla: orden_trabajo.id_orden_trabajo)
- **producto** (apunta a otra tabla: producto.id_producto)
- **ubicacion** (apunta a otra tabla: ubicacion.id_ubicacion)

**Índices (para que el programa vaya rápido):**

- PK (id_linea_orden_trabajo)

</details>

### Paso 30 — alerta_operativa — Aviso de que algo va mal.

**En una frase:** Aviso de que algo va mal.

**Imagínalo así:**

Luces rojas en el tablero del carro.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Temperatura / demora.

**Después sigue:** tarea_cola.

#### Cuenta esto en voz alta (30–60 segundos)

Temperatura, demora, OT reportada.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Alerta operativa

🟡 Tabla alerta_operativa · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **ubicacion**: ubicacion
- Se relaciona con **orden_trabajo**: orden_trabajo
- Se relaciona con **usuario**: responsable

**Datos importantes en la tabla:**

- **id_alerta** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **ubicacion** (apunta a otra tabla: ubicacion.id_ubicacion)
- **orden_trabajo** (apunta a otra tabla: orden_trabajo.id_orden_trabajo)
- **responsable** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_alerta)

</details>

### Paso 31 — tarea_cola — Tarea en la cola de trabajo de bodega.

**En una frase:** Tarea en la cola de trabajo de bodega.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Ingreso / movimiento.

**Después sigue:** solicitud_procesamiento.

#### Cuenta esto en voz alta (30–60 segundos)

Ingreso, movimiento, despacho, procesamiento.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Tarea cola

🟡 Tabla tarea_cola · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **usuario**: asignado
- Se relaciona con **orden_trabajo**: orden_trabajo
- Se relaciona con **solicitud_procesamiento**: solicitud_procesamiento

**Datos importantes en la tabla:**

- **id_tarea** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **asignado** (apunta a otra tabla: usuario.id_usuario)
- **orden_trabajo** (apunta a otra tabla: orden_trabajo.id_orden_trabajo)
- **solicitud_procesamiento** (apunta a otra tabla: solicitud_procesamiento.id_solicitud_procesamiento)

**Índices (para que el programa vaya rápido):**

- PK (id_tarea)

</details>

### Paso 32 — solicitud_procesamiento — Pedido de transformar un producto en otro.

**En una frase:** Pedido de transformar un producto en otro.

**Imagínalo así:**

Pedir convertir jugo de naranja en concentrado.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Balance masa.

**Después sigue:** registro_merma.

#### Cuenta esto en voz alta (30–60 segundos)

Entra materia prima; sale otro producto con cantidades.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Solicitud procesamiento

🟡 Tabla solicitud_procesamiento · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **cliente**: cliente
- Se relaciona con **producto_primario**: producto_primario
- Se relaciona con **producto_secundario**: producto_secundario
- Se relaciona con **usuario**: solicitante
- Se relaciona con **operario**: operario
- Se relaciona con **procesador**: procesador

**Datos importantes en la tabla:**

- **id_solicitud_procesamiento** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_solicitud_procesamiento)

</details>

### Paso 33 — registro_merma — Lo que se perdió o no salió bien.

**En una frase:** Lo que se perdió o no salió bien.

**Imagínalo así:**

Si se derramó leche, anotas cuánto se perdió.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Acumulado kg.

**Después sigue:** orden_venta.

#### Cuenta esto en voz alta (30–60 segundos)

Va ligado al procesamiento.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Registro merma

🟡 Tabla registro_merma · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **solicitud_procesamiento**: solicitud_procesamiento
- Se relaciona con **bodega**: bodega
- Se relaciona con **cuenta**: cuenta

**Datos importantes en la tabla:**

- **id_registro** (es el código único de la fila)
- **solicitud_procesamiento** (apunta a otra tabla: solicitud_procesamiento.id_solicitud_procesamiento)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)

**Índices (para que el programa vaya rápido):**

- PK (id_registro)

</details>

---

## FASE 9 — Ventas, transporte y sistema

**En palabras fáciles:**

Se vende, sale el camión y se guarda la prueba de que llegó; al final el sistema cuenta números y apunta quién hizo qué.

### Paso 34 — orden_venta — Pedido de venta: quiero mandar esto a alguien.

**En una frase:** Pedido de venta: quiero mandar esto a alguien.

**Imagínalo así:**

La nota del cliente que pide entrega.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** Estados despacho.

**Después sigue:** líneas de la venta.

#### Cuenta esto en voz alta (30–60 segundos)

Sale de una bodega hacia un comprador.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Orden venta (OV)

🟡 Tabla orden_venta · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **cliente**: cliente
- Se relaciona con **comprador**: comprador
- Se relaciona con **planta**: planta
- Se relaciona con **usuario**: creador
- Se relaciona con **bodega_destino**: bodega_destino

**Datos importantes en la tabla:**

- **id_orden_venta** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **cliente** (apunta a otra tabla: cliente.id_cliente)
- **comprador** (apunta a otra tabla: comprador.id_comprador)
- **planta** (apunta a otra tabla: planta.id_planta)

**Índices (para que el programa vaya rápido):**

- PK (id_orden_venta)

</details>

### Paso 35 — orden_venta_linea — Cada producto de esa venta.

**En una frase:** Cada producto de esa venta.

**Imagínalo así:**

Cada renglón de la nota de venta.

**Quién lo usa o lo crea:** La persona que hace pedidos y papeles en la oficina

**Antes de este paso:** cantidad_despachada.

**Después sigue:** viaje_transporte.

#### Cuenta esto en voz alta (30–60 segundos)

Cantidad y qué producto van en el camión.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Línea OV

🟡 Tabla orden_venta_linea · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **orden_venta**: orden_venta
- Se relaciona con **producto**: producto

**Datos importantes en la tabla:**

- **id_linea_orden_venta** (es el código único de la fila)
- **orden_venta** (apunta a otra tabla: orden_venta.id_orden_venta)
- **producto** (apunta a otra tabla: producto.id_producto)

**Índices (para que el programa vaya rápido):**

- PK (id_linea_orden_venta)

</details>

### Paso 36 — viaje_transporte — El viaje del camión con la mercancía.

**En una frase:** El viaje del camión con la mercancía.

**Imagínalo así:**

El reparto de Amazon con número de seguimiento.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Transportista.

**Después sigue:** guia_envio.

#### Cuenta esto en voz alta (30–60 segundos)

Une la venta, el camión y el chofer.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Viaje transporte

🟡 Tabla viaje_transporte · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **camion**: camion
- Se relaciona con **usuario**: transportista

**Datos importantes en la tabla:**

- **id_viaje** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **camion** (apunta a otra tabla: camion.id_camion)
- **transportista** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_viaje)

</details>

### Paso 37 — guia_envio — Guía que agrupa entregas de un viaje.

**En una frase:** Guía que agrupa entregas de un viaje.

**Quién lo usa o lo crea:** La gente que trabaja dentro del almacén o en el camión

**Antes de este paso:** Agrupa OV.

**Después sigue:** evidencia_transporte.

#### Cuenta esto en voz alta (30–60 segundos)

Un viaje puede tener varias guías / OV.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Guía envío

🟡 Tabla guia_envio · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **viaje_transporte**: viaje
- Se relaciona con **orden_venta**: orden_venta

**Datos importantes en la tabla:**

- **id_guia** (es el código único de la fila)
- **viaje** (apunta a otra tabla: viaje_transporte.id_viaje)
- **orden_venta** (apunta a otra tabla: orden_venta.id_orden_venta)

**Índices (para que el programa vaya rápido):**

- PK (id_guia)

</details>

### Paso 38 — evidencia_transporte — Prueba de entrega (foto, firma Cloudinary).

**En una frase:** Prueba de entrega (foto, firma Cloudinary).

**Imagínalo así:**

La foto que el repartidor manda de la puerta.

**Quién lo usa o lo crea:** transportista

**Antes de este paso:** Foto / firma Cloudinary.

**Después sigue:** contador.

#### Cuenta esto en voz alta (30–60 segundos)

Se guarda al cerrar la guía / viaje.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Evidencia transporte

🟡 Tabla evidencia_transporte · polaria-wms-db / Supabase.

**Conexiones en el dibujo ER:**

- Se relaciona con **guia_envio**: guia
- Se relaciona con **orden_venta_linea**: linea_orden_venta

**Datos importantes en la tabla:**

- **id_evidencia** (es el código único de la fila)
- **guia** (apunta a otra tabla: guia_envio.id_guia)
- **linea_orden_venta** (apunta a otra tabla: orden_venta_linea.id_linea_orden_venta)

**Índices (para que el programa vaya rápido):**

- PK (id_evidencia)

</details>

### Paso 39 — contador — Contador para números automáticos (OC, OV, TV…).

**En una frase:** Contador para números automáticos (OC, OV, TV…).

**Imagínalo así:**

Como el turno en la fila del banco que sube solo.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** Solo API.

**Después sigue:** auditoria_operacion.

#### Cuenta esto en voz alta (30–60 segundos)

Escritura solo API.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Contador documentos

🟡 Numeración OC/OV/TV. Escritura solo API.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega

**Datos importantes en la tabla:**

- **id_contador** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)

**Índices (para que el programa vaya rápido):**

- PK (id_contador)

</details>

### Paso 40 — auditoria_operacion — Cuaderno de "quién hizo qué y cuándo".

**En una frase:** Cuaderno de "quién hizo qué y cuándo".

**Imagínalo así:**

La cámara de seguridad del sistema.

**Quién lo usa o lo crea:** El programa solo, sin persona

**Antes de este paso:** INSERT solo backend.

**Después sigue:** Fin secuencia 40 tablas.

#### Cuenta esto en voz alta (30–60 segundos)

INSERT solo backend.

<details>
<summary>🔧 Detalle técnico (para adultos / programadores)</summary>

**Nombre en el sistema:** Auditoría operación

🟡 Log operativo. INSERT solo backend.

**Conexiones en el dibujo ER:**

- Se relaciona con **cuenta**: cuenta
- Se relaciona con **bodega**: bodega
- Se relaciona con **usuario**: usuario

**Datos importantes en la tabla:**

- **id_auditoria** (es el código único de la fila)
- **cuenta** (apunta a otra tabla: cuenta.codigo_cuenta)
- **bodega** (apunta a otra tabla: bodega.id_bodega)
- **usuario** (apunta a otra tabla: usuario.id_usuario)

**Índices (para que el programa vaya rápido):**

- PK (id_auditoria)

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
| 7 | `solicitud_integracion` | Pedido de conectar bodega externa (Fridem, etc.). | La persona que hace pedidos y papeles en la oficina |
| 8 | `tarea_cuenta` | Tarea pendiente para el configurador en un tenant. | El equipo que arregla y crea el programa (como los desarrolladores) |
| 9 | `proveedor` | Quién te vende las cosas que compras. | El jefe de la empresa cliente |
| 10 | `cliente` | Dueño de una marca o línea de productos. | El jefe de la empresa cliente |
| 11 | `producto` | Cada cosa que guardas, compras o vendes (con su código). | El jefe de la empresa cliente |
| 12 | `comprador` | Quién te compra a ti (a quien envías producto). | El jefe de la empresa cliente |
| 13 | `planta` | A dónde puede ir el producto (otra fábrica o sitio). | El jefe de la empresa cliente |
| 14 | `camion` | Los camiones de la empresa. | El jefe de la empresa cliente |
| 15 | `asignacion_bodega` | Quién trabaja en qué bodega y con qué trabajo. | El jefe de la empresa cliente |
| 16 | `solicitud_compra` | Borrador de "quiero comprar esto". | La persona que hace pedidos y papeles en la oficina |
| 17 | `solicitud_compra_linea` | Cada producto del borrador de compra (SOL). | La persona que hace pedidos y papeles en la oficina |
| 18 | `orden_compra` | Pedido de compra ya en serio. | La persona que hace pedidos y papeles en la oficina |
| 19 | `orden_compra_linea` | Cada línea del ticket: producto y cantidad. | La persona que hace pedidos y papeles en la oficina |
| 20 | `recepcion_compra` | Acta de lo que llegó contra la orden de compra. | La gente que trabaja dentro del almacén o en el camión |
| 21 | `recepcion_compra_linea` | Línea recepción | La gente que trabaja dentro del almacén o en el camión |
| 22 | `tipo_ubicacion` | Tipos de hueco: recepción, picking, almacén. | El equipo que arregla y crea el programa (como los desarrolladores) |
| 23 | `zona` | Zona física dentro de la bodega. | El equipo que arregla y crea el programa (como los desarrolladores) |
| 24 | `ubicacion` | Un hueco o estante (slot). | El equipo que arregla y crea el programa (como los desarrolladores) |
| 25 | `lote` | Lote trazable de producto. | La gente que trabaja dentro del almacén o en el camión |
| 26 | `warehouse_state` | Stock en vivo por ubicación y producto. | El programa solo, sin persona |
| 27 | `movimiento_inventario` | Diario append-only de movimientos. | El programa solo, sin persona |
| 28 | `orden_trabajo` | Orden de mover una caja de un sitio a otro. | La gente que trabaja dentro del almacén o en el camión |
| 29 | `orden_trabajo_linea` | Línea OT | La gente que trabaja dentro del almacén o en el camión |
| 30 | `alerta_operativa` | Aviso de que algo va mal. | La gente que trabaja dentro del almacén o en el camión |
| 31 | `tarea_cola` | Tarea en la cola de trabajo de bodega. | La gente que trabaja dentro del almacén o en el camión |
| 32 | `solicitud_procesamiento` | Pedido de transformar un producto en otro. | La persona que hace pedidos y papeles en la oficina |
| 33 | `registro_merma` | Lo que se perdió o no salió bien. | La gente que trabaja dentro del almacén o en el camión |
| 34 | `orden_venta` | Pedido de venta: quiero mandar esto a alguien. | La persona que hace pedidos y papeles en la oficina |
| 35 | `orden_venta_linea` | Cada producto de esa venta. | La persona que hace pedidos y papeles en la oficina |
| 36 | `viaje_transporte` | El viaje del camión con la mercancía. | La gente que trabaja dentro del almacén o en el camión |
| 37 | `guia_envio` | Guía que agrupa entregas de un viaje. | La gente que trabaja dentro del almacén o en el camión |
| 38 | `evidencia_transporte` | Prueba de entrega (foto, firma Cloudinary). | transportista |
| 39 | `contador` | Contador para números automáticos (OC, OV, TV…). | El programa solo, sin persona |
| 40 | `auditoria_operacion` | Cuaderno de "quién hizo qué y cuándo". | El programa solo, sin persona |

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

*43 piezas del rompecabezas · modelo 3NF · Dev Hub Bodega de Frío*
