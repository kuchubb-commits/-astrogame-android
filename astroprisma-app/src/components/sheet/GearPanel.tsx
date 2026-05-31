import { useCharacterStore } from '../../stores/characterStore'

function SlotInput({ value, placeholder, onChange }: { value: string; placeholder: string; onChange: (v: string) => void }) {
  return (
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-transparent text-sm text-slate-300 border-b border-slate-800 focus:border-purple-500/50 outline-none py-1 placeholder-slate-700 transition"
    />
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
          <div className="flex flex-col gap-2">
            <SlotInput value={character.weapons[i].name} placeholder="Nom de l'arme"
              onChange={v => p(c => { c.weapons[i].name = v })} />
            <SlotInput value={character.weapons[i].damage} placeholder="Dégâts"
              onChange={v => p(c => { c.weapons[i].damage = v })} />
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-slate-600 uppercase tracking-widest self-center">Mods</span>
              <SlotInput value={character.weapons[i].mods[0]} placeholder="Mod 1"
                onChange={v => p(c => { c.weapons[i].mods[0] = v })} />
              <SlotInput value={character.weapons[i].mods[1]} placeholder="Mod 2"
                onChange={v => p(c => { c.weapons[i].mods[1] = v })} />
            </div>
          </div>
        </section>
      ))}

      {/* Inventory */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Inventory</h2>
        <div className="flex flex-col gap-2">
          {character.inventory.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-4">{i + 1}</span>
              <SlotInput value={item} placeholder={`Slot ${i + 1}`}
                onChange={v => p(c => { c.inventory[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Cybertech */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-3">Cybertech</h2>
        <div className="flex flex-col gap-2">
          {character.cybertech.map((ct, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="text-xs text-slate-600 w-4">{i + 1}</span>
              <SlotInput value={ct} placeholder={`Cybertech ${i + 1}`}
                onChange={v => p(c => { c.cybertech[i] = v })} />
            </div>
          ))}
        </div>
      </section>

      {/* Memory Slots */}
      <section className="border border-slate-800 rounded-lg p-4">
        <h2 className="text-xs tracking-widest text-slate-400 uppercase mb-2">Memory Slots</h2>
        <p className="text-xs text-slate-600 mb-3">{character.memorySlotsUnlocked} / 6 déverrouillés</p>
        <div className="flex flex-col gap-2">
          {character.memorySlots.map((ms, i) => {
            const locked = i >= character.memorySlotsUnlocked
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-slate-600 w-4">{i + 1}</span>
                {locked
                  ? <span className="text-xs text-slate-700 italic">🔒 Verrouillé</span>
                  : <SlotInput value={ms} placeholder={`Mémoire ${i + 1}`}
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
        <textarea
          value={character.notes}
          onChange={e => p(c => { c.notes = e.target.value })}
          placeholder="Notes libres..."
          rows={4}
          className="w-full bg-transparent text-sm text-slate-300 border border-slate-800 focus:border-purple-500/50 outline-none p-2 placeholder-slate-700 transition rounded resize-none"
        />
      </section>
    </div>
  )
}
