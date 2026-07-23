# Polaria WMS — Documentación V1 (legacy Dev Hub)

| Meta | Detalle |
| --- | --- |
| Producto | **Polaria WMS** (subtítulo histórico: Bodega de Frío) |
| Subtítulo | Documentación Técnica y Operacional |
| Versión | Versión 1.0  \|  2026 |
| Stack | Next.js · React · TypeScript · Supabase · NestJS API · Tailwind |
| Resumen | Plataforma multi-tenant WMS — ver doc V2.0 para estado real jun 2026 |

> **Estado Polaria WMS — Jun 2026**
> ✅ Implementado | 🟡 Parcial (schema/API) | 🔵 Diseño pendiente
> Repos: `polaria-wms-web`, `polaria-wms-api`, `polaria-wms-db`

---

## 0. VISIÓN DE NEGOCIO

*Propósito, público objetivo e hilo conductor del sistema*


### Propósito del sistema

Bodega de Frío es una plataforma web para operar y supervisar bodegas de frío en un entorno multi-cuenta (varias organizaciones comerciales), multi-bodega (varias ubicaciones) y multi-rol (cada persona ve y ejecuta solo lo que corresponde a su función).

El foco logístico es el ciclo de la mercancía refrigerada: recepción y registro, ubicación en almacén, movimientos entre zonas, preparación para salida, despacho y —cuando aplica— transformación (procesamiento de un insumo en producto derivado) con control de merma y sobrantes reintegrables. Todo se articula con órdenes de compra, órdenes de venta, catálogos, solicitudes de compra, solicitudes de integración con bodegas externas, tareas hacia el configurador y, en muchos casos, transporte con trazabilidad hasta el cierre del viaje.

El sistema mantiene estado operativo en tiempo casi real por bodega (mapa de ocupación, colas de entrada y salida, órdenes de trabajo abiertas, alertas, tareas de procesamiento visibles para operarios y registro de llamadas al jefe) y un historial separado para auditoría, reportes y acumulados (por ejemplo kilogramos totales de merma de procesamiento que no vuelven al mapa).


### Público objetivo

- Personal de bodega que recibe mercancía, ejecuta traslados y atiende la cola de trabajo.
- Supervisores o jefes que crean y priorizan órdenes de trabajo internas, asignan alertas y asignan quién inicia cada solicitud de procesamiento en bodega.
- Custodios que concentran ingresos, recepción frente a orden de compra (con diferencias o líneas adicionales), cartonaje/recepción frente a orden de venta cuando la venta llega en transporte a la bodega.
- Procesador (rol distinto del operario): comparte la vista operativa de bodega pero la cola le muestra sobre todo tareas de procesamiento asignadas.
- Administración que supervisa el mapa (en general solo lectura), actividades, despachos y —junto al jefe— puede asignar operario a una solicitud de procesamiento.
- Cuentas comerciales (cliente u operador de cuentas) que gestionan catálogo, proveedores, compradores, plantas, flota, órdenes de compra y venta, solicitudes de procesamiento y reportes operativos.
- Configurador que da de alta clientes, usuarios operativos, metadatos de bodegas y revisa solicitudes de integración.
- Transporte que accede a un flujo dedicado: listado de viajes en curso, detalle por venta, registro de entrega (cantidades, conformidad, incidencia, foto y firma) y cierre.


### Hilo conductor: compra → bodega → venta

El siguiente esquema resume el ciclo completo de vida de la mercancía en el sistema:

> **Cadena resumida:** compra documentada → recepción honesta → ingreso visible → mapa auditado → (opcional) transformación → venta documentada → salida física → evidencia de entrega.

| Paso | Etapa | Qué ocurre |
| ---: | --- | --- |
| 1 | **Comprar** | La cuenta genera una orden de compra al proveedor con líneas de productos y kg. La OC avanza por estados hasta que el proveedor envía el camión hacia la bodega. |
| 2 | **Entrar a la bodega** | El custodio recibe físicamente la mercancía y cierra la recepción contra la OC: línea por línea qué kg llegaron, si hubo diferencias o líneas adicionales no pedidas. |
| 3 | **Registrar ingreso** | El custodio da de alta las cajas (manual o asistido desde la OC): van a la zona de entrada con temperatura, peso, cliente comercial y vínculos al catálogo. La mercancía 'existe' en el sistema pero aún no ocupa el mapa principal. |
| 4 | **Ubicar en el mapa** | El jefe (o custodio) crea órdenes de trabajo 'de entrada hacia bodega'. El operario las toma de la cola, ejecuta y la caja pasa del arreglo de entrada a un casillero numerado del mapa. |
| 5 | **Permanencia y control** | En mapa, cada casillero muestra temperatura. Si supera el umbral o una orden lleva demasiado tiempo, nacen alertas; el jefe puede asignarlas y cerrarlas con motivo. |
| 6 | **Transformar (opcional)** | Si la cuenta creó una solicitud de procesamiento, el jefe asigna un operario o procesador. Al ponerse en curso se descuenta kg del primario en el mapa; al cerrar se declaran merma y/o sobrante. |
| 7 | **Vender** | La cuenta crea una orden de venta a un comprador. Cuando decide despachar, la venta puede pasar a transporte hacia una bodega destino o flujo interno. |
| 8 | **Salida física** | El jefe/custodio genera órdenes de trabajo hacia la zona de salida; el operario ejecuta. Desde salida se despacha hacia camión. |
| 9 | **Entrega al comprador** | Se abre un viaje numerado TV-####. El transportista registra cantidades entregadas, conformidad, foto/firma o incidencia, y al cerrar la venta queda Cerrado(ok) o Cerrado(no ok). |

> **Nota.** El esqueleto completo es: compra documentada → recepción honesta → ingreso visible → mapa auditado → (opcional) transformación con pérdidas explícitas → venta documentada → salida física → evidencia de entrega.


---


## CHECKLIST MAESTRA


### Estado de la documentación del proyecto

| # | Elemento de Documentación | Prioridad | Estado |
| --- | --- | --- | --- |
| 1 | README.md — Portada del proyecto | Alta | Completo |
| 2 | Diagrama de arquitectura del sistema | Alta | Completo |
| 3 | Documentación de API (OpenAPI / Swagger) | Alta | Completo |
| 4 | Variables de entorno y configuración | Alta | Completo |
| 5 | Guía de instalación y ejecución local | Alta | Completo |
| 6 | CONTRIBUTING.md — Cómo contribuir | Alta | Completo |
| 7 | Glosario de términos del negocio | Alta | Completo |
| 8 | Flujos de negocio end-to-end | Alta | Completo |
| 9 | Architecture Decision Records (ADRs) | Media | Pendiente |
| 10 | Documentación de testing | Media | Completo |
| 11 | Runbooks de operación y deployment | Media | Completo |
| 12 | Guía de onboarding para nuevos devs | Media | Completo |
| 13 | CHANGELOG.md — Historial de versiones | Media | Completo |
| 14 | Documentación de seguridad y autenticación | Media | Completo |
| 15 | Definición de entornos (dev/staging/prod) | Media | Completo |
| 16 | Guía de observabilidad y monitoreo | Baja | Pendiente |
| 17 | Política de versionado semántico (SemVer) | Baja | Completo |
| 18 | Notas de migración entre versiones mayores | Baja | Completo |
| 19 | Storybook o catálogo de componentes UI | Baja | Pendiente |
| 20 | Compliance y normativas aplicables | Baja | Pendiente |

