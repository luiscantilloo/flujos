import { useCallback, useMemo } from 'react'
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from 'reactflow'
import { buildElements } from '../buildElements.js'
import { defaultEdgeOptions } from '../edges/defaultEdgeOptions.js'
import { nodeTypes } from '../nodes/index.js'

export function FlowDiagramInner({ flowKey, flowDefinitions, onDrill }) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildElements(flowKey, flowDefinitions),
    [flowKey, flowDefinitions],
  )

  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, , onEdgesChange] = useEdgesState(initialEdges)

  const onInit = useCallback((instance) => {
    requestAnimationFrame(() => {
      instance.fitView({ padding: 0.18, duration: 280 })
    })
  }, [])

  const onNodeClick = useCallback(
    (_, node) => {
      const targetFlow = node.data?.drillDownTo
      if (!targetFlow || !flowDefinitions[targetFlow]) return
      onDrill(targetFlow)
    },
    [flowDefinitions, onDrill],
  )

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onInit={onInit}
      onNodeClick={onNodeClick}
      fitView
      proOptions={{ hideAttribution: true }}
      minZoom={0.08}
      maxZoom={1.35}
      defaultEdgeOptions={defaultEdgeOptions}
      className="h-full w-full bg-slate-950"
    >
      <MiniMap
        className="!bg-slate-900/90 !shadow-lg"
        nodeStrokeWidth={2}
        nodeColor={(n) => (n.type === 'validation' ? '#0891b2' : '#334155')}
        maskColor="rgba(15, 23, 42, 0.55)"
      />
      <Controls className="!border-slate-700 !bg-slate-900/95 !shadow-lg [&_button]:!fill-slate-200 [&_button:hover]:!bg-slate-800" />
      <Background
        id={`bg-${flowKey}`}
        gap={20}
        size={1}
        color="#1e293b"
        variant={BackgroundVariant.Dots}
      />
    </ReactFlow>
  )
}
