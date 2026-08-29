/**
 * Glosario de dominio Polaria WMS — Dev Hub (ago 2026).
 * Tabla parseable por GlossaryPortal: Término | Definición | En el sistema
 */
import { POLARIA_STATUS_CALLOUT } from './polariaWmsMeta.js'

const GLOSSARY_ROWS = [
  ['Empresa', 'Cliente jurídico del SaaS (razón social).', '`empresa` · `codigo_empresa`'],
  ['Cuenta / tenant', 'Unidad operativa dentro de la empresa: catálogo, compras, ventas.', '`cuenta` · `codigo_cuenta`'],
  ['Bodega', 'Cámara o planta física.', '`bodega` · `id_bodega`'],
  ['Schema emp_*', 'Postgres por empresa (cuentas nuevas). Legacy sigue en `public`.', 'migración 062 · `wms_tenant_tables`'],
  ['Configurador', 'TI de Polaria. Crea empresas, cuentas y el primer admin.', 'rol `configurador`'],
  ['Slot / casillero', 'Posición en el mapa de la bodega.', '`warehouse_state` + plano'],
  ['Mapa', 'Plano en vivo de ocupación.', 'Realtime sobre `warehouse_state`'],
  ['Lock', 'Casillero tomado por un usuario; caduca o el jefe hace force-unlock.', '`POST /inventario/warehouse-state`'],
  ['Lote', 'Grupo que ingresó junto (vence, trazabilidad).', 'campos de lote en inventario'],
  ['FEFO', 'Sale primero lo que vence antes. Aún no cubre todas las salidas.', 'regla de picking · 🟡'],
  ['SOL', 'Solicitud de compra: “queremos comprar esto”.', '`solicitud_compra`'],
  ['OC', 'Orden de compra al proveedor.', '`orden_compra`'],
  ['OV', 'Orden de venta al cliente. Crear = supabase-js; emitir = Nest.', '`orden_venta` · `POST /ventas/ordenes/:id/emitir`'],
  ['OT', 'Orden de trabajo que ve el piso.', '`orden_trabajo` + `tarea_cola`'],
  ['Merma', 'Kg que se pierden al procesar.', 'flujo procesamiento'],
  ['precio_producto', 'Precio de venta $/kg. Vigente = `fecha_aplicacion` más reciente.', 'tabla Postgres (aún sin modelo Prisma)'],
  ['RLS', 'Row Level Security en PostgreSQL: el JWT del usuario limita filas.', 'políticas en `polaria-wms-db`'],
  ['Anon key', 'Clave pública de Supabase. La seguridad es RLS, no ocultar la key.', '`NEXT_PUBLIC_SUPABASE_ANON_KEY`'],
  ['Service role', 'Clave de servidor. Solo API; nunca al browser.', '`SUPABASE_SERVICE_ROLE_KEY`'],
  ['Mateo', 'Chat embebido. JWT n8n ~300 s (se renueva); historial con Bearer WMS. Cierra con la sesión de 12 h de Polaria. Enlaces subrayados (nueva pestaña); PDF en “ruta” descargable si el archivo existe.', 'schema `mateo_support` · vistas `widget_*`'],
  ['Comprador', 'Destino comercial de una venta (persona o punto).', '`comprador` · `id_comprador`'],
  ['Alias de producto', 'Nombre con el que un comprador conoce un ítem del catálogo (sandía → patilla). No altera `producto`. Un par comprador+producto = un alias.', '`comprador_producto_alias` · migración 067 · `wms_sync_table_to_tenants`'],
  ['Sesión WMS (12 h)', 'Tope de sesión en el browser desde el login. Al vencer o al logout, Mateo también se cierra.', '`SESSION_MAX_AGE_MS` · `auth-session-timeout`'],
  ['Fridem', 'Bodega externa de terceros, inventario solo lectura (en maduración).', 'integración externa'],
]

export function formatPolariaGlossaryMarkdown() {
  const lines = [
    POLARIA_STATUS_CALLOUT,
    '',
    '## Glosario de dominio',
    '',
    '| Término | Definición | En el sistema |',
    '| --- | --- | --- |',
  ]
  for (const [term, def, sys] of GLOSSARY_ROWS) {
    lines.push(`| ${term} | ${def} | ${sys} |`)
  }
  lines.push('')
  return lines.join('\n')
}
