# Preguntas frecuentes — Mateo Support

Respuestas rápidas para el widget Mateo Support.

## Login y acceso

### No puedo iniciar sesión

1. ¿Es configurador? → Solo correo + contraseña (sin código empresa)
2. ¿Es usuario de cliente? → Código empresa + usuario + contraseña
3. Error 422 en prelogin → Empresa incorrecta o usuario no pertenece a esa empresa
4. Contraseña olvidada → Reset vía Supabase Auth (admin o soporte TI)

### Entro pero no veo nada / pantalla en blanco

- Verificar que tenga **bodega activa** seleccionada (selector superior)
- Roles de bodega sin asignación en `asignacion_bodega` → contactar admin cuenta

### Me redirige a otra pantalla

| Rol | Destino normal |
| --- | --- |
| configurador | `/configurador` |
| administrador_bodega | estado-bodega |
| jefe_bodega | estado-bodega |
| custodio | `/custodio/ingreso` |
| operario | `/operario/operacion` |
| procesador | `/procesador/operacion` |
| transportista | `/transporte` |
| operador_cuenta | Hub operador |
| administrador_cuenta | Panel admin |

## Compras

### No puedo aprobar la solicitud de compra

Solo `administrador_cuenta` o `configurador`. La SOL debe estar en `pendiente_aprobacion`.

### No aparece la OC para recepción

La OC debe estar `emitida` o `parcialmente_recibida`. Verificar destino bodega configurado.

## Inventario

### El mapa no se actualiza

- Conexión a internet
- Bodega correcta seleccionada
- Permiso `inventory:read`
- Problema Realtime → refrescar página

### Posición bloqueada

Otro usuario tiene lock. Esperar 5 min (TTL) o pedir force unlock al jefe/admin bodega.

## Ventas

### No puedo emitir la orden de venta

Causas: OV no en borrador, stock insuficiente, o rol sin permiso de emisión.

## Mateo widget

### El chat no abre

- Usuario debe estar logueado en WMS
- Script `mateo-widget.js` debe cargar (ver consola navegador)
- `NEXT_PUBLIC_MATEO_WIDGET_SCRIPT_URL` configurado

### Mateo no responde

Workflow n8n puede estar caído. Escalar a equipo técnico Polaria.

## Multi-tenant

### Veo datos de otra empresa

**Incidente de seguridad.** Escalar inmediatamente a TI. No debería ocurrir con RLS activo.

### No veo mi catálogo

Verificar `codigo_cuenta` del usuario coincide con el tenant del catálogo.
