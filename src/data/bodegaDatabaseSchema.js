/**
 * Modelo relacional normalizado (3NF) — Bodega de Frío.
 * Roles y flujos alineados con el paso a paso y la documentación V2.0 (§7).
 * `legacy` / `v20Field`: nombres en código y en el documento.
 */

import { POLARIA_WMS } from './polariaWmsMeta.js'
import { WMS_ROLES } from './wmsRoles.js'
import { ENTITIES as _SUPABASE_ENTITIES, SUPABASE_ENTITY_COUNT } from './supabaseEntities.generated.js'
import { PRISMA_TO_ENTITY, PRISMA_MODEL_COUNT } from './prismaEntityManifest.js'
import { SCHEMA_ENUMS, VARCHAR, enumDesc } from './schemaFieldTypes.js'
import {
  SCHEMA_READING_PHASES,
  TABLE_READING_SEQUENCE,
  ONBOARDING_FLOW_ASCII,
  formatReadingGuideMarkdown,
  getReadingStepForEntity,
  ENTITY_READING_MAP,
} from './schemaReadingGuide.js'

export {
  SCHEMA_READING_PHASES,
  TABLE_READING_SEQUENCE,
  ONBOARDING_FLOW_ASCII,
  formatReadingGuideMarkdown,
  getReadingStepForEntity,
  ENTITY_READING_MAP,
} from './schemaReadingGuide.js'

export { buildErExplanationMarkdown, ER_EXPLANATION_DOC_PATH } from './erExplanationDocument.js'

export { SCHEMA_ENUMS, VARCHAR, enumDesc } from './schemaFieldTypes.js'
export { formatFieldType } from './schemaFieldTypes.js'

export const V20_DOC_ID = 'bodega-frio-documentacion-v20'
export const V20_DOC_SECTION = '§7. Modelo de Datos'

export const V20_STORAGE_TREE = `plataforma/configurador → equipo TI (Auth, sin empresa cliente)
empresas/{codigoEmpresa}/ → creada por el configurador
tenants/{codeCuenta}/ → bajo la empresa
warehouse_state → inventario en vivo por ubicación+producto+lote
usuarios/ → admin cuenta y roles (pertenencia por codigo_empresa en login V2)`

export const SCHEMA_META = {
  title: 'Modelo de datos — Polaria WMS',
  subtitle: '43 modelos Prisma · scope C / C+B · RLS híbrido',
  version: '5.1-supabase',
  legacySubtitle: 'Bodega de Frío (referencia diseño V2)',
  rootEntity: 'rol',
  docId: V20_DOC_ID,
  product: POLARIA_WMS.productName,
  prismaModelCount: 43,
  repos: POLARIA_WMS.repos,
  engine: 'Supabase PostgreSQL + Realtime + Prisma (API)',
  normalization: '3NF + warehouse_state',
  notes: [
    'Alineado a polaria-wms-api/prisma/schema.prisma (43 modelos). Dev Hub distingue ✅ implementado vs 🔵 diseño.',
    'Scope C = codigo_cuenta; C+B = codigo_cuenta + id_bodega.',
    'Escrituras sensibles vía polaria-wms-api (Prisma bypass RLS); lecturas web con supabase-js + JWT.',
    'Fuente: polaria-wms-db migrations + prisma/schema.prisma. Auth en auth.users (Supabase).',
    'Onboarding: POST /configuracion/bodegas (no insert browser). Integración: solicitud_integracion.',
    'Login: POST /auth/prelogin → POST /auth/login; SSO Mateo opcional.',
  ],
}

/** Flujo de autenticación V2.0 (doc §6.2) */
export const AUTH_LOGIN_V20 = {
  title: 'Autenticación V2.0',
  configurador: {
    actor: 'configurador',
    steps: ['Correo + contraseña (Auth)', 'Sin codigo_empresa cliente', 'Panel plataforma: gestionar empresas'],
  },
  usuarioEmpresa: {
    actor: 'cualquier rol de la empresa',
    steps: [
      'POST /auth/prelogin — validar codigoEmpresa + usuario (flujo platform | tenant)',
      'POST /auth/login — contraseña (Supabase Auth) → sesión JWT',
      'Opcional: SSO Mateo (mateo-handoff / mateo-exchange, header x-auth-client)',
      'Cargar rol, tenant(s) y permisos → dashboard según rol',
    ],
  },
}

/** Onboarding — fases 0–9 y orden de tablas (ver TABLE_READING_SEQUENCE) */
export const SCHEMA_ONBOARDING = {
  title: 'Onboarding — quién crea qué (3NF)',
  flowAscii: ONBOARDING_FLOW_ASCII,
  phases: SCHEMA_READING_PHASES.map((phase) => ({
    id: phase.id,
    label: phase.label,
    actor: phase.actor,
    summary: phase.summary,
    steps: TABLE_READING_SEQUENCE.filter((s) => s.phaseId === phase.id).map((s) => ({
      order: s.order,
      table: s.order,
      entity: s.entityId.startsWith('_') ? null : s.entityId,
      tableName: s.table,
      title: s.title,
      action: s.readFirst,
      thenRead: s.thenRead,
      createdBy: s.createdBy,
      indexes: s.indexes,
    })),
  })),
}

