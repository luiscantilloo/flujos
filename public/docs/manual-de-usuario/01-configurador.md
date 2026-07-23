# Manual de Usuario — Configurador (TI)

| Campo | Detalle |
| --- | --- |
| Rol | `configurador` |
| Nivel | Plataforma |
| Creado por | Equipo TI del proveedor SaaS (acceso directo en Supabase Auth) |
| Scope de acceso | Global — todas las empresas y tenants |
| Ruta principal | `/configurador` |

---

## 1. ¿Quién es el Configurador?

El **configurador** es el equipo de TI del proveedor SaaS de Polaria WMS. Es el rol más privilegiado del sistema. **No representa a ningún cliente** — representa al proveedor del software.

Sus responsabilidades son:

- Dar de alta a nuevos clientes (empresas) en la plataforma.
- Crear los tenants (cuentas operativas) de cada empresa.
- Crear bodegas internas y externas.
- Crear y asignar el primer **administrador de cuenta** de cada cliente.
- Gestionar integraciones entre bodegas internas y externas.
- Revisar todas las solicitudes de integración de cualquier empresa.

> **Importante:** El configurador **no opera mercancía**. No ve inventarios, no hace compras ni ventas. Su función es puramente de configuración de la plataforma.

---

## 2. Login

El configurador tiene un flujo de login **diferente** al resto de usuarios:

1. Abre la aplicación en `/login`.
2. **No ingresa código de empresa** (ese campo es para usuarios de clientes).
3. Ingresa su **correo** (el configurador siempre usa correo, no username).
4. Ingresa su contraseña.
5. El sistema detecta automáticamente que es un configurador y lo redirige al **panel de plataforma** (`/configurador`).

> **Nota:** Si el sistema pide código de empresa, es porque no reconoció la cuenta como plataforma. Verificar que el usuario tenga `id_rol = 'configurador'` en Supabase.

---

## 3. Panel Principal (`/configurador`)

Al entrar, el configurador ve el **panel de plataforma** con las siguientes opciones:

| Sección | Descripción |
| --- | --- |
| **Creación** | Crear cuentas, bodegas internas, bodegas externas |
| **Asignación** | Asignar usuarios cross-cuenta |
| **Integración** | Bandeja de solicitudes de integración de todas las cuentas |

---

## 4. Procesos del Configurador

### 4.1 Dar de alta una nueva empresa (cliente)

1. Ir a `/configurador/creacion`.
2. Seleccionar **Crear cuenta**.
3. Completar el formulario:
   - **Nombre de la empresa** (razón social o nombre comercial)
   - **Código de empresa** (`codigoEmpresa`) — identificador único, p.ej. `EMP001`
   - **Correo y datos del administrador de cuenta** (primer usuario del cliente)
4. El sistema:
   - Crea la empresa en la tabla `empresa`.
   - Crea el usuario `administrador_cuenta` en Supabase Auth.
   - Crea la cuenta (tenant) bajo esa empresa.
5. Confirmar que el administrador de cuenta recibió sus credenciales.

> **Resultado:** El cliente ahora puede iniciar sesión con su `codigoEmpresa` + correo + contraseña.

### 4.2 Crear una bodega interna

1. Ir a `/configurador/creacion/bodega-interna`.
2. Completar el formulario:
   - **Nombre de la bodega**
   - **Cuenta (tenant)** a la que pertenece
   - **Capacidad y configuración** (tipo, zonas, slots)
3. El sistema llama a `POST /configuracion/bodegas` y realiza el bootstrap de layout (zonas, ubicaciones).
4. Una vez creada, el administrador de cuenta puede asignar el equipo de bodega.

### 4.3 Crear una bodega externa

1. Ir a `/configurador/creacion/bodega-externa`.
2. Completar el formulario con los datos de la bodega externa (Fridem u otro proveedor).
3. El sistema registra la bodega como tipo `externa` con integración configurada.

### 4.4 Asignar usuarios cross-cuenta

1. Ir a `/configurador/asignacion/usuarios`.
2. Buscar el usuario a asignar y seleccionar la cuenta destino.
3. El sistema actualiza la asignación de bodega del usuario.

> Útil cuando un usuario operativo necesita acceder a bodegas de múltiples cuentas.

### 4.5 Revisar solicitudes de integración

1. Ir a `/configurador/integracion`.
2. La bandeja muestra todas las solicitudes de bodega externa de todas las cuentas.
3. Aprobar o rechazar cada solicitud.
4. Endpoint correspondiente: `GET /configurador/integracion/solicitudes`.

---

## 5. Permisos del Configurador

| Acción | Permitido |
| --- | --- |
| Crear empresas | ✅ |
| Crear cuentas (tenants) | ✅ |
| Crear bodegas internas y externas | ✅ |
| Crear usuarios de cualquier rol | ✅ (vía `POST /configurador/usuarios`) |
| Ver bandeja de integración global | ✅ |
| Ver inventario de mercancía de un tenant | ❌ |
| Crear/modificar órdenes de compra o venta | ❌ |
| Operar en bodega (mover cajas, lotes, etc.) | ❌ |

---

## 6. Interacción con otros roles

```
Configurador
  └──→ Crea: Administrador de cuenta (primer usuario de cada empresa)
  └──→ Crea: Bodegas (que luego el admin cuenta configura)
  └──→ Aprueba: Solicitudes de integración con bodegas externas
```

El configurador es el **punto de partida** de toda empresa. Sin él, ningún cliente puede comenzar a operar.

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "No se puede crear la empresa" | `codigoEmpresa` ya existe | Usar un código único distinto |
| "No se puede crear la bodega" | La cuenta (tenant) no existe aún | Crear la cuenta primero |
| "Usuario ya existe" | El correo ya está registrado en Supabase Auth | Usar otro correo o recuperar el acceso existente |
| Login redirige al panel de empresa (no al de plataforma) | El rol del usuario no es `configurador` | Verificar en Supabase que `id_rol = 'configurador'` |
| La solicitud de integración no aparece en la bandeja | La cuenta aún no la creó | El admin cuenta debe crearla primero desde `/dashboard/administracion` |
