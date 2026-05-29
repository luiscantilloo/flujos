/**
 * Flujo general: construcción lógica de una aplicación con validación de datos (S/N) y subflujos.
 * Independiente del WMS bodega de frío.
 */

const L = {
  data: { layoutIgnore: true },
  style: { strokeDasharray: '8 4', stroke: '#8b9cb3' },
}

function e(id, source, target, opts = {}) {
  return { id, source, target, ...opts }
}

/** Subflujo: capas y responsabilidades (UI → cliente → API → persistencia). */
const sub_app_capas = {
  id: 'sub_app_capas',
  title: 'Detalle: capas de la aplicación',
  tabShort: 'Capas',
  nodes: [
    {
      id: 'cap_hdr',
      type: 'header',
      data: { label: 'Arquitectura en capas' },
    },
    {
      id: 'cap_ui',
      type: 'process',
      data: { label: 'UI: formularios, máscaras, mensajes de error cercanos al campo' },
    },
    {
      id: 'cap_cli',
      type: 'process',
      data: { label: 'Cliente: estado, caché, reintentos idempotentes donde aplique' },
    },
    {
      id: 'cap_api',
      type: 'process',
      data: { label: 'API: autenticación, autorización, rate limits, idempotency keys' },
    },
    {
      id: 'cap_dom',
      type: 'process',
      data: { label: 'Dominio: invariantes, políticas, orquestación de casos de uso' },
    },
    {
      id: 'cap_persist',
      type: 'process',
      data: { label: 'Persistencia: transacciones, índices, migraciones versionadas' },
    },
    {
      id: 'cap_obs',
      type: 'process',
      data: { label: 'Observabilidad: logs estructurados, métricas, trazas en puntos de borde' },
    },
    {
      id: 'cap_ok',
      type: 'success',
      data: { label: 'Cada capa con contrato claro hacia la siguiente' },
    },
  ],
  edges: [
    e('cap_0', 'cap_hdr', 'cap_ui'),
    e('cap_1', 'cap_ui', 'cap_cli'),
    e('cap_2', 'cap_cli', 'cap_api'),
    e('cap_3', 'cap_api', 'cap_dom'),
    e('cap_4', 'cap_dom', 'cap_persist'),
    e('cap_5', 'cap_persist', 'cap_obs'),
    e('cap_6', 'cap_obs', 'cap_ok'),
  ],
}

