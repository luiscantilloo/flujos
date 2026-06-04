/**
 * Guía del ER en lenguaje muy simple (presentaciones, onboarding, incluso público infantil).
 */

import { ENTITIES, getEntityById } from './bodegaDatabaseSchema.js'
import {
  SCHEMA_READING_PHASES,
  TABLE_READING_SEQUENCE,
} from './schemaReadingGuide.js'

const FLOW_SIMPLE_ASCII = `🏭 El equipo que REPARA el programa (configurador TI)
 │
 ├─ crea la EMPRESA (el cliente, como el "nombre del colegio")
 │     ├─ crea al JEFE de esa empresa (administrador)
 │     └─ crea la CUENTA de trabajo (el "salón" donde ocurre todo)
 │           │
 │           ├─ el jefe PIDE una bodega (nevera / almacén)  → solicitud
 │           ├─ el equipo del programa CREA la bodega
 │           ├─ el jefe se APUNTA a esa bodega
 │           │
 │           ├─ llena listas: proveedores, compradores, camiones, productos…
 │           ├─ compra cosas (pedido → orden de compra)
 │           ├─ guarda y mueve cajas dentro de la bodega
 │           ├─ a veces transforma productos (procesamiento)
 │           └─ vende y manda en camión (venta → viaje → foto de entrega)`

/** Resumen de cada fase como si se lo contaras a un niño de 10 años */
const PHASE_SIMPLE = {
  '0': 'Antes de jugar hay reglas: qué personajes existen (jefe del juego, dueño de tienda, trabajador del almacén) y cómo entras con usuario y contraseña.',
  '1': 'El equipo del programa crea la empresa cliente y el primer jefe de esa empresa.',
  '2': 'Cada empresa puede tener una o más "cuentas de trabajo". Ahí vive el día a día: productos, pedidos, bodegas.',
  '3': 'El jefe pide una bodega con nombre; el equipo del programa la construye en el sistema; el jefe dice "yo trabajo en esa bodega".',
  '4': 'El jefe llena sus libretas: quién le vende, quién compra, camiones, productos y ayudantes.',
  '5': 'Se elige quién trabaja en cada bodega: custodio, operario, chofer, etc.',
  '6': 'Llegan los pedidos de compra: primero un borrador (solicitud), luego el pedido firme con lista de cosas.',
  '7': 'Dentro de la bodega se ve en vivo dónde está cada caja; también queda un diario de movimientos.',
  '8': 'A veces un producto se transforma en otro; si algo se pierde, se anota la merma.',
  '9': 'Se vende, sale el camión y se guarda la prueba de que llegó; al final el sistema cuenta números y apunta quién hizo qué.',
}

const WHO_SIMPLE = {
  seed: 'Ya viene escrito en el juego (no lo inventa el cliente)',
  configurador: 'El equipo que arregla y crea el programa (como los desarrolladores)',
  admin_cuenta: 'El jefe de la empresa cliente',
  operador_cuenta: 'La persona que hace pedidos y papeles en la oficina',
  bodega: 'La gente que trabaja dentro del almacén o en el camión',
  sistema: 'El programa solo, sin persona',
  externo: 'La puerta de entrada con correo y contraseña (Supabase)',
  administrador_cuenta: 'El jefe de la empresa cliente',
}

