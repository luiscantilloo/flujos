# Guía general: cómo documentar un proyecto de software

Esta guía resume **criterios y una plantilla reutilizable** para documentar productos técnicos. Está alineada con la estructura usada en *Bodega de Frío* (documentación v2): visión de negocio, checklist maestra, README, arquitectura, API, entorno, instalación, contribución, glosario, flujos y operación.

> **Para quién es esta guía.** Equipos que necesitan un mismo lenguaje entre negocio, desarrollo y operaciones — sin depender de un único documento monolítico ilegible.

---

## 1. Audiencias (antes del primer título)

Define **tres audiencias** y qué necesita cada una en 30 segundos:

| Audiencia | Necesita saber | Dónde suele vivir en la doc |
| --- | --- | --- |
| Negocio / producto | Problema, usuarios, promesa del sistema | Visión de negocio, glosario, flujos E2E |
| Desarrollo nuevo | Cómo levantar el entorno y dónde está el código crítico | README, instalación, arquitectura, CONTRIBUTING |
| Operaciones / soporte | Qué monitorear, cómo desplegar, qué hacer si falla | Runbooks, entornos, seguridad, observabilidad |

> **Nota.** Si un solo documento sirve a todos, **organízalo por capítulos numerados** y un índice navegable (como en esta aplicación).

---

## 2. Checklist maestra (plantilla)

Usa una tabla **Elemento | Prioridad | Estado** para ver huecos sin leer cientos de páginas.

| # | Elemento | Prioridad típica |
| --- | --- | --- |
| 1 | README.md (portada del repo) | Alta |
| 2 | Diagrama de arquitectura (C4, Mermaid o similar) | Alta |
| 3 | Contrato de API (OpenAPI/Swagger o rutas server-side) | Alta |
| 4 | Variables de entorno y secretos (cliente vs servidor) | Alta |
| 5 | Guía de instalación y ejecución local | Alta |
| 6 | CONTRIBUTING (ramas, commits, PR, DoD) | Alta |
| 7 | Glosario negocio ↔ datos ↔ código | Alta |
| 8 | Flujos de negocio end-to-end (actores + pasos) | Alta |
| 9 | ADRs (decisiones de arquitectura) | Media |
| 10 | Estrategia de pruebas y CI | Media |
| 11 | Runbooks (deploy, rollback, incidentes) | Media |
| 12 | Onboarding del desarrollador | Media |
| 13 | CHANGELOG y versionado (SemVer) | Media |
| 14 | Seguridad y autenticación | Media |
| 15 | Entornos (dev / staging / prod) | Media |
| 16 | Observabilidad (logs, métricas, trazas) | Baja/Media |
| 17 | Migraciones entre versiones mayores | Baja |
| 18 | Catálogo UI (Storybook u equivalente) | Baja |
| 19 | Cumplimiento normativo (si aplica) | Baja |

**Estados** recomendados: Completo / En curso / Pendiente / No aplica — con una nota breve de qué falta en cada pendiente.

---

## 3. Contenido mínimo por artefacto

### 3.1 README.md

Debe contestar **qué es**, **para qué sirve** y **cómo empezar** en menos de una pantalla:

- Stack y prerrequisitos
- Instalación en 3–6 pasos
- Variables críticas y scripts (`dev`, `build`, `test`)
- Estructura de carpetas **solo** a nivel orientativo
- Enlaces al resto de documentos

### 3.2 Arquitectura

- Diagrama de **contexto** (sistema y vecinos)
- Diagrama de **contenedores** (apps, bases, SaaS externos)
- Flujo de datos y **dónde viven los secretos**
- Deuda conocida (componentes que concentran demasiada lógica)

### 3.3 API

Por cada endpoint (o SDK cliente):

- Método, URL, auth, cuerpo, errores, límites
- Quién llama desde el front
- Separar rutas **server-side** (secretos) del SDK en cliente

### 3.4 Variables de entorno

| Variable | Obligatoria | Propósito | ¿Puede ser `NEXT_PUBLIC_`? |
| --- | --- | --- | --- |
| (ejemplo) | Sí | Descripción | No — solo servidor |

> **Nota.** Nunca subir `.env` al repositorio. En producción, configurar en el hosting.

### 3.5 Instalación

- Prerrequisitos con versiones
- Comandos copiables en bloques `bash`
- URL local
- Tabla troubleshooting: síntoma → causa → acción

### 3.6 CONTRIBUTING y flujo Git

| Tipo | Formato de rama | Ejemplo |
| --- | --- | --- |
| Nueva funcionalidad | `feat/descripcion-corta` | `feat/alerta-temperatura` |
| Bugfix | `fix/descripcion` | `fix/cloudinary-signature` |
| Documentación | `docs/descripcion` | `docs/actualizar-glosario` |

**Definition of Done** — un cambio está listo cuando:

- `npm run build` y `npm run lint` pasan
- Tests relevantes pasan
- Probado en los roles afectados
- Documentación actualizada
- PR revisado y aprobado

### 3.7 Glosario

| Término (negocio) | Definición | Representación en datos |
| --- | --- | --- |
| Ejemplo | Qué significa para el usuario | Colección, campo, prefijo de ID |

### 3.8 Flujos end-to-end

Numerar pasos con **actor + acción** (tabla o timeline). Incluir:

- Al menos un flujo feliz
- Uno con **excepción** (ej. recepción con diferencias)

### 3.9 Testing y CI

Qué se testea en qué capa y qué debe pasar en CI antes del merge.

### 3.10 Runbooks

Pasos ordenados para deploy, rollback y rotación de secretos.

---

## 4. Tono, formato y mantenimiento

- **Una fuente de verdad**: el PR que cambia código actualiza doc o abre issue enlazado.
- **Ejemplos reales** anonimizados; evita solo teoría abstracta.
- **Numeración estable** (1., 2., …) para referencias en issues.
- **Diagramas** (Mermaid, flujos interactivos de esta app) como complemento del texto contractual (API, permisos).

---

## 5. Relación con esta aplicación (Flujo WMS)

| Recurso en la app | Uso |
| --- | --- |
| Diagramas interactivos | Onboarding visual y alineación negocio ↔ implementación |
| Documentación Bodega de Frío | Tablas, variables, glosario y flujos narrados |
| Esta guía | Plantilla para el **próximo** producto o módulo |

> **Cadena recomendada:** visión → checklist → README → arquitectura → API → entorno → instalación → glosario → flujos → operación.

Mantén **coherencia**: si un subflujo del diagrama cambia, actualiza la sección equivalente en la documentación.

---

## 6. Resumen ejecutivo

1. Empieza por **visión + checklist maestra**.
2. Cubre **README, arquitectura, API, entorno, instalación, contribución, glosario, flujos**.
3. Añade **operación, seguridad y observabilidad** según el riesgo.
4. Trata la documentación como **código**: revisión en PR, versionado y enlaces rotos corregidos con la misma urgencia que bugs visibles.

*Guía para el proyecto Flujo; inspirada en `documentacion_bodega_frio_v2`.*
