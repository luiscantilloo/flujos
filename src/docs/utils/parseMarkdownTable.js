import { Children, isValidElement } from 'react'
import { extractPlainText } from './extractPlainText.js'

export function parseMarkdownTable(children) {
  const headers = []
  const rows = []

  const readRow = (rowEl, intoHeaders) => {
    const cells = []
    Children.forEach(rowEl.props?.children, (cell) => {
      if (!isValidElement(cell)) return
      cells.push(extractPlainText(cell.props?.children).replace(/\*\*/g, '').trim())
    })
    if (!cells.length) return
    if (intoHeaders) {
      if (!headers.length) headers.push(...cells)
    } else {
      rows.push(cells)
    }
  }

  const walk = (nodes, inHead = false) => {
    Children.forEach(nodes, (node) => {
      if (!isValidElement(node)) return
      const tag = node.props?.node?.tagName
      if (tag === 'thead') {
        walk(node.props.children, true)
        return
      }
      if (tag === 'tbody') {
        walk(node.props.children, false)
        return
      }
      if (tag === 'tr') {
        readRow(node, inHead)
        return
      }
      if (node.props?.children) walk(node.props.children, inHead)
    })
  }

  walk(children)
  return { headers, rows }
}

export function isStepTimelineTable(headers) {
  const h = headers.join(' ').toLowerCase()
  return h.includes('paso') && h.includes('etapa')
}

export function isFlowActorTable(headers) {
  const h = headers.join(' ').toLowerCase()
  return h.includes('actor') && h.includes('acción')
}
