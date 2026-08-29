# Novedades 29 ago 2026 — Polaria WMS 2.4.3

Captura de **todo lo que se implementó y documentó** ese día: sesión, Mateo, Creación (admin cuenta), teléfonos y alias de producto por comprador. Complementa el [mapa actual](/documentacion/polaria-wms-mapa-actual). No reemplaza los manuales de usuario ni la documentación de diseño (generación V2). Esta entrega queda como producto **2.4.3**.

En este Dev Hub también quedó en: Manual de usuario (empezar, admin cuenta, Mateo, FAQ, glosario), glosario técnico, seguridad, Mateo, runbooks, testing, ER, árbol de carpetas y Drive de Mateo.

---

## 1. Sesión WMS de 12 horas + cierre de Mateo

La sesión de Polaria dura **12 horas** desde el login (`SESSION_MAX_AGE_MS` en `polaria-wms-web`). Al vencer o al logout:

1. Redirige a `/login`.
2. Cierra Mateo: reset del tokenFetcher y unmount del widget.

El JWT de n8n (~**300 s**) **no** es un logout a los 5 minutos: se **renueva** mientras la sesión WMS sigue viva. El historial del chat usa el Bearer de Polaria.

| Repo | Dónde |
| --- | --- |
| `polaria-wms-web` | `src/lib/auth/auth-session-timeout.ts`, store de auth, guards/bootstrap, `MateoWidgetHost` |
| Manual | `empezar.md`, `procesos/mateo-support.md`, FAQ |

---

## 2. Mateo: enlaces y PDF

- Enlaces del chat **subrayados**; el clic abre **otra pestaña** (no hay botón “ver documento”).
- Un nombre de PDF en “ruta” es **descarga** si hay URL válida. Un 404 es archivo inexistente, no un fallo del clic.

| Repo | Dónde |
| --- | --- |
| `Widget-react` | `src/lib/parseRichContent.ts`, `src/components/rich/InlineText.tsx` |
| Manual | `procesos/mateo-support.md`, FAQ |

---

## 3. Editar en Creación (administrador de cuenta)

Botón **Editar** (lápiz) en las tablas de **Creación**: Proveedores, Clientes, Compradores, Camiones y Plantas.

- **No** en Asignación ni en el catálogo de productos.
- El **código** es de solo lectura.
- El submit del formulario dice **Guardar**.
- **Editar** no abre la ficha del comprador (`stopPropagation` en el lápiz).

---

## 4. Teléfonos con prefijo internacional

La UI muestra siempre el número en formato internacional (ejemplo `+57 300 …`) aunque el valor guardado venga sin `+`. Parseo: `parseStoredPhone` / `phone-countries.ts`.

---

## 5. Alias de producto por comprador

Nombre con el que **ese comprador** conoce un ítem del catálogo (sandía → patilla). **No altera** `producto`. Un par comprador+producto = un alias (`UNIQUE (id_comprador, id_producto)`).

### Flujo en pantalla

1. En **Creación de compradores**, **Crear Alias** al lado de Nuevo comprador.
2. Elegir **comprador**.
3. Lista del catálogo: solo **código** y **nombre** → elegir producto.
4. **Otro modal** para escribir el alias y **Guardar**.
5. Clic en la **fila** del comprador (no en Editar) abre la ficha: código, nombre, teléfono y lista de alias.

### Datos

- Tabla `public.comprador_producto_alias` — migración **067**.
- RLS de catálogo; clone a `emp_*` vía `wms_sync_table_to_tenants`.
- `NOTIFY pgrst` para que PostgREST vea la tabla (si no, el alta falla).
- Sin modelo Prisma aún (igual que `precio_producto`).
- Servicio web: `comprador-producto-alias.service.ts` (`create` + `list`).

| Repo | Dónde |
| --- | --- |
| `polaria-wms-db` | `migrations/067_comprador_producto_alias.sql` (y copia en `supabase/migrations/`) |
| `polaria-wms-web` | módulo `admin-panel/compradores/` (UI + servicio + tests) |

---

## 6. Manuales de usuario (repo + Drive Mateo)

Metadatos al inicio: `Roles admitidos` + `Seccionar: False`. Carpeta Drive: `1FPco6ENatV85eoLydgTfoJ8ATMuSY6vJ`.

| Local (`public/docs/manual-usuario/`) | Nombre en Drive | Roles admitidos |
| --- | --- | --- |
| `roles/administrador-cuenta.md` | `manual-administrador-de-cuenta.md` | `administrador_cuenta` |
| `procesos/mateo-support.md` | `manual-mateo-support-widget.md` | los 9 roles WMS |
| `soporte/preguntas-frecuentes.md` | `manual-preguntas-frecuentes.md` | los 9 roles WMS |
| `soporte/glosario-rapido.md` | `manual-glosario-rapido.md` | los 9 roles WMS |
| `empezar.md` | *(no está en los 18 de Drive)* | sesión 12 h |

`empezar.md` no se sube a Drive (no forma parte de los 18 `manual-*.md` de Mateo). Sí vive en el portal `/manual-usuario`.

Verificación Drive (29 ago): **18** archivos `manual-*.md`; los cuatro de arriba con contenido nuevo y encabezado de roles.

---

## 7. Dónde más se actualizó este Dev Hub

| Superficie | Qué |
| --- | --- |
| Mapa actual | Sección *Cambios 29 ago 2026* + migración 067 |
| Glosario técnico | Alias, sesión 12 h, Mateo |
| Arquitectura / meta / seguridad / Mateo / runbooks / testing | Tope 12 h, cierre conjunto, enlaces/PDF, alias |
| ER + guía de lectura | Entidad `comprador_producto_alias` (paso 12.5) |
| Árbol web | Compradores: CRUD + alias + ficha |
| Checklist / onboarding / stack | Serie de migraciones **001–067** |
| Documentación V2.0 (anexo) | Alias, sesión, `comprador_producto_alias` |

---

*Fuente: implementación en web, db y Widget-react el 29 ago 2026; este archivo es el índice de ese día para el Dev Hub `flujo`.*