> **Nota.** Los elementos marcados ☐ Pendiente requieren información adicional del equipo o están planificados para una versión futura de esta documentación.


---


## 1. README.md

*Portada del proyecto y punto de entrada para cualquier persona*

> **Archivo referenciado.** README.md

El README.md es el primer archivo que lee cualquier persona al llegar al repositorio. Responde tres preguntas en menos de 30 segundos: ¿Qué es esto? ¿Para qué sirve? ¿Cómo empiezo?


### Contenido del README.md

| Sección | Contenido |
| --- | --- |
| Descripción del proyecto | Qué es Bodega de Frío, su foco logístico y características principales (multi-rol, multi-cuenta, multi-bodega). |
| Stack tecnológico | Tabla con las 10+ tecnologías, sus versiones y su rol específico en el sistema. |


### Prerrequisitos

Node.js 18+, npm 9+, cuenta Firebase, Cloudinary (opcional), n8n (opcional). Instalación rápida 4 pasos: clonar → instalar → configurar .env.local → npm run dev.

Variables de entorno requeridas Ejemplo mínimo con las variables críticas de Firebase y Cloudinary.


### Scripts disponibles

dev, build, start, lint, test, test:all. Estructura del proyecto Árbol de carpetas con la responsabilidad de cada directorio. Roles del sistema Tabla de los 9 roles con su función principal. Rutas de la aplicación Tabla de rutas con su descripción. Documentación relacionada Links a CONTRIBUTING.md, CHANGELOG.md, architecture.mermaid. Troubleshooting rápido Los 4 problemas más comunes y sus soluciones.

> **Nota.** El README está diseñado para que un desarrollador nuevo pueda levantar el proyecto localmente en menos de 1 hora siguiéndolo únicamente.


---


## 2. Diagrama de arquitectura del sistema

*Plano completo de componentes y flujo de datos*

> **Archivo referenciado.** architecture.mermaid

El diagrama de arquitectura muestra cómo están conectados todos los componentes antes de tocar cualquier línea de código. El sistema sigue un patrón monolítico modularizado dentro de Next.js App Router.


### Capas del sistema

| Capa | Descripción |
| --- | --- |
| Cliente (Navegador) | Next.js App Router + React 19. Orquesta autenticación, suscripciones en tiempo real a Firestore, y filtros por rol. Componente central: BodegaDashboard.tsx. |
| Servidor (Next.js Node) | Rutas POST server-side: reenvío de pedido a n8n y subida de evidencia a Cloudinary. Operan con secretos que no pueden exponerse al cliente. |
| Firebase (Nube principal) | Auth (autenticación), Firestore (estado y datos de negocio), Storage (archivos adjuntos). |
| Firebase Fridem (Nube secundaria) | Solo lectura. Inventario de bodega externa. Se conecta vía lib/fridemClient.ts. |
| Cloudinary (Externo) | Almacenamiento de evidencia fotográfica de entregas. Accedido solo desde la ruta API del servidor. |
| n8n (Externo) | Automatización de pedidos a proveedor. Recibe el JSON del pedido vía webhook POST. |


### Componente orquestador: BodegaDashboard.tsx

Es la sala de control central del sistema. Sus responsabilidades son:

Gestiona el ciclo de autenticación (login/logout vía Firebase Auth)

Carga el perfil del usuario: role, clientId, codeCuenta, permisos

Mantiene en memoria el estado operativo: slots[], inboundBoxes[], outboundBoxes[], orders[], alerts[]

Se suscribe en tiempo real a warehouses/{warehouseId}/state/main en Firestore

Enruta a la tab correcta según el rol del usuario autenticado

> **Nota.** BodegaDashboard.tsx concentra demasiada responsabilidad. El README del proyecto recomienda extraer módulos de dominio a hooks/servicios dedicados en futuras iteraciones.


### Capa de persistencia: lib/bodegaCloudState.ts

Es el núcleo de sincronización entre el estado local (React) y Firestore. Cada operación que modifica inventario llama a saveWarehouseState(), que hace un merge (no sobreescritura) para permitir concurrencia entre usuarios.

| Función | Descripción |
| --- | --- |
| subscribeWarehouseState() | Suscripción en tiempo real. Actualiza el estado local cuando Firestore cambia. |
| saveWarehouseState() | Guarda el estado con merge. Llamada en cada operación que modifica inventario. |
| fetchWarehouseStateOnce() | Lectura puntual sin suscripción. Para operaciones que necesitan el estado más reciente. |
| ensureWarehouseState() | Crea el documento de estado si no existe (bootstrap de bodega nueva). |
| recordMermaProcesamientoKg() | Acumula merma de procesamiento en el historial de la bodega. |


---


## 3. Documentación de API

*Endpoints server-side — rutas POST de Next.js*

El sistema tiene dos rutas API server-side. Estas rutas requieren secretos que no pueden exponerse al cliente (API Secret de Cloudinary, URL del webhook de n8n), por eso viven en el servidor.


#### `POST /api/evidencia-transporte`

Recibe una imagen de evidencia de entrega, la sube a Cloudinary y devuelve la URL segura para persistir en Firestore.

| Atributo | Detalle |
| --- | --- |
| Método | POST |
| URL | /api/evidencia-transporte |
| Content-Type | multipart/form-data |
| Campo requerido | file: File (imagen JPEG, PNG, WebP o similar) |
| Límite de tamaño | 10 MB máximo |
| Runtime | nodejs (no edge runtime) |
| Quién lo llama | TransporteViajesPanel.tsx — paso 2 del flujo de registro de entrega (foto). |


### Respuestas

| Código HTTP | Condición | Body de respuesta |
| --- | --- | --- |
| 200 OK | Subida exitosa | { url: 'https://res.cloudinary.com/...' } |
| 400 Bad Request | Falta el campo file o no es imagen | { error: 'Falta el archivo (campo file).' } |
| 400 Bad Request | Archivo supera 10 MB | { error: 'La imagen supera 10 MB.' } |
| 503 Service Unavailable | Cloudinary no configurado | { error: 'Configurá Cloudinary: ...' } |
| 500 Internal Server Error | Error de firma de Cloudinary | { error: 'Cloudinary: firma inválida. ...' } |


