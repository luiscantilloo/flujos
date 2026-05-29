import {
  FLOW_SUB_RE,
  SUBSECTION_NUM_RE,
  SUBTITLE_LINES,
  escapeMdCell,
  formatMainSection,
  isActoresLine,
  isAudienceBullet,
  isEmojiOnly,
  isEndpoint,
  isGitCommand,
  isInstallStepTitle,
  isListIntro,
  isMainSection,
  isRunbookTitle,
  matchTableHeader,
  renderTable,
} from './bodegaDocTables.js'

const ONBOARDING_BULLET_RE =
  /^(Leer|Clonar|Ejecutar|Configurar|Hacer|Solicitar|Abrir|Explorar|Día\s)/

const CRITICAL_TEST_RE = /^[a-zA-Z]+\(\)/

function cleanReference(text) {
  return text.replace(/^📎\s*/, '').replace(/^Archivo referenciado:\s*/i, '').trim()
}

function cleanNote(text) {
  return text.replace(/^📌\s+/, '').trim()
}

function cleanStatusCell(cell) {
  const raw = String(cell).replace(/✅\s*/g, '').replace(/☐\s*/g, '').trim()
  if (!raw || /^pendiente$/i.test(raw)) return 'Pendiente'
  return raw
}

function parseTableRows(lines, start, colCount, headerSkip = 0) {
  let i = start + headerSkip
  const rows = []

  while (i < lines.length) {
    const tr = lines[i]?.trim() ?? ''
    if (!tr) {
      if (rows.length > 0) break
      i += 1
      continue
    }
    if (isEmojiOnly(tr) || isMainSection(tr) || matchTableHeader(lines, i)) break
    if (SUBSECTION_NUM_RE.test(tr) || FLOW_SUB_RE.test(tr)) break
    if (isEndpoint(tr) || isRunbookTitle(tr)) break
    if (SUBTITLE_LINES.has(tr)) break
    if (/^📌|^📎/.test(tr)) break

    const chunk = []
    for (let c = 0; c < colCount && i < lines.length; c++) {
      const cell = lines[i]?.trim() ?? ''
      if (!cell && c === 0) break
      chunk.push(c === colCount - 1 && colCount >= 2 ? cleanStatusCell(cell) : cell)
      i += 1
    }
    if (chunk.length < colCount) break
    rows.push(chunk)
  }

  return { rows, nextIndex: i }
}

function collectBulletList(lines, start, predicate) {
  const items = []
  let i = start
  while (i < lines.length) {
    const tr = lines[i]?.trim() ?? ''
    if (!tr) {
      if (items.length) break
      i += 1
      continue
    }
    if (!predicate(tr, lines, i)) break
    items.push(tr)
    i += 1
  }
  return { items, nextIndex: i }
}

function collectResponsibilityList(lines, start) {
  return collectBulletList(lines, start, (tr) => {
    if (isEmojiOnly(tr) || isMainSection(tr)) return false
    if (SUBTITLE_LINES.has(tr)) return false
    if (matchTableHeader(lines, start)) return false
    return tr.length < 200 && !tr.startsWith('📌')
  })
}

function collectDoDList(lines, start) {
  return collectBulletList(lines, start, (tr) => {
    if (isMainSection(tr) || SUBTITLE_LINES.has(tr)) return false
    return tr.length < 180
  })
}

function collectOnboardingList(lines, start) {
  return collectBulletList(lines, start, (tr) => ONBOARDING_BULLET_RE.test(tr))
}

function collectCriticalTests(lines, start) {
  return collectBulletList(lines, start, (tr) => CRITICAL_TEST_RE.test(tr) || tr.endsWith('():'))
}

function renderInstallSteps(lines, start) {
  const blocks = []
  let i = start
  while (i < lines.length) {
    const title = lines[i]?.trim() ?? ''
    if (!isInstallStepTitle(title)) break
    i += 1
    const cmd = lines[i]?.trim() ?? ''
    if (cmd.startsWith('Completar')) {
      blocks.push(`> **Nota.** ${cmd}\n\n`)
      i += 1
      continue
    }
    blocks.push(`#### ${title}\n\n\`\`\`bash\n${cmd}\n\`\`\`\n\n`)
    i += 1
  }
  return { md: blocks.join(''), nextIndex: i }
}

function renderRunbook(lines, start) {
  const title = lines[start].trim()
  const steps = []
  let i = start + 1
  while (i < lines.length) {
    const tr = lines[i]?.trim() ?? ''
    if (!tr) {
      i += 1
      continue
    }
    if (isRunbookTitle(tr) || isMainSection(tr) || SUBTITLE_LINES.has(tr)) break
    if (isEmojiOnly(tr)) break
    steps.push(tr)
    i += 1
  }
  const list = steps.map((s, idx) => `${idx + 1}. ${s}`).join('\n')
  return { md: `### ${title}\n\n${list}\n\n`, nextIndex: i }
}

