# Novedades sep 2026 — Polaria WMS 2.5.34

Captura de lo que el producto ganó **después de 2.4.3** (ago 2026) hasta **2.5.34**. Complementa el [mapa actual](/documentacion/polaria-wms-mapa-actual). No reemplaza los manuales de usuario ni la documentación de diseño (generación V2).

El Dev Hub queda alineado en: Manual de usuario (ventas, operador, admin cuenta, configurador, FAQ, glosario), módulo **Formularios → Esquema**, mapa, API, migraciones **068–080** y Mateo.

---

## 1. Pedido de venta (oficina)

En **Ventas → Órdenes venta** el botón es **Nueva venta**. El modal pregunta cómo empezar:

| Modo | Qué hace |
| --- | --- |
| **Primera vez** | Abre **Nuevo comprador** (ficha completa) y luego el pedido. |
| **Venta nueva** | Formulario vacío (captura manual). |
| **Tengo el mensaje o archivos** | IA: texto y/o PDF, Excel, CSV, Word, `.eml` o foto → **Leer y llenar el formulario**. |

**Validar y enviar** crea y **emite** el pedido (reserva stock). Si la OV quedó en **Borrador**, el detalle sigue teniendo **Emitir venta**. Reintentar emitir una OV ya confirmada **no falla** (API idempotente).

El formulario trae ficha del comprador (entrega, ventana, OC hotel, andén, etc.), **bodega destino**, líneas con **cajas** y **presentación**, y precio vigente / equivalencia del comprador.

| Repo | Dónde |
| --- | --- |
| `polaria-wms-web` | `OrdenVentaCreateModal`, `/api/ventas/leer-pedido` |
| `polaria-wms-api` | `POST /ventas/ordenes/:id/emitir` (idempotente) |
| Manual | `procesos/ventas-despacho.md`, `roles/operador-cuenta.md` |

---

## 2. Editar un pedido ya armado

**Editar** en la fila de la OV. Se puede en **borrador**, **confirmada** y **en preparación**. No en despachada / cerrada / cancelada.

Sin la migración **080**, Postgres respondía *permission denied* al guardar (faltaba UPDATE de cabecera y DELETE/INSERT de líneas para operador/admin).

| Repo | Dónde |
| --- | --- |
| `polaria-wms-web` | modal **Editar pedido** (mismo formulario; submit **Guardar cambios** si ya no es borrador) |
| `polaria-wms-db` | `080_orden_venta_update_editable_operador.sql` |

---

## 3. Captura de surtido (QR + foto en el teléfono)

1. Oficina **Imprime** o **Descarga** el PDF de la OV (tarea de almacén). El PDF lleva un **QR**.
2. En piso se escanea el QR (Safari, no el navegador de WhatsApp). Abre `/captura-orden/{id}` **sin login**.
3. **Tomar foto** o **Elegir de galería** → **Subir y leer hoja**.
4. La IA lee la hoja surtida. Queda precisión (Alta / Media / Baja / Muy baja).
5. En la lista de ventas aparece **Descargar PDF actualizado (surtido)**.

La captura es pública a propósito: no rehidrata la sesión WMS al volver de Fotos (Safari iOS).

| Repo | Dónde |
| --- | --- |
| `polaria-wms-web` | `/captura-orden/[idOrdenVenta]`, `CapturaOrdenUploadForm` |
| `polaria-wms-db` | `074_orden_venta_surtido_captura.sql` |
| Manual | **Ventas y despacho** |

---

## 4. Lista de precio y equivalencias

El panel del **administrador de cuenta** tiene **cuatro** tarjetas: Asignación y creación, Catálogo, **Lista de precio**, Reportes.

- **Lista de precio** (`/dashboard/administracion/lista-precio`): precio vigente por producto (`precio_producto`). Las equivalencias **no** cambian esa lista.
- En **Compradores**, ya no hay **Crear Alias** en la lista. El flujo es **Editar → Equivalencia → Crear equivalencia** (nombre del cliente + precio especial opcional).

| Repo | Dónde |
| --- | --- |
| `polaria-wms-web` | módulo lista-precio; compradores Equivalencia |
| `polaria-wms-db` | 071–073 (INSERT precio; `comprador_producto_alias.precio`) |

---

## 5. Impresoras y bodega por defecto (Configurador)

- **Asignación → Impresoras**: alta carta (IPP / QZ Tray), cuenta, marca/modelo, asignación a usuario. Sin esto, **Imprimir** en ventas no tiene destino.
- **Creación → Cuentas**: radio **Default** → **Guardar bodega por defecto** (`cuenta.id_bodega_default`). El pedido de venta preselecciona esa bodega.

CRUD de impresoras = web + tabla `impresora` (no hay controller Nest).

| Repo | Dónde |
| --- | --- |
| `polaria-wms-web` | `/configurador/asignacion/impresoras`, cuentas |
| `polaria-wms-db` | 075, 076, 077 |
| `polaria-wms-api` | `PATCH /configuracion/cuentas/:codigoCuenta` (`idBodegaDefault`) |
| Manual | `roles/configurador.md` |

---

## 6. Usuarios de la cuenta: editar y restablecer contraseña

En **Asignación de usuarios**: lápiz → **Editar usuario** (nombre, correo, teléfono). En el detalle: **Restablecer contraseña**.

| Repo | Dónde |
| --- | --- |
| `polaria-wms-api` | `PATCH /administracion/usuarios/:id`, `POST .../password` |
| Manual | `roles/administrador-cuenta.md` |

---

## 7. Reportes de bodega: Desde / Hasta

**Administrador de bodega → Reportes**: filtros **Desde** y **Hasta** (día America/Bogota) y **Rastrear caja**.

| Repo | Dónde |
| --- | --- |
| `polaria-wms-api` | `GET /operaciones/reportes/bodega?fechaDesde=&fechaHasta=` |
| Manual | `roles/administrador-bodega.md` |

---

## 8. Comprador: ficha plana (alta)

El alta de comprador ya no es solo nombre + teléfono: fiscales, crédito, centros, contactos, reglas. Columnas planas (069) + JSON `metadatos_alta` (068). Desde ventas, **Primera vez** usa esa misma ficha.

---

## 9. Mateo (contrato, no hay pantalla nueva)

Sigue el chat embebido de 2.4.3 (enlaces, PDF, cierre a las 12 h). Para integrar n8n:

- Body plano con **`conversation_id` UUID** (no ids temporales `conv_*`).
- **`phone_number`** en el JWT del widget y en el body.
- Historial = Bearer de sesión WMS; n8n = JWT widget ~300 s. No se mezclan.

SSO: Mateo puede abrir `/auth/sso?code=` (“Conectando con Polaria WMS…”).

---

## 10. Migraciones 068–080 (resumen)

| N° | Qué |
| --- | --- |
| 068–069 | Ficha de alta de comprador (JSON + columnas) |
| 070 | Campos planos de captura en `orden_venta` |
| 071–072 | INSERT de `precio_producto` (admin/operador) |
| 073 | Precio especial en equivalencia (`comprador_producto_alias.precio`) |
| 074 | Tabla `orden_venta_surtido_captura` (foto + JSON IA) |
| 075 | `cuenta.id_bodega_default` |
| 076–077 | Tabla `impresora` + `id_usuario` |
| 078 | PostgREST expone schemas `emp_*` |
| 079 | `orden_venta_linea.cajas` y `presentacion` |
| 080 | RLS UPDATE/DELETE para editar OV (operador/admin, estados editables) |

Serie documentada: **001–080**.
