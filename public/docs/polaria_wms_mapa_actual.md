# Polaria WMS — mapa actual del producto (ago 2026)

Documento de **captura** para que no se pierda lo que ya está en código: web, API, BD, Mateo Support y el runner de UI. Complementa (no reemplaza) la documentación V1/V2 de Bodega de frío.

> **Dónde vive en este Dev Hub:** Documentación → *Polaria WMS — mapa actual*. Referencia → *Mateo Support*. Estructura de proyecto → árboles web/API. Modelo de datos → tablas extra. Manual → Ventas / Mateo / glosario.

---

## 1. Repositorios (fuente de verdad)

| Repo | Rol | Stack |
| --- | --- | --- |
| `polaria-wms-web` | App operativa (SaaS) | Next.js 16 App Router, módulos por dominio, supabase-js + Realtime |
| `polaria-wms-api` | Escrituras y orquestación | NestJS 11, Prisma 7, Swagger `/api/docs` |
| `polaria-wms-db` | Esquema PostgreSQL / Supabase | Migraciones `001`–`066`, RLS, schema por empresa |
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
| `/dashboard/ventas` y `/dashboard/ventas/ordenes` | `sales/` | OV; picker usa **precio_producto** |
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
| `/dashboard/administracion/asignacion-creacion/*` | `admin-panel/` | Usuarios, proveedores, clientes, compradores, camiones, plantas, bodegas |

### 2.2 Configurador (plataforma TI)

`/configurador`, `/configurador/creacion/{empresas,cuentas,bodega-interna,bodega-externa}`, `/configurador/asignacion/usuarios`, `/configurador/integracion`.

También existe `/platform` (shell de plataforma).

### 2.3 Auth

- `/login` — prelogin empresa + usuario → password
- `/auth/sso` — SSO Mateo

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
| POST | `/api/solicitud-compra` | Webhook n8n al crear SOL |
| POST | `/api/pedido-proveedor` | Notificación pedido |
| POST | `/api/evidencia-transporte` | Subida evidencias Cloudinary |
| POST | `/api/operaciones/sync-demora-alertas` | Sync alertas demora |

### 2.5 Módulos `src/modules/` (no perder)

Implementados: `auth`, `configurator`, `admin-panel`, `purchases`, `sales`, `inventory`, `processing`, `transport`, `operations`, `warehouses`, `jefe-bodega`, `custodio`, `operario`, `procesador`, `administrador-bodega`, `dashboard`, `account-integration`, `audit`.

Placeholders / vacíos: `accounts`, `companies` (no confundir con `configurator/empresas`).

**Ventas — dos canales:**

1. **Crear OV borrador** = insert directo Supabase (`createOrdenVenta` en `sales.service.ts`). No hay `POST /ventas/ordenes` en Nest.
2. **Emitir OV** = `POST /ventas/ordenes/:id/emitir` (reserva stock, OT, tareas).
3. Precio del picker = tabla `precio_producto` (última `fecha_aplicacion`), **no** `metadatos_catalogo.precio`. Sin fila → `0`.

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
| `sales` | `/ventas/ordenes` | GET listar + POST `:id/emitir` (no crea OV) |
| `transport` | `/transporte` | `paquetes-despacho`, `entregas` |
| `integration` | `/integracion/solicitudes` + bandeja configurador | Bodega externa |
| `mateo-widget` | `/mateo/conversaciones` | CRUD historial widget (Bearer **sesión WMS**) |

Stubs README (sin producto): `accounts`, `audit` vacío, `files`, `health`, `notifications`, `settings`, `users`, `warehouses`.

Prisma: **43 modelos** (`schema.prisma`: 40 núcleo + `SesionOperativa` + `WidgetConversacion` + `WidgetMensaje`). `precio_producto` está en Postgres; **aún no** tiene modelo Prisma.

Widget en Prisma: `@@map("widget_conversacion")` **sin** `@@schema("mateo_support")`. Las tablas físicas están en `mateo_support`; la migración **064** crea vistas `public.widget_*` para Prisma/PostgREST.

---

## 4. Base de datos — `polaria-wms-db`

### 4.1 Migraciones

Serie `001`–`066` (también en `supabase/migrations/`). Hitos recientes:

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
- Adjuntos: Cloudinary unsigned. Conversación: n8n webhook.
- i18n es/en propio (sin librería).

Pendiente: validación JWT en n8n (POL-71), CDN estable del bundle en producción.

---

## 6. Runner UI — `polaria-ui-runner`

Herramienta **interna** (Playwright) para simular Andino / Mar Azul / Aves. No es un producto de cliente. Limpia solo cuentas demo (`cleanup-sim-data.mjs`), incluida `precio_producto`. No documentar como módulo WMS.

---

## 7. Qué no debe perderse (checklist)

- [x] Precio de venta operativo ≠ precio de catálogo (`metadatos_catalogo`)
- [x] Schema `emp_*` vs `public` legacy
- [x] Dos JWT de Mateo (n8n vs historial)
- [x] Auth: `POST /auth/prelogin`, `/auth/mateo-handoff`, `/auth/mateo/widget-token`, `/auth/mateo-exchange`
- [x] Crear OV = Supabase JS; emitir OV = Nest
- [x] Widget físico en `mateo_support` + vistas `public.widget_*` (064) porque Prisma no declara `@@schema`
- [x] Escritura API (Prisma bypass RLS) vs lectura web (JWT + RLS)
- [x] Mapa Realtime `warehouse_state`
- [x] Roles: configurador, admin/operador cuenta, admin/jefe bodega, custodio, operario, procesador, transportista
- [x] MIT inventario / `cuenta_reporte_embed`
- [x] Integración bodega externa (operador → bandeja configurador)
- [x] `security_event` append-only; runner no es producto

---

*Generado para el Dev Hub `flujo` a partir del código de web, API, db y Widget-react (ago 2026).*
