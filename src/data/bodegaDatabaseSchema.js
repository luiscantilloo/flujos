/**
 * Modelo lógico normalizado (3NF) de Bodega de Frío.
 * Mapea a PostgreSQL en Supabase; el estado operativo en vivo usa jsonb + Realtime.
 */

export const SCHEMA_META = {
  title: 'Modelo de datos — Bodega de Frío',
  subtitle: 'Esquema relacional normalizado y su correspondencia en Supabase (PostgreSQL)',
  version: '2.0',
  engine: 'Supabase PostgreSQL',
  normalization: '3NF lógico',
  notes: [
    'Las entidades maestras viven en tablas public.* con RLS por code_cuenta; el inventario en tiempo real en warehouse_state (jsonb) + canal Realtime.',
    'Las líneas de OC/OV son tablas hijas (oc_lineas, ov_lineas); el modelo lógico las separa siempre (1NF).',
    'codeCuenta es la clave de partición multi-tenant: toda FK de negocio debe filtrar por cuenta (políticas RLS).',
    'auth.users y public.usuarios conviven por legacy (ADR-005); el modelo propone unificación futura.',
  ],
}

export const SCHEMA_DOMAINS = [
  { id: 'tenant', label: 'Multi-tenant y acceso', color: 'violet' },
  { id: 'catalog', label: 'Catálogos maestros', color: 'sky' },
  { id: 'purchase', label: 'Compras', color: 'emerald' },
  { id: 'sales', label: 'Ventas y transporte', color: 'amber' },
  { id: 'warehouse', label: 'Inventario operativo', color: 'cyan' },
  { id: 'processing', label: 'Procesamiento', color: 'fuchsia' },
  { id: 'system', label: 'Sistema y auditoría', color: 'slate' },
]

/** @typedef {{ name: string, type: string, pk?: boolean, fk?: string, unique?: boolean, nullable?: boolean, desc?: string }} SchemaField */

