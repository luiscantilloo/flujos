/**
 * Subflujos extraídos de la documentación Bodega de Frío (v1 / v2).
 * Cada flujo es independiente; las pestañas usan `tabShort` cuando existe.
 */

const L = {
  data: { layoutIgnore: true },
  style: { strokeDasharray: '8 4', stroke: '#8b9cb3' },
}

function e(id, source, target, opts = {}) {
  return { id, source, target, ...opts }
}

/** 6.1 Configuración inicial del sistema (doc V2) */
const sub_doc_config_inicial = {
  id: 'sub_doc_config_inicial',
  title: '6.1 — Configuración inicial del sistema',
  tabShort: '6.1 Config',
  nodes: [
    {
      id: 'ci_hdr',
      type: 'header',
      data: { label: 'Configuración inicial (Configurador / Admin)' },
    },
    {
      id: 'ci_bod',
      type: 'process',
      data: { label: 'Bodegas: nombre, tipo interna/externa, capacidad de slots' },
    },
    {
      id: 'ci_cta',
      type: 'process',
      data: { label: 'Cuentas operativas (codeCuenta) que agrupan clientes y bodegas' },
    },
    {
      id: 'ci_usr',
      type: 'process',
      data: { label: 'Alta usuarios: Supabase Auth + perfil en Supabase (PostgreSQL)' },
    },
    {
      id: 'ci_cat',
      type: 'process',
      data: { label: 'Catálogo de productos (importación o creación manual)' },
    },
    {
      id: 'ci_prov',
      type: 'process',
      data: { label: 'Proveedores y compradores con datos de contacto' },
    },
    {
      id: 'ci_flota',
      type: 'process',
      data: { label: 'Flota de camiones y plantas de destino' },
    },
    {
      id: 'ci_asig',
      type: 'process',
      data: { label: 'Vincular bodegas a cada codeCuenta' },
    },
    {
      id: 'ci_check',
      type: 'decision',
      data: { label: '¿Checklist de configuración completo?' },
    },
    {
      id: 'ci_wizard',
      type: 'process',
      data: { label: 'Mejora V2: wizard de onboarding guiado paso a paso' },
    },
    {
      id: 'ci_ok',
      type: 'success',
      data: { label: 'Operación habilitada para la bodega' },
    },
  ],
  edges: [
    e('ci_e0', 'ci_hdr', 'ci_bod'),
    e('ci_e1', 'ci_bod', 'ci_cta'),
    e('ci_e2', 'ci_cta', 'ci_usr'),
    e('ci_e3', 'ci_usr', 'ci_cat'),
    e('ci_e4', 'ci_cat', 'ci_prov'),
    e('ci_e5', 'ci_prov', 'ci_flota'),
    e('ci_e6', 'ci_flota', 'ci_asig'),
    e('ci_e7', 'ci_asig', 'ci_check'),
    e('ci_e8s', 'ci_check', 'ci_wizard', { sourceHandle: 'yes', label: 'S' }),
    e('ci_e8n', 'ci_check', 'ci_bod', { sourceHandle: 'no', label: 'N', ...L }),
    e('ci_e9', 'ci_wizard', 'ci_ok'),
  ],
}

