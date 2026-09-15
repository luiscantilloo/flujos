# Polaria WMS 2.5.34 — mapa actual del producto (sep 2026)

Documento de **captura** para que no se pierda lo que ya está en código: web, API, BD, Mateo Support y el runner de UI. Complementa (no reemplaza) la documentación V1/V2 de Bodega de frío.

> **Dónde vive en este Dev Hub:** Documentación → *Novedades sep 2026* (2.5.34) y *Novedades 29 ago 2026* (2.4.3). Referencia → *Mateo Support*. Estructura de proyecto → árboles web/API. Modelo de datos → tablas extra. Manual → ventas / operador / admin cuenta / configurador / FAQ / glosario.

## Cambios sep 2026 (2.5.34)

Índice narrativo: [Novedades sep 2026](/documentacion/novedades-2026-09-15).

| Área | Qué quedó |
| --- | --- |
| Pedido | **Nueva venta**: Primera vez / Venta nueva / Tengo el mensaje o archivos (IA). **Validar y enviar** crea y emite. |
| Editar OV | Estados borrador, confirmada, en_preparacion. RLS **080**. |
| Captura surtido | PDF con QR → `/captura-orden/:id` (público) → foto cámara/galería → PDF actualizado. Tabla **074**. |
| Precios | **Lista de precio** (admin). Equivalencia = alias + precio opcional (**073**). |
| Configurador | Impresoras (**076–077**). Bodega default de cuenta (**075**). |
| Usuarios | PATCH perfil + restablecer password (Nest). |
| Reportes bodega | `fechaDesde` / `fechaHasta`. |
| Líneas OV | `cajas`, `presentacion` (**079**). Emitir Nest **idempotente**. |
| PostgREST | Expone `emp_*` (**078**). |

## Cambios 29 ago 2026 (2.4.3)

Índice narrativo: [Novedades 29 ago 2026](/documentacion/novedades-2026-08-29).

| Área | Qué quedó |
| --- | --- |
| Sesión | Tope **12 h** desde el login (`SESSION_MAX_AGE_MS`). Al vencer o al logout, redirige a `/login`. |
| Mateo | Se cierra con Polaria (reset de token + unmount). JWT n8n ~300 s se **renueva** mientras hay sesión WMS; no es un logout a los 5 min. Enlaces subrayados (otra pestaña). Nombre de PDF en “ruta” es descarga si el archivo existe. |
| Creación (admin cuenta) | Botón **Editar** en Proveedores, Clientes, Compradores, Camiones y Plantas (no en Asignación ni catálogo de productos). |
| Teléfonos | Display internacional (`+57 …`) aunque el valor guardado venga sin `+`. |
| Alias | Botón **Crear Alias** junto a Nuevo comprador. Tabla `comprador_producto_alias` (migración **067**, RLS, clone `emp_*`). Flujo: comprador → producto (código/nombre) → modal de alias. Clic en la fila del comprador abre ficha + lista de alias. |

---

## 1. Repositorios (fuente de verdad)

| Repo | Rol | Stack |
| --- | --- | --- |
| `polaria-wms-web` | App operativa (SaaS) | Next.js 16 App Router, módulos por dominio, supabase-js + Realtime |
| `polaria-wms-api` | Escrituras y orquestación | NestJS 11, Prisma 7, Swagger `/api/docs` |
| `polaria-wms-db` | Esquema PostgreSQL / Supabase | Migraciones `001`–`080`, RLS, schema por empresa |
| `Widget-react` | **Mateo Support** (chat embebido) | React 19, Vite, Shadow DOM, IIFE `mateo-widget.js` |
| `flujo` (este hub) | Documentación viva | React + Vite, diagramas, manuales, ER |
| `polaria-ui-runner` | Simulaciones UI (no es producto) | Playwright + Node; limpia datos demo |

Nombres legacy: `frio-frontend` → web, `frio-backend` → API.

---

## 2. Frontend — `polaria-wms-web`

