/** Auto-generado — node scripts/sync-prisma-entities.mjs */
export const PRISMA_MODEL_COUNT = 40
export const PRISMA_TO_ENTITY = {
  "Rol": "rol",
  "Empresa": "empresa",
  "Cuenta": "cuenta",
  "Bodega": "bodega",
  "SolicitudAltaBodega": "solicitud_alta_bodega",
  "AsignacionBodega": "asignacion_bodega",
  "Usuario": "usuario",
  "TipoUbicacion": "tipo_ubicacion",
  "Zona": "zona",
  "Ubicacion": "ubicacion",
  "Proveedor": "proveedor",
  "Cliente": "cliente",
  "Producto": "producto",
  "Comprador": "comprador",
  "Planta": "planta",
  "Camion": "camion",
  "SolicitudCompra": "solicitud_compra",
  "SolicitudCompraLinea": "solicitud_compra_linea",
  "OrdenCompra": "orden_compra",
  "OrdenCompraLinea": "orden_compra_linea",
  "RecepcionCompra": "recepcion_compra",
  "RecepcionCompraLinea": "recepcion_compra_linea",
  "Lote": "lote",
  "WarehouseState": "warehouse_state",
  "MovimientoInventario": "movimiento_inventario",
  "Contador": "contador",
  "AuditoriaOperacion": "auditoria_operacion",
  "OrdenTrabajo": "orden_trabajo",
  "OrdenTrabajoLinea": "orden_trabajo_linea",
  "OrdenVenta": "orden_venta",
  "OrdenVentaLinea": "orden_venta_linea",
  "ViajeTransporte": "viaje_transporte",
  "GuiaEnvio": "guia_envio",
  "EvidenciaTransporte": "evidencia_transporte",
  "SolicitudProcesamiento": "solicitud_procesamiento",
  "RegistroMerma": "registro_merma",
  "AlertaOperativa": "alerta_operativa",
  "TareaCola": "tarea_cola",
  "SolicitudIntegracion": "solicitud_integracion",
  "TareaCuenta": "tarea_cuenta"
}

