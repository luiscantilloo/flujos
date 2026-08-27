# Mapeos y scripts — manuales de usuario

## Constantes

```text
DRIVE_FOLDER_ID=1FPco6ENatV85eoLydgTfoJ8ATMuSY6vJ
ALL_ROLES=configurador, administrador_cuenta, operador_cuenta, administrador_bodega, jefe_bodega, custodio, operario, procesador, transportista
```

## Tabla maestra: upload → repo → Drive → roles

| Upload local (patrón) | Repo (`public/docs/manual-usuario/`) | Nombre en Google Drive | Roles admitidos |
| --- | --- | --- | --- |
| `manual-configurador-ti__*.md` | `roles/configurador.md` | `manual-configurador-ti.md` | `configurador` |
| `manual-administrador-de-cuenta__*.md` | `roles/administrador-cuenta.md` | `manual-administrador-de-cuenta.md` | `administrador_cuenta` |
| `manual-operador-de-cuenta__*.md` | `roles/operador-cuenta.md` | `manual-operador-de-cuenta.md` | `operador_cuenta` |
| `manual-administrador-de-bodega__*.md` | `roles/administrador-bodega.md` | `manual-administrador-de-bodega.md` | `administrador_bodega` |
| `manual-jefe-de-bodega__*.md` | `roles/jefe-bodega.md` | `manual-jefe-de-bodega.md` | `jefe_bodega` |
| `manual-custodio__*.md` | `roles/custodio.md` | `manual-custodio.md` | `custodio` |
| `manual-operario__*.md` | `roles/operario.md` | `manual-operario.md` | `operario` |
| `manual-procesador__*.md` | `roles/procesador.md` | `manual-procesador.md` | `procesador` |
| `manual-transportista__*.md` | `roles/transportista.md` | `manual-transportista.md` | `transportista` |
| `manual-compras-de-la-solicitud-al-ingreso_*.md` | `procesos/compras-sol-oc-recepcion.md` | `manual-compras-sol-oc-recepcion.md` | `operador_cuenta, administrador_cuenta, custodio, jefe_bodega, administrador_bodega` |
| `manual-inventario-y-mapa_*.md` | `procesos/inventario-mapa.md` | `manual-inventario-y-mapa-en-vivo.md` | `administrador_bodega, jefe_bodega, custodio, operario` |
| `manual-procesamiento-en-frio_*.md` | `procesos/procesamiento-frio.md` | `manual-procesamiento-frio.md` | `operador_cuenta, jefe_bodega, operario, procesador` |
| `manual-ventas-y-despacho__*.md` | `procesos/ventas-despacho.md` | `manual-ventas-y-despacho.md` | `operador_cuenta, administrador_cuenta, jefe_bodega, operario, custodio, transportista` |
| `manual-transporte-y-entregas__*.md` | `procesos/transporte-entregas.md` | `manual-transporte-y-entregas.md` | `custodio, transportista, administrador_cuenta` |
| `manual-bodega-externa_*.md` | `procesos/integracion-bodega-externa.md` | `manual-integracion-bodega-externa.md` | `operador_cuenta, administrador_cuenta, configurador` |
| `manual-mateo-chat-de-ayuda_*.md` | `procesos/mateo-support.md` | `manual-mateo-support-widget.md` | ALL_ROLES |
| `manual-no-me-deja-preguntas-frecuentes_*.md` | `soporte/preguntas-frecuentes.md` | `manual-preguntas-frecuentes.md` | ALL_ROLES |
| `manual-glosario-rapido__*.md` | `soporte/glosario-rapido.md` | `manual-glosario-rapido.md` | ALL_ROLES |

## Script: aplicar metadatos en uploads + repo

Ejecutar desde el entorno del agente. Ajustar rutas si cambian.

