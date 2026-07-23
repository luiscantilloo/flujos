# Manual de Usuario — Administrador de Cuenta

| Campo | Detalle |
| --- | --- |
| Rol | `administrador_cuenta` |
| Nivel | Cuenta (Tenant) |
| Creado por | `configurador` |
| Scope de acceso | Su empresa (`codigoEmpresa`) + su cuenta (`codigoCuenta`) |
| Ruta principal | `/dashboard` → `/dashboard/administracion` |

---

## 1. ¿Quién es el Administrador de Cuenta?

El **administrador de cuenta** es el responsable del cliente dentro de la plataforma Polaria WMS. El configurador (TI) lo crea y le asigna una empresa. Es el **primer usuario operativo** de cada empresa.

Sus responsabilidades son:

- Configurar y gestionar su cuenta (tenant) completa.
- Crear y gestionar a todos los usuarios de su empresa (operadores, jefes, custodios, etc.).
- Mantener los catálogos de productos, proveedores, compradores, camiones y plantas.
- Vincular bodegas internas y externas a su cuenta.
- Supervisar reportes de inventario de mercancía.
- Tiene visibilidad de toda la operación de su cuenta.

> **Importante:** El administrador de cuenta **no crea la empresa ni el tenant**; los hereda del configurador (TI). Su trabajo empieza cuando el TI ya configuró la estructura base.

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`) que le asignó TI.
3. Ingresa su **correo** (el sistema valida que el correo pertenezca a esa empresa).
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** (`/dashboard`).

> **Nota:** Si el correo no es reconocido, verificar que el administrador de cuenta fue creado con ese correo exacto por el configurador.

---

## 3. Panel Principal

Al entrar, el administrador de cuenta ve:

- **Dashboard home** con widgets de estado general de su cuenta.
- Acceso rápido a todas las secciones operativas.
- Botón de **Administración** que lleva a `/dashboard/administracion`.

### 3.1 Menú de Administración (`/dashboard/administracion`)

| Sección | Ruta | Descripción |
| --- | --- | --- |
| Catálogo de productos | `/dashboard/administracion/catalogo` | CRUD de productos del tenant |
| Proveedores | `/dashboard/administracion/asignacion-creacion/proveedores` | Lista y alta de proveedores |
| Compradores | `/dashboard/administracion/asignacion-creacion/compradores` | Lista y alta de compradores |
| Camiones | `/dashboard/administracion/asignacion-creacion/camiones` | Flota de camiones |
| Usuarios | `/dashboard/administracion/asignacion-creacion/usuarios` | Usuarios de la cuenta |
| Bodegas internas | `/dashboard/administracion/asignacion-creacion/bodega-interna` | Ver y vincular bodegas internas |
| Bodegas externas | `/dashboard/administracion/asignacion-creacion/bodega-externa` | Ver y vincular bodegas externas |
| Reportería de inventario | `/dashboard/reporteria` | Reporte de mercancía por bodega |

---

## 4. Procesos del Administrador de Cuenta

### 4.1 Crear un nuevo usuario

El administrador de cuenta puede crear cualquier tipo de usuario para su empresa.

1. Ir a `/dashboard/administracion/asignacion-creacion/usuarios`.
2. Hacer clic en **Crear usuario**.
3. Completar el formulario:
   - **Nombre completo**
   - **Username** (identificador para login)
   - **Correo electrónico**
   - **Contraseña** (mínimo 6 caracteres)
   - **Rol** (ver tabla de roles disponibles más abajo)
   - **Bodega** (obligatorio para roles de bodega)
4. El sistema llama a `POST /administracion/usuarios`.
5. El nuevo usuario ya puede iniciar sesión con su `codigoEmpresa` + correo + contraseña.

> **Roles que puede crear:** `operador_cuenta`, `administrador_bodega`, `jefe_bodega`, `custodio`, `operario`, `procesador`, `transportista`.

### 4.2 Gestionar el catálogo de productos

El catálogo de productos es la base para todas las órdenes de compra y venta.

1. Ir a `/dashboard/administracion/catalogo`.
2. Se puede:
   - **Crear** un producto nuevo (nombre, SKU, tipo primario/secundario, unidad, temperatura)
   - **Editar** un producto existente
   - **Crear producto secundario** (resultado del procesamiento de un primario)
3. Los productos creados aquí están disponibles al crear órdenes de compra y venta.

### 4.3 Registrar proveedores

1. Ir a `/dashboard/administracion/asignacion-creacion/proveedores`.
2. Hacer clic en **Crear proveedor**.
3. Completar: nombre, RUT/NIT, contacto, dirección.
4. El proveedor queda disponible para usarse en órdenes de compra.

### 4.4 Registrar compradores

Los compradores son los destinatarios de las órdenes de venta.

1. Ir a `/dashboard/administracion/asignacion-creacion/compradores`.
2. Hacer clic en **Crear comprador**.
3. Completar: nombre, contacto, dirección de despacho.

### 4.5 Gestionar flota de camiones

1. Ir a `/dashboard/administracion/asignacion-creacion/camiones`.
2. Hacer clic en **Crear camión**.
3. Completar: patente/placa, tipo de camión, capacidad.
4. Los camiones registrados se asignan a viajes de transporte.

### 4.6 Vincular bodega externa (Solicitud de integración)

Si la empresa usa bodegas externas (p.ej., Fridem):

1. Ir a `/dashboard/administracion/asignacion-creacion/bodega-externa`.
2. Seleccionar **Vincular bodega externa**.
3. Completar los datos de la bodega externa.
4. El sistema crea una `SolicitudIntegracion` que el configurador debe aprobar.
5. Una vez aprobada, la bodega externa aparece en el inventario.

### 4.7 Ver reportería de inventario

1. Ir a `/dashboard/reporteria`.
2. Seleccionar la bodega y el período.
3. Ver el reporte de inventario de mercancía (kg, lotes, estado).
4. Exportar en PDF o Excel si es necesario.

---

## 5. Permisos del Administrador de Cuenta

| Acción | Permitido |
| --- | --- |
| Crear usuarios de todos los roles (menos configurador) | ✅ |
| Gestionar catálogos (productos, proveedores, compradores, camiones) | ✅ |
| Ver reportes de inventario de su cuenta | ✅ |
| Vincular bodegas internas y externas | ✅ |
| Ver todos los módulos operativos de su cuenta | ✅ |
| Crear órdenes de compra y venta | ✅ (puede, pero usualmente lo hace el operador de cuenta) |
| Crear empresas o cuentas | ❌ (solo el configurador) |
| Acceder a datos de otras cuentas | ❌ |

---

## 6. Interacción con otros roles

```
Configurador (TI)
  └──→ Crea al: Administrador de cuenta

Administrador de cuenta
  └──→ Crea a: Operador de cuenta, Administrador de bodega, Jefe de bodega,
               Custodio, Operario, Procesador, Transportista
  └──→ Supervisa: Toda la operación de su cuenta
  └──→ Apoya a: Operador de cuenta (catálogos y permisos)
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "No se puede crear el usuario" (409) | El username o correo ya existe | Usar datos únicos |
| "Bodega no pertenece al tenant" (403) | Intentó asignar una bodega de otra cuenta | Solo asignar bodegas creadas bajo su `codigoCuenta` |
| No aparece la opción de bodega al crear usuario | El rol elegido no requiere bodega | Solo roles bodega (`jefe_bodega`, `custodio`, etc.) requieren bodega |
| La solicitud de integración de bodega externa no se aprueba | Pendiente con el configurador | Contactar a TI para que revise la bandeja de integración |
| No ve el dashboard de un módulo (ingreso, ventas, etc.) | No hay permisos de rol o el módulo está en desarrollo | Verificar con TI el estado del módulo |