export const PRISMA_ENTITY_MANIFEST = [
  {
    "id": "rol",
    "prismaModel": "Rol",
    "table": "rol",
    "domain": "rbac",
    "physical": "public.rol",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "empresa",
    "prismaModel": "Empresa",
    "table": "empresa",
    "domain": "platform",
    "physical": "public.empresa",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "cuenta",
    "prismaModel": "Cuenta",
    "table": "cuenta",
    "domain": "platform",
    "physical": "public.cuenta",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "bodega",
    "prismaModel": "Bodega",
    "table": "bodega",
    "domain": "platform",
    "physical": "public.bodega",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "solicitud_alta_bodega",
    "prismaModel": "SolicitudAltaBodega",
    "table": "solicitud_alta_bodega",
    "domain": "platform",
    "physical": "public.solicitud_alta_bodega",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "asignacion_bodega",
    "prismaModel": "AsignacionBodega",
    "table": "asignacion_bodega",
    "domain": "rbac",
    "physical": "public.asignacion_bodega",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "usuario",
    "prismaModel": "Usuario",
    "table": "usuario",
    "domain": "rbac",
    "physical": "public.usuario",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "tipo_ubicacion",
    "prismaModel": "TipoUbicacion",
    "table": "tipo_ubicacion",
    "domain": "warehouse",
    "physical": "public.tipo_ubicacion",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "zona",
    "prismaModel": "Zona",
    "table": "zona",
    "domain": "warehouse",
    "physical": "public.zona",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "ubicacion",
    "prismaModel": "Ubicacion",
    "table": "ubicacion",
    "domain": "warehouse",
    "physical": "public.ubicacion",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "proveedor",
    "prismaModel": "Proveedor",
    "table": "proveedor",
    "domain": "catalog",
    "physical": "public.proveedor",
    "implementationStatus": "done",
    "scope": "C"
  },
  {
    "id": "cliente",
    "prismaModel": "Cliente",
    "table": "cliente",
    "domain": "catalog",
    "physical": "public.cliente",
    "implementationStatus": "done",
    "scope": "C"
  },
  {
    "id": "producto",
    "prismaModel": "Producto",
    "table": "producto",
    "domain": "catalog",
    "physical": "public.producto",
    "implementationStatus": "done",
    "scope": "C"
  },
  {
    "id": "comprador",
    "prismaModel": "Comprador",
    "table": "comprador",
    "domain": "catalog",
    "physical": "public.comprador",
    "implementationStatus": "done",
    "scope": "C"
  },
  {
    "id": "planta",
    "prismaModel": "Planta",
    "table": "planta",
    "domain": "catalog",
    "physical": "public.planta",
    "implementationStatus": "done",
    "scope": "C"
  },
  {
    "id": "camion",
    "prismaModel": "Camion",
    "table": "camion",
    "domain": "catalog",
    "physical": "public.camion",
    "implementationStatus": "done",
    "scope": "C"
  },
  {
    "id": "solicitud_compra",
    "prismaModel": "SolicitudCompra",
    "table": "solicitud_compra",
    "domain": "purchase",
    "physical": "public.solicitud_compra",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "solicitud_compra_linea",
    "prismaModel": "SolicitudCompraLinea",
    "table": "solicitud_compra_linea",
    "domain": "purchase",
    "physical": "public.solicitud_compra_linea",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "orden_compra",
    "prismaModel": "OrdenCompra",
    "table": "orden_compra",
    "domain": "purchase",
    "physical": "public.orden_compra",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "orden_compra_linea",
    "prismaModel": "OrdenCompraLinea",
    "table": "orden_compra_linea",
    "domain": "purchase",
    "physical": "public.orden_compra_linea",
    "implementationStatus": "done",
    "scope": "C+B"
  },
  {
    "id": "recepcion_compra",
    "prismaModel": "RecepcionCompra",
    "table": "recepcion_compra",
    "domain": "purchase",
    "physical": "public.recepcion_compra",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "recepcion_compra_linea",
    "prismaModel": "RecepcionCompraLinea",
    "table": "recepcion_compra_linea",
    "domain": "purchase",
    "physical": "public.recepcion_compra_linea",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "lote",
    "prismaModel": "Lote",
    "table": "lote",
    "domain": "warehouse",
    "physical": "public.lote",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "warehouse_state",
    "prismaModel": "WarehouseState",
    "table": "warehouse_state",
    "domain": "warehouse",
    "physical": "public.warehouse_state",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "movimiento_inventario",
    "prismaModel": "MovimientoInventario",
    "table": "movimiento_inventario",
    "domain": "warehouse",
    "physical": "public.movimiento_inventario",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "contador",
    "prismaModel": "Contador",
    "table": "contador",
    "domain": "system",
    "physical": "public.contador",
    "implementationStatus": "partial",
    "scope": "C"
  },
  {
    "id": "auditoria_operacion",
    "prismaModel": "AuditoriaOperacion",
    "table": "auditoria_operacion",
    "domain": "system",
    "physical": "public.auditoria_operacion",
    "implementationStatus": "partial",
    "scope": "C"
  },
  {
    "id": "orden_trabajo",
    "prismaModel": "OrdenTrabajo",
    "table": "orden_trabajo",
    "domain": "warehouse",
    "physical": "public.orden_trabajo",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "orden_trabajo_linea",
    "prismaModel": "OrdenTrabajoLinea",
    "table": "orden_trabajo_linea",
    "domain": "warehouse",
    "physical": "public.orden_trabajo_linea",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "orden_venta",
    "prismaModel": "OrdenVenta",
    "table": "orden_venta",
    "domain": "sales",
    "physical": "public.orden_venta",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "orden_venta_linea",
    "prismaModel": "OrdenVentaLinea",
    "table": "orden_venta_linea",
    "domain": "sales",
    "physical": "public.orden_venta_linea",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "viaje_transporte",
    "prismaModel": "ViajeTransporte",
    "table": "viaje_transporte",
    "domain": "sales",
    "physical": "public.viaje_transporte",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "guia_envio",
    "prismaModel": "GuiaEnvio",
    "table": "guia_envio",
    "domain": "sales",
    "physical": "public.guia_envio",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "evidencia_transporte",
    "prismaModel": "EvidenciaTransporte",
    "table": "evidencia_transporte",
    "domain": "sales",
    "physical": "public.evidencia_transporte",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "solicitud_procesamiento",
    "prismaModel": "SolicitudProcesamiento",
    "table": "solicitud_procesamiento",
    "domain": "processing",
    "physical": "public.solicitud_procesamiento",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "registro_merma",
    "prismaModel": "RegistroMerma",
    "table": "registro_merma",
    "domain": "processing",
    "physical": "public.registro_merma",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "alerta_operativa",
    "prismaModel": "AlertaOperativa",
    "table": "alerta_operativa",
    "domain": "warehouse",
    "physical": "public.alerta_operativa",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "tarea_cola",
    "prismaModel": "TareaCola",
    "table": "tarea_cola",
    "domain": "warehouse",
    "physical": "public.tarea_cola",
    "implementationStatus": "partial",
    "scope": "C+B"
  },
  {
    "id": "solicitud_integracion",
    "prismaModel": "SolicitudIntegracion",
    "table": "solicitud_integracion",
    "domain": "platform",
    "physical": "public.solicitud_integracion",
    "implementationStatus": "done",
    "scope": "C"
  },
  {
    "id": "tarea_cuenta",
    "prismaModel": "TareaCuenta",
    "table": "tarea_cuenta",
    "domain": "platform",
    "physical": "public.tarea_cuenta",
    "implementationStatus": "partial",
    "scope": "C"
  }
]