export const ENTITIES = [
  {
    id: 'cuenta_operativa',
    domain: 'tenant',
    name: 'Cuenta operativa',
    table: 'cuenta_operativa',
    physical: 'public.tenant_config (code_cuenta PK, RLS)',
    desc: 'Límite de aislamiento multi-tenant. Agrupa catálogo, órdenes y bodegas de un cliente comercial.',
    fields: [
      { name: 'codeCuenta', type: 'string', pk: true, desc: 'Código alfanumérico único (namespace)' },
      { name: 'nombre', type: 'string', desc: 'Nombre comercial' },
      { name: 'activa', type: 'boolean', desc: 'Cuenta habilitada para operar' },
      { name: 'createdAt', type: 'timestamp' },
    ],
    indexes: ['UNIQUE(codeCuenta)'],
  },
  {
    id: 'cliente',
    domain: 'tenant',
    name: 'Cliente comercial',
    table: 'cliente',
    physical: 'public.clientes',
    desc: 'Organización dueña de catálogo y órdenes dentro de una cuenta.',
    fields: [
      { name: 'clientId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta', desc: 'Tenant' },
      { name: 'nombre', type: 'string' },
      { name: 'nit', type: 'string', nullable: true },
    ],
    relations: [{ card: 'N', entity: 'cuenta_operativa', label: 'pertenece a' }],
    indexes: ['INDEX(codeCuenta)'],
  },
  {
    id: 'bodega',
    domain: 'tenant',
    name: 'Bodega',
    table: 'bodega',
    physical: 'public.bodegas',
    desc: 'Ubicación física (interna o referencia externa Fridem).',
    fields: [
      { name: 'warehouseId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta', nullable: true },
      { name: 'nombre', type: 'string' },
      { name: 'tipo', type: 'enum', desc: 'interna | externa' },
      { name: 'capacity', type: 'int', desc: 'Casilleros del mapa (default 12)' },
      { name: 'activa', type: 'boolean' },
    ],
    relations: [
      { card: 'N', entity: 'cuenta_operativa', label: 'asignada a' },
      { card: '1', entity: 'estado_bodega', label: 'tiene estado vivo' },
    ],
  },
  {
    id: 'usuario_operativo',
    domain: 'tenant',
    name: 'Usuario operativo',
    table: 'usuario_operativo',
    physical: 'public.usuarios',
    desc: 'Perfil de negocio: rol, cuenta y bodegas visibles.',
    fields: [
      { name: 'uid', type: 'string', pk: true, desc: 'Igual a Supabase Auth UID (auth.users)' },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta', nullable: true },
      { name: 'rol', type: 'enum', desc: 'administrador, custodio, operario, procesador, jefe, cliente, configurador, operadorCuentas, transporte' },
      { name: 'nombre', type: 'string' },
      { name: 'email', type: 'string', unique: true },
      { name: 'warehouseIds', type: 'string[]', nullable: true },
    ],
    relations: [{ card: '1', entity: 'usuario_auth', label: 'vinculado a' }],
    indexes: ['INDEX(codeCuenta, rol)', 'UNIQUE(email)'],
  },
  {
    id: 'usuario_auth',
    domain: 'tenant',
    name: 'Usuario Auth (legacy)',
    table: 'usuario_auth',
    physical: 'auth.users',
    desc: 'Espejo del perfil Auth; pendiente unificar con usuarios.',
    fields: [
      { name: 'uid', type: 'string', pk: true },
      { name: 'displayName', type: 'string', nullable: true },
      { name: 'email', type: 'string' },
    ],
    relations: [{ card: '1', entity: 'usuario_operativo', label: 'duplicado en' }],
  },
  {
    id: 'producto',
    domain: 'catalog',
    name: 'Producto (catálogo)',
    table: 'producto',
    physical: 'public.productos',
    desc: 'SKU primario/secundario por cliente comercial.',
    fields: [
      { name: 'productoId', type: 'string', pk: true },
      { name: 'clientId', type: 'string', fk: 'cliente.clientId' },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'sku', type: 'string' },
      { name: 'titulo', type: 'string' },
      { name: 'isPrimario', type: 'boolean' },
      { name: 'isSecundario', type: 'boolean' },
      { name: 'unidad', type: 'string', desc: 'kg, caja, etc.' },
    ],
    indexes: ['UNIQUE(clientId, sku)', 'INDEX(codeCuenta, isPrimario)'],
  },
  {
    id: 'proveedor',
    domain: 'catalog',
    name: 'Proveedor',
    table: 'proveedor',
    physical: 'public.proveedores',
    desc: 'Proveedor de insumos para órdenes de compra.',
    fields: [
      { name: 'proveedorId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'proveedorCode', type: 'string', unique: true },
      { name: 'nombre', type: 'string' },
      { name: 'telefono', type: 'string', nullable: true },
    ],
    indexes: ['UNIQUE(codeCuenta, proveedorCode)'],
  },
  {
    id: 'comprador',
    domain: 'catalog',
    name: 'Comprador',
    table: 'comprador',
    physical: 'public.compradores',
    fields: [
      { name: 'compradorId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'nombre', type: 'string' },
      { name: 'contacto', type: 'string', nullable: true },
    ],
  },
  {
    id: 'planta',
    domain: 'catalog',
    name: 'Planta destino',
    table: 'planta',
    physical: 'public.plantas',
    fields: [
      { name: 'plantaId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'nombre', type: 'string' },
      { name: 'direccion', type: 'string', nullable: true },
    ],
  },
  {
    id: 'camion',
    domain: 'catalog',
    name: 'Camión (flota)',
    table: 'camion',
    physical: 'public.camiones',
    fields: [
      { name: 'camionId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'placa', type: 'string', unique: true },
      { name: 'capacidadKg', type: 'decimal', nullable: true },
    ],
  },
  {
    id: 'orden_compra',
    domain: 'purchase',
    name: 'Orden de compra (OC)',
    table: 'orden_compra',
    physical: 'public.ordenes_compra',
    desc: 'Pedido a proveedor. Prefijo OC-####.',
    fields: [
      { name: 'ocId', type: 'string', pk: true },
      { name: 'numero', type: 'string', unique: true, desc: 'OC-####' },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'proveedorId', type: 'string', fk: 'proveedor.proveedorId' },
      { name: 'warehouseId', type: 'string', fk: 'bodega.warehouseId' },
      { name: 'estado', type: 'enum', desc: 'Iniciado → En recepción → Cerrado' },
      { name: 'fechaEntregaEstimada', type: 'timestamp', nullable: true },
    ],
    relations: [
      { card: '1', entity: 'linea_oc', label: 'contiene' },
      { card: 'N', entity: 'proveedor', label: 'hacia' },
    ],
    indexes: ['INDEX(codeCuenta, estado)', 'INDEX(proveedorId)'],
  },
  {
    id: 'linea_oc',
    domain: 'purchase',
    name: 'Línea OC',
    table: 'linea_oc',
    physical: 'public.oc_lineas',
    fields: [
      { name: 'ocId', type: 'string', pk: true, fk: 'orden_compra.ocId' },
      { name: 'lineaId', type: 'string', pk: true },
      { name: 'productoId', type: 'string', fk: 'producto.productoId' },
      { name: 'pesoKgPedido', type: 'decimal' },
      { name: 'pesoKgRecibido', type: 'decimal', nullable: true },
      { name: 'codeSnapshot', type: 'string', desc: 'Desnormalizado para auditoría' },
    ],
    indexes: ['PRIMARY(ocId, lineaId)'],
  },
  {
    id: 'solicitud_compra',
    domain: 'purchase',
    name: 'Solicitud de compra (SOL)',
    table: 'solicitud_compra',
    physical: 'public.solicitudes_compra',
    desc: 'Pre-OC. Prefijo SOL-####.',
    fields: [
      { name: 'solId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'estado', type: 'enum' },
      { name: 'ocId', type: 'string', fk: 'orden_compra.ocId', nullable: true },
    ],
  },
  {
    id: 'orden_venta',
    domain: 'sales',
    name: 'Orden de venta (OV)',
    table: 'orden_venta',
    physical: 'public.ordenes_venta',
    desc: 'Compromiso de entrega. Prefijo VE-####.',
    fields: [
      { name: 'ovId', type: 'string', pk: true },
      { name: 'numero', type: 'string', unique: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'compradorId', type: 'string', fk: 'comprador.compradorId' },
      { name: 'warehouseOrigenId', type: 'string', fk: 'bodega.warehouseId', nullable: true },
      { name: 'estado', type: 'enum', desc: 'Borrador → Confirmada → En preparación → En transporte → Cerrado' },
    ],
    relations: [
      { card: '1', entity: 'linea_ov', label: 'contiene' },
      { card: '0..1', entity: 'viaje_transporte', label: 'despacha con' },
    ],
  },
  {
    id: 'linea_ov',
    domain: 'sales',
    name: 'Línea OV',
    table: 'linea_ov',
    physical: 'public.ov_lineas',
    fields: [
      { name: 'ovId', type: 'string', pk: true, fk: 'orden_venta.ovId' },
      { name: 'lineaId', type: 'string', pk: true },
      { name: 'productoId', type: 'string', fk: 'producto.productoId' },
      { name: 'cantidadKg', type: 'decimal' },
    ],
    indexes: ['PRIMARY(ovId, lineaId)'],
  },
  {
    id: 'viaje_transporte',
    domain: 'sales',
    name: 'Viaje de transporte (TV)',
    table: 'viaje_transporte',
    physical: 'public.viajes_transporte',
    desc: 'Agrupa entregas de un despacho. Prefijo TV-#### desde systemCounters.',
    fields: [
      { name: 'viajeId', type: 'string', pk: true },
      { name: 'numero', type: 'string', unique: true, desc: 'TV-####' },
      { name: 'ovId', type: 'string', fk: 'orden_venta.ovId' },
      { name: 'camionId', type: 'string', fk: 'camion.camionId', nullable: true },
      { name: 'conductorUid', type: 'string', fk: 'usuario_operativo.uid', nullable: true },
      { name: 'estado', type: 'enum', desc: 'En curso | Cerrado(ok) | Cerrado(no ok)' },
    ],
    relations: [{ card: '1', entity: 'evidencia_entrega', label: 'registra' }],
  },
  {
    id: 'evidencia_entrega',
    domain: 'sales',
    name: 'Evidencia de entrega',
    table: 'evidencia_entrega',
    physical: 'Campo en viaje / línea (URL Cloudinary)',
    fields: [
      { name: 'evidenciaId', type: 'string', pk: true },
      { name: 'viajeId', type: 'string', fk: 'viaje_transporte.viajeId' },
      { name: 'lineaId', type: 'string', nullable: true },
      { name: 'fotoUrl', type: 'string' },
      { name: 'firmaUrl', type: 'string', nullable: true },
      { name: 'cantidadEntregadaKg', type: 'decimal' },
      { name: 'incidencia', type: 'string', nullable: true },
    ],
  },
  {
    id: 'estado_bodega',
    domain: 'warehouse',
    name: 'Estado operativo (documento)',
    table: 'estado_bodega',
    physical: 'public.warehouse_state (jsonb: slots, cajas, orders, alerts)',
    desc: 'Documento único por bodega; agregado en tiempo real (desnormalizado físicamente).',
    fields: [
      { name: 'warehouseId', type: 'string', pk: true, fk: 'bodega.warehouseId' },
      { name: 'updatedAt', type: 'timestamp' },
    ],
    relations: [
      { card: '1', entity: 'slot', label: 'agrega slots' },
      { card: '1', entity: 'caja', label: 'colas inbound/outbound' },
      { card: '1', entity: 'orden_trabajo', label: 'órdenes activas' },
    ],
  },
  {
    id: 'slot',
    domain: 'warehouse',
    name: 'Slot (casillero)',
    table: 'slot',
    physical: 'public.slots o warehouse_state.slots (jsonb)',
    desc: 'Posición en mapa. En modelo normalizado: tabla hija de estado_bodega.',
    fields: [
      { name: 'warehouseId', type: 'string', pk: true, fk: 'estado_bodega.warehouseId' },
      { name: 'slotId', type: 'string', pk: true },
      { name: 'estado', type: 'enum', desc: 'libre | ocupado | reservado | en_proceso' },
      { name: 'temperaturaC', type: 'decimal', nullable: true },
      { name: 'cajaId', type: 'string', fk: 'caja.cajaId', nullable: true },
    ],
    indexes: ['PRIMARY(warehouseId, slotId)', 'INDEX(warehouseId, estado)'],
  },
  {
    id: 'caja',
    domain: 'warehouse',
    name: 'Caja / lote (BoxRecord)',
    table: 'caja',
    physical: 'public.cajas (zona: entrada | salida | despachado | mapa)',
    fields: [
      { name: 'cajaId', type: 'string', pk: true },
      { name: 'warehouseId', type: 'string', fk: 'bodega.warehouseId' },
      { name: 'zona', type: 'enum', desc: 'entrada | salida | despachado | mapa' },
      { name: 'productoId', type: 'string', fk: 'producto.productoId' },
      { name: 'clientId', type: 'string', fk: 'cliente.clientId' },
      { name: 'pesoKg', type: 'decimal' },
      { name: 'temperaturaObjetivoC', type: 'decimal', nullable: true },
      { name: 'ocId', type: 'string', fk: 'orden_compra.ocId', nullable: true },
      { name: 'ovId', type: 'string', fk: 'orden_venta.ovId', nullable: true },
    ],
    indexes: ['INDEX(warehouseId, zona)', 'INDEX(ocId)', 'INDEX(ovId)'],
  },
  {
    id: 'orden_trabajo',
    domain: 'warehouse',
    name: 'Orden de trabajo',
    table: 'orden_trabajo',
    physical: 'public.ordenes_trabajo o warehouse_state.orders (jsonb)',
    fields: [
      { name: 'orderId', type: 'string', pk: true },
      { name: 'warehouseId', type: 'string', fk: 'estado_bodega.warehouseId' },
      { name: 'tipo', type: 'enum', desc: 'a_bodega | a_salida | revisar' },
      { name: 'cajaId', type: 'string', fk: 'caja.cajaId', nullable: true },
      { name: 'slotDestinoId', type: 'string', fk: 'slot.slotId', nullable: true },
      { name: 'asignadoUid', type: 'string', fk: 'usuario_operativo.uid', nullable: true },
      { name: 'estado', type: 'enum', desc: 'pendiente | en_curso | completada' },
    ],
  },
  {
    id: 'alerta',
    domain: 'warehouse',
    name: 'Alerta operativa',
    table: 'alerta',
    physical: 'public.alertas o warehouse_state.alerts (jsonb)',
    fields: [
      { name: 'alertaId', type: 'string', pk: true },
      { name: 'warehouseId', type: 'string', fk: 'estado_bodega.warehouseId' },
      { name: 'tipo', type: 'enum', desc: 'temperatura | demora | orden_reportada' },
      { name: 'slotId', type: 'string', fk: 'slot.slotId', nullable: true },
      { name: 'motivoCierre', type: 'string', nullable: true },
    ],
  },
  {
    id: 'solicitud_procesamiento',
    domain: 'processing',
    name: 'Solicitud de procesamiento',
    table: 'solicitud_procesamiento',
    physical: 'public.solicitudes_procesamiento',
    fields: [
      { name: 'solicitudId', type: 'string', pk: true },
      { name: 'codeCuenta', type: 'string', fk: 'cuenta_operativa.codeCuenta' },
      { name: 'productoPrimarioId', type: 'string', fk: 'producto.productoId' },
      { name: 'productoSecundarioId', type: 'string', fk: 'producto.productoId' },
      { name: 'estado', type: 'enum', desc: 'Pendiente → En curso → Terminado' },
      { name: 'kgPrimario', type: 'decimal' },
      { name: 'kgSecundario', type: 'decimal', nullable: true },
      { name: 'kgMerma', type: 'decimal', nullable: true },
      { name: 'operarioUid', type: 'string', fk: 'usuario_operativo.uid', nullable: true },
    ],
    relations: [{ card: '1', entity: 'registro_merma', label: 'acumula en' }],
  },
  {
    id: 'registro_merma',
    domain: 'processing',
    name: 'Registro de merma',
    table: 'registro_merma',
    physical: 'public.registro_merma (acumulado por bodega)',
    fields: [
      { name: 'registroId', type: 'string', pk: true },
      { name: 'warehouseId', type: 'string', fk: 'bodega.warehouseId' },
      { name: 'solicitudId', type: 'string', fk: 'solicitud_procesamiento.solicitudId' },
      { name: 'kgMerma', type: 'decimal' },
      { name: 'periodo', type: 'string', desc: 'YYYY-MM (propuesta V2 subcolección)' },
    ],
  },
  {
    id: 'historial_bodega',
    domain: 'warehouse',
    name: 'Historial de bodega',
    table: 'historial_bodega',
    physical: 'public.warehouse_history',
    fields: [
      { name: 'warehouseId', type: 'string', pk: true, fk: 'bodega.warehouseId' },
      { name: 'movimientoId', type: 'string', pk: true },
      { name: 'tipo', type: 'enum', desc: 'ingreso | movimiento | despacho | merma' },
      { name: 'payload', type: 'json' },
      { name: 'createdAt', type: 'timestamp' },
    ],
  },
  {
    id: 'contador_sistema',
    domain: 'system',
    name: 'Contador global',
    table: 'contador_sistema',
    physical: 'public.system_counters',
    fields: [
      { name: 'nombre', type: 'string', pk: true, desc: 'ej. viajesTransporte' },
      { name: 'valor', type: 'int' },
    ],
  },
  {
    id: 'audit_log',
    domain: 'system',
    name: 'Auditoría (propuesta V2)',
    table: 'audit_log',
    physical: 'public.audit_log (propuesto)',
    fields: [
      { name: 'eventId', type: 'string', pk: true },
      { name: 'uid', type: 'string', fk: 'usuario_operativo.uid' },
      { name: 'accion', type: 'string' },
      { name: 'entidad', type: 'string' },
      { name: 'entidadId', type: 'string' },
      { name: 'createdAt', type: 'timestamp' },
    ],
  },
]

export const NORMALIZATION_RULES = [
  {
    nf: '1NF',
    title: 'Valores atómicos',
    detail:
      'Líneas de OC/OV, entregas y slots no se guardan como listas opacas en el modelo lógico: cada línea es una fila con PK compuesta.',
  },
  {
    nf: '2NF',
    title: 'Sin dependencias parciales',
    detail:
      'Atributos del proveedor (nombre, teléfono) viven en proveedor, no en orden_compra. Snapshots (codeSnapshot) solo para auditoría histórica.',
  },
  {
    nf: '3NF',
    title: 'Sin dependencias transitivas',
    detail:
      'codeCuenta determina catálogo y usuarios; las órdenes referencian IDs de maestros, no copian cadenas de texto redundantes salvo snapshots.',
  },
]

export const SUPABASE_MAPPING = [
  { logical: 'Tablas maestras de negocio', physical: 'public.ordenes_compra, ordenes_venta, usuarios, proveedores…' },
  { logical: 'Estado en vivo (OLTP)', physical: 'public.warehouse_state — jsonb + merge vía RPC (ADR-002)' },
  { logical: 'Historial / merma', physical: 'public.warehouse_history — append y acumulados' },
  { logical: 'Tenant config (V2)', physical: 'public.tenant_config, catalogo, proveedores por code_cuenta' },
  { logical: 'Bodega externa Fridem', physical: 'Proyecto Supabase separado (solo lectura)' },
]

/** Diagrama de clases (Mermaid) — núcleo operativo */
export const CLASS_DIAGRAM = `classDiagram
    class CuentaOperativa {
        +string codeCuenta PK
        +string nombre
        +boolean activa
    }
    class Bodega {
        +string warehouseId PK
        +string codeCuenta FK
        +int capacity
        +string tipo
    }
    class EstadoBodega {
        +string warehouseId PK/FK
        +Timestamp updatedAt
        +merge() void
    }
    class Slot {
        +string slotId PK
        +string warehouseId FK
        +enum estado
        +decimal temperaturaC
    }
    class Caja {
        +string cajaId PK
        +string warehouseId FK
        +enum zona
        +decimal pesoKg
    }
    class OrdenCompra {
        +string ocId PK
        +string proveedorId FK
        +enum estado
    }
    class LineaOC {
        +string ocId PK,FK
        +string lineaId PK
        +decimal pesoKgPedido
    }
    class OrdenVenta {
        +string ovId PK
        +string compradorId FK
        +enum estado
    }
    class ViajeTransporte {
        +string viajeId PK
        +string ovId FK
        +string numero TV
    }
    class SolicitudProcesamiento {
        +string solicitudId PK
        +decimal kgMerma
        +enum estado
    }
    CuentaOperativa "1" --> "*" Bodega
    Bodega "1" --> "1" EstadoBodega
    EstadoBodega "1" --> "*" Slot
    EstadoBodega "1" --> "*" Caja
    OrdenCompra "1" --> "*" LineaOC
    OrdenCompra --> Caja : ingreso
    OrdenVenta "1" --> "0..1" ViajeTransporte
    OrdenVenta --> Caja : salida
    Slot "0..1" --> Caja`

export function getEntityById(id) {
  return ENTITIES.find((e) => e.id === id) ?? null
}

export function getEntitiesByDomain(domainId) {
  return ENTITIES.filter((e) => e.domain === domainId)
}
