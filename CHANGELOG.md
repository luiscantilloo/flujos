# Changelog — Polaria WMS

Todos los repos de producto (`polaria-wms-web`, `polaria-wms-api`, `polaria-wms-db`, `Widget-react`) y este Dev Hub (`flujo`) publican la misma versión de producto.

## 2.7.5 — 2026-09-17

### Cambiado
- Acceso a **Polaria WMS** y **Mateo IA** por **usuario** (`usuario.acceso_wms` / `usuario.acceso_mateo`). La ficha Acceso de la cuenta solo enciende o apaga el login (`cuenta.esta_activa`).
- Configurador → Cuentas: maestros reales de cada tenant (catálogo, lista de precio, proveedores, clientes, compradores, camiones, plantas).
- Carga unificada: card del QR/SSO; dentro de tablas, sin recuadro interior.
- Gestión de precios de compradores: plantilla Excel protegida sin contraseña (solo Equivalencia y Precio nuevo).

### Base de datos
- Migración **083** (`usuario.acceso_wms` / `usuario.acceso_mateo`).

La generación de diseño sigue siendo **V2**. El número de producto es **2.7.5**.

## 2.6.0 — 2026-09-16

### Añadido
- **Configurador → Cuentas**: gobierno TI de todas las cuentas (ficha Acceso, Usuarios y Bodegas; maestros y operación).
- Acceso de cuenta por producto: **Polaria WMS**, **Mateo IA** o **ambos**. El configurador siempre tiene los dos. Si la cuenta es solo Mateo, el login WMS redirige a Mateo y no muestra el WMS. Si no hay Mateo, el botón del topbar no aparece.
- Teléfono único en el perfil (E.164; migración **081**). El login WMS sigue siendo solo con correo.

### Base de datos
- Migraciones **081** (teléfono único) y **082** (`cuenta.acceso_wms` / `cuenta.acceso_mateo`).

La generación de diseño sigue siendo **V2**. El número de producto es **2.6.0**.

## 2.5.34 — 2026-09-15

### Añadido
- Pedido de venta: tres modos de inicio, lectura IA de mensaje/archivos, **Validar y enviar** (crea y emite).
- Editar OV en borrador / confirmada / en preparación (migración **080**).
- Captura pública de surtido por QR + foto (iOS: cámara o galería) y PDF actualizado.
- Lista de precio; equivalencias por comprador (nombre + precio especial).
- Impresoras (configurador) y bodega por defecto de la cuenta.
- Editar usuario y restablecer contraseña (admin de cuenta).
- Reportes de bodega con filtros **Desde / Hasta**.
- Migraciones **068–080**.

### Documentación (este hub)
- Manuales: ventas, operador, admin cuenta, configurador, admin bodega, FAQ, glosario.
- Mapa actual, novedades sep 2026, API y stack alineados a **2.5.34** (la versión que muestra el WMS en `POLARIA_PRODUCT_VERSION`).
- Módulo **Formularios → Esquema**: schemas de campos por rol (protocolo de validación v1.0) en `public/docs/formularios/schemas/`.

La generación de diseño sigue siendo **V2**. El número de producto es **2.5.34**.

## 2.4.9 — 2026-09-03

Bump de `VERSION` / `package.json` en web, API, BD y Mateo (queda atrás de la versión de producto **2.5.34** que muestra la UI).

La generación de diseño sigue siendo **V2**. El número de producto es **2.4.9**.

## 2.4.3 — 2026-08-29

### Añadido
- Tope de sesión WMS de 12 h; Mateo se cierra con Polaria.
- Editar en Creación (proveedores, clientes, compradores, camiones, plantas).
- Alias de producto por comprador (`comprador_producto_alias`, migración 067).

### Corregido
- Teléfonos con prefijo internacional aunque el valor guardado venga sin `+`.
- Enlaces y PDF de Mateo (otra pestaña, descarga, 404).
- Persistencia del alias (PostgREST / ficha vs Editar).

La generación de diseño sigue siendo **V2** (respecto de V1). El número de producto es **2.4.3**.
