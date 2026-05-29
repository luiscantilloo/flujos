/**
 * Convierte el texto plano extraído de BodegaDeFrio_DocumentacionV2.docx a Markdown.
 */

const MAIN_RE = /^(\d+)\.\s+(.+)$/
const SUB_RE = /^(\d+\.\d+)\s+(.+)$/
const PAGEREF_RE = /\s+PAGEREF\s+_Toc\d+\s+\\h\s+\d+\s*$/
const TOC_LINE_RE = /^TOC\s+\\/

const TABLE_SPECS = [
  { cols: 3, headers: ['Característica', 'V1.0', 'V2.0'] },
  { cols: 3, headers: ['Tecnología', 'Versión', 'Uso'] },
  { cols: 3, headers: ['Rol', 'Acceso Principal', 'Acciones Permitidas'] },
  { cols: 2, headers: ['Estado', 'Descripción'] },
  { cols: 3, headers: ['Tipo', 'Disparador', 'Acción Requerida'] },
  { cols: 3, headers: ['Módulo', 'Datos Incluidos'] },
  { cols: 3, headers: ['Ruta', 'Módulo'] },
  { cols: 3, headers: ['Comando', 'Descripción'] },
  { cols: 2, headers: ['Tecnología', 'Uso'] },
  { cols: 2, headers: ['Término', 'Definición'] },
]

const SUBTITLES = new Set([
  'Principios de Diseño',
  'Frontend',
  'Backend',
  'Base de datos',
  'Estructura de Archivos',
  'Flujo de Datos',
  'Colecciones Principales',
  'Estructura del Estado Principal (state/main)',
  'Supabase Principal',
  'Fridem (Bodega Externa)',
  'Cloudinary',
  'n8n / Integración Proveedores',
  'Prerrequisitos',
  'Instalación Local',
  'Scripts Disponibles',
  'Despliegue en Producción (Vercel)',
  'Términos de Dominio',
  'Términos Técnicos',
  'Payload esperado:',
])

function cleanLine(line) {
  return line.replace(PAGEREF_RE, '').trim()
}

function escapeCell(c) {
  return String(c).replace(/\|/g, '\\|').replace(/\n/g, ' ')
}

function renderTable(headers, rows) {
  const head = `| ${headers.map(escapeCell).join(' | ')} |`
  const sep = `| ${headers.map(() => '---').join(' | ')} |`
  const body = rows.map((r) => `| ${r.map(escapeCell).join(' | ')} |`).join('\n')
  return `${head}\n${sep}\n${body}\n\n`
}

function matchTableHeader(lines, i) {
  for (const spec of TABLE_SPECS) {
    const chunk = []
    for (let c = 0; c < spec.cols; c++) {
      chunk.push(cleanLine(lines[i + c] ?? ''))
    }
    if (chunk.every((cell, idx) => cell === spec.headers[idx])) {
      return { cols: spec.cols, headers: spec.headers }
    }
  }
  return null
}