/** Subflujo: validación de datos con bifurcaciones S/N. */
const sub_app_validacion = {
  id: 'sub_app_validacion',
  title: 'Detalle: validación de datos (S/N)',
  tabShort: 'Validación',
  nodes: [
    {
      id: 'val_hdr',
      type: 'header',
      data: { label: 'Validación en profundidad' },
    },
    {
      id: 'val_capture',
      type: 'process',
      data: { label: 'Recepción: formulario, JSON o evento de integración' },
    },
    {
      id: 'val_pres',
      type: 'decision',
      data: { label: '¿Presente y con forma esperada?' },
    },
    {
      id: 'val_err_pres',
      type: 'error',
      data: { label: 'Rechazo: obligatorio / tipo inválido' },
    },
    {
      id: 'val_schema',
      type: 'process',
      data: { label: 'Esquema declarativo (p. ej. Zod, Joi, JSON Schema)' },
    },
    {
      id: 'val_schema_ok',
      type: 'decision',
      data: { label: '¿Pasa esquema estructural?' },
    },
    {
      id: 'val_err_schema',
      type: 'error',
      data: { label: '400: cuerpo mal formado o campos faltantes' },
    },
    {
      id: 'val_rules',
      type: 'process',
      data: { label: 'Reglas de negocio (rangos, unicidad, estado del agregado)' },
    },
    {
      id: 'val_rules_ok',
      type: 'decision',
      data: { label: '¿Reglas satisfechas?' },
    },
    {
      id: 'val_err_rules',
      type: 'error',
      data: { label: '422: regla de negocio incumplida' },
    },
    {
      id: 'val_authz',
      type: 'validation',
      data: {
        label: 'Autorización y políticas',
        subtitle: 'RBAC, pertenencia de recurso, cuotas',
      },
    },
    {
      id: 'val_err_authz',
      type: 'error',
      data: { label: '403: prohibido' },
    },
    {
      id: 'val_tx',
      type: 'process',
      data: { label: 'Transacción / unidad de trabajo' },
    },
    {
      id: 'val_tx_ok',
      type: 'decision',
      data: { label: '¿Commit sin conflictos?' },
    },
    {
      id: 'val_err_tx',
      type: 'error',
      data: { label: '409: conflicto o violación de integridad' },
    },
    {
      id: 'val_ok',
      type: 'success',
      data: { label: 'Datos aceptados y consistentes' },
    },
  ],
  edges: [
    e('val_0', 'val_hdr', 'val_capture'),
    e('val_0b', 'val_capture', 'val_pres'),
    e('val_rp', 'val_err_pres', 'val_capture', { ...L }),
    e('val_2s', 'val_pres', 'val_schema', { sourceHandle: 'yes', label: 'S' }),
    e('val_2n', 'val_pres', 'val_err_pres', { sourceHandle: 'no', label: 'N' }),
    e('val_3', 'val_schema', 'val_schema_ok'),
    e('val_4s', 'val_schema_ok', 'val_rules', { sourceHandle: 'yes', label: 'S' }),
    e('val_4n', 'val_schema_ok', 'val_err_schema', { sourceHandle: 'no', label: 'N' }),
    e('val_rs', 'val_err_schema', 'val_capture', { ...L }),
    e('val_5', 'val_rules', 'val_rules_ok'),
    e('val_6s', 'val_rules_ok', 'val_authz', { sourceHandle: 'yes', label: 'S' }),
    e('val_6n', 'val_rules_ok', 'val_err_rules', { sourceHandle: 'no', label: 'N' }),
    e('val_ru', 'val_err_rules', 'val_capture', { ...L }),
    e('val_8s', 'val_authz', 'val_tx', { sourceHandle: 'yes', label: 'S' }),
    e('val_8n', 'val_authz', 'val_err_authz', { sourceHandle: 'no', label: 'N' }),
    e('val_au', 'val_err_authz', 'val_capture', { ...L }),
    e('val_9', 'val_tx', 'val_tx_ok'),
    e('val_10s', 'val_tx_ok', 'val_ok', { sourceHandle: 'yes', label: 'S' }),
    e('val_10n', 'val_tx_ok', 'val_err_tx', { sourceHandle: 'no', label: 'N' }),
    e('val_txr', 'val_err_tx', 'val_capture', { ...L }),
  ],
}

/** Subflujo: pruebas, CI y “definition of done”. */
const sub_app_pruebas = {
  id: 'sub_app_pruebas',
  title: 'Detalle: pruebas y calidad',
  tabShort: 'Pruebas',
  nodes: [
    {
      id: 'qa_hdr',
      type: 'header',
      data: { label: 'Pirámide y gates de calidad' },
    },
    {
      id: 'qa_unit',
      type: 'process',
      data: { label: 'Unit: validadores, reglas puras, mappers' },
    },
    {
      id: 'qa_int',
      type: 'process',
      data: { label: 'Integración: API + DB en contenedor o emulador' },
    },
    {
      id: 'qa_cov',
      type: 'decision',
      data: { label: '¿Rutas críticas cubiertas?' },
    },
    {
      id: 'qa_gap',
      type: 'process',
      data: { label: 'Añadir casos faltantes o reducir superficie expuesta' },
    },
    {
      id: 'qa_e2e',
      type: 'process',
      data: { label: 'E2E: flujos felices + errores esperados visibles' },
    },
    {
      id: 'qa_ci',
      type: 'decision',
      data: { label: '¿Pipeline CI verde?' },
    },
    {
      id: 'qa_fix',
      type: 'process',
      data: { label: 'Corregir fallos y repetir suite' },
    },
    {
      id: 'qa_ok',
      type: 'success',
      data: { label: 'Listo para promoción (staging → prod)' },
    },
  ],
  edges: [
    e('qa_0', 'qa_hdr', 'qa_unit'),
    e('qa_1', 'qa_unit', 'qa_int'),
    e('qa_2', 'qa_int', 'qa_cov'),
    e('qa_3s', 'qa_cov', 'qa_e2e', { sourceHandle: 'yes', label: 'S' }),
    e('qa_3n', 'qa_cov', 'qa_gap', { sourceHandle: 'no', label: 'N' }),
    e('qa_3b', 'qa_gap', 'qa_unit', { ...L }),
    e('qa_4', 'qa_e2e', 'qa_ci'),
    e('qa_5s', 'qa_ci', 'qa_ok', { sourceHandle: 'yes', label: 'S' }),
    e('qa_5n', 'qa_ci', 'qa_fix', { sourceHandle: 'no', label: 'N' }),
    e('qa_5r', 'qa_fix', 'qa_unit', { ...L }),
  ],
}

