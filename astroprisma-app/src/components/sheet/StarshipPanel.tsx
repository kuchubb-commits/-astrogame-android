import { useCharacterStore } from '../../stores/characterStore'
import { ComboSelect } from '../ui/ComboSelect'
import modulesData from '../../data/starship-modules.json'
import rolesData from '../../data/crew-roles.json'
import itemsData from '../../data/items.json'

const ALL_ITEMS = [
  ...itemsData.consumables,
  ...itemsData.grenades,
  ...itemsData.tech,
  ...itemsData.armor,
  ...itemsData.hacks,
  ...itemsData.mods,
]

const ALL_ROLES = [
  ...rolesData.base.map(r => r.label),
  ...rolesData.faction.map(r => `${r.label} (${r.faction.toUpperCase()})`),
]

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
        <h2 className="text-xs tracking-widest text-cyan-400/70 uppercase mb-2">Starship</h2>
        <ComboSelect value={ship.name} options={modulesData.prebuilt_ships}
          placeholder="Nom du vaisseau..." onChange={v => p(c => { c.starship.name = v })} />
      </section>

      {/* Hull, Fuel, Shields */}
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
        <div className="flex flex-col gap-3">
          <div>
            <span className="text-xs text-slate-600 uppercase tracking-widest">Control</span>
            <ComboSelect value={ship.modules.control} options={modulesData.control}
              placeholder="Module Control..." onChange={v => p(c => { c.starship.modules.control = v })} />
          </div>
          <div>
            <span className="text-xs text-slate-600 uppercase tracking-widest">Engines</span>
            <ComboSelect value={ship.modules.engines} options={modulesData.engines}
              placeholder="Module Engines..." onChange={v => p(c => { c.starship.modules.engines = v })} />
          </div>
          {ship.modules.open.map((mod, i) => (
            <div key={i}>
              <span className="text-xs text-slate-600 uppercase tracking-widest">Open {i + 1}</span>
              <ComboSelect value={mod}
                options={[...modulesData.weapons, ...modulesData.systems]}
                placeholder={`Weapon / System module ${i + 1}...`}
                onChange={v => p(c => { c.starship.modules.open[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Cargo Hold */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Cargo Hold — 6 slots</h2>
        <div className="flex flex-col gap-2">
          {ship.cargo.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-4">{i + 1}</span>
              <ComboSelect value={item} options={ALL_ITEMS} placeholder={`Cargo ${i + 1}...`}
                onChange={v => p(c => { c.starship.cargo[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Crew */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Équipage — 4 membres</h2>
        <div className="flex flex-col gap-4">
          {character.crew.map((member, i) => (
            <div key={i} className="border border-slate-700/50 rounded p-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <SlotInput value={member.name} placeholder={`Membre ${i + 1}`}
                  onChange={v => p(c => { c.crew[i].name = v })} />
                <div className="w-48 flex-shrink-0">
                  <ComboSelect value={member.role} options={ALL_ROLES} placeholder="Rôle..."
                    onChange={v => {
                      const found = rolesData.base.find(r => r.label === v)
                      p(c => {
                        c.crew[i].role = v
                        if (found) c.crew[i].passive = found.passive
                      })
                    }} />
                </div>
              </div>
              <SlotInput value={member.passive} placeholder="Passive"
                onChange={v => p(c => { c.crew[i].passive = v })} />
              <div className="flex gap-3 pt-1">
                {(['vig', 'gra', 'min', 'tec'] as const).map(stat => (
                  <div key={stat} className="flex items-center gap-1">
                    <span className="text-xs text-slate-600 uppercase">{stat}</span>
                    <button onClick={() => p(c => { c.crew[i][stat] = Math.max(0, c.crew[i][stat] - 1) })}
                      className="w-5 h-5 border border-slate-700 rounded text-slate-500 hover:border-purple-500 transition text-xs">−</button>
                    <span className="text-slate-300 w-4 text-center text-sm">{member[stat]}</span>
                    <button onClick={() => p(c => { c.crew[i][stat]++ })}
                      className="w-5 h-5 border border-slate-700 rounded text-slate-500 hover:border-purple-500 transition text-xs">+</button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-1 pt-1">
                <span className="text-xs text-slate-600 uppercase tracking-widest">Inventaire (4 slots)</span>
                {member.inventory.map((item, j) => (
                  <ComboSelect key={j} value={item} options={ALL_ITEMS} placeholder={`Slot ${j + 1}...`}
                    onChange={v => p(c => { c.crew[i].inventory[j] = v })} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Connections */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Connections — 7</h2>
        <div className="flex flex-col gap-3">
          {character.connections.map((conn, i) => (
            <div key={i} className="flex flex-col gap-1 border-b border-slate-800 pb-2 last:border-0 last:pb-0">
              <div className="flex gap-2 items-center">
                <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                <SlotInput value={conn.name} placeholder="Nom" onChange={v => p(c => { c.connections[i].name = v })} />
                <SlotInput value={conn.location} placeholder="Lieu" onChange={v => p(c => { c.connections[i].location = v })} />
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => p(c => { c.connections[i].favor = Math.max(0, c.connections[i].favor - 1) })}
                    className="w-5 h-5 border border-slate-700 rounded text-slate-500 hover:border-purple-500 transition text-xs">−</button>
                  <span className="text-xs text-slate-400 w-4 text-center">{conn.favor}</span>
                  <button onClick={() => p(c => { c.connections[i].favor = Math.min(3, c.connections[i].favor + 1) })}
                    className="w-5 h-5 border border-slate-700 rounded text-slate-500 hover:border-purple-500 transition text-xs">+</button>
                </div>
              </div>
              <div className="pl-6">
                <SlotInput value={conn.data} placeholder="Data / Info" onChange={v => p(c => { c.connections[i].data = v })} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
