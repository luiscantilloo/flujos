#!/usr/bin/env node
/**
 * Regenera public/docs/bodega_de_frio_documentacion_v2_0.md desde el .txt exportado del Word.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { bodegaV20PlainToMarkdown } from '../src/docs/utils/bodegaV20PlainToMarkdown.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = join(root, 'public/docs/bodega_de_frio_documentacion_v2_0.txt')
const md = join(root, 'public/docs/bodega_de_frio_documentacion_v2_0.md')

writeFileSync(md, bodegaV20PlainToMarkdown(readFileSync(txt, 'utf8')), 'utf8')
console.log('OK:', md)
