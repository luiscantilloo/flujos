### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Crear camión |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | No |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Placa | Texto | Sí | varchar(16); se fuerza a MAYÚSCULAS; se recorta; genera el código interno | — | Sí (por cuenta: uq_camion_cuenta_placa) | — | El código se genera con generateCodigoCuentaFromNombre(placa); no se muestra | La placa es obligatoria. / No se pudo generar el código del camión. | Front, Back, BD |
| Marca | Catálogo (picker de solo lectura) | Sí | varchar(64); catálogo CAMION_MARCAS_CATALOG; no se escribe a mano | — | No | — | Al elegir marca se vacían modeloId y modelo | Selecciona la marca del vehículo. | Front, Back, BD |
| Modelo | Catálogo (picker de solo lectura) | Sí | varchar(64); modelos de listModelosByMarcaId(marcaId) | — | No | Marca | El picker de modelo solo abre si hay marcaId; placeholder "Primero elige una marca" | Selecciona el modelo del vehículo. | Front, Back, BD |
| Peso máx (kg) | Número decimal | No | numeric(18,4); inputMode=decimal; acepta coma; vacío → null; si hay valor debe ser finito y > 0 | — | No | — | parseOptionalNumberInput en el modal | El peso máximo debe ser un número mayor a cero. | Front, Back, BD |
| Volumen (m³) | Número decimal | No | numeric(18,4); inputMode=decimal; vacío → null; si hay valor > 0 | — | No | — | — | El volumen debe ser un número mayor a cero. | Front, Back, BD |
| Cap. pallets | Número entero | No | integer; inputMode=numeric; vacío → null; si hay valor entero > 0 | — | No | — | — | La capacidad de pallets debe ser un entero mayor a cero. | Front, Back, BD |
| Tipo de vehículo | Catálogo (picker) | Sí | Enum tipo_camion: refrigerado, isotermico, seco | refrigerado (etiqueta Refrigerado) | No | — | Al elegir tipo se asignan tempMinDefault y tempMaxDefault del catálogo | — | Front, Back, BD |
| Temperatura mínima | Número entero (slider) | Sí | TEMP_SLIDER_MIN=-50 … TEMP_SLIDER_MAX=200; step 1; se persiste junto con máxima en rango_temperatura varchar(64) | -25 (tipo refrigerado) | No | Tipo de vehículo | Si el usuario sube mínima por encima de máxima, máxima se iguala; presets fijan min=max | — | Front, Back, BD |
| Temperatura máxima | Número entero (slider) | Sí | -50 … 200 °C; step 1 | 15 (tipo refrigerado) | No | Tipo de vehículo; Temperatura mínima | Si el usuario baja máxima por debajo de mínima, mínima se iguala | — | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Placa | 1 | No | Sí, al abrir el modal |
| Marca | 2 | No (readOnly; abre picker al clic / Enter / espacio) | — |
| Modelo | 3 | No (readOnly); el picker no abre si no hay marca | — |
| Peso máx (kg) | 4 | No | — |
| Volumen (m³) | 5 | No | — |
| Cap. pallets | 6 | No | — |
| Tipo de vehículo | 7 | No (readOnly; abre picker) | — |
| Temperatura mínima | 8 | No | — |
| Temperatura máxima | 9 | No | — |

### Notas y justificaciones

Sin cuenta: "No se encontró la cuenta activa.". Disponible se guarda true en el alta (no hay campo). Presets del slider: Congelación (-18), Refrigerado (4), Fresco (12), Ambiente (22), Templado (60). El rango se serializa con formatRangoTemperatura. Si falla: DomainServiceError o "No se pudo crear el camión.". Código único por cuenta (uq_camion_cuenta_codigo) sin mensaje de aplicación.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
