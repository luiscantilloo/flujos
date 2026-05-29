import { getLayoutedElements } from './layout/getLayoutedElements.js'
import { defaultEdgeOptions } from './edges/defaultEdgeOptions.js'

export function buildElements(flowKey, flowDefinitions) {
  const def = flowDefinitions[flowKey]
  if (!def) {
    return { nodes: [], edges: [] }
  }

  const rawNodes = def.nodes.map((n) => ({
    ...n,
    position: { x: 0, y: 0 },
  }))

  const layoutedNodes = getLayoutedElements(rawNodes, def.edges)

  const styledEdges = def.edges.map((edge) => ({
    ...defaultEdgeOptions,
    labelBgPadding: [5, 3],
    labelBgBorderRadius: 4,
    labelBgStyle: { fill: '#1e293b', stroke: '#475569', strokeWidth: 1 },
    labelStyle: { fill: '#e2e8f0', fontSize: 11, fontWeight: 600 },
    ...edge,
    style: { ...defaultEdgeOptions.style, ...(edge.style || {}) },
    markerEnd: edge.markerEnd ?? defaultEdgeOptions.markerEnd,
  }))

  return { nodes: layoutedNodes, edges: styledEdges }
}
