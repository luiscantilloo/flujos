# Polaria WMS — Documentación técnica y operacional V2.0

| Meta | Detalle |
| --- | --- |
| Producto | Polaria WMS (referencia histórica: Bodega de Frío) |
| Estado | Jul 2026 |
| Repos auditados | `polaria-wms-web`, `polaria-wms-api`, `polaria-wms-db`, `Widget-react` |
| Dev Hub | `flujo` — documentación, diagramas, ER y referencias |
| Stack principal | Next.js 16, React 19, TypeScript, NestJS 11, Prisma 7, Supabase/Postgres, Widget-react |

> **Estado:** el sistema ya no es solo diseño V2. Hay módulos operativos reales en web/API para compras, recepción, inventario, operaciones, procesamiento, ventas, transporte y Mateo Widget.

---

## 1. Visión general

Polaria WMS es una plataforma multi-tenant, multi-bodega y multi-rol para operar bodegas de frío. Cubre el ciclo de mercancía desde compras y recepción hasta inventario, procesamiento, venta, despacho, transporte y soporte conversacional con Mateo.

### 1.1 Principios

- **Empresa → cuenta/tenant → bodega:** la empresa es el cliente jurídico; la cuenta es el tenant operativo; la bodega es el lugar físico o externo.
- **RBAC real:** cada pantalla y acción se filtra por rol, scope, cuenta y bodega.
- **RLS + API:** lecturas web con Supabase/RLS; escrituras sensibles con NestJS/Prisma y validación de tenant.
- **Trazabilidad:** movimientos, recepciones, procesamiento, transporte y auditoría quedan persistidos.
- **Soporte integrado:** Mateo puede operar como SSO externo y como widget embebido en WMS.

### 1.2 Repositorios

| Repo | Rol |
| --- | --- |
| `polaria-wms-web` | App Next.js del WMS, shell multi-rol, módulos UI, route handlers n8n/Cloudinary, host Widget Mateo |
| `polaria-wms-api` | API NestJS, Swagger, auth Supabase, guards, Prisma, dominios WMS |
| `polaria-wms-db` | Migraciones Supabase/Postgres, RLS, seeds, validadores SQL |
| `Widget-react` | Chat embebible Mateo Support, bundle `mateo-widget.js`, n8n, Cloudinary, conversaciones |
| `flujo` | Dev Hub: documentación, diagramas, referencias y manuales |

---

## 2. Estado actual de implementación

| Dominio | Estado | Evidencia funcional |
| --- | --- | --- |
| Auth WMS | Implementado | `prelogin`, `login`, `me`, `logout`, guards y dashboard por rol |
| SSO Mateo | Implementado | `mateo-handoff`, `mateo-exchange` |
| Mateo Widget | Implementado | `widget-token`, `/mateo/conversaciones`, `Widget-react` |
| Configurador | Implementado | Empresas, cuentas, bodegas, usuarios, integración |
| Administración cuenta | Implementado | Catálogos, usuarios, bodegas, reportes |
| Compras | Implementado | SOL, OC, aprobación, emisión, recepción |
| Inventario | Implementado | `warehouse_state`, lock/unlock, movimientos |
| Operaciones | Implementado | OT, tareas, alertas, llamadas, presencia |
| Procesamiento | Implementado | Solicitud, asignación, inicio, cierre, post-cierre |
| Ventas | Implementado | OV y emisión |
| Transporte | Implementado | Paquetes despacho, entregas y evidencias |
| Reportería | Parcial/operativa | Reportes web disponibles; observabilidad productiva pendiente |
| Placeholders API | Parcial | `accounts`, `audit`, `companies`, `files`, `health`, `notifications`, `settings`, `users`, `warehouses` |

---

## 3. Stack tecnológico

### 3.1 Frontend WMS (`polaria-wms-web`)

| Tecnología | Uso |
| --- | --- |
| Next.js 16 | App Router, rutas por rol, route handlers locales |
| React 19 | UI modular por dominio |
| TypeScript 5 | Tipado de servicios, componentes y contratos |
| Tailwind CSS 4 | Design system y shell |
| Supabase JS / SSR | Lecturas RLS y sesión |
| Zustand | Estado de sesión/cliente |
| Vitest + Testing Library | Tests UI y servicios |

### 3.2 Backend (`polaria-wms-api`)

| Tecnología | Uso |
| --- | --- |
| NestJS 11 | API modular |
| Prisma 7 | Modelo relacional y acceso Postgres |
| Supabase JS | Auth/admin y validación JWT |
| Swagger/OpenAPI | `GET /api/docs`, `GET /api/docs-json` |
| Jest + Supertest | Unitarios y e2e |
| SWC | Build NestJS rápido |

### 3.3 Base de datos (`polaria-wms-db`)

