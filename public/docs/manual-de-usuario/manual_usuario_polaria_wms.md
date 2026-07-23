# MANUAL DE USUARIO — POLARIA WMS (PARA SOPORTE MATEO)

| Meta | Detalle |
| --- | --- |
| Documento | Manual de usuario por rol y proceso |
| Audiencia | Operación, onboarding y soporte Mateo |
| Alcance | Polaria WMS + integración Mateo Widget |
| Última actualización | Julio 2026 |

---

## 1. Objetivo del manual

Este manual explica **qué hace cada rol**, **qué pantallas usa**, **qué procesos ejecuta** y **cómo responder dudas frecuentes**.

Está diseñado para que Mateo Support pueda:

- orientar al usuario según su rol real,
- validar si un comportamiento es esperado o incidente,
- escalar con contexto técnico correcto.

---

## 2. Mapa de roles y responsabilidades

| Rol | Nivel | Objetivo principal |
| --- | --- | --- |
| `configurador` | Plataforma | Crear empresa, tenant, bodegas y primer admin |
| `administrador_cuenta` | Cuenta | Gobernar operación de su tenant y su equipo |
| `operador_cuenta` | Cuenta | Operar compras/ventas/procesos comerciales |
| `administrador_bodega` | Bodega | Supervisar estado y reportes de bodega |
| `jefe_bodega` | Bodega | Coordinar ejecución operativa y asignaciones |
| `custodio` | Bodega | Controlar ingreso/salida física y recepción |
| `operario` | Bodega | Ejecutar tareas y movimientos operativos |
| `procesador` | Bodega | Ejecutar solicitudes de procesamiento |
| `transportista` | Bodega/Cuenta | Registrar entregas y evidencias de transporte |

---

## 3. Procesos transversales (todos los usuarios)

### 3.1 Inicio de sesión

1. Ingresar empresa.
2. Ingresar usuario.
3. Ingresar contraseña.
4. Sistema carga perfil + rol + tenant + bodegas.

Si el usuario no entra:

- validar empresa activa,
- validar que el usuario pertenezca a la empresa,
- validar credenciales y sesión no revocada.

### 3.2 Cambio de contexto (tenant/bodega)

Antes de reportar error:

- confirmar tenant correcto,
- confirmar bodega activa,
- confirmar que el rol tiene acceso a esa bodega.

### 3.3 Reglas de soporte rápidas

- Si un usuario ve datos de otra cuenta: **incidente crítico de seguridad**.
- Si no puede escribir pero sí leer: validar si el flujo exige API/rol específico.
- Si mapa no actualiza: revisar realtime y conectividad.

---

## 4. Manual por rol (funciones, procesos y límites)

## 4.1 Configurador

### Qué hace

- crea empresas,
- crea cuentas (tenant),
- crea bodegas internas/externas,
- crea el primer administrador de cuenta,
- revisa bandeja global de integración.

### Qué no hace

- no opera mercancía diaria,
- no ejecuta tareas de bodega.

### Preguntas frecuentes

- "No veo mi empresa nueva" → confirmar que quedó asociada a tenant y que el admin cuenta fue creado.
- "No aparece la bodega" → validar bootstrap layout y zonas operativas.

## 4.2 Administrador de cuenta

### Qué hace

- gestiona usuarios de su tenant,
- mantiene catálogos (productos/clientes/proveedores/compradores),
- gestiona compras, ventas y reportes de cuenta.

### Qué no hace

- no crea empresas nuevas (eso es configurador),
- no debe ver tenants de otras empresas.

### Preguntas frecuentes

- "No puedo aprobar SOL" → validar rol y estado de SOL.
- "No aparece usuario en bodega" → revisar asignación de bodega.

## 4.3 Operador de cuenta

### Qué hace

- crea y opera SOL/OC según permisos,
- trabaja en flujo de ventas y solicitudes de integración,
- coordina necesidades de operación con bodega.

### Qué no hace

- no administra plataforma global,
- no modifica políticas de seguridad.

### Preguntas frecuentes

- "No aparece botón de aprobar" → aprobación restringida a roles de mayor alcance.
- "No puedo ver bodega externa" → validar habilitación de integración y permisos.

## 4.4 Administrador de bodega

### Qué hace

- supervisa estado de bodega,
- revisa reportes de operación,
- participa en decisiones de bloqueo/desbloqueo.

### Qué no hace

- no crea empresas/cuentas,
- no gestiona usuarios de plataforma.

### Preguntas frecuentes

- "Slot en estado incorrecto" → comparar `estado_slot` vs stock real y escalar a incidente mapa.

## 4.5 Jefe de bodega

### Qué hace

- crea/asigna trabajo operativo,
- coordina tareas, alertas y llamadas,
- gobierna flujo de procesamiento y salida.

### Qué no hace

- no administra plataforma global,
- no modifica configuración de seguridad.

