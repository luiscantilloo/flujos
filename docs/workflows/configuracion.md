# Configuración de workflows — Validación Nivel 2

Documento operativo **sin secretos**. Valores pendientes se marcan explícitamente.  
Relacionado: [POL-261](https://linear.app/polaria/issue/POL-261), [POL-268](https://linear.app/polaria/issue/POL-268).

## Staging (POL-268)

| Clave | Valor |
|---|---|
| `staging_mode` | `preview_per_branch` (pendiente rediseño POL-268) |
| `staging_branch` | `null` / N/A — no hay rama fija de staging; Vercel genera preview por cada rama y el código pasa de preview a `main` (producción) |
| `staging_url_pattern` | Preview Vercel por rama de `polaria-wms-web` (URL exacta depende del deploy; confirmar con responsable WMS) |
| `staging_db_backend` | Pendiente confirmar a qué base de datos y API apuntan los previews (bloqueo POL-268) |

## Webhook / despliegues

| Clave | Valor |
|---|---|
| `webhook_admin` | Pendiente confirmar responsable WMS (quién tiene permiso de administración del webhook de `polaria-wms-web`) |
| `webhook_endpoint` | Pendiente — no documentar secretos ni tokens aquí |

## Responsable WMS (Linear)

| Clave | Valor |
|---|---|
| `responsable_wms_linear` | Daniel De Jesus Galvis Zambrano |
| `responsable_wms_email` | daniel.galvis@polaria.tech |
| `responsable_wms_rol` | Stakeholder / reporta (POL-261, POL-268) |

## Usuarios de prueba (solo identificadores — sin contraseñas)

Los identificadores reales los asigna el responsable WMS en staging. No versionar credenciales.

| Rol | Identificador (placeholder) | Notas |
|---|---|---|
| `administrador_cuenta` | pendiente-asignar@polaria.tech | Requerido para camiones (`/dashboard/administracion/.../camiones`) y válido para pedidos |
| `operador_cuenta` | pendiente-asignar-operador@polaria.tech | Alternativa para `/dashboard/ventas/ordenes` |
| `jefe_bodega` | pendiente-asignar-jefe@polaria.tech | Fuera del MVP de los 3 forms; reservado para ampliación |
| `configurador` | pendiente-asignar-config@polaria.tech | Solo inspección en algunos paneles; no crear/editar camión |
| `administrador_bodega` | pendiente-asignar-admin-bodega@polaria.tech | Pendiente de uso en Nivel 2 |

## Datos de prueba — pedido_venta (discrepancia IA vs BD)

Documentado también en Tabla 4.1 de `schema_pedido_venta.md`:

- Comprador de staging con ficha: centro `"Cocina central (ficha)"`, dirección `"Av. Ficha 100"`.
- Pedido / texto IA de prueba debe proponer centro y dirección distintos para abrir el diálogo **Hay diferencias con la ficha del cliente** (`Enviar igual` / `Revisar`).
- ID concreto del comprador: **pendiente-asignar** por responsable WMS.

## Schemas / conversor

| Clave | Valor |
|---|---|
| `schemas_md` | `public/docs/formularios/schemas/` |
| `schemas_json` | `public/docs/formularios/schemas-json/` |
| `converter` | `scripts/schema-a-json.mjs` |
| `formato` | [Formato JSON exportación schemas v1.0](https://github.com/PolariaTech/validacion-formularios/blob/main/FORMATO_JSON_EXPORTACION_SCHEMAS_FORMULARIOS_v1.0.md) |
| `mvp_forms` | `camion_crear`, `camion_editar`, `pedido_venta` |

## Preguntas abiertas para el responsable WMS

1. ¿Quién administra el webhook de despliegues de `polaria-wms-web`?
2. ¿A qué API/DB apuntan los previews de Vercel?
3. Confirmar correos/usuarios reales de prueba por rol (sin compartir contraseñas en Linear ni en el repo).
4. Confirmar el comprador/registro de staging para la discrepancia IA vs BD de `pedido_venta`.
5. Validar localizadores de Tabla 4 (no hay `data-testid` en los modales actuales; se usó rol + nombre accesible).