export function getEntityOnboarding(entityId) {
  const s = getReadingStepForEntity(entityId)
  if (!s) return null
  return {
    phase: s.phaseId,
    step: s.order,
    actor: s.createdBy,
    label: `Tabla ${s.order} · ${s.phaseLabel}`,
    readFirst: s.readFirst,
    thenRead: s.thenRead,
  }
}

/** Metadatos por entidad — primera aparición en la guía de lectura */
export const ENTITY_ONBOARDING = Object.fromEntries(
  Object.keys(ENTITY_READING_MAP).map((id) => [id, getEntityOnboarding(id)]),
)

export const ONBOARDING_PHASE_LABELS = Object.fromEntries(
  SCHEMA_READING_PHASES.map((p) => [p.id, p.label]),
)

/** Dominios del modelo 3NF (agrupación técnica; lectura lineal en TABLE_READING_SEQUENCE) */
export const SCHEMA_DOMAINS = [
  { id: 'rbac', label: 'FASE 0–1 · Roles, Auth, usuarios', color: 'purple', order: 0 },
  { id: 'platform', label: 'FASE 1–3 · Empresa, tenant, bodegas', color: 'violet', order: 1 },
  { id: 'catalog', label: 'FASE 4 · Catálogos (admin cuenta)', color: 'sky', order: 2 },
  { id: 'purchase', label: 'FASE 6 · Compras (SOL / OC)', color: 'emerald', order: 3 },
  { id: 'warehouse', label: 'FASE 7 · Bodega en vivo', color: 'cyan', order: 4 },
  { id: 'processing', label: 'FASE 8 · Procesamiento', color: 'fuchsia', order: 5 },
  { id: 'sales', label: 'FASE 9 · Ventas y transporte', color: 'amber', order: 6 },
  { id: 'system', label: 'FASE 9 · Contadores y auditoría', color: 'slate', order: 7 },
]

/** 40 tablas public.* — sincronizado con polaria-wms-db + Supabase */
export const ENTITIES = _SUPABASE_ENTITIES

export { PRISMA_TO_ENTITY, PRISMA_MODEL_COUNT, SUPABASE_ENTITY_COUNT }

/** Filas semilla para la entidad rol (documentación / UI) */
export const ROL_SEED_ROWS = WMS_ROLES.map((r) => ({
  id_rol: r.id,
  nombre: r.nombre,
  nivel: r.nivel,
  puede_crear_rol: r.creadoPor,
  descripcion: r.descripcion,
}))

export const NORMALIZATION_RULES = [
  {
    nf: '3NF',
    title: 'Raíz del modelo: configurador TI',
    detail:
      'El ER no empieza en empresa: empieza en el configurador (equipo TI con Auth). empresa, admin cuenta, tenant y bodega son objetos que el configurador crea o asigna en ese orden.',
  },
  {
    nf: '3NF',
    title: 'Autenticación por empresa (V2)',
    detail:
      'Antes de contraseña: validar empresa activa y que usuario.codigo_empresa coincida. El configurador TI no pasa por codigo_empresa cliente. Tras Auth, cargar id_rol y codeCuenta para RLS operativo.',
  },
  {
    nf: '3NF',
    title: 'Onboarding TI vs admin cuenta',
    detail:
      'TI (con credenciales): empresa → administrador de cuenta (codigo_empresa) → tenant → bodegas. Admin: catálogos, operador y asignacion_bodega. APIs deben impedir login cruzado entre empresas.',
  },
  {
    nf: '3NF',
    title: 'Empresa y tenant',
    detail:
      'empresa (codigo_empresa) agrupa contratos; cuenta (codigo_cuenta) es el tenant operativo. Catálogos, órdenes y usuarios de cuenta referencian el tenant, no la empresa directamente.',
  },
  {
    nf: '3NF',
    title: 'Roles separados de usuarios',
    detail:
      'La tabla rol almacena los 9 perfiles; usuario solo referencia id_rol. Las asignaciones a bodega están en asignacion_bodega (sin repetir rol en cada fila de usuario).',
  },
  {
    nf: '3NF',
    title: 'Cadena de creación de usuarios',
    detail:
      'usuario.id_creador modela: configurador → administrador_cuenta → operador_cuenta; asignacion_bodega la crea el admin sobre bodegas ya existentes.',
  },
  {
    nf: '3NF',
    title: 'Inventario relacional (Supabase)',
    detail:
      'warehouse_state (stock en vivo), ubicacion (slot), lote, movimiento_inventario (historial). Escrituras sensibles solo vía API.',
  },
  {
    nf: '2NF',
    title: 'Líneas de OC/OV',
    detail: 'Atributos del producto no se repiten en líneas: solo id_producto + cantidades.',
  },
]