/** 6.2 Autenticación y bootstrap */
const sub_doc_auth = {
  id: 'sub_doc_auth',
  title: '6.2 — Autenticación y bootstrap',
  tabShort: '6.2 Auth',
  nodes: [
    { id: 'au_app', type: 'process', data: { label: 'Abrir aplicación' } },
    { id: 'au_ses', type: 'decision', data: { label: '¿Sesión activa?' } },
    { id: 'au_login', type: 'process', data: { label: 'Pantalla de login (Supabase Auth)' } },
    { id: 'au_val', type: 'decision', data: { label: '¿Credenciales válidas?' } },
    { id: 'au_err', type: 'error', data: { label: 'Error / reintento de login' } },
    {
      id: 'au_per',
      type: 'process',
      data: { label: 'Cargar perfil: rol, nombre, cuenta, permisos (Supabase (PostgreSQL))' },
    },
    { id: 'au_bod', type: 'decision', data: { label: '¿Bodega interna?' } },
    {
      id: 'au_sub',
      type: 'process',
      data: { label: 'Suscribir estado: warehouses/{id}/state/main (tiempo real)' },
    },
    {
      id: 'au_fri',
      type: 'process',
      data: { label: 'Bodega externa: consultar inventario Fridem (Realtime DB)' },
    },
    {
      id: 'au_dash',
      type: 'success',
      data: { label: 'Renderizar dashboard según rol' },
    },
  ],
  edges: [
    e('au_0', 'au_app', 'au_ses'),
    e('au_1n', 'au_ses', 'au_login', { sourceHandle: 'no', label: 'N' }),
    e('au_1s', 'au_ses', 'au_per', { sourceHandle: 'yes', label: 'S' }),
    e('au_2', 'au_login', 'au_val'),
    e('au_3n', 'au_val', 'au_err', { sourceHandle: 'no', label: 'N' }),
    e('au_3s', 'au_val', 'au_per', { sourceHandle: 'yes', label: 'S' }),
    e('au_re', 'au_err', 'au_login', { ...L }),
    e('au_4', 'au_per', 'au_bod'),
    e('au_5s', 'au_bod', 'au_sub', { sourceHandle: 'yes', label: 'S' }),
    e('au_5n', 'au_bod', 'au_fri', { sourceHandle: 'no', label: 'N' }),
    e('au_6', 'au_sub', 'au_dash'),
    e('au_7', 'au_fri', 'au_dash'),
  ],
}

/** 6.3 Gestión de proveedores y OC */
const sub_doc_oc = {
  id: 'sub_doc_oc',
  title: '6.3 — Órdenes de compra y proveedor',
  tabShort: '6.3 OC',
  nodes: [
    {
      id: 'oc_hdr',
      type: 'header',
      data: { label: 'Orden de compra (campos y estados)' },
    },
    {
      id: 'oc_cam',
      type: 'process',
      data: {
        label: 'Campos: proveedor, líneas SKU/cantidad/unidad/precio, fecha estimada, bodega destino',
      },
    },
    { id: 'oc_pend', type: 'process', data: { label: 'Estado: Pendiente' } },
    { id: 'oc_trans', type: 'process', data: { label: 'Estado: En tránsito' } },
    { id: 'oc_rec', type: 'process', data: { label: 'Estado: Recibida' } },
    { id: 'oc_cerr', type: 'process', data: { label: 'Estado: Cerrada' } },
    {
      id: 'oc_n8n',
      type: 'process',
      data: { label: 'Disparo POST /api/pedido-proveedor → webhook n8n (pedido al proveedor)' },
    },
    { id: 'oc_fin', type: 'success', data: { label: 'OC integrada al flujo de ingreso' } },
  ],
  edges: [
    e('oc_0', 'oc_hdr', 'oc_cam'),
    e('oc_1', 'oc_cam', 'oc_pend'),
    e('oc_2', 'oc_pend', 'oc_trans'),
    e('oc_3', 'oc_trans', 'oc_rec'),
    e('oc_4', 'oc_rec', 'oc_cerr'),
    e('oc_5', 'oc_pend', 'oc_n8n'),
    e('oc_6', 'oc_cerr', 'oc_fin'),
  ],
}

