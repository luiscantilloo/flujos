import { useCallback, useState } from 'react'

function resolveInitialRootKey(flowDefinitions, topLevelFlowKeys, initialRootKey) {
  if (initialRootKey && flowDefinitions[initialRootKey]) return initialRootKey
  const first = topLevelFlowKeys[0]
  if (first && flowDefinitions[first]) return first
  return 'main'
}

export function useFlowNavigationStack({
  flowDefinitions,
  topLevelFlowKeys,
  initialRootKey = 'main',
}) {
  const [stack, setStack] = useState(() => {
    const rootKey = resolveInitialRootKey(flowDefinitions, topLevelFlowKeys, initialRootKey)
    return [{ key: rootKey, title: flowDefinitions[rootKey].title }]
  })

  const activeKey = stack[stack.length - 1].key

  const goToCrumb = useCallback((index) => {
    setStack((prev) => prev.slice(0, index + 1))
  }, [])

  const onDrill = useCallback(
    (targetFlow) => {
      if (!flowDefinitions[targetFlow]) return
      setStack((prev) => [
        ...prev,
        { key: targetFlow, title: flowDefinitions[targetFlow].title },
      ])
    },
    [flowDefinitions],
  )

  const switchTopLevelFlow = useCallback(
    (key) => {
      if (!flowDefinitions[key] || !topLevelFlowKeys.includes(key)) return
      setStack([{ key, title: flowDefinitions[key].title }])
    },
    [flowDefinitions, topLevelFlowKeys],
  )

  return { stack, activeKey, goToCrumb, onDrill, switchTopLevelFlow }
}
