---
name: manuales-usuario-metadata-drive
description: Actualizar manuales de usuario de Polaria WMS con metadatos Roles admitidos/Seccionar, sincronizarlos al repo y reemplazarlos en Google Drive respetando los nombres del Drive. Usar cuando el usuario pida editar manuales, agregar metadatos de roles, subir manuales a Drive o sincronizar la base de conocimiento de Mateo.
---

# Manuales de usuario — metadatos, repo y Google Drive

Usá esta skill cuando el usuario pida:

- Agregar o corregir las 2 líneas de metadatos al inicio de manuales de usuario.
- Sincronizar manuales editados en `public/docs/manual-usuario/`.
- Reemplazar manuales en la carpeta de Google Drive del proyecto.
- Mantener alineados uploads locales, repo y Drive.

## Formato obligatorio al inicio de cada manual

Cada manual debe comenzar exactamente con estas 2 líneas, seguidas de **2 líneas en blanco** y luego el título `# ...`:

```markdown
Roles admitidos: <roles>
Seccionar: False


# Título del manual
```

Reglas:

- `Seccionar: False` **siempre**, en todos los manuales. Nunca `True`.
- Los roles usan los IDs de `src/data/wmsRoles.js` (snake_case): `configurador`, `administrador_cuenta`, `operador_cuenta`, etc.
- Varios roles van separados por coma y espacio: `operador_cuenta, administrador_cuenta, custodio`.
- Si el manual ya tiene encabezado previo, reemplazarlo; no duplicar líneas.

## Cómo elegir `Roles admitidos`

### Manuales de rol (1 rol)

| Manual | Roles admitidos |
| --- | --- |
| Configurador | `configurador` |
| Administrador de cuenta | `administrador_cuenta` |
| Operador de cuenta | `operador_cuenta` |
| Administrador de bodega | `administrador_bodega` |
| Jefe de bodega | `jefe_bodega` |
| Custodio | `custodio` |
| Operario | `operario` |
| Procesador | `procesador` |
| Transportista | `transportista` |

### Manuales de proceso (roles del flujo)

Basarse en la sección **Quién hace qué** del manual:

| Manual | Roles admitidos |
| --- | --- |
| Compras | `operador_cuenta, administrador_cuenta, custodio, jefe_bodega, administrador_bodega` |
| Inventario y mapa | `administrador_bodega, jefe_bodega, custodio, operario` |
| Procesamiento en frío | `operador_cuenta, jefe_bodega, operario, procesador` |
| Ventas y despacho | `operador_cuenta, administrador_cuenta, jefe_bodega, operario, custodio, transportista` |
| Transporte y entregas | `custodio, transportista, administrador_cuenta` |
| Bodega externa / integración | `operador_cuenta, administrador_cuenta, configurador` |

### Soporte y Mateo (todos los roles)

Usar los 9 roles del WMS:

`configurador, administrador_cuenta, operador_cuenta, administrador_bodega, jefe_bodega, custodio, operario, procesador, transportista`

Aplica a: Mateo, FAQ/preguntas frecuentes, glosario rápido.

### Nota sobre configurador

El rol `configurador` puede acceder a toda la documentación en el producto. Eso **no** implica agregarlo automáticamente a cada manual; incluirlo solo cuando el manual lo mencione explícitamente (integración externa) o en soporte/Mateo/glosario/FAQ.

## Ubicaciones de archivos

| Capa | Ruta |
| --- | --- |
| Uploads del agente | `/home/ubuntu/.cursor/projects/workspace/uploads/manual-*.md` |
| Repo (portal manual) | `/workspace/public/docs/manual-usuario/` |
| Índice del portal | `/workspace/src/data/userManualRegistry.js` |
| Roles canónicos | `/workspace/src/data/wmsRoles.js` |
| Google Drive (Mateo) | carpeta `1FPco6ENatV85eoLydgTfoJ8ATMuSY6vJ` |

URL Drive: `https://drive.google.com/drive/u/2/folders/1FPco6ENatV85eoLydgTfoJ8ATMuSY6vJ`

