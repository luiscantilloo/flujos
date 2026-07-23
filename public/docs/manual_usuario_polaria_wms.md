# Polaria WMS — Manual de usuario por rol

| Meta | Detalle |
| --- | --- |
| Audiencia | Usuarios operativos, administradores y Mateo Support |
| Fuente | `polaria-wms-web`, `polaria-wms-api`, `polaria-wms-db`, `Widget-react` |
| Estado | Jul 2026 |
| Propósito | Explicar qué hace cada rol, qué pantallas usa, qué procesos ejecuta y cuándo escalar |

> Este manual está escrito para soporte. Cuando un usuario pregunte "qué puedo hacer" o "por qué no veo una opción", primero identifica su **rol**, **scope** y **bodega/cuenta activa**.

---

## 1. Conceptos base

### 1.1 Jerarquía del sistema

```text
Empresa (cliente SaaS)
└── Cuenta / tenant operativo (`codigo_cuenta`)
    ├── Bodegas internas o externas
    ├── Catálogos: productos, proveedores, clientes, compradores, plantas, camiones
    ├── Documentos: SOL, OC, recepciones, OV, procesamiento, transporte
    └── Usuarios con roles de cuenta o bodega
```

### 1.2 Scopes

| Scope | Quién opera | Qué ve |
| --- | --- | --- |
| Plataforma | Configurador TI | Empresas, cuentas, bodegas y solicitudes de integración de todos los clientes |
| Cuenta | Administrador u operador de cuenta | Catálogos, compras, ventas, integración y reportes del tenant |
| Bodega | Roles operativos | Estado de bodega, ingreso, mapa, tareas, procesamiento, transporte y alertas |

### 1.3 Regla de permisos

- El menú se filtra por rol, scope y permisos.
- Si un usuario no ve una pantalla, normalmente falta rol, cuenta activa, bodega asignada o permiso de módulo.
- Las escrituras sensibles pasan por `polaria-wms-api`; las lecturas pueden venir de Supabase con RLS.
- El usuario no debe compartir tokens, contraseñas ni capturas con datos sensibles.

---

## 2. Acceso y sesión

### 2.1 Login usuario WMS

1. Abrir `/login`.
2. Ingresar correo.
3. Si el sistema lo requiere, informar código de empresa.
4. Ingresar contraseña.
5. El sistema consulta `/auth/me` y redirige según rol.

### 2.2 Login configurador

El configurador es rol de plataforma. No depende de una bodega concreta para entrar. Su trabajo principal es crear y mantener la estructura inicial de clientes.

### 2.3 SSO Mateo

| Flujo | Para qué sirve | Endpoint |
| --- | --- | --- |
| WMS → Mateo | Salir desde WMS hacia Mateo con sesión temporal | `POST /auth/mateo-handoff` |
| Mateo → WMS | Volver/canjear código de sesión | `POST /auth/mateo-exchange` |
| Widget Mateo | Chat embebido dentro del WMS | `POST /auth/mateo/widget-token` + `/mateo/conversaciones` |

### 2.4 Preguntas frecuentes de acceso

| Síntoma | Causa probable | Respuesta soporte |
| --- | --- | --- |
| No puedo entrar | Correo, empresa o contraseña incorrecta | Validar correo, empresa activa y que el usuario exista en esa empresa |
| Entré pero no veo bodega | Usuario sin `AsignacionBodega` | Pedir al administrador de cuenta asignar bodega |
| Veo menos módulos que otro usuario | Rol distinto o permiso de módulo | Confirmar rol esperado y scope |
| Mateo no abre | Token widget o bundle no disponible | Revisar sesión WMS, endpoint `widget-token` y origen permitido |

---

## 3. Resumen rápido por rol

| Rol | Scope | Ruta principal | Objetivo |
| --- | --- | --- | --- |
| Configurador | Plataforma | `/configurador` | Crear empresas/cuentas/bodegas y revisar integración |
| Administrador de cuenta | Cuenta | `/dashboard/administracion` | Mantener catálogos, usuarios, bodegas y reportes |
| Operador de cuenta | Cuenta | `/dashboard` hub cuenta | Gestionar compras, ventas e integración |
| Administrador de bodega | Bodega | `/dashboard/administrador-bodega/estado-bodega` | Supervisar estado, reportes y operación de bodega |
| Jefe de bodega | Bodega | `/dashboard/jefe-bodega/estado-bodega` | Priorizar trabajo, alertas, llamadas y procesamiento |
| Custodio | Bodega | `/dashboard/custodio/ingreso` | Recibir mercancía y operar ingreso/OC/OV |
| Operario | Bodega | `/dashboard/operario/operacion` | Ejecutar tareas y movimientos físicos |
| Procesador | Bodega | `/dashboard/procesador/operacion` | Ejecutar solicitudes de procesamiento |
| Transportista | Bodega | `/dashboard/transporte` | Registrar despacho, viaje, entrega y evidencias |

