/**
 * Tipos de columna y enums del modelo 3NF (mapeo PostgreSQL / Supabase).
 * Usar `enumRef` en campos con type: 'enum' para valores cerrados.
 */

import { WMS_ROLES } from './wmsRoles.js'

const ROL_IDS = WMS_ROLES.map((r) => r.id)
const ROL_BODEGA_IDS = WMS_ROLES.filter((r) => r.nivel === 'bodega').map((r) => r.id)

/** @typedef {'uuid'|'varchar'|'text'|'citext'|'int'|'smallint'|'decimal'|'boolean'|'timestamptz'|'date'|'jsonb'|'url'|'enum'} SchemaColumnType */

export const SCHEMA_ENUMS = {
  wms_rol: {
    pg: 'wms_rol',
    label: 'Rol WMS (9 valores)',
    values: ROL_IDS,
  },
  wms_rol_bodega: {
    pg: 'wms_rol_bodega',
    label: 'Rol de bodega (6 valores)',
    values: ROL_BODEGA_IDS,
  },
  rol_nivel: {
    pg: 'rol_nivel',
    label: 'Nivel del rol',
    values: ['plataforma', 'cuenta', 'bodega'],
  },
  bodega_tipo: {
    pg: 'bodega_tipo',
    values: ['interna', 'externa'],
  },
  estado_solicitud_bodega: {
    pg: 'estado_solicitud_bodega',
    values: ['pendiente', 'aprobada', 'rechazada', 'bodega_creada', 'cancelada'],
  },
  unidad_medida: {
    pg: 'unidad_medida',
    values: ['kg', 'caja', 'unidad'],
  },
  estado_sol: {
    pg: 'estado_solicitud_compra',
    values: ['borrador', 'enviada', 'aprobada', 'rechazada'],
  },
  estado_oc: {
    pg: 'estado_orden_compra',
    values: ['iniciado', 'en_recepcion', 'cerrado'],
  },
  estado_ov: {
    pg: 'estado_orden_venta',
    values: ['borrador', 'confirmada', 'en_preparacion', 'en_transito', 'cerrado_ok', 'cerrado_no_ok'],
  },
  estado_slot: {
    pg: 'estado_slot',
    values: ['libre', 'ocupado', 'reservado', 'en_proceso'],
  },
  zona_caja: {
    pg: 'zona_caja',
    values: ['inbound', 'mapa', 'outbound', 'dispatched'],
  },
  tipo_orden_trabajo: {
    pg: 'tipo_orden_trabajo',
    values: ['a_bodega', 'a_salida', 'revisar'],
  },
  estado_orden_trabajo: {
    pg: 'estado_orden_trabajo',
    values: ['pendiente', 'en_curso', 'completada'],
  },
  estado_tarea: {
    pg: 'estado_tarea',
    values: ['pendiente', 'en_curso', 'completada', 'cancelada'],
  },
  tipo_tarea: {
    pg: 'tipo_tarea',
    values: ['movimiento', 'conteo', 'despacho', 'inspeccion'],
  },
  tipo_alerta: {
    pg: 'tipo_alerta',
    values: ['temperatura', 'demora', 'orden_reportada'],
  },
  estado_procesamiento: {
    pg: 'estado_procesamiento',
    values: ['pendiente', 'en_curso', 'terminado'],
  },
  estado_viaje: {
    pg: 'estado_viaje',
    values: ['programado', 'en_ruta', 'entregado', 'incidencia', 'cancelado'],
  },
  tipo_historial: {
    pg: 'tipo_historial_movimiento',
    values: ['ingreso', 'movimiento', 'despacho', 'merma'],
  },
  prefijo_documento: {
    pg: 'prefijo_documento',
    values: ['OC', 'OV', 'TV', 'SOL'],
  },
  accion_auditoria: {
    pg: 'accion_auditoria',
    values: ['insert', 'update', 'delete', 'login', 'logout'],
  },
}

/** Longitudes habituales para varchar (UUIDs, IDs externos y códigos WMS) */
export const VARCHAR = {
  codigo: 32,
  id: 64,
  sku: 64,
  documento: 32,
  placa: 16,
  nit: 20,
  telefono: 24,
  nombre: 255,
  email: 255,
  url: 2048,
  linea: 32,
  evento: 64,
}

export function enumValues(enumRef) {
  return SCHEMA_ENUMS[enumRef]?.values ?? []
}

export function enumDesc(enumRef) {
  const e = SCHEMA_ENUMS[enumRef]
  if (!e) return ''
  return e.values.join(' | ')
}

/** Etiqueta de tipo para UI y Mermaid */
export function formatFieldType(field) {
  if (field.type === 'enum' && field.enumRef) {
    const pg = SCHEMA_ENUMS[field.enumRef]?.pg ?? field.enumRef
    return `enum(${pg})`
  }
  if (field.type === 'varchar' && field.length) return `varchar(${field.length})`
  return field.type ?? 'text'
}
