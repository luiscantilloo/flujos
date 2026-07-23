# Jefe de bodega

| Campo | Valor |
| --- | --- |
| Rol | `jefe_bodega` |
| Nivel | Bodega |
| Pantalla principal | `/dashboard/jefe-bodega/estado-bodega` |
| Creado por | Administrador de cuenta |

## ¿Quién es?

Jefe operativo de la bodega. Coordina ingresos, salidas, transferencias entre ubicaciones, asigna operarios a tareas y gestiona el procesamiento en piso.

## Pantalla principal

`/dashboard/jefe-bodega/estado-bodega` — grid visual con zonas (ingreso, almacenamiento, procesamiento, salida) y barra de acciones.

## Acciones disponibles

| Acción | Descripción |
| --- | --- |
| **Ingresos** | Registrar entrada de mercancía |
| **Bodega a Bodega** | Transferir cajas entre ubicaciones |
| **Revisar** | Consultar inventario |
| **Crear Salida** | Registrar salida vinculada a OV |
| **Procesamiento** | Asignar operario a solicitud (modal) |

Modales en la UI: ingreso, salida, transferencia, asignación procesamiento.

## Otros accesos

| Ruta | Función |
| --- | --- |
| `/dashboard/mapa` | Mapa inventario + lock posiciones |
| `/dashboard/ingreso` | Recepciones OC pendientes |
| `/dashboard/procesamiento` | Cola solicitudes procesamiento |
| `/dashboard/jefe-bodega/bodega-a-bodega` | Transferencias (también vía modal) |

## Flujo típico del día

```
1. Revisar estado de bodega (alertas, slots ocupados)
2. Atender llamadas de operarios
3. Asignar tareas / operarios a procesamiento
4. Coordinar ingresos (recepciones OC) y salidas (OV)
5. Resolver alertas operativas
```

## Permisos API relevantes

- Crear órdenes de trabajo (`POST /operaciones/ordenes-trabajo`)
- Asignar operario a procesamiento
- Cerrar recepción de compra
- Lock/unlock inventario + force unlock

## Errores frecuentes (soporte)

| Síntoma | Causa | Respuesta |
| --- | --- | --- |
| No puede asignar operario | Solicitud no en estado correcto | Debe estar `pendiente` o `en_proceso` |
| Operario no aparece disponible | Sin heartbeat presencia | Operario debe tener sesión activa en `/dashboard/operario/operacion` |
| Salida bloqueada | OV sin stock reservado | Verificar que OV esté `confirmada` |
