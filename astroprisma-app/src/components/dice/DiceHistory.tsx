import { useDiceStore } from '../../stores/diceStore'

const TYPE_ICON: Record<string, string> = {
  'challenge': '🎲',
  'oracle-yesno': '🔮',
  'oracle-open': '🔮',
}

export function DiceHistory() {
  const { history, clearHistory } = useDiceStore()

  if (history.length === 0) {
    return (
      <div className="bg-[#111118] border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest uppercase text-slate-400 mb-3">Historique</h2>
        <p className="text-slate-600 text-xs text-center py-4">Aucun lancer pour l'instant.</p>
      </div>
    )
  }

  return (
    <div className="bg-[#111118] border border-slate-800 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-widest uppercase text-slate-400">Historique</h2>
        <button
          onClick={clearHistory}
          className="text-xs text-slate-600 hover:text-red-400 transition"
        >
          Effacer
        </button>
      </div>
      <ul className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {history.map((entry) => (
          <li key={entry.id} className="flex items-start gap-2 text-xs border-b border-slate-800/50 pb-1.5">
            <span className="mt-0.5 shrink-0">{TYPE_ICON[entry.type] ?? '🎲'}</span>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400">{entry.label}</span>
                <span className="font-bold text-white shrink-0">{entry.result}</span>
              </div>
              <div className="text-slate-600 truncate">{entry.detail}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