| Elemento | Uso |
| --- | --- |
| Supabase/PostgreSQL | Auth, RLS, Realtime y persistencia |
| Migraciones SQL 001–052 | Esquema WMS y widget Mateo |
| RLS helpers | Aislamiento por tenant y bodega |
| Seeds y validadores | Smoke tests, RLS, widget, mapa e integraciones |

### 3.4 Widget Mateo (`Widget-react`)

| Elemento | Uso |
| --- | --- |
| React 19 + Vite 8 | Build standalone y librería embebible |
| Shadow DOM | Aislamiento visual dentro del WMS |
| n8n webhook | Conversación IA canal web |
| Cloudinary | Adjuntos de imagen |
| API WMS | Token widget e historial de conversaciones |

---

## 4. Arquitectura de datos y seguridad

### 4.1 Modelo relacional

El modelo actual es **Postgres normalizado**, no un documento JSON principal. `warehouse_state` es una tabla relacional por ubicación, producto y lote; `jsonb` se usa de forma selectiva para metadata o payloads.

| Métrica | Valor |
| --- | --- |
| Modelos Prisma | 43 |
| Enums Prisma | 26 |
| Migraciones DB | 38 archivos en `migrations/` con numeración hasta 052 |
| Tablas Widget | `widget_conversacion`, `widget_mensaje` |

### 4.2 Dominios de tablas

| Dominio | Tablas principales |
| --- | --- |
| Identidad/tenant | `rol`, `empresa`, `cuenta`, `usuario`, `asignacion_bodega`, `bodega` |
| Layout | `tipo_ubicacion`, `zona`, `ubicacion`, `lote`, `warehouse_state` |
| Catálogo | `producto`, `proveedor`, `cliente`, `comprador`, `planta`, `camion` |
| Compras | `solicitud_compra`, `orden_compra`, `recepcion_compra` y líneas |
| Inventario | `movimiento_inventario`, `contador`, `registro_merma` |
| Operaciones | `orden_trabajo`, `tarea_cola`, `alerta_operativa`, `sesion_operativa` |
| Ventas/transporte | `orden_venta`, `viaje_transporte`, `guia_envio`, `evidencia_transporte` |
| Procesamiento | `solicitud_procesamiento`, `registro_merma` |
| Mateo Widget | `widget_conversacion`, `widget_mensaje` |
| Auditoría | `auditoria_operacion` |

### 4.3 RLS híbrido

| Canal | Credencial | Regla |
| --- | --- | --- |
| Web lectura | Supabase JWT usuario | RLS aplica por `codigo_cuenta` y `id_bodega` |
| API escritura | Prisma `DATABASE_URL` | Bypass RLS con validación explícita tenant/rol |
| Service role | Backend/route handlers | Solo servidor, nunca browser |

### 4.4 Guards API

| Guard | Función |
| --- | --- |
| `JwtAuthGuard` | Valida Bearer Supabase |
| `TenantGuard` | Construye contexto tenant y bodegas |
| `RolesGuard` | Aplica `@Roles(...)` |
| `SensitiveWriteGuard` | Protege locks, inventario, contadores y escrituras críticas |

---

## 5. Roles y permisos

| Rol | Scope | Función |
| --- | --- | --- |
| Configurador | Plataforma | Crea empresas, cuentas, bodegas, usuarios iniciales e integración |
| Administrador de cuenta | Cuenta | Mantiene tenant, catálogos, usuarios, bodegas y reportes |
| Operador de cuenta | Cuenta | Gestiona SOL, OC, OV e integración bodega externa |
| Administrador de bodega | Bodega | Supervisa estado, capacidad y reportes de bodega |
| Jefe de bodega | Bodega | Asigna prioridades, tareas, alertas y procesamiento |
| Custodio | Bodega | Recibe mercancía, valida OC/OV e ingreso/salida |
| Operario | Bodega | Ejecuta OT, movimientos y tareas físicas |
| Procesador | Bodega | Ejecuta solicitudes de procesamiento |
| Transportista | Bodega | Registra viajes, entregas y evidencias |

> Para instrucciones paso a paso por rol, ver el documento **Polaria WMS — Manual de usuario por rol** en `/documentacion/manual-usuario-polaria-wms`.

---

## 6. Rutas principales del frontend

| Área | Rutas |
| --- | --- |
| Auth | `/login`, `/auth/sso` |
| Configurador | `/configurador`, `/configurador/creacion/*`, `/configurador/asignacion/*`, `/configurador/integracion` |
| Dashboard | `/dashboard` redirige según rol |
| Administración cuenta | `/dashboard/administracion/*` |
| Compras | `/dashboard/compras`, `/dashboard/ingreso` |
| Bodega interna/externa | `/dashboard/bodega-interna/*`, `/dashboard/bodega-externa/*` |
| Estado bodega | `/dashboard/administrador-bodega/estado-bodega`, `/dashboard/jefe-bodega/estado-bodega` |
| Custodio | `/dashboard/custodio/ingreso`, `/dashboard/custodio/orden-compra`, `/dashboard/custodio/orden-venta` |
| Operario | `/dashboard/operario/operacion` |
| Procesador | `/dashboard/procesador/operacion` |
| Inventario | `/dashboard/mapa` |
| Procesamiento | `/dashboard/procesamiento` |
| Ventas | `/dashboard/ventas` |
| Transporte | `/dashboard/transporte` |
| Reportería | `/dashboard/reporteria` |

