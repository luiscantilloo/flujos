### Datos del formulario

| Campo | Valor |
|---|---|
| Formulario | Editar comprador |
| Proyecto / repo | polaria-wms-web |
| Protocolo de referencia | PROTOCOLO_DE_VALIDACION_DE_FORMULARIOS_v1.0.md |
| ¿Vive en un modal? | Sí |
| ¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)? | Sí |
| Responsable (Desarrollador) | Desarrollador frontend |
| Fecha de creación | 15/09/2026 |

### Tabla 1 — Validación de datos (Niveles 1, 3, 4, 5)

| Campo | Tipo de dato | Obligatorio | Rango/Límite | Valor por defecto | Único | Depende de | Regla de dependencia | Mensaje de error | Capas aplicables (Front/Back/BD) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Razón social | Texto | No | text | ficha.razonSocial | No | Comprador abierto | Si Nombre comercial está vacío, se usa razón social | Falta el nombre comercial. / El nombre del comprador es obligatorio. | Front, Back, BD |
| RFC | Texto | No | maxLength=13; mayúsculas | ficha.rfc | No | Comprador abierto | — | — | Front, Back, BD |
| Régimen fiscal | Selección | No | "", 601 — General de ley personas morales, 612 — Personas físicas con actividad empresarial, 626 — RESICO, 616 — Sin obligaciones fiscales | ficha.regimen | No | Comprador abierto | — | — | Front, Back, BD |
| CP del domicilio fiscal | Texto | No | maxLength=5 | ficha.cpFiscal | No | Comprador abierto | — | — | Front, Back, BD |
| Uso del CFDI por omisión | Selección | No | G01, G03, S01 | ficha.usoCfdi o G01 — Adquisición de mercancías | No | Comprador abierto | — | — | Front, Back, BD |
| Constancia de Situación Fiscal | Archivo PDF | No | Solo nombre de archivo | ficha.constanciaNombre | No | Comprador abierto | — | — | Front, Back, BD |
| Fecha de la constancia | Fecha | No | type=date | ficha.constanciaFecha | No | Comprador abierto | — | — | Front, Back, BD |
| Código de cliente | Texto (solo lectura) | Sí | varchar(32) | comprador.codigo | Sí (por cuenta: uq_comprador_cuenta_codigo) | Comprador abierto | No se modifica | — | Front, BD |
| Nombre comercial | Texto | Sí | varchar(255); HTML required | comprador / detalle.comprador | No | Comprador abierto | — | Falta el nombre comercial. / El nombre del comprador es obligatorio. | Front, Back, BD |
| Apodo interno | Texto | No | text | ficha.apodo | No | Comprador abierto | — | — | Front, Back, BD |
| Grupo hotelero | Texto | No | text | ficha.grupo | No | Comprador abierto | — | — | Front, Back, BD |
| Vendedor asignado | Texto (solo lectura) | No | text | ficha.vendedor | No | Comprador abierto | — | — | Front, Back, BD |
| Estado | Selección | No | Activo, Suspendido por cartera, Prospecto | ficha.estado o Activo | No | Comprador abierto | — | — | Front, Back, BD |
| Teléfono | Teléfono internacional E.164 | No | Si hay valor, isValidInternationalPhone | detalle.telefono | No | Contactos (fallback) | Si el principal está vacío se usa el primer contacto E.164 válido | Ingresa un número de teléfono válido. / El teléfono del comprador no es válido. | Front, Back, BD |
| Días de crédito | Número | No | min=0 | ficha.diasCredito o 30 | No | Comprador abierto | — | — | Front, Back, BD |
| Límite de crédito (MXN) | Número | No | min=0 | ficha.limiteCredito | No | Comprador abierto | — | — | Front, Back, BD |
| Método de pago | Selección | No | PPD, PUE | ficha.metodoPago o PPD — Parcialidades o diferido | No | Comprador abierto | — | — | Front, Back, BD |
| Forma de pago | Selección | No | 03, 01, 99 | ficha.formaPago o 03 — Transferencia electrónica | No | Comprador abierto | — | — | Front, Back, BD |
| Moneda | Selección | No | MXN, USD | ficha.moneda o MXN | No | Comprador abierto | — | — | Front, Back, BD |
| ¿Exige orden de compra para facturar? | Selección | No | Sí, No | ficha.exigeOc o Sí | No | Comprador abierto | — | — | Front, Back, BD |
| Correos para envío del CFDI | Texto | No | text | ficha.correosCfdi | No | Comprador abierto | — | — | Front, Back, BD |
| El hotel requiere complemento de pago por cada abono recibido | Checkbox | No | boolean | ficha.complementoPago | No | Comprador abierto | — | — | Front, Back, BD |
| Nombre del centro de consumo | Texto | No | text | ficha.centros[0].nombre | No | Comprador abierto | Solo se persiste el primer centro | — | Front, Back, BD |
| Días que recibe | Texto | No | text | ficha.centros[0].dias | No | Comprador abierto | — | — | Front, Back, BD |
| Dirección (centro) | Texto | No | text | ficha.centros[0].direccion | No | Comprador abierto | — | — | Front, Back, BD |
| CP (centro) | Texto | No | maxLength=5 | ficha.centros[0].cp | No | Comprador abierto | — | — | Front, Back, BD |
| Andén / punto de recepción | Texto | No | text | ficha.centros[0].anden | No | Comprador abierto | — | — | Front, Back, BD |
| Recibe desde | Hora | No | type=time | ficha.centros[0].desde | No | Comprador abierto | — | — | Front, Back, BD |
| Recibe hasta | Hora | No | type=time | ficha.centros[0].hasta | No | Comprador abierto | — | — | Front, Back, BD |
| Contacto en el andén | Texto | No | text | ficha.centros[0].contacto | No | Comprador abierto | — | — | Front, Back, BD |
| Teléfono del andén | Teléfono (type=tel) | No | text | ficha.centros[0].telefono | No | Comprador abierto | — | — | Front, Back, BD |
| ¿La ruta usa carretera federal? | Selección | No | No — entrega urbana local, Sí — más de 30 km en tramo federal | ficha.centros[0].carreteraFederal o No — entrega urbana local | No | Comprador abierto | — | — | Front, Back, BD |
| Notas de acceso | Texto | No | text | ficha.centros[0].notas | No | Comprador abierto | — | — | Front, Back, BD |
| Nombre (contacto) | Texto | No | text | ficha.contactos[0].nombre | No | Comprador abierto | Solo se persiste el primer contacto | — | Front, Back, BD |
| Puesto | Texto | No | text | ficha.contactos[0].puesto | No | Comprador abierto | — | — | Front, Back, BD |
| Rol (contacto) | Selección | No | Hace pedidos, Recibe mercancía, Autoriza, Paga | ficha.contactos[0].rol o Hace pedidos | No | Comprador abierto | — | — | Front, Back, BD |
| Teléfono (contacto) | Teléfono (type=tel) | No | text | ficha.contactos[0].telefono | No | Teléfono principal | — | Ingresa un número de teléfono válido. | Front, Back, BD |
| Correo (contacto) | Texto | No | text | ficha.contactos[0].correo | No | Comprador abierto | — | — | Front, Back, BD |
| Números de WhatsApp autorizados | Texto | No | text | ficha.whatsapp | No | Comprador abierto | — | — | Front, Back, BD |
| Formato habitual del pedido | Selección | No | Texto libre, Orden de compra en PDF, Excel, Mezclado | ficha.formatoPedido o Texto libre | No | Comprador abierto | — | — | Front, Back, BD |
| Correos desde los que piden | Texto | No | text | ficha.correosPedido | No | Comprador abierto | — | — | Front, Back, BD |
| El hotel opera un portal de proveedores… | Checkbox | No | boolean | ficha.portalProveedores | No | Comprador abierto | Muestra Portal de proveedores si está marcado | — | Front, Back, BD |
| Portal de proveedores | Texto | No | text | ficha.portalNota | No | Portal de proveedores checkbox | Solo visible si portalProveedores = true | — | Front, Back, BD |
| ¿Acepta sustituciones? | Selección | No | No — surtir parcial, Sí, avisando antes, Sí, a criterio de almacén | ficha.sustituciones o No — surtir parcial | No | Comprador abierto | — | — | Front, Back, BD |
| Tolerancia de peso | Selección | No | "", ± 2%, ± 5%, ± 10% | ficha.tolerancia | No | Comprador abierto | — | — | Front, Back, BD |
| Vida útil mínima al entregar (días) | Número | No | min=0 | ficha.vidaUtil | No | Comprador abierto | — | — | Front, Back, BD |
| ¿Requiere lote y origen? | Selección | No | Sí, No | ficha.requiereLote o Sí | No | Comprador abierto | — | — | Front, Back, BD |
| ¿Requiere temperatura al entregar? | Selección | No | Sí, No | ficha.requiereTemp o Sí | No | Comprador abierto | — | — | Front, Back, BD |
| ¿Requiere ficha técnica del producto? | Selección | No | Sí, No | ficha.requiereFicha o No | No | Comprador abierto | — | — | Front, Back, BD |
| Política de rechazo y devolución | Texto largo | No | textarea | ficha.politicaDevolucion | No | Comprador abierto | — | — | Front, Back, BD |
| Equivalencia (pestaña Equivalencia) | Texto | Sí si la fila cambió | varchar(255); no puede quedar vacío si se editó | alias de comprador_producto_alias | Sí (id_comprador + id_producto) | Fila de alias | Se envía en el mismo Guardar del modal si el draft cambió | La equivalencia no puede quedar vacía. / La equivalencia es obligatoria. / La equivalencia no puede superar 255 caracteres. | Front, Back, BD |
| Precio comprador (pestaña Equivalencia) | Número decimal (texto) | No | ≥ 0; vacío → quitar override (null = lista default); parseDecimalEs | precio override o lista | No | Fila de alias | Si el valor iguala precioLista se guarda null | Ingresa un precio válido (0 o mayor). | Front, Back, BD |
| Código (pestaña Equivalencia) | Texto | — | Código de catálogo | alias.codigoProducto | No | Fila de alias | No editable | — | Front, BD |
| Nombre (pestaña Equivalencia) | Texto | — | Título de catálogo | alias.nombreProducto | No | Fila de alias | No editable | — | Front, BD |
| Unidad (pestaña Equivalencia) | Texto | — | Unidad de catálogo | alias.unidad | No | Fila de alias | No editable | — | Front, BD |

