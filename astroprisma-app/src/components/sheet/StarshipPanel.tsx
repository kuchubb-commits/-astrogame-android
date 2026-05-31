import { useCharacterStore } from '../../stores/characterStore'

function Bar({ label, value, max, color, onDec, onInc }: {
  label: string; value: number; max: number; color: string; onDec: () => void; onInc: () => void
}) {
  const pct = Math.min(100, (value / Math.max(1, max)) * 100)
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-xs tracking-widest text-slate-400 uppercase">{label}</span>
        <div className="flex items-center gap-1">
          <button onClick={onDec} className="w-6 h-6 border border-slate-700 rounded text-slate-400 hover:border-purple-500 transition text-xs">−</button>
          <span className="text-sm font-bold w-14 text-center">{value} / {max}</span>
          <button onClick={onInc} className="w-6 h-6 border border-slate-700 rounded text-slate-400 hover:border-purple-500 transition text-xs">+</button>
        </div>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-300`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

function SlotInput({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (v: string) => void }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-transparent text-sm text-slate-300 border-b border-slate-800 focus:border-purple-500/50 outline-none py-1 placeholder-slate-700 transition" />
  )
}

export function StarshipPanel() {
  const { character, patch } = useCharacterStore()
  const p = (fn: (c: typeof character) => void) => patch(fn)
  const ship = character.starship

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <section className="border border-cyan-900/40 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-cyan-400/70 uppercase mb-3">Starship</h2>
        <SlotInput value={ship.name} placeholder="Nom du vaisseau"
          onChange={v => p(c => { c.starship.name = v })} />
      </section>

      {/* Hull & Fuel */}
      <section className="border border-slate-800 rounded-lg p-4 flex flex-col gap-4">
        <Bar label="Hull" value={ship.hull} max={ship.hullMax} color="bg-orange-500"
          onDec={() => p(c => { c.starship.hull = Math.max(0, c.starship.hull - 1) })}
          onInc={() => p(c => { c.starship.hull = Math.min(c.starship.hullMax, c.starship.hull + 1) })} />
        <Bar label="Fuel" value={ship.fuel} max={ship.fuelMax} color="bg-yellow-500"
          onDec={() => p(c => { c.starship.fuel = Math.max(0, c.starship.fuel - 1) })}
          onInc={() => p(c => { c.starship.fuel = Math.min(c.starship.fuelMax, c.starship.fuel + 1) })} />
        <div className="flex items-center justify-between">
          <span className="text-xs tracking-widest text-slate-400 uppercase">Shields</span>
          <div className="flex items-center gap-2">
            <button onClick={() => p(c => { c.starship.shields = Math.max(0, c.starship.shields - 1) })}
              className="w-7 h-7 border border-slate-700 rounded text-slate-400 hover:border-cyan-500 transition text-sm">−</button>
            <span className="text-lg font-bold w-8 text-center">{ship.shields}</span>
            <button onClick={() => p(c => { c.starship.shields++ })}
              className="w-7 h-7 border border-slate-700 rounded text-slate-400 hover:border-cyan-500 transition text-sm">+</button>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Modules</h2>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-16">Control</span>
            <SlotInput value={ship.modules.control} placeholder="Module contrôle"
              onChange={v => p(c => { c.starship.modules.control = v })} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 w-16">Engines</span>
            <SlotInput value={ship.modules.engines} placeholder="Module moteur"
              onChange={v => p(c => { c.starship.modules.engines = v })} />
          </div>
          {ship.modules.open.map((mod, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-16">Open {i + 1}</span>
              <SlotInput value={mod} placeholder={`Module libre ${i + 1}`}
                onChange={v => p(c => { c.starship.modules.open[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Cargo */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Cargo Hold</h2>
        <div className="flex flex-col gap-2">
          {ship.cargo.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-4">{i + 1}</span>
              <SlotInput value={item} placeholder={`Cargo ${i + 1}`}
                onChange={v => p(c => { c.starship.cargo[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Crew */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Équipage</h2>
        <div className="flex flex-col gap-4">
          {character.crew.map((member, i) => (
            <div key={i} className="border border-slate-700/50 rounded p-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <SlotInput value={member.name} placeholder={`Membre ${i + 1}`}
                  onChange={v => p(c => { c.crew[i].name = v })} />
                <SlotInput value={member.role} placeholder="Rôle"
                  onChange={v => p(c => { c.crew[i].role = v })} />
              </div>
              <SlotInput value={member.passive} placeholder="Passive"
                onChange={v => p(c => { c.crew[i].passive = v })} />
              <div className="flex gap-2 text-xs text-slate-600">
                {(['vig', 'gra', 'min', 'tec'] as const).map(stat => (
                  <div key={stat} className="flex items-center gap-1">
                    <span className="uppercase">{stat}</span>
                    <button onClick={() => p(c => { c.crew[i][stat] = Math.max(0, c.crew[i][stat] - 1) })}
                      className="w-5 h-5 border border-slate-700 rounded text-slate-500 hover:border-purple-500 transition text-xs">−</button>
                    <span className="text-slate-300 w-4 text-center">{member[stat]}</span>
                    <button onClick={() => p(c => { c.crew[i][stat]++ })}
                      className="w-5 h-5 border border-slate-700 rounded text-slate-500 hover:border-purple-500 transition text-xs">+</button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connections */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Connections</h2>
        <div className="flex flex-col gap-3">
          {character.connections.map((conn, i) => (
            <div key={i} className="flex flex-col gap-1 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
              <div className="flex gap-2">
                <span className="text-xs text-slate-600 w-4 self-center">{i + 1}</span>
                <SlotInput value={conn.name} placeholder="Nom" onChange={v => p(c => { c.connections[i].name = v })} />
                <SlotInput value={conn.location} placeholder="Lieu" onChange={v => p(c => { c.connections[i].location = v })} />
              </div>
              <div className="flex gap-2 pl-6">
                <SlotInput value={conn.data} placeholder="Data / Info" onChange={v => p(c => { c.connections[i].data = v })} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
