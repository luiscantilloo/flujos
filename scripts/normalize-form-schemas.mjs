/**
 * Normaliza schema_*.md al formato de la plantilla:
 * Datos/Versión en tabla Campo|Valor, encabezados ###, Tabla 3 de 4 columnas, em-dash UTF-8.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const dirs = [
  join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'docs', 'formularios', 'schemas'),
]

const DATOS_KEYS = [
  'Formulario',
  'Proyecto / repo',
  'Protocolo de referencia',
  '¿Vive en un modal?',
  '¿Algún campo se pre-llena automáticamente (Extracción IA, información de BD, o ambos)?',
  'Responsable (Desarrollador)',
  'Fecha de creación',
]

function kvTable(rows) {
  const lines = ['| Campo | Valor |', '|---|---|']
  for (const [k, v] of rows) lines.push(`| ${k} | ${v} |`)
  return lines.join('\n')
}

function splitMdTable(block) {
  const lines = block.trim().split('\n').filter((l) => l.trim().startsWith('|'))
  if (lines.length < 3) return null
  const parse = (line) =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim())
  const headers = parse(lines[0])
  if (headers.every((h) => /^-+$/.test(h))) return null
  const rows = lines.slice(2).map(parse)
  return { headers, rows }
}

function convertDatos(md) {
  return md.replace(
    /#{2,3} Datos del formulario\r?\n\r?\n(\|[\s\S]*?\n(?:\|.*\n)+)/,
    (full, table) => {
      const parsed = splitMdTable(table)
      if (!parsed) return full
      if (parsed.headers[0] === 'Campo' && parsed.headers[1] === 'Valor') {
        return `### Datos del formulario\n\n${table.trim()}\n`
      }
      if (parsed.rows.length !== 1) return `### Datos del formulario\n\n${table.trim()}\n`
      const row = parsed.rows[0]
      const pairs = parsed.headers.map((h, i) => [h, row[i] ?? '—'])
      const byHeader = Object.fromEntries(pairs)
      const ordered = DATOS_KEYS.map((k) => {
        const found = Object.keys(byHeader).find((h) => h === k || h.startsWith(k.slice(0, 20)))
        return [k, found ? byHeader[found] : '—']
      })
      return `### Datos del formulario\n\n${kvTable(ordered)}\n`
    },
  )
}

function convertVersion(md) {
  return md.replace(
    /#{2,3} Versión y revisión[^\n]*\r?\n\r?\n(\|[\s\S]*?\n(?:\|.*\n)+)/,
    (full, table) => {
      const parsed = splitMdTable(table)
      if (!parsed) return full
      if (parsed.headers[0] === 'Campo' && parsed.headers[1] === 'Valor') {
        return `### Versión y revisión (del schema de ese formulario, no de esta plantilla)\n\n${table.trim()}\n`
      }
      const row = parsed.rows[0] ?? []
      const map = Object.fromEntries(parsed.headers.map((h, i) => [h, row[i] ?? '—']))
      const version = map['Versión del schema'] ?? map['Versión'] ?? 'v1.0'
      const fecha = map['Fecha de aprobación'] ?? map['Fecha'] ?? '15/09/2026'
      const aprobado = map['Aprobado por'] ?? map['Estado'] ?? 'Pendiente de aprobación'
      const proxima =
        map['Próxima revisión'] ??
        map['Criterio de nueva versión'] ??
        map['Criterio de revisión'] ??
        'Cuando el formulario cambie de campos o de reglas'
      return `### Versión y revisión (del schema de ese formulario, no de esta plantilla)

${kvTable([
  ['Versión del schema', version],
  ['Fecha de aprobación', fecha],
  ['Aprobado por', aprobado === 'Pendiente de aprobación' ? aprobado : aprobado],
  ['Próxima revisión', proxima],
])}
`
    },
  )
}

function convertTabla3(md) {
  return md.replace(
    /#{2,3} Tabla 3[^\n]*\r?\n\r?\n(\|[\s\S]*?\n(?:\|.*\n)+)/,
    (full, table) => {
      const parsed = splitMdTable(table)
      if (!parsed) return full
      const h = parsed.headers
      const already =
        h[0] === 'Campo' &&
        h[1]?.includes('pre-llenado') &&
        h[2]?.includes('Origen') &&
        h[3]?.includes('Editable')
      const header =
        '| Campo | ¿Tiene pre-llenado? | Origen del pre-llenado (única respuesta) | Editable manualmente por el usuario |'
      const sep = '|---|---|---|---|'
      if (already) {
        return `### Tabla 3 — Pre-llenado\n\n${header}\n${sep}\n${parsed.rows
          .map((r) => `| ${r[0]} | ${r[1]} | ${r[2]} | ${r[3]} |`)
          .join('\n')}\n`
      }
      const rows = parsed.rows.map((r) => {
        const campo = r[0] ?? '—'
        let origen = '—'
        let editable = 'Sí'
        if (h[1]?.includes('Origen')) {
          origen = r[1] ?? '—'
          editable = r[2] ?? 'Sí'
        } else if (h[2]?.includes('Origen')) {
          origen = r[2] ?? '—'
          editable = r[3] ?? 'Sí'
        }
        const tiene = !origen || origen === '—' ? 'No' : 'Sí'
        if (/extracci[oó]n ia/i.test(origen)) editable = 'Sí'
        return `| ${campo} | ${tiene} | ${origen} | ${editable} |`
      })
      return `### Tabla 3 — Pre-llenado\n\n${header}\n${sep}\n${rows.join('\n')}\n`
    },
  )
}

function normalize(md) {
  let out = md.replace(/\r\n/g, '\n')
  out = out.replace(/â€”/g, '—')
  out = out.replace(/â€“/g, '–')
  out = out.replace(/^## Tabla /gm, '### Tabla ')
  out = out.replace(/^## Notas y justificaciones/gm, '### Notas y justificaciones')
  out = out.replace(/^## Datos del formulario/gm, '### Datos del formulario')
  out = out.replace(/^## Versión y revisión/gm, '### Versión y revisión')
  out = convertDatos(out)
  out = convertTabla3(out)
  out = convertVersion(out)
  if (!out.endsWith('\n')) out += '\n'
  return out
}

let changed = 0
for (const dir of dirs) {
  let names
  try {
    names = (await readdir(dir)).filter((n) => n.startsWith('schema_') && n.endsWith('.md'))
  } catch {
    continue
  }
  for (const name of names) {
    const path = join(dir, name)
    const before = await readFile(path, 'utf8')
    const after = normalize(before)
    if (after !== before.replace(/\r\n/g, '\n') && after !== before) {
      await writeFile(path, after, 'utf8')
      changed += 1
      console.log('updated', path)
    } else if (after !== before) {
      await writeFile(path, after, 'utf8')
      changed += 1
      console.log('updated', path)
    }
  }
}
console.log(`Normalized ${changed} files`)