function isFlowLine(tr) {
  return (
    /^[├└│]/.test(tr) ||
    tr.includes('↓') ||
    tr === 'LECTURA (Tiempo Real)' ||
    tr === 'ESCRITURA (Validación Atómica)' ||
    tr === 'INTEGRACIONES (Salidas)' ||
    /^Usuario\s/.test(tr) ||
    /^NestJS\s/.test(tr) ||
    /^PostgreSQL\s/.test(tr) ||
    /^Supabase\s/.test(tr) ||
    /^Cloudinary\s/.test(tr) ||
    /^n8n\s/.test(tr) ||
    /^WhatsApp/.test(tr) ||
    /^\d+\.\s+Función/.test(tr) ||
    /^¿/.test(tr) ||
    /^├──/.test(tr) ||
    /^└──/.test(tr) ||
    /^→\s/.test(tr) ||
    /^Abrir app/.test(tr) ||
    /^Llegada de/.test(tr) ||
    /^OperadorCuentas/.test(tr) ||
    /^Estados de/.test(tr) ||
    /^Generación de/.test(tr) ||
    /^Conductor/.test(tr) ||
    /^Por cada/.test(tr) ||
    /^Cierre de/.test(tr) ||
    /^Se actualiza/.test(tr) ||
    /^Pendiente →/.test(tr) ||
    /^Borrador →/.test(tr) ||
    /^Estado:\s/.test(tr) ||
    /^Al (INICIAR|TERMINAR)/.test(tr) ||
    /^Si hay/.test(tr) ||
    /^Actualizar/.test(tr) ||
    /^Custodio/.test(tr) ||
    /^Sistema valida/.test(tr) ||
    /^Asignar/.test(tr) ||
    /^Los campos/.test(tr) ||
    /^Antes de/.test(tr) ||
    /^Configuración de/.test(tr) ||
    /^Alta de/.test(tr) ||
    /^Catálogo de/.test(tr) ||
    /^Proveedores/.test(tr) ||
    /^Flota de/.test(tr) ||
    /^Asignación de/.test(tr) ||
    /^Leer rol/.test(tr) ||
    /^Renderizar/.test(tr) ||
    /^Cargar perfil/.test(tr) ||
    /^Validación contra/.test(tr) ||
    /^Registro de trazabilidad/.test(tr) ||
    /^Creación de orden/.test(tr) ||
    /^Cierre de recepción/.test(tr) ||
    /^Capacidades de exportación/.test(tr) ||
    /^Conectar repositorio/.test(tr) ||
    /^Configurar todas/.test(tr) ||
    /^Deploy automático/.test(tr) ||
    /^URL producción/.test(tr) ||
    /^Causa:/.test(tr) ||
    /^Síntoma:/.test(tr) ||
    /^Solución/.test(tr) ||
    /^Verificar/.test(tr) ||
    /^Reglas de/.test(tr) ||
    /^No es un error/.test(tr) ||
    /^Proxy que/.test(tr) ||
    /^Recibe un/.test(tr) ||
    /^Recibe FormData/.test(tr) ||
    /^Si hay CLOUDINARY/.test(tr) ||
    /^Devuelve URL/.test(tr) ||
    /^Bodega externa/.test(tr) ||
    /^Plataforma open/.test(tr) ||
    /^Usar CLOUDINARY/.test(tr) ||
    /^Definir CLOUDINARY/.test(tr) ||
    /^lib\//.test(tr) ||
    /^PEDIDO_/.test(tr)
  )
}

