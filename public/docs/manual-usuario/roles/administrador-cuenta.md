# Administrador de cuenta

| Campo | Valor |
| --- | --- |
| Rol | `administrador_cuenta` |
| Nivel | Cuenta (tenant) |
| Pantalla principal | `/dashboard` → Panel administrativo |
| Creado por | Configurador (TI) |

## ¿Quién es?

Responsable comercial del cliente. Gestiona catálogos, proveedores, usuarios de su empresa y aprueba solicitudes de compra. Puede tener acceso a **una cuenta** específica o a **todas las cuentas** de su empresa (según configuración).

## ¿Cómo inicia sesión?

1. `/login` → código de empresa + usuario + contraseña
2. Redirige a `/dashboard` con panel administrativo

## Módulos principales

### Administración (`/dashboard/administracion/*`)

| Sección | Ruta | Función |
| --- | --- | --- |
| Proveedores | `.../proveedores` | CRUD proveedores del tenant |
| Clientes | `.../clientes` | CRUD clientes |
| Compradores | `.../compradores` | CRUD compradores |
| Camiones | `.../camiones` | Flota (refrigerado/seco) |
| Plantas | `.../plantas` | Plantas destino |
| Usuarios | `.../usuarios` | Crear operadores, jefes, custodios, etc. |
| Bodega interna | `.../bodega-interna` | Vincular bodegas internas |
| Bodega externa | `.../bodega-externa` | Vincular bodegas externas |
| Catálogo | `/dashboard/administracion/catalogo` | Productos primario/secundario, import Excel |

### Reportería

| Ruta | Función |
| --- | --- |
| `/dashboard/reporteria` | Reporte inventario de mercancía |

## Permisos clave

| Permiso | ¿Tiene? |
| --- | --- |
| `inventory:read` | ✅ |
| `inventory:write` | ❌ |
| Aprobar SOL | ✅ |
| Cerrar recepción | ❌ (solo lectura compras en bodega) |
| Crear usuarios cuenta | ✅ (`POST /administracion/usuarios`) |

## Procesos que ejecuta

1. **Configurar catálogo** de productos (primario → secundario con % merma)
2. **Crear proveedores y clientes**
3. **Asignar equipo de bodega** (jefe, custodio, operario, procesador, transportista)
4. **Aprobar solicitudes de compra** (SOL)
5. **Supervisar** órdenes de compra y venta (lectura)

## Lo que NO puede hacer

- Crear empresas ni bodegas desde cero (eso es TI)
- Operar mapa de inventario ni cerrar recepciones físicas
- Ejecutar tareas de operario en piso

## Errores frecuentes (soporte)

| Síntoma | Solución |
| --- | --- |
| No ve menú administración | Verificar rol `administrador_cuenta` en `usuario.id_rol` |
| No puede aprobar SOL | SOL debe estar en `pendiente_aprobacion` |
| No crea usuario | Revisar que el rol solicitado sea coherente con tenant/bodega |