/** Por paso: una frase, analogía, guion corto */
const STEP_KIDS = {
  rol: {
    frase: 'Lista de tipos de personaje en el juego.',
    analogia: 'Como cuando eliges si eres mago, guerrero o curador — aquí eliges si eres jefe del programa, jefe de empresa o trabajador de bodega.',
    antes: 'Es el capítulo 1 del cuento. Empieza aquí.',
    despues: 'Después viene la puerta de entrada (correo y contraseña) y luego la empresa.',
    guion:
      'Hay nueve roles fijos. No los inventa el cliente. El más especial es el configurador: es quien construye el mundo para los demás.',
  },
  _auth_externo: {
    frase: 'La puerta para entrar con correo y contraseña.',
    analogia: 'Como el login de Minecraft o Roblox: sin eso no entras.',
    antes: 'Ya sabes qué personajes existen (paso 0).',
    despues: 'Cuando entras, el paso 2 es crear la empresa en el sistema.',
    guion:
      'No es una tabla de la tienda; es donde vive la contraseña. Después el juego sabe qué personaje eres.',
  },
  empresa: {
    frase: 'El nombre de la empresa cliente en el sistema.',
    analogia: 'Como el nombre de tu colegio en el carnet: todos los de ese colegio pertenecen ahí.',
    guion:
      'El equipo del programa crea la empresa. Todos los usuarios de ese cliente llevan ese código cuando entran.',
  },
  usuario: {
    frase: 'Cada persona que usa el sistema.',
    analogia: 'Como una ficha de jugador con nombre, correo y qué rol tiene.',
    guion:
      'Primero creas al jefe de la empresa. Más tarde el jefe crea a sus ayudantes y a la gente de la bodega.',
  },
  cuenta: {
    frase: 'El "salón de trabajo" donde pasa la operación diaria.',
    analogia:
      'La empresa es el colegio; la cuenta es el salón 5B donde guardas tus cosas, listas y tareas — no mezclas con el salón 6A.',
    guion:
      'Una empresa puede tener varias cuentas. Productos, compras y ventas van pegados a la cuenta, no solo al nombre de la empresa.',
  },
  solicitud_alta_bodega: {
    frase: 'El jefe pide: "quiero una bodega con este nombre".',
    analogia: 'Como pedir por formulario una casilla nueva en el estacionamiento.',
    guion:
      'El administrador pide. El equipo del programa lee la petición y después crea la bodega de verdad.',
  },
  bodega: {
    frase: 'El almacén frío (de la empresa o afuera).',
    analogia: 'Una nevera gigante con estantes: adentro guardas cajas de comida.',
    guion:
      'Solo el equipo del programa la crea en el sistema. Puede ser bodega interna o externa.',
  },
  asignacion_bodega: {
    frase: 'Quién trabaja en qué bodega y con qué trabajo.',
    analogia: 'La lista del profe: "Pedro es capitan del equipo A, María del equipo B".',
    guion:
      'El jefe se apunta primero a su bodega. Luego apunta a custodios, operarios y choferes.',
  },
  proveedor: {
    frase: 'Quién te vende las cosas que compras.',
    analogia: 'La tienda donde la mamá compra ingredientes.',
    guion: 'El jefe guarda el nombre de cada proveedor para hacer pedidos después.',
  },
  comprador: {
    frase: 'Quién te compra a ti (a quien envías producto).',
    analogia: 'El vecino que te encarga un pastel.',
    guion: 'Cuando vendes, eliges a qué comprador va el envío.',
  },
  camion: {
    frase: 'Los camiones de la empresa.',
    analogia: 'Los carritos de reparto.',
    guion: 'Cuando mandas una venta, eliges qué camión lleva la carga.',
  },
  planta: {
    frase: 'A dónde puede ir el producto (otra fábrica o sitio).',
    analogia: 'La dirección de entrega en el mapa.',
    guion: 'Algunas ventas van a una planta especial.',
  },
  cliente: {
    frase: 'Dueño de una marca o línea de productos.',
    analogia: 'La marca que pone su nombre en el empaque.',
    guion: 'Antes de crear un producto, dices de qué cliente es.',
  },
  producto: {
    frase: 'Cada cosa que guardas, compras o vendes (con su código).',
    analogia: 'Cada ítem del inventario del videojuego.',
    guion: 'Helado de vainilla, caja de 10 kg, etc. Tiene código y nombre.',
  },
  solicitud_compra: {
    frase: 'Borrador de "quiero comprar esto".',
    analogia: 'La lista del súper antes de ir a pagar.',
    guion: 'Primero la solicitud; si está bien, se convierte en orden de compra.',
  },
  orden_compra: {
    frase: 'Pedido de compra ya en serio.',
    analogia: 'El ticket de compra con fecha y proveedor.',
    guion: 'Dice qué bodega recibirá las cajas y de qué proveedor vienen.',
  },
  linea_orden_compra: {
    frase: 'Cada línea del ticket: producto y cantidad.',
    analogia: 'En el ticket: 3 leches, 2 quesos — cada línea es una fila.',
    guion: 'Sin líneas no sabes cuántas cajas esperar.',
  },
  estado_bodega: {
    frase: 'Foto en vivo de cómo está la bodega ahora mismo.',
    analogia: 'El mapa del nivel que se actualiza al instante en el juego.',
    guion:
      'Un archivo especial por bodega: dónde hay huecos libres, qué cajas hay, alertas. Va muy rápido para ver en pantalla.',
  },
  slot: {
    frase: 'Un hueco o estante en la bodega.',
    analogia: 'Cada casillero del locker del colegio.',
    guion: 'Puede estar libre, ocupado o reservado.',
  },
  caja: {
    frase: 'Una caja con producto adentro.',
    analogia: 'Una caja de zapatos con etiqueta que dice qué hay dentro.',
    guion: 'Entra cuando compras; sale cuando vendes.',
  },
  orden_trabajo: {
    frase: 'Orden de mover una caja de un sitio a otro.',
    analogia: 'Misión del juego: llevar el cofre del punto A al B.',
    guion: 'Un operario la hace; el jefe puede crearla.',
  },
  alerta: {
    frase: 'Aviso de que algo va mal.',
    analogia: 'Luces rojas en el tablero del carro.',
    guion: 'Ejemplo: un hueco lleva mucho tiempo raro o hay problema de frío.',
  },
  historial_movimiento: {
    frase: 'Diario de todo lo que se movió.',
    analogia: 'El cuaderno del profe con fecha de cada cambio.',
    guion: 'No borras el pasado: queda guardado para revisar después.',
  },
  solicitud_procesamiento: {
    frase: 'Pedido de transformar un producto en otro.',
    analogia: 'Pedir convertir jugo de naranja en concentrado.',
    guion: 'Entra materia prima; sale otro producto con cantidades.',
  },
  registro_merma: {
    frase: 'Lo que se perdió o no salió bien.',
    analogia: 'Si se derramó leche, anotas cuánto se perdió.',
    guion: 'Va ligado al procesamiento.',
  },
  orden_venta: {
    frase: 'Pedido de venta: quiero mandar esto a alguien.',
    analogia: 'La nota del cliente que pide entrega.',
    guion: 'Sale de una bodega hacia un comprador.',
  },
  linea_orden_venta: {
    frase: 'Cada producto de esa venta.',
    analogia: 'Cada renglón de la nota de venta.',
    guion: 'Cantidad y qué producto van en el camión.',
  },
  viaje_transporte: {
    frase: 'El viaje del camión con la mercancía.',
    analogia: 'El reparto de Amazon con número de seguimiento.',
    guion: 'Une la venta, el camión y el chofer.',
  },
  evidencia_entrega: {
    frase: 'Prueba de que llegó (foto, firma).',
    analogia: 'La foto que el repartidor manda de la puerta.',
    guion: 'Se guarda cuando termina el viaje.',
  },
  contador_documento: {
    frase: 'Contador para números automáticos (viaje 001, 002…).',
    analogia: 'Como el turno en la fila del banco que sube solo.',
    guion: 'El programa no repite el mismo número dos veces.',
  },
  auditoria: {
    frase: 'Cuaderno de "quién hizo qué y cuándo".',
    analogia: 'La cámara de seguridad del sistema.',
    guion: 'Si alguien borra o cambia algo importante, queda anotado.',
  },
}

