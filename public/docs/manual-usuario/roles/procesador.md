# Procesador

| Campo | Valor |
| --- | --- |
| Rol | `procesador` |
| Nivel | Bodega |
| Pantalla principal | `/dashboard/procesador/operacion` |
| Creado por | Administrador de cuenta |

## ¿Quién es?

Especialista de **línea de procesamiento** en frío. Transforma producto primario en secundario y declara la **merma** (pérdida de peso/volumen durante el proceso).

## Pantalla principal

`/dashboard/procesador/operacion` — solicitudes de procesamiento activas pendientes de cierre.

## Flujo de trabajo

```
1. Jefe crea solicitud de procesamiento
2. Jefe asigna operario → operario mueve stock a zona procesamiento
3. Procesador recibe solicitud en su cola
4. Procesador declara kilos de merma (POST cerrar)
5. Sistema crea OT post-cierre
6. Operario aplica traslados de producto procesado
7. Jefe marca solicitud como terminada
```

## Acciones del procesador

| Acción | Cuándo |
| --- | --- |
| Ver solicitudes activas | Siempre en su pantalla |
| Cerrar con merma | Cuando el procesamiento físico terminó |
| Consultar desperdicio sugerido | API sugiere % según catálogo producto |

## Permisos

| Acción | ¿Puede? |
| --- | --- |
| Cerrar procesamiento (merma) | ✅ |
| Ver mapa inventario | ❌ |
| Crear solicitud | ❌ |
| Ejecutar tareas operario | ❌ |

## Cálculos de merma

- El sistema usa regla de tres según catálogo (producto primario → secundario)
- `sobranteKg` = entrada − salida procesada − merma declarada
- Se registra en `registro_merma` + movimiento tipo `merma`

## Errores frecuentes (soporte)

| Síntoma | Solución |
| --- | --- |
| No ve solicitudes | Deben estar asignadas al procesador y en `en_proceso` o `pendiente_cierre` |
| Error al cerrar merma | Kilos merma > stock en zona procesamiento |
| Solicitud atascada | Verificar que operario completó tarea de inicio |