---

## 4. Manual del Configurador

### Qué hace

- Crea y actualiza empresas.
- Crea o actualiza cuentas/tenants.
- Crea bodegas y ejecuta bootstrap de layout.
- Crea usuarios iniciales de plataforma o administradores de cuenta.
- Revisa solicitudes de integración enviadas por cuentas.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/configurador` | Panel principal plataforma |
| `/configurador/creacion/cuentas` | Alta de cuenta/tenant |
| `/configurador/creacion/bodega-interna` | Alta de bodega interna |
| `/configurador/creacion/bodega-externa` | Alta de bodega externa |
| `/configurador/asignacion/usuarios` | Alta/asignación de usuarios |
| `/configurador/integracion` | Bandeja de solicitudes de integración |

### Proceso recomendado

1. Crear empresa.
2. Crear cuenta/tenant bajo esa empresa.
3. Crear bodega interna o externa.
4. Ejecutar layout inicial si aplica.
5. Crear administrador de cuenta.
6. Verificar que el administrador puede entrar y completar catálogos.

### Cuándo escalar

- Error al crear usuario en Supabase Auth.
- Bodega creada sin zonas o ubicaciones.
- Empresa/cuenta duplicada.
- Solicitud de integración con datos incompletos.

---

## 5. Manual del Administrador de cuenta

### Qué hace

- Mantiene catálogos de la cuenta: productos, proveedores, clientes, compradores, plantas, camiones.
- Crea usuarios de cuenta y bodega.
- Solicita o revisa bodegas internas/externas.
- Revisa reportes administrativos y de inventario.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/administracion/catalogo` | Catálogos del tenant |
| `/dashboard/administracion/asignacion-creacion/usuarios` | Usuarios del tenant |
| `/dashboard/administracion/asignacion-creacion/proveedores` | Proveedores |
| `/dashboard/administracion/asignacion-creacion/compradores` | Compradores |
| `/dashboard/administracion/asignacion-creacion/camiones` | Flota |
| `/dashboard/administracion/asignacion-creacion/bodega-interna` | Bodegas internas |
| `/dashboard/administracion/asignacion-creacion/bodega-externa` | Bodegas externas |
| `/dashboard/reporteria` | Reportes de inventario/mercancía |

### Buenas prácticas

- Crear catálogos antes de iniciar compras o ventas.
- Asignar bodega a todo rol operativo.
- Revisar que productos tengan metadatos de catálogo suficientes.
- No crear usuarios de bodega sin rol claro.

### Preguntas frecuentes

| Pregunta | Respuesta |
| --- | --- |
| ¿Por qué no puedo crear una OC? | Revisa que existan proveedor, producto y bodega destino. |
| ¿Por qué un usuario no ve mapa? | Debe tener rol con acceso y bodega asignada. |
| ¿Quién crea la bodega? | Normalmente configurador; admin cuenta puede gestionar según permiso/API. |

---

## 6. Manual del Operador de cuenta

### Qué hace

- Gestiona solicitudes de compra (SOL).
- Convierte SOL aprobadas en órdenes de compra (OC).
- Gestiona órdenes de venta (OV).
- Envía solicitudes de integración de bodega externa.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/compras` | SOL, OC y seguimiento compras |
| `/dashboard/ventas` | OV y emisión |
| `/dashboard/bodega-externa` | Integración bodega externa |
| `/dashboard/bodega-interna` | Accesos de operación cuenta para bodega interna |

### Flujo SOL → OC

1. Crear SOL en borrador.
2. Enviar a aprobación.
3. Administrador aprueba o rechaza.
4. Si se aprueba, convertir a OC.
5. Emitir OC y coordinar recepción en bodega.

### Flujo OV

1. Crear o revisar orden de venta.
2. Verificar comprador, productos y disponibilidad.
3. Emitir OV.
4. Coordinar despacho/transporte si aplica.

---

## 7. Manual del Administrador de bodega

### Qué hace

- Supervisa estado visual de bodega.
- Revisa reportes de bodega.
- Puede acompañar decisiones de operación, alertas y capacidad.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/administrador-bodega/estado-bodega` | Estado visual y ocupación |
| `/dashboard/administrador-bodega/reportes-bodega` | Reportes operativos |

