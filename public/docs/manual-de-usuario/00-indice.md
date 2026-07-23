# Manual de Usuario — Polaria WMS

| Meta | Detalle |
| --- | --- |
| Producto | **Polaria WMS** |
| Versión | V2.0 |
| Destinatario | Equipo de soporte Mateo · usuarios operativos |
| Fecha | Jul 2026 |

> Este índice reúne los manuales de cada rol del sistema. Cada manual explica quién es el usuario, qué puede hacer, cómo realizar sus procesos paso a paso y con qué otros roles interactúa.

---

## Estructura de roles

Polaria WMS tiene tres niveles de acceso:

| Nivel | Roles | Descripción |
| --- | --- | --- |
| **Plataforma** | `configurador` | Equipo TI del proveedor SaaS. Configura empresas, tenants y bodegas. |
| **Cuenta (Tenant)** | `administrador_cuenta`, `operador_cuenta` | Gestión comercial y operativa del cliente dentro de su tenant. |
| **Bodega** | `administrador_bodega`, `jefe_bodega`, `custodio`, `operario`, `procesador`, `transportista` | Operación física en la bodega asignada. |

---

## Manuales disponibles

| # | Rol | Nivel | Manual |
| --- | --- | --- | --- |
| 1 | Configurador (TI) | Plataforma | [01-configurador.md](./01-configurador.md) |
| 2 | Administrador de cuenta | Cuenta | [02-administrador-cuenta.md](./02-administrador-cuenta.md) |
| 3 | Operador de cuenta | Cuenta | [03-operador-cuenta.md](./03-operador-cuenta.md) |
| 4 | Administrador de bodega | Bodega | [04-administrador-bodega.md](./04-administrador-bodega.md) |
| 5 | Jefe de bodega | Bodega | [05-jefe-bodega.md](./05-jefe-bodega.md) |
| 6 | Custodio | Bodega | [06-custodio.md](./06-custodio.md) |
| 7 | Operario | Bodega | [07-operario.md](./07-operario.md) |
| 8 | Procesador | Bodega | [08-procesador.md](./08-procesador.md) |
| 9 | Transportista | Bodega | [09-transportista.md](./09-transportista.md) |

---

## Cómo usar estos manuales (soporte Mateo)

Cuando un usuario contacta a soporte con una duda, identifica primero su **rol**. Luego busca en el manual correspondiente la sección que cubre su pregunta. Cada manual tiene:

1. **Descripción del rol** — quién es y qué hace en el sistema.
2. **Acceso y login** — cómo inicia sesión.
3. **Panel principal** — qué ve cuando entra.
4. **Procesos por función** — pasos detallados de cada tarea.
5. **Permisos** — qué puede y qué no puede hacer.
6. **Interacción con otros roles** — quién le crea, a quién afecta.
7. **Errores frecuentes** — problemas comunes y cómo resolverlos.

---

## Diagrama de jerarquía de creación

```
Configurador (TI)
├── Crea: Empresa
├── Crea: Administrador de cuenta
├── Crea: Cuentas (tenants)
└── Crea: Bodegas internas y externas

Administrador de cuenta
├── Crea: Operador de cuenta
├── Crea: Administrador de bodega
├── Crea: Jefe de bodega
├── Crea: Custodio
├── Crea: Operario
├── Crea: Procesador
└── Crea: Transportista
```
