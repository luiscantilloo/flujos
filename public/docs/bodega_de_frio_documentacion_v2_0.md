# BODEGA DE FRÍO

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

```text
PostgreSQL (Supabase) Security Rules
```

Configuración para que solo el UID del servidor NestJS pueda escribir. Supabase Storage Respaldo de firmas digitales y documentos adjuntos de la recepción. Supabase Cloud Messaging Envío de alertas push a los operarios cuando el sensor de temperatura falla.

```text
Cloudinary (API)
```

Almacenamiento y optimización de las evidencias fotográficas del transporte.

## 4. Arquitectura del Sistema

```text
frio-frontend/
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
│   └── services/               # Clientes API (Llamadas a NestJS)
├── public/                     # Assets estáticos
├── styles/                     # Tailwind CSS 4
└── lib/                        # Utils y validaciones de esquema (Zod)
frio-backend/
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
PostgreSQL (Supabase) (NoSQL Structure) /
├── tenants/                    # Configuración por cuenta
│   └── {codeCuenta}/           # Namespace de la organización
│       ├── config              # Reglas, capacidad y bodegas
│       ├── catalogo/           # Productos primarios y secundarios
│       └── providers/          # Lista de proveedores
├── warehouses/                 # Datos operativos vivos
│   └── {warehouseId}/
│       ├── state/
│       │   └── main            # Slots, boxes y alertas en vivo [cite: 403, 404]
│       └── history/            # Historial de movimientos y mermas
├── usuarios/                   # Perfiles operativos y roles
└── systemCounters/             # Contadores globales (ej. Viajes TV-####)
```

#### Flujo de Datos

```text
LECTURA (Tiempo Real)
Usuario ← Next.js SDK ← PostgreSQL (Supabase) / Realtime DB
ESCRITURA (Validación Atómica)
Usuario → Next.js Dashboard → NestJS Backend
```

↘

## 1. Función Strip (Limpieza)

## 2. Balance de Masa (Pesos)

## 3. Locking (Bloqueo de Slots)

## 4. Auth & Roles

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
| administrador | Todo el sistema | CRUD completo, configuración, reportes |
| custodio | Ingresos, salidas, cartonaje | Recepción de mercancía, creación de órdenes, cartonaje |
| operario | Cola de trabajo | Ejecutar órdenes de movimiento entre zonas |
| procesador | Procesamiento | Avanzar estados, registrar secundario y merma |
| jefe | Dashboard operativo, órdenes | Crear órdenes, ver estado general, gestionar alertas |
| cliente | Vista de sus órdenes | Consultar estado de sus órdenes de compra/venta |
| configurador | Configuración del sistema | Bodegas, cuentas, usuarios, solicitudes de integración |
| operadorCuentas | Cuenta operativa | Solicitar procesamiento, gestionar su cuenta |
| transporte | Viajes | Registrar entregas, evidencia fotográfica, cierre de viaje |

## 6. Flujo de Trabajo Completo V2.0

### 6.1 Configuración Inicial del Sistema

**Responsable: Configurador / Administrador**

```text
Antes de cualquier operación, el sistema debe estar configurado con:
Configuración de bodegas: Se definen las bodegas del sistema (nombre, tipo: interna/externa, capacidad de slots).
Configuración de cuentas: Se crean las cuentas operativas (codeCuenta) que agrupan clientes y bodegas.
Alta de usuarios: Se crean los usuarios con sus roles en Supabase Auth y se registra su perfil en PostgreSQL (Supabase).
Catálogo de productos: Se importa o crea manualmente el catálogo de productos.
Proveedores y compradores: Se registran con sus datos de contacto.
Flota de camiones y plantas: Se registran los vehículos disponibles y las plantas de destino.
Asignación de bodegas a cuentas: El configurador vincula bodegas a cada codeCuenta.
```

> **Mejora Propuesta V2.0: Implementar un wizard de onboarding guiado para configuración inicial, que valide cada paso antes de habilitar la operación.**

### 6.2 Autenticación y Bootstrap

**Responsable: Todos los usuarios**

```text
Abrir app
↓
¿Sesión activa?
├── NO → Pantalla de login (Supabase Auth) → Ingresar credenciales
│         → ¿Válidas? → NO → Error / reintento
│                    → SÍ → Cargar perfil
└── SÍ → Cargar perfil
↓
Leer rol, nombre, cuenta, permisos desde PostgreSQL (Supabase)
↓
¿Bodega interna? → SÍ → Suscribir estado principal (PostgreSQL (Supabase))
→ NO → Consultar inventario Fridem (Realtime DB)
↓
Renderizar Dashboard según rol
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

**Responsable: Configurador**

Ruta Módulo /asignarbodegas Vincular bodegas a cuentas (codeCuenta) /catalogos CRUD catálogo de productos + importación masiva xlsx /proveedores CRUD proveedores + modal de órdenes /compradores CRUD compradores /camiones CRUD flota de vehículos /plantas CRUD plantas de destino

## 7. Modelo de Datos (PostgreSQL (Supabase))

#### Colecciones Principales

```text
warehouses/
```

{warehouseId}/ state/ main         → Estado operativo vivo (slots, cajas, órdenes, alertas) history      → Histórico + merma acumulada clientes/ {clientId}/ productos/ providers/ compradores/ ordenesCompra/ ordenesVenta/ solicitudesProcesamiento/ usuarios/            → Catálogo de usuarios operativos systemCounters/ viajesTransporte   → Contador global TV-####

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

## 8. API Routes Internas

#### `POST /api/pedido-proveedor`

```text
Proxy que recibe un pedido consolidado desde el frontend y lo reenvía al webhook n8n del proveedor.
```

#### Payload esperado:

```json
{
"proveedorId": "string",
"lineas": [
```

{ "productoId": "string", "cantidad": 0, "unidad": "string" } ],

```json
"bodegaDestino": "string",
"fechaEntregaEstimada": "ISO8601"
}
```

#### `POST /api/evidencia-transporte`

```text
Recibe un archivo (FormData) y lo sube a Cloudinary, devolviendo la URL segura.
Recibe FormData con campo file
Si hay CLOUDINARY_URL configurada: firma la subida (signed upload)
```

Si no: usa preset sin firma (CLOUDINARY_UNSIGNED_UPLOAD_PRESET)

```text
Devuelve URL segura para guardar en PostgreSQL (Supabase)
```

> **Mejora Propuesta V2.0: Agregar validación de tipo MIME y tamaño máximo de archivo. Implementar compresión de imagen antes de subir para reducir costos de almacenamiento.**

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
| codeCuenta | Código único que identifica una cuenta operativa. Actúa como namespace dentro del sistema. |
| Bootstrap | Proceso de inicialización de la app: sesión, perfil, suscripción a bodega y montaje de UI. |
| Webhook | Mecanismo donde un sistema notifica a otro mediante una petición HTTP en tiempo real. |
| PostgreSQL (Supabase) | Base de datos NoSQL en la nube de Supabase con sincronización en tiempo real. |
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