### Indicadores que debe mirar

- Ocupación por zona.
- Slots bloqueados o con alerta.
- Tareas abiertas.
- Mercancía demorada en entrada o salida.
- Incidencias de temperatura.

---

## 8. Manual del Jefe de bodega

### Qué hace

- Coordina el trabajo diario de bodega.
- Atiende llamadas de operarios.
- Asigna alertas y tareas.
- Prioriza ingreso, salida, procesamiento y movimientos internos.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/jefe-bodega/estado-bodega` | Vista operativa principal |
| `/dashboard/jefe-bodega/reportes-bodega` | Reportes |
| Modales de acciones jefe | Ingreso, transferencia, salida, alertas, llamadas |

### Rutina diaria sugerida

1. Revisar alertas activas.
2. Revisar cola de tareas.
3. Confirmar operarios disponibles.
4. Priorizar ingreso/salida según OC/OV.
5. Asignar procesamiento si hay solicitudes.
6. Cerrar incidencias con motivo.

### Cuándo escalar

- Lock de inventario no se libera.
- Diferencia grave entre físico y sistema.
- Temperatura fuera de rango sin resolución.
- Procesamiento cerrado con balance incorrecto.

---

## 9. Manual del Custodio

### Qué hace

- Recibe mercancía.
- Valida OC/OV según el flujo.
- Registra recepciones y diferencias.
- Coordina ingreso físico hacia bodega o salida.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/custodio/ingreso` | Entrada principal custodio |
| `/dashboard/custodio/orden-compra` | Operación sobre OC |
| `/dashboard/custodio/orden-venta` | Operación sobre OV |
| `/dashboard/ingreso` | Ingreso general según permisos |

### Recepción contra OC

1. Buscar OC.
2. Validar proveedor, líneas y bodega destino.
3. Registrar cantidades recibidas.
4. Registrar diferencias o líneas adicionales.
5. Cerrar recepción.
6. Informar al jefe si se requiere ubicación o tarea.

### Errores comunes

| Problema | Qué revisar |
| --- | --- |
| No aparece la OC | Estado, tenant, bodega destino o emisión pendiente |
| No puedo cerrar recepción | Líneas incompletas, payload inválido o rol insuficiente |
| Cantidad no cuadra | Registrar diferencia; no forzar inventario manual |

---

## 10. Manual del Operario

### Qué hace

- Ejecuta tareas físicas asignadas.
- Mueve mercancía entre zonas/ubicaciones.
- Atiende órdenes de trabajo.
- Reporta incidencias.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/operario/operacion` | Cola operativa |
| `/dashboard/mapa` | Mapa/inventario según permisos |

### Flujo de tarea

1. Abrir cola.
2. Tomar o revisar tarea asignada.
3. Ejecutar movimiento físico.
4. Confirmar resultado.
5. Reportar incidencia si no coincide con la realidad.

### Reglas importantes

- No mover físicamente sin tarea cuando el proceso exige trazabilidad.
- Si un slot aparece bloqueado, no intentar duplicar operación.
- Si hay diferencia, reportar al jefe; no corregir cantidades sin autorización.

---

## 11. Manual del Procesador

### Qué hace

- Ejecuta solicitudes de procesamiento.
- Registra merma, sobrante o producto resultante.
- Trabaja con cola enfocada en procesamiento.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/procesador/operacion` | Cola de procesamiento |
| `/dashboard/procesamiento` | Solicitudes y estado del flujo |

### Flujo procesamiento

1. Recibir asignación.
2. Iniciar solicitud.
3. Procesar insumo.
4. Registrar resultado, merma y sobrante.
5. Cerrar solicitud.
6. Aplicar órdenes post-cierre si corresponden.

### Soporte debe validar

- Estado de solicitud.
- Usuario asignado.
- Producto/ubicación/lote de origen.
- Balance de kg informado.
- Si hay órdenes post-cierre pendientes.

---

## 12. Manual del Transportista

### Qué hace

- Atiende viajes y paquetes de despacho.
- Registra entrega al comprador/destino.
- Adjunta evidencia: foto, firma o incidencia.

### Pantallas habituales

| Pantalla | Uso |
| --- | --- |
| `/dashboard/transporte` | Viajes, entregas y evidencias |