/** 6.4 Ingreso de mercancía (custodio) */
const sub_doc_ingreso = {
  id: 'sub_doc_ingreso',
  title: '6.4 — Ingreso de mercancía',
  tabShort: '6.4 Ingreso',
  nodes: [
    { id: 'in_hdr', type: 'header', data: { label: 'Custodio — recepción física' } },
    { id: 'in_lleg', type: 'process', data: { label: 'Llegada de mercancía a la bodega' } },
    {
      id: 'in_val',
      type: 'decision',
      data: { label: '¿Validación contra OC o ingreso manual libre?' },
    },
    { id: 'in_oc', type: 'process', data: { label: 'Conciliar líneas y kg frente a OC' } },
    { id: 'in_man', type: 'process', data: { label: 'Registro manual sin OC previa' } },
    {
      id: 'in_slot',
      type: 'process',
      data: { label: 'Asignar slot en zona de ingresos (inboundBoxes)' },
    },
    {
      id: 'in_traz',
      type: 'process',
      data: { label: 'Trazabilidad: producto, cliente, kg, fecha, temperatura objetivo' },
    },
    {
      id: 'in_ot',
      type: 'process',
      data: { label: 'Crear orden de trabajo: a_bodega / a_salida / revisar' },
    },
    {
      id: 'in_cierre',
      type: 'process',
      data: { label: 'Cierre de recepción (OrdenCompraService.cerrarRecepción)' },
    },
    {
      id: 'in_mej',
      type: 'process',
      data: { label: 'Mejora V2: QR/barras + alerta si temperatura de ingreso fuera de rango' },
    },
    { id: 'in_ok', type: 'success', data: { label: 'Mercancía registrada; pendiente ubicar en mapa' } },
  ],
  edges: [
    e('in_0', 'in_hdr', 'in_lleg'),
    e('in_1', 'in_lleg', 'in_val'),
    e('in_2o', 'in_val', 'in_oc', { label: 'OC', sourceHandle: 'yes' }),
    e('in_2m', 'in_val', 'in_man', { label: 'Manual', sourceHandle: 'no' }),
    e('in_3o', 'in_oc', 'in_slot'),
    e('in_3m', 'in_man', 'in_slot'),
    e('in_4', 'in_slot', 'in_traz'),
    e('in_5', 'in_traz', 'in_ot'),
    e('in_6', 'in_ot', 'in_cierre'),
    e('in_7', 'in_cierre', 'in_mej'),
    e('in_8', 'in_mej', 'in_ok'),
  ],
}

/** 6.5 Cola operativa y mapa de slots */
const sub_doc_cola_mapa = {
  id: 'sub_doc_cola_mapa',
  title: '6.5 — Cola operativa y mapa',
  tabShort: '6.5 Mapa',
  nodes: [
    { id: 'cm_hdr', type: 'header', data: { label: 'Estados de slot y órdenes de trabajo' } },
    { id: 'cm_lib', type: 'process', data: { label: 'Slot libre' } },
    { id: 'cm_ocu', type: 'process', data: { label: 'Slot ocupado' } },
    { id: 'cm_res', type: 'process', data: { label: 'Slot reservado (salida)' } },
    { id: 'cm_pro', type: 'process', data: { label: 'Slot en_procesamiento' } },
    {
      id: 'cm_jefe',
      type: 'process',
      data: { label: 'Jefe / custodio crea y prioriza órdenes de trabajo internas' },
    },
    { id: 'cm_cola', type: 'process', data: { label: 'Cola visible para operario / procesador' } },
    { id: 'cm_tom', type: 'process', data: { label: 'Operario toma OT de la cola' } },
    {
      id: 'cm_mov',
      type: 'process',
      data: { label: 'Ejecuta traslado (entrada → mapa o mapa → zona salida)' },
    },
    {
      id: 'cm_lock',
      type: 'process',
      data: { label: 'V2: locking en tiempo real para evitar doble asignación de slot' },
    },
    {
      id: 'cm_map',
      type: 'process',
      data: { label: 'Mejora V2: mapa interactivo — clic en slot destino para confirmar' },
    },
    { id: 'cm_ok', type: 'success', data: { label: 'Movimiento reflejado en Supabase (PostgreSQL) state/main' } },
  ],
  edges: [
    e('cm_0', 'cm_hdr', 'cm_jefe'),
    e('cm_4', 'cm_jefe', 'cm_cola'),
    e('cm_5', 'cm_cola', 'cm_tom'),
    e('cm_6', 'cm_tom', 'cm_mov'),
    e('cm_7', 'cm_mov', 'cm_lock'),
    e('cm_8', 'cm_lock', 'cm_map'),
    e('cm_9', 'cm_map', 'cm_ok'),
    e('cm_ref', 'cm_hdr', 'cm_lib'),
    e('cm_ref2', 'cm_hdr', 'cm_ocu'),
    e('cm_ref3', 'cm_hdr', 'cm_res'),
    e('cm_ref4', 'cm_hdr', 'cm_pro'),
  ],
}