const mainNodes = [
  {
    id: 'm_hdr',
    type: 'header',
    data: { label: 'Desarrollo lógico de una aplicación' },
  },
  {
    id: 'm_req',
    type: 'start',
    data: { label: 'Requisitos: problema, actores, restricciones' },
  },
  {
    id: 'm_scope',
    type: 'decision',
    data: { label: '¿Alcance acotado y medible?' },
  },
  {
    id: 'm_scope_bad',
    type: 'error',
    data: { label: 'Iterar alcance con stakeholders' },
  },
  {
    id: 'm_model',
    type: 'process',
    data: { label: 'Modelo de dominio, agregados y lenguaje ubicuo' },
  },
  {
    id: 'm_contracts',
    type: 'process',
    data: {
      label: 'Contratos entre capas (API, eventos, errores)',
      drillDownTo: 'sub_app_capas',
    },
  },
  {
    id: 'm_truth',
    type: 'decision',
    data: { label: '¿Fuente de verdad y límites claros?' },
  },
  {
    id: 'm_impl',
    type: 'process',
    data: {
      label: 'Implementar por capas (UI → dominio → persistencia)',
      drillDownTo: 'sub_app_capas',
    },
  },
  {
    id: 'm_validate',
    type: 'process',
    data: {
      label: 'Validar datos en cada borde (cliente, API, DB)',
      drillDownTo: 'sub_app_validacion',
    },
  },
  {
    id: 'm_gate',
    type: 'validation',
    data: {
      label: 'Revisión técnica',
      subtitle: 'Seguridad básica, performance, accesibilidad según riesgo',
    },
  },
  {
    id: 'm_tests',
    type: 'process',
    data: {
      label: 'Pruebas automatizadas + CI',
      drillDownTo: 'sub_app_pruebas',
    },
  },
  {
    id: 'm_ci',
    type: 'decision',
    data: { label: '¿CI verde y criterios de aceptación cumplidos?' },
  },
  {
    id: 'm_deploy',
    type: 'success',
    data: { label: 'Despliegue / release y observación en producción' },
  },
]

const mainEdges = [
  e('m_0', 'm_hdr', 'm_req'),
  e('m_1', 'm_req', 'm_scope'),
  e('m_2s', 'm_scope', 'm_model', { sourceHandle: 'yes', label: 'S' }),
  e('m_2n', 'm_scope', 'm_scope_bad', { sourceHandle: 'no', label: 'N' }),
  e('m_2r', 'm_scope_bad', 'm_req', { ...L }),
  e('m_3', 'm_model', 'm_contracts'),
  e('m_4', 'm_contracts', 'm_truth'),
  e('m_5s', 'm_truth', 'm_impl', { sourceHandle: 'yes', label: 'S' }),
  e('m_5n', 'm_truth', 'm_model', { sourceHandle: 'no', label: 'N', ...L }),
  e('m_6', 'm_impl', 'm_validate'),
  e('m_7', 'm_validate', 'm_gate'),
  e('m_9s', 'm_gate', 'm_tests', { sourceHandle: 'yes', label: 'S' }),
  e('m_9n', 'm_gate', 'm_impl', { sourceHandle: 'no', label: 'N', ...L }),
  e('m_10', 'm_tests', 'm_ci'),
  e('m_11s', 'm_ci', 'm_deploy', { sourceHandle: 'yes', label: 'S' }),
  e('m_11n', 'm_ci', 'm_tests', { sourceHandle: 'no', label: 'N', ...L }),
]

export const appDevelopmentFlowDefinitions = {
  main: {
    id: 'main',
    title: 'App — Desarrollo lógico y validaciones',
    tabShort: 'General',
    nodes: mainNodes,
    edges: mainEdges,
  },
  sub_app_capas,
  sub_app_validacion,
  sub_app_pruebas,
}

export const appDevelopmentTopLevelFlowKeys = [
  'main',
  'sub_app_capas',
  'sub_app_validacion',
  'sub_app_pruebas',
]

export const APP_DEVELOPMENT_LEGEND =
  'Nodos con anillo: abren subflujos (capas, validación S/N, pruebas/CI). Amarillo: decisiones. Cian: capa tipo “validación/puerta”. Rojo: rechazo o rework. Verde: cierre. Línea discontinua: reintento o vuelta atrás.'