function whoSimple(createdBy) {
  return WHO_SIMPLE[createdBy] ?? createdBy
}

function simplifyThenRead(text) {
  if (!text) return 'El siguiente paso del cuento.'
  return text
    .replace(/Tabla (\d+)/g, 'Paso $1')
    .replace(/solicitud_alta_bodega/g, 'pedido de bodega')
    .replace(/asignacion_bodega/g, 'quién trabaja en la bodega')
    .replace(/warehouse_state/g, 'mapa en vivo de la bodega')
    .replace(/linea_orden_compra/g, 'líneas del pedido de compra')
    .replace(/linea_orden_venta/g, 'líneas de la venta')
    .replace(/tenant/gi, 'cuenta de trabajo')
    .replace(/codigo_cuenta/g, 'código de la cuenta')
    .replace(/configurador TI/gi, 'equipo del programa')
}

function entityRelationsSimple(entityId) {
  const entity = getEntityById(entityId)
  if (!entity?.relations?.length) return 'Todavía no se conecta con otras tablas en el dibujo.'
  return entity.relations
    .map((r) => `- Se relaciona con **${r.entity}**: ${r.label}`)
    .join('\n')
}

function entityFieldsSimple(entityId) {
  const entity = getEntityById(entityId)
  if (!entity?.fields?.length) return ''
  const important = entity.fields.filter((f) => f.pk || f.fk).slice(0, 6)
  if (!important.length) return ''
  return important
    .map((f) => {
      let line = `- **${f.name}**`
      if (f.pk) line += ' (es el código único de la fila)'
      if (f.fk) line += ` (apunta a otra tabla: ${f.fk})`
      return line
    })
    .join('\n')
}

