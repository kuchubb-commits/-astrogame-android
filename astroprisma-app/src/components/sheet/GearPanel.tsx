import { useCharacterStore } from '../../stores/characterStore'
import { ComboSelect } from '../ui/ComboSelect'
import weaponsData from '../../data/weapons.json'
import itemsData from '../../data/items.json'

const WEAPON_NAMES = weaponsData.map(w => `${w.name} [${w.damage}]`)
const WEAPON_MODS = itemsData.mods
const ALL_ITEMS = [
  ...itemsData.consumables,
  ...itemsData.grenades,
  ...itemsData.tech,
  ...itemsData.armor,
  ...itemsData.hacks,
  ...itemsData.mods,
]

function SlotInput({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (v: string) => void }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-transparent text-sm text-slate-300 border-b border-slate-800 focus:border-purple-500/50 outline-none py-1 placeholder-slate-700 transition" />
  )
}

export function GearPanel() {
  const { character, patch } = useCharacterStore()
  const p = (fn: (c: typeof character) => void) => patch(fn)

  return (
    <div className="flex flex-col gap-4">
      {/* Weapons */}
      {([0, 1] as const).map(i => (
        <section key={i} className="border border-slate-800 rounded-lg p-4">
          <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Weapon {i + 1}</h2>
          <div className="flex flex-col gap-3">
            <div>
              <span className="text-xs text-slate-600 uppercase tracking-widest">Arme</span>
              <ComboSelect
                value={character.weapons[i].name}
                options={WEAPON_NAMES}
                placeholder="Nom de l'arme..."
                onChange={v => p(c => {
                  // Auto-fill damage if weapon selected from list
                  const found = weaponsData.find(w => `${w.name} [${w.damage}]` === v)
                  c.weapons[i].name = found ? found.name : v
                  if (found) c.weapons[i].damage = found.damage
                })}
              />
            </div>
            <div>
              <span className="text-xs text-slate-600 uppercase tracking-widest">Dégâts</span>
              <SlotInput value={character.weapons[i].damage} placeholder="ex: d8 + VIG"
                onChange={v => p(c => { c.weapons[i].damage = v })} />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs text-slate-600 uppercase tracking-widest">Mods</span>
              {([0, 1] as const).map(m => (
                <ComboSelect key={m}
                  value={character.weapons[i].mods[m]}
                  options={WEAPON_MODS}
                  placeholder={`Mod ${m + 1}...`}
                  onChange={v => p(c => { c.weapons[i].mods[m] = v })}
                />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Inventory */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Inventory — 8 slots</h2>
        <div className="flex flex-col gap-2">
          {character.inventory.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-4">{i + 1}</span>
              <ComboSelect value={item} options={ALL_ITEMS} placeholder={`Slot ${i + 1}...`}
                onChange={v => p(c => { c.inventory[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Cybertech */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Cybertech — 6 implants</h2>
        <div className="flex flex-col gap-2">
          {character.cybertech.map((ct, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-4">{i + 1}</span>
              <SlotInput value={ct} placeholder={`Implant ${i + 1}...`}
                onChange={v => p(c => { c.cybertech[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Memory Slots */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-1">Memory Slots</h2>
        <p className="text-xs text-slate-600 mb-3">{character.memorySlotsUnlocked} / 6 déverrouillés</p>
        <div className="flex flex-col gap-2">
          {character.memorySlots.map((ms, i) => {
            const locked = i >= character.memorySlotsUnlocked
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                {locked
                  ? <span className="text-xs text-slate-700 italic">🔒 Verrouillé</span>
                  : <ComboSelect value={ms} options={itemsData.hacks} placeholder={`Mémoire ${i + 1}...`}
                      onChange={v => p(c => { c.memorySlots[i] = v })} />
                }
              </div>
            )
          })}
        </div>
      </section>

      {/* Enemy Tracker */}
      <section className="border border-red-900/30 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-red-400/70 uppercase mb-3">Enemy Tracker</h2>
        <div className="flex flex-col gap-2">
          <SlotInput value={character.enemyTracker.health} placeholder="Health"
            onChange={v => p(c => { c.enemyTracker.health = v })} />
          <SlotInput value={character.enemyTracker.armor} placeholder="Armor"
            onChange={v => p(c => { c.enemyTracker.armor = v })} />
          <SlotInput value={character.enemyTracker.effects} placeholder="Effects"
            onChange={v => p(c => { c.enemyTracker.effects = v })} />
        </div>
      </section>

      {/* Notes */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-2">Notes</h2>
        <textarea value={character.notes} onChange={e => p(c => { c.notes = e.target.value })}
          placeholder="Notes libres..." rows={4}
          className="w-full bg-transparent text-sm text-slate-300 border border-slate-800 focus:border-purple-500/50 outline-none p-2 placeholder-slate-700 transition rounded resize-none" />
      </section>
    </div>
  )
}
