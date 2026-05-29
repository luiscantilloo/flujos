export const nodeMeasured = {
  header: { width: 280, height: 52 },
  headerBridge: { width: 300, height: 52 },
  entry: { width: 220, height: 56 },
  start: { width: 176, height: 52 },
  process: { width: 248, height: 64 },
  decision: { width: 152, height: 152 },
  decisionAccent: { width: 152, height: 152 },
  decisionSingle: { width: 152, height: 152 },
  validation: { width: 236, height: 76 },
  error: { width: 228, height: 56 },
  success: { width: 148, height: 120 },
}

export function measureNode(node) {
  return nodeMeasured[node.type] ?? nodeMeasured.process
}