/** 6.6 Procesamiento primario/secundario y balance */
const sub_doc_procesamiento = {
  id: 'sub_doc_procesamiento',
  title: '6.6 — Procesamiento y balance de masa',
  tabShort: '6.6 Proceso',
  nodes: [
    { id: 'pr_hdr', type: 'header', data: { label: 'Transformación en bodega' } },
    {
      id: 'pr_sol',
      type: 'process',
      data: { label: 'OperadorCuentas: solicitud de procesamiento' },
    },
    {
      id: 'pr_asig',
      type: 'process',
      data: { label: 'Jefe asigna operario o procesador a la tarea' },
    },
    {
      id: 'pr_cur',
      type: 'process',
      data: { label: 'En curso: descuento kg del primario en el mapa' },
    },
    {
      id: 'pr_sec',
      type: 'process',
      data: { label: 'Registrar secundario / coproducto según balance V2' },
    },
    { id: 'pr_bal', type: 'decision', data: { label: '¿Balance de masa cuadra (inicial vs salidas)?' } },
    {
      id: 'pr_mer',
      type: 'process',
      data: { label: 'Declarar merma (kg acumulados en historial — no vuelven al mapa)' },
    },
    {
      id: 'pr_sob',
      type: 'process',
      data: { label: 'Sobrante reintegrable a inventario cuando aplica' },
    },
    {
      id: 'pr_fn',
      type: 'process',
      data: { label: 'recordMermaProcesamientoKg() y persistencia en Supabase (PostgreSQL)' },
    },
    { id: 'pr_blk', type: 'error', data: { label: 'Revisión de auditoría si el balance no cierra' } },
    { id: 'pr_ok', type: 'success', data: { label: 'Procesamiento cerrado correctamente' } },
  ],
  edges: [
    e('pr_0', 'pr_hdr', 'pr_sol'),
    e('pr_1', 'pr_sol', 'pr_asig'),
    e('pr_2', 'pr_asig', 'pr_cur'),
    e('pr_3', 'pr_cur', 'pr_sec'),
    e('pr_4', 'pr_sec', 'pr_bal'),
    e('pr_5y', 'pr_bal', 'pr_fn', { sourceHandle: 'yes', label: 'S' }),
    e('pr_5n', 'pr_bal', 'pr_mer', { sourceHandle: 'no', label: 'N' }),
    e('pr_6', 'pr_mer', 'pr_sob'),
    e('pr_7', 'pr_sob', 'pr_fn'),
    e('pr_8', 'pr_fn', 'pr_ok'),
    e('pr_blk_e', 'pr_mer', 'pr_blk', { ...L }),
  ],
}

/** 6.8 Transporte y evidencia */
const sub_doc_transporte = {
  id: 'sub_doc_transporte',
  title: '6.8 — Transporte y evidencia',
  tabShort: '6.8 Transp.',
  nodes: [
    { id: 'tr_hdr', type: 'header', data: { label: 'Rol transporte — viajes TV-####' } },
    {
      id: 'tr_list',
      type: 'process',
      data: { label: 'Listado de viajes en curso (numeración TV-####)' },
    },
    { id: 'tr_det', type: 'process', data: { label: 'Detalle por venta / entrega' } },
    {
      id: 'tr_reg',
      type: 'process',
      data: { label: 'Registrar: cantidades, conformidad, incidencia' },
    },
    {
      id: 'tr_foto',
      type: 'process',
      data: { label: 'Foto evidencia → POST /api/evidencia-transporte → Cloudinary' },
    },
    {
      id: 'tr_gps',
      type: 'process',
      data: { label: 'V2: firma digital + evidencia GPS en cierre' },
    },
    {
      id: 'tr_peso',
      type: 'process',
      data: { label: 'V2: salida cruzada — validar peso camión vs picking' },
    },
    { id: 'tr_dec', type: 'decision', data: { label: '¿Cierre sin incidencias?' } },
    { id: 'tr_ok', type: 'success', data: { label: 'Venta Cerrado (OK)' } },
    { id: 'tr_no', type: 'error', data: { label: 'Venta Cerrado (no OK)' } },
  ],
  edges: [
    e('tr_0', 'tr_hdr', 'tr_list'),
    e('tr_1', 'tr_list', 'tr_det'),
    e('tr_2', 'tr_det', 'tr_reg'),
    e('tr_3', 'tr_reg', 'tr_foto'),
    e('tr_4', 'tr_foto', 'tr_gps'),
    e('tr_5', 'tr_gps', 'tr_peso'),
    e('tr_6', 'tr_peso', 'tr_dec'),
    e('tr_7s', 'tr_dec', 'tr_ok', { sourceHandle: 'yes', label: 'S' }),
    e('tr_7n', 'tr_dec', 'tr_no', { sourceHandle: 'no', label: 'N' }),
  ],
}