function buildStepSection(step) {
  const kids = STEP_KIDS[step.entityId]
  const entity = step.entityId.startsWith('_') ? null : getEntityById(step.entityId)
  const title = kids?.frase ?? step.title

  const lines = [
    `### Paso ${step.order} — ${step.table} — ${title}`,
    '',
    `**En una frase:** ${kids?.frase ?? step.title}`,
    '',
  ]

  if (kids?.analogia) {
    lines.push('**Imagínalo así:**', '', kids.analogia, '')
  }

  lines.push(
    `**Quién lo usa o lo crea:** ${whoSimple(step.createdBy)}`,
    '',
    `**Antes de este paso:** ${kids?.antes ?? simplifyThenRead(step.readFirst)}`,
    '',
    `**Después sigue:** ${kids?.despues ?? simplifyThenRead(step.thenRead)}`,
    '',
    '#### Cuenta esto en voz alta (30–60 segundos)',
    '',
    kids?.guion ?? step.readFirst,
    '',
  )

  if (entity) {
    const fields = entityFieldsSimple(step.entityId)
    const indexes = step.indexes ?? entity.indexes ?? []
    lines.push(
      '<details>',
      '<summary>🔧 Detalle técnico (para adultos / programadores)</summary>',
      '',
      `**Nombre en el sistema:** ${entity.name}`,
      '',
      entity.desc ? `${entity.desc}` : '',
      '',
      '**Conexiones en el dibujo ER:**',
      '',
      entityRelationsSimple(step.entityId),
      '',
    )
    if (fields) {
      lines.push('**Datos importantes en la tabla:**', '', fields, '')
    }
    if (indexes.length) {
      lines.push('**Índices (para que el programa vaya rápido):**', '', indexes.map((i) => `- ${i}`).join('\n'), '')
    }
    lines.push('</details>', '')
  }

  return lines.join('\n')
}

/**
 * Markdown completo — lenguaje simple + detalle técnico plegable.
 */
