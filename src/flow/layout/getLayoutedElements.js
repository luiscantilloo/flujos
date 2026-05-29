import dagre from 'dagre'
import { Position } from 'reactflow'
import { measureNode } from './nodeDimensions.js'

export function getLayoutedElements(nodes, edges, { direction = 'TB' } = {}) {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: direction,
    ranksep: 72,
    nodesep: 56,
    marginx: 20,
    marginy: 20,
  })

  nodes.forEach((node) => {
    const { width, height } = measureNode(node)
    g.setNode(node.id, { width, height })
  })

  const layoutEdges = edges.filter((e) => !e.data?.layoutIgnore)
  layoutEdges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  return nodes.map((node) => {
    const pos = g.node(node.id)
    const { width, height } = measureNode(node)
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
      console.warn('[flujo] Dagre sin posición para el nodo:', node.id)
      return {
        ...node,
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
        position: { x: 0, y: 0 },
        style: { width, height },
      }
    }
    const position = {
      x: pos.x - width / 2,
      y: pos.y - height / 2,
    }

    return {
      ...node,
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      position,
      style: { width, height },
    }
  })
}