### Flujo entrega

1. Abrir viaje o paquete asignado.
2. Revisar detalle de productos/cantidades.
3. Registrar cantidades entregadas.
4. Marcar conformidad o incidencia.
5. Adjuntar evidencia.
6. Finalizar entrega.

### Problemas comunes

| Problema | Qué revisar |
| --- | --- |
| No sube foto | Configuración Cloudinary, tamaño/formato o conectividad |
| No aparece viaje | Rol transportista, bodega asignada o paquete no creado |
| Entrega no cierra | Campos obligatorios incompletos o evidencia faltante |

---

## 13. Mateo Support y Widget

### Qué es

Widget-react es el chat embebible de Mateo Support dentro del WMS. El usuario lo ve como botón flotante y puede consultar dudas sin salir del sistema.

### Qué ocurre técnicamente

```text
Usuario WMS
→ MateoWidgetHost en polaria-wms-web
→ POST /auth/mateo/widget-token
→ Widget-react envía mensaje a n8n
→ polaria-wms-api guarda historial en /mateo/conversaciones
→ Supabase persiste widget_conversacion/widget_mensaje
```

### Buenas respuestas para Mateo Support

- Preguntar siempre rol, cuenta y bodega si la duda es de permisos.
- Indicar la ruta exacta cuando sea una acción de pantalla.
- Si la respuesta implica datos productivos, pedir validación con administrador o jefe.
- Si hay error técnico, pedir hora, usuario, ruta, acción realizada y mensaje exacto.

### Escalamiento técnico Mateo

| Síntoma | Equipo |
| --- | --- |
| Widget no carga | Frontend WMS / Widget-react |
| Token widget falla | API/auth |
| Mensaje no responde | n8n/Mateo |
| Historial no guarda | API Mateo widget / DB `widget_*` |

---

## 14. Matriz de procesos por rol

| Proceso | Configurador | Admin cuenta | Operador cuenta | Admin bodega | Jefe | Custodio | Operario | Procesador | Transportista |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Crear empresa/cuenta | Sí | No | No | No | No | No | No | No | No |
| Crear usuarios | Plataforma/admin | Sí | No | No | No | No | No | No | No |
| Catálogos | No | Sí | Consulta/uso | Consulta | Consulta | Consulta | No | Consulta | No |
| SOL/OC | No | Sí | Sí | Consulta | Consulta | Recepción | No | No | No |
| Recepción | No | Consulta | Consulta | Consulta | Coordina | Sí | Apoya | No | No |
| Mapa/inventario | No | Reporte | Consulta | Supervisa | Supervisa | Consulta/ingreso | Ejecuta | Consulta | No |
| Operaciones/OT | No | Consulta | Consulta | Supervisa | Crea/asigna | Apoya | Ejecuta | Ejecuta si aplica | No |
| Procesamiento | No | Consulta | Crea/consulta | Supervisa | Asigna | Apoya | Apoya | Ejecuta | No |
| Ventas/OV | No | Sí | Sí | Consulta | Coordina salida | Salida | Picking | No | Entrega |
| Transporte | No | Consulta | Coordina | Supervisa | Coordina | Despacho | Apoya | No | Ejecuta |
| Mateo soporte | Usa si aplica | Usa | Usa | Usa | Usa | Usa | Usa | Usa | Usa |

---

## 15. Checklist de soporte antes de escalar

1. Identificar usuario, correo, rol y empresa.
2. Confirmar `codigo_cuenta` y bodega activa.
3. Confirmar ruta donde ocurre el problema.
4. Preguntar acción exacta y resultado esperado.
5. Pedir captura sin datos sensibles si es necesario.
6. Verificar si el usuario tiene permiso para esa acción.
7. Determinar si el problema es UI, API, DB/RLS, integración o datos.
8. Escalar con contexto completo y hora aproximada.

---

## 16. Glosario rápido

| Término | Significado |
| --- | --- |
| SOL | Solicitud de compra |
| OC | Orden de compra |
| OV | Orden de venta |
| OT | Orden de trabajo |
| Tenant | Cuenta operativa (`codigo_cuenta`) dentro de una empresa |
| Bodega | Lugar físico o externo asociado al tenant |
| RLS | Row Level Security de Supabase/Postgres |
| `warehouse_state` | Estado relacional del inventario por ubicación/producto/lote |
| Lock | Bloqueo temporal para evitar doble operación sobre el mismo stock |
| Mateo Widget | Chat embebido de soporte |
