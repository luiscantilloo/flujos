# Glosario rápido — WMS Polaria

Términos en lenguaje simple para Mateo Support.

## Organización

| Término | Significado |
| --- | --- |
| **Empresa** | Cliente jurídico del SaaS (`codigo_empresa`) |
| **Tenant / Cuenta** | Unidad operativa aislada (`codigo_cuenta`) |
| **Bodega** | Ubicación física de almacenamiento (`id_bodega`) |
| **Configurador** | TI Polaria que administra plataforma |

## Documentos

| Sigla | Nombre completo | Descripción |
| --- | --- | --- |
| **SOL** | Solicitud de compra | Pedido interno antes de comprar |
| **OC** | Orden de compra | Documento formal al proveedor |
| **OV** | Orden de venta | Pedido de despacho a cliente |
| **OT** | Orden de trabajo | Tarea operativa en bodega |
| **TV** | Viaje transporte | Despacho con camión |

## Inventario

| Término | Significado |
| --- | --- |
| **Slot / Posición** | Ubicación física en el grid de bodega |
| **warehouse_state** | Stock en vivo por posición |
| **Lote** | Trazabilidad por ingreso (FEFO, vencimiento) |
| **Lock** | Bloqueo temporal de posición (evita conflictos) |
| **FEFO** | First Expired First Out — sale primero lo que vence antes |
| **Merma** | Pérdida de peso en procesamiento |

## Zonas de bodega

| Zona | Uso |
| --- | --- |
| ING / Ingreso | Recepción de mercancía |
| SLOT / Almacenamiento | Stock principal |
| PROC / Procesamiento | Línea de transformación |
| SAL / Salida | Muelle de despacho |

## Estados comunes

| Contexto | Estados |
| --- | --- |
| SOL | borrador → pendiente_aprobacion → aprobada |
| OC | borrador → emitida → parcialmente_recibida → recibida |
| OV | borrador → confirmada → en_preparacion → despachada |
| Procesamiento | pendiente → en_proceso → pendiente_cierre → terminada |

## Tecnología (para soporte L2)

| Término | Significado |
| --- | --- |
| **RLS** | Row Level Security — aislamiento datos en PostgreSQL |
| **Realtime** | Actualización en vivo vía Supabase |
| **JWT** | Token de sesión |
| **n8n** | Automatización webhooks (SOL, Mateo) |
| **Cloudinary** | Almacén de imágenes (evidencias transporte) |

## Roles (resumen)

| Rol | Una línea |
| --- | --- |
| configurador | TI Polaria |
| administrador_cuenta | Jefe comercial del cliente |
| operador_cuenta | Compras/ventas del tenant |
| administrador_bodega | Supervisor de bodega |
| jefe_bodega | Jefe operativo piso |
| custodio | Recepción y despacho muelle |
| operario | Mueve cajas y ejecuta tareas |
| procesador | Declara merma en procesamiento |
| transportista | Entregas con evidencia |