App Router real (grupos `(shell)/dashboard`, `(shell)/configurador`, `(shell)/platform`).

### 2.1 Rutas de operación (cuenta / bodega)

| Ruta | Módulo | Quién |
| --- | --- | --- |
| `/dashboard` | `dashboard/` | Home por rol |
| `/dashboard/compras` | `purchases/` | SOL / OC operador cuenta |
| `/dashboard/ingreso` | `purchases/ingreso` | Recepción |
| `/dashboard/ventas` y `/dashboard/ventas/ordenes` | `sales/` | OV: **Nueva venta**, IA leer pedido, editar, imprimir/QR, PDF surtido |
| `/captura-orden/:id` | `app/captura-orden/` | **Pública** — foto hoja surtida (cámara/galería) |
| `/dashboard/procesamiento` | `processing/` | Primario → secundario |
| `/dashboard/bodega-interna` y `/dashboard/bodega-interna/procesamiento` | operación cuenta | Hub bodega interna |
| `/dashboard/bodega-externa` y `/dashboard/bodega-externa/integracion` | `account-integration/` | Bodega externa |
| `/dashboard/mapa` | `inventory/mapa` | Mapa + Realtime |
| `/dashboard/transporte` | `transport/` | Paquetes y entregas |
| `/dashboard/estado-bodega` | `warehouses/estado-bodega` | Grid de slots |
| `/dashboard/reporteria` | reportería inventario (MIT embed) | Admin cuenta |
| `/dashboard/reportes-bodega` | reportes (ruta compartida / deprecada en algunos roles) | |
| `/dashboard/jefe-bodega/estado-bodega` | `jefe-bodega/` | Ingreso, salida, transferencia |
| `/dashboard/jefe-bodega/reportes-bodega` | `warehouses/bodega-reportes` | Reportes jefe |
| `/dashboard/administrador-bodega/*` | `administrador-bodega/` | Estado + reportes |
| `/dashboard/custodio/*` | `custodio/` | Ingreso, OC, OV en piso |
| `/dashboard/operario/operacion` | `operario/` | Cola de tareas |
| `/dashboard/procesador/operacion` | `procesador/` | Cierre merma |
| `/dashboard/administracion/catalogo` | `admin-panel/` | Catálogo |
| `/dashboard/administracion/lista-precio` | `admin-panel/` | Precio vigente (`precio_producto`) |
| `/dashboard/administracion/asignacion-creacion/*` | `admin-panel/` | Usuarios (editar + reset password); **Creación:** proveedores, clientes, compradores (ficha + **Equivalencia**), camiones, plantas |

### 2.2 Configurador (plataforma TI)

`/configurador`, `/configurador/creacion/{empresas,cuentas,bodega-interna,bodega-externa}`, `/configurador/asignacion/usuarios`, `/configurador/asignacion/impresoras`, `/configurador/integracion`.

También existe `/platform` (shell de plataforma).

### 2.3 Auth

- `/login` — prelogin empresa + usuario → password. Sesión WMS: **12 h** (`SESSION_MAX_AGE_MS`); al vencer, logout + Mateo se cierra.
- `/auth/sso` — SSO Mateo (`?code=`)
- `/captura-orden/:id` — **sin sesión**; no rehidrata AuthSessionBootstrap

Contrato (web y Nest coinciden):

| Uso | Ruta |
| --- | --- |
| Prelogin | `POST /auth/prelogin` |
| Login | `POST /auth/login` |
| SSO handoff | `POST /auth/mateo-handoff` |
| SSO exchange | `POST /auth/mateo-exchange` |
| JWT widget n8n | `POST /auth/mateo/widget-token` |
| Perfil | `GET /auth/me` |
| Logout | `POST /auth/logout` |

Header: `x-auth-client` / `X-Auth-Client` (`wms` \| `mateo`). HTTP es case-insensitive.

### 2.4 Route handlers Next (`src/app/api/`)

