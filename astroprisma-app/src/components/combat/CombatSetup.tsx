import { useState } from 'react'
import { ALL_ENEMIES, FACTION_COLORS, TYPE_ICONS } from '../../data/enemies'
import type { Enemy, EnemyType } from '../../data/enemies'
import { useCombatStore } from '../../stores/combatStore'
import { useCharacterStore } from '../../stores/characterStore'
import { d10, initiativeRoll } from '../../stores/diceStore'

const TYPE_FILTERS: { id: EnemyType | 'all'; label: string }[] = [
  { id: 'all',       label: '⚔️ Tous' },
  { id: 'character', label: '👤 Perso' },
  { id: 'creature',  label: '🦑 Créature' },
]

export function CombatSetup() {
  const { startCombat } = useCombatStore()
  const { character } = useCharacterStore()
  const [selected, setSelected] = useState<Enemy | null>(null)
  const [typeFilter, setTypeFilter] = useState<EnemyType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [rolling, setRolling] = useState(false)
  const [initiativeResult, setInitiativeResult] = useState<ReturnType<typeof initiativeRoll> | null>(null)

  const filtered = ALL_ENEMIES.filter(e => {
    if (e.type === 'ship') return false
    if (typeFilter !== 'all' && e.type !== typeFilter) return false
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  function rollInitiative() {
    if (!selected) return
    setRolling(true)
    setTimeout(() => {
      const result = initiativeRoll(character.grace, selected.difficulty)
      setInitiativeResult(result)
      setRolling(false)
    }, 400)
  }

  function launch() {
    if (!selected || !initiativeResult) return
    const { playerFirst, playerTotal, enemyTotal, playerDie, enemyDie } = initiativeResult
    const detail = `Initiative — Toi : d10(${playerDie})+GRA(${character.grace})=${playerTotal} vs Ennemi : d10(${enemyDie})+${selected.difficulty}=${enemyTotal}`
    startCombat(selected, playerFirst!, detail)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xs tracking-widest uppercase text-slate-400">Choisir un adversaire</h2>

      {/* Filtres type */}
      <div className="flex gap-1">
        {TYPE_FILTERS.map(f => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className={`flex-1 py-1.5 rounded border text-xs font-bold transition ${
              typeFilter === f.id
                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                : 'border-slate-800 text-slate-500 hover:border-slate-600'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="w-full bg-transparent border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-purple-500 outline-none"
      />

      {/* Liste */}
      <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
        {filtered.map(enemy => (
          <button
            key={enemy.id}
            onClick={() => { setSelected(enemy); setInitiativeResult(null) }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded border text-left transition ${
              selected?.id === enemy.id
                ? FACTION_COLORS[enemy.faction]
                : 'border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
          >
            <span className="text-base shrink-0">{TYPE_ICONS[enemy.type]}</span>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold tracking-wide truncate">{enemy.name}</div>
              <div className="text-[10px] opacity-60">{enemy.faction}</div>
            </div>
            <div className="text-right shrink-0 text-[10px] opacity-50">HP {enemy.hp}</div>
          </button>
        ))}
      </div>

      {/* Ennemi sélectionné + initiative */}
      {selected && (
        <div className={`rounded border p-3 space-y-3 ${FACTION_COLORS[selected.faction]}`}>
          <div className="flex justify-between items-start">
            <div>
              <div className="font-black text-sm tracking-wide">
                {TYPE_ICONS[selected.type]} {selected.name}
              </div>
              <div className="text-[10px] opacity-60 mt-0.5">
                HP {selected.hp} · Difficulté {selected.difficulty}/10
              </div>
            </div>
          </div>

          {!initiativeResult ? (
            <button
              onClick={rollInitiative}
              disabled={rolling}
              className="w-full py-2 rounded border border-yellow-500 text-yellow-300 text-sm font-bold tracking-widest uppercase hover:bg-yellow-500/20 transition disabled:opacity-50"
            >
              {rolling ? '🎲 Lancer…' : '🎲 Lancer l\'initiative (d10 + GRA)'}
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="opacity-60">Toi (d10+GRA {character.grace})</span>
                  <span className="font-bold text-green-400">{initiativeResult.playerTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-60">Ennemi (d10+{selected.difficulty})</span>
                  <span className="font-bold text-red-400">{initiativeResult.enemyTotal}</span>
                </div>
              </div>

              <div className={`text-center text-sm font-black tracking-widest py-2 rounded ${
                initiativeResult.playerFirst ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
              }`}>
                {initiativeResult.playerFirst ? '▶ TU COMMENCES' : '▶ L\'ENNEMI COMMENCE'}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={rollInitiative}
                  className="flex-1 py-1.5 rounded border border-slate-600 text-slate-400 text-xs hover:border-slate-400 transition"
                >
                  Relancer
                </button>
                <button
                  onClick={launch}
                  className="flex-1 py-1.5 rounded border border-red-500 text-red-300 text-sm font-bold tracking-widest uppercase hover:bg-red-500/20 transition"
                >
                  ⚔️ COMBATTRE
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
