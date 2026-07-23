# Mateo Support (widget de chat)

Asistente de IA embebido en Polaria WMS para soporte operativo.

## Repositorios

| Repo | Rol |
| --- | --- |
| [Widget-react](https://github.com/PolariaTech/Widget-react) | UI chat (IIFE `mateo-widget.js`) |
| polaria-wms-api | Tokens + persistencia conversaciones |
| polaria-wms-web | Host `MateoWidgetHost` en shell autenticado |
| n8n | Workflow conversacional (Mateo IA) |

## Cómo lo ve el usuario

1. Botón flotante en esquina inferior derecha (solo usuarios logueados en WMS)
2. Abre chat compacto (320×420) o fullscreen
3. Escribe texto o adjunta imagen (JPG/PNG/WebP, máx 5 MB)
4. Mateo responde vía n8n

## Dos tokens (importante para soporte)

| Uso | Token | Endpoint |
| --- | --- | --- |
| Enviar mensaje a Mateo (n8n) | JWT widget (~300s) | `POST /auth/mateo/widget-token` |
| Guardar historial conversaciones | Bearer sesión WMS | `/mateo/conversaciones` |

## Historial

- Persistido en Supabase: `widget_conversacion`, `widget_mensaje`
- Sincronizado por usuario (RLS: solo ve las suyas)
- En embed WMS: fuente de verdad es API; localStorage es cache

## Errores comunes

| Síntoma | Causa | Respuesta |
| --- | --- | --- |
| Chat cierra solo | Token widget expirado (401) | Refrescar página o reabrir chat |
| «Error de autenticación» | Sesión WMS expirada | Volver a login |
| Historial vacío tras login | Falló sync remoto | Normal en primer uso; crear nueva conversación |
| Imagen no envía | Cloudinary o tamaño > 5 MB | Reducir imagen o verificar env |
| Mateo no responde | n8n caído o POL-71 pendiente | Escalar a TI; verificar workflow n8n |

## SSO WMS ↔ Mateo (app externa)

- `POST /auth/mateo-handoff` → código 60s
- `POST /auth/mateo-exchange` → tokens
- Para usuarios que abren Mateo en ventana separada

## Qué puede responder Mateo Support

Usar los manuales de este Dev Hub como base de conocimiento:
- Roles y permisos
- Flujos SOL/OC/recepción, OV, procesamiento
- Errores de login y bodega no seleccionada
- Glosario de términos WMS

## Escalamiento a humano

Si Mateo no resuelve: derivar al administrador de cuenta del tenant o a soporte Polaria (configurador).