```python
import os

ALL_ROLES = "configurador, administrador_cuenta, operador_cuenta, administrador_bodega, jefe_bodega, custodio, operario, procesador, transportista"
UPLOADS = "/home/ubuntu/.cursor/projects/workspace/uploads"
REPO_ROOT = "/workspace/public/docs/manual-usuario"

updates = [
    (f"{UPLOADS}/manual-configurador-ti__1__4f2b.md", "configurador"),
    (f"{UPLOADS}/manual-administrador-de-cuenta__2__055e.md", "administrador_cuenta"),
    (f"{UPLOADS}/manual-operador-de-cuenta__1__d7cd.md", "operador_cuenta"),
    (f"{UPLOADS}/manual-administrador-de-bodega__1__8651.md", "administrador_bodega"),
    (f"{UPLOADS}/manual-jefe-de-bodega__1__b428.md", "jefe_bodega"),
    (f"{UPLOADS}/manual-custodio__1__9d59.md", "custodio"),
    (f"{UPLOADS}/manual-operario__1__c603.md", "operario"),
    (f"{UPLOADS}/manual-procesador__1__1ae4.md", "procesador"),
    (f"{UPLOADS}/manual-transportista__1__b408.md", "transportista"),
    (f"{UPLOADS}/manual-compras-de-la-solicitud-al-ingreso_827a.md", "operador_cuenta, administrador_cuenta, custodio, jefe_bodega, administrador_bodega"),
    (f"{UPLOADS}/manual-inventario-y-mapa_c5e4.md", "administrador_bodega, jefe_bodega, custodio, operario"),
    (f"{UPLOADS}/manual-procesamiento-en-frio_8b7d.md", "operador_cuenta, jefe_bodega, operario, procesador"),
    (f"{UPLOADS}/manual-ventas-y-despacho__1__54a7.md", "operador_cuenta, administrador_cuenta, jefe_bodega, operario, custodio, transportista"),
    (f"{UPLOADS}/manual-transporte-y-entregas__1__2fae.md", "custodio, transportista, administrador_cuenta"),
    (f"{UPLOADS}/manual-bodega-externa_36aa.md", "operador_cuenta, administrador_cuenta, configurador"),
    (f"{UPLOADS}/manual-mateo-chat-de-ayuda_c884.md", ALL_ROLES),
    (f"{UPLOADS}/manual-no-me-deja-preguntas-frecuentes_bd5e.md", ALL_ROLES),
    (f"{UPLOADS}/manual-glosario-rapido__1__4adf.md", ALL_ROLES),
    (f"{REPO_ROOT}/roles/configurador.md", "configurador"),
    (f"{REPO_ROOT}/roles/administrador-cuenta.md", "administrador_cuenta"),
    (f"{REPO_ROOT}/roles/operador-cuenta.md", "operador_cuenta"),
    (f"{REPO_ROOT}/roles/administrador-bodega.md", "administrador_bodega"),
    (f"{REPO_ROOT}/roles/jefe-bodega.md", "jefe_bodega"),
    (f"{REPO_ROOT}/roles/custodio.md", "custodio"),
    (f"{REPO_ROOT}/roles/operario.md", "operario"),
    (f"{REPO_ROOT}/roles/procesador.md", "procesador"),
    (f"{REPO_ROOT}/roles/transportista.md", "transportista"),
    (f"{REPO_ROOT}/procesos/compras-sol-oc-recepcion.md", "operador_cuenta, administrador_cuenta, custodio, jefe_bodega, administrador_bodega"),
    (f"{REPO_ROOT}/procesos/inventario-mapa.md", "administrador_bodega, jefe_bodega, custodio, operario"),
    (f"{REPO_ROOT}/procesos/procesamiento-frio.md", "operador_cuenta, jefe_bodega, operario, procesador"),
    (f"{REPO_ROOT}/procesos/ventas-despacho.md", "operador_cuenta, administrador_cuenta, jefe_bodega, operario, custodio, transportista"),
    (f"{REPO_ROOT}/procesos/transporte-entregas.md", "custodio, transportista, administrador_cuenta"),
    (f"{REPO_ROOT}/procesos/integracion-bodega-externa.md", "operador_cuenta, administrador_cuenta, configurador"),
    (f"{REPO_ROOT}/procesos/mateo-support.md", ALL_ROLES),
    (f"{REPO_ROOT}/soporte/preguntas-frecuentes.md", ALL_ROLES),
    (f"{REPO_ROOT}/soporte/glosario-rapido.md", ALL_ROLES),
]

HEADER_PREFIX = "Roles admitidos: "
HEADER_SECTION = "Seccionar: False"

def strip_existing_header(text: str) -> str:
    lines = text.splitlines(keepends=True)
    if not lines:
        return text
    i = 0
    if lines[0].startswith(HEADER_PREFIX):
        i = 1
        if i < len(lines) and lines[i].startswith(HEADER_SECTION):
            i += 1
        while i < len(lines) and lines[i].strip() == "":
            i += 1
    return "".join(lines[i:])

def apply_header(path: str, roles: str) -> None:
    with open(path, "r", encoding="utf-8") as f:
        body = strip_existing_header(f.read())
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"Roles admitidos: {roles}\nSeccionar: False\n\n\n{body}")

for path, roles in updates:
    apply_header(path, roles)
    print("OK", path)
```

## Checklist MCP Google Drive (por manual)

```text
1. search_files → obtener fileId viejo y confirmar title en Drive
2. create_file(title=<nombre Drive>, parentId=<folder>, textContent=<md>, contentMimeType=text/markdown, disableConversionToGoogleType=true)
3. trash_file(fileId=<id viejo>)
4. Al final: search_files parentId=<folder> title contains 'manual-' → deben ser 18
```

## Mapeo upload → Drive (para subida)

Usar esta tabla al subir; el `title` de `create_file` debe ser la columna **Drive**:

| Archivo upload | Drive title |
| --- | --- |
| `manual-configurador-ti__1__4f2b.md` | `manual-configurador-ti.md` |
| `manual-administrador-de-cuenta__2__055e.md` | `manual-administrador-de-cuenta.md` |
| `manual-operador-de-cuenta__1__d7cd.md` | `manual-operador-de-cuenta.md` |
| `manual-administrador-de-bodega__1__8651.md` | `manual-administrador-de-bodega.md` |
| `manual-jefe-de-bodega__1__b428.md` | `manual-jefe-de-bodega.md` |
| `manual-custodio__1__9d59.md` | `manual-custodio.md` |
| `manual-operario__1__c603.md` | `manual-operario.md` |
| `manual-procesador__1__1ae4.md` | `manual-procesador.md` |
| `manual-transportista__1__b408.md` | `manual-transportista.md` |
| `manual-compras-de-la-solicitud-al-ingreso_827a.md` | `manual-compras-sol-oc-recepcion.md` |
| `manual-inventario-y-mapa_c5e4.md` | `manual-inventario-y-mapa-en-vivo.md` |
| `manual-procesamiento-en-frio_8b7d.md` | `manual-procesamiento-frio.md` |
| `manual-ventas-y-despacho__1__54a7.md` | `manual-ventas-y-despacho.md` |
| `manual-transporte-y-entregas__1__2fae.md` | `manual-transporte-y-entregas.md` |
| `manual-bodega-externa_36aa.md` | `manual-integracion-bodega-externa.md` |
| `manual-mateo-chat-de-ayuda_c884.md` | `manual-mateo-support-widget.md` |
| `manual-no-me-deja-preguntas-frecuentes_bd5e.md` | `manual-preguntas-frecuentes.md` |
| `manual-glosario-rapido__1__4adf.md` | `manual-glosario-rapido.md` |
