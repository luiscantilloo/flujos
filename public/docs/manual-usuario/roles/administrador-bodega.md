# Administrador de bodega

| Campo | Valor |
| --- | --- |
| Rol | `administrador_bodega` |
| Nivel | Bodega |
| Pantalla principal | `/dashboard/administrador-bodega/estado-bodega` |
| Creado por | Administrador de cuenta |

## ¿Quién es?

Supervisa la operación de **una o más bodegas asignadas**. Tiene permisos de escritura en inventario y estado de bodega, pero su foco es supervisión y reportes (no ejecuta tareas de piso como el operario).

## Pantallas

| Ruta | Función |
| --- | --- |
| `/dashboard/administrador-bodega/estado-bodega` | Grid visual por zonas/slots |
| `/dashboard/administrador-bodega/reportes-bodega` | Gráficos y resumen de salidas |
| `/dashboard/mapa` | Mapa de inventario en tiempo real |
| `/dashboard/ingreso` | Ver recepciones (según nav) |

## Al entrar al dashboard

El sistema redirige automáticamente a **Estado de bodega** (no al home genérico).

## Permisos

| Permiso | ¿Tiene? |
| --- | --- |
| `inventory:write` | ✅ |
| `warehouse_state:write` | ✅ |
| `counters:write` | ✅ |
| Lock/unlock mapa | ✅ |
| Force unlock | ✅ |
| Cerrar recepción | ✅ |
| Crear OT | ❌ (jefe de bodega) |
| Ejecutar tareas piso | ❌ |

## Diferencia con jefe de bodega

| Aspecto | Admin bodega | Jefe bodega |
| --- | --- | --- |
| Estado visual bodega | ✅ | ✅ |
| Reportes bodega | ✅ | 🟡 (ruta deprecada) |
| Acciones ingreso/salida/transferencia | ❌ | ✅ |
| Asignar operarios procesamiento | ❌ | ✅ |

## Widgets del dashboard

- Stock resumido
- Tareas en cola
- Alertas de bodega

## Errores frecuentes (soporte)

| Síntoma | Solución |
| --- | --- |
| Pantalla vacía en estado bodega | Verificar bodega activa en selector superior |
| No ve mapa | Debe tener bodega seleccionada + permiso `inventory:read` |
| "Sin bodega asignada" | Revisar `asignacion_bodega` para ese usuario |
