import { HeaderNode } from './HeaderNode.jsx'
import { HeaderBridgeNode } from './HeaderBridgeNode.jsx'
import { EntryNode } from './EntryNode.jsx'
import { StartNode } from './StartNode.jsx'
import { ProcessNode } from './ProcessNode.jsx'
import { ValidationGateNode } from './ValidationGateNode.jsx'
import { DecisionNode } from './DecisionNode.jsx'
import { DecisionAccentNode } from './DecisionAccentNode.jsx'
import { DecisionSingleNode } from './DecisionSingleNode.jsx'
import { ErrorNode } from './ErrorNode.jsx'
import { SuccessNode } from './SuccessNode.jsx'

export const nodeTypes = {
  header: HeaderNode,
  headerBridge: HeaderBridgeNode,
  entry: EntryNode,
  start: StartNode,
  process: ProcessNode,
  validation: ValidationGateNode,
  decision: DecisionNode,
  decisionAccent: DecisionAccentNode,
  decisionSingle: DecisionSingleNode,
  error: ErrorNode,
  success: SuccessNode,
}
