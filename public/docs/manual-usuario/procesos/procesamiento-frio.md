# Procesamiento (cadena de frío)

Transformación de **producto primario** a **secundario** con registro de merma.

## Estados solicitud

```
pendiente → en_proceso → pendiente_cierre → terminada
```

## Flujo completo

| Paso | Quién | Acción |
| --- | --- | --- |
| 1 | Operador cuenta / jefe | Crear solicitud (`POST /procesamiento/solicitudes`) |
| 2 | Jefe bodega | Asignar operario → crea OT + tarea |
| 3 | Operario | Iniciar → mueve stock a zona procesamiento |
| 4 | Operario | Completar tarea de movimiento |
| 5 | Jefe | Asignar procesador |
| 6 | Procesador | Cerrar con kilos merma |
| 7 | Sistema | Crea OT post-cierre (procesado + desperdicio) |
| 8 | Operario | Aplicar traslados post-cierre |
| 9 | Jefe | Marcar solicitud terminada |

## Balance de masa

```
Entrada (kg primario) = Salida procesada (kg secundario) + Merma (kg) + Sobrante (kg)
```

El catálogo define % merma esperado por conversión primario→secundario.

## Pantallas

| Rol | Ruta |
| --- | --- |
| Operador cuenta | `/dashboard/bodega-interna/procesamiento` |
| Jefe bodega | `/dashboard/procesamiento` + modal asignación |
| Procesador | `/dashboard/procesador/operacion` |
| Operario | Tareas en `/dashboard/operario/operacion` |

## Preguntas frecuentes (Mateo)

**¿Quién crea la solicitud?** Operador de cuenta o jefe de bodega.

**¿Por qué no puedo cerrar merma?** Solo el rol `procesador` puede cerrar; la solicitud debe estar en proceso.

**¿Qué es post-cierre?** OTs para ubicar el producto ya procesado (y desperdicio opcional) de vuelta en almacenamiento.
