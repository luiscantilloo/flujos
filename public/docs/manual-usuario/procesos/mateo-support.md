Roles admitidos: configurador, administrador_cuenta, operador_cuenta, administrador_bodega, jefe_bodega, custodio, operario, procesador, transportista
Seccionar: False


# Mateo (chat de ayuda)

Mateo es el **chat** de Polaria WMS: una burbuja abajo a la derecha cuando ya entraste al sistema.

## Cómo usarlo

1. Entrá con tu usuario (si no hay sesión, el chat no abre).
2. Pulsá la burbuja.
3. Escribí en español, como le hablarías a un compañero:
   - “No me deja emitir la venta”
   - “Soy custodio y no veo la orden de compra”
   - “¿Quién aprueba la solicitud?”
4. Podés adjuntar una imagen (foto de la pantalla), no muy pesada.

Podés abrir el chat chico o más grande. El historial de **tus** conversaciones se guarda; otro usuario no ve las tuyas.

Cuando Mateo te da un **enlace**, aparece subrayado: hacé clic y se abre en **otra pestaña**. No dice “ver documento”: ves la dirección y la abrís. Si menciona un **PDF** (por ejemplo en “ruta”), ese nombre también es un enlace para bajarlo, cuando el archivo está disponible.

## Sesión (Polaria y Mateo juntos)

- La sesión de Polaria dura **12 horas** desde el login. Al vencerse, te manda a entrar de nuevo.
- Mateo **se cierra con Polaria**: si cerrás sesión o se vencen las 12 horas, el chat también se corta (no queda un token viejo colgado).
- El chat con el asistente (n8n) usa un token corto (~5 minutos) que **se renueva solo** mientras tu sesión de Polaria sigue viva. Eso no es un cierre de sesión: es el recambio interno del chat.

Si Mateo te abre Polaria con un enlace (`/auth/sso`), vas a ver **Conectando con Polaria WMS…** y te deja en tu pantalla. Si el código expiró, **Ir a iniciar sesión**.

## Si no responde o se cierra

1. Recargá la página y volvé a abrir el chat.
2. Si te pide entrar de nuevo, tu sesión de 12 horas se venció o cerraste Polaria: login otra vez.
3. Si un PDF da error (página no encontrada), recargá o pedí el archivo de nuevo; avisá a TI si se repite.
4. Si sigue mudo, avisá a TI o al administrador de cuenta. A veces el asistente está caído: no es que vos hayas hecho algo mal.

## Qué no es Mateo

No reemplaza un botón del sistema. Si tu rol no puede **Aprobar** o **Emitir**, el chat no te va a dar ese permiso. Te dice **quién** sí puede.

Si Mateo no alcanza, hablá con tu administrador de cuenta o con soporte Polaria.