### Modos de subida

Firmada (signed): usa CLOUDINARY_URL o las tres variables individuales. Requiere API Secret. No firmada (unsigned): usa CLOUDINARY_UNSIGNED_UPLOAD_PRESET. No requiere API Secret.


#### `POST /api/pedido-proveedor`

Recibe un pedido consolidado, lo valida y lo reenvía al webhook de n8n para procesamiento externo (notificación al proveedor).

| Atributo | Detalle |
| --- | --- |
| Método | POST |
| URL | /api/pedido-proveedor |
| Content-Type | application/json |
| Quién lo llama | pedidoProveedorWebhook.ts, disparado desde SolicitudCompraService. |


### Body de la solicitud

| Campo | Requerido | Descripción |
| --- | --- | --- |
| idcliente | Sí | ID del cliente en Firestore. |
| codeCuenta | Sí | Código de la cuenta operativa. |
| lineItems | Sí | Array de líneas: catalogoProductId, codeSnapshot, titleSnapshot, pesoKg. |
| proveedor_nombre | Sí | Nombre del proveedor (debe venir de la BD, no del input del usuario). |
| proveedorCode | Sí | Código único del proveedor. |
| proveedorId | Sí | ID del proveedor en Firestore. |
| telefono | Sí | Teléfono de contacto del proveedor. |
| estado | No | Default: 'Iniciado'. |


### Respuestas

| Código HTTP | Condición | Body de respuesta |
| --- | --- | --- |
| 200 OK | Pedido enviado exitosamente | { ok: true } |
| 400 Bad Request | Faltan campos requeridos | { error: 'Faltan idcliente, codeCuenta o lineItems.' } |
| 502 Bad Gateway | n8n no responde o error de red | { error: '<mensaje del webhook>' } |

> **Nota.** Estos son los únicos endpoints server-side del sistema. Toda la demás comunicación con Firebase se hace directamente desde el cliente usando el SDK de Firebase, no a través de rutas API.


---


## 4. Variables de entorno y configuración

Todas las variables documentadas con su propósito

> **Nota.** NUNCA subas el archivo .env.local al repositorio. Está incluido en .gitignore. En producción, configura estas variables en tu plataforma de hosting (Vercel, Railway, etc.).


### 4.1 Firebase principal

| Variable | Descripción |
| --- | --- |
| NEXT_PUBLIC_FIREBASE_API_KEY | API Key del proyecto Firebase. Obtenida en Configuración → Aplicaciones web. |
| NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN | Dominio de Auth. Formato: tu-proyecto.firebaseapp.com |
| NEXT_PUBLIC_FIREBASE_PROJECT_ID | ID único del proyecto Firebase. |
| NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET | Bucket de Storage. Formato: tu-proyecto.appspot.com |
| NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID | ID del remitente para mensajería. |
| NEXT_PUBLIC_FIREBASE_APP_ID | ID de la aplicación web registrada en Firebase. |
| NEXT_PUBLIC_WAREHOUSE_ID | ID de la bodega activa por defecto. Si no se define, usa 'default'. |

4.2 Firebase Fridem — bodega externa (opcional)

| Variable | Descripción |
| --- | --- |
| NEXT_PUBLIC_FRIDEM_API_KEY | API Key del proyecto Firebase de Fridem. |
| NEXT_PUBLIC_FRIDEM_AUTH_DOMAIN | Dominio Auth de Fridem. |
| NEXT_PUBLIC_FRIDEM_PROJECT_ID | Project ID de Fridem. |
| NEXT_PUBLIC_FRIDEM_STORAGE_BUCKET | Storage bucket de Fridem. |
| NEXT_PUBLIC_FRIDEM_MESSAGING_SENDER_ID | Sender ID de Fridem. |
| NEXT_PUBLIC_FRIDEM_APP_ID | App ID de Fridem. |
| NEXT_PUBLIC_FRIDEM_MEASUREMENT_ID | Measurement ID de Analytics de Fridem (opcional). |
| NEXT_PUBLIC_FRIDEM_DATABASE_URL | URL de Realtime Database de Fridem. Formato: https://proyecto-default-rtdb.firebaseio.com |

4.3 Cloudinary — evidencia de transporte

| Variable | Descripción |
| --- | --- |
| CLOUDINARY_URL (Opción A — recomendada) | URL completa. Formato: cloudinary://API_KEY:API_SECRET@CLOUD_NAME. Copiar del dashboard de Cloudinary. |
| CLOUDINARY_CLOUD_NAME (Opción B) | Nombre del cloud. Alternativa si no se usa CLOUDINARY_URL. |
| CLOUDINARY_API_KEY (Opción B) | API Key de Cloudinary. |
| CLOUDINARY_API_SECRET (Opción B) | API Secret. NUNCA usar prefijo NEXT_PUBLIC_ para esta variable. |
| CLOUDINARY_UNSIGNED_UPLOAD_PRESET (opcional) | Preset de subida no firmada. No requiere API Secret. |
| CLOUDINARY_EVIDENCIA_FOLDER (opcional) | Carpeta destino en Cloudinary. Default: 'bodega-venta-evidencias'. |


### 4.4 Integración pedidos a proveedor (n8n)

Estas constantes se definen en app/config/pedidoProveedorIntegracion.ts, no en .env.local:

| Constante de código | Descripción |
| --- | --- |
| PEDIDO_PROVEEDOR_DOCUMENT_ID | ID del documento de configuración en Firestore para la integración. |
| PEDIDO_PROVEEDOR_WEBHOOK_URL | URL del webhook de n8n que recibe los pedidos consolidados. |


### 4.5 Atajos de login para desarrollo (opcionales)

| Variable | Descripción |
| --- | --- |
| NEXT_PUBLIC_ENABLE_LOGIN_ROLE_SHORTCUTS | Activa botones de acceso rápido por rol. Valor: '1'. También activo con NODE_ENV=development. |
| NEXT_PUBLIC_BODEGA_DEV_LOGINS | JSON array con credenciales personalizadas. Sobreescribe los defaults. |
| NEXT_PUBLIC_LOGIN_{ROL}_EMAIL | Email de un rol específico. Ej: NEXT_PUBLIC_LOGIN_CUSTODIO_EMAIL |
| NEXT_PUBLIC_LOGIN_{ROL}_PASSWORD | Contraseña del rol. Ej: NEXT_PUBLIC_LOGIN_CUSTODIO_PASSWORD |