| Método | Ruta | Propósito |
| --- | --- | --- |
| GET | `/api/ventas/productos-catalogo` | Catálogo venta: stock almacenamiento + **precio de `precio_producto`** (service role) |
| POST | `/api/ventas/leer-pedido` | IA: texto/archivos → prefill del pedido |
| POST | `/api/ventas/imprimir-orden` | PDF tarea almacén con QR |
| POST | `/captura-orden/:id/api` | Lectura IA de la foto surtida (público) |
| POST | `/api/solicitud-compra` | Webhook n8n al crear SOL |
| POST | `/api/pedido-proveedor` | Notificación pedido |
| POST | `/api/evidencia-transporte` | Subida evidencias Cloudinary |
| POST | `/api/operaciones/sync-demora-alertas` | Sync alertas demora |

### 2.5 Módulos `src/modules/` (no perder)

Implementados: `auth`, `configurator`, `admin-panel`, `purchases`, `sales`, `inventory`, `processing`, `transport`, `operations`, `warehouses`, `jefe-bodega`, `custodio`, `operario`, `procesador`, `administrador-bodega`, `dashboard`, `account-integration`, `audit`.

Placeholders / vacíos: `accounts`, `companies` (no confundir con `configurator/empresas`).

**Ventas — canales:**

1. **Crear / editar OV** = Supabase JS (`sales.service.ts`). No hay `POST`/`PATCH /ventas/ordenes` en Nest.
2. **Emitir OV** = `POST /ventas/ordenes/:id/emitir` (reserva stock, OT, tareas). **Idempotente** si ya no es borrador.
3. Precio del picker = `precio_producto` (última `fecha_aplicacion`) o `comprador_producto_alias.precio`. Sin fila → `0`.
4. Lectura IA = `POST /api/ventas/leer-pedido`. Captura surtido = ruta pública `/captura-orden`.

---

## 3. API — `polaria-wms-api`

Prefijos Nest reales (guards: JWT + tenant + roles; escrituras sensibles: `SensitiveWriteGuard`):

| Módulo carpeta | Prefijo HTTP | Estado |
| --- | --- | --- |
| `auth` | `/auth` | prelogin, login, me, logout, mateo-handoff / widget-token / mateo-exchange |
| `configurator` | `/configurador/usuarios`, `/administracion/usuarios` | Alta usuarios |
| `configuracion` | `/configuracion/bodegas`, `/empresas`, `/cuentas` | POST empresas + PATCH |
| `purchases` | `/compras/*` | SOL (`enviar-aprobacion`, `aprobar`, `rechazar`, `cancelar`, `convertir-oc`), OC, recepción |
| `inventory` | `/inventario/warehouse-state`, `/inventario/movimientos` | Lock/unlock, historial |
| `operations` | `/operaciones/*` | OT, tareas, alertas, llamadas, reportes, ping presencia |
| `processing` | `/procesamiento/solicitudes` | Flujo merma + OT post-cierre |
| `sales` | `/ventas/ordenes` | GET listar + POST `:id/emitir` (idempotente; no crea/edita OV) |
| `transport` | `/transporte` | `paquetes-despacho`, `entregas` |
| `integration` | `/integracion/solicitudes` + bandeja configurador | Bodega externa |
| `mateo-widget` | `/mateo/conversaciones` | CRUD historial widget (Bearer **sesión WMS**) |

Stubs README (sin producto): `accounts`, `audit` vacío, `files`, `health`, `notifications`, `settings`, `users`, `warehouses`.

Prisma: **43 modelos** (`schema.prisma`: 40 núcleo + `SesionOperativa` + `WidgetConversacion` + `WidgetMensaje`). `precio_producto` está en Postgres; **aún no** tiene modelo Prisma.

Widget en Prisma: `@@map("widget_conversacion")` **sin** `@@schema("mateo_support")`. Las tablas físicas están en `mateo_support`; la migración **064** crea vistas `public.widget_*` para Prisma/PostgREST.

---

## 4. Base de datos — `polaria-wms-db`

### 4.1 Migraciones

