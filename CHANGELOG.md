# Changelog — Polaria WMS

Todos los repos de producto (`polaria-wms-web`, `polaria-wms-api`, `polaria-wms-db`, `Widget-react`) y este Dev Hub (`flujo`) publican la misma versión de producto.

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
