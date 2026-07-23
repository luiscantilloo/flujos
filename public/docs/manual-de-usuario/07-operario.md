# Manual de Usuario — Operario

| Campo | Detalle |
| --- | --- |
| Rol | `operario` |
| Nivel | Bodega |
| Creado por | `administrador_cuenta` |
| Scope de acceso | La bodega asignada (`id_bodega`) dentro del tenant |
| Ruta principal | `/dashboard` — vista de operario |

---

## 1. ¿Quién es el Operario?

El **operario** es el trabajador de bodega que ejecuta las **órdenes de trabajo (OT)**. Su función es mover cajas y lotes de mercancía entre los distintos slots de la bodega según las instrucciones que recibe del sistema.

Sus responsabilidades son:

- Ejecutar **órdenes de trabajo** de tipo `a_bodega`, `a_salida` o `revisar`.
- Mover cajas y lotes entre slots de la bodega.
- **Inspeccionar** el estado físico de la mercancía cuando se le asigna.
- Registrar **inbound boxes** (cuando el custodio lo requiere).
- Aplicar **locking** en slots que está trabajando (para evitar conflictos con otros operarios).
- Participar en el **despacho** de órdenes de venta.

> El operario trabaja directamente con el mapa de inventario y las órdenes de trabajo. No crea documentos comerciales.

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`).
3. Ingresa su **correo o username**.
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** con la vista del operario.

---

## 3. Panel Principal

Al entrar, el operario ve:

- **Cola de órdenes de trabajo** asignadas a él o al equipo.
- Estado del **mapa de inventario** de su bodega.
- Alertas que requieren su atención.

---

## 4. Procesos del Operario

### 4.1 Ejecutar una orden de trabajo (OT)

1. Ver la cola de OT en el dashboard (asignadas por el jefe de bodega o generadas automáticamente).
2. Seleccionar la OT a ejecutar.
3. Ver las instrucciones: qué mover, desde qué slot, hacia dónde.
4. **Aplicar locking** en el slot origen (bloqueo temporal para evitar que otro operario lo use al mismo tiempo).
5. Ejecutar el movimiento físico de las cajas/lotes.
6. Registrar en el sistema: cajas movidas, peso, slot de destino.
7. **Liberar el locking** al terminar.
8. Marcar la OT como completada.

**Tipos de OT:**

| Tipo | Descripción |
| --- | --- |
| `a_bodega` | Llevar mercancía del muelle de entrada a los slots de almacenamiento |
| `a_salida` | Llevar mercancía de los slots al muelle de salida (para despacho) |
| `revisar` | Inspeccionar físicamente un lote o caja que tiene una incidencia |

### 4.2 Inspección de mercancía

Cuando una OT es de tipo `revisar` o cuando el custodio solicita inspección:

1. Ir al slot indicado.
2. Revisar el estado físico de las cajas: daños, temperatura, fecha de vencimiento visible.
3. Registrar en el sistema el resultado de la inspección.
4. Si hay daños: documentar y notificar al jefe de bodega.

### 4.3 Registrar inbound boxes

Cuando el custodio registra una recepción, puede requerir que los operarios registren las cajas que van ingresando:

1. El custodio abre la recepción.
2. El operario escanea o ingresa manualmente el código de cada caja/lote.
3. El sistema asocia la caja al lote y al slot de destino.

### 4.4 Locking de slots

El **locking** evita que dos operarios trabajen en el mismo slot simultáneamente (evita colisiones de inventario).

1. Antes de mover mercancía de un slot, seleccionar **Bloquear slot** en el mapa.
2. El slot queda en estado `locking` — otros operarios ven que está ocupado.
3. Al terminar, seleccionar **Liberar slot**.
4. Si el jefe de bodega necesita desbloquear un slot bloqueado sin actividad, puede hacerlo con override.

### 4.5 Participar en el despacho

Cuando hay una OV confirmada para despacho:

1. El jefe de bodega o custodio genera OT de tipo `a_salida`.
2. El operario ejecuta la OT: mueve las cajas del slot al muelle de salida.
3. El custodio verifica y cierra el despacho.

---

## 5. Permisos del Operario

| Acción | Permitido |
| --- | --- |
| Ver y ejecutar órdenes de trabajo asignadas | ✅ |
| Aplicar y liberar locking en slots | ✅ |
| Registrar movimientos de cajas entre slots | ✅ |
| Inspeccionar mercancía | ✅ |
| Ver mapa de inventario de su bodega | ✅ |
| Crear o modificar OT | ❌ (solo jefe de bodega o custodio las crean) |
| Hacer override de temperatura | ❌ |
| Crear SOL/OC/OV | ❌ |
| Crear usuarios | ❌ |

---

## 6. Interacción con otros roles

```
Jefe de bodega / Custodio
  └──→ Crean OT para el operario

Operario
  └──→ Ejecuta OT (a_bodega, a_salida, revisar)
  └──→ Coordina con: Custodio (recepciones y despachos)
  └──→ Reporta incidencias al: Jefe de bodega
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "Slot ya bloqueado (locking)" | Otro operario está trabajando en ese slot | Esperar a que lo libere o consultar con el jefe de bodega |
| "No se puede completar la OT" | El slot de destino está ocupado o hay discrepancias de peso | Verificar el slot y reportar al jefe de bodega |
| No aparecen OT en la cola | No hay recepciones o despachos activos, o las OT no fueron asignadas | Consultar con el jefe de bodega |
| El mapa no carga | Problema de conexión Realtime o datos sin inicializar | Refrescar la página o consultar con TI |
