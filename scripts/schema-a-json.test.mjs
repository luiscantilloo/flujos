/**
 * Self-check del conversor contra la tabla de verificación del Formato 1.0
 * (schema_camion_crear.md).
 *
 *   node scripts/schema-a-json.test.mjs
 */
import { selfCheckCamionCrear } from './schema-a-json.mjs'

const result = selfCheckCamionCrear()

if (!result.ok) {
  console.error('FAIL — schema_camion_crear verificación Formato 1.0')
  for (const f of result.failures) {
    console.error(`\n${f.path}`)
    console.error(`  expected: ${JSON.stringify(f.expected)}`)
    console.error(`  actual:   ${JSON.stringify(f.actual)}`)
  }
  process.exit(1)
}

console.log('PASS — verificación Formato 1.0 (schema_camion_crear)')
console.log(`prueba_nivel_2: ${result.json.prueba_nivel_2 ? 'populated' : 'null'}`)
console.log(`advertencias (${result.advertencias.length}):`)
for (const a of result.advertencias) console.log(`  - ${a}`)

const p = result.json.prueba_nivel_2
if (p) {
  console.log(`acceso.ruta: ${p.acceso.ruta}`)
  console.log(`botones.guardar: ${JSON.stringify(p.botones.guardar)}`)
  console.log(`campos[0]: ${JSON.stringify(p.campos[0])}`)
}