export function buildErExplanationMarkdown() {
  const lines = [
    '# Guía para explicar las tablas del sistema — como cuento paso a paso',
    '',
    'Esta guía está escrita para que **cualquier persona** entienda el dibujo de tablas (ER),',
    'incluso si tienes **10 años** o nunca viste una base de datos.',
    '',
    'Cada **paso** es una pieza del rompecabezas. Léelos del **0 al 31** en orden, como capítulos de un libro.',
    '',
    '---',
    '',
    '## Antes de empezar (3 ideas fáciles)',
    '',
    '1. **Tabla** = una hoja de Excel con muchas filas del mismo tipo (usuarios, bodegas, productos…).',
    '2. **El equipo del programa** (configurador) monta el mundo; **el jefe de la empresa** lo usa.',
    '3. **Empresa** es el nombre grande del cliente; **cuenta** es el salón donde pasa el trabajo cada día.',
    '',
    '### Los tres personajes principales',
    '',
    '| Personaje | ¿Quién es? |',
    '|-----------|------------|',
    '| Equipo del programa | Los que crean empresas, bodegas y arreglan el sistema |',
    '| Jefe de empresa (admin) | Pide bodegas, llena listas, asigna trabajadores |',
    '| Trabajadores | Operarios, custodios, choferes… hacen el trabajo en la bodega |',
    '',
    '### Cuánto dura contarlo',
    '',
    '| Modo | Pasos | Tiempo | Qué cuentas |',
    '|------|-------|--------|-------------|',
    '| Corto | 0–7 | ~20 min | Cómo nace la empresa y la bodega |',
    '| Medio | 8–17 | +20 min | Listas y compras |',
    '| Completo | 0–31 | ~1 hora | Todo el cuento hasta ventas y camión |',
    '',
    '---',
    '',
    '## El cuento completo (mapa)',
    '',
    '```',
    FLOW_SIMPLE_ASCII,
    '```',
    '',
    '---',
    '',
  ]

  for (const phase of SCHEMA_READING_PHASES) {
    const simpleLabel = phase.label.replace(/^FASE \d+ — /, '')
    lines.push(
      `## ${phase.label}`,
      '',
      '**En palabras fáciles:**',
      '',
      PHASE_SIMPLE[phase.id] ?? phase.summary,
      '',
    )
    const steps = TABLE_READING_SEQUENCE.filter((s) => s.phaseId === phase.id)
    for (const step of steps) {
      lines.push(buildStepSection(step))
    }
    lines.push('---', '')
  }

  lines.push(
    '## Lista rápida — todos los pasos',
    '',
    '| Paso | Tabla | De qué trata | Quién |',
    '|------|-------|--------------|-------|',
  )

  for (const step of TABLE_READING_SEQUENCE) {
    const kids = STEP_KIDS[step.entityId]
    lines.push(
      `| ${step.order} | \`${step.table}\` | ${kids?.frase ?? step.title} | ${whoSimple(step.createdBy)} |`,
    )
  }

  lines.push(
    '',
    '## Preguntas que suele hacer un niño (y la respuesta)',
    '',
    '**¿Por qué tantas tablas?**',
    'Porque si metes todo en una sola hoja se hace un lío. Es como tener un cuaderno de tareas, otro de amigos y otro de compras — no uno solo para todo.',
    '',
    '**¿Qué es el configurador?**',
    'No es un robot. Es la persona del equipo que construye el programa y crea las empresas en el sistema.',
    '',
    '**¿La bodega es un edificio de verdad?**',
    'En la vida real sí. En el programa es una fila que dice "esta nevera existe" y dónde está.',
    '',
    '**¿Para qué sirve el mapa en vivo?**',
    'Para ver al instante dónde está cada caja, como un GPS del almacén.',
    '',
    '## Checklist — ¿lo entendieron?',
    '',
    '- [ ] ¿Saben quién crea la empresa y quién solo la usa?',
    '- [ ] ¿Entienden pedir bodega → crear bodega → apuntarse a la bodega?',
    '- [ ] ¿Ven la diferencia entre empresa y cuenta de trabajo?',
    '- [ ] ¿Sabían que comprar y vender son pasos distintos con sus propias hojas?',
    '',
    '---',
    '',
    `*${ENTITIES.length} piezas del rompecabezas · modelo 3NF · Dev Hub Bodega de Frío*`,
    '',
  )

  return lines.join('\n')
}

export const ER_EXPLANATION_DOC_PATH = '/docs/guia_explicacion_tablas_er.md'
