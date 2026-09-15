### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Configurar / editar impresora |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| nombre | texto | Sí | Trim no vacío; HTML `required`; BD `varchar(255)` NOT NULL | — | No | — | — | HTML5 nativo del navegador (`required`). Si solo espacios: El nombre de la impresora es obligatorio. Fallo genérico: No se pudo guardar la impresora. | Front/BD |
| codigo_interno | texto | No | BD `varchar(32)` nullable | — | No | — | — | — | Front/BD |
| cuenta | enumeración (código de cuenta) | Sí | HTML `required`; trim no vacío; BD `codigo_cuenta varchar(32)` NOT NULL | — | No | — | Al cambiar, `bodega` pasa a `idBodegaDefault` de la cuenta si existe en el filtro, si no a la primera bodega de esa cuenta | HTML5 nativo (`required`). Si vacío al servicio: Selecciona la cuenta a asociar. Carga: No se pudieron cargar cuentas o bodegas. | Front/BD |
| bodega | UUID o vacío | No | Vacío = «Sin bodega específica» (`id_bodega` null); si hay valor debe ser bodega de la cuenta | — (se propone default de cuenta al elegir cuenta) | No | cuenta | Deshabilitado sin cuenta; opciones filtradas por `codigoCuenta` | — | Front/BD |
| pais | enumeración (`CO` / `MX` / `US`) | Sí | HTML `required`; BD `char(2)` NOT NULL CHECK | MX | No | — | — | HTML5 nativo (`required`). CHECK BD `ck_impresora_pais` | Front/BD |
| ubicacion | texto | No | BD `varchar(255)` nullable | — | No | — | — | — | Front/BD |
| marca | texto (catálogo) | No | Catálogo carta; BD `varchar(120)` nullable | — | No | — | Al cambiar se limpian `modelo` / `modeloId` | — | Front/BD |
| modelo | texto (catálogo) | No | Catálogo de la marca; BD `varchar(120)` nullable | — | No | marca | El picker de modelo no abre hasta elegir marca (placeholder: Primero elige una marca) | — | Front/BD |
| tipo_conexion | enumeración (`wifi` / `ethernet` / `usb` / `bluetooth`) | Sí | HTML `required`; BD CHECK `ck_impresora_tipo_conexion` | wifi | No | — | Al cambiar sugiere `modo_envio` (`usb`→sistema_local, `bluetooth`→agente, resto→ipp) y puerto por defecto | HTML5 nativo (`required`) | Front/BD |
| modo_envio | enumeración (`ipp` / `raw_9100` / `sistema_local` / `agente`) | Sí | HTML `required`; BD CHECK `ck_impresora_modo_envio` | ipp | No | tipo_conexion | Define qué bloque de conexión se muestra y el puerto default (631 / 9100 / vacío) | HTML5 nativo (`required`) | Front/BD |
| host_ip | texto | Condicional | Obligatorio si `modo_envio` es `ipp` o `raw_9100`; HTML `required` en ese bloque; BD `varchar(255)` nullable | — | No | modo_envio | Visible solo en IPP / JetDirect | HTML5 nativo (`required`) si el bloque está en DOM. Servicio: La IP o hostname es obligatorio para Wi‑Fi / Ethernet (IPP o puerto 9100). | Front/BD |
| puerto | número entero | No | Entero 1–65535 si no es vacío; default 631 (ipp) o 9100 (raw_9100); BD integer nullable | 631 (modo ipp) | No | modo_envio | Visible en IPP / JetDirect; se resetea al cambiar modo | El puerto debe ser un entero entre 1 y 65535. | Front/BD |
| cola_nombre | texto | No | Visible en IPP / JetDirect; BD `varchar(255)` nullable | — | No | modo_envio | — | — | Front/BD |
| usa_tls | boolean | No | Visible en IPP / JetDirect; BD NOT NULL default false | false | No | modo_envio | — | — | Front/BD |
| nombre_sistema | texto | Condicional | Obligatorio si `modo_envio === "sistema_local"` (HTML `required`). En IPP/JetDirect es «Nombre en Windows (QZ Tray)» opcional. En agente es «Nombre de cola del agente» opcional. BD `varchar(255)` nullable | — | No | modo_envio | Mismo state `nombreSistema` en los tres bloques (mutuamente excluyentes en UI) | HTML5 nativo (`required`) en cola del sistema. Servicio: Indica el nombre de la impresora en el sistema operativo (USB / cola local). | Front/BD |
| id_agente | texto | Condicional | Visible si `modo_envio === "agente"`; el servicio exige `idAgente` o `nombreSistema`; BD `varchar(255)` nullable | — | No | modo_envio | — | Indica el ID del agente (QZ Tray / PrintNode) o el nombre de cola del agente. | Front/BD |
| tamano_papel | enumeración (`letter` / `legal` / `a4`) | Sí | BD NOT NULL CHECK default letter | letter | No | — | — | CHECK BD `ck_impresora_tamano_papel` | Front/BD |
| orientacion | enumeración (`portrait` / `landscape`) | Sí | BD NOT NULL CHECK | portrait | No | — | — | CHECK BD `ck_impresora_orientacion` | Front/BD |
| duplex | enumeración (`none` / `long_edge` / `short_edge`) | Sí | BD NOT NULL CHECK | none | No | — | — | CHECK BD `ck_impresora_duplex` | Front/BD |
| color_modo | enumeración (`mono` / `color`) | Sí | BD NOT NULL CHECK | mono | No | — | — | CHECK BD `ck_impresora_color` | Front/BD |
| bandeja | texto | No | BD `varchar(120)` nullable | — | No | — | — | — | Front/BD |
| copias_default | número entero | Sí | Entero 1–99; BD NOT NULL default 1 CHECK | 1 | No | — | Si el parseo no es finito, el modal envía 1 | Las copias por defecto deben estar entre 1 y 99. | Front/BD |
| notas | texto | No | BD `text` nullable | — | No | — | — | — | Front/BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| nombre | 1 | No (salvo submit en curso del modal) | — |
| codigo_interno | 2 | No | — |
| cuenta | 3 | Sí, mientras `isLoadingOptions` | — |
| bodega | 4 si hay cuenta; — si está `disabled` | Sí, si no hay `codigoCuenta` o mientras carga opciones | — |
| pais | 5 | No | — |
| ubicacion | 6 | No | — |
| marca | 7 | No (el botón buscar tiene `tabIndex=-1`) | — |
| modelo | 8 | El input sigue tabulable; el picker no abre sin marca | — |
| tipo_conexion | 9 | No | — |
| modo_envio | 10 | No | — |
| host_ip | 11 si modo ipp/raw_9100; — si el bloque no está en DOM | — | — |
| puerto | 12 si modo ipp/raw_9100; — si no | — | — |
| cola_nombre | 13 si modo ipp/raw_9100; — si no | — | — |
| usa_tls | 14 si modo ipp/raw_9100; — si no | — | — |
| nombre_sistema | Siguiente visible según modo (QZ en red, cola OS en sistema_local, cola agente en agente) | — | — |
| id_agente | Tras modo agente, antes de cola del agente; — en otros modos | — | — |
| tamano_papel | Tras el bloque de conexión | No | — |
| orientacion | Siguiente | No | — |
| duplex | Siguiente | No | — |
| color_modo | Siguiente | No | — |
| bandeja | Siguiente | No | — |
| copias_default | Siguiente | No | — |
| notas | Último | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| nombre | Sí (solo edición) | Información de BD | Sí |
| codigo_interno | Sí (solo edición) | Información de BD | Sí |
| cuenta | Sí (solo edición) | Información de BD | Sí |
| bodega | Sí (solo edición) | Información de BD | Sí |
| pais | Sí (solo edición) | Información de BD | Sí |
| ubicacion | Sí (solo edición) | Información de BD | Sí |
| marca | Sí (solo edición) | Información de BD | Sí |
| modelo | Sí (solo edición) | Información de BD | Sí |
| tipo_conexion | Sí (solo edición) | Información de BD | Sí |
| modo_envio | Sí (solo edición) | Información de BD | Sí |
| host_ip | Sí (solo edición) | Información de BD | Sí |
| puerto | Sí (solo edición) | Información de BD | Sí |
| cola_nombre | Sí (solo edición) | Información de BD | Sí |
| usa_tls | Sí (solo edición) | Información de BD | Sí |
| nombre_sistema | Sí (solo edición) | Información de BD | Sí |
| id_agente | Sí (solo edición) | Información de BD | Sí |
| tamano_papel | Sí (solo edición) | Información de BD | Sí |
| orientacion | Sí (solo edición) | Información de BD | Sí |
| duplex | Sí (solo edición) | Información de BD | Sí |
| color_modo | Sí (solo edición) | Información de BD | Sí |
| bandeja | Sí (solo edición) | Información de BD | Sí |
| copias_default | Sí (solo edición) | Información de BD | Sí |
| notas | Sí (solo edición) | Información de BD | Sí |

### Notas y justificaciones

Todos los campos omiten Back: no hay DTO/controller Nest; alta/edición van a `public.impresora` vía Supabase (`impresoras.service.ts`). Los `required` HTML de Nombre, Cuenta, País, Tipo, Modo, IP y Nombre en el sistema usan el mensaje nativo del navegador (el protocolo espera un mensaje explícito; el servicio Front sí tiene textos en español si se llega a `validateCreateInput`). En alta, País/Tipo/Modo/Papel/etc. usan valor por defecto de `INITIAL_FORM` (no pre-llenado de BD). Edición carga `formFromImpresora`. `idImpresora` en edición no es campo de UI; si falta: Falta el id de la impresora.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