/** 6.9 Alertas operativas */
const sub_doc_alertas = {
  id: 'sub_doc_alertas',
  title: '6.9 — Alertas operativas',
  tabShort: '6.9 Alertas',
  nodes: [
    { id: 'al_hdr', type: 'header', data: { label: 'Temperatura y colas' } },
    { id: 'al_sen', type: 'process', data: { label: 'Lectura sensor por slot / zona' } },
    { id: 'al_um', type: 'decision', data: { label: '¿Supera umbral o tiempo máximo en cola?' } },
    { id: 'al_nac', type: 'process', data: { label: 'Se genera alerta en estado operativo' } },
    { id: 'al_asig', type: 'process', data: { label: 'Jefe asigna responsable o prioridad' } },
    {
      id: 'al_op',
      type: 'process',
      data: { label: 'Operario atiende; registro de llamada al jefe si aplica' },
    },
    { id: 'al_cie', type: 'process', data: { label: 'Cerrar alerta con motivo documentado' } },
    {
      id: 'al_hist',
      type: 'process',
      data: { label: 'Historial separado para auditoría y reportes' },
    },
    { id: 'al_fcm', type: 'process', data: { label: 'Opcional: FCM push a operarios (doc stack)' } },
    { id: 'al_ok', type: 'success', data: { label: 'Alerta resuelta' } },
  ],
  edges: [
    e('al_0', 'al_hdr', 'al_sen'),
    e('al_1', 'al_sen', 'al_um'),
    e('al_2n', 'al_um', 'al_sen', { sourceHandle: 'no', label: 'N', ...L }),
    e('al_2s', 'al_um', 'al_nac', { sourceHandle: 'yes', label: 'S' }),
    e('al_3', 'al_nac', 'al_asig'),
    e('al_4', 'al_asig', 'al_op'),
    e('al_5', 'al_op', 'al_cie'),
    e('al_6', 'al_cie', 'al_hist'),
    e('al_7', 'al_hist', 'al_fcm'),
    e('al_8', 'al_fcm', 'al_ok'),
  ],
}

/** 6.10 Reportería (resumen doc) */
const sub_doc_reporteria = {
  id: 'sub_doc_reporteria',
  title: '6.10 — Reportería y estadísticas',
  tabShort: '6.10 KPIs',
  nodes: [
    { id: 'rp_hdr', type: 'header', data: { label: 'Reportería operativa' } },
    {
      id: 'rp_act',
      type: 'process',
      data: { label: 'Actividades, despachos, mapa (vistas admin en general lectura)' },
    },
    {
      id: 'rp_acu',
      type: 'process',
      data: { label: 'Acumulados: ej. kg totales de merma de procesamiento' },
    },
    { id: 'rp_chart', type: 'process', data: { label: 'Recharts en dashboard (gráficas)' } },
    { id: 'rp_pdf', type: 'process', data: { label: 'Exportación PDF (html2canvas + jsPDF)' } },
    { id: 'rp_xlsx', type: 'process', data: { label: 'Import/export xlsx catálogo' } },
    { id: 'rp_ok', type: 'success', data: { label: 'Datos listos para decisiones de negocio' } },
  ],
  edges: [
    e('rp_0', 'rp_hdr', 'rp_act'),
    e('rp_1', 'rp_act', 'rp_acu'),
    e('rp_2', 'rp_acu', 'rp_chart'),
    e('rp_3', 'rp_chart', 'rp_pdf'),
    e('rp_4', 'rp_pdf', 'rp_xlsx'),
    e('rp_5', 'rp_xlsx', 'rp_ok'),
  ],
}

