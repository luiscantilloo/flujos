### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Nuevo comprador |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Razón social | Texto | No | text | — | No | — | Si Nombre comercial está vacío, el submit usa razón social como nombre a persistir | Falta el nombre comercial. / El nombre del comprador es obligatorio. | Front, Back, BD |
| RFC | Texto | No | maxLength=13; se guarda en mayúsculas | — | No | — | — | — | Front, Back, BD |
| Régimen fiscal | Selección | No | "", 601 — General de ley personas morales, 612 — Personas físicas con actividad empresarial, 626 — RESICO, 616 — Sin obligaciones fiscales | — | No | — | — | — | Front, Back, BD |
| CP del domicilio fiscal | Texto | No | maxLength=5 | — | No | — | — | — | Front, Back, BD |
| Uso del CFDI por omisión | Selección | No | G01 — Adquisición de mercancías, G03 — Gastos en general, S01 — Sin efectos fiscales | G01 — Adquisición de mercancías | No | — | — | — | Front, Back, BD |
| Constancia de Situación Fiscal | Archivo PDF | No | accept=application/pdf; solo se persiste el nombre del archivo (constanciaNombre), no el binario | — | No | — | — | — | Front, Back, BD |
| Fecha de la constancia | Fecha | No | type=date | — | No | — | — | — | Front, Back, BD |
| Código de cliente | Texto (solo lectura) | — | varchar(32); en alta muestra placeholder | Se genera al guardar | Sí (por cuenta: uq_comprador_cuenta_codigo) | Nombre comercial o Razón social | generateCodigoCuentaFromNombre(nombre) al guardar | No se pudo generar el código del comprador. | Front, Back, BD |
| Nombre comercial | Texto | Sí | varchar(255) en columna nombre; HTML required | — | No | — | Es el nombre persistido; si queda vacío se usa razón social | Falta el nombre comercial. / El nombre del comprador es obligatorio. | Front, Back, BD |
| Apodo interno | Texto | No | text | — | No | — | — | — | Front, Back, BD |
| Grupo hotelero | Texto | No | text | — | No | — | — | — | Front, Back, BD |
| Vendedor asignado | Texto (solo lectura) | No | text; si vacío se muestra "—" | Nombre del usuario de sesión | No | Sesión | emptyAltaFormState(vendedorNombre); al guardar ficha.vendedor se fuerza a vendedorNombre | — | Front, Back, BD |
| Estado | Selección | No | Activo, Suspendido por cartera, Prospecto | Activo | No | — | — | — | Front, Back, BD |
| Teléfono | Teléfono internacional E.164 | No | Si hay valor, isValidInternationalPhone; si vacío se usa el primer teléfono de contacto válido | — | No | Contactos (fallback) | telefonoGuardar = teléfono principal o primer contacto válido o "" | Ingresa un número de teléfono válido. / El teléfono del comprador no es válido. | Front, Back, BD |
| Días de crédito | Número | No | type=number; min=0; se guarda como texto | 30 | No | — | — | — | Front, Back, BD |
| Límite de crédito (MXN) | Número | No | type=number; min=0; se guarda como texto | — | No | — | — | — | Front, Back, BD |
| Método de pago | Selección | No | PPD — Parcialidades o diferido, PUE — Una sola exhibición | PPD — Parcialidades o diferido | No | — | — | — | Front, Back, BD |
| Forma de pago | Selección | No | 03 — Transferencia electrónica, 01 — Efectivo, 99 — Por definir | 03 — Transferencia electrónica | No | — | — | — | Front, Back, BD |
| Moneda | Selección | No | MXN, USD | MXN | No | — | — | — | Front, Back, BD |
| ¿Exige orden de compra para facturar? | Selección | No | Sí, No | Sí | No | — | — | — | Front, Back, BD |
| Correos para envío del CFDI | Texto | No | text | — | No | — | — | — | Front, Back, BD |
| El hotel requiere complemento de pago por cada abono recibido | Checkbox | No | boolean | false | No | — | — | — | Front, Back, BD |
| Nombre del centro de consumo | Texto | No | text; fila repetible en UI | — | No | — | El servicio solo persiste el primer centro (centros[0]) | — | Front, Back, BD |
| Días que recibe | Texto | No | text | — | No | — | Primer centro | — | Front, Back, BD |
| Dirección (centro) | Texto | No | text | — | No | — | Primer centro | — | Front, Back, BD |
| CP (centro) | Texto | No | maxLength=5 | — | No | — | Primer centro | — | Front, Back, BD |
| Andén / punto de recepción | Texto | No | text | — | No | — | Primer centro | — | Front, Back, BD |
| Recibe desde | Hora | No | type=time | — | No | — | Primer centro | — | Front, Back, BD |
| Recibe hasta | Hora | No | type=time | — | No | — | Primer centro | — | Front, Back, BD |
| Contacto en el andén | Texto | No | text | — | No | — | Primer centro | — | Front, Back, BD |
| Teléfono del andén | Teléfono (type=tel) | No | text; sin validación E.164 en este campo | — | No | — | Primer centro | — | Front, Back, BD |
| ¿La ruta usa carretera federal? | Selección | No | No — entrega urbana local, Sí — más de 30 km en tramo federal | No — entrega urbana local | No | — | Primer centro | — | Front, Back, BD |
| Notas de acceso | Texto | No | text | — | No | — | Primer centro | — | Front, Back, BD |
| Nombre (contacto) | Texto | No | text; fila repetible en UI | — | No | — | El servicio solo persiste el primer contacto (contactos[0]) | — | Front, Back, BD |
| Puesto | Texto | No | text | — | No | — | Primer contacto | — | Front, Back, BD |
| Rol (contacto) | Selección | No | Hace pedidos, Recibe mercancía, Autoriza, Paga | Hace pedidos | No | — | Primer contacto | — | Front, Back, BD |
| Teléfono (contacto) | Teléfono (type=tel) | No | text; si el teléfono principal está vacío, el primero válido E.164 se usa como teléfono del comprador | — | No | Teléfono principal | Primer contacto | Ingresa un número de teléfono válido. | Front, Back, BD |
| Correo (contacto) | Texto | No | text | — | No | — | Primer contacto | — | Front, Back, BD |
| Números de WhatsApp autorizados | Texto | No | text | — | No | — | — | — | Front, Back, BD |
| Formato habitual del pedido | Selección | No | Texto libre, Orden de compra en PDF, Excel, Mezclado | Texto libre | No | — | — | — | Front, Back, BD |
| Correos desde los que piden | Texto | No | text | — | No | — | — | — | Front, Back, BD |
| El hotel opera un portal de proveedores con sus propios requisitos y calendario | Checkbox | No | boolean | false | No | — | Muestra el campo Portal de proveedores si está marcado | — | Front |
| Portal de proveedores | Texto | No | text | — | No | El hotel opera un portal de proveedores… | Solo visible si portalProveedores = true | — | Front, Back, BD |
| ¿Acepta sustituciones? | Selección | No | No — surtir parcial, Sí, avisando antes, Sí, a criterio de almacén | No — surtir parcial | No | — | — | — | Front, Back, BD |
| Tolerancia de peso | Selección | No | "" (Sin definir), ± 2%, ± 5%, ± 10% | — | No | — | — | — | Front, Back, BD |
| Vida útil mínima al entregar (días) | Número | No | type=number; min=0; se guarda como texto | — | No | — | — | — | Front, Back, BD |
| ¿Requiere lote y origen? | Selección | No | Sí, No | Sí | No | — | — | — | Front, Back, BD |
| ¿Requiere temperatura al entregar? | Selección | No | Sí, No | Sí | No | — | — | — | Front, Back, BD |
| ¿Requiere ficha técnica del producto? | Selección | No | Sí, No | No | No | — | — | — | Front, Back, BD |
| Política de rechazo y devolución | Texto largo | No | textarea | — | No | — | — | — | Front, Back, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Razón social | 1 | No | — |
| RFC | 2 | No | — |
| Régimen fiscal | 3 | No | — |
| CP del domicilio fiscal | 4 | No | — |
| Uso del CFDI por omisión | 5 | No | — |
| Constancia de Situación Fiscal | 6 | No | — |
| Fecha de la constancia | 7 | No | — |
| Código de cliente | 8 | Sí (siempre, readOnly) | — |
| Nombre comercial | 9 | No | Sí, al abrir el modal |
| Apodo interno | 10 | No | — |
| Grupo hotelero | 11 | No | — |
| Vendedor asignado | 12 | Sí (siempre, readOnly) | — |
| Estado | 13 | No | — |
| Teléfono | 14 | No | — |
| Días de crédito | 15 | No | — |
| Límite de crédito (MXN) | 16 | No | — |
| Método de pago | 17 | No | — |
| Forma de pago | 18 | No | — |
| Moneda | 19 | No | — |
| ¿Exige orden de compra para facturar? | 20 | No | — |
| Correos para envío del CFDI | 21 | No | — |
| El hotel requiere complemento de pago por cada abono recibido | 22 | No | — |
| Nombre del centro de consumo | 23 | No | — |
| Días que recibe | 24 | No | — |
| Dirección (centro) | 25 | No | — |
| CP (centro) | 26 | No | — |
| Andén / punto de recepción | 27 | No | — |
| Recibe desde | 28 | No | — |
| Recibe hasta | 29 | No | — |
| Contacto en el andén | 30 | No | — |
| Teléfono del andén | 31 | No | — |
| ¿La ruta usa carretera federal? | 32 | No | — |
| Notas de acceso | 33 | No | — |
| Nombre (contacto) | 34 | No | — |
| Puesto | 35 | No | — |
| Rol (contacto) | 36 | No | — |
| Teléfono (contacto) | 37 | No | — |
| Correo (contacto) | 38 | No | — |
| Números de WhatsApp autorizados | 39 | No | — |
| Formato habitual del pedido | 40 | No | — |
| Correos desde los que piden | 41 | No | — |
| El hotel opera un portal de proveedores… | 42 | No | — |
| Portal de proveedores | 43 | No | — |
| ¿Acepta sustituciones? | 44 | No | — |
| Tolerancia de peso | 45 | No | — |
| Vida útil mínima al entregar (días) | 46 | No | — |
| ¿Requiere lote y origen? | 47 | No | — |
| ¿Requiere temperatura al entregar? | 48 | No | — |
| ¿Requiere ficha técnica del producto? | 49 | No | — |
| Política de rechazo y devolución | 50 | No | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Vendedor asignado | Sí | Información de BD | No |

### Notas y justificaciones

La UI permite Agregar centro de consumo y Agregar contacto; el insert a `comprador` solo escribe columnas del primer centro y del primer contacto. listaPrecios existe en el estado de ficha pero no hay control visible. Sin cuenta: "No se encontró la cuenta activa.". Si falla: DomainServiceError o "No se pudo crear el comprador.". También se abre desde Ventas → Primera vez (stackLevel elevado). Equivalencias no se capturan en este alta.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