function isCodeLine(tr) {
  return (
    /^frio-(frontend|backend)\//.test(tr) ||
    /^[│├└]/.test(tr) ||
    /^\{$/.test(tr) ||
    /^\}$/.test(tr) ||
    /^"[\w]+":/.test(tr) ||
    /^\/\//.test(tr) ||
    /^const nextConfig/.test(tr) ||
    /^turbopack:/.test(tr) ||
    /^root:/.test(tr) ||
    /^slots:/.test(tr) ||
    /^inboundBoxes:/.test(tr) ||
    /^[a-z][a-zA-Z]+:\s/.test(tr) && tr.endsWith(',') ||
    /^NEXT_PUBLIC_/.test(tr) ||
    /^CLOUDINARY_/.test(tr) ||
    /^PEDIDO_/.test(tr) ||
    /^#\s/.test(tr) ||
    /^(npm|git|cp|node)\s/.test(tr) ||
    /^warehouses\//.test(tr) ||
    /^PostgreSQL \(/.test(tr) ||
    /^Supabase \(/.test(tr) ||
    /^# Opción/.test(tr)
  )
}

function isPrincipleBullet(tr) {
  return /^[A-Za-zÁÉÍÓÚáéíóúñ-]+:\s/.test(tr) && tr.length < 220
}

function collectParagraph(lines, start) {
  const parts = []
  let i = start
  while (i < lines.length) {
    const tr = lines[i]?.trim() ?? ''
    if (!tr) break
    if (MAIN_RE.test(tr) || SUB_RE.test(tr)) break
    if (matchTableHeader(lines, i)) break
    if (SUBTITLES.has(tr)) break
    if (isFlowLine(tr) || isCodeLine(tr)) break
    if (/^POST\s+\/api\//.test(tr)) break
    if (/^💡/.test(tr)) break
    if (/^Responsable:/.test(tr)) break
    if (/^Estados de la/.test(tr) && tr.includes('Orden')) break
    parts.push(tr)
    i += 1
  }
  return { text: parts.join(' '), next: i }
}

function collectFlowBlock(lines, start) {
  const block = []
  let i = start
  while (i < lines.length) {
    const tr = lines[i]?.trim() ?? ''
    if (!tr) {
      if (block.length) break
      i += 1
      continue
    }
    if (!isFlowLine(tr) && block.length) break
    if (!isFlowLine(tr)) break
    block.push(tr)
    i += 1
  }
  if (!block.length) return { md: '', next: start }
  return { md: '```text\n' + block.join('\n') + '\n```\n\n', next: i }
}

function collectCodeBlock(lines, start) {
  const block = []
  let i = start
  while (i < lines.length) {
    const tr = lines[i]?.trim() ?? ''
    if (!tr) {
      if (block.length) break
      i += 1
      continue
    }
    if (!isCodeLine(tr) && block.length) break
    if (!isCodeLine(tr) && !isFlowLine(tr)) break
    block.push(tr.replace(/\[cite:\s*\d+\]/g, '').trimEnd())
    i += 1
  }
  if (!block.length) return { md: '', next: start }
  const lang = block.some((l) => l.startsWith('#') || l.startsWith('npm ') || l.startsWith('git '))
    ? 'bash'
    : block.some((l) => l.startsWith('{') || l.startsWith('"'))
      ? 'json'
      : 'text'
  return { md: '```' + lang + '\n' + block.join('\n') + '\n```\n\n', next: i }
}

function collectBulletSection(lines, start, stopWhen) {
  const items = []
  let i = start
  while (i < lines.length) {
    const tr = cleanLine(lines[i] ?? '')
    if (!tr) break
    if (stopWhen?.(tr) || MAIN_RE.test(tr) || SUB_RE.test(tr)) break
    if (matchTableHeader(lines, i) || SUBTITLES.has(tr)) break
    if (/^💡/.test(tr) || /^POST\s+\/api\//.test(tr)) break
    if (tr.length > 200) break
    items.push(tr)
    i += 1
  }
  if (!items.length) return { md: '', next: start }
  return { md: items.map((t) => `- ${t}`).join('\n') + '\n\n', next: i }
}

function skipTocBlock(lines) {
  let i = 0
  while (i < lines.length) {
    const tr = cleanLine(lines[i])
    if (tr === 'Tabla de Contenidos' || TOC_LINE_RE.test(tr) || PAGEREF_RE.test(lines[i])) {
      i += 1
      continue
    }
    if (MAIN_RE.test(tr) && !PAGEREF_RE.test(lines[i])) {
      const rest = tr.replace(MAIN_RE, '$2')
      if (rest.length > 3 && !rest.includes('PAGEREF')) return i
    }
    i += 1
  }
  return 0
}

export function bodegaV20PlainToMarkdown(raw) {
  const lines = raw.split(/\r?\n/).map((l) => l.replace(/\r$/, ''))
  const out = []

  out.push('# BODEGA DE FRÍO\n\n')
  out.push('| Meta | Detalle |\n| --- | --- |\n')
  const metaRows = [
    [1, 'Subtítulo', cleanLine(lines[1] ?? '')],
    [2, 'Descripción', cleanLine(lines[2] ?? '')],
    [3, 'Stack', cleanLine(lines[4] ?? '')],
    [4, 'Fecha', cleanLine(lines[5] ?? '')],
    [5, 'Enlaces', cleanLine(lines[6] ?? '')],
  ]
  for (const [, k, v] of metaRows) {
    if (v) out.push(`| ${k} | ${escapeCell(v)} |\n`)
  }
  out.push('\n---\n\n')

  let i = skipTocBlock(lines)
  if (i < 8) i = 68

  while (i < lines.length) {
    let tr = cleanLine(lines[i] ?? '')
    if (!tr) {
      i += 1
      continue
    }

    if (tr.startsWith('Documentación V2.0')) {
      i += 1
      continue
    }

    const main = tr.match(MAIN_RE)
    if (main && !SUB_RE.test(tr)) {
      out.push(`\n## ${main[1]}. ${main[2]}\n\n`)
      i += 1
      continue
    }

    const sub = tr.match(SUB_RE)
    if (sub) {
      out.push(`\n### ${sub[1]} ${sub[2]}\n\n`)
      i += 1
      continue
    }

    if (/^POST\s+\/api\//.test(tr)) {
      out.push(`\n#### \`${tr}\`\n\n`)
      i += 1
      continue
    }

    if (/^💡/.test(tr)) {
      out.push(`> **${tr.replace(/^💡\s*/, '')}**\n\n`)
      i += 1
      continue
    }

    if (/^Responsable:/.test(tr)) {
      out.push(`**${tr}**\n\n`)
      i += 1
      continue
    }

    if (SUBTITLES.has(tr)) {
      out.push(`\n#### ${tr}\n\n`)
      i += 1
      if (tr === 'Principios de Diseño') {
        const { md, next } = collectBulletSection(lines, i, (line) => !isPrincipleBullet(line))
        if (md) {
          out.push(md)
          i = next
        }
      }
      continue
    }

    if (isPrincipleBullet(tr)) {
      const { md, next } = collectBulletSection(lines, i, (line) => !isPrincipleBullet(line))
      if (md) {
        out.push(md)
        i = next
        continue
      }
    }

    const tbl = matchTableHeader(lines, i)
    if (tbl) {
      const rows = []
      let j = i + tbl.cols
      while (j < lines.length) {
        const chunk = []
        for (let c = 0; c < tbl.cols && j < lines.length; c++) {
          const cell = cleanLine(lines[j] ?? '')
          if (!cell && c === 0) break
          chunk.push(cell)
          j += 1
        }
        if (chunk.length < tbl.cols) break
        const nextLine = cleanLine(lines[j] ?? '')
        if (
          MAIN_RE.test(nextLine) ||
          SUB_RE.test(nextLine) ||
          SUBTITLES.has(nextLine) ||
          matchTableHeader(lines, j) ||
          /^💡/.test(nextLine) ||
          /^POST\s+\/api\//.test(nextLine) ||
          /^Responsable:/.test(nextLine)
        ) {
          rows.push(chunk)
          break
        }
        if (isFlowLine(nextLine) || isCodeLine(nextLine)) {
          rows.push(chunk)
          break
        }
        rows.push(chunk)
      }
      out.push(renderTable(tbl.headers, rows))
      i = j
      continue
    }

    if (isCodeLine(tr) || /^frio-/.test(tr) || /^\/\/\s/.test(tr)) {
      const { md, next } = collectCodeBlock(lines, i)
      if (md) {
        out.push(md)
        i = next
        continue
      }
    }

    if (isFlowLine(tr)) {
      const { md, next } = collectFlowBlock(lines, i)
      if (md) {
        out.push(md)
        i = next
        continue
      }
    }

    if (tr === 'Estados de la Orden de Compra:' || tr === 'Estados de Orden de Venta:') {
      out.push(`**${tr}**\n\n`)
      i += 1
      const { md, next } = collectFlowBlock(lines, i)
      if (md) out.push(md)
      else {
        const line = cleanLine(lines[i] ?? '')
        if (line) out.push(`${line}\n\n`)
        i += 1
      }
      i = next > i ? next : i
      continue
    }

    if (/^(Crear|Node\.js|npm\s|Proyecto Supabase|Cuenta Cloudinary|Instancia n8n)/.test(tr)) {
      const { md, next } = collectBulletSection(lines, i, (line) => MAIN_RE.test(line))
      if (md) {
        out.push(md)
        i = next
        continue
      }
    }

    const para = collectParagraph(lines, i)
    if (para.text) {
      out.push(`${para.text}\n\n`)
      i = para.next
      continue
    }

    out.push(`${tr}\n\n`)
    i += 1
  }

  return out.join('').replace(/\n{3,}/g, '\n\n').trim() + '\n'
}