> **Nota.** Los atajos de login usan credenciales débiles. NUNCA activar NEXT_PUBLIC_ENABLE_LOGIN_ROLE_SHORTCUTS en producción.


---


## 5. Guía de instalación y ejecución local

Cómo levantar el proyecto desde cero en menos de 1 hora


### Prerrequisitos

| Herramienta | Versión requerida |
| --- | --- |
| Node.js | 18.x o superior (recomendado 20 LTS) |
| npm | 9.x o superior (viene con Node) |
| Git | Cualquier versión reciente |
| Cuenta Firebase | Proyecto con Auth, Firestore y Storage habilitados |
| Cuenta Cloudinary | Solo para el módulo de evidencia fotográfica de transporte |
| Instancia n8n | Solo para la integración de pedidos a proveedor |


### Pasos de instalación

#### Clonar el repositorio

```bash
git clone <url-del-repo> && cd frio-main
```

#### Instalar dependencias

```bash
npm install
```

#### Crear el archivo de variables de entorno

```bash
cp .env.example .env.local
```

Completar todas las variables según la sección 4 de este documento.

#### Iniciar el servidor de desarrollo

```bash
npm run dev
```

#### Abrir la aplicación

```bash
http://localhost:3000
```


### Scripts disponibles

| Comando | Descripción |
| --- | --- |
| npm run dev | Servidor de desarrollo con hot reload. Puerto 3000 por defecto. |
| npm run build | Compilación para producción. Reporta errores de tipos y build. |
| npm run start | Servidor de producción (requiere build previo). |
| npm run lint | Linting con ESLint. Debe pasar sin errores antes de hacer commit. |
| npm run test | Tests con Vitest sobre lógicas puras en app/lib/ y lib/. |
| npm run test:all | Encadena lint + verificación de tipos + cobertura completa. |
| node scripts/unify-fonts.mjs | Normaliza clases de fuente en app/*. Usar con precaución. |


### Troubleshooting de instalación

| Problema | Solución |
| --- | --- |
| Console Ninja: 'failed to connect' | No es error del sistema. Es la extensión de logging del IDE. Ignorar si la app compila. |
| Next toma como root una carpeta padre | Definir turbopack.root en next.config.ts o eliminar lockfiles duplicados en carpetas padre. |
| Bodega externa vacía (Fridem) | Verificar variables NEXT_PUBLIC_FRIDEM_* y NEXT_PUBLIC_FRIDEM_DATABASE_URL. |
| Cloudinary: 'Invalid signature' | Usar una sola línea CLOUDINARY_URL copiada del panel. Reiniciar servidor tras cambiar .env. |
| Usuario sin perfil tras login | El UID existe en Auth pero no en Firestore. Crear el documento en colección 'usuarios'. |
| Build falla con errores TypeScript | Ejecutar npm run lint primero para identificar errores de tipo. |


---


## 6. CONTRIBUTING.md

*Guía de contribución al proyecto*

> **Archivo referenciado.** CONTRIBUTING.md

El archivo CONTRIBUTING.md define cómo cualquier persona del equipo debe colaborar al proyecto de forma ordenada y consistente.


### Convención de ramas

| Tipo | Formato | Ejemplo |
| --- | --- | --- |
| Nueva funcionalidad | feat/descripcion-corta | feat/alerta-temperatura-automatica |
| Corrección de bug | fix/descripcion-del-bug | fix/cloudinary-signature-error |
| Refactor | refactor/descripcion | refactor/extraer-hook-ordenes |
| Documentación | docs/descripcion | docs/actualizar-glosario |
| Hotfix urgente | hotfix/descripcion | hotfix/viaje-sin-cerrar |


### Convención de commits (Conventional Commits)

| Prefijo | Cuándo usarlo |
| --- | --- |
| feat: | Nueva funcionalidad: feat: agregar filtro por fecha en reportes |
| fix: | Corrección de bug: fix: error al cerrar viaje sin foto |
| refactor: | Código sin nuevo comportamiento: refactor: extraer useOrdenesHook |
| docs: | Solo documentación: docs: actualizar glosario |
| test: | Tests: test: agregar test a OrdenCompraService |
| chore: | Mantenimiento: chore: actualizar dependencias de npm |


### Definition of Done

Un cambio está terminado cuando:

- El código compila sin errores (npm run build)
- El linter pasa sin errores (npm run lint)
- La funcionalidad fue probada manualmente en los roles afectados
- Los tests pasan (npm run test)
- La documentación relevante fue actualizada
- El PR fue revisado y aprobado por al menos un miembro del equipo
- 📖


## 7. Glosario de términos del negocio

*Vocabulario del dominio — puente entre negocio y código*

Sin este glosario, un desarrollador nuevo no sabe la diferencia entre una ruta, un despacho y un viaje. Es el documento que más valor genera y que menos equipos escriben.

| Término | Definición de negocio | Representación en el sistema |
| --- | --- | --- |
| Bodega interna | Ubicación cuyo inventario y operación viven en el propio sistema. | Documento warehouses/{id}/state/main. Escritura bidireccional. |
| Bodega externa | Ubicación cuyo inventario se consulta desde otra infraestructura. | Firebase project Fridem. Solo lectura vía fridemClient.ts. |
| Capacidad de bodega | Número de casilleros del mapa principal. Default: 12 posiciones. | Campo capacity en warehouses/{id}. |
| Casillero / Slot | Celda numerada del mapa con identificadores de caja, temperatura, peso, cliente y trazas. | Objeto Slot en array slots[] del estado de bodega. |
| Caja (Box) | Unidad de carga identificada con producto, kg y trazabilidad desde su ingreso. | Objeto Box en inboundBoxes[], outboundBoxes[], dispatchedBoxes[]. |
| Código de cuenta | Código alfanumérico que agrupa catálogo, órdenes, solicitudes y vincula bodegas a un cliente. | Campo codeCuenta en usuarios, órdenes y warehouses. |
| Zona de entrada | Cola de cajas recién registradas que aún no ocupan el mapa principal. | Array inboundBoxes[] en el estado de bodega. |
| Zona de salida | Cola de cajas listas para despacho. | Array outboundBoxes[] en el estado de bodega. |
| Orden de trabajo | Instrucción de mover o revisar mercancía entre zonas. | Objeto BodegaOrder. Tipos: a_bodega, a_salida, revisar. |
| Orden de Compra (OC) | Pedido formal a proveedor con líneas (producto, cantidad/peso en kg). | Colección ordenesCompra. Estados: Iniciado → En recepción → Cerrado. Prefijo: OC-#### |
| Orden de Venta (OV) | Pedido hacia un comprador con líneas. Puede incluir bodega origen/destino y fase transporte. | Colección ordenesVenta. Ciclo hasta cierre con viaje. Prefijo: VE-#### |
| Solicitud de compra (SOL) | Pre-OC generada por la cuenta para armar un pedido al proveedor. | Colección solicitudesCompra. Prefijo: SOL-#### |
| Solicitud de procesamiento | Transformación cuenta → bodega interna con estados, kg descontados, merma y sobrante. | Colección solicitudesProcesamiento. Estados: Pendiente, Iniciado, En curso, Terminado. |
| Procesamiento | Transformación de un producto primario en un secundario. | Flujo entre SolicitudProcesamientoService y procesamientoInventarioBodega.ts. |
| Primario | Producto en su estado original (ej: filete entero). | Catálogo con isPrimario=true. |
| Secundario | Producto resultante del procesamiento (ej: porciones). | Catálogo con isSecundario=true. |
| Merma / Desperdicio | Kg declarados que no reingresan al inventario. | Acumulada en history vía recordMermaProcesamientoKg(). Visible en reportes. |
| Sobrante | Kg fraccionarios del primario que sí se devuelven al mapa. | Genera orden de devolución al slot de primario correspondiente. |
| Cartonaje | Proceso de empaque de mercancía contra una OV para despacho. | Ingreso de cajas desde OV ejecutado por el custodio. |
| Viaje de transporte | Registro de entrega física al comprador bajo una OV. | Documento en viajesTransporte. Prefijo: TV-####. Numeración única via systemCounters. |
| Despacho | Salida física de mercancía de la bodega hacia el camión. | Movimiento de outboundBoxes a dispatchedBoxes[]. |


---


## 8. Flujos de negocio end-to-end

Casos reales de operación de la plataforma


### Flujo 8.1 — Solo compra y stock (sin venta ni procesamiento)

**Actores: operadorCuentas (cuenta MIT), proveedor Frigorífico Sur, custodio, jefe, operario.**

| # | Actor | Acción |
| --- | --- | --- |
| 1 | OperadorCuentas | Da de alta el producto 'Pechuga congelada'. Crea OC-0042 por 2.000 kg a Frigorífico Sur y marca fecha de llegada. La OC pasa a estado Transporte. |
| 2 | Custodio | Recibe 1.980 kg (faltaron 20 kg). Cierra recepción con diferencias. La OC queda Cerrado(ok) o Cerrado(no ok) según política del negocio. |
| 3 | Custodio | Registra cuatro cajas en la zona de entrada, vinculadas a la OC. |
| 4 | Jefe | Crea cuatro órdenes de trabajo 'a bodega' para los casilleros 3, 4, 7 y 8. |
| 5 | Operario | Toma las órdenes de la cola y las ejecuta. Cada caja pasa de entrada a su casillero. |
| 6 | Sistema | Inventario en vivo refleja 1.980 kg repartidos. Historial registra ingresos y movimientos. Reportes muestran el stock. |


### Flujo 8.2 — Venta con viaje hasta el comprador

**Actores: misma cuenta, custodio en bodega origen, transporte, comprador Supermercados Norte.**

| # | Actor | Acción |
| --- | --- | --- |
| 1 | OperadorCuentas | Crea venta VE-0015 por 500 unidades contra catálogo existente. |
| 2 | Custodio | Realiza el cartonaje contra la OV: registra físicamente las cajas a despachar, línea por línea. |
| 3 | Jefe/Sistema | La venta pasa a Transporte. Se genera viaje TV-0048 con líneas esperadas y camión de la flota asignado. |
| 4 | Transporte | Abre el viaje, verifica las líneas. Carga foto del pallet, marca 500 unidades conformes (o menos + incidencia), firma en pantalla. |
| 5 | Sistema | Cierra el viaje. La OV pasa a Cerrado(ok) o Cerrado(no ok) según conformidad. El stock en mapa se reduce. |


### Flujo 8.3 — Procesamiento con merma y sobrante

**Actores: cliente, jefe, procesador.**

| # | Actor | Acción |
| --- | --- | --- |
| 1 | Cliente | Crea solicitud de procesamiento por 500 kg de 'Carne en bloque' (primario) hacia 'Lonchas empaquetadas' (secundario), en bodega B-01. |
| 2 | Jefe | Asigna la solicitud al procesador Juan. |
| 3 | Procesador (Juan) | Pasa la solicitud a En curso. El sistema resta 500 kg de los casilleros donde había ese producto. |
| 4 | Procesador (Juan) | Declara: merma 15 kg (pérdida real) y sobrante 8 kg de bloque que vuelve al producto primario. Pasa a Terminado. |
| 5 | Sistema | Registra mermaProcesamientoKgTotal +15 en historial. Genera órdenes de trabajo: una para ubicar lonchas en casillero libre, otra para reintegrar los 8 kg de bloque. |
| 6 | Operario | Ejecuta las órdenes generadas. Reportes de procesamiento cuadran kg. |


### Casos borde y combinaciones

| Situación | Qué cambia en el flujo |
| --- | --- |
| Solicitud de compra (SOL) en lugar de OC formal | La cuenta arma SOL-#### en kg. Al confirmar puede disparar el webhook al proveedor via n8n. Luego puede existir OC o ingreso directo según operación real. |
| Bodega externa | No se escribe el mapa local. Se lee inventario remoto para pantallas y reportes. La operación real sigue en el otro sistema (Fridem). |
| Solo transporte | El rol transporte nunca ve el mapa. Solo ve viajes abiertos y cierra con evidencia fotográfica, firma y cantidades. |
| Llamada al jefe | El operario escala. Queda registro en el estado de bodega para auditoría operativa. |
| Cliente sin tocar bodega | cliente/operadorCuentas vive en órdenes, catálogo y reportes. La operación física la tienen custodio, jefe y operario. |


---


## 9. Architecture Decision Records (ADRs)

*Decisiones técnicas importantes y su justificación*

Los ADRs documentan las decisiones técnicas importantes y —más valioso aún— el motivo por el que se tomaron. Son la memoria arquitectural del proyecto.

> **Nota.** Los ADRs de este proyecto están pendientes de documentación formal. A continuación, se registran las decisiones identificadas en el código fuente.


### Plantilla para nuevos ADRs

| Campo | Contenido esperado |
| --- | --- |
| Título | ADR-001: Descripción de la decisión |
| Estado | Propuesto / Aceptado / Deprecado / Rechazado |
| Contexto | Qué situación o problema motivó la decisión |
| Opciones consideradas | Las alternativas que se evaluaron |
| Decisión | Qué se eligió y por qué |
| Consecuencias | Qué implica esta decisión (pros y contras) |


### ADRs identificados en el código

| ID | Decisión | Justificación identificada |
| --- | --- | --- |
| ADR-001 | Firestore como base de datos principal | Soporta suscripciones en tiempo real nativas. Elimina la necesidad de websockets personalizados para el estado de bodega en vivo. |
| ADR-002 | Merge en lugar de sobreescritura en saveWarehouseState() | Permite que múltiples usuarios actualicen campos distintos del estado simultáneamente sin pisarse. Crítico en operación multi-usuario. |
| ADR-003 | Cloudinary solo desde servidor (API route) | El API Secret de Cloudinary no puede exponerse al cliente. La ruta /api/evidencia-transporte actúa como proxy seguro. |
| ADR-004 | BodegaDashboard.tsx como orquestador monolítico | Decisión de velocidad inicial de desarrollo. El README del proyecto ya identifica esto como deuda técnica a refactorizar en hooks de dominio. |
| ADR-005 | Dos colecciones de usuarios (users y usuarios) | Compatibilidad con datos legacy. La colección users es el perfil de Auth; usuarios es el catálogo operativo. Pendiente unificación. |


---


## 10. Documentación de testing

*Cómo verificar que el sistema funciona correctamente*

> **Nota.** Esta es una vista general. El detalle vivo (frameworks, conteos y casos críticos por repo) está en la referencia **Testing** del Dev Hub (`/referencia/testing/bodega-frio`), sincronizada con los cuatro repositorios.

### Framework y comandos por repositorio

Cada repositorio de Polaria WMS tiene su propio framework:

| Repositorio | Framework | Cobertura | Comandos |
| --- | --- | --- | --- |
| polaria-wms-api | Jest + ts-jest + Supertest (e2e) | 37 spec unit (~212 casos) + 11 suites e2e (47 casos) | `npm test`, `npm run test:e2e`, `npm run test:cov` |
| polaria-wms-web | Vitest + Testing Library + jsdom | 124 archivos `*.test.tsx` co-localizados | `npm test`, `npm run test:watch` |
| Widget-react | Vitest + happy-dom | 8 archivos, 62 casos (módulos `lib/` + embed) | `npm run test` |
| polaria-wms-db | Scripts SQL de validación | validate-rls-*, validate-mapa-pol141, validate-widget-auth-pol137 | `supabase db push`, `psql < scripts/validate-*.sql` |

### Qué se testea

| Área | Qué cubre |
| --- | --- |
| Autenticación / SSO | auth.service.spec, auth.e2e, token de widget (POL-137) |
| Aislamiento tenant | tenant-scope.util + tenant-isolation.e2e (cross-tenant rechazado) |
| Compras | solicitud-compra.service, orden-compra.service |
| Inventario / mapa | FEFO y locks de warehouse_state, warehouse-state-lock.e2e (POL-141) |
| Operaciones y procesamiento | operaciones.e2e, operaciones-tareas.e2e, procesamiento-flujo.e2e |
| Web — navegación por rol | navigation-role-gate.integration.test (nav ↔ RBAC) |
| Widget Mateo | authToken, webhook, conversationApi, cloudinary, storage, embed |

### Convención para nuevos tests

- API (Jest): archivos `*.spec.ts` junto al código; e2e en `test/*.e2e-spec.ts` con Supertest.
- Web (Vitest): archivos `*.test.tsx` co-localizados; mockear Supabase con `create-supabase-mock.ts`.
- Nombrar los casos por comportamiento observable (dado/cuando/entonces), no por implementación.
- Cada corrección de bug debe llegar con un test que reproduzca el fallo.

### Casos críticos a cubrir

- RLS multi-tenant: ningún rol lee/escribe fuera de su empresa → cuenta → bodega.
- Máquinas de estado (SOL, OC, OV, OT, procesamiento): transiciones válidas e inválidas.
- Recepción por conciliación ciega: diferencias de cantidad y temperatura fuera de rango.
- Concurrencia en el mapa: lock/unlock de posiciones y `warehouse_state.version` (POL-141).
- SSO Mateo: código de un solo uso (60s) y JWT de widget (300s): expiración y reintento 401.

### Integración continua

polaria-wms-api corre GitHub Actions (`.github/workflows/ci.yml`): Node 20 → `npm ci` → `build` → `test` → `test:e2e` en cada push/PR a `main`.


---


## 11. Runbooks de operación y deployment

Procedimientos paso a paso para operar el sistema

### Runbook 1 — Deploy a producción

1. Verificar que la rama main esté al día con todos los PRs aprobados
2. Ejecutar npm run test:all localmente y confirmar que pasa
3. Ejecutar npm run build y confirmar que compila sin errores
4. Hacer push a la rama de producción o disparar el pipeline de CI/CD
5. Verificar en la plataforma de hosting (Vercel/Railway) que el deploy fue exitoso
6. Probar el login con un usuario real en producción
7. Verificar que el estado de una bodega carga correctamente
8. Si algo falla: ver sección de rollback a continuación

### Runbook 2 — Rollback

1. Identificar el último commit estable en main
2. En Vercel/Railway: ir a Deployments → seleccionar el deploy anterior → Promote to Production
3. Verificar que la app funciona con el deploy anterior
4. Notificar al equipo del rollback y la causa

### Runbook 3 — Crear una bodega nueva

1. Ingresar con rol configurador
2. Ir a la tab Configuración → Bodegas
3. Completar: nombre, capacidad (número de slots), tipo (interna/externa)
4. Guardar. El sistema crea el documento en warehouses/{id} y llama a ensureWarehouseState()
5. Asignar la bodega a un código de cuenta via Configuración → Asignar bodegas

### Runbook 4 — Diagnosticar estado de bodega inconsistente

1. Verificar en Firebase Console → Firestore → warehouses/{id}/state/main que el documento existe
2. Revisar los arrays slots[], inboundBoxes[], outboundBoxes[] en busca de registros con campos undefined (Firestore los rechaza)
3. Si hay campos undefined: el código tiene un bug en el strip de undefined antes de guardar. Reportar como issue.
4. Revisar en los logs del servidor si hay errores de escritura recientes

### Runbook 5 — Gestión de secretos (rotación de credenciales)

1. Cloudinary: ir al panel de Cloudinary → API Keys → Generar nueva key. Actualizar CLOUDINARY_URL en las variables de entorno del hosting. Reiniciar el servidor.
2. Firebase: no se rotan las API Keys del cliente (son públicas). Si hay brecha, actualizar las Firestore Security Rules.
3. n8n webhook URL: actualizar PEDIDO_PROVEEDOR_WEBHOOK_URL en app/config/pedidoProveedorIntegracion.ts y hacer deploy.


---


## 12. Guía de onboarding para nuevos desarrolladores

Ser productivo en el primer día


### Día 1 — Configuración del entorno

- Leer el README.md completo (sección 1 de este documento)
- Clonar el repositorio y seguir los pasos de instalación (sección 5)
- Solicitar al configurador las credenciales de acceso para entorno de desarrollo
- Configurar .env.local con las variables del equipo
- Ejecutar npm run dev y verificar que la app corre en localhost:3000
- Hacer login con los atajos de rol para familiarizarse con cada perspectiva
- Día 1 — Comprensión del proyecto
- Leer esta documentación completa, especialmente secciones 7 (Glosario) y 8 (Flujos)
- Abrir BodegaDashboard.tsx y trazar el flujo de autenticación hasta la carga del mapa
- Explorar app/services/ e identificar los servicios de un dominio (ej: ordenCompraService.ts)
- Ejecutar npm run test para ver qué lógicas tienen cobertura


### Mapa del equipo — A quién preguntar qué

| Área | Responsable / Contacto |
| --- | --- |
| Arquitectura y Firebase | Desarrollador principal del proyecto |
| Credenciales de Firebase (prod) | Administrador del proyecto Firebase |
| Credenciales de Cloudinary | Responsable de infraestructura |
| Lógica de negocio del dominio frío | Operador de cuentas / Jefe de operaciones |
| Acceso a n8n | Responsable de automatizaciones |


### Primer ticket recomendado

Para familiarizarse con el código, el primer ticket ideal es uno relacionado con la capa de servicios (app/services/) o los helpers de lib/. Evitar como primer ticket cambios en BodegaDashboard.tsx por su alta complejidad.


---


## 13. CHANGELOG.md

*Historial de versiones del proyecto*

> **Archivo referenciado.** CHANGELOG.md

El CHANGELOG.md registra todos los cambios notables del proyecto. Cualquier persona puede saber qué cambió, cuándo y por qué sin necesidad de revisar el historial de commits.


### Convención utilizada

Formato: Keep a Changelog (https://keepachangelog.com)

Versionado: Semantic Versioning — ver sección 17 de este documento

Cada versión documenta: Added, Changed, Deprecated, Removed, Fixed, Security


### Versión actual

| Versión | Estado |
| --- | --- |
| [1.0.0] — 2026-05-01 | Primera versión productiva. Sistema completo multi-rol y multi-bodega. |
| [Unreleased] | Extracción de módulos desde BodegaDashboard.tsx, Security Rules, tests de servicios. |

> **Nota.** Ver el archivo CHANGELOG.md en la raíz del repositorio para el detalle completo de cada versión.


---


## 14. Documentación de seguridad y autenticación

Modelo de acceso, secretos y recomendaciones


### Autenticación

El sistema usa Firebase Authentication con login por email y contraseña. No hay SSO ni login social implementado en la versión actual.

Al autenticarse, Firebase devuelve un UID que se usa para cargar el perfil desde Firestore

La sesión se mantiene mientras el token de Firebase sea válido (renovación automática)

El logout invalida la sesión local y redirige al login


### Autorización (RBAC)

El sistema implementa control de acceso basado en roles. El rol del usuario determina qué tabs ve, qué acciones puede ejecutar y a qué datos tiene acceso.

| Rol | Acceso al mapa de bodega |
| --- | --- |
| administrador | Solo lectura. Ve todos los slots pero no puede moverlos. |
| custodio | Ve el mapa. Puede registrar ingresos y crear órdenes de trabajo. |
| jefe | Ve el mapa completo. Crea y gestiona órdenes de trabajo. |
| operario | Ve el mapa. Ejecuta órdenes de trabajo desde su cola. |
| procesador | Ve el mapa. Ejecuta tareas de procesamiento asignadas. |
| cliente / operadorCuentas | NO ve el mapa físico. Solo órdenes, catálogo y reportes propios. |
| transporte | NO ve el mapa. Solo su panel de viajes en curso. |
| configurador | NO ve el mapa. Solo panel de administración del sistema. |

> **Nota.** La autorización en cliente puede ser burlada por usuarios con conocimiento técnico. Las Firestore Security Rules son la verdadera barrera de seguridad en el servidor. DEBEN configurarse antes de pasar a producción con datos reales.


### Manejo de secretos

| Secreto | Regla de manejo |
| --- | --- |
| CLOUDINARY_API_SECRET | NUNCA usar prefijo NEXT_PUBLIC_. Solo accesible en rutas API server-side. |
| Credenciales Firebase (NEXT_PUBLIC_) | Son públicas por diseño. Proteger el acceso con Security Rules de Firestore, no con secretismo de las keys. |
| PEDIDO_PROVEEDOR_WEBHOOK_URL | En código fuente (app/config/). Proteger el endpoint n8n con autenticación propia en n8n. |
| Contraseñas de usuarios | Gestionadas por Firebase Auth. El sistema nunca las almacena ni las ve. |
| Evidencias fotográficas | Almacenadas en Cloudinary. URLs guardadas en Firestore. |


### Recomendaciones para producción

Implementar Firestore Security Rules que reflejen el modelo de roles del sistema

Deshabilitar NEXT_PUBLIC_ENABLE_LOGIN_ROLE_SHORTCUTS en producción

Usar CLOUDINARY_URL (opción A) para evitar mezcla de credenciales entre entornos

Configurar rate limiting en las rutas API (/api/evidencia-transporte y /api/pedido-proveedor)

Revisar periódicamente los usuarios activos en Firebase Auth y desactivar los que ya no operan


---


## 15. Definición de entornos

dev, staging y producción

| Aspecto | Desarrollo (dev) | Producción (prod) |
| --- | --- | --- |
| Archivo de config | .env.local | .env.production o variables del hosting |
| Firebase project | Proyecto de prueba dedicado | Proyecto productivo con datos reales |
| Atajos de login | Activos (NODE_ENV=development) | DESACTIVADOS. NEXT_PUBLIC_ENABLE_LOGIN_ROLE_SHORTCUTS no definida |
| Cloudinary | Puede usar unsigned preset | Usar CLOUDINARY_URL firmada |
| Firestore Rules | Permisivas para facilitar desarrollo | Restrictivas. RBAC completo implementado |
| n8n webhook | URL de instancia de prueba | URL de instancia productiva |
| Fridem | Puede apuntar a datos de prueba | Credenciales reales del proyecto Fridem |


### Staging (recomendado)

Aunque no está formalmente configurado, se recomienda crear un entorno de staging con:

Proyecto Firebase separado (ni dev ni prod)

Mismas variables de entorno que producción pero con datos de prueba

Deploy automático desde la rama develop o release/*

Único entorno donde probar cambios antes de llegar a producción


### Promoción de código entre entornos

| Flujo | Descripción |
| --- | --- |
| dev → staging | Merge de rama feature/* a develop. CI/CD despliega automáticamente a staging. |
| staging → prod | PR de develop a main con aprobación. CI/CD despliega a producción. |
| Hotfix | Rama hotfix/* sale de main y se mergea directo a main. Backport a develop. |


---


## 16. Guía de observabilidad y monitoreo

*Cómo saber que el sistema está funcionando*

Esta sección está pendiente de implementación formal. A continuación, se documentan las recomendaciones para una versión productiva.


### Herramientas recomendadas

| Propósito | Herramienta recomendada |
| --- | --- |
| Monitoreo de errores frontend | Sentry (SDK de Next.js disponible) |
| Logs del servidor | Vercel Logs o Railway Logs según plataforma de hosting |
| Monitoreo de Firebase | Firebase Console → Usage and Billing + Alertas de cuota |
| Uptime monitoring | UptimeRobot o Checkly para alertas si la app cae |
| Performance | Vercel Analytics o Firebase Performance Monitoring |


### Métricas clave a monitorear

Tasa de errores en /api/evidencia-transporte (Cloudinary) y /api/pedido-proveedor (n8n)

Latencia de las suscripciones de Firestore (subscribeWarehouseState)

Tiempo de carga inicial del dashboard por rol

Cuota de lecturas/escrituras de Firestore (Firebase Console)

Errores de autenticación (Firebase Auth logs)

> **Nota.** Sin observabilidad configurada, los errores en producción solo se conocen cuando un usuario los reporta. Implementar Sentry es la acción de mayor impacto en el corto plazo.


---


## 17. Política de versionado semántico (SemVer)

*Cómo se numeran las versiones del proyecto*

El proyecto sigue Semantic Versioning (semver.org). El formato es MAJOR.MINOR.PATCH.

| Componente | Cuándo incrementar | Ejemplo |
| --- | --- | --- |
| MAJOR | Cambios que rompen compatibilidad con la versión anterior | 1.0.0 → 2.0.0 |
| MINOR | Nuevas funcionalidades compatibles con la versión anterior | 1.0.0 → 1.1.0 |
| PATCH | Corrección de bugs sin nuevas funcionalidades | 1.0.0 → 1.0.1 |


### ¿Qué constituye un cambio MAJOR en este proyecto?

Cambio en la estructura de warehouses/{id}/state/main que requiere migración de datos

Cambio en el modelo de roles que elimina o renombra roles existentes

Cambio en el contrato de las rutas API (/api/evidencia-transporte o /api/pedido-proveedor)

Eliminación de colecciones o campos de Firestore que usan versiones anteriores


---


## 18. Notas de migración entre versiones mayores

Cómo migrar cuando hay cambios que rompen compatibilidad Para cada versión MAJOR, este documento debe incluir una sección de migración. A continuación, se establece la plantilla y los escenarios conocidos.


### Plantilla para notas de migración

| Campo | Contenido esperado |
| --- | --- |
| Versión | De X.x a Y.0 |
| Qué cambió | Descripción del cambio que rompe compatibilidad |
| Impacto | Qué usuarios o integraciones se ven afectados |
| Pasos para migrar | Instrucciones ordenadas para hacer la transición |
| Script de migración | Si aplica, script para migrar datos en Firestore |
| Tiempo estimado | Estimación del tiempo que toma la migración |
| Rollback | Cómo revertir si la migración falla |


### Migraciones conocidas pendientes

| Escenario | Descripción |
| --- | --- |
| Unificación users + usuarios | La colección 'users' es un espejo legacy de 'usuarios'. La migración implica consolidar todos los documentos en una sola colección y actualizar todas las lecturas en BodegaDashboard.tsx. |
| Normalización de estados legacy | Algunos documentos de órdenes antiguas pueden tener valores de estado no normalizados. Requiere script de migración en Firestore. |


---


## 19. Storybook o catálogo de componentes UI

*Documentación visual de componentes*

Storybook no está implementado en la versión actual. Esta sección documenta los componentes UI atómicos identificados y los pasos para implementarlo.


### Componentes UI atómicos identificados

| Componente | Descripción |
| --- | --- |
| app/components/bodega/SlotCard.tsx | Tarjeta visual de un slot del mapa de bodega. |
| app/components/bodega/SlotsGrid.tsx | Grilla completa del mapa de bodega. |
| app/components/bodega/LoginCard.tsx | Formulario de login con atajos de rol. |
| app/components/bodega/Header.tsx | Encabezado del dashboard con navegación. |
| app/components/bodega/MessageBanner.tsx | Banner de mensajes de estado del sistema. |
| app/components/bodega/RequestsQueue.tsx | Cola de solicitudes pendientes para operarios. |
| app/components/bodega/SearchForm.tsx | Formulario de búsqueda de cajas. |
| app/components/bodega/MoveForm.tsx | Formulario para mover una caja entre zonas. |
| app/components/ui/ModalPlantilla.tsx | Shell genérico de modal reutilizable. |

> **Nota.** Implementar Storybook permitiría revisar y testear estos componentes de forma aislada, sin necesidad de levantar todo el sistema. Especialmente útil para SlotCard y SlotsGrid.


---


## 20. Compliance y normativas aplicables

*Regulaciones y estándares a considerar*

Esta sección documenta las normativas identificadas que aplican al sistema en función de los datos que maneja y el sector en el que opera.


### Normativas identificadas

| Normativa | Aplicabilidad al sistema |
| --- | --- |
| Protección de datos personales (GDPR / Ley local) | El sistema almacena nombres de usuarios, emails y roles en Firestore. Si opera en Colombia, aplica la Ley 1581 de 2012 (Habeas Data). Requiere política de privacidad y procedimiento de eliminación de datos. |
| Cadena de frío / BPM | Si los clientes del sistema operan en industria alimentaria, las evidencias de temperatura y trazabilidad de movimientos pueden ser requeridas por normativas de Buenas Prácticas de Manufactura (BPM) o INVIMA en Colombia. |
| Seguridad de datos en la nube | Firebase/Google Cloud tiene certificaciones SOC2 y ISO 27001. El sistema hereda estas garantías para los datos almacenados en Firestore y Storage. |
| Multi-tenancy y aislamiento de datos | En un sistema multi-cuenta, la separación de datos entre clientes es crítica. Las Firestore Security Rules deben garantizar que ningún cliente pueda leer datos de otro. |

> **Nota.** Esta sección requiere revisión por un especialista legal antes de llevar el sistema a producción con clientes reales. Los puntos identificados son una guía inicial, no asesoría legal.

Bodega de Frío — Documentación Técnica y Operacional

Versión 1.0 ·  2026 ·  Generado a partir del código fuente y la visión de producto

Archivos relacionados: README.md · CONTRIBUTING.md · CHANGELOG.md · architecture.mermaid