## Flujo de trabajo recomendado

### 1. Editar metadatos

1. Identificar los manuales afectados (normalmente 18 guías de usuario, sin `empezar.md` salvo que el usuario lo pida).
2. Agregar o corregir las 2 líneas al inicio según las reglas de arriba.
3. Editar tanto uploads como `public/docs/manual-usuario/` para mantener paridad.

Script reutilizable: ver [mapping-y-scripts.md](references/mapping-y-scripts.md).

### 2. Commit en el repo

1. Crear rama `cursor/<descripcion>-2f0d` si estás en Cloud Agent.
2. Commitear solo `public/docs/manual-usuario/` (y la skill si aplica).
3. Push y PR si corresponde.

### 2. Subir a Google Drive

**Antes de ejecutar**, si el usuario no confirmó:

- Confirmar que entendés el mapeo local → nombre en Drive.
- Preguntar qué hacer si hay duplicados o si falta algún archivo.

**Proceso seguro (MCP `Google-drive`):**

1. `search_files` con `parentId = '1FPco6ENatV85eoLydgTfoJ8ATMuSY6vJ'` para listar archivos existentes.
2. Para cada manual a actualizar:
   - Leer contenido local actualizado.
   - `create_file` con:
     - `title`: **nombre exacto en Drive** (ver tabla en references).
     - `parentId`: `1FPco6ENatV85eoLydgTfoJ8ATMuSY6vJ`
     - `textContent`: contenido completo del `.md`
     - `contentMimeType`: `text/markdown`
     - `disableConversionToGoogleType`: `true`
   - `trash_file` del `fileId` anterior.
3. **No tocar** otros archivos de la carpeta que no sean manuales objetivo.
4. Si un manual no existe en Drive, crearlo con el nombre canónico de Drive.
5. Verificar al final: deben quedar **18** archivos `manual-*.md` en la carpeta.

**Importante:** `update_file` de Google Drive **no** actualiza contenido; solo título/parent. Para reemplazar contenido usar `create_file` + `trash_file`.

### 3. Verificación

Repo:

- Primeras líneas = `Roles admitidos` + `Seccionar: False`.
- `Seccionar: False` en todos.

Drive:

- Contar 18 `manual-*.md`.
- `download_file_content` de 1–2 archivos muestra y confirmar encabezado + contenido nuevo.
- Fechas de modificación recientes.

## Mapeo crítico: nombre local ≠ nombre en Drive

Los nombres en Drive son la fuente de verdad al subir. Ejemplos:

| Contenido / upload local | Nombre en Drive |
| --- | --- |
| `manual-compras-de-la-solicitud-al-ingreso_*.md` | `manual-compras-sol-oc-recepcion.md` |
| `manual-inventario-y-mapa_*.md` | `manual-inventario-y-mapa-en-vivo.md` |
| `manual-bodega-externa_*.md` | `manual-integracion-bodega-externa.md` |
| `manual-mateo-chat-de-ayuda_*.md` | `manual-mateo-support-widget.md` |
| `manual-no-me-deja-preguntas-frecuentes_*.md` | `manual-preguntas-frecuentes.md` |

Tabla completa local → repo → Drive: [mapping-y-scripts.md](references/mapping-y-scripts.md).

## Qué no hacer

- No cambiar el cuerpo del manual si el usuario solo pidió metadatos (salvo correcciones obvias pedidas).
- No renombrar archivos en Drive a nombres locales con sufijos (`__1__`, `(1)`, etc.).
- No poner `Seccionar: True` en ningún manual.
- No borrar ni modificar otros documentos de la carpeta Drive.
- No asumir que el nombre del upload coincide con el nombre en Drive: **listar Drive primero**.

## Respuesta al usuario

Al terminar, resumir en español:

1. Cuántos manuales se editaron.
2. Criterio de roles aplicado.
3. Si se sincronizó repo y/o Drive.
4. Tabla breve local → nombre Drive (solo si hubo subida a Drive).
5. Resultado de verificación (conteo 18, fecha de modificación).
