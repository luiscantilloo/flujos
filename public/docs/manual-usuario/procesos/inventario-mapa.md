Roles admitidos: configurador, administrador_bodega, jefe_bodega, custodio, operario
Seccionar: False

# Inventario y mapa

El **mapa** es el plano de la bodega: cada casillero muestra qué hay, cuánto y de qué lote. Se actualiza **en vivo** cuando alguien recibe, mueve o saca.

## Quién lo usa

Administrador de bodega, jefe de bodega, custodio y operario. Oficina (admin/operador de cuenta) no opera el mapa.

## Cómo usarlo

1. Elegí la **bodega** arriba.
2. Abrí **Mapa** en el menú.
3. Buscá el casillero: producto, lote, kilos, temperatura, si está libre u ocupado.

Si no se actualiza: recargá, confirmá la bodega y que tengas internet.

## Bloquear un casillero (lock)

Para que dos personas no pisen el mismo lugar:

1. Bloqueá el casillero **antes** de trabajarlo.
2. Hacé el movimiento.
3. Liberá cuando termines.

Si se te olvida, a los **~5 minutos** se suelta solo. Si quedó trabado, el **jefe** o el **admin de bodega** pueden liberarlo.

## Qué pasa por detrás (en simple)

Cada movimiento deja un rastro: recepción, traslado, reserva al emitir una venta, despacho, merma. No tenés que cargar un “historial” a mano.

Al armar una salida, el sistema tiende a usar primero lo que **vence antes** (FEFO). Si eso no cubre el pedido, oficina o jefe tienen que revisar stock.

## Si se traba

- Mapa congelado: recargar + bodega correcta.
- “No puedo bloquear”: otro lo tiene. Esperá o pedí desbloqueo.
- Casillero vacío pero “sabés” que hay caja: no completes la tarea a medias; avisá al jefe.
