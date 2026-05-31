import { useCharacterStore } from '../../stores/characterStore'
import type { StatusKey, FactionKey } from '../../stores/characterStore'

const STATUS_CONDITIONS: StatusKey[] = ['STUN', 'BREACH', 'SHOCK', 'SILENCE', 'IMMUNITY', 'OVERHEAT']

const FACTIONS: { key: FactionKey; label: string; color: string }[] = [
  { key: 'warg', label: 'W.A.R.G.', color: 'text-red-400' },
  { key: 'isf', label: 'ISF', color: 'text-blue-400' },
  { key: 'medusa', label: 'Medusa', color: 'text-purple-400' },
  { key: 'corsair', label: 'Corsair', color: 'text-yellow-400' },
  { key: 'synth', label: 'Synth', color: 'text-cyan-400' },
]

export function StatusPanel() {
  const { character, patch } = useCharacterStore()
  const p = (fn: (c: typeof character) => void) => patch(fn)

  return (
    <div className="flex flex-col gap-4">
      {/* Status Conditions */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Status Conditions</h2>
        <div className="grid grid-cols-2 gap-2">
          {STATUS_CONDITIONS.map(s => (
            <button
              key={s}
              onClick={() => p(c => { c.status[s] = !c.status[s] })}
              className={`flex items-center gap-2 px-3 py-2 rounded border text-sm font-bold tracking-widest transition ${
                character.status[s]
                  ? 'border-red-500 bg-red-500/20 text-red-300'
                  : 'border-slate-700 text-slate-500 hover:border-slate-500'
              }`}
            >
              <span className={`w-3 h-3 rounded-sm border flex-shrink-0 flex items-center justify-center ${
                character.status[s] ? 'bg-red-500 border-red-500' : 'border-slate-600'
              }`}>
                {character.status[s] && <span className="text-white text-xs leading-none">✓</span>}
              </span>
              {s}
            </button>
          ))}
        </div>
      </section>

      {/* Factions */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Favor — Factions</h2>
        <div className="flex flex-col gap-3">
          {FACTIONS.map(f => (
            <div key={f.key} className="flex items-center justify-between">
              <span className={`text-sm font-bold tracking-wide ${f.color}`}>{f.label}</span>
              <div className="flex items-center gap-2">
                <button onClick={() => p(c => { c.favor[f.key] = Math.max(-3, c.favor[f.key] - 1) })}
                  className="w-7 h-7 border border-slate-700 rounded text-slate-400 hover:border-purple-500 transition text-sm">−</button>
                <div className="flex gap-1">
                  {[-3, -2, -1, 0, 1, 2, 3].map(v => (
                    <div key={v} className={`w-3 h-3 rounded-sm border transition ${
                      v === 0 ? 'border-slate-600 bg-slate-700' :
                      v > 0 && character.favor[f.key] >= v ? 'border-green-500 bg-green-500' :
                      v < 0 && character.favor[f.key] <= v ? 'border-red-500 bg-red-500' :
                      'border-slate-700'
                    }`} />
                  ))}
                </div>
                <button onClick={() => p(c => { c.favor[f.key] = Math.min(3, c.favor[f.key] + 1) })}
                  className="w-7 h-7 border border-slate-700 rounded text-slate-400 hover:border-purple-500 transition text-sm">+</button>
                <span className="w-6 text-center text-sm font-bold text-slate-300">{character.favor[f.key]}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
