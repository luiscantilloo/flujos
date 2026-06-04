import { DocFlowActorTable } from './DocFlowActorTable.jsx'
import { DocStepTimeline } from './DocStepTimeline.jsx'
import {
  isFlowActorTable,
  isStepTimelineTable,
  parseMarkdownTable,
} from '../utils/parseMarkdownTable.js'

const tableShell =
  'mb-10 max-w-none overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-900/55 to-slate-950/40 shadow-xl shadow-slate-950/50 ring-1 ring-white/5'

export function DocRichTable({ children, tableProps }) {
  const { headers, rows } = parseMarkdownTable(children)

  if (isStepTimelineTable(headers)) {
    return <DocStepTimeline rows={rows} />
  }

  if (isFlowActorTable(headers)) {
    return <DocFlowActorTable rows={rows} />
  }

  return (
    <div className={tableShell}>
      <div className="app-scroll-x">
        <table
          className="w-full min-w-[32rem] border-collapse text-left text-sm text-slate-200"
          {...tableProps}
        >
          {children}
        </table>
      </div>
    </div>
  )
}
