import { isValidElement } from 'react'

export function extractPlainText(node) {
  if (node == null || node === false) return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(extractPlainText).join('')
  if (isValidElement(node)) return extractPlainText(node.props.children)
  return ''
}