### Tabla 2 — Interacción (Nivel 2)

| Campo | Orden de tabulación | Deshabilitado | Foco automático (cuándo, si aplica) |
| --- | --- | --- | --- |
| Pestaña Editar información | — | No | Activa al abrir |
| Pestaña Equivalencia | — | No | — |
| Código de cliente | 1 (pestaña información) | Sí (siempre, readOnly) | — |
| Nombre comercial | 2 (pestaña información) | No (también si isLoading) | — |
| Resto de ficha (misma grilla que el alta) | Sigue el DOM de CompradorAltaFormFields | Sí mientras isLoading o isSubmitting | — |
| Equivalencia (por fila) | 1+ en pestaña Equivalencia | Sí mientras isLoading o isSubmitting | — |
| Precio comprador (por fila) | Sigue a Equivalencia de la fila | Sí mientras isLoading o isSubmitting | — |
| Crear equivalencia (botón) | Tras la grilla | Sí mientras isLoading o isSubmitting | — |

### Tabla 3 — Pre-llenado

| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |
|---|---|---|---|
| Razón social | Sí | Información de BD | Sí |
| RFC | Sí | Información de BD | Sí |
| Régimen fiscal | Sí | Información de BD | Sí |
| CP del domicilio fiscal | Sí | Información de BD | Sí |
| Uso del CFDI por omisión | Sí | Información de BD | Sí |
| Constancia de Situación Fiscal | Sí | Información de BD | Sí |
| Fecha de la constancia | Sí | Información de BD | Sí |
| Código de cliente | Sí | Información de BD | No |
| Nombre comercial | Sí | Información de BD | Sí |
| Apodo interno | Sí | Información de BD | Sí |
| Grupo hotelero | Sí | Información de BD | Sí |
| Vendedor asignado | Sí | Información de BD | No |
| Estado | Sí | Información de BD | Sí |
| Teléfono | Sí | Información de BD | Sí |
| Días de crédito | Sí | Información de BD | Sí |
| Límite de crédito (MXN) | Sí | Información de BD | Sí |
| Método de pago | Sí | Información de BD | Sí |
| Forma de pago | Sí | Información de BD | Sí |
| Moneda | Sí | Información de BD | Sí |
| ¿Exige orden de compra para facturar? | Sí | Información de BD | Sí |
| Correos para envío del CFDI | Sí | Información de BD | Sí |
| El hotel requiere complemento de pago por cada abono recibido | Sí | Información de BD | Sí |
| Nombre del centro de consumo | Sí | Información de BD | Sí |
| Días que recibe | Sí | Información de BD | Sí |
| Dirección (centro) | Sí | Información de BD | Sí |
| CP (centro) | Sí | Información de BD | Sí |
| Andén / punto de recepción | Sí | Información de BD | Sí |
| Recibe desde | Sí | Información de BD | Sí |
| Recibe hasta | Sí | Información de BD | Sí |
| Contacto en el andén | Sí | Información de BD | Sí |
| Teléfono del andén | Sí | Información de BD | Sí |
| ¿La ruta usa carretera federal? | Sí | Información de BD | Sí |
| Notas de acceso | Sí | Información de BD | Sí |
| Nombre (contacto) | Sí | Información de BD | Sí |
| Puesto | Sí | Información de BD | Sí |
| Rol (contacto) | Sí | Información de BD | Sí |
| Teléfono (contacto) | Sí | Información de BD | Sí |
| Correo (contacto) | Sí | Información de BD | Sí |
| Números de WhatsApp autorizados | Sí | Información de BD | Sí |
| Formato habitual del pedido | Sí | Información de BD | Sí |
| Correos desde los que piden | Sí | Información de BD | Sí |
| El hotel opera un portal de proveedores… | Sí | Información de BD | Sí |
| Portal de proveedores | Sí | Información de BD | Sí |
| ¿Acepta sustituciones? | Sí | Información de BD | Sí |
| Tolerancia de peso | Sí | Información de BD | Sí |
| Vida útil mínima al entregar (días) | Sí | Información de BD | Sí |
| ¿Requiere lote y origen? | Sí | Información de BD | Sí |
| ¿Requiere temperatura al entregar? | Sí | Información de BD | Sí |
| ¿Requiere ficha técnica del producto? | Sí | Información de BD | Sí |
| Política de rechazo y devolución | Sí | Información de BD | Sí |
| Equivalencia (pestaña Equivalencia) | Sí | Información de BD | Sí |
| Precio comprador (pestaña Equivalencia) | Sí | Información de BD | Sí |
| Código (pestaña Equivalencia) | Sí | Información de BD | No |
| Nombre (pestaña Equivalencia) | Sí | Información de BD | No |
| Unidad (pestaña Equivalencia) | Sí | Información de BD | No |

### Notas y justificaciones

Guardar está deshabilitado si no hay cambios (ficha ni equivalencias) o mientras carga. La pestaña Equivalencia edita alias y precio en el mismo submit que la ficha. El botón Crear equivalencia abre un modal anidado (schema_equivalencia_crear.md) que no viaja en este submit. Carga fallida: "No se pudo cargar la ficha del comprador.". Sin cuenta: "No se encontró la cuenta activa.". Mutación: DomainServiceError o "No se pudo actualizar el comprador.". UI de centros/contactos extra vs persistencia del primero: igual que el alta. Mientras hay equivalencia anidada no se cierra con Escape.

### Versión y revisión (del schema de ese formulario, no de esta plantilla)

| Campo | Valor |
|---|---|
| Versión del schema | v1.0 |
| Fecha de aprobación | 15/09/2026 |
| Aprobado por | Pendiente de aprobación |
| Próxima revisión | Cuando el formulario cambie de campos o de reglas |
