# POLARIA WMS

| Meta | Detalle |
| --- | --- |
| Producto | **Polaria WMS 2.5.34** (referencia histórica: Bodega de Frío generación V2) |
| Subtítulo | Documentación Técnica · diseño V2 · producto **2.5.34** |
| Repos | [polaria-wms-web](https://github.com/PolariaTech/polaria-wms-web) · [polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api) · [polaria-wms-db](https://github.com/PolariaTech/polaria-wms-db) |
| Dev Hub | [flujos](https://flujos-nine.vercel.app) — este portal (Vite + React) |
| Stack | Next.js · React · TypeScript · NestJS 11 · Prisma · Supabase |
| Fecha | Sep 2026 |

> **Estado Polaria WMS 2.5.34 — Sep 2026**
> ✅ Implementado en API + web + BD: auth, configuración, compras+recepción, inventario+mapa Realtime, operaciones, procesamiento, ventas (IA, editar, captura QR), transporte, Mateo widget
> ✅ Precio de venta operativo: tabla `precio_producto` + Lista de precio; equivalencias por comprador
> ✅ Schema por empresa `emp_*` (062); PostgREST expone `emp_*` (078); cuentas legacy siguen en `public`
> 🟡 Maduración: observabilidad, FEFO automático completo, Fridem, CDN widget, Prisma de `precio_producto`
> 🔵 Roadmap: API playground, Storybook, métricas centralizadas
>
> **Repos:** [polaria-wms-web](https://github.com/PolariaTech/polaria-wms-web) · [polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api) · [polaria-wms-db](https://github.com/PolariaTech/polaria-wms-db) · [Widget-react](https://github.com/PolariaTech/Widget-react)
>
> **Regla:** el Dev Hub documenta diseño objetivo **y** estado real. Lo no implementado se marca explícitamente. Complemento vivo: [Polaria WMS — mapa actual](/documentacion/polaria-wms-mapa-actual) y [Novedades 2.5.34](/documentacion/novedades-2026-09-15).

---

# BODEGA DE FRÍO (diseño V2 — referencia)

| Meta | Detalle |
| --- | --- |
| Subtítulo | Documentación Técnica · generación V2 · producto **2.5.34** |
| Descripción | Sistema de Operación Multi-Rol · Multi-Cuenta · Multi-Bodega |
| Stack | Next.js  ·  React  ·  TypeScript  ·  Supabase  ·  Cloudinary  ·  n8n |
| Fecha | Mayo 2026 (Word original) · actualizado Ago 2026 |
| Enlaces | Complemento vivo: [mapa actual](/documentacion/polaria-wms-mapa-actual) |

---

## 1. Visión General y Contexto

Bodega de Frío es un sistema web de operación diseñado para gestionar de forma integral el ciclo de vida de mercancía en una bodega fría (frigorífica). La aplicación cubre desde la recepción de insumos hasta el despacho final con evidencia fotográfica, pasando por procesamiento, trazabilidad por slot y reportería avanzada.

#### Principios de Diseño

- Multi-rol: Cada usuario tiene un rol específico que define qué ve y qué puede hacer.
- Multi-cuenta: Un mismo sistema puede servir a múltiples cuentas operativas independientes.
- Multi-bodega: Soporta bodegas internas propias y bodegas externas (como Fridem) con integración en tiempo real.

Trazabilidad completa: Cada caja/lote tiene historial desde su ingreso hasta su despacho o procesamiento. Tiempo real: Estado operativo sincronizado en PostgreSQL (Supabase), visible simultáneamente por todos los usuarios activos.

### 1.1 Empresa y tenant — no son lo mismo

En V2.0 **todo empieza por el configurador** (equipo TI del proveedor SaaS): personas reales con **credenciales** en Supabase Auth. El modelo de datos y el onboarding **no arrancan en la tabla empresa** — arrancan en el **configurador**, que inicia sesión en el panel de plataforma (sin `codigoEmpresa` de cliente) y desde ahí **crea empresas** y **asigna el administrador de cuenta** de cada una.

| Concepto en negocio | En código / base de datos | Identificador |
| --- | --- | --- |
| **Empresa** (cliente jurídico del SaaS) | `empresa` | `codigoEmpresa` / `codigo_empresa` |
| **Tenant** (unidad operativa bajo la empresa) | `cuenta` (tenant_config) | `codeCuenta` / `codigo_cuenta` |
| Ubicación física del tenant | Bodega | `warehouseId` / `id_bodega` |
| Personas que operan | Usuario + rol | `uid` + `id_rol` |

**Regla de oro:** el **tenant** (`codeCuenta`) pertenece a una **empresa** (`codigoEmpresa`). Catálogos, órdenes, inventario y usuarios de cuenta cuelgan del **tenant**, no directamente de la empresa. Una empresa puede tener **varios tenants** (divisiones, marcas, contratos separados).

**Todo empieza por el equipo TI (configurador), que ya tiene credenciales.** TI crea la **empresa** y le asigna un **administrador de cuenta**; después continúan tenant, bodegas y el flujo operativo que ya conoces.

#### Autenticación V2.0 (usuarios de una empresa)

Al ingresar a la app (custodio, operario, admin cuenta, etc.):

1. Se ingresa el **código de empresa** (`codigoEmpresa`) → el sistema verifica que exista y esté activa.
2. Se ingresa el **usuario** (correo o identificador) → se verifica que **pertenezca a esa empresa** (`usuario.codigo_empresa`).
3. Si ambas validaciones son correctas, se pide la **contraseña** (Supabase Auth) y entra con **cualquier rol** que tenga asignado.

El **configurador TI** no sigue ese flujo de empresa cliente: inicia sesión en el panel de plataforma con su correo y contraseña (sin `codigoEmpresa` de cliente).

```text
FASE A — Equipo TI (configurador · plataforma)
────────────────────────────────────────────
0. Iniciar sesión como configurador (credenciales TI · Supabase Auth)

1. Crear EMPRESA (cliente SaaS)
      empresas/{codigoEmpresa}/

2. Crear y asignar ADMINISTRADOR DE CUENTA (responsable del cliente)
      usuarios/{uid}  →  codigo_empresa = codigoEmpresa, rol = administrador_cuenta
      (Supabase Auth + contraseña; pertenece a la empresa para el login V2)

3. Crear TENANT bajo esa empresa
      tenants/{codeCuenta}/config  →  codigo_empresa FK

4. Crear BODEGAS del tenant (infraestructura)
      warehouses/{warehouseId}  →  slots, capacidad, reglas del plano

FASE B — Administrador de cuenta (ya dentro del tenant)
──────────────────────────────────────────────────────
5. Crear operador de cuenta y resto de usuarios de su equipo
6. Catálogos: productos, clientes, proveedores, compradores
7. Camiones, plantas, flota
8. Asignar equipo de bodega (jefe, custodio, operario, procesador, transportista)
9. SOL / OC / OV y operación diaria en las bodegas que levantó TI
```

El **administrador de cuenta no crea la empresa ni las bodegas**; las hereda del onboarding de TI.

#### Qué queda asignado al tenant (`codeCuenta`)

| Dominio | Recursos | Cómo se asocia |
| --- | --- | --- |
| Plataforma | Bodegas del tenant | `bodega.codigo_cuenta` → tenant |
| Usuarios | Admin cuenta, operador cuenta, roles de bodega | `usuario.codigo_empresa` (login) + `codigo_cuenta` (operación); NULL solo configurador TI |
| Catálogos | Productos, clientes, proveedores, compradores, camiones, plantas | FK `codigo_cuenta` |
| Compras / ventas | SOL, OC, OV y líneas | `codigo_cuenta` + bodega |
| Bodega operativa | `warehouse_state` (tabla + Realtime; diseño V2 decía `state/main`) | Por `id_bodega` del tenant |
| Procesamiento / transporte / historial | Igual que antes | Scoped al tenant |

El **administrador de cuenta** opera **dentro del tenant** que le asignó el configurador. La **empresa** agrupa tenants a nivel comercial y de contrato; el **aislamiento operativo** en RLS es por `codeCuenta` (y por bodega cuando aplica).

> **Multi-tenant:** filtrar por `codigo_cuenta` para que un tenant no vea datos de otro. El configurador ve empresas y tenants en el panel de plataforma.

## 2. Qué Cambia de V1.0 a V2.0

| Característica | V1.0 | V2.0 |
| --- | --- | --- |
| Dashboard | 12 posiciones fijas | Dashboard dinámico multi-rol con cola operativa |
| Procesamiento | Lógica básica de transformación. | Balance de Masa Absoluto (Coproducto, Subproducto, Merma, Remanente). |
| Ingreso | Registro manual contra OC. | Conciliación Ciega y validación de temperatura con sensores. |
| Mapa de Bodega | Visualización de slots y ocupación. | Locking en tiempo real (evita duplicidad). FEFO automático en **todas** las salidas: 🔵 pendiente. |
| Transporte | Registro de viaje TV-#### básico. | Salida Cruzada (Validación de peso) y evidencias GPS/Firma obligatorias. |

## 3. Stack Tecnológico

#### Frontend

| Tecnología | Versión | Uso |
| --- | --- | --- |
| Next.js (App Router) | 16.1.6 | Framework principal SSR/CSR |
| React | 19.2.3 | UI components y estado |
| TypeScript | Latest | Tipado estático |
| Tailwind CSS | 4 | Estilos utilitarios |
| Recharts | Latest | Gráficas de reportes |
| html2canvas + jsPDF | Latest | Exportación de reportes a PDF |
| xlsx | Latest | Importación de catálogo |

#### Backend

| Tecnología | Uso |
| --- | --- |
| NestJS (Node.js) | Estructura modular para separar Ingresos, Mapa, Procesamiento y Despacho. |
| TypeScript | Tipado estricto para que los pesos y fechas siempre tengan el formato correcto. |
| Supabase Admin SDK | Permite a NestJS leer/escribir en PostgreSQL (Supabase) con privilegios de administrador (Server-side). |
| Zod / Class-Validator | NestJS recibe el token del Front, lo valida y extrae el accountID y el rol. |
| Swagger (OpenAPI) | Genera automáticamente una página para probar los endpoints (ej. /ingreso, /procesar). |
| Axios / HttpModule | Conexión con los webhooks de n8n para disparar alertas y pedidos. |

#### Base de datos

| Tecnología | Uso |
| --- | --- |
| Cloud PostgreSQL (Supabase) | Almacena el estado actual de los slots, cajas, lotes y viajes en tiempo real. |

- **RLS (Row Level Security):** políticas por `codigo_cuenta` y, en bodega, por `id_bodega` vía asignación.
- **Storage:** firmas y adjuntos de recepción (opcional si no van solo a Cloudinary).
- **Realtime:** canales acotados por bodega; payload de `warehouse_state` acotado por diseño.
- **Notificaciones push (propuesto):** alertas de temperatura a operarios.

```text
Cloudinary (API)
```

Almacenamiento y optimización de las evidencias fotográficas del transporte.

### 3.1 Dev Hub (`flujo`) vs Polaria WMS

| Artefacto | Repositorio | Stack en runtime | Rol |
| --- | --- | --- | --- |
| **Aplicación WMS** | `polaria-wms-web`, `polaria-wms-api`, `polaria-wms-db` | Next.js, NestJS 11, Prisma, Supabase | Operación en bodega (producción) |
| **Dev Hub** | `flujo` (este portal de documentación) | Vite, React 19, React Flow, Mermaid | Diagramas, ER, doc — **no sustituye** al producto |

> **Nombres legacy:** `frio-frontend` → `polaria-wms-web` · `frio-backend` → `polaria-wms-api`

Estructura **real** (ago 2026) — repos `polaria-wms-web` / `polaria-wms-api` / `polaria-wms-db`:

```text
polaria-wms-web/src/
├── app/(auth)/login, auth/sso
├── app/(shell)/configurador/…          # plataforma TI
├── app/(shell)/dashboard/…             # operación por rol
│   ├── compras, ingreso, ventas, procesamiento, mapa, transporte
│   ├── custodio/, operario/, procesador/, jefe-bodega/, administrador-bodega/
│   └── administracion/catalogo + asignacion-creacion
├── app/api/                            # route handlers (n8n, catálogo venta, evidencias)
└── modules/                            # auth, sales, purchases, inventory, mateo host, …
polaria-wms-api/src/modules/
├── auth, configurator, configuracion, purchases, inventory
├── operations, processing, sales, transport, integration, mateo-widget
polaria-wms-db/migrations/              # 001–080 (precio, equivalencias, captura surtido, impresora, emp_*, mateo_support)
Widget-react/                           # IIFE mateo-widget.js (Shadow DOM)
```

Árbol detallado en el Dev Hub: [Estructura del proyecto](/estructura-proyecto).

> Las rutas lógicas tipo `empresas/{codigoEmpresa}/tenants/{codeCuenta}/…` son **modelo mental V2**, no carpetas de archivos. En Postgres: tablas 3NF + schema `emp_*` por empresa (migración 062).

#### Flujo de datos (lectura vs escritura)

```text
LECTURA (tiempo real, cliente)
  Usuario → Next.js → Supabase client (PostgreSQL + Realtime)
  · Suscripción a warehouse_state / cambios por bodega
  · RLS filtra por codigo_cuenta (tenant) y rol

ESCRITURA (validación server-side)
  Usuario → Next.js → NestJS → Supabase Admin SDK
  · OC, SOL, movimientos, saveWarehouseState(), locking
  · StripInterceptor elimina undefined antes de persistir

EXCEPCIONES (secretos)
  Next.js Route Handlers → n8n (pedido proveedor), Cloudinary (evidencias)
```

#### Modelo dual de persistencia

| Capa | Qué es | Uso |
| --- | --- | --- |
| **Tablas 3NF** | `empresa`, `cuenta`, catálogos, SOL/OC/OV, `ubicacion`, `lote`, … | Contratos, reportes, auditoría, integridad referencial |
| **`warehouse_state`** | Fila de stock en vivo por posición (no es un JSON único `state/main`) | Inventario en vivo, Realtime, lock/unlock entre operarios |

Regla de diseño V2 hablaba de un jsonb `state/main`. **En código (ago 2026)** el mapa vive en la tabla `warehouse_state` (3NF + Realtime). `metadatos_catalogo` en producto es JSON de catálogo/SEO; el precio de venta no va ahí.

#### Seguridad de datos — RLS híbrido (polaria-wms-db · TENANT-RLS)

| Canal | Credencial | RLS |
| --- | --- | --- |
| Web lecturas | supabase-js + JWT usuario | ✅ Aplica |
| API escrituras sensibles | Prisma + `DATABASE_URL` | Bypass + validación tenant en código |

Tablas solo-backend (INSERT solo vía API): `warehouse_state`, `movimiento_inventario`, `contador`, `auditoria_operacion`.

**Anti-patrones:** no exponer service role al browser; **no insert directo en `bodega` desde web** — usar `POST /configuracion/bodegas`.

Guards API: `JwtAuthGuard`, `TenantGuard`, `RolesGuard`, `SensitiveWriteGuard`.

### 4.1 Funciones transversales (Strip, balance, locking)

#### Strip (limpieza de payloads)

#### Balance de masa (pesos en procesamiento)

#### Locking (bloqueo de slots en tiempo real)

### 4.2 Auth e integraciones

```text
↓
PostgreSQL (Supabase) (Admin SDK)
INTEGRACIONES (Salidas)
NestJS Server ↘
Cloudinary (Fotos)
n8n Webhook (Alertas)
WhatsApp/Email (SLA)
```

**Mateo Support (ago 2026):** widget embebido en el shell autenticado (`MateoWidgetHost`). Dos tokens: JWT n8n (`POST /auth/mateo/widget-token`, ~300s) e historial Bearer WMS (`/mateo/conversaciones`). Tablas en schema `mateo_support`. Manual: `/manual-usuario/proceso-mateo`. Referencia: `/referencia/mateo/bodega-frio`.

## 5. Roles y Permisos

| Rol | Acceso Principal | Acciones Permitidas |
| --- | --- | --- |
| *(legacy V1)* administrador, jefe, cliente | — | Sustituidos por roles WMS de cuenta/bodega; ver filas siguientes |
| configurador | Plataforma SaaS (TI) | **Crear empresas** y **tenants** (`codeCuenta`), bodegas, primer admin; no opera mercancía |
| administrador_cuenta | Tenant (`codeCuenta`) | Usuarios, catálogos, OC/OV de su tenant |
| operador_cuenta | Tenant | SOL, OC, OV, solicitudes de procesamiento |
| administrador_bodega / jefe_bodega / custodio / operario / procesador / transportista | Bodega del tenant | Operación física y `warehouse_state` (asignación por bodega) |
| operadorCuentas | *(legacy V1)* | Alias histórico de operador de cuenta — ver `operador_cuenta` |
| transporte | Viajes | Registrar entregas, evidencia fotográfica, cierre de viaje |

## 6. Flujo de Trabajo Completo V2.0

### 6.1 Configuración Inicial del Sistema

**Todo empieza por el equipo TI.** TI deja empresa, tenant, bodegas y al **administrador de cuenta** (responsable). Ese admin crea operador, catálogos y equipo de bodega; luego arranca SOL/OC/recepción.

```text
PASO A — Equipo TI (configurador con credenciales)
────────────────────────────────────────────────
0. Iniciar sesión como configurador (Auth · panel plataforma)
1. Crear EMPRESA — codigoEmpresa, razón social
2. Crear y asignar ADMINISTRADOR DE CUENTA (pertenece a la empresa)
   • Supabase Auth + rol administrador_cuenta + codigo_empresa
3. Crear TENANT — codeCuenta con FK a la empresa
4. Crear BODEGA(S) — slots, capacidad, reglas

PASO B — Administrador de cuenta (handoff TI → cliente)
──────────────────────────────────────────────────
5. Operador de cuenta y demás usuarios de su organización
6. Catálogos: productos, clientes, proveedores, compradores
7. Camiones, plantas
8. Equipo de bodega (asignacion_bodega: jefe, custodio, operario, …)
9. Operación: SOL, OC, recepción, mapa, OV, TV
```

Checklist de cierre (configurador):

- [ ] Existe `empresa` activa (`codigo_empresa`)
- [ ] Existe `cuenta` (`codigo_cuenta`) con FK a esa empresa
- [ ] Al menos una bodega con el mismo `codigo_cuenta`
- [ ] Administrador de cuenta puede iniciar sesión y solo ve su tenant
- [ ] Ningún recurso operativo sin `codigo_cuenta` (salvo usuarios de plataforma)

> **Mejora Propuesta V2.0: Wizard: paso 1 Empresa → paso 2 Tenant → paso 3 Bodegas → paso 4 Admin cuenta → paso 5 Catálogo mínimo.**

### 6.1.1 Administrador de cuenta (después del configurador)

El administrador de cuenta **no crea la empresa ni el tenant**; los hereda del configurador y completa el setup comercial. Todo lo que registre queda bajo el mismo `codeCuenta` del tenant asignado.

### 6.2 Autenticación y Bootstrap (V2.0)

**Responsable: Todos los usuarios**

```text
Abrir app
↓
¿Sesión activa? → SÍ → Cargar perfil
                 → NO ↓
¿Es login de configurador TI?
├── SÍ → Correo + contraseña (panel plataforma, sin empresa cliente)
└── NO → Ingresar codigoEmpresa
         → ¿Empresa existe y activa? → NO → Error
         → SÍ → Ingresar correo / usuario
                → ¿Pertenece a esa empresa? → NO → Error
                → SÍ → Solicitar contraseña (Supabase Auth)
                       → ¿Válida? → NO → Reintento
                       → SÍ → Cargar perfil (rol, empresa, tenant, permisos)
↓
¿Bodega interna? → SÍ → Suscribir warehouse_state (Realtime Supabase)
                 → NO → Consultar inventario Fridem (si aplica)
↓
Dashboard según rol (cualquier rol de la empresa)
```

> **Mejora Propuesta V2.0: Agregar autenticación por Google/SSO para organizaciones empresariales. Implementar tokens de sesión con refresh automático y expiración configurable.**

### 6.3 Gestión de Proveedores

**Responsable: Administrador / Configurador / Jefe**

```text
Los campos de una Orden de Compra incluyen: Proveedor, líneas de producto (SKU, cantidad, unidad, precio), fecha de entrega estimada, bodega destino y estado.
Estados de la Orden de Compra:
Pendiente → En tránsito → Recibida → Cerrada
```

> **Mejora Propuesta V2.0: Implementar módulo de cotización comparativa entre múltiples proveedores con historial de precios.**

### 6.4 Ingreso de Mercancía

**Responsable: Custodio**

```text
Llegada de mercancía a bodega
Validación contra Orden de Compra (o ingreso manual libre)
Asignación de slot en bodega (zona de ingresos)
Registro de trazabilidad: producto, cliente, kg, fecha, temperatura objetivo
Creación de orden de trabajo: a_bodega / a_salida / revisar
Cierre de recepción (OrdenCompraService.cerrarRecepcion)
```

> **Mejora Propuesta V2.0: Integrar lectura de códigos de barras o QR para registro rápido de cajas, y alertas automáticas cuando la temperatura de ingreso está fuera de rango.**

### 6.5 Cola Operativa y Órdenes de Trabajo

**Responsable: Operario (ejecuta), Jefe / Custodio (crean órdenes)**

```text
Estados de slots:
```

| Estado | Descripción |
| --- | --- |
| libre | Sin mercancía |
| ocupado | Con caja almacenada |
| reservado | Asignado a orden de salida |
| en_proceso | Mercancía en procesamiento |

> **Ago 2026:** el mapa interactivo y el lock de slots **ya están**. Esta “mejora” del Word original quedó implementada.

### 6.6 Procesamiento (Primario y Secundario)

**Responsable: OperadorCuentas (solicita), Procesador / Operario (ejecuta)**

```text
OperadorCuentas genera solicitud de procesamiento
Estado: Pendiente → En curso → Terminado
Al INICIAR: Se descuenta producto primario de slots de bodega
Al TERMINAR: Registrar resultado secundario, calcular merma (primario - secundario)
Si hay sobrante: Crear orden de devolución al primario
Actualizar estado de solicitud a 'Terminado'
```

> **Mejora Propuesta V2.0: Agregar control de temperatura por lote durante el procesamiento, con registro automático de lecturas desde sensores IoT. Incluir certificados de calidad exportables por lote procesado.**

### 6.7 Salidas y Ventas

**Responsable: operador_cuenta / admin_cuenta (emitir) · jefe_bodega / custodio / operario (piso)**

Estados reales de OV: `borrador` → `confirmada` → `en_preparacion` → `parcialmente_despachada` → `despachada` / `cancelada`.

**Implementación ago 2026**

1. Crear OV borrador = insert Supabase JS en web (`createOrdenVenta`). **No hay** `POST /ventas/ordenes` en Nest.
2. Precio del picker y `precio_unitario` = tabla **`precio_producto`** (última `fecha_aplicacion` por producto). No usar `metadatos_catalogo.precio`. Sin fila → `$0`.
3. Emitir = `POST /ventas/ordenes/:id/emitir` → reserva stock, OT y tareas de picking.
4. Custodio arma paquete de despacho; transportista registra entrega + evidencias.

```text
OV borrador (web/Supabase)
  → emitir (API) reserva warehouse_state
  → picking / zona salida
  → paquete despacho + viaje
  → evidencia Cloudinary
```

### 6.8 Transporte y Evidencia

**Responsable: Transporte**

```text
Conductor recibe detalles del viaje (líneas, destinos, cantidades)
Por cada línea de entrega: registrar cantidad entregada, incidencia si aplica
```

Subir evidencia: foto del producto entregado, firma digital del receptor (Cloudinary)

```text
Cierre de viaje: Cerrado(ok) o Cerrado(no ok) con notificación a jefe
Se actualiza estado final de OV asociada
```

> **Mejora Propuesta V2.0: Integrar geolocalización en tiempo real del camión durante el viaje. Agregar firma electrónica legalmente válida (DocuSign o similar).**

### 6.9 Alertas Operativas

| Tipo | Disparador | Acción Requerida |
| --- | --- | --- |
| Temperatura | Lectura fuera de rango | Ajuste + registro de motivo |
| Demora | Orden sin ejecutar por tiempo > umbral | Reasignación o escalación |
| Orden reportada | Usuario reporta problema con una orden | Revisión y resolución |

> **Mejora Propuesta V2.0: Integrar alertas automáticas mediante sensores de temperatura IoT conectados a Supabase Realtime Database, con notificaciones push (PWA / FCM).**

### 6.10 Reportería y Estadísticas

Módulo Datos Incluidos

```text
Proveedores
```

OC por proveedor, kg recibidos, estado por período Compradores OV por comprador, kg despachados, historial de viajes Transporte Viajes completados, incidencias, evidencias Bodega interna Inventario vivo por slot, merma acumulada, rotación

```text
Bodega externa
```

Inventario Fridem en solo lectura

```text
Capacidades de exportación: PDF (html2canvas + jsPDF) y Excel (xlsx).
```

> **Mejora Propuesta V2.0: Agregar dashboards con KPIs en tiempo real (ocupación de bodega %, merma % por período, on-time delivery %), y programación de reportes automáticos por email.**

### 6.11 Configuración Operativa

**Responsable: Configurador** (empresa, tenant y bodegas) · **Administrador de cuenta** (catálogos y usuarios de su tenant)

Las rutas operativas usan el **`codeCuenta` activo** (tenant). El configurador elige empresa y tenant; el administrador de cuenta solo ve su tenant.

| Ruta / módulo | Acción | Scope |
| --- | --- | --- |
| `/empresas` | Crear / editar **empresa** (`codigoEmpresa`) | Plataforma (configurador) |
| `/tenants` o alta de cuenta | Crear / editar **tenant** (`codeCuenta`) | Plataforma (configurador) |
| `/bodegas` | CRUD bodegas | `codeCuenta` del tenant |
| `/usuarios` | Alta usuarios y roles | `codeCuenta` (+ asignación bodega si aplica) |
| `/catalogos` | Productos + importación xlsx | `codeCuenta` |
| `/proveedores`, `/compradores` | CRUD | `codeCuenta` |
| `/camiones`, `/plantas` | Flota y destinos | `codeCuenta` |

## 7. Modelo de Datos (PostgreSQL (Supabase))

#### Jerarquía empresa → tenant → bodega → operación

En el modelo 3NF del Dev Hub: **`empresa`** agrupa contratos; **`cuenta`** es el tenant operativo (`codigo_cuenta`); catálogos y órdenes referencian el tenant; las bodegas referencian `codigo_cuenta`.

| Entidad lógica | Tabla / ruta V2.0 | Pertenece a |
| --- | --- | --- |
| Empresa | `empresa` · `empresas/{codigoEmpresa}/` | — (cliente SaaS) |
| Tenant | `cuenta` · `tenants/{codeCuenta}/config` | `codigo_empresa` |
| Bodega | `bodega` · `warehouses/{warehouseId}` | `codigo_cuenta` (tenant) |
| Usuario operativo | `usuario` · `usuarios/{uid}` | `codigo_cuenta` (vacío si configurador) |
| Rol en bodega | `asignacion_bodega` | `id_usuario` + `id_bodega` + `id_rol` |
| Catálogo / OC / OV / SOL | tablas `producto`, `orden_compra`, … | `codigo_cuenta` |
| Inventario en vivo | `warehouse_state` (tabla Postgres + Realtime) | `id_bodega` → tenant |

> **Ago 2026:** `state/main` del Word es el modelo mental V2. En producción el mapa es la tabla `warehouse_state` (una fila por posición). Schema por empresa: `emp_*`. Precio de venta: `precio_producto`.

#### Colecciones lógicas (modelo mental V2, no el esquema Postgres)

```text
empresas/{codigoEmpresa}/      ← Empresa; el configurador la crea primero
tenants/{codeCuenta}/          ← Tenant operativo bajo una empresa
    config, catalogo, clientes, providers, compradores,
    ordenesCompra, ordenesVenta, solicitudesCompra, …

warehouses/{warehouseId}/      ← Bodega ligada a un codeCuenta
    state/main                 → slots, cajas, órdenes, alertas (tiempo real)
    history/                   → movimientos y merma

usuarios/                      → Perfiles; codigo_cuenta indica la empresa
systemCounters/              → Contadores (ej. TV-####)
```

#### Estructura del Estado Principal (diseño V2 `state/main`)

> Esquema histórico del documento Word. **Implementado:** tabla `warehouse_state` + Realtime. No hay documento JSON único por bodega.

```json
{
slots: Record<string, SlotState>,        // Mapa de bodega
inboundBoxes: BoxRecord[],               // Zona de ingreso
```

- outboundBoxes: BoxRecord[],              // Zona de salida
- dispatchedBoxes: BoxRecord[],            // Despachado
- orders: WorkOrder[],                     // Órdenes de trabajo activas
- alerts: Alert[],                         // Alertas activas
- tasks: Task[],                           // Tareas de cola operativa
- updatedAt: Timestamp

```text
}
```

> **Ago 2026:** RLS por `codigo_cuenta` + guards Nest **ya están**. El historial no es un documento JSON único: tablas 3NF + Realtime de Supabase.

## 8. API — polaria-wms-api

Fuente: [github.com/PolariaTech/polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api)

Swagger: `GET /api/docs` · OpenAPI: `GET /api/docs-json`

Guards: `JwtAuthGuard`, `TenantGuard`, `RolesGuard` · escrituras sensibles: `SensitiveWriteGuard`.  
Headers tenant: `X-Codigo-Empresa`, `X-Codigo-Cuenta`, `X-Id-Bodega`.  
Header cliente: `x-auth-client` / `X-Auth-Client` (`wms` \| `mateo`).

Lista viva de endpoints: Referencia → [API y endpoints](/referencia/api/bodega-frio).

### Auth (web y Nest coinciden)

| Método | Ruta | Notas |
| --- | --- | --- |
| POST | `/auth/prelogin` | Valida empresa + usuario |
| POST | `/auth/login` | JWT Supabase + contexto |
| POST | `/auth/mateo-handoff` | Bearer · código SSO 60s |
| POST | `/auth/mateo/widget-token` | JWT widget n8n ~300s |
| POST | `/auth/mateo-exchange` | Canje código SSO |
| GET | `/auth/me` | Perfil + `idBodegas[]` |
| POST | `/auth/logout` | 204 |

### Módulos NestJS (ago 2026)

| Carpeta | Prefijo | Estado |
| --- | --- | --- |
| auth | `/auth` | ✅ |
| configurator | `/configurador/usuarios`, `/administracion/usuarios` | ✅ |
| configuracion | `/configuracion/bodegas`, `/empresas`, `/cuentas` | ✅ POST + PATCH empresas |
| purchases | `/compras/*` | ✅ SOL, OC, recepción |
| inventory | `/inventario/warehouse-state`, `/movimientos` | ✅ lock/unlock |
| operations | `/operaciones/*` | ✅ OT, tareas, alertas, presencia |
| processing | `/procesamiento/solicitudes` | ✅ merma + OT post-cierre |
| sales | `/ventas/ordenes` | ✅ GET + emitir (crear OV es Supabase JS) |
| transport | `/transporte` | ✅ paquetes-despacho, entregas |
| integration | `/integracion/solicitudes` | ✅ + bandeja configurador |
| mateo-widget | `/mateo/conversaciones` | ✅ Bearer sesión WMS |
| accounts, audit, files, health, notifications, settings, users, warehouses | — | 🔵 stubs README, sin producto |

### Web — route handlers Next (`polaria-wms-web`)

| Método | Ruta | Estado |
| --- | --- | --- |
| GET | `/api/ventas/productos-catalogo` | ✅ stock almacenamiento + `precio_producto` |
| POST | `/api/solicitud-compra` | ✅ webhook n8n |
| POST | `/api/pedido-proveedor` | ✅ |
| POST | `/api/evidencia-transporte` | ✅ Cloudinary |
| POST | `/api/operaciones/sync-demora-alertas` | ✅ |

## 9. Integración con Servicios Externos

### 9.1 Fridem (Bodega Externa)

```text
Bodega externa cuyo inventario se consume en modo solo lectura mediante una instancia de Supabase diferente (proyecto separado).
lib/fridemClient.ts — ensureFridemAuth(): inicializa la app Supabase secundaria
lib/fridemInventory.ts — fetchFridemSlots(), fetchFridemInventoryRows()
```

### 9.2 n8n (Automatización de Pedidos)

```text
Plataforma open-source de automatización de flujos de trabajo que recibe el webhook de pedidos y orquesta la notificación al proveedor.
PEDIDO_PROVEEDOR_WEBHOOK_URL — URL del workflow n8n
PEDIDO_PROVEEDOR_DOCUMENT_ID — ID del documento de configuración en PostgreSQL (Supabase)
```

### 9.3 Cloudinary (Evidencia Fotográfica)

Almacena las fotografías y firmas de entrega de los viajes de transporte.

```text
Usar CLOUDINARY_URL completa (Opción A) para evitar errores de firma
Definir CLOUDINARY_EVIDENCIA_FOLDER para organizar archivos por bodega o cuenta
```

## 10. Variables de Entorno

Valores reales en repos (ago 2026). Solo variables **Supabase**, Nest, Cloudinary, n8n y Mateo.

#### polaria-wms-web (`.env.local`)

```text
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_MATEO_WIDGET_SCRIPT_URL=/assets/mateo-widget.js
```

Opcionales: `N8N_WEBHOOK_*` (SOL / pedido proveedor), `CLOUDINARY_*` (evidencias transporte).

#### polaria-wms-api

```text
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=          # Postgres directo Prisma (bypass RLS)
MATEO_HANDOFF_SECRET=
MATEO_WIDGET_JWT_SECRET=
MATEO_WIDGET_JWT_ISSUER=
MATEO_ALLOWED_ORIGINS=
PORT=3000
```

#### Widget-react

```text
VITE_N8N_WEBHOOK_URL=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

Fridem (bodega externa, solo lectura) sigue siendo opcional. Lista completa: Referencia → Variables de entorno.

## 11. Mejoras Propuestas para V2.0

### 11.1 Seguridad y Autenticación

✅ RLS por `codigo_cuenta` + guards Nest + `security_event` (053).  
🔵 Pendiente: SSO Google Workspace, auditoría inmutable completa, refresh/revocación avanzada.

### 11.2 Operación

✅ Mapa en vivo, lock de slots, FEFO parcial en salidas, evidencias Cloudinary.  
🔵 Pendiente: QR/barcode end-to-end, push FCM, GPS de camión, FEFO automático en todas las salidas.

### 11.3 IoT y Temperatura

🔵 Roadmap. No hay MQTT ni dashboard de temperatura por slot en producción.

### 11.4 Datos y Reportería

✅ Embed MIT (`cuenta_reporte_embed`).  
🔵 Pendiente: KPIs centralizados, reportes email programados, certificados de calidad por lote.

### 11.5 Integraciones

✅ n8n (pedidos + Mateo).  
🔵 Pendiente: cotización comparativa, ERP, firma electrónica legal, notificación automática al comprador al despachar.

### 11.6 Técnico / Mantenibilidad

✅ Swagger en `/api/docs`, tests Jest/Vitest, módulos por dominio.  
🔵 Pendiente: Storybook, API playground, métricas centralizadas, Prisma de `precio_producto`.

## 12. Guía de Instalación y Despliegue

#### Prerrequisitos

- Node.js 18+
- npm 9+
- Proyecto Supabase configurado (Auth, PostgreSQL (Supabase), Realtime DB, Storage)
- Cuenta Cloudinary
- Instancia n8n (opcional, para integración de pedidos)

#### Instalación Local

```bash
# 1. Clonar el repositorio
git clone https://github.com/eldani13/frio.git
```

cd frio

```bash
# 2. Instalar dependencias
npm install
# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales
# 4. Iniciar en desarrollo
npm run dev
# 5. Abrir en el navegador → http://localhost:3000
```

#### Scripts Disponibles

Comando Descripción

```bash
npm run dev
```

Servidor de desarrollo con hot reload

```bash
npm run build
```

Build de producción

```bash
npm run start
```

Servidor de producción

```bash
npm run lint
```

Análisis estático de código

```text
node scripts/unify-fonts.mjs
```

Normalizar clases de fuente en componentes

#### Despliegue en Producción (Vercel)

```text
Conectar repositorio en Vercel
Configurar todas las variables de entorno en Vercel Dashboard
Deploy automático en cada push a main
URL producción: https://frio-phi.vercel.app
```

## 13. Troubleshooting

Console Ninja: failed to connect to host

```text
No es un error de la aplicación. Es generado por la extensión de debugging Console Ninja.
Solución: Deshabilitar la extensión Console Ninja o ignorar el mensaje en consola.
```

Next.js detecta root incorrecto

- Síntoma: Next.js toma como raíz una carpeta padre porque detecta otro package-lock.json en un nivel superior.

```text
// next.config.ts
const nextConfig = {
turbopack: {
root: __dirname  // apunta explícitamente al root del proyecto
}
```

}; Bodega Externa Fridem Vacía

```text
Verificar variables NEXT_PUBLIC_FRIDEM_* correctamente configuradas
```

```text
NEXT_PUBLIC_FRIDEM_DATABASE_URL apunta a la instancia correcta de Realtime DB
```

```text
Reglas de lectura de la base Fridem permiten el acceso desde el app ID configurado
```

Error Cloudinary: Invalid Signature

- Causa: Mezcla de credenciales de diferentes entornos de Cloudinary.
- Solución: Usar una sola variable CLOUDINARY_URL completa y eliminar las variables individuales para evitar conflictos.

Estado de Bodega Desincronizado

- Causa: Colisión de escrituras concurrentes en PostgreSQL (Supabase) sin control de concurrencia.

```text
Solución inmediata: Verificar que todos los guardados usen merge: true (implementado en saveWarehouseState).
Solución V2.0: Implementar transacciones PostgreSQL (Supabase) para operaciones críticas como movimiento de slots.
```

## 14. Glosario de Términos

#### Términos de Dominio

| Término | Definición |
| --- | --- |
| Bodega fría | Instalación de almacenamiento a temperatura controlada para conservar alimentos perecederos u otros bienes sensibles. |
| Slot | Posición física específica dentro de la bodega donde se almacena una caja o pallet. |

```text
Custodio
```

Persona responsable de la recepción y despacho físico de mercancía en bodega. Cartonaje Proceso de empacar, etiquetar y preparar cajas para despacho contra una orden de venta. Merma Pérdida de peso o cantidad de un producto durante almacenamiento o procesamiento. Se registra en kg. Procesamiento primario Primera transformación de la mercancía: corte, porcionado, limpieza, clasificación, etc. Procesamiento secundario Resultado del procesamiento primario: producto ya transformado listo para despacho. OC (Orden de Compra) Documento que autoriza la compra de productos a un proveedor. OV (Orden de Venta) Documento que registra el compromiso de entrega de mercancía a un comprador. TV (Viaje de Transporte) Identificador único de viaje en formato TV-####. Agrupa las entregas de un mismo despacho. Trazabilidad Capacidad de seguir el recorrido completo de un lote desde su ingreso hasta su destino final.

#### Términos Técnicos

| Término | Definición |
| --- | --- |
| Multi-tenant | Arquitectura donde un mismo sistema sirve a múltiples clientes de forma aislada. |
| Empresa | Cliente jurídico del SaaS (`codigoEmpresa`). El configurador la crea; puede tener varios tenants. |
| Tenant | Unidad operativa (`codeCuenta` / tabla `cuenta`). Pertenece a una empresa; catálogos y órdenes cuelgan del tenant. |
| codeCuenta | Identificador del tenant. Namespace: `tenants/{codeCuenta}/`. FK en catálogos, órdenes y usuarios. |
| codigoEmpresa | Identificador de la empresa. Namespace: `empresas/{codigoEmpresa}/`. FK en `cuenta`. |
| Configurador | Rol de plataforma (TI). Crea empresas, tenants y primer admin; `codigo_cuenta` NULL. |
| Administrador de cuenta | Primer usuario **del tenant**, creado por el configurador. Gestiona su `codeCuenta`. |
| Bootstrap | Proceso de inicialización de la app: sesión, perfil, suscripción a bodega y montaje de UI. |
| Webhook | Mecanismo donde un sistema notifica a otro mediante una petición HTTP en tiempo real. |
| PostgreSQL (Supabase) | Base de datos relacional administrada por Supabase; Realtime sobre filas/canales autorizados. |
| Merge (PostgreSQL (Supabase)) | Operación que actualiza solo los campos especificados sin sobreescribir el resto. |
| RBAC | Control de acceso basado en roles que determina qué recursos puede ver y usar cada usuario. |
| IoT | Red de dispositivos físicos conectados a internet que transmiten datos automáticamente. |
| Push | Notificaciones a dispositivos. **No implementado** (roadmap). |
| PWA | Progressive Web App — aplicación web instalable con capacidades offline y notificaciones push. |
| SSR | Server-Side Rendering — el servidor genera el HTML antes de enviarlo al navegador. |
| CDN | Content Delivery Network — red global de servidores para servir archivos con baja latencia. |
| KPI | Key Performance Indicator — métricas cuantificables que miden el desempeño de un proceso. |
| MQTT | Protocolo de mensajería ligero para IoT con modelo publicador/suscriptor. |
| precio_producto | Tabla de precio de venta ($/kg). Vigente = `fecha_aplicacion` más reciente. No es `metadatos_catalogo`. |
| emp_* | Schema Postgres por empresa (migración 062). Legacy permanece en `public`. |
| JWT widget | Token ~300s (`POST /auth/mateo/widget-token`) para n8n. Distinto del Bearer de sesión WMS. |
| mateo_support | Schema de `widget_conversacion` / `widget_mensaje`. Vistas `public.widget_*` (064) para Prisma. |
| Documentación generación V2 · Polaria WMS **2.5.34** · Sep 2026 | [PolariaTech](https://github.com/PolariaTech) · Dev Hub [flujo](https://flujos-nine.vercel.app) |

---

## Anexo — Producto 2.5.34 (sincronizado con repos, sep 2026)

Sustituye el anexo de ago 2026 (2.4.3). Fuente: código de web, API, db y Widget-react. Detalle: [mapa actual](/documentacion/polaria-wms-mapa-actual) y [novedades 2.5.34](/documentacion/novedades-2026-09-15).

### Repositorios del ecosistema

| Repo | Stack | Rol |
| --- | --- | --- |
| polaria-wms-web | Next.js 16, React 19, TS | UI multi-rol, lecturas Supabase + Realtime |
| polaria-wms-api | NestJS 11, Prisma 7 (43 modelos) | Escrituras, reglas, guards tenant |
| polaria-wms-db | PostgreSQL / Supabase | Migraciones **001–080**, RLS híbrido, `emp_*` |
| Widget-react | Vite, React 19 | Mateo Support embebido (IIFE + Shadow DOM) |
| flujo | Vite, React | Este Dev Hub |
| polaria-ui-runner | Playwright | Simulaciones internas (no es producto) |

### Módulos implementados (antes marcados pendientes)

| Módulo | Estado | Notas |
| --- | --- | --- |
| Recepción compra | ✅ | Cierre OC → lote + `warehouse_state` |
| Inventario / mapa | ✅ | Realtime `warehouse_state`, lock/unlock |
| Operaciones bodega | ✅ | OT, tareas, alertas, llamada jefe, presencia |
| Procesamiento frío | ✅ | Primario→secundario + merma + OT post-cierre |
| Ventas OV | ✅ | Crear/editar = Supabase JS; emitir Nest **idempotente**; IA leer pedido; captura QR |
| Precio de venta | ✅ | Tabla `precio_producto` (066) + **Lista de precio**. Sin Prisma aún |
| Equivalencia comprador–producto | ✅ | `comprador_producto_alias` (067) + precio especial (073) |
| Captura surtido | ✅ | QR + foto pública `/captura-orden` (074); PDF actualizado |
| Impresoras | ✅ | Tabla `impresora` (076–077); Configurador. Sin Nest |
| Editar OV | ✅ | RLS 080 (borrador / confirmada / en_preparacion) |
| Sesión WMS | ✅ | Tope 12 h; Mateo se cierra con Polaria |
| Transporte | ✅ | Paquetes despacho + entregas + Cloudinary |
| Mateo widget | ✅ | Embed + 2 tokens + historial `mateo_support`; enlaces/PDF |
| Schema por empresa | ✅ | `emp_*` + `wms_tenant_tables` (062) |
| Reportería MIT | ✅ | `cuenta_reporte_embed` |
| Módulos por rol web | ✅ | custodio, operario, procesador, jefe-bodega, admin-bodega |

### Auth y Mateo (contrato real)

| Uso | Ruta |
| --- | --- |
| Prelogin / login | `POST /auth/prelogin`, `/auth/login` |
| SSO | `POST /auth/mateo-handoff` → `/auth/mateo-exchange` |
| Chat n8n | `POST /auth/mateo/widget-token` (JWT ~300s) |
| Historial chat | `/mateo/conversaciones` (Bearer WMS) |

Header: `X-Auth-Client: wms \| mateo`.

### Roles y pantallas (rutas actuales)

| Rol | Destino típico |
| --- | --- |
| configurador | `/configurador` |
| administrador_cuenta | `/dashboard/administracion/…` |
| operador_cuenta | `/dashboard/compras`, `/dashboard/ventas` |
| administrador_bodega | `/dashboard/administrador-bodega/estado-bodega` |
| jefe_bodega | `/dashboard/jefe-bodega/estado-bodega` |
| custodio | `/dashboard/custodio/ingreso` |
| operario | `/dashboard/operario/operacion` |
| procesador | `/dashboard/procesador/operacion` |
| transportista | `/dashboard/transporte` |

### Tablas que no estaban en el Word V2

`precio_producto`, `comprador_producto_alias`, `orden_venta_surtido_captura`, `impresora`, `widget_conversacion`, `widget_mensaje` (`mateo_support`), `sesion_operativa`, `wms_tenant_tables`, `cuenta_reporte_embed`, `security_event`. Prisma 43 modelos (40 núcleo + sesión + 2 widget). Precio, equivalencias, captura e impresora: solo Postgres + JS.

### Manual y testing en este Dev Hub

- Manual: `/manual-usuario` (roles, procesos, Mateo, glosario)
- Testing: Referencia → Testing
- Modelo de datos: `/arquitectura` y `/referencia/database/bodega-frio`

### Pendiente / roadmap

- Integración Fridem producción
- FEFO automático en todas las salidas
- Validación JWT en n8n (POL-71)
- CDN estable `mateo-widget.js`
- Modelo Prisma de `precio_producto`
- Observabilidad centralizada
