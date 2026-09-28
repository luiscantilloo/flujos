### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar camión |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Código | Texto (solo lectura) | Sí | varchar(32) | camion.codigo | Sí (por cuenta: uq_camion_cuenta_codigo) | Camión abierto | No se envía en el update | — | Front, BD |
| Placa | Texto | Sí | varchar(16); MAYÚSCULAS | camion.placa | Sí (por cuenta: uq_camion_cuenta_placa) | Camión abierto | — | La placa es obligatoria. | Front, Back, BD |
| Marca | Catálogo (picker de solo lectura) | Sí | varchar(64) | camion.marca; se intenta matchCamionCatalogByNombre | No | Camión abierto | Al cambiar marca se vacían modeloId y modelo | Selecciona la marca del vehículo. | Front, Back, BD |
| Modelo | Catálogo (picker de solo lectura) | Sí | varchar(64) | camion.modelo | No | Marca | El picker solo abre si hay marcaId | Selecciona el modelo del vehículo. | Front, Back, BD |
| Peso máx (kg) | Número decimal | No | numeric(18,4); vacío → null; si hay valor > 0 | String(camion.capacidadKg) o "" | No | Camión abierto | — | El peso máximo debe ser un número mayor a cero. | Front, Back, BD |
| Volumen (m³) | Número decimal | No | numeric(18,4); vacío → null; si hay valor > 0 | String(camion.capacidadM3) o "" | No | Camión abierto | — | El volumen debe ser un número mayor a cero. | Front, Back, BD |
| Cap. pallets | Número entero | No | integer; vacío → null; si hay valor entero > 0 | String(camion.capacidadPallets) o "" | No | Camión abierto | — | La capacidad de pallets debe ser un entero mayor a cero. | Front, Back, BD |
| Tipo de vehículo | Catálogo (picker) | Sí | refrigerado, isotermico, seco; si el valor de BD no coincide, cae a refrigerado | resolveCamionTipo(camion.tipo) | No | Camión abierto | Al elegir tipo se recargan tempMin/tempMax default del catálogo | — | Front, Back, BD |
| Estado | Selección | Sí | si = Disponible; no = No disponible | camion.disponible (true/false) | No | Camión abierto | Solo existe en editar; se envía como disponible boolean | — | Front, Back, BD |
| Temperatura mínima | Número entero (slider) | Sí | -50 … 200 °C | parseRangoTemperatura(camion.rangoTemperatura).tempMin o default del tipo | No | Tipo de vehículo | Máxima no puede quedar por debajo | — | Front, Back, BD |
| Temperatura máxima | Número entero (slider) | Sí | -50 … 200 °C | parseRangoTemperatura(...).tempMax o default del tipo | No | Tipo de vehículo; Temperatura mínima | Mínima no puede quedar por encima | — | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Código | 1 | Sí (siempre, readOnly) | — |
| Placa | 2 | No | Sí, al abrir el modal |
| Marca | 3 | No (readOnly; abre picker) | — |
| Modelo | 4 | No (readOnly); picker solo con marca | — |
| Peso máx (kg) | 5 | No | — |
| Volumen (m³) | 6 | No | — |
| Cap. pallets | 7 | No | — |
| Tipo de vehículo | 8 | No (readOnly; abre picker) | — |
| Estado | 9 | No | — |
| Temperatura mínima | 10 | No | — |
| Temperatura máxima | 11 | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Código | Sí | Información de BD | No |
| Placa | Sí | Información de BD | Sí |
| Marca | Sí | Información de BD | Sí |
| Modelo | Sí | Información de BD | Sí |
| Peso máx (kg) | Sí | Información de BD | Sí |
| Volumen (m³) | Sí | Información de BD | Sí |
| Cap. pallets | Sí | Información de BD | Sí |
| Tipo de vehículo | Sí | Información de BD | Sí |
| Estado | Sí | Información de BD | Sí |
| Temperatura mínima | Sí | Información de BD | Sí |
| Temperatura máxima | Sí | Información de BD | Sí |

### Tabla 4 — Prueba automatizada del Nivel 2

#### 4.1 Acceso y botones

| Campo | Valor |
|---|---|
| Rol con que se inicia sesión | Administrador de cuenta |
| Ruta / URL | /dashboard/administracion/asignacion-creacion/camiones |
| Pasos para abrir el formulario | clic button "Editar" → esperar dialog "Editar camión" |
| Registro que debe existir | Un camión activo (`estaActivo`) de la cuenta de prueba, visible en la lista de camiones |
| Archivos del formulario | src/modules/admin-panel/camiones/components/CamionEditModal.tsx; src/modules/admin-panel/camiones/components/CamionesListView.tsx; src/modules/admin-panel/camiones/components/CamionTemperaturaSlider.tsx; src/modules/admin-panel/camiones/components/CamionCatalogTablePickerModal.tsx |
| Botón Guardar | button "Guardar" |
| Botón Cancelar / Cerrar | button "Cancelar" |
| Diálogo de descarte: botón que confirma el descarte | — |
| Diálogo de descarte: botón para seguir editando | — |
| Botón de la advertencia no-saltable | — |

#### 4.2 Campos

| Campo | Localizador | Valor de prueba |
|---|---|---|
| Código | textbox "Código" | — |
| Placa | textbox "Placa" | XYZ987 |
| Marca | button "Marca" | Kenworth |
| Modelo | button "Modelo" | T680 |
| Peso máx (kg) | textbox "Peso máx (kg)" | 20000 |
| Volumen (m³) | textbox "Volumen (m³)" | 50 |
| Cap. pallets | textbox "Cap. pallets" | 14 |
| Tipo de vehículo | button "Tipo de vehículo" | Isotérmico |
| Estado | combobox "Estado" | Disponible |
| Temperatura mínima | slider "Temperatura mínima" | -18 |
| Temperatura máxima | slider "Temperatura máxima" | 4 |

### Notas y justificaciones

El código es de solo lectura. Sin cuenta: "No se encontró la cuenta activa.". Si falla: DomainServiceError o "No se pudo actualizar el camión.". Cancelar/Cerrar cierra sin diálogo de descarte. Abrir con el icono/botón "Editar" de una fila activa.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
