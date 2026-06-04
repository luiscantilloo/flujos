import { HiOutlineShare, HiOutlineTableCells } from 'react-icons/hi2'
import { DatabaseArchitecturePanel } from './DatabaseArchitecturePanel.jsx'
import { DatabaseErDiagramPanel } from './DatabaseErDiagramPanel.jsx'
import { DatabaseReadingGuidePanel } from './DatabaseReadingGuidePanel.jsx'

const DB_VIEWS = [
  { id: 'tables', label: 'Tablas', icon: HiOutlineTableCells },
  { id: 'er', label: 'Diagrama ER', icon: HiOutlineShare },
]

export function DatabaseSection({ section, selectedTableId, onSelectTable, dbView, onDbViewChange }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Vista de base de datos">
        {DB_VIEWS.map((view) => {
          const Icon = view.icon
          return (
            <button
              key={view.id}
              type="button"
              role="tab"
              aria-selected={dbView === view.id}
              onClick={() => onDbViewChange(view.id)}
              className={[
                'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-all',
                dbView === view.id
                  ? 'border-emerald-500/45 bg-emerald-500/15 text-emerald-100'
                  : 'border-slate-700/60 bg-slate-900/40 text-slate-400 hover:text-slate-200',
              ].join(' ')}
            >
              <Icon className="h-4 w-4 shrink-0" aria-hidden />
              {view.label}
            </button>
          )
        })}
      </div>

      {dbView === 'er' ? (
        <DatabaseErDiagramPanel />
      ) : (
        <div className="space-y-4">
          {/* <DatabaseReadingGuidePanel onSelectTable={onSelectTable} /> */}
          <DatabaseArchitecturePanel
            section={section}
            selectedTableId={selectedTableId}
            onSelectTable={onSelectTable}
          />
        </div>
      )}
    </div>
  )
}