### 6.1 Redirección por rol

| Rol | Destino típico |
| --- | --- |
| Administrador bodega | Estado bodega |
| Jefe bodega | Estado bodega |
| Custodio | Ingreso custodio |
| Operario | Operación operario |
| Procesador | Operación procesador |
| Transportista | Transporte |
| Operador cuenta | Hub cuenta |
| Administrador cuenta | Administración |

---

## 7. API — polaria-wms-api

Fuente viva: `/referencia/api/bodega-frio`. Swagger: `GET /api/docs`.

### 7.1 Dominios HTTP

| Dominio | Endpoints principales |
| --- | --- |
| Sistema | `/`, `/api/docs`, `/api/docs-json` |
| Auth | `/auth/prelogin`, `/auth/login`, `/auth/me`, `/auth/logout`, Mateo SSO/widget |
| Usuarios | `/configurador/usuarios`, `/administracion/usuarios` |
| Configuración | `/configuracion/bodegas`, layout, empresas, cuentas |
| Integración | `/integracion/solicitudes`, `/configurador/integracion/solicitudes` |
| Compras | `/compras/solicitudes`, `/compras/ordenes`, `/compras/recepciones`, `/compras/bodegas-destino` |
| Inventario | `/inventario/warehouse-state`, lock/unlock, `/inventario/movimientos` |
| Operaciones | `/operaciones/ordenes-trabajo`, tareas, alertas, llamadas, reportes, presencia |
| Procesamiento | `/procesamiento/solicitudes/*` |
| Ventas | `/ventas/ordenes`, emitir |
| Transporte | `/transporte/paquetes-despacho`, `/transporte/entregas` |
| Mateo Widget | `/mateo/conversaciones` |

### 7.2 Route handlers web

| Ruta | Uso |
| --- | --- |
| `/api/pedido-proveedor` | Webhook n8n para OC |
| `/api/solicitud-compra` | Webhook n8n para SOL |
| `/api/evidencia-transporte` | Cloudinary evidencias |
| `/api/operaciones/sync-demora-alertas` | Sincronización alertas demora |
| `/api/ventas/productos-catalogo` | Catálogo ventas server-side |
| `/login/resolve-tenant` | Resolución de empresa/tenant en login |

---

## 8. Flujos operativos

### 8.1 Onboarding cliente

```text
Configurador
→ crea empresa
→ crea cuenta/tenant
→ crea bodega
→ bootstrap layout
→ crea administrador de cuenta
→ admin cuenta carga catálogos y usuarios
```

### 8.2 Compra y recepción

```text
Operador/Admin cuenta
→ crea SOL
→ envía aprobación
→ aprueba/rechaza
→ convierte a OC
→ emite OC
→ custodio cierra recepción contra OC
→ inventario/operación recibe tareas
```

### 8.3 Inventario y operaciones

```text
Jefe/Admin bodega
→ revisa estado bodega
→ crea/asigna OT o alerta
→ operario ejecuta tarea
→ API registra movimiento y actualiza warehouse_state
→ auditoría conserva trazabilidad
```

### 8.4 Procesamiento

```text
Cuenta crea solicitud
→ jefe asigna operario/procesador
→ se inicia procesamiento
→ se descuenta insumo
→ se registra resultado, merma y sobrante
→ se aplican órdenes post-cierre
```

### 8.5 Venta y transporte

```text
Cuenta emite OV
→ se prepara salida
→ se crea paquete de despacho
→ transportista registra entrega
→ se guarda evidencia
→ se cierra viaje/entrega
```

### 8.6 Mateo Support

```text
Usuario WMS abre widget
→ web pide /auth/mateo/widget-token
→ Widget-react envía mensaje a n8n
→ API guarda conversación/mensajes
→ Supabase aplica RLS por cuenta
```

---

## 9. Variables de entorno

### 9.1 API

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto API |
| `SUPABASE_URL` | Proyecto Supabase |
| `SUPABASE_ANON_KEY` | Auth/login |
| `SUPABASE_SERVICE_ROLE_KEY` | Operaciones admin servidor |
| `DATABASE_URL` | Prisma/Postgres |
| `MATEO_HANDOFF_SECRET` | SSO WMS ↔ Mateo |
| `MATEO_ALLOWED_ORIGINS` | CORS |
| `MATEO_WIDGET_JWT_SECRET` | Firma JWT widget |
| `MATEO_WIDGET_JWT_ISSUER` | Issuer JWT widget |
| `MATEO_WIDGET_JWT_AUDIENCE` | Audience JWT widget |
| `MATEO_WIDGET_JWT_KID` | Key id JWT widget |

