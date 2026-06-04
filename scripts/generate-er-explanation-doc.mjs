/**
 * Genera public/docs/guia_explicacion_tablas_er.md desde el modelo del Dev Hub.
 */
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildErExplanationMarkdown } from '../src/data/erExplanationDocument.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outPath = join(root, 'public/docs/guia_explicacion_tablas_er.md')

writeFileSync(outPath, buildErExplanationMarkdown(), 'utf8')
console.log(`generate-er-explanation-doc: ${outPath}`)
