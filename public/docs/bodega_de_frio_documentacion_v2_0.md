# POLARIA WMS — DOCUMENTACIÓN TÉCNICA V2.0 (ACTUALIZADA JUL 2026)

| Meta | Detalle |
| --- | --- |
| Producto | **Polaria WMS** (referencia histórica: Bodega de Frío V2) |
| Repos principales | [polaria-wms-web](https://github.com/PolariaTech/polaria-wms-web) · [polaria-wms-api](https://github.com/PolariaTech/polaria-wms-api) · [polaria-wms-db](https://github.com/PolariaTech/polaria-wms-db) · [Widget-react](https://github.com/PolariaTech/Widget-react) |
| Hub de documentación | [flujos](https://flujos-nine.vercel.app) |
| Fecha de actualización | **Julio 2026** |

> Estado actual: el flujo operativo principal está implementado en web + api + bd.  
> Deudas abiertas: permisos puntuales, cobertura e2e con BD real y runbooks de resiliencia.

---

## 1. Visión general y contexto

Polaria WMS es una plataforma SaaS multiempresa y multitenant para operación de bodega fría.  
La solución cubre:

- configuración de empresa/tenant/bodegas,
- operación de compras (SOL, OC, recepción),
- inventario en vivo por slot (`warehouse_state`) con bloqueo operativo,
- procesamiento y merma,
- ventas/despacho/transporte con evidencia,
- soporte conversacional mediante Mateo Widget.

### 1.1 Empresa vs tenant

| Concepto de negocio | Entidad técnica | Scope |
| --- | --- | --- |
| Empresa | `empresa` / `codigo_empresa` | Contractual/comercial |
| Tenant | `cuenta` / `codigo_cuenta` | Operación de negocio |
| Bodega | `bodega` / `id_bodega` | Operación física |
| Usuario | `usuario` + `id_rol` | Permisos y navegación |

Regla clave: **el aislamiento operativo se hace por tenant (`codigo_cuenta`) y bodega cuando aplica**.

---

## 2. Qué cambió de la versión anterior al estado Jul 2026

| Dominio | Estado nuevo |
| --- | --- |
| Mapa operativo | Lock/unlock de slots + sincronización visual stock/estado de slot |
| Inventario | FEFO en backend para selección de lote en flujos críticos |
| Compras | SOL, OC y cierre de recepción con conciliación |
| Operaciones | OT, tareas, alertas, llamadas y reportes de bodega |
| Procesamiento | Solicitudes, asignaciones y cierre con merma |
| Transporte | Paquetes de despacho y registro de entrega |
| Soporte | Widget Mateo embebible con historial remoto |

---

## 3. Arquitectura actual del ecosistema Polaria

### 3.1 Capas de aplicación

| Capa | Repositorio | Stack | Rol |
| --- | --- | --- | --- |
| Frontend WMS | `polaria-wms-web` | Next.js 16, React 19, Tailwind 4, Vitest | UI por rol, realtime, formularios y tableros |
| Backend WMS | `polaria-wms-api` | NestJS 11, Prisma 7, Jest | Reglas de negocio, validaciones, endpoints |
| Base de datos | `polaria-wms-db` | PostgreSQL/Supabase, RLS, migraciones SQL | Persistencia transaccional, seguridad por fila |
| Widget soporte | `Widget-react` | React 19, Vite, Vitest | Chat Mateo embebible y persistencia de conversaciones |
| Hub documentación | `flujos` | Vite + React | Centro documental y diagramas |

### 3.2 Lectura vs escritura (modelo híbrido)

- **Lectura cliente**: `supabase-js` + JWT con RLS (principalmente consultas y realtime).
- **Escritura sensible**: API Nest con Prisma y `DATABASE_URL` (bypass RLS controlado).
- **Evidencias e integraciones**: route handlers y servicios server-side para n8n/Cloudinary.

---

## 4. Roles y modelo operativo

Roles activos en producción:

- `configurador`
- `administrador_cuenta`
- `operador_cuenta`
- `administrador_bodega`
- `jefe_bodega`
- `custodio`
- `operario`
- `procesador`
- `transportista`

Ver manual completo en: **`/documentacion/manual-usuario-polaria-wms`**.

---

## 5. Flujo operativo end-to-end (resumen)

1. **Configuración plataforma**: configurador crea empresa, cuenta (tenant), bodegas y primer admin cuenta.
2. **Habilitación tenant**: admin cuenta configura usuarios, catálogos y operación.
3. **Compras**: SOL → aprobación → OC → emisión → recepción/cierre.
4. **Inventario**: actualización de `warehouse_state`, locks por slot, trazabilidad de movimientos.
5. **Procesamiento**: solicitudes, asignación, ejecución y cierre con merma.
6. **Ventas/transporte**: emisión de OV, armado de despacho y registro de entrega.
7. **Soporte Mateo**: conversación contextual y trazable por usuario/cuenta.

---

## 6. Modelo de datos y seguridad (Supabase/PostgreSQL)

### 6.1 Entidades operativas clave

| Entidad | Propósito |
| --- | --- |
| `warehouse_state` | Estado vivo de stock por ubicación/lote/producto |
| `movimiento_inventario` | Historial append-only de movimientos |
| `solicitud_compra` / `orden_compra` / `recepcion_compra` | Flujo de compras |
| `solicitud_procesamiento` | Flujo de transformación y merma |
| `orden_venta` / `paquete_despacho` / `entrega` | Flujo de salida/transporte |
| `widget_conversacion` / `widget_mensaje` | Historial del Widget Mateo |

### 6.2 Estrategia RLS

| Canal | RLS |
| --- | --- |
| Web (supabase-js) | Aplica por tenant y bodega |
| API (Prisma) | Bypass con validación explícita en código |
| Widget Mateo | Políticas de ownership por usuario/cuenta |

---

## 7. API consolidada (polaria-wms-api)

Swagger: `GET /api/docs`  
OpenAPI: `GET /api/docs-json`

Dominios activos:

- auth y sesión (incluye SSO/token para Mateo),
- configuración (empresa/cuenta/bodega),
- usuarios por scope,
- compras (SOL, OC, recepción),
- inventario (`warehouse_state`, lock/unlock, movimientos),
- operaciones (OT, tareas, alertas, llamadas),
- procesamiento,
- ventas,
- transporte,
- conversaciones de Mateo widget.

Para detalle exacto de endpoints usar referencia viva:

- `/referencia/api/bodega-frio`

---

## 8. Integraciones externas

| Integración | Dónde aplica | Estado |
| --- | --- | --- |
| Supabase (Auth, Postgres, Realtime) | web/api/db | ✅ |
| n8n | web + widget + automatizaciones | ✅ (con deuda de estandarización entre entornos) |
| Cloudinary | evidencias transporte + widget imágenes | ✅ |
| Mateo Widget | web/api/db/widget | ✅ |
| Fridem (externo) | lectura/integración parcial | 🔵 |

---

## 9. Variables de entorno (resumen por repo)

### 9.1 polaria-wms-web

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MATEO_URL` (opcional)
- `NEXT_PUBLIC_MATEO_WIDGET_SCRIPT_URL` (opcional)

### 9.2 polaria-wms-api

- `DATABASE_URL`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `MATEO_HANDOFF_SECRET`
- `MATEO_WIDGET_JWT_SECRET`
- `MATEO_ALLOWED_ORIGINS`

### 9.3 Widget-react

- `VITE_N8N_WEBHOOK_URL`
- `VITE_CLOUDINARY_CLOUD_NAME`
- `VITE_CLOUDINARY_UPLOAD_PRESET`

---

## 10. Testing y calidad

| Repositorio | Estado rápido |
| --- | --- |
| `polaria-wms-web` | 465 tests detectados; 11 fallos abiertos (Jul 2026) |
| `polaria-wms-api` | unit + e2e robustos, pero muchos e2e usan mocks |
| `polaria-wms-db` | validaciones SQL manuales por scripts |
| `Widget-react` | 62 tests unitarios en Vitest |

Referencia de testing consolidada:

- `/referencia/testing/bodega-frio`

---

## 11. Runbooks operativos (estado actual)

Disponibles parcialmente:

- despliegue por repo,
- validación de migraciones SQL,
- verificación de aislación RLS,
- smoke test de widget Mateo embebido.

Pendiente formalizar:

- runbook de incidentes de concurrencia en mapa,
- runbook DR (RPO/RTO),
- runbook de observabilidad y SLO/alertamiento.

---

## 12. Deudas técnicas y roadmap inmediato

1. Resolver inconsistencia de permisos de lock para `custodio`.
2. Completar caso de estado `cerrada` para OC.
3. Ejecutar e2e de concurrencia con BD real.
4. Homologar documentación de variables y pruebas en todos los repos.
5. Consolidar runbooks de soporte para Mateo Support.

---

## 13. Enlaces de consulta rápida

- Documentación operativa/checklist: `/documentacion/bodega-frio-v2`
- Referencia API: `/referencia/api/bodega-frio`
- Referencia Testing: `/referencia/testing/bodega-frio`
- Recursos y scripts: `/recursos`
- Manual de usuario: `/documentacion/manual-usuario-polaria-wms`