### 9.2 Web

| Variable | Uso |
| --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | API Nest |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase browser |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key pública RLS |
| `NEXT_PUBLIC_MATEO_WIDGET_SRC` | Bundle Widget-react |
| `NEXT_PUBLIC_MATEO_URL` | Mateo externo/SSO |

### 9.3 Widget-react

| Variable | Uso |
| --- | --- |
| `VITE_N8N_WEBHOOK_URL` | Webhook chat |
| `VITE_CLOUDINARY_CLOUD_NAME` | Adjuntos imagen |
| `VITE_CLOUDINARY_UPLOAD_PRESET` | Upload unsigned |

---

## 10. Testing

Fuente viva: `/referencia/testing/bodega-frio`.

| Repo | Testing |
| --- | --- |
| `polaria-wms-web` | Vitest + Testing Library; 125 archivos de test |
| `polaria-wms-api` | Jest + Supertest; 37 unitarios + 11 e2e |
| `polaria-wms-db` | Validadores SQL para RLS, widget, mapa y schema |
| `Widget-react` | Vitest + happy-dom; contrato embed y lib |
| `flujo` | ESLint + Vite build + generación docs/ER |

### 10.1 Casos críticos

- Auth y redirección por rol.
- Tenant isolation y RLS.
- Alta empresa/cuenta/bodega.
- SOL → OC → recepción.
- Locking de `warehouse_state`.
- OT, tareas, alertas y presencia.
- Procesamiento con merma/sobrante.
- OV, transporte y evidencias.
- Mateo SSO y Widget.

---

## 11. Recursos de desarrollo

La ruta `/recursos` resume comandos y stack. Comandos principales:

| Repo | Comando | Uso |
| --- | --- | --- |
| `flujo` | `npm run dev` | Dev Hub local |
| `flujo` | `npm run build` | Verifica docs, schema y build |
| `polaria-wms-web` | `npm run dev` | Next.js WMS |
| `polaria-wms-web` | `npm test` | Tests frontend |
| `polaria-wms-api` | `npm run start:dev` | API Nest |
| `polaria-wms-api` | `npm test && npm run test:e2e` | Tests API |
| `polaria-wms-db` | `psql -f scripts/validate-rls-multitenant.sql` | Validar RLS |
| `Widget-react` | `npm run build:lib` | Bundle embebible |

---

## 12. Operación y soporte

### 12.1 Checklist soporte

1. Identificar usuario, correo, rol y empresa.
2. Confirmar cuenta/tenant y bodega activa.
3. Confirmar ruta/pantalla.
4. Preguntar acción exacta y mensaje de error.
5. Validar si el rol puede ejecutar esa acción.
6. Separar el problema: UI, API, DB/RLS, integración, datos o permisos.
7. Escalar con hora, usuario, tenant, ruta y evidencia.

### 12.2 Escalamiento por área

| Síntoma | Equipo |
| --- | --- |
| Pantalla no carga o menú incorrecto | Frontend WMS |
| 401/403 o token | API Auth/RBAC |
| Datos de otro tenant o falta de datos | DB/RLS/API tenant |
| Lock/inventario inconsistente | API Inventory + DB |
| n8n no responde | Integraciones |
| Foto/evidencia falla | Cloudinary/web route handler |
| Widget Mateo no abre | Widget-react + API auth |
| Historial Mateo no guarda | API mateo-widget + DB `widget_*` |

---

## 13. Pendientes técnicos

| Prioridad | Pendiente |
| --- | --- |
| Alta | Pruebas de carga, SLOs y rate limits por tenant |
| Alta | Observabilidad productiva: métricas, alertas, logs centralizados |
| Media | DR documentado: RPO/RTO, restore y simulacros |
| Media | Automatizar validadores SQL DB en CI |
| Media | Completar controllers dedicados para carpetas placeholder API |
| Baja | Storybook/catálogo UI |
| Baja | Documentar compliance específico si aplica por cliente |

---

## 14. Enlaces dentro del Dev Hub

| Recurso | Ruta |
| --- | --- |
| Manual de usuario | `/documentacion/manual-usuario-polaria-wms` |
| Referencia API | `/referencia/api/bodega-frio` |
| Referencia testing | `/referencia/testing/bodega-frio` |
| Modelo de datos | `/referencia/database/bodega-frio` |
| Seguridad/RBAC | `/referencia/security/bodega-frio` |
| Recursos | `/recursos` |
| Paso a paso | `/paso-a-paso/bodega-frio` |
