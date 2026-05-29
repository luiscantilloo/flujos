/**
 * Quita pictogramas decorativos del texto (p. ej. del Word) para sustituirlos por iconos en la UI.
 * No intenta ser exhaustivo con todos los ZWJ; cubre la mayoría de emojis usados en documentación.
 */
export function stripEmojis(text) {
  return String(text)
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/\uFE0F/g, '')
    .replace(/\u200D/g, '')
    .replace(/[\u{1F1E6}-\u{1F1FF}]{2}/gu, '')
}
