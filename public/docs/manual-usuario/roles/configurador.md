# Configurador (TI)

| Campo | Valor |
| --- | --- |
| Rol | `configurador` |
| Nivel | Plataforma |
| Pantalla principal | `/configurador` |
| Creado por | Equipo Polaria (manual en BD) |

## ¿Quién es?

Persona del equipo TI del proveedor SaaS. Administra **todas las empresas clientes** del sistema. No pertenece a ninguna empresa cliente: su `codigo_empresa` y `codigo_cuenta` son NULL.

## ¿Cómo inicia sesión?

1. Ir a la URL del WMS → `/login`
2. Ingresar **correo y contraseña** (no pide código de empresa)
3. El sistema detecta rol `configurador` y redirige a `/configurador`

## ¿Qué puede hacer?

### Creación (`/configurador/creacion`)

| Acción | Ruta | Descripción |
| --- | --- | --- |
| Crear empresa | `/configurador/creacion/empresas` | Alta cliente jurídico (`codigo_empresa`) |
| Crear cuenta (tenant) | `/configurador/creacion/cuentas` | Unidad operativa bajo la empresa |
| Crear bodega interna | `/configurador/creacion/bodega-interna` | Bodega física propia + bootstrap layout |
| Crear bodega externa | `/configurador/creacion/bodega-externa` | Bodega de terceros (integración) |

### Asignación (`/configurador/asignacion`)

| Acción | Ruta | Descripción |
| --- | --- | --- |
| Asignar usuarios | `/configurador/asignacion/usuarios` | Crear usuarios cross-cuenta con rol |

### Integración (`/configurador/integracion`)

| Acción | Descripción |
| --- | --- |
| Bandeja solicitudes | Ver y atender pedidos de integración de bodega externa de todos los tenants |

## Permisos especiales

- Bypass de todos los guards de rol en API
- Puede ver **todas** las empresas, cuentas y bodegas (RLS configurador)
- Único rol que puede crear empresas y modificar empresa/cuenta vía API

## Flujo típico de onboarding

```
1. Crear EMPRESA
2. Crear CUENTA (tenant) bajo la empresa
3. Crear BODEGA(S) + bootstrap layout (zonas ING, SLOT, SAL, PROC)
4. Crear ADMINISTRADOR DE CUENTA y asignarlo a la empresa
5. (Opcional) Crear más usuarios de bodega
```

## Errores frecuentes (soporte)

| Síntoma | Causa probable | Qué decir al usuario |
| --- | --- | --- |
| "No tengo acceso al configurador" | Usuario no tiene rol configurador en tabla `usuario` | Verificar `id_rol = configurador` y que no tenga empresa asignada |
| Error 409 al bootstrap layout | La bodega ya tiene ubicaciones | Normal si se reintenta; usar ensure-zonas-operativas |
| No ve solicitudes integración | Filtro de cuenta | Revisar bandeja en `/configurador/integracion` |

## Pantallas que NO usa

- `/dashboard/*` (operación tenant) — redirige a configurador si intenta entrar
- Módulos operativos de bodega (mapa, ingreso, etc.) salvo pruebas