function renderHiloTimeline(rows) {
  const lines = ['| Paso | Etapa | Qué ocurre |', '| ---: | --- | --- |']
  for (const row of rows) {
    const [num, etapa, desc] = row
    lines.push(`| ${escapeMdCell(num)} | **${escapeMdCell(etapa)}** | ${escapeMdCell(desc)} |`)
  }
  return `${lines.join('\n')}\n\n`
}

function trySectionSubtitle(lines, i) {
  const next = lines[i + 1]?.trim() ?? ''
  const next2 = lines[i + 2]?.trim() ?? ''
  if (!next || next.length > 110 || SUBTITLE_LINES.has(next) || isMainSection(next)) return null
  if (/^📎|^El |^Los |^Sin |^Esta |^El sistema|^El archivo|^El diagrama|^El proyecto|^Framework|^Los ADRs|^Storybook|^Esta sección/.test(next2)) {
    return next
  }
  return null
}

/**
 * Convierte texto plano del Word en Markdown estructurado (tablas, listas, subsecciones).
 */
export function bodegaPlainToMarkdown(raw) {
  const lines = raw.split(/\r?\n/)
  const out = []
  let i = 0

  const titleLines = []
  for (; i < lines.length; i++) {
    const tr = lines[i].trim()
    if (tr === '🎯' || tr === '0. VISIÓN DE NEGOCIO') {
      if (tr === '0. VISIÓN DE NEGOCIO') {
        out.push(`## 0. VISIÓN DE NEGOCIO\n\n`)
      }
      i += 1
      break
    }
    if (!tr || isEmojiOnly(tr)) continue
    titleLines.push(tr)
  }

  if (titleLines.length) {
    out.push(`# ${titleLines[0]}\n\n`)
    const meta = titleLines.slice(1)
    if (meta.length) {
      out.push('| Meta | Detalle |\n| --- | --- |\n')
      meta.forEach((line, idx) => {
        const label =
          idx === 0 ? 'Subtítulo' : idx === 1 ? 'Versión' : idx === 2 ? 'Stack' : 'Resumen'
        out.push(`| ${label} | ${escapeMdCell(line)} |\n`)
      })
      out.push('\n---\n\n')
    }
  }

  let inAudienceList = false
  let collectOnboarding = false
  let collectCritical = false

  for (; i < lines.length; i++) {
    const tr = lines[i]?.trim() ?? ''
    if (!tr) continue
    if (tr === '##' || tr === '###') continue

    const tableMatch = tr === '#' || matchTableHeader(lines, i) ? matchTableHeader(lines, i) : null
    if (tableMatch) {
      inAudienceList = false
      collectOnboarding = false
      collectCritical = false
      const headerSkip = tableMatch.headerLines ?? tableMatch.colCount
      const { rows, nextIndex } = parseTableRows(lines, i, tableMatch.colCount, headerSkip)
      if (rows.length > 0) {
        if (tableMatch.key === 'hilo_etapas') {
          out.push(renderHiloTimeline(rows))
        } else {
          out.push(renderTable(tableMatch.cols, rows))
        }
        i = nextIndex - 1
        continue
      }
    }

    if (tr === '#') continue

    if (isEmojiOnly(tr)) {
      out.push('\n---\n\n')
      inAudienceList = false
      collectOnboarding = false
      collectCritical = false
      continue
    }

    if (/^📌\s+/.test(tr)) {
      out.push(`> **Nota.** ${cleanNote(tr)}\n\n`)
      inAudienceList = false
      continue
    }

    if (/^📎\s+/.test(tr)) {
      out.push(`> **Archivo referenciado.** ${cleanReference(tr)}\n\n`)
      continue
    }

    if (tr === '0. VISIÓN DE NEGOCIO') {
      out.push(`## 0. VISIÓN DE NEGOCIO\n\n`)
      const subtitle = lines[i + 1]?.trim()
      if (subtitle === 'Propósito, público objetivo e hilo conductor del sistema') {
        out.push(`*${subtitle}*\n\n`)
        i += 1
      }
      continue
    }

    if (tr === 'Propósito, público objetivo e hilo conductor del sistema') {
      out.push(`*${tr}*\n\n`)
      continue
    }

    if (isMainSection(tr) && !FLOW_SUB_RE.test(tr)) {
      inAudienceList = false
      collectOnboarding = false
      collectCritical = false
      const title = formatMainSection(tr)
      out.push(`\n## ${title}\n\n`)
      const sub = trySectionSubtitle(lines, i)
      if (sub) {
        out.push(`*${sub}*\n\n`)
        i += 1
      }
      continue
    }

    const flowM = tr.match(FLOW_SUB_RE)
    if (flowM) {
      inAudienceList = false
      collectOnboarding = false
      collectCritical = false
      out.push(`\n### Flujo ${flowM[1]} — ${flowM[2]}\n\n`)
      continue
    }

    const subNumM = tr.match(SUBSECTION_NUM_RE)
    if (subNumM && !tr.includes('—')) {
      inAudienceList = false
      collectOnboarding = false
      collectCritical = false
      out.push(`\n### ${subNumM[1]} ${subNumM[2]}\n\n`)
      continue
    }

    if (SUBTITLE_LINES.has(tr)) {
      inAudienceList = tr === 'Público objetivo'
      collectOnboarding = tr.startsWith('Día 1 —')
      collectCritical = tr === 'Casos críticos a cubrir'
      out.push(`\n### ${tr}\n\n`)

      if (tr === 'Hilo conductor: compra → bodega → venta') {
        const intro = lines[i + 1]?.trim()
        if (intro?.includes('esquema')) {
          out.push(`${intro}\n\n`)
          i += 1
        }
        out.push(
          '> **Cadena resumida:** compra documentada → recepción honesta → ingreso visible → mapa auditado → (opcional) transformación → venta documentada → salida física → evidencia de entrega.\n\n',
        )
      }
      continue
    }

    if (collectOnboarding && ONBOARDING_BULLET_RE.test(tr)) {
      const { items, nextIndex } = collectOnboardingList(lines, i)
      out.push(`${items.map((x) => `- ${x}`).join('\n')}\n\n`)
      i = nextIndex - 1
      collectOnboarding = false
      continue
    }

    if (collectCritical && (CRITICAL_TEST_RE.test(tr) || tr.includes('()'))) {
      const { items, nextIndex } = collectCriticalTests(lines, i)
      out.push(`${items.map((x) => `- \`${x.replace(/:\s*$/, '')}\``).join('\n')}\n\n`)
      i = nextIndex - 1
      collectCritical = false
      continue
    }

    if (isEndpoint(tr)) {
      out.push(`\n#### \`${tr}\`\n\n`)
      const desc = lines[i + 1]?.trim()
      if (desc && desc.length > 40 && !SUBTITLE_LINES.has(desc)) {
        out.push(`${desc}\n\n`)
        i += 1
      }
      continue
    }

    if (isRunbookTitle(tr)) {
      const { md, nextIndex } = renderRunbook(lines, i)
      out.push(md)
      i = nextIndex - 1
      continue
    }

    if (isActoresLine(tr)) {
      out.push(`**${tr}**\n\n`)
      continue
    }

    if (isListIntro(tr)) {
      out.push(`${tr}\n\n`)
      const { items, nextIndex } =
        tr === 'Un cambio está terminado cuando:'
          ? collectDoDList(lines, i + 1)
          : collectResponsibilityList(lines, i + 1)
      if (items.length) {
        out.push(`${items.map((x) => `- ${x}`).join('\n')}\n\n`)
        i = nextIndex - 1
      }
      continue
    }

    if (inAudienceList && isAudienceBullet(tr)) {
      const bullets = [tr]
      let j = i + 1
      while (j < lines.length && isAudienceBullet(lines[j]?.trim())) {
        bullets.push(lines[j].trim())
        j += 1
      }
      out.push(`${bullets.map((b) => `- ${b}`).join('\n')}\n\n`)
      i = j - 1
      inAudienceList = false
      continue
    }

    if (isInstallStepTitle(tr)) {
      const { md, nextIndex } = renderInstallSteps(lines, i)
      out.push(md)
      i = nextIndex - 1
      continue
    }

    if (isGitCommand(tr)) {
      out.push(`\`\`\`bash\n${tr}\n\`\`\`\n\n`)
      continue
    }

    if (tr.length > 0) {
      let para = tr
      let j = i + 1
      while (j < lines.length) {
        const next = lines[j]?.trim() ?? ''
        if (!next) break
        if (
          isMainSection(next) ||
          SUBTITLE_LINES.has(next) ||
          isEmojiOnly(next) ||
          next === '#' ||
          matchTableHeader(lines, j) ||
          isEndpoint(next) ||
          isAudienceBullet(next) ||
          isInstallStepTitle(next) ||
          ONBOARDING_BULLET_RE.test(next) ||
          CRITICAL_TEST_RE.test(next) ||
          /^📌|^📎/.test(next)
        ) {
          break
        }
        if (next.length > 25 && !next.endsWith('.') && next.length < 120) break
        if (para.length + next.length > 600) break
        para += ` ${next}`
        j += 1
      }
      out.push(`${para}\n\n`)
      i = j - 1
    }
  }

  return out.join('').replace(/\n{4,}/g, '\n\n\n').trim() + '\n'
}
