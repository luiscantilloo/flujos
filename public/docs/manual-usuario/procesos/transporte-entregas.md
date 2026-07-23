# Transporte y entregas

Logística de salida: viajes, guías y evidencias.

## Entidades

```
viaje_transporte
  └── guia_envio (por OV o destino)
        └── evidencia_transporte (foto, firma)
```

## Flujo

| Paso | Rol | Acción |
| --- | --- | --- |
| 1 | Custodio | `POST /transporte/paquetes-despacho` |
| 2 | Sistema | Crea viaje + guías, consume stock zona salida |
| 3 | Transportista | Ve guías en `/dashboard/transporte` |
| 4 | Transportista | `POST /transporte/entregas` con evidencias |

## Evidencias

- **Foto:** subida a Cloudinary vía `POST /api/evidencia-transporte`
- **Firma:** captura en pantalla
- **GPS:** según configuración del dispositivo
- **Conformidad:** S/N del receptor

## Camiones

Catálogo en admin cuenta (`/dashboard/administracion/.../camiones`):
- Tipo: refrigerado, seco, isotérmico
- Placa, capacidad, estado disponible

## Preguntas frecuentes (Mateo)

**¿Transportista no ve nada?** No hay paquete de despacho creado por custodio.

**¿Error al subir foto?** Revisar configuración Cloudinary en servidor web.

**¿Puedo entregar parcial?** Sí, con cantidades parciales; OV puede quedar `parcialmente_despachada`.