export const SUPABASE_MAPPING = [
  {
    logical: 'Configurador TI (raíz)',
    physical: 'usuarios (id_rol = configurador) + auth.users · sin codigo_empresa cliente',
  },
  {
    logical: 'Onboarding FASE A (tras login TI)',
    physical: 'empresa → usuario admin (codigo_empresa) → tenant_config → bodegas',
  },
  {
    logical: 'Onboarding FASE B (admin cuenta)',
    physical: 'productos, clientes, proveedores, compradores, camiones, plantas, operador_cuenta, usuario_bodega',
  },
  { logical: 'Empresa + tenant + bodega', physical: 'empresa, cuenta, bodega, solicitud_alta_bodega' },
  { logical: 'Auth + usuarios + asignación', physical: 'auth.users, usuario, asignacion_bodega' },
  { logical: 'Integración externa', physical: 'solicitud_integracion, tarea_cuenta' },
  { logical: 'SOL + OC + recepción', physical: 'solicitud_compra, orden_compra, recepcion_compra (+ líneas)' },
  { logical: 'Inventario C+B', physical: 'tipo_ubicacion, zona, ubicacion, lote, warehouse_state, movimiento_inventario' },
  { logical: 'Cola + procesamiento', physical: 'orden_trabajo, alerta_operativa, tarea_cola, solicitud_procesamiento, registro_merma' },
  { logical: 'OV + transporte', physical: 'orden_venta, viaje_transporte, guia_envio, evidencia_transporte' },
  { logical: 'Sistema', physical: 'contador, auditoria_operacion' },
]

export const ONBOARDING_CLASS_DIAGRAM = `classDiagram
    class ConfiguradorTI {
        +uuid id_usuario PK
        +wms_rol configurador
        +citext correo
    }
    class Empresa {
        +string codigo_empresa PK
        +uuid id_creador FK
    }
    class Usuario {
        +uuid id_usuario PK
        +string codigo_empresa FK
        +wms_rol id_rol FK
    }
    class Cuenta {
        +string codigo_cuenta PK
        +string codigo_empresa FK
    }
    class Bodega {
        +string id_bodega PK
        +string codigo_cuenta FK
    }
  ConfiguradorTI "1" --> "*" Empresa : crea
  ConfiguradorTI "1" --> "*" Usuario : asigna admin cuenta
  Empresa "1" --> "*" Usuario : login V2
  Empresa "1" --> "*" Cuenta : tenant
  Cuenta "1" --> "*" Bodega : infra`

export const CLASS_DIAGRAM = `classDiagram
    class Empresa {
        +string codigo_empresa PK
    }
    class Cuenta {
        +string codigo_cuenta PK
        +string codigo_empresa FK
    }
    class Rol {
        +wms_rol id_rol PK
        +rol_nivel nivel
    }
    class SesionAuth {
        +uuid id_auth PK
        +uuid id_usuario FK
    }
    class Usuario {
        +uuid id_usuario PK
        +wms_rol id_rol FK
        +uuid id_creador FK
    }
    class AsignacionBodega {
        +uuid id_usuario FK
        +varchar id_bodega FK
        +wms_rol_bodega id_rol FK
    }
    class Bodega {
        +string id_bodega PK
    }
    class SolicitudCompra {
        +string id_solicitud_compra PK
        +string id_orden_compra FK
    }
    class OrdenCompra {
        +string id_orden_compra PK
    }
    class EstadoBodega {
        +string id_bodega PK
    }
    class Caja {
        +string id_caja PK
        +enum zona
    }
    class OrdenTrabajo {
        +string id_orden_trabajo PK
    }
    class SolicitudProcesamiento {
        +string id_solicitud PK
    }
    class OrdenVenta {
        +string id_orden_venta PK
    }
    class ViajeTransporte {
        +string id_viaje PK
    }
    class EvidenciaEntrega {
        +string id_evidencia PK
    }
    Empresa "1" --> "*" Cuenta
    Cuenta "1" --> "*" Bodega
    Cuenta "1" --> "*" Usuario
    Rol "1" --> "*" Usuario
    Rol "1" --> "*" AsignacionBodega
    SesionAuth "1" --> "1" Usuario
    Usuario "1" --> "*" AsignacionBodega
    Bodega "1" --> "*" AsignacionBodega
    SolicitudCompra "0..1" --> "1" OrdenCompra
    Usuario "1" --> "*" SolicitudCompra
    Bodega "1" --> "1" EstadoBodega
    EstadoBodega "1" --> "*" Caja
    EstadoBodega "1" --> "*" OrdenTrabajo
    OrdenCompra "1" --> "*" Caja
    OrdenVenta "1" --> "*" Caja
    OrdenVenta "1" --> "0..1" ViajeTransporte
    ViajeTransporte "1" --> "*" EvidenciaEntrega
    SolicitudProcesamiento "1" --> "*" RegistroMerma`

export function getEntityById(id) {
  return ENTITIES.find((e) => e.id === id) ?? null
}

export function getEntitiesByDomain(domainId) {
  return ENTITIES.filter((e) => e.domain === domainId)
}