/** Integraciones (doc 3 + 9) */
const sub_doc_integraciones = {
  id: 'sub_doc_integraciones',
  title: 'Integraciones — Fridem, n8n, Cloudinary',
  tabShort: 'Integrac.',
  nodes: [
    { id: 'it_hdr', type: 'header', data: { label: 'Servicios externos y API internas' } },
    {
      id: 'it_merge',
      type: 'process',
      data: { label: 'saveWarehouseState(): merge Supabase (PostgreSQL) (concurrencia entre usuarios)' },
    },
    {
      id: 'it_n8n',
      type: 'process',
      data: { label: 'POST /api/pedido-proveedor → validación → webhook n8n (pedido a proveedor)' },
    },
    {
      id: 'it_cld',
      type: 'process',
      data: { label: 'POST /api/evidencia-transporte: multipart → Cloudinary (firma o preset)' },
    },
    {
      id: 'it_fri',
      type: 'process',
      data: { label: 'Fridem: lib/fridemClient — inventario bodega externa solo lectura' },
    },
    {
      id: 'it_nest',
      type: 'process',
      data: { label: 'NestJS (doc V2): módulos ingreso, inventario, guards por rol' },
    },
    { id: 'it_ok', type: 'success', data: { label: 'Contratos documentados en OpenAPI/Swagger' } },
  ],
  edges: [
    e('it_0', 'it_hdr', 'it_merge'),
    e('it_1', 'it_merge', 'it_n8n'),
    e('it_2', 'it_n8n', 'it_cld'),
    e('it_3', 'it_cld', 'it_fri'),
    e('it_4', 'it_fri', 'it_nest'),
    e('it_5', 'it_nest', 'it_ok'),
  ],
}

/** Hilo de negocio doc v1 (compra → entrega) — referencia rápida */
const sub_doc_hilo_negocio = {
  id: 'sub_doc_hilo_negocio',
  title: 'Hilo — Compra → bodega → venta (9 etapas)',
  tabShort: 'Hilo negocio',
  nodes: [
    { id: 'hn_hdr', type: 'header', data: { label: 'Ciclo de vida mercancía refrigerada' } },
    { id: 'hn_1', type: 'process', data: { label: '1 Comprar — OC con líneas y kg' } },
    { id: 'hn_2', type: 'process', data: { label: '2 Entrar a bodega — recepción física vs OC' } },
    { id: 'hn_3', type: 'process', data: { label: '3 Registrar ingreso — cajas en zona entrada' } },
    { id: 'hn_4', type: 'process', data: { label: '4 Ubicar en mapa — OT entrada hacia casillero' } },
    { id: 'hn_5', type: 'process', data: { label: '5 Permanencia — temp por slot y alertas' } },
    { id: 'hn_6', type: 'process', data: { label: '6 Transformar (opcional) — solicitud procesamiento' } },
    { id: 'hn_7', type: 'process', data: { label: '7 Vender — OV y despacho' } },
    { id: 'hn_8', type: 'process', data: { label: '8 Salida física — OT hacia zona salida' } },
    { id: 'hn_9', type: 'process', data: { label: '9 Entrega — viaje, evidencia, cierre OK/no OK' } },
    { id: 'hn_ok', type: 'success', data: { label: 'Trazabilidad completa del lote' } },
  ],
  edges: [
    e('hn_0', 'hn_hdr', 'hn_1'),
    e('hn_a', 'hn_1', 'hn_2'),
    e('hn_b', 'hn_2', 'hn_3'),
    e('hn_c', 'hn_3', 'hn_4'),
    e('hn_d', 'hn_4', 'hn_5'),
    e('hn_e', 'hn_5', 'hn_6'),
    e('hn_f', 'hn_6', 'hn_7'),
    e('hn_g', 'hn_7', 'hn_8'),
    e('hn_h', 'hn_8', 'hn_9'),
    e('hn_i', 'hn_9', 'hn_ok'),
  ],
}

export const docSubFlows = {
  sub_doc_config_inicial,
  sub_doc_auth,
  sub_doc_oc,
  sub_doc_ingreso,
  sub_doc_cola_mapa,
  sub_doc_procesamiento,
  sub_doc_transporte,
  sub_doc_alertas,
  sub_doc_reporteria,
  sub_doc_integraciones,
  sub_doc_hilo_negocio,
}

/** Orden de pestañas en la UI (después de `main` y antes del diagrama macro tenant). */
export const docSubFlowKeys = [
  'sub_doc_hilo_negocio',
  'sub_doc_config_inicial',
  'sub_doc_auth',
  'sub_doc_oc',
  'sub_doc_ingreso',
  'sub_doc_cola_mapa',
  'sub_doc_procesamiento',
  'sub_doc_transporte',
  'sub_doc_alertas',
  'sub_doc_reporteria',
  'sub_doc_integraciones',
]
