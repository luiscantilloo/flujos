# Manual de Usuario — Jefe de Bodega

| Campo | Detalle |
| --- | --- |
| Rol | `jefe_bodega` |
| Nivel | Bodega |
| Creado por | `administrador_cuenta` |
| Scope de acceso | La bodega asignada (`id_bodega`) dentro del tenant |
| Ruta principal | `/dashboard` — vista de jefe de bodega |

---

## 1. ¿Quién es el Jefe de Bodega?

El **jefe de bodega** es el responsable operativo diario de la bodega. Es quien toma decisiones en tiempo real durante la operación: prioriza órdenes de trabajo, supervisa el ingreso y despacho, gestiona alertas y tiene autoridad para hacer override de temperatura cuando sea necesario.

Sus responsabilidades son:

- Priorizar y asignar **órdenes de trabajo (OT)** al equipo de operarios.
- Supervisar el **conteo ciego** de mercancía recibida.
- Autorizar y hacer **override de temperatura** en situaciones justificadas.
- Monitorear **alertas operativas** y resolverlas.
- Supervisar el proceso de **procesamiento** (OT de tipo procesamiento).
- Controlar el estado general del **mapa de inventario** de la bodega.

> El jefe de bodega tiene el mayor nivel de control operativo dentro de la bodega, por encima de custodio y operario.

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`).
3. Ingresa su **correo o username** (creado por el administrador de cuenta).
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** con la vista del jefe de bodega.

---

## 3. Panel Principal

Al entrar, el jefe de bodega ve:

- **Dashboard home** con el estado operativo de su bodega en tiempo real.
- Cola de **órdenes de trabajo (OT)** activas y pendientes.
- **Alertas** activas que requieren atención.
- Estado del **mapa de inventario** (slots ocupados, en locking, en alerta).
- Acceso al módulo de **procesamiento** y **transporte**.

---

## 4. Procesos del Jefe de Bodega

### 4.1 Supervisar y priorizar órdenes de trabajo (OT)

Las **órdenes de trabajo** son las instrucciones operativas para mover mercancía dentro de la bodega.

1. Ver la cola de OT activas en el dashboard.
2. Priorizar las órdenes según urgencia (recepciones, despachos, movimientos internos).
3. Asignar OT a operarios específicos si es necesario.
4. Marcar OT como completadas cuando el operario las finaliza.

**Tipos de OT:**
- `a_bodega`: ingresar mercancía de muelle a slot de bodega
- `a_salida`: mover mercancía de bodega a muelle de despacho
- `revisar`: inspección o reclasificación de un lote

### 4.2 Supervisar el conteo ciego

El **conteo ciego** es el proceso donde el custodio registra lo que recibe sin ver la OC, para luego conciliar con el sistema.

1. El custodio registra la recepción.
2. El jefe de bodega verifica que el conteo ciego coincide con la OC.
3. Si hay discrepancias, autoriza ajustes o levanta una incidencia.

### 4.3 Override de temperatura

Si la temperatura registrada al ingreso está fuera de rango pero la mercancía está en condiciones:

1. Ir a la incidencia de temperatura en el dashboard o alertas.
2. Revisar los datos del sensor y el estado físico de la mercancía.
3. Hacer **override** con justificación documentada.
4. El sistema registra el override con el `id_usuario` del jefe en `auditoria_operacion`.

> El override queda en el historial de auditoría y es visible para el administrador de cuenta.

### 4.4 Gestionar alertas operativas

1. Revisar el panel de alertas activas.
2. Tipos de alertas:
   - **Temperatura** fuera de rango (sensor o ingreso)
   - **Locking** — slot bloqueado sin movimiento por tiempo prolongado
   - **OT retrasada** — orden de trabajo sin completar en tiempo esperado
   - **Stock bajo** — cantidad en lote por debajo del umbral
3. Tomar acción: resolver, escalar o documentar.

### 4.5 Supervisar el procesamiento

1. Ir a `/dashboard/procesamiento`.
2. Ver las **solicitudes de procesamiento** activas.
3. Autorizar o asignar al procesador.
4. Ver el balance de masa: insumo → producto primario → secundario + merma.

### 4.6 Monitorear el mapa de inventario

1. Ir a `/dashboard/mapa`.
2. Ver el estado de cada slot en tiempo real (Realtime Supabase).
3. Identificar zonas con alta ocupación, slots bloqueados o lotes próximos a vencer.

---

## 5. Permisos del Jefe de Bodega

| Acción | Permitido |
| --- | --- |
| Ver y priorizar órdenes de trabajo | ✅ |
| Supervisar conteo ciego | ✅ |
| Hacer override de temperatura (con auditoría) | ✅ |
| Gestionar alertas operativas | ✅ |
| Ver mapa de inventario en tiempo real | ✅ |
| Supervisar procesamiento | ✅ |
| Crear SOL/OC/OV | ❌ (ese es el operador de cuenta) |
| Crear usuarios | ❌ |
| Acceder a bodegas de otras cuentas | ❌ |

---

## 6. Interacción con otros roles

```
Administrador de cuenta
  └──→ Crea al: Jefe de bodega

Jefe de bodega
  └──→ Supervisa a: Custodio, Operario, Procesador
  └──→ Coordina con: Administrador de bodega (supervisión general)
  └──→ Recibe OC del: Operador de cuenta (para planificar recepciones)
  └──→ Habilita despacho para: Transportista
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| No puede hacer override de temperatura | El sistema requiere rol específico o la funcionalidad está en desarrollo | Verificar con TI |
| Las OT no aparecen en la cola | No hay recepciones o despachos activos, o el módulo está en desarrollo | Verificar estado de OC y el módulo de ingreso |
| El mapa no muestra datos en tiempo real | Suscripción Realtime no activa o migración pendiente | Verificar con TI el estado de `warehouse_state` |
| Alertas no se marcan como resueltas | Bug o funcionalidad en desarrollo | Documentar y reportar a TI |
