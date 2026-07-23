# Operador de cuenta

| Campo | Valor |
| --- | --- |
| Rol | `operador_cuenta` |
| Nivel | Cuenta (tenant) |
| Pantalla principal | `/dashboard` → Hub operador |
| Creado por | Administrador de cuenta |

## ¿Quién es?

Opera el día a día **a nivel comercial** del tenant: compras, ventas, procesamiento e integración. No administra catálogos maestros ni crea usuarios.

## Hub operador — accesos rápidos

Desde `/dashboard` el operador ve un hub con tarjetas hacia:

| Módulo | Ruta | Función |
| --- | --- | --- |
| Compras | `/dashboard/compras` | Crear SOL, ver OC |
| Ventas | `/dashboard/ventas` | Hub ventas |
| Órdenes venta | `/dashboard/ventas/ordenes` | Crear y emitir OV |
| Bodega interna | `/dashboard/bodega-interna` | Hub operaciones internas |
| Procesamiento | `/dashboard/bodega-interna/procesamiento` | Solicitudes de procesamiento |
| Bodega externa | `/dashboard/bodega-externa` | Hub externa |
| Integración | `/dashboard/bodega-externa/integracion` | Pedir integración externa |

## Procesos principales

### Compras

1. Crear **Solicitud de compra (SOL)** en borrador
2. Enviar a aprobación → esperar admin cuenta
3. Tras aprobación: convertir a **Orden de compra (OC)**
4. Configurar destino (bodega) y emitir OC
5. El proveedor es notificado vía n8n (automático)

### Ventas

1. Crear **Orden de venta (OV)** en borrador
2. Emitir OV → reserva stock y genera tareas en bodega

### Procesamiento

1. Crear **solicitud de procesamiento** (producto primario → secundario)
2. El jefe de bodega asigna operario; el procesador cierra merma

### Integración externa

1. Crear solicitud de integración (scraping / API / CSV)
2. El configurador atiende en su bandeja

## Permisos

| Acción | ¿Puede? |
| --- | --- |
| Crear SOL / OC | ✅ |
| Aprobar SOL | ❌ (solo admin cuenta) |
| Emitir OV | ✅ |
| Ver mapa inventario | ✅ (lectura) |
| Cerrar recepción | ❌ |
| Ingreso físico bodega | ❌ |

## Errores frecuentes (soporte)

| Síntoma | Causa | Respuesta |
| --- | --- | --- |
| No puede convertir SOL a OC | SOL no está `aprobada` | Debe aprobar admin cuenta primero |
| OV no emite | Stock insuficiente o OV no en borrador | Verificar líneas y estado |
| No ve bodega en destino OC | Bodega no vinculada al tenant | Admin debe vincular bodega interna |
