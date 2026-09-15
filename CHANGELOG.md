# Changelog — Polaria WMS

Todos los repos de producto (`polaria-wms-web`, `polaria-wms-api`, `polaria-wms-db`, `Widget-react`) y este Dev Hub (`flujo`) publican la misma versión de producto.

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
