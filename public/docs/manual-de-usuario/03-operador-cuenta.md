# Manual de Usuario — Operador de Cuenta

| Campo | Detalle |
| --- | --- |
| Rol | `operador_cuenta` |
| Nivel | Cuenta (Tenant) |
| Creado por | `administrador_cuenta` |
| Scope de acceso | Su cuenta (`codigoCuenta`) — operación comercial |
| Ruta principal | `/dashboard` → Ingreso, Ventas, Procesamiento |

---

## 1. ¿Quién es el Operador de Cuenta?

El **operador de cuenta** es el usuario comercial y logístico de la empresa. Opera el tenant a nivel de documentos: crea solicitudes de compra, órdenes de compra, órdenes de venta y gestiona la integración con bodegas externas.

Sus responsabilidades son:

- Crear y gestionar **Solicitudes de Compra (SOL)** y **Órdenes de Compra (OC)**.
- Crear y gestionar **Órdenes de Venta (OV)**.
- Gestionar solicitudes de integración con bodegas externas.
- Ver el estado general de los procesos de su tenant.

> **No opera físicamente en bodega** — eso lo hacen jefe, custodio y operario. El operador de cuenta trabaja en los documentos comerciales.

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`).
3. Ingresa su **correo** (creado por el administrador de cuenta).
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** operativo.

---

## 3. Panel Principal

Al entrar, el operador de cuenta ve:

- **Dashboard home** con el estado de sus documentos abiertos (SOL, OC, OV).
- Acceso a los módulos de Ingreso, Ventas y Procesamiento.
- Widget del chat Mateo (burbuja flotante en la esquina inferior derecha).

---

## 4. Procesos del Operador de Cuenta

### 4.1 Solicitud de Compra (SOL)

La **Solicitud de Compra (SOL)** es el documento previo a la Orden de Compra. Se usa para solicitar aprobación antes de comprometerse con un proveedor.

**Crear una SOL:**
1. Ir a `/dashboard/ingreso`.
2. Seleccionar **Nueva solicitud de compra**.
3. Completar el formulario:
   - **Proveedor** (del catálogo)
   - **Bodega destino** (interna del tenant)
   - **Líneas de productos**: producto, cantidad, unidad, precio
4. Guardar como **borrador** o **enviar a aprobación**.

**Estados de la SOL:**

| Estado | Descripción | Acción disponible |
| --- | --- | --- |
| `borrador` | Creada, no enviada | Editar, enviar a aprobación, cancelar |
| `pendiente_aprobacion` | Enviada, esperando aprobación | Aprobar, rechazar, cancelar |
| `aprobada` | Aprobada — lista para convertir a OC | Convertir a OC |
| `rechazada` | Rechazada | Solo ver |
| `cancelada` | Cancelada | Solo ver |

**Convertir SOL aprobada a OC:**
1. Abrir la SOL en estado `aprobada`.
2. Hacer clic en **Convertir a Orden de Compra**.
3. El sistema crea automáticamente la OC con las mismas líneas.

> Endpoint: `POST /compras/solicitudes/:id/convertir-oc`

### 4.2 Orden de Compra (OC)

La **Orden de Compra (OC)** es el documento definitivo de compra a un proveedor.

**Crear una OC directa** (sin pasar por SOL):
1. Ir a `/dashboard/ingreso`.
2. Seleccionar **Nueva orden de compra**.
3. Completar proveedor, bodega, líneas de productos.
4. Emitir la OC.

**Estados de la OC:**

| Estado | Descripción |
| --- | --- |
| `borrador` | Creada, no emitida |
| `emitida` | Enviada al proveedor (la mercancía puede llegar) |
| `cancelada` | Cancelada |

> **Recepción de OC:** cuando la mercancía llega, el **custodio** registra la recepción física. El operador de cuenta puede ver el estado de recepción desde el detalle de la OC.

### 4.3 Orden de Venta (OV)

La **Orden de Venta (OV)** registra el compromiso de entrega de mercancía a un comprador.

1. Ir a `/dashboard/ventas`.
2. Seleccionar **Nueva orden de venta**.
3. Completar:
   - **Comprador** (del catálogo)
   - **Bodega origen**
   - **Líneas de productos**: producto, cantidad, lote (FEFO automático propuesto)
4. Confirmar la OV.

> **Estado actual:** La UI de ventas (`/dashboard/ventas`) existe como shell. Los endpoints de OV completos están en desarrollo.

### 4.4 Solicitudes de integración con bodega externa

Si la empresa tiene integración con bodegas externas (Fridem u otra):

1. Ir a `/dashboard` → sección de integración de cuenta.
2. Crear una **solicitud de integración**.
3. El configurador la aprueba.
4. Una vez aprobada, los datos de la bodega externa están disponibles.

> Endpoint: `POST /integracion/solicitudes`

---

## 5. Permisos del Operador de Cuenta

| Acción | Permitido |
| --- | --- |
| Crear SOL, editar borrador, enviar a aprobación | ✅ |
| Aprobar/rechazar SOL | ✅ |
| Convertir SOL aprobada a OC | ✅ |
| Crear OC directa | ✅ |
| Emitir OC | ✅ |
| Crear OV | ✅ |
| Gestionar solicitudes de integración | ✅ |
| Ver catálogos de su cuenta | ✅ |
| Crear usuarios | ❌ (solo el administrador de cuenta) |
| Operar físicamente en bodega | ❌ |
| Acceder a datos de otras cuentas | ❌ |

---

## 6. Interacción con otros roles

```
Administrador de cuenta
  └──→ Crea al: Operador de cuenta

Operador de cuenta
  └──→ Crea SOL/OC → Custodio recibe la mercancía física
  └──→ Crea OV → Operario/Custodio prepara el despacho
  └──→ Crea solicitud de integración → Configurador la aprueba
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "No se puede editar la SOL" | La SOL ya no está en borrador | Solo se puede editar en estado `borrador` |
| "No se puede convertir a OC" | La SOL no está en estado `aprobada` | Aprobarla primero |
| "Proveedor no disponible" | El proveedor no está en el catálogo | Pedir al administrador de cuenta que lo cree |
| "Producto no encontrado" | No está en el catálogo del tenant | Pedir al administrador que lo agregue |
| La OV no aparece disponible | Módulo en desarrollo | Estado actual del sistema: ventas en proceso de implementación |
