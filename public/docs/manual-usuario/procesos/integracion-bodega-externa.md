# Integración bodega externa

Conexión con bodegas de terceros (ej. Fridem) vía scraping, API o CSV.

## Tipos de integración

| Tipo | Descripción |
| --- | --- |
| `scraping` | Lectura automatizada de sistema externo |
| `api` | Conexión API del proveedor externo |
| `csv` | Importación plana periódica |

## Flujo

```
1. Operador cuenta crea solicitud (/dashboard/bodega-externa/integracion)
2. POST /integracion/solicitudes
3. Configurador ve bandeja global (/configurador/integracion)
4. Configurador configura y activa integración
5. Stock externo visible en operación (según implementación)
```

## Roles

| Acción | Rol |
| --- | --- |
| Crear solicitud | operador_cuenta, administrador_cuenta |
| Atender solicitud | configurador |
| Ver solicitudes propias | operador_cuenta, administrador_cuenta |

## Estado actual

- ✅ CRUD solicitudes implementado
- 🟡 Integración Fridem en producción pendiente
- 🔵 Sync automático stock externo en roadmap

## Preguntas frecuentes (Mateo)

**¿Quién activa la integración?** Solo el configurador (TI Polaria).

**¿Cuánto tarda?** Depende del tipo; scraping/API requiere credenciales del cliente externo.

**¿Puedo operar bodega externa como interna?** Parcialmente; la vinculación es a nivel cuenta, la sync es el paso pendiente.
