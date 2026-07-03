# POLARIA WMS

| Meta | Detalle |
| --- | --- |
| Producto | **Polaria WMS** (referencia histórica: Bodega de Frío V2) |
| Subtítulo | Documentación Técnica · diseño + estado implementación |
| Repos | [polaria-wms-web](https://github.com/PolariaTech/polaria-wms-web) · [polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api) · [polaria-wms-db](https://github.com/PolariaTech/polaria-wms-db) |
| Dev Hub | [flujos](https://flujos-nine.vercel.app) — este portal (Vite + React) |
| Stack | Next.js · React · TypeScript · NestJS 11 · Prisma · Supabase |
| Fecha | Jun 2026 |

> **Estado Polaria WMS — Jun 2026**
> ✅ Implementado en API/web · 🟡 Schema/BD listo, API operativa pendiente · 🔵 Diseño roadmap (Dev Hub)
>
> **Regla:** el Dev Hub documenta diseño objetivo **y** estado real. Lo no implementado se marca explícitamente.

---

# BODEGA DE FRÍO (diseño V2 — referencia)

| Meta | Detalle |
| --- | --- |
| Subtítulo | Documentación Técnica  ·  V2.0 |
| Descripción | Sistema de Operación Multi-Rol · Multi-Cuenta · Multi-Bodega |
| Stack | Next.js  ·  React  ·  TypeScript  ·  Supabase  ·  Cloudinary  ·  n8n |
| Fecha | Mayo 2026 |
| Enlaces | github.com/eldani13/frio  ·  frio-phi.vercel.app |

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
| Bodega operativa | `state/main` | Por `warehouseId` del tenant |
| Procesamiento / transporte / historial | Igual que antes | Scoped al tenant |

El **administrador de cuenta** opera **dentro del tenant** que le asignó el configurador. La **empresa** agrupa tenants a nivel comercial y de contrato; el **aislamiento operativo** en RLS es por `codeCuenta` (y por bodega cuando aplica).

> **Multi-tenant:** filtrar por `codigo_cuenta` para que un tenant no vea datos de otro. El configurador ve empresas y tenants en el panel de plataforma.

## 2. Qué Cambia de V1.0 a V2.0

| Característica | V1.0 | V2.0 |
| --- | --- | --- |
| Dashboard | 12 posiciones fijas | Dashboard dinámico multi-rol con cola operativa |
| Procesamiento | Lógica básica de transformación. | Balance de Masa Absoluto (Coproducto, Subproducto, Merma, Remanente). |
| Ingreso | Registro manual contra OC. | Conciliación Ciega y validación de temperatura con sensores. |
| Mapa de Bodega | Visualización de slots y ocupación. | Locking en tiempo real (evita duplicidad) y lógica FEFO automática. |
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
- **FCM / push (propuesto):** alertas de temperatura a operarios.

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

```text
polaria-wms-web/
├── app/                        # Next.js App Router
│   ├── (auth)/                 # Rutas de login y recuperación
│   ├── (dashboard)/            # Vistas principales por rol
│   │   ├── ingreso/            # Módulo de Ingreso de mercancía
│   │   ├── mapa/               # Mapa interactivo de slots
│   │   ├── procesamiento/      # Módulo de transformación
│   │   └── transporte/         # Flujo para conductores y viajes
│   ├── components/             # UI Components (SlotCard, Modal, etc.)
│   ├── context/                # AuthContext (Sesión y Cuenta)
│   ├── hooks/                  # useWarehouse (Suscripción real-time)
│   └── services/               # Clientes API → polaria-wms-api
├── public/
├── styles/                     # Tailwind CSS 4
└── lib/                        # Supabase client, schemas
polaria-wms-api/
├── src/
│   ├── main.ts                 # Punto de entrada y Swagger
│   ├── app.module.ts           # Módulo raíz
│   ├── common/                 # Elementos transversales
│   │   ├── decorators/         # @Roles, @CurrentUser
│   │   ├── guards/             # AuthGuard (Valida Supabase Token)
│   │   ├── interceptors/       # StripInterceptor (Limpia undefined)
│   │   └── pipes/              # Validación de datos
│   ├── Supabase/               # Configuración Supabase Admin SDK
│   │   ├── Supabase.module.ts
│   │   └── Supabase.service.ts # Métodos saveWarehouseState, etc.
│   └── modules/                # Módulos de dominio modularizados
│       ├── ingreso/            # Lógica de recepción y OC
│       ├── inventario/         # Gestión de slots y Locking
│       ├── ventas/             # OV, FEFO, despacho
│       ├── procesamiento/      # Solicitudes, merma, balance
│       └── configuracion/      # Empresas, tenants, catálogos (plataforma + cuenta)
PostgreSQL (Supabase) — rutas lógicas V2 /
├── empresas/                   # Cliente jurídico del SaaS
│   └── {codigoEmpresa}/        # ← El configurador crea la empresa primero
├── tenants/                    # Cuenta operativa (pertenece a una empresa)
│   └── {codeCuenta}/           # ← Luego el tenant bajo codigoEmpresa
│       ├── config              # Metadatos del tenant (nombre, activa, reglas)
│       ├── catalogo/           # Productos de ESTE tenant
│       ├── clientes/           # Clientes comerciales del tenant
│       ├── providers/          # Proveedores del tenant
│       ├── compradores/        # Destinos OV del tenant
│       ├── ordenesCompra/      # OC del tenant
│       ├── ordenesVenta/       # OV del tenant
│       └── solicitudesCompra/  # SOL del tenant
├── warehouses/                 # Bodegas (cada una con codeCuenta del tenant)
│   └── {warehouseId}/
│       ├── state/
│       │   └── main            # Slots, boxes y alertas en vivo [cite: 403, 404]
│       └── history/            # Historial de movimientos y mermas
├── usuarios/                   # Perfiles operativos y roles
└── systemCounters/             # Contadores globales (ej. Viajes TV-####)
```

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
| **Tablas 3NF** | `empresa`, `cuenta`, catálogos, SOL/OC/OV, `slot`, `caja`, … | Contratos, reportes, auditoría, integridad referencial |
| **`warehouse_state` (jsonb)** | Vista agregada `state/main` por bodega | Inventario en vivo, Realtime, locking entre operarios |

Regla: el jsonb es la **proyección operativa** del mapa; las entidades 3NF son la **descomposición lógica** y el destino de reportes. Implementación debe evitar que ambas capas diverjan sin reconciliación.

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

## 5. Roles y Permisos

| Rol | Acceso Principal | Acciones Permitidas |
| --- | --- | --- |
| *(legacy V1)* administrador, jefe, cliente | — | Sustituidos por roles WMS de cuenta/bodega; ver filas siguientes |
| configurador | Plataforma SaaS (TI) | **Crear empresas** y **tenants** (`codeCuenta`), bodegas, primer admin; no opera mercancía |
| administrador_cuenta | Tenant (`codeCuenta`) | Usuarios, catálogos, OC/OV de su tenant |
| operador_cuenta | Tenant | SOL, OC, OV, solicitudes de procesamiento |
| administrador_bodega / jefe_bodega / custodio / operario / procesador / transportista | Bodega del tenant | Operación física y `state/main` (asignación por bodega) |
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

- [ ] Existe `empresas/{codigoEmpresa}/` activa
- [ ] Existe `tenants/{codeCuenta}/config` con FK a esa empresa
- [ ] Al menos una bodega con el mismo `codeCuenta`
- [ ] Administrador de cuenta puede iniciar sesión y solo ve su tenant
- [ ] Ningún recurso operativo sin `codeCuenta` (salvo usuarios de plataforma)

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
¿Bodega interna? → SÍ → Suscribir warehouses/{id}/state/main
                 → NO → Consultar inventario Fridem
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

> **Mejora Propuesta V2.0: Implementar mapa visual interactivo de la bodega (plano de slots) donde el operario pueda hacer clic directamente sobre el slot destino para confirmar el movimiento.**

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

**Responsable: Jefe / Custodio / OperadorCuentas**

```text
Estados de Orden de Venta:
Borrador → Confirmada → En preparación → En transporte → Cerrado(ok) / Cerrado(no ok)
Generación de Orden de Venta (OV) con líneas: producto, cantidad, comprador, destino
Custodio cartoniza / ingresa mercancía contra OV
Sistema valida disponibilidad en slots
Si hay stock: Crear viaje de transporte (TV-####)
Asignar camión y conductor
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
| Inventario en vivo | `warehouse_state` · `state/main` | `id_bodega` → tenant |

#### Colecciones Principales (vista documento / Firestore histórico)

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

#### Estructura del Estado Principal (state/main)

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

> **Mejora Propuesta V2.0: Separar el historial en subcolecciones paginadas por mes para evitar documentos con payload excesivo. Implementar reglas de seguridad PostgreSQL (Supabase) granulares por rol y por codeCuenta.**

## 8. API — polaria-wms-api

Fuente: [github.com/PolariaTech/polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api)

Swagger: `GET /api/docs` · OpenAPI: `GET /api/docs-json`

Guards: `JwtAuthGuard`, `TenantGuard`, `RolesGuard` · Header opcional: `x-auth-client: wms | mateo`

### ✅ Implementado

| Método | Ruta | Notas |
| --- | --- | --- |
| GET | `/` | Health check |
| POST | `/auth/prelogin` | platform \| tenant |
| POST | `/auth/login` | JWT + contexto |
| POST | `/auth/mateo-handoff` | Bearer · SSO → Mateo |
| POST | `/auth/mateo-exchange` | Canje SSO |
| GET | `/auth/me` | Perfil sesión |
| POST | `/auth/logout` | 204 |
| POST | `/configurador/usuarios` | Rol configurador |
| POST | `/administracion/usuarios` | administrador_cuenta (tenant JWT) |
| POST | `/configuracion/bodegas` | configurador \| admin cuenta |
| POST | `/configuracion/bodegas/:idBodega/bootstrap-layout` | Layout bodega interna |
| POST | `/compras/solicitudes` | Crear SOL |
| GET | `/compras/solicitudes` | Listar SOL |
| GET | `/compras/solicitudes/:id` | Detalle SOL |
| PATCH | `/compras/solicitudes/:id` | Editar borrador |
| POST | `/compras/solicitudes/:id/enviar-aprobacion` | |
| POST | `/compras/solicitudes/:id/aprobar` | |
| POST | `/compras/solicitudes/:id/rechazar` | |
| POST | `/compras/solicitudes/:id/cancelar` | |
| POST | `/compras/solicitudes/:id/convertir-oc` | SOL → OC |
| POST | `/compras/ordenes` | Crear OC |
| GET | `/compras/ordenes` | Listar OC |
| GET | `/compras/ordenes/:id` | Detalle OC |
| POST | `/compras/ordenes/:id/emitir` | borrador → emitida |
| POST | `/compras/ordenes/:id/cancelar` | |
| POST | `/integracion/solicitudes` | operador \| admin cuenta |
| GET | `/integracion/solicitudes` | Tenant |
| GET | `/configurador/integracion/solicitudes` | Bandeja configurador |

### Módulos NestJS

| Módulo | Estado |
| --- | --- |
| auth, configurator, configuracion, purchases, integration | ✅ |
| inventory, processing, sales, transport, warehouses | 🟡 placeholder (schema BD listo) |

### 🔵 Pendiente (diseño V2)

Recepción compra (`parcialmente_recibida`, `recibida`, `cerrada`), inventario/locking, procesamiento, ventas OV, transporte TV, alertas, cola operativa.

### Web — route handlers legacy

| Ruta | Estado |
| --- | --- |
| `POST /api/solicitud-compra` (n8n) | 🟡 parcial en polaria-wms-web |
| `POST /api/evidencia-transporte` (Cloudinary) | 🔵 diseño |

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

- Crear .env.local en la raíz del proyecto:

#### Supabase Principal

```text
NEXT_PUBLIC_Supabase_API_KEY=
NEXT_PUBLIC_Supabase_AUTH_DOMAIN=
NEXT_PUBLIC_Supabase_PROJECT_ID=
NEXT_PUBLIC_Supabase_STORAGE_BUCKET=
NEXT_PUBLIC_Supabase_MESSAGING_SENDER_ID=
NEXT_PUBLIC_Supabase_APP_ID=
NEXT_PUBLIC_WAREHOUSE_ID=default
```

#### Fridem (Bodega Externa)

```text
NEXT_PUBLIC_FRIDEM_API_KEY=
NEXT_PUBLIC_FRIDEM_AUTH_DOMAIN=
NEXT_PUBLIC_FRIDEM_PROJECT_ID=
NEXT_PUBLIC_FRIDEM_DATABASE_URL=
```

#### Cloudinary

```bash
# Opción A (recomendada):
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
# Opcionales:
CLOUDINARY_UNSIGNED_UPLOAD_PRESET=
CLOUDINARY_EVIDENCIA_FOLDER=evidencia-transporte
```

#### n8n / Integración Proveedores

```text
PEDIDO_PROVEEDOR_DOCUMENT_ID=
PEDIDO_PROVEEDOR_WEBHOOK_URL=
```

## 11. Mejoras Propuestas para V2.0

### 11.1 Seguridad y Autenticación

Reglas PostgreSQL (Supabase) granulares por rol y codeCuenta Sesiones con refresh token automático y expiración configurable Auditoría de acciones críticas (quién, qué, cuándo) en colección auditLog Soporte SSO / Google Workspace para organizaciones

### 11.2 Operación

Mapa visual interactivo de slots en bodega (arrastrar/soltar) Lectura de códigos de barras / QR para ingreso y despacho rápido Notificaciones push en tiempo real (Supabase Cloud Messaging) Geolocalización de camiones durante viajes activos

### 11.3 IoT y Temperatura

Integración con sensores de temperatura vía MQTT → Supabase Realtime DB Alertas automáticas por temperatura fuera de rango con historial de lecturas por slot Dashboard de temperatura en tiempo real por zona de bodega

### 11.4 Datos y Reportería

KPIs en tiempo real: % ocupación de bodega, % merma, on-time delivery, rotación Reportes programados por email (diario/semanal/mensual) Subcolecciones de historial paginadas por mes Exportación de certificados de calidad por lote procesado

### 11.5 Integraciones

Módulo de cotización comparativa entre proveedores con historial de precios Integración con ERP existente del cliente vía API REST Firma electrónica legalmente válida para documentos de entrega Notificaciones automáticas al comprador cuando su pedido es despachado

### 11.6 Técnico / Mantenibilidad

Refactorizar BodegaDashboard.tsx extrayendo hooks por dominio Cobertura de tests unitarios con Vitest para servicios críticos CI/CD con validación de tipos TypeScript y linting en cada PR Documentación de API con OpenAPI/Swagger para las rutas internas

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
| FCM | Supabase Cloud Messaging — servicio para enviar notificaciones push a dispositivos. |
| PWA | Progressive Web App — aplicación web instalable con capacidades offline y notificaciones push. |
| SSR | Server-Side Rendering — el servidor genera el HTML antes de enviarlo al navegador. |
| CDN | Content Delivery Network — red global de servidores para servir archivos con baja latencia. |
| KPI | Key Performance Indicator — métricas cuantificables que miden el desempeño de un proceso. |
| MQTT | Protocolo de mensajería ligero para IoT con modelo publicador/suscriptor. |
| Documentación V2.0  ·  Bodega de Frío  ·  Mayo 2026 | github.com/eldani13/frio  ·  frio-phi.vercel.app |
