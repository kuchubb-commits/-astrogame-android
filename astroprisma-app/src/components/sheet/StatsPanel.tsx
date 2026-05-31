import { useCharacterStore } from '../../stores/characterStore'

const ORIGINS = [
  { id: 'soldier', label: 'Soldier' },
  { id: 'pilot', label: 'Pilot' },
  { id: 'scientist', label: 'Scientist' },
  { id: 'outlaw', label: 'Outlaw' },
  { id: 'diplomat', label: 'Diplomat' },
  { id: 'engineer', label: 'Engineer' },
] as const

function StatBox({ label, value, onDec, onInc }: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 border border-purple-500/30 bg-purple-500/5 rounded-lg p-3 w-24">
      <span className="text-xs tracking-widest text-slate-400 uppercase">{label}</span>
      <span className="text-4xl font-black text-white">{value}</span>
      <div className="flex gap-1">
        <button onClick={onDec} className="w-7 h-7 border border-slate-600 rounded text-slate-400 hover:border-purple-500 hover:text-purple-300 transition text-sm">−</button>
        <button onClick={onInc} className="w-7 h-7 border border-slate-600 rounded text-slate-400 hover:border-purple-500 hover:text-purple-300 transition text-sm">+</button>
      </div>
    </div>
  )
}

export function StatsPanel() {
  const { character, patch } = useCharacterStore()
  const p = (fn: (c: typeof character) => void) => patch(fn)

  return (
    <div className="flex flex-col gap-6">
      {/* Identité */}
      <section className="flex flex-col gap-3">
        <input
          value={character.name}
          onChange={e => p(c => { c.name = e.target.value })}
          placeholder="Nom du personnage"
          className="w-full bg-transparent text-2xl font-black tracking-widest uppercase text-white border-b border-purple-500/30 focus:border-purple-500 outline-none pb-1 transition"
        />
        <input
          value={character.pronouns}
          onChange={e => p(c => { c.pronouns = e.target.value })}
          placeholder="Pronoms"
          className="w-full bg-transparent text-sm text-slate-400 border-b border-slate-800 focus:border-slate-600 outline-none pb-1 transition"
        />
      </section>

      {/* Origine */}
      <section>
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-2">Origine</h2>
        <div className="flex flex-wrap gap-2">
          {ORIGINS.map(o => (
            <button key={o.id} onClick={() => p(c => { c.origin = o.id })}
              className={`px-3 py-1.5 rounded border text-xs tracking-wide transition ${
                character.origin === o.id
                  ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                  : 'border-slate-700 text-slate-400 hover:border-slate-500'
              }`}>
              {o.label}
            </button>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Stats principales</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          <StatBox label="VIGOR" value={character.vigor}
            onDec={() => p(c => { c.vigor = Math.max(0, c.vigor - 1) })}
            onInc={() => p(c => { c.vigor = Math.min(5, c.vigor + 1) })} />
          <StatBox label="GRACE" value={character.grace}
            onDec={() => p(c => { c.grace = Math.max(0, c.grace - 1) })}
            onInc={() => p(c => { c.grace = Math.min(5, c.grace + 1) })} />
          <StatBox label="MIND" value={character.mind}
            onDec={() => p(c => { c.mind = Math.max(0, c.mind - 1) })}
            onInc={() => p(c => { c.mind = Math.min(5, c.mind + 1) })} />
          <StatBox label="TECH" value={character.tech}
            onDec={() => p(c => { c.tech = Math.max(0, c.tech - 1) })}
            onInc={() => p(c => { c.tech = Math.min(5, c.tech + 1) })} />
        </div>
      </section>
    </div>
  )
}