Serie `001`–`080` (también en `supabase/migrations/`). Hitos recientes:

| N° | Qué |
| --- | --- |
| 043 | `metadatos_catalogo` en producto (título, SEO, precio de catálogo — **no** es el precio de venta operativo) |
| 051 / 055 / 057 | Widget Mateo: tablas `widget_conversacion` / `widget_mensaje` → schema `mateo_support` |
| 053 | `security_event` (append-only, solo service role) |
| 054 | `usuario.telefono` |
| 056–061 | Embeds de reportería (`cuenta_reporte_embed`, MIT inventario) |
| 062 | **Schema por empresa** `emp_*` + catálogo `wms_tenant_tables` |
| 063 | Nombre de schema híbrido razón+código |
| 064 | Vistas `public.widget_*` + reload PostgREST |
| 065 | FK clone unqualified → schema tenant |
| 066 | **`precio_producto`** + RLS SELECT + índice |
| 067 | **`comprador_producto_alias`**: alias por par comprador+producto; RLS catálogo |
| 068–069 | Ficha de alta de comprador (`metadatos_alta` + columnas planas) |
| 070 | Campos planos de captura en `orden_venta` |
| 071–072 | INSERT `precio_producto` (admin/operador) |
| 073 | `comprador_producto_alias.precio` (precio especial) |
| 074 | Tabla **`orden_venta_surtido_captura`** (foto + JSON IA, 1:1 con OV) |
| 075 | `cuenta.id_bodega_default` |
| 076–077 | Tabla **`impresora`** + `id_usuario` |
| 078 | PostgREST expone schemas `emp_*` |
| 079 | `orden_venta_linea.cajas`, `presentacion` |
| 080 | RLS UPDATE/DELETE para editar OV (operador/admin, estados editables) |

### 4.2 `precio_producto` (fuente de precio de venta)

| Columna | Tipo | Notas |
| --- | --- | --- |
| `id_precio` | uuid PK | |
| `codigo_cuenta` | varchar | FK cuenta |
| `id_producto` | uuid | FK producto ON DELETE CASCADE |
| `precio` | numeric(12,4) | Precio / kg |
| `moneda` | varchar(3) | default `MXN` |
| `fecha_aplicacion` | timestamptz | Vigente = **más reciente** |

RLS: `precio_producto_select_scope` → `auth_wms_puede_ver_cuenta(codigo_cuenta)`.  
Incluida en `wms_tenant_tables` para clonar a `emp_*`.

### 4.3 Schema por empresa (062)

- `empresa.schema_name` → `emp_<slug>` o NULL (datos legacy en `public`).
- Plataforma (`empresa`, `usuario`, `rol`) permanece en `public`.
- Tablas de negocio se clonan al schema del tenant. La web usa `wrapClientForTenant` / `schema()`.
- El catálogo de venta **admin** (route handler) lee `public` con service role — válido para cuentas con `schema_name` NULL (p. ej. demos actuales).

### 4.4 Mateo Support (schema `mateo_support`)

Tablas físicas: `widget_conversacion`, `widget_mensaje`.  
Vistas públicas (064): `public.widget_conversacion`, `public.widget_mensaje`.  
RLS por usuario + `codigo_cuenta`. Auth conversaciones = Bearer WMS, **no** el JWT de n8n.

### 4.5 Otras tablas fuera del manifiesto Prisma de 40

| Tabla | Migración | Notas |
| --- | --- | --- |
| `sesion_operativa` | operativa | Prisma `SesionOperativa`. Heartbeat `POST /operaciones/presencia/ping` |
| `cuenta_reporte_embed` | 056 | URL Looker/MIT por cuenta; solo service role |
| `security_event` | 053 | Eventos de seguridad append-only |
| `wms_tenant_tables` | 062 | Catálogo de tablas a clonar a `emp_*` |
| `precio_producto` | 066 | Precio venta; sin Prisma |
| `comprador_producto_alias` | 067 / 073 | Equivalencia + precio especial; UNIQUE (id_comprador, id_producto); sin Prisma |
| `orden_venta_surtido_captura` | 074 | Foto + payload IA; 1:1 con OV; sin Prisma |
| `impresora` | 076 / 077 | Impresoras carta (IPP/QZ); CRUD web, no Nest |

