/**
 * Modelo relacional normalizado (3NF) — Bodega de Frío.
 * Roles y flujos alineados con el paso a paso y la documentación V2.0 (§7).
 * `legacy` / `v20Field`: nombres en código y en el documento.
 */

import { WMS_ROLES } from './wmsRoles.js'
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
warehouses/{warehouseId}/state/main → inventario en vivo
usuarios/ → admin cuenta y roles (pertenencia por codigo_empresa en login V2)`

export const SCHEMA_META = {
  title: 'Modelo de datos — Bodega de Frío',
  subtitle: '3NF · TI con credenciales · login por empresa · onboarding',
  version: '4.0',
  rootEntity: 'rol',
  docId: V20_DOC_ID,
  engine: 'Supabase PostgreSQL + Realtime',
  normalization: '3NF',
  notes: [
    'El configurador TI no es tabla aparte: es usuario con id_rol = configurador y codigo_empresa NULL (Auth en auth.users).',
    'Onboarding: TI crea empresa y administrador de cuenta → tenant → el admin solicita bodegas → TI las crea → el admin se auto-asigna.',
    'Guía de lectura: tablas numeradas 0–31 en schemaReadingGuide.js (FASE 0–9).',
    'Login V2 (usuarios de empresa): (1) ¿empresa existe? (2) ¿usuario pertenece a la empresa? (3) contraseña → cualquier rol.',
    'usuario.codigo_empresa obligatorio para todo perfil de cliente; codigo_cuenta NULL solo en configurador (y opcional en admin hasta asignar tenant).',
    'Empresa ≠ tenant: catálogos y operación diaria siguen scoped al codeCuenta; la autenticación arranca por empresa.',
    'Inventario en vivo: warehouse_state (jsonb); lectura Realtime + RLS; escritura sensible vía NestJS.',
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
      'Ingresar codigoEmpresa → validar que existe y está activa',
      'Ingresar correo o identificador de usuario → validar pertenencia a esa empresa',
      'Solicitar contraseña (Supabase Auth) → sesión',
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

export const ENTITIES = [
  // ─── FASE 1 — Plataforma (empresa, tenant, bodegas) ─────────────────────
  {
    id: 'empresa',
    domain: 'platform',
    name: 'Empresa (cliente SaaS)',
    table: 'empresa',
    v20Path: 'empresas/{codigoEmpresa}/',
    physical: 'public.empresa',
    desc: 'Cliente jurídico del SaaS. La crea el configurador TI (usuario con rol configurador) tras iniciar sesión en plataforma.',
    indexes: ['PK (codigo_empresa)', 'IX empresa_activa (esta_activa) WHERE esta_activa'],
    fields: [
      {
        name: 'codigo_empresa',
        type: 'varchar',
        length: VARCHAR.codigo,
        pk: true,
        legacy: 'companyId',
        v20Field: 'codigoEmpresa',
      },
      { name: 'razon_social', type: 'varchar', length: VARCHAR.nombre },
      { name: 'esta_activa', type: 'boolean', legacy: 'activa' },
      {
        name: 'id_creador',
        type: 'uuid',
        fk: 'usuario.id_usuario',
        desc: 'Configurador TI que registró la empresa',
      },
      { name: 'creado_en', type: 'timestamptz', legacy: 'createdAt' },
    ],
    relations: [
      { card: 'N', entity: 'usuario', label: 'creada por (configurador TI)' },
      { card: '1', entity: 'cuenta', label: 'tiene tenants' },
      { card: '1', entity: 'usuario', label: 'usuarios (login V2)' },
    ],
  },
  {
    id: 'cuenta',
    domain: 'platform',
    name: 'Tenant (cuenta operativa)',
    table: 'cuenta',
    v20Path: 'tenants/{codeCuenta}/config',
    physical: 'public.tenant_config',
    desc: 'Tenant operativo bajo una empresa. El configurador (TI) lo crea tras empresa y admin cuenta; catálogos y órdenes los crea el admin.',
    fields: [
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        pk: true,
        legacy: 'codeCuenta',
        v20Field: 'codeCuenta',
      },
      {
        name: 'codigo_empresa',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'empresa.codigo_empresa',
        legacy: 'companyId',
        v20Field: 'codigoEmpresa',
      },
      { name: 'nombre_comercial', type: 'varchar', length: VARCHAR.nombre, legacy: 'nombre' },
      { name: 'esta_activa', type: 'boolean', legacy: 'activa' },
      {
        name: 'id_creador',
        type: 'uuid',
        fk: 'usuario.id_usuario',
        desc: 'Configurador TI que dio de alta el tenant',
      },
      { name: 'creado_en', type: 'timestamptz', legacy: 'createdAt' },
    ],
    relations: [{ card: 'N', entity: 'empresa', label: 'pertenece a' }],
    indexes: ['PK (codigo_cuenta)', 'IX cuenta_empresa (codigo_empresa)', 'IX cuenta_activa (esta_activa)'],
  },
  {
    id: 'solicitud_alta_bodega',
    domain: 'platform',
    name: 'Petición de alta de bodega',
    table: 'solicitud_alta_bodega',
    physical: 'public.solicitud_alta_bodega',
    desc: 'El administrador de cuenta solicita una bodega interna o externa con nombre personalizado. El configurador TI atiende la petición y crea la fila en bodega.',
    fields: [
      { name: 'id_solicitud', type: 'uuid', pk: true },
      {
        name: 'codigo_empresa',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'empresa.codigo_empresa',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
      },
      {
        name: 'id_solicitante',
        type: 'uuid',
        fk: 'usuario.id_usuario',
        desc: 'Administrador de cuenta que reclama la bodega',
      },
      { name: 'nombre_solicitado', type: 'varchar', length: VARCHAR.nombre },
      { name: 'tipo', type: 'enum', enumRef: 'bodega_tipo', desc: enumDesc('bodega_tipo') },
      { name: 'comentarios', type: 'text', nullable: true },
      {
        name: 'estado',
        type: 'enum',
        enumRef: 'estado_solicitud_bodega',
        desc: enumDesc('estado_solicitud_bodega'),
      },
      {
        name: 'id_bodega',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'bodega.id_bodega',
        nullable: true,
        desc: 'Se llena cuando TI crea la bodega',
      },
      {
        name: 'id_atendido_por',
        type: 'uuid',
        fk: 'usuario.id_usuario',
        nullable: true,
        desc: 'Configurador TI',
      },
      { name: 'creado_en', type: 'timestamptz' },
      { name: 'atendido_en', type: 'timestamptz', nullable: true },
    ],
    indexes: [
      'PK (id_solicitud)',
      'IX sol_bodega_tenant (codigo_cuenta, estado)',
      'IX sol_bodega_pendiente (estado) WHERE estado = pendiente',
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: 'N', entity: 'usuario', label: 'solicitante' },
      { card: '0..1', entity: 'bodega', label: 'bodega creada' },
    ],
  },
  {
    id: 'bodega',
    domain: 'platform',
    name: 'Bodega',
    table: 'bodega',
    v20Path: 'warehouses/{warehouseId}',
    physical: 'public.bodegas',
    desc: 'Bodega interna o externa del tenant. La crea el configurador TI (directo o atendiendo solicitud_alta_bodega). El admin de cuenta se asigna después en asignacion_bodega.',
    fields: [
      {
        name: 'id_bodega',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'warehouseId',
        v20Field: 'warehouseId',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
        v20Field: 'codeCuenta',
      },
      { name: 'nombre', type: 'varchar', length: VARCHAR.nombre },
      { name: 'tipo', type: 'enum', enumRef: 'bodega_tipo', desc: enumDesc('bodega_tipo') },
      { name: 'capacidad_slots', type: 'int', legacy: 'capacity' },
      { name: 'esta_activa', type: 'boolean', legacy: 'activa' },
      {
        name: 'id_solicitud_origen',
        type: 'uuid',
        fk: 'solicitud_alta_bodega.id_solicitud',
        nullable: true,
        desc: 'Petición que originó el alta',
      },
      {
        name: 'id_creador',
        type: 'uuid',
        fk: 'usuario.id_usuario',
        desc: 'Configurador TI que creó la bodega',
      },
    ],
    indexes: [
      'PK (id_bodega)',
      'IX bodega_tenant (codigo_cuenta)',
      'IX bodega_tipo (tipo)',
      'IX bodega_solicitud (id_solicitud_origen) UNIQUE nullable',
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: '0..1', entity: 'solicitud_alta_bodega', label: 'desde petición' },
      { card: '1', entity: 'asignacion_bodega', label: 'equipo' },
    ],
  },

  // ─── FASE 0–1 · RBAC ─────────────────────────────────────────────────────
  {
    id: 'rol',
    domain: 'rbac',
    name: 'Rol del sistema',
    table: 'rol',
    physical: 'Catálogo fijo (wmsRoles.js) · 9 filas semilla',
    desc: 'Tabla 0 — empieza aquí. Perfiles fijos del WMS. El configurador TI usa id_rol = configurador (nivel plataforma).',
    indexes: ['PK (id_rol)', 'IX rol_nivel (nivel)'],
    fields: [
      {
        name: 'id_rol',
        type: 'enum',
        enumRef: 'wms_rol',
        pk: true,
        desc: enumDesc('wms_rol'),
      },
      { name: 'nombre', type: 'varchar', length: VARCHAR.nombre },
      { name: 'nivel', type: 'enum', enumRef: 'rol_nivel', desc: enumDesc('rol_nivel') },
      {
        name: 'puede_crear_rol',
        type: 'enum',
        enumRef: 'wms_rol',
        nullable: true,
        desc: 'Rol que puede dar de alta este perfil',
      },
      { name: 'descripcion', type: 'text', nullable: true },
    ],
    relations: [
      { card: '1', entity: 'usuario', label: 'usuarios (cuenta/plataforma)' },
      { card: '1', entity: 'asignacion_bodega', label: 'asignaciones bodega' },
    ],
  },
  {
    id: 'sesion_auth',
    domain: 'rbac',
    name: 'Sesión de autenticación',
    table: 'sesion_auth',
    physical: 'auth.users (Supabase)',
    desc: 'Credenciales Supabase Auth. Configurador TI: login plataforma. Resto: tras validar empresa + pertenencia, se pide contraseña.',
    fields: [
      { name: 'id_auth', type: 'uuid', pk: true, legacy: 'authUid' },
      { name: 'id_usuario', type: 'uuid', fk: 'usuario.id_usuario', unique: true },
      { name: 'correo', type: 'citext', length: VARCHAR.email, unique: true, legacy: 'email' },
      { name: 'ultimo_acceso', type: 'timestamptz', nullable: true },
    ],
    relations: [{ card: '1', entity: 'usuario', label: 'perfil operativo' }],
  },
  {
    id: 'usuario',
    domain: 'rbac',
    name: 'Usuario',
    table: 'usuario',
    v20Path: 'usuarios/{id_usuario}',
    physical: 'public.usuarios + auth.users',
    desc: 'Tabla 3 (admin) y 14 (resto). Configurador TI: codigo_empresa NULL. Admin/operador: pertenecen a empresa y tenant. TI puede crear cualquier rol; admin crea operador_cuenta y equipo de bodega.',
    indexes: [
      'PK (id_usuario)',
      'UNIQUE (correo)',
      'IX usuario_empresa (codigo_empresa)',
      'IX usuario_cuenta (codigo_cuenta)',
      'IX usuario_rol (id_rol)',
    ],
    fields: [
      { name: 'id_usuario', type: 'uuid', pk: true, legacy: 'uid', v20Field: 'uid' },
      {
        name: 'id_rol',
        type: 'enum',
        enumRef: 'wms_rol',
        fk: 'rol.id_rol',
        desc: 'Nivel plataforma o cuenta',
      },
      {
        name: 'codigo_empresa',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'empresa.codigo_empresa',
        nullable: true,
        legacy: 'companyId',
        v20Field: 'codigoEmpresa',
        desc: 'Empresa del login; NULL solo configurador (TI)',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        nullable: true,
        desc: 'Tenant operativo; NULL solo configurador TI',
        legacy: 'codeCuenta',
      },
      {
        name: 'id_creador',
        type: 'uuid',
        fk: 'usuario.id_usuario',
        nullable: true,
        desc: 'configurador → admin cuenta → operador / usuarios bodega',
      },
      { name: 'nombre', type: 'varchar', length: VARCHAR.nombre },
      { name: 'correo', type: 'citext', length: VARCHAR.email, unique: true, legacy: 'email' },
      { name: 'esta_activo', type: 'boolean', legacy: 'activa' },
    ],
    relations: [
      { card: 'N', entity: 'rol', label: 'rol cuenta/plataforma' },
      { card: 'N', entity: 'empresa', label: 'pertenece a (login)' },
      { card: 'N', entity: 'cuenta', label: 'tenant operativo' },
      { card: '1', entity: 'sesion_auth', label: 'login' },
      { card: '1', entity: 'asignacion_bodega', label: 'bodegas' },
      { card: '1', entity: 'orden_compra', label: 'crea OC' },
      { card: '1', entity: 'orden_venta', label: 'crea OV' },
      { card: '1', entity: 'solicitud_compra', label: 'solicita SOL' },
    ],
  },
  {
    id: 'asignacion_bodega',
    domain: 'rbac',
    name: 'Asignación usuario ↔ bodega',
    table: 'asignacion_bodega',
    physical: 'public.usuario_bodega (propuesto)',
    desc: 'Tabla 7 — el administrador de cuenta se auto-asigna a la bodega creada; luego asigna custodio, operario, jefe, etc. Siempre amarrado a bodegas del tenant.',
    fields: [
      { name: 'id_asignacion', type: 'uuid', pk: true },
      { name: 'id_usuario', type: 'uuid', fk: 'usuario.id_usuario' },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'bodega.id_bodega' },
      {
        name: 'id_rol',
        type: 'enum',
        enumRef: 'wms_rol_bodega',
        fk: 'rol.id_rol',
        desc: enumDesc('wms_rol_bodega'),
      },
      { name: 'vigente_desde', type: 'timestamptz' },
      { name: 'esta_activa', type: 'boolean' },
    ],
    indexes: [
      'PK (id_asignacion)',
      'UNIQUE (id_usuario, id_bodega, id_rol)',
      'IX asig_bodega (id_bodega)',
      'IX asig_usuario (id_usuario)',
    ],
    relations: [
      { card: 'N', entity: 'usuario', label: 'usuario' },
      { card: 'N', entity: 'bodega', label: 'bodega' },
      { card: 'N', entity: 'rol', label: 'rol bodega' },
    ],
  },

  // ─── ③ Catálogos ─────────────────────────────────────────────────────────
  {
    id: 'producto',
    domain: 'catalog',
    name: 'Producto (SKU)',
    table: 'producto',
    v20Path: 'catalogo / clientes/{clientId}/productos',
    physical: 'public.productos',
    desc: 'Catálogo del tenant. Lo crea el administrador de cuenta (paso 6), no el configurador.',
    fields: [
      {
        name: 'id_producto',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'productoId',
        v20Field: 'productoId',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      {
        name: 'id_cliente',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'cliente.id_cliente',
        nullable: true,
        legacy: 'clientId',
      },
      { name: 'sku', type: 'varchar', length: VARCHAR.sku },
      { name: 'titulo', type: 'varchar', length: VARCHAR.nombre },
      { name: 'es_primario', type: 'boolean', legacy: 'isPrimario' },
      { name: 'es_secundario', type: 'boolean', legacy: 'isSecundario' },
      {
        name: 'unidad_medida',
        type: 'enum',
        enumRef: 'unidad_medida',
        legacy: 'unidad',
        v20Field: 'unidad',
        desc: enumDesc('unidad_medida'),
      },
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: 'N', entity: 'cliente', label: 'cliente' },
      { card: '1', entity: 'linea_orden_compra', label: 'líneas OC' },
      { card: '1', entity: 'linea_orden_venta', label: 'líneas OV' },
    ],
  },
  {
    id: 'cliente',
    domain: 'catalog',
    name: 'Cliente comercial',
    table: 'cliente',
    physical: 'public.clientes',
    desc: 'Cliente comercial del tenant. Alta por administrador de cuenta (paso 6).',
    fields: [
      {
        name: 'id_cliente',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'clientId',
        v20Field: 'clientId',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      { name: 'nombre', type: 'varchar', length: VARCHAR.nombre },
      { name: 'nit', type: 'varchar', length: VARCHAR.nit, nullable: true },
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: '1', entity: 'producto', label: 'productos' },
      { card: '1', entity: 'caja', label: 'lotes' },
    ],
  },
  {
    id: 'proveedor',
    domain: 'catalog',
    name: 'Proveedor',
    table: 'proveedor',
    physical: 'public.proveedores',
    desc: 'Proveedor de compras del tenant. Alta por administrador de cuenta (paso 7).',
    fields: [
      {
        name: 'id_proveedor',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'proveedorId',
        v20Field: 'proveedorId',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      { name: 'codigo_proveedor', type: 'varchar', length: VARCHAR.codigo, legacy: 'proveedorCode' },
      { name: 'nombre', type: 'varchar', length: VARCHAR.nombre },
      { name: 'telefono', type: 'varchar', length: VARCHAR.telefono, nullable: true },
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: '1', entity: 'orden_compra', label: 'OC' },
      { card: '1', entity: 'solicitud_compra', label: 'SOL' },
    ],
  },
  {
    id: 'comprador',
    domain: 'catalog',
    name: 'Comprador (destino OV)',
    table: 'comprador',
    physical: 'public.compradores',
    desc: 'Destino de ventas / OV. Alta por administrador de cuenta (paso 7).',
    fields: [
      {
        name: 'id_comprador',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'compradorId',
        v20Field: 'compradorId',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      { name: 'nombre', type: 'varchar', length: VARCHAR.nombre },
      { name: 'contacto', type: 'varchar', length: VARCHAR.nombre, nullable: true },
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: '1', entity: 'orden_venta', label: 'OV' },
    ],
  },
  {
    id: 'camion',
    domain: 'catalog',
    name: 'Camión',
    table: 'camion',
    physical: 'public.camiones',
    desc: 'Flota del tenant. Alta por administrador de cuenta (paso 8).',
    fields: [
      {
        name: 'id_camion',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'camionId',
        v20Field: 'camionId',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      { name: 'placa', type: 'varchar', length: VARCHAR.placa, unique: true },
      { name: 'capacidad_kg', type: 'decimal', precision: 12, scale: 3, nullable: true, legacy: 'capacidadKg' },
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: '1', entity: 'viaje_transporte', label: 'viajes' },
    ],
  },
  {
    id: 'planta',
    domain: 'catalog',
    name: 'Planta destino',
    table: 'planta',
    physical: 'public.plantas',
    desc: 'Planta destino logística. Alta por administrador de cuenta (paso 8).',
    fields: [
      { name: 'id_planta', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'plantaId' },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      { name: 'nombre', type: 'varchar', length: VARCHAR.nombre },
      { name: 'direccion', type: 'text', nullable: true },
    ],
    relations: [
      { card: 'N', entity: 'cuenta', label: 'tenant' },
      { card: '1', entity: 'orden_venta', label: 'destino OV' },
    ],
  },

  // ─── ④ Compras ───────────────────────────────────────────────────────────
  {
    id: 'solicitud_compra',
    domain: 'purchase',
    name: 'Solicitud de compra (SOL)',
    table: 'solicitud_compra',
    v20Path: 'solicitudesCompra/{solId}',
    physical: 'public.solicitudes_compra',
    desc: 'Operador de cuenta solicita material; al aprobarse genera la OC (strip-oc).',
    fields: [
      {
        name: 'id_solicitud_compra',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'solId',
        v20Field: 'solId',
      },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      {
        name: 'id_proveedor',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'proveedor.id_proveedor',
        legacy: 'proveedorId',
      },
      { name: 'id_solicitante', type: 'uuid', fk: 'usuario.id_usuario', desc: 'Operador o admin cuenta' },
      { name: 'estado', type: 'enum', enumRef: 'estado_sol', desc: enumDesc('estado_sol') },
      {
        name: 'id_orden_compra',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'orden_compra.id_orden_compra',
        nullable: true,
        legacy: 'ocId',
      },
      { name: 'creado_en', type: 'timestamptz', legacy: 'createdAt' },
    ],
    relations: [
      { card: '0..1', entity: 'orden_compra', label: 'genera OC' },
      { card: 'N', entity: 'proveedor', label: 'proveedor' },
    ],
  },
  {
    id: 'orden_compra',
    domain: 'purchase',
    name: 'Orden de compra (OC)',
    table: 'orden_compra',
    v20Path: 'ordenesCompra/{ocId}',
    physical: 'public.ordenes_compra',
    desc: 'Operador de cuenta / administrador de cuenta. Paso a paso: strip-oc → recepción.',
    fields: [
      {
        name: 'id_orden_compra',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'ocId',
        v20Field: 'ocId',
      },
      { name: 'numero_documento', type: 'varchar', length: VARCHAR.documento, unique: true, legacy: 'numero' },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      {
        name: 'id_proveedor',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'proveedor.id_proveedor',
        legacy: 'proveedorId',
      },
      {
        name: 'id_bodega_destino',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'bodega.id_bodega',
        legacy: 'warehouseId',
      },
      { name: 'id_creador', type: 'uuid', fk: 'usuario.id_usuario', desc: 'Operador o admin cuenta' },
      { name: 'estado', type: 'enum', enumRef: 'estado_oc', desc: enumDesc('estado_oc') },
      { name: 'fecha_entrega_estimada', type: 'timestamptz', nullable: true, legacy: 'fechaEntregaEstimada' },
    ],
    relations: [
      { card: '1', entity: 'linea_orden_compra', label: 'líneas' },
      { card: '0..1', entity: 'solicitud_compra', label: 'desde SOL' },
      { card: '1', entity: 'caja', label: 'ingresos' },
    ],
  },
  {
    id: 'linea_orden_compra',
    domain: 'purchase',
    name: 'Línea OC',
    table: 'linea_orden_compra',
    physical: 'public.oc_lineas',
    fields: [
      {
        name: 'id_orden_compra',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        fk: 'orden_compra.id_orden_compra',
        legacy: 'ocId',
      },
      { name: 'id_linea', type: 'varchar', length: VARCHAR.linea, pk: true, legacy: 'lineaId' },
      {
        name: 'id_producto',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'producto.id_producto',
        legacy: 'productoId',
      },
      { name: 'peso_pedido_kg', type: 'decimal', precision: 12, scale: 3, legacy: 'pesoKgPedido' },
      { name: 'peso_recibido_kg', type: 'decimal', precision: 12, scale: 3, nullable: true, legacy: 'pesoKgRecibido' },
    ],
    indexes: ['PRIMARY(id_orden_compra, id_linea)'],
    relations: [
      { card: 'N', entity: 'orden_compra', label: 'OC' },
      { card: 'N', entity: 'producto', label: 'producto' },
    ],
  },

  // ─── ⑤ Bodega operativa ──────────────────────────────────────────────────
  {
    id: 'estado_bodega',
    domain: 'warehouse',
    name: 'Estado en vivo (documento)',
    table: 'warehouse_state',
    v20Path: 'state/main',
    v20Type: 'WarehouseState',
    physical: 'public.warehouse_state (jsonb)',
    desc: 'Tabla 18 — una fila por bodega (jsonb). Realtime; proyección lógica en slot/caja/OT.',
    indexes: ['PK (id_bodega)', 'GIN (estado_json) opcional'],
    fields: [
      { name: 'estado_json', type: 'jsonb', desc: 'slots, cajas, OT, alertas (OLTP en vivo)' },
      {
        name: 'id_bodega',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        fk: 'bodega.id_bodega',
        legacy: 'warehouseId',
      },
      { name: 'actualizado_en', type: 'timestamptz', legacy: 'updatedAt', v20Field: 'updatedAt' },
    ],
    relations: [
      { card: '1', entity: 'bodega', label: 'bodega' },
      { card: '1', entity: 'slot', label: 'slots' },
      { card: '1', entity: 'caja', label: 'cajas' },
      { card: '1', entity: 'orden_trabajo', label: 'OT' },
      { card: '1', entity: 'tarea_cola', label: 'tareas' },
      { card: '1', entity: 'alerta', label: 'alertas' },
    ],
  },
  {
    id: 'slot',
    domain: 'warehouse',
    name: 'Casillero (SlotState)',
    table: 'slot',
    v20Path: 'state/main.slots[slotId]',
    physical: 'warehouse_state.slots',
    desc: 'libre | ocupado | reservado | en_proceso — paso locking.',
    fields: [
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, pk: true, fk: 'estado_bodega.id_bodega' },
      { name: 'id_slot', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'slotId', v20Field: 'slotId' },
      { name: 'estado', type: 'enum', enumRef: 'estado_slot', desc: enumDesc('estado_slot') },
      { name: 'temperatura_c', type: 'decimal', precision: 5, scale: 2, nullable: true, legacy: 'temperaturaC' },
      {
        name: 'id_caja',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'caja.id_caja',
        nullable: true,
        legacy: 'cajaId',
      },
    ],
    indexes: ['PRIMARY(id_bodega, id_slot)'],
    relations: [
      { card: 'N', entity: 'estado_bodega', label: 'estado' },
      { card: '0..1', entity: 'caja', label: 'caja actual' },
      { card: '1', entity: 'alerta', label: 'alertas' },
    ],
  },
  {
    id: 'caja',
    domain: 'warehouse',
    name: 'Caja / lote (BoxRecord)',
    table: 'caja',
    v20Path: 'inboundBoxes | outboundBoxes | dispatchedBoxes',
    v20Type: 'BoxRecord',
    physical: 'Arrays en state/main',
    desc: 'Custodio ingresa; operario mueve; zonas según paso a paso.',
    fields: [
      { name: 'id_caja', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'cajaId', v20Field: 'cajaId' },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'bodega.id_bodega', legacy: 'warehouseId' },
      { name: 'zona', type: 'enum', enumRef: 'zona_caja', desc: enumDesc('zona_caja') },
      {
        name: 'id_producto',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'producto.id_producto',
        legacy: 'productoId',
      },
      {
        name: 'id_cliente',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'cliente.id_cliente',
        nullable: true,
        legacy: 'clientId',
      },
      { name: 'peso_kg', type: 'decimal', precision: 12, scale: 3, legacy: 'pesoKg' },
      {
        name: 'temperatura_objetivo_c',
        type: 'decimal',
        precision: 5,
        scale: 2,
        nullable: true,
        legacy: 'temperaturaObjetivoC',
      },
      {
        name: 'id_orden_compra',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'orden_compra.id_orden_compra',
        nullable: true,
        legacy: 'ocId',
      },
      {
        name: 'id_orden_venta',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'orden_venta.id_orden_venta',
        nullable: true,
        legacy: 'ovId',
      },
    ],
    relations: [
      { card: 'N', entity: 'bodega', label: 'bodega' },
      { card: 'N', entity: 'producto', label: 'producto' },
      { card: 'N', entity: 'orden_compra', label: 'ingreso OC' },
      { card: 'N', entity: 'orden_venta', label: 'salida OV' },
      { card: '1', entity: 'orden_trabajo', label: 'movimientos' },
    ],
  },
  {
    id: 'orden_trabajo',
    domain: 'warehouse',
    name: 'Orden de trabajo (WorkOrder)',
    table: 'orden_trabajo',
    v20Path: 'state/main.orders[]',
    v20Type: 'WorkOrder',
    physical: 'warehouse_state.orders',
    desc: 'Jefe/custodio crean; operario ejecuta. Tipos: a_bodega | a_salida | revisar.',
    fields: [
      {
        name: 'id_orden_trabajo',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        legacy: 'orderId',
        v20Field: 'orderId',
      },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'estado_bodega.id_bodega', legacy: 'warehouseId' },
      { name: 'tipo', type: 'enum', enumRef: 'tipo_orden_trabajo', desc: enumDesc('tipo_orden_trabajo') },
      {
        name: 'id_caja',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'caja.id_caja',
        nullable: true,
        legacy: 'cajaId',
      },
      {
        name: 'id_slot_destino',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'slot.id_slot',
        nullable: true,
        legacy: 'slotDestinoId',
      },
      { name: 'id_asignado', type: 'uuid', fk: 'usuario.id_usuario', nullable: true, desc: 'Operario', legacy: 'asignadoUid' },
      { name: 'id_solicitante', type: 'uuid', fk: 'usuario.id_usuario', nullable: true, desc: 'Jefe o custodio' },
      { name: 'estado', type: 'enum', enumRef: 'estado_orden_trabajo', desc: enumDesc('estado_orden_trabajo') },
    ],
    relations: [
      { card: 'N', entity: 'estado_bodega', label: 'bodega' },
      { card: 'N', entity: 'caja', label: 'caja' },
      { card: 'N', entity: 'usuario', label: 'operario' },
    ],
  },
  {
    id: 'tarea_cola',
    domain: 'warehouse',
    name: 'Tarea en cola (Task)',
    table: 'tarea_cola',
    v20Path: 'state/main.tasks[]',
    physical: 'warehouse_state.tasks',
    fields: [
      { name: 'id_tarea', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'taskId' },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'estado_bodega.id_bodega' },
      { name: 'id_asignado', type: 'uuid', fk: 'usuario.id_usuario', nullable: true },
      {
        name: 'id_orden_trabajo',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'orden_trabajo.id_orden_trabajo',
        nullable: true,
        legacy: 'orderId',
      },
      { name: 'estado', type: 'enum', enumRef: 'estado_tarea', desc: enumDesc('estado_tarea') },
      { name: 'tipo', type: 'enum', enumRef: 'tipo_tarea', nullable: true, desc: enumDesc('tipo_tarea') },
    ],
    relations: [
      { card: 'N', entity: 'estado_bodega', label: 'bodega' },
      { card: 'N', entity: 'orden_trabajo', label: 'OT vinculada' },
    ],
  },
  {
    id: 'alerta',
    domain: 'warehouse',
    name: 'Alerta operativa',
    table: 'alerta',
    v20Path: 'state/main.alerts[]',
    physical: 'warehouse_state.alerts',
    desc: 'temperatura | demora | orden_reportada — jefe de bodega atiende.',
    fields: [
      { name: 'id_alerta', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'alertaId' },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'estado_bodega.id_bodega' },
      { name: 'tipo', type: 'enum', enumRef: 'tipo_alerta', desc: enumDesc('tipo_alerta') },
      { name: 'id_slot', type: 'varchar', length: VARCHAR.id, fk: 'slot.id_slot', nullable: true, legacy: 'slotId' },
      { name: 'id_responsable', type: 'uuid', fk: 'usuario.id_usuario', nullable: true, desc: 'Jefe bodega' },
      { name: 'motivo_cierre', type: 'text', nullable: true, legacy: 'motivoCierre' },
    ],
    relations: [
      { card: 'N', entity: 'estado_bodega', label: 'bodega' },
      { card: 'N', entity: 'slot', label: 'slot' },
      { card: 'N', entity: 'usuario', label: 'jefe bodega' },
    ],
  },

  // ─── ⑥ Procesamiento ─────────────────────────────────────────────────────
  {
    id: 'solicitud_procesamiento',
    domain: 'processing',
    name: 'Solicitud de procesamiento',
    table: 'solicitud_procesamiento',
    v20Path: 'solicitudesProcesamiento/{id}',
    physical: 'public.solicitudes_procesamiento',
    desc: 'Operador de cuenta solicita; procesador ejecuta (paso procesamiento).',
    fields: [
      { name: 'id_solicitud', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'solicitudId' },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'bodega.id_bodega', legacy: 'warehouseId' },
      {
        name: 'id_producto_primario',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'producto.id_producto',
        legacy: 'productoPrimarioId',
      },
      {
        name: 'id_producto_secundario',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'producto.id_producto',
        legacy: 'productoSecundarioId',
      },
      { name: 'estado', type: 'enum', enumRef: 'estado_procesamiento', desc: enumDesc('estado_procesamiento') },
      { name: 'kilos_primario', type: 'decimal', precision: 12, scale: 3, legacy: 'kgPrimario' },
      { name: 'kilos_secundario', type: 'decimal', precision: 12, scale: 3, nullable: true, legacy: 'kgSecundario' },
      { name: 'kilos_merma', type: 'decimal', precision: 12, scale: 3, nullable: true, legacy: 'kgMerma' },
      { name: 'id_procesador', type: 'uuid', fk: 'usuario.id_usuario', nullable: true, legacy: 'operarioUid' },
    ],
    relations: [
      { card: '1', entity: 'registro_merma', label: 'merma' },
      { card: 'N', entity: 'bodega', label: 'bodega' },
      { card: 'N', entity: 'producto', label: 'primario/secundario' },
      { card: 'N', entity: 'usuario', label: 'procesador' },
    ],
  },
  {
    id: 'registro_merma',
    domain: 'processing',
    name: 'Registro de merma',
    table: 'registro_merma',
    physical: 'public.registro_merma · history',
    fields: [
      { name: 'id_registro', type: 'uuid', pk: true, legacy: 'registroId' },
      {
        name: 'id_solicitud',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'solicitud_procesamiento.id_solicitud',
        legacy: 'solicitudId',
      },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'bodega.id_bodega', legacy: 'warehouseId' },
      { name: 'kilos_merma', type: 'decimal', precision: 12, scale: 3, legacy: 'kgMerma' },
      { name: 'periodo', type: 'date', desc: 'Primer día del mes (YYYY-MM)' },
    ],
    relations: [
      { card: 'N', entity: 'solicitud_procesamiento', label: 'solicitud' },
      { card: 'N', entity: 'bodega', label: 'bodega' },
    ],
  },

  // ─── ⑦ Ventas y transporte ───────────────────────────────────────────────
  {
    id: 'orden_venta',
    domain: 'sales',
    name: 'Orden de venta (OV)',
    table: 'orden_venta',
    v20Path: 'ordenesVenta/{ovId}',
    physical: 'public.ordenes_venta',
    fields: [
      { name: 'id_orden_venta', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'ovId', v20Field: 'ovId' },
      { name: 'numero_documento', type: 'varchar', length: VARCHAR.documento, unique: true, legacy: 'numero' },
      {
        name: 'codigo_cuenta',
        type: 'varchar',
        length: VARCHAR.codigo,
        fk: 'cuenta.codigo_cuenta',
        legacy: 'codeCuenta',
      },
      {
        name: 'id_comprador',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'comprador.id_comprador',
        legacy: 'compradorId',
      },
      {
        name: 'id_bodega_origen',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'bodega.id_bodega',
        legacy: 'warehouseOrigenId',
      },
      {
        name: 'id_planta',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'planta.id_planta',
        nullable: true,
        legacy: 'plantaId',
      },
      { name: 'id_creador', type: 'uuid', fk: 'usuario.id_usuario' },
      { name: 'estado', type: 'enum', enumRef: 'estado_ov', desc: enumDesc('estado_ov') },
    ],
    relations: [
      { card: '1', entity: 'linea_orden_venta', label: 'líneas' },
      { card: '0..1', entity: 'viaje_transporte', label: 'TV' },
    ],
  },
  {
    id: 'linea_orden_venta',
    domain: 'sales',
    name: 'Línea OV',
    table: 'linea_orden_venta',
    physical: 'public.ov_lineas',
    fields: [
      {
        name: 'id_orden_venta',
        type: 'varchar',
        length: VARCHAR.id,
        pk: true,
        fk: 'orden_venta.id_orden_venta',
        legacy: 'ovId',
      },
      { name: 'id_linea', type: 'varchar', length: VARCHAR.linea, pk: true, legacy: 'lineaId' },
      {
        name: 'id_producto',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'producto.id_producto',
        legacy: 'productoId',
      },
      { name: 'cantidad_kg', type: 'decimal', precision: 12, scale: 3, legacy: 'cantidadKg' },
    ],
    indexes: ['PRIMARY(id_orden_venta, id_linea)'],
    relations: [
      { card: 'N', entity: 'orden_venta', label: 'OV' },
      { card: 'N', entity: 'producto', label: 'producto' },
      { card: '1', entity: 'evidencia_entrega', label: 'evidencias' },
    ],
  },
  {
    id: 'viaje_transporte',
    domain: 'sales',
    name: 'Viaje (TV)',
    table: 'viaje_transporte',
    v20Path: 'viajes/{viajeId}',
    physical: 'public.viajes_transporte',
    desc: 'Transportista. TV-#### desde contador_documento.',
    fields: [
      { name: 'id_viaje', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'viajeId', v20Field: 'viajeId' },
      {
        name: 'numero_documento',
        type: 'varchar',
        length: VARCHAR.documento,
        unique: true,
        desc: 'TV-####',
        legacy: 'numero',
      },
      {
        name: 'id_orden_venta',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'orden_venta.id_orden_venta',
        legacy: 'ovId',
      },
      {
        name: 'id_camion',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'camion.id_camion',
        nullable: true,
        legacy: 'camionId',
      },
      { name: 'id_transportista', type: 'uuid', fk: 'usuario.id_usuario', nullable: true, legacy: 'conductorUid' },
      { name: 'estado', type: 'enum', enumRef: 'estado_viaje', desc: enumDesc('estado_viaje') },
    ],
    relations: [{ card: '1', entity: 'evidencia_entrega', label: 'evidencias' }],
  },
  {
    id: 'evidencia_entrega',
    domain: 'sales',
    name: 'Evidencia de entrega',
    table: 'evidencia_entrega',
    physical: 'Cloudinary + viaje',
    fields: [
      { name: 'id_evidencia', type: 'uuid', pk: true, legacy: 'evidenciaId' },
      { name: 'id_viaje', type: 'varchar', length: VARCHAR.id, fk: 'viaje_transporte.id_viaje', legacy: 'viajeId' },
      {
        name: 'id_orden_venta',
        type: 'varchar',
        length: VARCHAR.id,
        fk: 'orden_venta.id_orden_venta',
        nullable: true,
        legacy: 'ovId',
      },
      {
        name: 'id_linea',
        type: 'varchar',
        length: VARCHAR.linea,
        fk: 'linea_orden_venta.id_linea',
        nullable: true,
        legacy: 'lineaId',
        desc: 'PK compuesta con id_orden_venta',
      },
      { name: 'url_foto', type: 'url', length: VARCHAR.url, legacy: 'fotoUrl' },
      { name: 'url_firma', type: 'url', length: VARCHAR.url, nullable: true, legacy: 'firmaUrl' },
      { name: 'cantidad_entregada_kg', type: 'decimal', precision: 12, scale: 3, legacy: 'cantidadEntregadaKg' },
      { name: 'incidencia', type: 'text', nullable: true },
    ],
    relations: [
      { card: 'N', entity: 'viaje_transporte', label: 'viaje' },
      { card: 'N', entity: 'linea_orden_venta', label: 'línea OV' },
    ],
  },

  // ─── ⑧ Sistema ───────────────────────────────────────────────────────────
  {
    id: 'historial_movimiento',
    domain: 'system',
    name: 'Historial de movimientos',
    table: 'historial_movimiento',
    v20Path: 'history/{movimientoId}',
    physical: 'public.warehouse_history',
    fields: [
      { name: 'id_movimiento', type: 'uuid', pk: true, legacy: 'movimientoId' },
      { name: 'id_bodega', type: 'varchar', length: VARCHAR.id, fk: 'bodega.id_bodega', legacy: 'warehouseId' },
      { name: 'tipo', type: 'enum', enumRef: 'tipo_historial', desc: enumDesc('tipo_historial') },
      { name: 'id_usuario', type: 'uuid', fk: 'usuario.id_usuario', nullable: true },
      { name: 'datos', type: 'jsonb', legacy: 'payload' },
      { name: 'creado_en', type: 'timestamptz', legacy: 'createdAt' },
    ],
    relations: [
      { card: 'N', entity: 'bodega', label: 'bodega' },
      { card: 'N', entity: 'usuario', label: 'actor' },
    ],
  },
  {
    id: 'contador_documento',
    domain: 'system',
    name: 'Contador de documentos',
    table: 'contador_documento',
    v20Path: 'systemCounters/viajesTransporte',
    physical: 'public.system_counters',
    fields: [
      { name: 'nombre_contador', type: 'varchar', length: VARCHAR.id, pk: true, legacy: 'nombre' },
      { name: 'valor_actual', type: 'int', legacy: 'valor' },
      { name: 'prefijo', type: 'enum', enumRef: 'prefijo_documento', desc: enumDesc('prefijo_documento') },
    ],
    relations: [{ card: '1', entity: 'viaje_transporte', label: 'numera TV' }],
  },
  {
    id: 'auditoria',
    domain: 'system',
    name: 'Auditoría',
    table: 'auditoria',
    physical: 'public.audit_log (propuesto)',
    fields: [
      { name: 'id_evento', type: 'uuid', pk: true, legacy: 'eventId' },
      { name: 'id_usuario', type: 'uuid', fk: 'usuario.id_usuario', legacy: 'uid' },
      { name: 'accion', type: 'enum', enumRef: 'accion_auditoria', desc: enumDesc('accion_auditoria') },
      { name: 'entidad', type: 'varchar', length: VARCHAR.id, desc: 'Tabla o recurso afectado' },
      { name: 'id_entidad', type: 'varchar', length: VARCHAR.id, legacy: 'entidadId' },
      { name: 'creado_en', type: 'timestamptz', legacy: 'createdAt' },
    ],
    relations: [{ card: 'N', entity: 'usuario', label: 'usuario' }],
  },
]

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
    title: 'Inventario descompuesto',
    detail:
      'El documento state/main es una vista agregada; slot, caja, orden_trabajo, tarea y alerta son entidades con FK a bodega.',
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
  { logical: 'Empresa + tenant + bodega', physical: 'empresa, tenant_config, bodegas' },
  { logical: 'rol + sesion_auth + usuario + asignacion_bodega', physical: 'auth.users, usuarios, usuario_bodega' },
  { logical: 'SOL + OC / OV + líneas', physical: 'solicitudes_compra, ordenes_compra, oc_lineas, ordenes_venta, ov_lineas' },
  { logical: 'state/main', physical: 'warehouse_state jsonb → slot, caja, OT, tarea, alerta' },
  { logical: 'procesamiento + merma', physical: 'solicitudes_procesamiento, registro_merma' },
  { logical: 'viaje + evidencia + contador', physical: 'viajes_transporte, system_counters, Cloudinary' },
  { logical: 'historial + auditoría', physical: 'warehouse_history, audit_log' },
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
