# Manual de Usuario — Procesador

| Campo | Detalle |
| --- | --- |
| Rol | `procesador` |
| Nivel | Bodega |
| Creado por | `administrador_cuenta` |
| Scope de acceso | La bodega asignada (`id_bodega`) dentro del tenant |
| Ruta principal | `/dashboard/procesamiento` |

---

## 1. ¿Quién es el Procesador?

El **procesador** es el encargado de la **línea de procesamiento** de la bodega. Su función es transformar productos primarios en productos secundarios, registrar el balance de masa (insumo → resultado) y documentar la merma.

Sus responsabilidades son:

- Ejecutar **solicitudes de procesamiento** asignadas por el jefe de bodega.
- Registrar el **procesamiento primario**: transformación, corte, porcionado, clasificación.
- Registrar los **productos secundarios** resultantes.
- Documentar la **merma** (pérdida de peso o cantidad durante el proceso).
- Mantener el **balance de masa** (insumo = procesado + merma).

> El procesador trabaja en la línea de procesamiento físico de la bodega. No opera el muelle ni mueve mercancía entre slots de almacenamiento.

---

## 2. Login

1. Abre la aplicación en `/login`.
2. Ingresa el **código de empresa** (`codigoEmpresa`).
3. Ingresa su **correo o username**.
4. Ingresa su **contraseña**.
5. El sistema lo redirige al **dashboard** con acceso al módulo de procesamiento.

---

## 3. Panel Principal

Al entrar, el procesador ve:

- **Cola de solicitudes de procesamiento** asignadas a su bodega.
- Estado de los procesos en curso.
- Acceso al módulo de procesamiento (`/dashboard/procesamiento`).

---

## 4. Procesos del Procesador

### 4.1 Ejecutar una solicitud de procesamiento

1. Ir a `/dashboard/procesamiento`.
2. Ver la cola de **solicitudes de procesamiento** activas.
3. Seleccionar la solicitud a ejecutar.
4. Ver los detalles:
   - **Producto primario** a procesar (lote, cantidad, slot origen)
   - **Producto(s) secundario(s)** esperados
   - **Cantidad** objetivo
5. Confirmar que el insumo (producto primario) está disponible en el slot indicado.
6. Ejecutar el proceso físico.
7. Registrar en el sistema:
   - Cantidad procesada por cada producto secundario
   - Peso de merma
8. El sistema calcula automáticamente el **balance de masa** y valida que cuadre.
9. Cerrar la solicitud de procesamiento.

### 4.2 Balance de masa

El balance de masa es el cálculo que garantiza que la mercancía no "desaparece" en el proceso:

```
Insumo (primario) = Producción (secundario 1 + secundario 2 + ...) + Merma
```

Ejemplo:
- Entra: 100 kg de pollo entero
- Sale: 65 kg de pechuga (secundario 1) + 15 kg de muslo (secundario 2) + 10 kg de recortes + 10 kg de merma
- Balance: 100 kg = 65 + 15 + 10 + 10 ✅

Si el balance no cuadra, el sistema no deja cerrar la solicitud. El procesador debe revisar sus mediciones.

### 4.3 Registrar merma

La **merma** es la pérdida de peso o cantidad durante el procesamiento (huesos, agua evaporada, descarte):

1. En la pantalla de cierre de procesamiento, ingresar el peso de merma.
2. El sistema la registra en la tabla `registro_merma`.
3. El jefe de bodega o administrador puede ver el historial de mermas por período.

### 4.4 Tipos de procesamiento

| Tipo | Descripción |
| --- | --- |
| **Primario → Secundario** | Transformación completa: pollo entero → pechuga, muslo, etc. |
| **Clasificación** | Separar por calibre, calidad u otro criterio sin transformación física |
| **Empaque** | Cambio de presentación: a granel → unidades envasadas |

---

## 5. Permisos del Procesador

| Acción | Permitido |
| --- | --- |
| Ver y ejecutar solicitudes de procesamiento | ✅ |
| Registrar producción (secundarios) y merma | ✅ |
| Ver mapa de inventario (para ubicar insumos) | ✅ |
| Crear solicitudes de procesamiento | ❌ (las crea el operador de cuenta o jefe de bodega) |
| Mover mercancía entre slots | ❌ (eso es del operario) |
| Crear SOL/OC/OV | ❌ |
| Crear usuarios | ❌ |

---

## 6. Interacción con otros roles

```
Operador de cuenta / Jefe de bodega
  └──→ Crea la: Solicitud de procesamiento

Procesador
  └──→ Ejecuta la: Solicitud de procesamiento
  └──→ Genera: Productos secundarios + registro de merma
  └──→ Reporta a: Jefe de bodega (incidencias de proceso)
  └──→ Coordina con: Operario (para acceder a slots con insumos)
```

---

## 7. Errores frecuentes

| Error | Causa | Solución |
| --- | --- | --- |
| "Balance de masa no cuadra" | Los kg registrados no suman al insumo | Verificar mediciones y volver a ingresar |
| "Lote no disponible en slot" | El insumo no está en el slot indicado | Verificar con el operario si fue movido, buscar en el mapa |
| "Solicitud ya completada" | Otro procesador cerró la misma solicitud | Verificar con el jefe de bodega |
| No aparecen solicitudes de procesamiento | No hay solicitudes activas o el módulo está en desarrollo | Consultar con el jefe de bodega o con TI |