---

## 5. Mateo Support — `Widget-react`

Asistente embebido en el shell autenticado de Polaria WMS. Docs de origen: `docs/ARQUITECTURA.md`, `docs/EMBED-POLARIA.md`, `docs/SEGURIDAD.md`, ADRs 0001–0006.

### Tokens (no mezclar)

| Uso | Token | Endpoint Nest |
| --- | --- | --- |
| Hablar con n8n (chat) | JWT widget ~300s | `POST /auth/mateo/widget-token` |
| Historial CRUD | Bearer sesión WMS | `/mateo/conversaciones` |
| SSO app externa | código 60s | Nest: `POST /auth/mateo-handoff` → `POST /auth/mateo-exchange` (el front hoy llama `mateo-handoff` / `mateo-exchange`) |

### Arquitectura UI

- Shadow DOM (aisla Tailwind del host). SweetAlert2 vive en `document.body` (ADR).
- IIFE `mateo-widget.js` + `window.MateoWidget`.
- Host: `MateoWidgetHost` en web; `configureTokenFetcher` + `conversationApiBase`.
- Adjuntos: Cloudinary unsigned. Conversación: n8n webhook. Body plano: `message_text`, `message_type`, **`conversation_id` UUID**, **`phone_number`** y claims. No enviar ids temporales `conv_*`.
- i18n es/en propio (sin librería).

Pendiente: CDN estable del bundle en producción. POL-71 (JWT en n8n) está desplegado.

**Sesión (29 ago 2026):** el JWT de n8n (~300 s) no cierra a Mateo. La sesión de Polaria (12 h) sí: al vencer o al logout se resetea el tokenFetcher y se desmonta el widget. Los enlaces del chat van subrayados y abren otra pestaña; un nombre de PDF en “ruta” es descarga cuando hay URL válida.

---

## 6. Runner UI — `polaria-ui-runner`

Herramienta **interna** (Playwright) para simular Andino / Mar Azul / Aves. No es un producto de cliente. Limpia solo cuentas demo (`cleanup-sim-data.mjs`), incluida `precio_producto`. No documentar como módulo WMS.

---

## 7. Qué no debe perderse (checklist)

- [x] Precio de venta operativo ≠ precio de catálogo (`metadatos_catalogo`)
- [x] Schema `emp_*` vs `public` legacy
- [x] Dos JWT de Mateo (n8n vs historial)
- [x] Auth: `POST /auth/prelogin`, `/auth/mateo-handoff`, `/auth/mateo/widget-token`, `/auth/mateo-exchange`
- [x] Crear/editar OV = Supabase JS; emitir OV = Nest (idempotente)
- [x] Widget físico en `mateo_support` + vistas `public.widget_*` (064) porque Prisma no declara `@@schema`
- [x] Escritura API (Prisma bypass RLS) vs lectura web (JWT + RLS)
- [x] Mapa Realtime `warehouse_state`
- [x] Roles: configurador, admin/operador cuenta, admin/jefe bodega, custodio, operario, procesador, transportista
- [x] MIT inventario / `cuenta_reporte_embed`
- [x] Integración bodega externa (operador → bandeja configurador)
- [x] `security_event` append-only; runner no es producto
- [x] Sesión WMS 12 h + cierre conjunto de Mateo
- [x] Equivalencia de producto por comprador (`comprador_producto_alias`, 067/073)
- [x] Lista de precio, captura QR surtido (074), editar OV (080), impresoras (076)
- [x] Editar en Creación (proveedores, clientes, compradores, camiones, plantas)
- [x] Teléfonos con prefijo de país en display

---

*Generado para el Dev Hub `flujo` a partir del código de web, API, db y Widget-react (sep 2026).*
