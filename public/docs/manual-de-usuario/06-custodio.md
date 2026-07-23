# Manual de Usuario — Custodio

| Campo | Detalle |
| --- | --- |
| Rol | `custodio` |
| Nivel | Bodega |
| Creado por | `administrador_cuenta` |
| Scope de acceso | La bodega asignada (`id_bodega`) dentro del tenant |
| Ruta principal | `/dashboard` — vista de custodio |

---

## 1. ¿Quién es el Custodio?

El **custodio** es el responsable físico del muelle de la bodega. Es quien **recibe la mercancía** cuando llega de los proveedores y quien **despacha la mercancía** cuando sale hacia los compradores.

Sus responsabilidades son:

- **Recibir** vehículos de transporte entrante.
- **Validar** documentos de la mercancía recibida (OC, guías de despacho del proveedor).
- **Registrar temperatura** de ingreso de la mercancía.
- **Inspeccionar** el estado físico de las cajas/lotes.
- **Registrar inbound boxes** (cajas y lotes que ingresan a bodega).
- Coordinar la **salida cruzada** (mercancía que llega y sale el mismo día sin almacenar).
- **Despachar** órdenes de venta: preparar y cargar la mercancía que sale.

> El custodio es el **guardián del muelle**. Sin su validación, ninguna mercancía puede ingresar ni salir de la bodega.

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`).
3. Ingresa su **correo o username** (creado por el administrador de cuenta).
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** con la vista del custodio.

---

## 3. Panel Principal

Al entrar, el custodio ve:

- **Dashboard home** con las recepciones esperadas del día (OC emitidas).
- OV pendientes de despacho.
- Alertas de temperatura activas.
- Acceso rápido al módulo de ingreso y despacho.

---

## 4. Procesos del Custodio

### 4.1 Recepción de mercancía (Ingreso)

**Paso a paso:**

1. Un vehículo llega al muelle con mercancía.
2. Ir a `/dashboard/ingreso`.
3. Seleccionar la **Orden de Compra (OC)** emitida correspondiente (o crear ingreso libre si no hay OC).
4. Iniciar el **conteo ciego**:
   - Registrar lo que físicamente llega **sin ver la OC** primero.
   - Cantidad de cajas/bolsas, peso en kg, número de lote si aplica.
5. **Registrar temperatura de ingreso** de la mercancía.
   - Si está dentro del rango: continuar.
   - Si está fuera del rango: se genera alerta. El jefe de bodega puede hacer override.
6. **Inspeccionar** el estado físico:
   - Verificar que no hay daños, derrames ni contaminación.
   - Registrar observaciones si las hay.
7. **Registrar inbound boxes**: asignar cada caja/lote a un slot de la bodega.
8. El sistema crea automáticamente una **orden de trabajo (OT)** de tipo `a_bodega` para que el operario ubique la mercancía.
9. **Cerrar la recepción** marcando la OC como recibida.

**Conciliación ciega:**
Después del conteo ciego, el sistema compara lo registrado con la OC. Si hay diferencias:
- Cantidades faltantes: se registran como pendiente.
- Cantidades adicionales: se registran como exceso.
- El jefe de bodega valida y cierra la recepción.

### 4.2 Validar documentos

Antes de registrar el ingreso, el custodio debe validar:

- **Guía de despacho del proveedor** coincide con la OC.
- **Temperatura del vehículo** (camión frigorífico) está dentro del rango exigido.
- **Fecha de vencimiento** del producto está dentro del margen aceptable.

### 4.3 Salida cruzada (Cross-docking)

La **salida cruzada** es cuando la mercancía llega y sale el mismo día sin ingresar a los slots de almacenamiento.

1. Al registrar el ingreso, seleccionar la opción **Salida cruzada**.
2. Vincular con la OV que debe ser despachada el mismo día.
3. La mercancía va directamente del muelle de entrada al muelle de salida.
4. El sistema crea la OT correspondiente.

### 4.4 Despacho de órdenes de venta (OV)

1. Ir al módulo de **despacho** (sección de ventas o transporte).
2. Ver las OV confirmadas y listas para despachar.
3. Preparar la mercancía: verificar slots, cajas, lotes (FEFO automático propuesto).
4. Coordinar con el **transportista** el vehículo y la guía de envío.
5. **Cargar la mercancía** al vehículo.
6. Registrar el despacho: peso total, lotes despachados, número de guía.
7. El sistema actualiza el inventario y genera el viaje de transporte.

### 4.5 Registro de temperatura de ingreso

La temperatura es crítica en una bodega fría. Al recibir mercancía:

1. Medir la temperatura del producto con el dispositivo de la bodega.
2. Registrar en el sistema: temperatura medida, temperatura objetivo del producto, hora de medición.
3. El sistema valida automáticamente si está dentro del rango permitido.
4. Si está fuera del rango, se activa alerta y se requiere autorización del jefe de bodega.

---

## 5. Permisos del Custodio

| Acción | Permitido |
| --- | --- |
| Registrar recepción de mercancía (conteo ciego) | ✅ |
| Registrar temperatura de ingreso | ✅ |
| Inspeccionar y documentar estado físico | ✅ |
| Registrar inbound boxes y asignar slots iniciales | ✅ |
| Gestionar salida cruzada | ✅ |
| Despachar órdenes de venta | ✅ |
| Ver el mapa de inventario | ✅ |
| Override de temperatura | ❌ (solo jefe de bodega) |
| Crear SOL/OC/OV | ❌ |
| Crear usuarios | ❌ |

---

## 6. Interacción con otros roles

```
Operador de cuenta
  └──→ Crea OC → Custodio la recibe físicamente

Jefe de bodega
  └──→ Supervisa al custodio
  └──→ Autoriza overrides de temperatura
  └──→ Valida conteos ciegos con discrepancias

Custodio
  └──→ Genera OT para: Operario (ubicar mercancía en slots)
  └──→ Coordina con: Transportista (vehículos, guías de despacho)
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "No se puede cerrar la recepción" | Hay discrepancias en el conteo ciego sin resolver | El jefe de bodega debe validar y cerrar |
| Temperatura registrada genera alerta inmediata | La temperatura está fuera del rango configurado | El jefe de bodega puede hacer override si es justificado |
| "OC no encontrada" | La OC no está en estado `emitida` | Verificar con el operador de cuenta que la OC fue emitida |
| "Slot no disponible" | El slot está ocupado o en locking | Ver el mapa de inventario y elegir otro slot disponible |
| No puede despachar la OV | La OV no está confirmada o el módulo está en desarrollo | Verificar con el operador de cuenta y TI |
