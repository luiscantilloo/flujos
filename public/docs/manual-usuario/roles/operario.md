# Operario

| Campo | Valor |
| --- | --- |
| Rol | `operario` |
| Nivel | Bodega |
| Pantalla principal | `/dashboard/operario/operacion` |
| Creado por | Administrador de cuenta |

## ¿Quién es?

Ejecuta **tareas de piso**: movimientos de cajas, picking, traslados a procesamiento y post-cierre. Es quien mueve físicamente la mercancía según las órdenes de trabajo asignadas.

## Pantalla principal

`/dashboard/operario/operacion` — lista de tareas asignadas con botón para completar cada una.

## Funciones

| Función | Descripción |
| --- | --- |
| Ver cola de tareas | Tareas asignadas por jefe de bodega |
| Completar tarea | Ejecuta movimiento de stock entre ubicaciones |
| Llamar al jefe | Botón «Llamar jefe» → alerta al jefe de bodega |
| Mapa inventario | Acceso rápido a `/dashboard/mapa` |
| Lock posición | Puede bloquear slot en mapa (POL-6) |

## Tipos de tarea

| Tipo | Descripción |
| --- | --- |
| Movimiento | Traslado entre ubicaciones (reabasto, bodega a bodega) |
| Despacho | Picking hacia zona de salida |
| Procesamiento | Mover stock a zona de procesamiento |
| Post-cierre | Ubicar producto procesado tras merma |

## Presencia

El sistema registra heartbeat (`POST /operaciones/presencia/ping`) mientras el operario tiene la pantalla abierta. TTL: 2 minutos. El jefe ve operarios «disponibles» según esta presencia.

## Permisos

| Acción | ¿Puede? |
| --- | --- |
| Ejecutar OT | ✅ |
| Completar tarea | ✅ |
| Crear OT | ❌ |
| Cerrar recepción | ❌ |
| Declarar merma | ❌ |

## Errores frecuentes (soporte)

| Síntoma | Causa | Respuesta |
| --- | --- | --- |
| Lista de tareas vacía | Sin asignación del jefe | Jefe debe asignar operario |
| Error al completar | Slot bloqueado por otro usuario | Esperar unlock o pedir force unlock al jefe |
| No aparece como disponible | Sin ping presencia | Mantener `/operario/operacion` abierta |
