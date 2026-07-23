# Transportista

| Campo | Valor |
| --- | --- |
| Rol | `transportista` |
| Nivel | Bodega |
| Pantalla principal | `/dashboard/transporte` |
| Creado por | Administrador de cuenta |

## ¿Quién es?

Conductor que ejecuta **viajes de entrega**. Registra entregas con evidencias fotográficas y firma del receptor.

## Pantalla principal

`/dashboard/transporte` — guías de envío asignadas y registro de entregas.

## Proceso de entrega

```
1. Custodio crea paquete de despacho → genera viaje + guías
2. Transportista ve guías en /dashboard/transporte
3. En destino: registrar entrega
   - Cantidades entregadas
   - Foto evidencia (Cloudinary)
   - Firma digital
   - Conformidad S/N
4. Sistema guarda evidencia_transporte
```

## Permisos

| Acción | ¿Puede? |
| --- | --- |
| Registrar entrega | ✅ |
| Crear paquete despacho | ❌ |
| Ver mapa / inventario | ❌ |
| Crear OV | ❌ |

## Evidencias

- Las fotos se suben vía `POST /api/evidencia-transporte` (Next.js → Cloudinary)
- Formatos: JPG, PNG, WebP
- La firma se captura en pantalla táctil

## Errores frecuentes (soporte)

| Síntoma | Causa | Respuesta |
| --- | --- | --- |
| No ve guías | Viaje no creado o no asignado | Custodio debe crear paquete despacho primero |
| Error subiendo foto | Cloudinary mal configurado | Revisar env CLOUDINARY en servidor web |
| Cantidad entregada > despachada | Error de captura | Corregir cantidades antes de confirmar |
