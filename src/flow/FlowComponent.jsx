import { ReactFlowProvider } from 'reactflow'
import { FlowDiagramInner } from './diagram/FlowDiagramInner.jsx'
import { FlowDiagramLegend } from './legend/FlowDiagramLegend.jsx'
import { useFlowNavigationStack } from './hooks/useFlowNavigationStack.js'
import { FlowNavigation } from './navigation/FlowNavigation.jsx'

/**
 * Vista del diagrama para una aplicación de flujo registrada en `portalConfig.js`.
 * @param {{ flowApplication: object }} props
 */
export default function FlowComponent({ flowApplication }) {
  const { flowDefinitions, topLevelFlowKeys, defaultRootKey, legendText } = flowApplication

  const { stack, activeKey, goToCrumb, onDrill, switchTopLevelFlow } = useFlowNavigationStack({
    flowDefinitions,
    topLevelFlowKeys,
    initialRootKey: defaultRootKey,
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-slate-950">
      <FlowNavigation
        stack={stack}
        goToCrumb={goToCrumb}
        switchTopLevelFlow={switchTopLevelFlow}
        flowDefinitions={flowDefinitions}
        topLevelFlowKeys={topLevelFlowKeys}
      />

      <div className="relative min-h-0 w-full flex-1">
        <ReactFlowProvider>
          <div className="absolute inset-0">
            <FlowDiagramInner
              key={activeKey}
              flowKey={activeKey}
              flowDefinitions={flowDefinitions}
              onDrill={onDrill}
            />
          </div>
        </ReactFlowProvider>

        <FlowDiagramLegend text={legendText} />
      </div>
    </div>
  )
}
