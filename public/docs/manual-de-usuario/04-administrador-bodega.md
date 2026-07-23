# Manual de Usuario — Administrador de Bodega

| Campo | Detalle |
| --- | --- |
| Rol | `administrador_bodega` |
| Nivel | Bodega |
| Creado por | `administrador_cuenta` |
| Scope de acceso | La bodega asignada (`id_bodega`) dentro del tenant |
| Ruta principal | `/dashboard` — vista de administrador de bodega |

---

## 1. ¿Quién es el Administrador de Bodega?

El **administrador de bodega** es el responsable de la configuración operativa y supervisión general de una bodega física asignada. Su función es estructural y de supervisión, no de operación diaria.

Sus responsabilidades son:

- Supervisar el estado general de la bodega asignada.
- Configurar parámetros operativos de la bodega (si la plataforma lo permite).
- Supervisar alertas operativas y reportes de estado.
- Gestionar incidencias junto al jefe de bodega.

> **Diferencia con Jefe de Bodega:** el administrador de bodega tiene un rol más de gestión y supervisión; el jefe de bodega tiene el control operativo diario (priorización de órdenes de trabajo, temperatura, conteo ciego).

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`).
3. Ingresa su **correo** (creado por el administrador de cuenta).
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** con la vista del administrador de bodega.

> Solo ve y opera dentro de la bodega que le asignó el administrador de cuenta.

---

## 3. Panel Principal

Al entrar, el administrador de bodega ve:

- **Dashboard home** con el estado de su bodega.
- Estado de alertas activas.
- Resumen de operaciones en curso (recepciones, despachos, procesamiento).
- Acceso al mapa de inventario de su bodega.

---

## 4. Procesos del Administrador de Bodega

### 4.1 Supervisar el estado de la bodega

1. Ir al **mapa de inventario** (`/dashboard/mapa`).
2. Ver el estado de cada slot: ocupado, libre, bloqueado (locking), en alerta de temperatura.
3. Monitorear % de ocupación, temperatura general, alertas activas.

### 4.2 Gestionar alertas operativas

1. Revisar las alertas activas en el dashboard.
2. Coordinar con el jefe de bodega o custodio la resolución.
3. Marcar alertas como resueltas cuando corresponda.

> **Tipos de alertas:** temperatura fuera de rango, slot bloqueado sin actividad, incidencia en recepción, despacho demorado.

### 4.3 Ver reportes de bodega

1. Ir a `/dashboard/reporteria`.
2. Seleccionar el período y el tipo de reporte (ocupación, movimientos, merma).
3. Ver el detalle de operaciones de la bodega asignada.

### 4.4 Configuración operativa de la bodega

El administrador de bodega puede ajustar parámetros operativos como:

- Temperaturas objetivo por zona.
- Configuración de alertas (umbrales).
- Reglas de ordenamiento FEFO/FIFO.

> Estas funcionalidades están en desarrollo progresivo. Consultar con TI el estado actual.

---

## 5. Permisos del Administrador de Bodega

| Acción | Permitido |
| --- | --- |
| Ver estado e inventario de su bodega | ✅ |
| Ver y gestionar alertas de su bodega | ✅ |
| Ver reportes de su bodega | ✅ |
| Supervisar operaciones en curso | ✅ |
| Crear/modificar usuarios | ❌ (solo el administrador de cuenta) |
| Crear SOL/OC/OV | ❌ |
| Acceder a bodegas de otras cuentas | ❌ |

---

## 6. Interacción con otros roles

```
Administrador de cuenta
  └──→ Crea al: Administrador de bodega

Administrador de bodega
  └──→ Supervisa: Jefe de bodega, Custodio, Operario, Procesador, Transportista
  └──→ Coordina con: Jefe de bodega (operación diaria)
  └──→ Reporta a: Administrador de cuenta
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| No ve la bodega en el dashboard | La asignación de bodega no está activa | Pedir al administrador de cuenta que verifique la `asignacion_bodega` |
| El mapa no carga | Migración de `warehouse_state` pendiente o datos sin inicializar | Verificar con TI que el bootstrap de layout fue ejecutado |
| No puede acceder a la sección de configuración | Funcionalidad en desarrollo | Consultar con TI el estado actual |