### Preguntas frecuentes

- "No puedo asignar operario" → validar disponibilidad de operarios y scope de bodega.

## 4.6 Custodio

### Qué hace

- registra ingresos físicos,
- participa en recepción y despacho,
- valida documentación y estado de mercancía.

### Qué no hace

- no administra tenants,
- no debe ejecutar acciones fuera de su bodega.

### Preguntas frecuentes

- "No me deja bloquear un slot" → revisar permiso lock (hay deuda conocida en algunos casos).

## 4.7 Operario

### Qué hace

- ejecuta tareas operativas asignadas,
- completa movimientos físicos,
- reporta incidencias de ejecución.

### Qué no hace

- no configura catálogos,
- no aprueba compras.

### Preguntas frecuentes

- "Error de lock/version" → otro usuario modificó ese slot; reintentar tras refresco y verificar asignación.

## 4.8 Procesador

### Qué hace

- ejecuta solicitudes de procesamiento,
- registra resultados y merma,
- cierra tareas de procesamiento.

### Qué no hace

- no administra configuración de empresa/tenant,
- no gestiona usuarios.

### Preguntas frecuentes

- "No me deja cerrar solicitud" → validar estado previo y precondiciones del flujo.

## 4.9 Transportista

### Qué hace

- registra entregas,
- adjunta evidencia (foto/firma),
- actualiza estado de transporte.

### Qué no hace

- no debe editar inventario interno,
- no administra catálogos.

### Preguntas frecuentes

- "No sube evidencia" → validar variables Cloudinary, formato/tamaño y conectividad.

---

## 5. Manual de procesos críticos

### 5.1 Compras (SOL → OC → recepción)

1. Crear SOL.
2. Aprobar/rechazar SOL.
3. Convertir a OC.
4. Emitir OC.
5. Registrar/cerrar recepción.

Controles:

- revisar estado de transición,
- validar rol autorizado,
- validar tenant/bodega correctos.

### 5.2 Inventario y mapa (locks + FEFO)

1. Consultar estado de slot en mapa.
2. Bloquear slot antes de mover (si aplica).
3. Ejecutar tarea/movimiento.
4. Desbloquear/actualizar estado.
5. Verificar sincronía visual (`estado_slot` vs stock).

### 5.3 Operaciones (OT/tareas/alertas)

1. Crear OT.
2. Asignar tarea.
3. Ejecutar/Completar.
4. Atender alertas/llamadas.
5. Cerrar ciclo operativo.

### 5.4 Procesamiento

1. Crear solicitud.
2. Asignar ejecutor.
3. Iniciar.
4. Registrar salida (producto/merma).
5. Cerrar.

### 5.5 Ventas y transporte

1. Emitir OV.
2. Armar paquete despacho.
3. Registrar entrega.
4. Subir evidencia.
5. Cerrar viaje.

### 5.6 Soporte Mateo (widget)

1. Usuario abre widget embebido.
2. Host obtiene token corto de API.
3. Widget envía mensaje a n8n.
4. Conversación persiste en backend/DB.
5. Usuario recupera historial al volver.

---

## 6. Matriz de errores comunes para soporte

| Síntoma reportado | Causa probable | Acción de soporte |
| --- | --- | --- |
| No puedo iniciar sesión | Empresa/usuario inválido o sesión revocada | Validar empresa, usuario y credenciales |
| No veo datos que debería ver | Scope tenant/bodega incorrecto | Confirmar contexto y asignaciones |
| Veo datos de otra cuenta | Posible fuga cross-tenant | Escalar como incidente crítico |
| No puedo bloquear slot | Permiso insuficiente o lock de otro usuario | Confirmar rol y estado de lock |
| Mapa desincronizado | Realtime o refresco incompleto | Refrescar, validar realtime y escalar si persiste |
| No sube evidencia transporte | Configuración Cloudinary o archivo inválido | Validar variables, formato, tamaño |
| Widget Mateo no responde | Token/widget/n8n | Revisar emisión token y webhook |

---

## 7. Cuándo escalar al equipo técnico

Escalar inmediatamente cuando:

- hay sospecha de fuga de datos entre tenants,
- el mapa muestra inconsistencias persistentes,
- hay errores masivos de login,
- se cae integración crítica (n8n/Cloudinary/Widget),
- una transición de estado crítica no funciona en producción.

Información mínima para escalar:

- rol del usuario,
- tenant y bodega,
- ruta/pantalla,
- acción exacta realizada,
- hora aproximada,
- mensaje de error/captura.

---

## 8. Enlaces útiles para soporte

- Documentación técnica V2: `/documentacion/bodega-frio-documentacion-v20`
- Referencia API viva: `/referencia/api/bodega-frio`
- Referencia testing viva: `/referencia/testing/bodega-frio`
- Recursos/scripts: `/recursos`
