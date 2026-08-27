# Procesamiento en frío

Es transformar **producto primario** en **secundario** (corte, filete, porción) y anotar la **merma**.

## Quién hace qué

| Paso | Quién |
| --- | --- |
| Pedir el procesamiento | Operador de cuenta o jefe |
| Traer el primario a la zona de proceso | Operario (tarea) |
| Procesar en planta y declarar merma | Procesador — **Declarar merma y cerrar** |
| Guardar el secundario | Operario (tarea post-cierre) |
| Dar por terminada la orden | Jefe de bodega |

## En la báscula

Lo que entró (kg de primario) tiene que cuadrar con:

**procesado + merma + sobrante**

El catálogo puede sugerir un % de merma. Mandan los kilos reales.

## Estados que vas a ver

**Pendiente** → **en proceso** → **pendiente de cierre** → **terminada**.

El procesador cierra cuando el trabajo físico ya está hecho. Si cierra antes, el inventario queda mal.

## Si se traba

- El procesador no ve la orden: el operario no terminó de llevar el primario.
- Error al declarar merma: más kilos de merma que stock en la zona.
- El secundario no aparece en almacenamiento: falta que el operario complete el post-cierre.
