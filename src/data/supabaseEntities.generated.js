/** Auto-generado desde polaria-wms-api + polaria-wms-db — node scripts/sync-prisma-entities.mjs */
export const SUPABASE_ENTITY_COUNT = 40
export const ENTITIES = [
  {
    "id": "rol",
    "domain": "rbac",
    "name": "Rol WMS",
    "table": "rol",
    "physical": "public.rol",
    "prismaModel": "Rol",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Catálogo de 9 roles WMS (seed). Scope plataforma / cuenta / bodega.",
    "fields": [
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "descripcion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      }
    ],
    "relations": []
  },
  {
    "id": "empresa",
    "domain": "platform",
    "name": "Empresa (cliente SaaS)",
    "table": "empresa",
    "physical": "public.empresa",
    "prismaModel": "Empresa",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Cliente jurídico SaaS. Creada por configurador TI.",
    "fields": [
      {
        "name": "codigo_empresa",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "razon_social",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "telefono",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activa",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_creador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      }
    ],
    "relations": []
  },
  {
    "id": "cuenta",
    "domain": "platform",
    "name": "Tenant (cuenta)",
    "table": "cuenta",
    "physical": "public.cuenta",
    "prismaModel": "Cuenta",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Tenant operativo (codigo_cuenta). Scope C en catálogos y documentos.",
    "fields": [
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_empresa",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre_comercial",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "esta_activa",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_creador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "empresa",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "empresa.codigo_empresa"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "empresa",
        "label": "empresa"
      }
    ]
  },
  {
    "id": "bodega",
    "domain": "platform",
    "name": "Bodega",
    "table": "bodega",
    "physical": "public.bodega",
    "prismaModel": "Bodega",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Bodega interna/externa. Alta vía POST /configuracion/bodegas (API).",
    "fields": [
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "capacidad_slots",
        "type": "int",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_solicitud_origen",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_creador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activa",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "solicitud_origen",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "solicitud_origen.id_solicitud"
      },
      {
        "name": "creador",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "solicitud_origen",
        "label": "solicitud_origen"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "creador"
      }
    ]
  },
  {
    "id": "solicitud_alta_bodega",
    "domain": "platform",
    "name": "Solicitud alta bodega",
    "table": "solicitud_alta_bodega",
    "physical": "public.solicitud_alta_bodega",
    "prismaModel": "SolicitudAltaBodega",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Admin cuenta solicita bodega; configurador atiende.",
    "fields": [
      {
        "name": "id_solicitud",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_empresa",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_solicitante",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre_solicitado",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "comentarios",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_atendido_por",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "atendido_en",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "empresa",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "empresa.codigo_empresa"
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "solicitante",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "usuario.id_usuario"
      },
      {
        "name": "atendido_por",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      },
      {
        "name": "bodega_creada",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "bodega.id_bodega"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "empresa",
        "label": "empresa"
      },
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "solicitante"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "atendido_por"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega_creada"
      }
    ]
  },
  {
    "id": "asignacion_bodega",
    "domain": "rbac",
    "name": "Asignación bodega",
    "table": "asignacion_bodega",
    "physical": "public.asignacion_bodega",
    "prismaModel": "AsignacionBodega",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Tabla asignacion_bodega · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_asignacion",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_usuario",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "vigente_desde",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "esta_activa",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "usuario",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "usuario.id_usuario"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "rol",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "rol.id_rol"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "usuario",
        "label": "usuario"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "rol",
        "label": "rol"
      }
    ]
  },
  {
    "id": "usuario",
    "domain": "rbac",
    "name": "Usuario",
    "table": "usuario",
    "physical": "public.usuario",
    "prismaModel": "Usuario",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Perfil WMS; id_auth → Supabase auth.users (no tabla en public).",
    "fields": [
      {
        "name": "id_usuario",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_auth",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo_empresa",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_creador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "username",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "correo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "esta_activo",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "rol",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "rol.id_rol"
      },
      {
        "name": "empresa",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "empresa.codigo_empresa"
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "cuenta.codigo_cuenta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "rol",
        "label": "rol"
      },
      {
        "card": "N",
        "entity": "empresa",
        "label": "empresa"
      },
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      }
    ]
  },
  {
    "id": "tipo_ubicacion",
    "domain": "warehouse",
    "name": "Tipo ubicación",
    "table": "tipo_ubicacion",
    "physical": "public.tipo_ubicacion",
    "prismaModel": "TipoUbicacion",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla tipo_ubicacion · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_tipo_ubicacion",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "es_picking",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "es_recepcion",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "es_almacenamiento",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "esta_activa",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      }
    ]
  },
  {
    "id": "zona",
    "domain": "warehouse",
    "name": "Zona",
    "table": "zona",
    "physical": "public.zona",
    "prismaModel": "Zona",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla zona · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_zona",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "esta_activa",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      }
    ]
  },
  {
    "id": "ubicacion",
    "domain": "warehouse",
    "name": "Ubicación (slot)",
    "table": "ubicacion",
    "physical": "public.ubicacion",
    "prismaModel": "Ubicacion",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla ubicacion · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_ubicacion",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_zona",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_tipo_ubicacion",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "capacidad",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activa",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "zona",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "zona.id_zona"
      },
      {
        "name": "tipo_ubicacion",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "tipo_ubicacion.id_tipo_ubicacion"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "zona",
        "label": "zona"
      },
      {
        "card": "N",
        "entity": "tipo_ubicacion",
        "label": "tipo_ubicacion"
      }
    ]
  },
  {
    "id": "proveedor",
    "domain": "catalog",
    "name": "Proveedor",
    "table": "proveedor",
    "physical": "public.proveedor",
    "prismaModel": "Proveedor",
    "scope": "C",
    "implementationStatus": "done",
    "desc": "✅ Tabla proveedor · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_proveedor",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "razon_social",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "telefono",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "email",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activo",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      }
    ]
  },
  {
    "id": "cliente",
    "domain": "catalog",
    "name": "Cliente",
    "table": "cliente",
    "physical": "public.cliente",
    "prismaModel": "Cliente",
    "scope": "C",
    "implementationStatus": "done",
    "desc": "✅ Tabla cliente · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_cliente",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nit",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "telefono",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activo",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      }
    ]
  },
  {
    "id": "producto",
    "domain": "catalog",
    "name": "Producto",
    "table": "producto",
    "physical": "public.producto",
    "prismaModel": "Producto",
    "scope": "C",
    "implementationStatus": "done",
    "desc": "✅ Tabla producto · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_cliente",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "sku",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "descripcion",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "unidad_medida",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "es_primario",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "es_secundario",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo_almacen",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_producto_primario",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "regla_conversion_cantidad_primario",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "regla_conversion_unidades_secundario",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "merma_pct",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "unidad_visualizacion",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "requiere_lote",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "metadatos_catalogo",
        "type": "jsonb",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activo",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "cliente",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "cliente.id_cliente"
      },
      {
        "name": "producto_primario",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "producto_primario.id_producto"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "cliente",
        "label": "cliente"
      },
      {
        "card": "N",
        "entity": "producto_primario",
        "label": "producto_primario"
      }
    ]
  },
  {
    "id": "comprador",
    "domain": "catalog",
    "name": "Comprador",
    "table": "comprador",
    "physical": "public.comprador",
    "prismaModel": "Comprador",
    "scope": "C",
    "implementationStatus": "done",
    "desc": "✅ Tabla comprador · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_comprador",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "contacto",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "telefono",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activo",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      }
    ]
  },
  {
    "id": "planta",
    "domain": "catalog",
    "name": "Planta",
    "table": "planta",
    "physical": "public.planta",
    "prismaModel": "Planta",
    "scope": "C",
    "implementationStatus": "done",
    "desc": "✅ Tabla planta · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_planta",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "direccion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "capacidad_pallets",
        "type": "int",
        "pk": false,
        "nullable": true
      },
      {
        "name": "rango_temperatura",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "esta_activo",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      }
    ]
  },
  {
    "id": "camion",
    "domain": "catalog",
    "name": "Camión",
    "table": "camion",
    "physical": "public.camion",
    "prismaModel": "Camion",
    "scope": "C",
    "implementationStatus": "done",
    "desc": "✅ Tabla camion · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_camion",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "placa",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "descripcion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "marca",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "modelo",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "capacidad_kg",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "capacidad_m3",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "capacidad_pallets",
        "type": "int",
        "pk": false,
        "nullable": true
      },
      {
        "name": "rango_temperatura",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "disponible",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "esta_activo",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      }
    ]
  },
  {
    "id": "solicitud_compra",
    "domain": "purchase",
    "name": "Solicitud compra (SOL)",
    "table": "solicitud_compra",
    "physical": "public.solicitud_compra",
    "prismaModel": "SolicitudCompra",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Tabla solicitud_compra · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_solicitud_compra",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_proveedor",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_orden_compra",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_solicitante",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "observaciones",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "proveedor",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "proveedor.id_proveedor"
      },
      {
        "name": "orden_compra",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "orden_compra.id_orden_compra"
      },
      {
        "name": "solicitante",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "proveedor",
        "label": "proveedor"
      },
      {
        "card": "N",
        "entity": "orden_compra",
        "label": "orden_compra"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "solicitante"
      }
    ]
  },
  {
    "id": "solicitud_compra_linea",
    "domain": "purchase",
    "name": "Línea SOL",
    "table": "solicitud_compra_linea",
    "physical": "public.solicitud_compra_linea",
    "prismaModel": "SolicitudCompraLinea",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Tabla solicitud_compra_linea · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_linea_solicitud_compra",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_solicitud_compra",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cantidad",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "solicitud_compra",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "solicitud_compra.id_solicitud_compra"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "producto.id_producto"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "solicitud_compra",
        "label": "solicitud_compra"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      }
    ]
  },
  {
    "id": "orden_compra",
    "domain": "purchase",
    "name": "Orden compra (OC)",
    "table": "orden_compra",
    "physical": "public.orden_compra",
    "prismaModel": "OrdenCompra",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Tabla orden_compra · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_orden_compra",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_proveedor",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_solicitud_compra",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_creador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "fecha_emision",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "fecha_entrega_estimada",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "observaciones",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "proveedor",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "proveedor.id_proveedor"
      },
      {
        "name": "solicitud_compra",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "solicitud_compra.id_solicitud_compra"
      },
      {
        "name": "creador",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "proveedor",
        "label": "proveedor"
      },
      {
        "card": "N",
        "entity": "solicitud_compra",
        "label": "solicitud_compra"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "creador"
      }
    ]
  },
  {
    "id": "orden_compra_linea",
    "domain": "purchase",
    "name": "Línea OC",
    "table": "orden_compra_linea",
    "physical": "public.orden_compra_linea",
    "prismaModel": "OrdenCompraLinea",
    "scope": "C+B",
    "implementationStatus": "done",
    "desc": "✅ Tabla orden_compra_linea · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_linea_orden_compra",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_orden_compra",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cantidad",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "precio_unitario",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cantidad_recibida",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "orden_compra",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "orden_compra.id_orden_compra"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "producto.id_producto"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "orden_compra",
        "label": "orden_compra"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      }
    ]
  },
  {
    "id": "recepcion_compra",
    "domain": "purchase",
    "name": "Recepción compra",
    "table": "recepcion_compra",
    "physical": "public.recepcion_compra",
    "prismaModel": "RecepcionCompra",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla recepcion_compra · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_recepcion",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_orden_compra",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "sin_diferencias",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "notas",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cerrada_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cerrada_por",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "orden_compra",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "orden_compra.id_orden_compra"
      },
      {
        "name": "usuario_cierre",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "orden_compra",
        "label": "orden_compra"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "usuario_cierre"
      }
    ]
  },
  {
    "id": "recepcion_compra_linea",
    "domain": "purchase",
    "name": "Línea recepción",
    "table": "recepcion_compra_linea",
    "physical": "public.recepcion_compra_linea",
    "prismaModel": "RecepcionCompraLinea",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla recepcion_compra_linea · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_linea_recepcion",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_recepcion",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_linea_orden_compra",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cantidad_recibida",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "temperatura_registrada",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "es_adicional",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "titulo_snapshot",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "recepcion",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "recepcion_compra.id_recepcion"
      },
      {
        "name": "linea_orden_compra",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "orden_compra_linea.id_linea_orden_compra"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "producto.id_producto"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "recepcion_compra",
        "label": "recepcion"
      },
      {
        "card": "N",
        "entity": "orden_compra_linea",
        "label": "linea_orden_compra"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      }
    ]
  },
  {
    "id": "lote",
    "domain": "warehouse",
    "name": "Lote",
    "table": "lote",
    "physical": "public.lote",
    "prismaModel": "Lote",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla lote · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_lote",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_cliente",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "codigo_lote",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "fecha_vencimiento",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "temperatura_objetivo",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "producto.id_producto"
      },
      {
        "name": "cliente",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "cliente.id_cliente"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      },
      {
        "card": "N",
        "entity": "cliente",
        "label": "cliente"
      }
    ]
  },
  {
    "id": "warehouse_state",
    "domain": "warehouse",
    "name": "Inventario en vivo (warehouse_state)",
    "table": "warehouse_state",
    "physical": "public.warehouse_state",
    "prismaModel": "WarehouseState",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Stock en vivo por ubicación+producto+lote. Escritura solo API.",
    "fields": [
      {
        "name": "id_warehouse_state",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_ubicacion",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_lote",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cantidad",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cantidad_reservada",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "temperatura",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "locked_by",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "locked_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "version",
        "type": "int",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "ubicacion",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "ubicacion.id_ubicacion"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "producto.id_producto"
      },
      {
        "name": "lote",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "lote.id_lote"
      },
      {
        "name": "usuario_lock",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "ubicacion",
        "label": "ubicacion"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      },
      {
        "card": "N",
        "entity": "lote",
        "label": "lote"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "usuario_lock"
      }
    ]
  },
  {
    "id": "movimiento_inventario",
    "domain": "warehouse",
    "name": "Movimiento inventario",
    "table": "movimiento_inventario",
    "physical": "public.movimiento_inventario",
    "prismaModel": "MovimientoInventario",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Historial append-only. Escritura solo API (Prisma bypass RLS).",
    "fields": [
      {
        "name": "id_movimiento_inventario",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_ubicacion_origen",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_ubicacion_destino",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_lote",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cantidad",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_usuario",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_referencia",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "tipo_referencia",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "metadata",
        "type": "jsonb",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "ubicacion_origen",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "ubicacion_origen.id_ubicacion"
      },
      {
        "name": "ubicacion_destino",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "ubicacion_destino.id_ubicacion"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "producto.id_producto"
      },
      {
        "name": "lote",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "lote.id_lote"
      },
      {
        "name": "usuario",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "ubicacion_origen",
        "label": "ubicacion_origen"
      },
      {
        "card": "N",
        "entity": "ubicacion_destino",
        "label": "ubicacion_destino"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      },
      {
        "card": "N",
        "entity": "lote",
        "label": "lote"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "usuario"
      }
    ]
  },
  {
    "id": "contador",
    "domain": "system",
    "name": "Contador documentos",
    "table": "contador",
    "physical": "public.contador",
    "prismaModel": "Contador",
    "scope": "C",
    "implementationStatus": "partial",
    "desc": "🟡 Numeración OC/OV/TV. Escritura solo API.",
    "fields": [
      {
        "name": "id_contador",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "clave",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "valor",
        "type": "int",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "bodega.id_bodega"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      }
    ]
  },
  {
    "id": "auditoria_operacion",
    "domain": "system",
    "name": "Auditoría operación",
    "table": "auditoria_operacion",
    "physical": "public.auditoria_operacion",
    "prismaModel": "AuditoriaOperacion",
    "scope": "C",
    "implementationStatus": "partial",
    "desc": "🟡 Log operativo. INSERT solo backend.",
    "fields": [
      {
        "name": "id_auditoria",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_usuario",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "entidad",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "entidad_id",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "payload",
        "type": "jsonb",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "usuario",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "usuario"
      }
    ]
  },
  {
    "id": "orden_trabajo",
    "domain": "warehouse",
    "name": "Orden trabajo",
    "table": "orden_trabajo",
    "physical": "public.orden_trabajo",
    "prismaModel": "OrdenTrabajo",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla orden_trabajo · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_orden_trabajo",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_asignado",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_solicitante",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_lote",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_ubicacion_origen",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_ubicacion_destino",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_solicitud_procesamiento",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "observaciones",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "asignado",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      },
      {
        "name": "solicitante",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      },
      {
        "name": "lote",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "lote.id_lote"
      },
      {
        "name": "ubicacion_origen",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "ubicacion_origen.id_ubicacion"
      },
      {
        "name": "ubicacion_destino",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "ubicacion_destino.id_ubicacion"
      },
      {
        "name": "solicitud_procesamiento",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "solicitud_procesamiento.id_solicitud_procesamiento"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "asignado"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "solicitante"
      },
      {
        "card": "N",
        "entity": "lote",
        "label": "lote"
      },
      {
        "card": "N",
        "entity": "ubicacion_origen",
        "label": "ubicacion_origen"
      },
      {
        "card": "N",
        "entity": "ubicacion_destino",
        "label": "ubicacion_destino"
      },
      {
        "card": "N",
        "entity": "solicitud_procesamiento",
        "label": "solicitud_procesamiento"
      }
    ]
  },
  {
    "id": "orden_trabajo_linea",
    "domain": "warehouse",
    "name": "Línea OT",
    "table": "orden_trabajo_linea",
    "physical": "public.orden_trabajo_linea",
    "prismaModel": "OrdenTrabajoLinea",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla orden_trabajo_linea · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_linea_orden_trabajo",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_orden_trabajo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_ubicacion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cantidad",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "orden_trabajo",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "orden_trabajo.id_orden_trabajo"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "producto.id_producto"
      },
      {
        "name": "ubicacion",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "ubicacion.id_ubicacion"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "orden_trabajo",
        "label": "orden_trabajo"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      },
      {
        "card": "N",
        "entity": "ubicacion",
        "label": "ubicacion"
      }
    ]
  },
  {
    "id": "orden_venta",
    "domain": "sales",
    "name": "Orden venta (OV)",
    "table": "orden_venta",
    "physical": "public.orden_venta",
    "prismaModel": "OrdenVenta",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla orden_venta · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_orden_venta",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_cliente",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_comprador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_planta",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_creador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_bodega_destino",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "fecha_pedido",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "observaciones",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "cliente",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cliente.id_cliente"
      },
      {
        "name": "comprador",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "comprador.id_comprador"
      },
      {
        "name": "planta",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "planta.id_planta"
      },
      {
        "name": "creador",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      },
      {
        "name": "bodega_destino",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "bodega_destino.id_bodega"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "cliente",
        "label": "cliente"
      },
      {
        "card": "N",
        "entity": "comprador",
        "label": "comprador"
      },
      {
        "card": "N",
        "entity": "planta",
        "label": "planta"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "creador"
      },
      {
        "card": "N",
        "entity": "bodega_destino",
        "label": "bodega_destino"
      }
    ]
  },
  {
    "id": "orden_venta_linea",
    "domain": "sales",
    "name": "Línea OV",
    "table": "orden_venta_linea",
    "physical": "public.orden_venta_linea",
    "prismaModel": "OrdenVentaLinea",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla orden_venta_linea · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_linea_orden_venta",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_orden_venta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_producto",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cantidad_pedida",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cantidad_despachada",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "orden_venta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "orden_venta.id_orden_venta"
      },
      {
        "name": "producto",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "producto.id_producto"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "orden_venta",
        "label": "orden_venta"
      },
      {
        "card": "N",
        "entity": "producto",
        "label": "producto"
      }
    ]
  },
  {
    "id": "viaje_transporte",
    "domain": "sales",
    "name": "Viaje transporte",
    "table": "viaje_transporte",
    "physical": "public.viaje_transporte",
    "prismaModel": "ViajeTransporte",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla viaje_transporte · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_viaje",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_camion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_transportista",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "fecha_programada",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "fecha_salida",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "fecha_cierre",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "observaciones",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "camion",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "camion.id_camion"
      },
      {
        "name": "transportista",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "camion",
        "label": "camion"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "transportista"
      }
    ]
  },
  {
    "id": "guia_envio",
    "domain": "sales",
    "name": "Guía envío",
    "table": "guia_envio",
    "physical": "public.guia_envio",
    "prismaModel": "GuiaEnvio",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla guia_envio · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_guia",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_viaje",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_orden_venta",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "destino",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "viaje",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "viaje_transporte.id_viaje"
      },
      {
        "name": "orden_venta",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "orden_venta.id_orden_venta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "viaje_transporte",
        "label": "viaje"
      },
      {
        "card": "N",
        "entity": "orden_venta",
        "label": "orden_venta"
      }
    ]
  },
  {
    "id": "evidencia_transporte",
    "domain": "sales",
    "name": "Evidencia transporte",
    "table": "evidencia_transporte",
    "physical": "public.evidencia_transporte",
    "prismaModel": "EvidenciaTransporte",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla evidencia_transporte · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_evidencia",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_guia",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_linea_orden_venta",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "url_cloudinary",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cantidad_entregada",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "incidencia",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "entrega_conforme",
        "type": "boolean",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "guia",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "guia_envio.id_guia"
      },
      {
        "name": "linea_orden_venta",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "orden_venta_linea.id_linea_orden_venta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "guia_envio",
        "label": "guia"
      },
      {
        "card": "N",
        "entity": "orden_venta_linea",
        "label": "linea_orden_venta"
      }
    ]
  },
  {
    "id": "solicitud_procesamiento",
    "domain": "processing",
    "name": "Solicitud procesamiento",
    "table": "solicitud_procesamiento",
    "physical": "public.solicitud_procesamiento",
    "prismaModel": "SolicitudProcesamiento",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla solicitud_procesamiento · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_solicitud_procesamiento",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_cliente",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_producto_primario",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_producto_secundario",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_solicitante",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_procesador",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "kilos_primario",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "kilos_secundario",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "kilos_merma",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "sobrante_kg",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "regla_conversion_cantidad_primario",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "regla_conversion_unidades_secundario",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "perdida_procesamiento_pct",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "estimado_unidades_secundario",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "kg_primario_descontado",
        "type": "decimal",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cierre_desde_procesador",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "observaciones",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "cliente",
        "label": "cliente"
      },
      {
        "card": "N",
        "entity": "producto_primario",
        "label": "producto_primario"
      },
      {
        "card": "N",
        "entity": "producto_secundario",
        "label": "producto_secundario"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "solicitante"
      },
      {
        "card": "N",
        "entity": "procesador",
        "label": "procesador"
      }
    ]
  },
  {
    "id": "registro_merma",
    "domain": "processing",
    "name": "Registro merma",
    "table": "registro_merma",
    "physical": "public.registro_merma",
    "prismaModel": "RegistroMerma",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla registro_merma · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_registro",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "id_solicitud_procesamiento",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "kilos_merma",
        "type": "decimal",
        "pk": false,
        "nullable": false
      },
      {
        "name": "periodo",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "solicitud_procesamiento",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "solicitud_procesamiento.id_solicitud_procesamiento"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "solicitud_procesamiento",
        "label": "solicitud_procesamiento"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      }
    ]
  },
  {
    "id": "alerta_operativa",
    "domain": "warehouse",
    "name": "Alerta operativa",
    "table": "alerta_operativa",
    "physical": "public.alerta_operativa",
    "prismaModel": "AlertaOperativa",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla alerta_operativa · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_alerta",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_ubicacion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_orden_trabajo",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_responsable",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "titulo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "descripcion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "motivo_cierre",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "metadata",
        "type": "jsonb",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cerrada_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "ubicacion",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "ubicacion.id_ubicacion"
      },
      {
        "name": "orden_trabajo",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "orden_trabajo.id_orden_trabajo"
      },
      {
        "name": "responsable",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "ubicacion",
        "label": "ubicacion"
      },
      {
        "card": "N",
        "entity": "orden_trabajo",
        "label": "orden_trabajo"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "responsable"
      }
    ]
  },
  {
    "id": "tarea_cola",
    "domain": "warehouse",
    "name": "Tarea cola",
    "table": "tarea_cola",
    "physical": "public.tarea_cola",
    "prismaModel": "TareaCola",
    "scope": "C+B",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla tarea_cola · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_tarea",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_bodega",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_asignado",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_orden_trabajo",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "titulo",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "descripcion",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "updated_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "bodega",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "bodega.id_bodega"
      },
      {
        "name": "asignado",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "usuario.id_usuario"
      },
      {
        "name": "orden_trabajo",
        "type": "enum",
        "pk": false,
        "nullable": true,
        "fk": "orden_trabajo.id_orden_trabajo"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "bodega",
        "label": "bodega"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "asignado"
      },
      {
        "card": "N",
        "entity": "orden_trabajo",
        "label": "orden_trabajo"
      }
    ]
  },
  {
    "id": "solicitud_integracion",
    "domain": "platform",
    "name": "Solicitud integración",
    "table": "solicitud_integracion",
    "physical": "public.solicitud_integracion",
    "prismaModel": "SolicitudIntegracion",
    "scope": "C",
    "implementationStatus": "done",
    "desc": "✅ Operador solicita integración bodega externa → configurador.",
    "fields": [
      {
        "name": "id_solicitud_integracion",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_cliente",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "bodega_externa_id",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "bodega_externa_nombre",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "scraping",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "api",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "csv_plano",
        "type": "boolean",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_solicitante",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "finalizada_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "cliente",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cliente.id_cliente"
      },
      {
        "name": "solicitante",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "cliente",
        "label": "cliente"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "solicitante"
      }
    ]
  },
  {
    "id": "tarea_cuenta",
    "domain": "platform",
    "name": "Tarea cuenta",
    "table": "tarea_cuenta",
    "physical": "public.tarea_cuenta",
    "prismaModel": "TareaCuenta",
    "scope": "C",
    "implementationStatus": "partial",
    "desc": "🟡 Tabla tarea_cuenta · polaria-wms-db / Supabase.",
    "fields": [
      {
        "name": "id_tarea_cuenta",
        "type": "varchar",
        "pk": true,
        "nullable": false
      },
      {
        "name": "codigo_cuenta",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "id_cliente",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "titulo",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "detalle",
        "type": "varchar",
        "pk": false,
        "nullable": true
      },
      {
        "name": "id_creador",
        "type": "varchar",
        "pk": false,
        "nullable": false
      },
      {
        "name": "created_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": false
      },
      {
        "name": "resuelta_at",
        "type": "timestamptz",
        "pk": false,
        "nullable": true
      },
      {
        "name": "cuenta",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cuenta.codigo_cuenta"
      },
      {
        "name": "cliente",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "cliente.id_cliente"
      },
      {
        "name": "creador",
        "type": "enum",
        "pk": false,
        "nullable": false,
        "fk": "usuario.id_usuario"
      }
    ],
    "relations": [
      {
        "card": "N",
        "entity": "cuenta",
        "label": "cuenta"
      },
      {
        "card": "N",
        "entity": "cliente",
        "label": "cliente"
      },
      {
        "card": "N",
        "entity": "usuario",
        "label": "creador"
      }
    ]
  }
]
