# Manual de Usuario — Transportista

| Campo | Detalle |
| --- | --- |
| Rol | `transportista` |
| Nivel | Bodega |
| Creado por | `administrador_cuenta` |
| Scope de acceso | La bodega asignada (`id_bodega`) dentro del tenant |
| Ruta principal | `/dashboard/transporte` |

---

## 1. ¿Quién es el Transportista?

El **transportista** es el conductor que realiza los viajes de entrega de mercancía desde la bodega hasta los compradores. En el sistema, registra cada viaje, las entregas realizadas y las evidencias (fotos, firma, GPS).

Sus responsabilidades son:

- Registrar el inicio y cierre de **viajes de transporte (TV)**.
- Registrar **guías de envío** por cada entrega en el viaje.
- Subir **evidencias** de cada entrega: foto de la mercancía entregada, firma del receptor, registro de GPS.
- Informar incidencias durante el transporte (retrasos, daños, rechazos).

> Cada viaje tiene un identificador único en formato **TV-####** (ej. TV-0021).

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`).
3. Ingresa su **correo o username**.
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** con acceso al módulo de transporte.

---

## 3. Panel Principal

Al entrar, el transportista ve:

- **Viajes activos** asignados a él.
- Guías de envío pendientes de entrega.
- Acceso al módulo de transporte (`/dashboard/transporte`).

---

## 4. Procesos del Transportista

### 4.1 Iniciar un viaje (TV)

Un viaje de transporte es generado por el custodio o jefe de bodega al confirmar un despacho.

1. Ir a `/dashboard/transporte`.
2. Ver los viajes asignados (estado `pendiente`).
3. Seleccionar el viaje a iniciar.
4. Ver las **guías de envío** del viaje: cada guía representa una entrega a un comprador.
5. **Confirmar el inicio** del viaje: registrar hora de salida y estado del vehículo.

### 4.2 Registrar una entrega

Para cada parada del viaje:

1. En el viaje activo, seleccionar la guía de envío correspondiente.
2. Ver los detalles: comprador, dirección, productos a entregar.
3. Llegar al destino y entregar la mercancía.
4. Registrar la entrega en el sistema:
   - **Foto de la mercancía entregada** (requerida)
   - **Firma del receptor** (requerida)
   - **Coordenadas GPS** (automático desde el dispositivo)
   - **Observaciones** (si hay alguna incidencia)
5. Marcar la guía como `entregada`.

**Estados de la guía de envío:**

| Estado | Descripción |
| --- | --- |
| `pendiente` | Lista para ser entregada |
| `en_ruta` | El transportista está en camino |
| `entregada` | Entrega confirmada con evidencias |
| `rechazada` | El receptor rechazó la mercancía |
| `incidencia` | Problema durante la entrega |

### 4.3 Registrar una incidencia

Si hay un problema durante la entrega (rechazo, daño, cliente no presente):

1. En la guía de envío correspondiente, seleccionar **Registrar incidencia**.
2. Seleccionar el tipo de incidencia (rechazo, daño, dirección incorrecta, etc.).
3. Subir foto de evidencia del problema.
4. El jefe de bodega o administrador de cuenta es notificado de la incidencia.

### 4.4 Cerrar un viaje

Al terminar todas las entregas:

1. En el viaje activo, verificar que todas las guías están en estado `entregada`, `rechazada` o `incidencia`.
2. Seleccionar **Cerrar viaje**.
3. Registrar hora de regreso a bodega.
4. El sistema actualiza el estado del viaje a `cerrado` y genera el resumen de entregas.

### 4.5 Evidencias requeridas

El sistema exige evidencias en cada entrega para garantizar trazabilidad y cumplimiento legal:

| Evidencia | Descripción | Obligatoria |
| --- | --- | --- |
| Foto mercancía entregada | Fotografía del producto en el destino | ✅ |
| Firma del receptor | Firma digital o manuscrita del que recibe | ✅ |
| GPS / coordenadas | Ubicación al momento de la entrega | ✅ (automático) |
| Foto incidencia | Evidencia del problema si hay rechazo o daño | ✅ si hay incidencia |

> Las evidencias se almacenan en **Cloudinary** y quedan vinculadas a la guía de envío.

---

## 5. Permisos del Transportista

| Acción | Permitido |
| --- | --- |
| Ver viajes asignados a él | ✅ |
| Iniciar y cerrar viajes | ✅ |
| Registrar entregas con evidencias | ✅ |
| Registrar incidencias | ✅ |
| Ver guías de envío de su viaje | ✅ |
| Ver el estado de otros viajes | ❌ (solo sus propios viajes) |
| Crear guías de envío o viajes | ❌ (los crea el custodio / jefe de bodega) |
| Crear SOL/OC/OV | ❌ |
| Crear usuarios | ❌ |

---

## 6. Interacción con otros roles

```
Custodio / Jefe de bodega
  └──→ Crea el: Viaje de transporte (TV) y guías de envío

Transportista
  └──→ Ejecuta: El viaje y registra las entregas
  └──→ Sube: Evidencias (foto, firma, GPS) a Cloudinary
  └──→ Reporta incidencias al: Jefe de bodega
  └──→ Coordina con: Custodio (carga del vehículo antes de salir)
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "No se puede cerrar el viaje" | Hay guías sin estado final (pendiente o en_ruta) | Registrar entrega o incidencia en todas las guías |
| "No se puede subir la foto" | Problema de conexión o Cloudinary no configurado | Verificar conexión a internet. Si persiste, contactar TI |
| "Firma rechazada" | El sistema no recibió la imagen de firma | Intentar de nuevo. Puede ser un problema de tamaño de archivo |
| No aparecen los viajes asignados | No hay viajes creados o el módulo está en desarrollo | Consultar con el custodio o jefe de bodega y con TI |
| GPS no se registra automáticamente | El dispositivo no tiene permisos de ubicación | Activar permisos de ubicación en el navegador o dispositivo |
