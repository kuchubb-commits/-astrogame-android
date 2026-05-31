import { useCharacterStore } from '../../stores/characterStore'

function Bar({ label, value, max, color, onDec, onInc }: {
  label: string; value: number; max: number
  color: string; onDec: () => void; onInc: () => void
}) {
  const pct = Math.min(100, (value / Math.max(1, max)) * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs tracking-widest text-slate-400 uppercase">{label}</span>
        <div className="flex items-center gap-1">
          <button onClick={onDec} className="w-6 h-6 border border-slate-700 rounded text-slate-400 hover:border-purple-500 hover:text-purple-300 transition text-xs">−</button>
          <span className="text-sm font-bold w-14 text-center">{value} / {max}</span>
          <button onClick={onInc} className="w-6 h-6 border border-slate-700 rounded text-slate-400 hover:border-purple-500 hover:text-purple-300 transition text-xs">+</button>
        </div>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function Counter({ label, value, onDec, onInc }: { label: string; value: number; onDec: () => void; onInc: () => void }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs tracking-widest text-slate-400 uppercase">{label}</span>
      <div className="flex items-center gap-2">
        <button onClick={onDec} className="w-6 h-6 border border-slate-700 rounded text-slate-400 hover:border-purple-500 transition text-xs">−</button>
        <span className="text-lg font-bold w-8 text-center">{value}</span>
        <button onClick={onInc} className="w-6 h-6 border border-slate-700 rounded text-slate-400 hover:border-purple-500 transition text-xs">+</button>
      </div>
    </div>
  )
}

export function ResourcesPanel() {
  const { character, patch } = useCharacterStore()
  const p = (fn: (c: typeof character) => void) => patch(fn)

  return (
    <section className="border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
      <h2 className="text-xs tracking-widest text-slate-400 uppercase">Ressources</h2>
      <Bar label="Health" value={character.health} max={character.maxHealth} color="bg-green-500"
        onDec={() => p(c => { c.health = Math.max(0, c.health - 1) })}
        onInc={() => p(c => { c.health = Math.min(c.maxHealth, c.health + 1) })} />
      <Bar label="Energy" value={character.energy} max={character.maxEnergy} color="bg-cyan-500"
        onDec={() => p(c => { c.energy = Math.max(0, c.energy - 1) })}
        onInc={() => p(c => { c.energy = Math.min(c.maxEnergy, c.energy + 1) })} />
      <Bar label="Hyperdrive" value={character.hyperdrive} max={10} color="bg-purple-500"
        onDec={() => p(c => { c.hyperdrive = Math.max(0, c.hyperdrive - 1) })}
        onInc={() => p(c => { c.hyperdrive = Math.min(10, c.hyperdrive + 1) })} />
      <div className="flex gap-6 pt-1">
        <Counter label="Armor" value={character.armor}
          onDec={() => p(c => { c.armor = Math.max(0, c.armor - 1) })}
          onInc={() => p(c => { c.armor++ })} />
        <Counter label="EXP" value={character.exp}
          onDec={() => p(c => { c.exp = Math.max(0, c.exp - 1) })}
          onInc={() => p(c => { c.exp++ })} />
        <Counter label="Serum" value={character.serum}
          onDec={() => p(c => { c.serum = Math.max(0, c.serum - 1) })}
          onInc={() => p(c => { c.serum++ })} />
      </div>
    </section>
  )
}
