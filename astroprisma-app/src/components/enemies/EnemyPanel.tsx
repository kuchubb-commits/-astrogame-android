import { useState } from 'react'
import { useEnemyStore } from '../../stores/enemyStore'
import {
  ALL_ENEMIES,
  FACTION_COLORS,
  TYPE_ICONS,
  TYPE_LABELS,
} from '../../data/enemies'
import type { Enemy, EnemyType, Faction } from '../../data/enemies'

// ── Filtre & groupes ──────────────────────────────────────────────────────────

const TYPE_FILTERS: { id: EnemyType | 'all'; label: string; icon: string }[] = [
  { id: 'all',       label: 'Tous',        icon: '⚔️' },
  { id: 'character', label: 'Perso',       icon: '👤' },
  { id: 'creature',  label: 'Créature',    icon: '🦑' },
  { id: 'ship',      label: 'Vaisseau',    icon: '🚀' },
]

// ── Barre de difficulté ───────────────────────────────────────────────────────

function DifficultyBar({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-sm ${
            i < value
              ? value <= 3 ? 'bg-green-500'
              : value <= 6 ? 'bg-yellow-500'
              : 'bg-red-500'
              : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  )
}

// ── Carte ennemi sélectionné ──────────────────────────────────────────────────

function EnemyCard({ enemy }: { enemy: Enemy }) {
  const { enemyCurrentHp, setEnemyHp, resetEnemyHp } = useEnemyStore()
  const factionStyle = FACTION_COLORS[enemy.faction]
  const hpPercent = enemy.hp > 0 ? (enemyCurrentHp / enemy.hp) * 100 : 0

  return (
    <div className={`rounded border p-3 space-y-3 ${factionStyle}`}>
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-black text-sm tracking-wide">
            {TYPE_ICONS[enemy.type]} {enemy.name}
          </div>
          <div className="text-xs opacity-70 mt-0.5">
            {enemy.faction} · {TYPE_LABELS[enemy.type]}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs opacity-60">{enemy.type === 'ship' ? 'Hull' : 'HP'}</div>
          <div className="font-black text-lg">{enemyCurrentHp}/{enemy.hp}</div>
          {enemy.shields != null && (
            <div className="text-xs opacity-70">🛡 {enemy.shields} bouclier(s)</div>
          )}
        </div>
      </div>

      {/* Barre HP */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            hpPercent > 50 ? 'bg-green-500' : hpPercent > 25 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${hpPercent}%` }}
        />
      </div>

      {/* Contrôles HP */}
      <div className="flex gap-1">
        {[1, 3, 5, 10].map((dmg) => (
          <button
            key={dmg}
            onClick={() => setEnemyHp(enemyCurrentHp - dmg)}
            className="flex-1 py-1 rounded border border-red-700 text-red-400 text-xs font-bold hover:bg-red-500/20 transition"
          >
            -{dmg}
          </button>
        ))}
        <button
          onClick={() => setEnemyHp(enemyCurrentHp + 3)}
          className="flex-1 py-1 rounded border border-green-700 text-green-400 text-xs font-bold hover:bg-green-500/20 transition"
        >
          +3
        </button>
        <button
          onClick={resetEnemyHp}
          className="px-2 py-1 rounded border border-slate-600 text-slate-400 text-xs hover:bg-slate-700/40 transition"
          title="Réinitialiser"
        >
          ↺
        </button>
      </div>

      {/* Difficulté */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs opacity-60">
          <span>Difficulté (stat défi)</span>
          <span className="font-bold">{enemy.difficulty}/10</span>
        </div>
        <DifficultyBar value={enemy.difficulty} />
      </div>

      {/* Table d'actions */}
      <div className="space-y-1">
        <div className="text-xs opacity-60 tracking-widest uppercase">Actions (d10)</div>
        {enemy.actions.map((a, i) => (
          <div key={i} className="flex gap-2 text-xs">
            <span className="w-8 text-right opacity-50 shrink-0">{a.range}</span>
            <span className="opacity-80 leading-snug">{a.desc}</span>
          </div>
        ))}
      </div>

      {/* Capacités spéciales */}
      {enemy.skills && enemy.skills.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs opacity-60 tracking-widest uppercase">Capacités</div>
          {enemy.skills.map((s, i) => (
            <div key={i} className="text-xs opacity-80 flex gap-1">
              <span>★</span><span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Liste scrollable ──────────────────────────────────────────────────────────

function EnemyRow({ enemy, selected, onSelect }: { enemy: Enemy; selected: boolean; onSelect: () => void }) {
  const factionStyle = FACTION_COLORS[enemy.faction]
  return (
    <button
      onClick={onSelect}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded border text-left transition ${
        selected
          ? factionStyle
          : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
      }`}
    >
      <span className="text-base shrink-0">{TYPE_ICONS[enemy.type]}</span>
      <div className="flex-1 min-w-0">
        <div className="text-xs font-bold tracking-wide truncate">{enemy.name}</div>
        <div className="text-[10px] opacity-60">{enemy.faction}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] opacity-50">{enemy.type === 'ship' ? 'Hull' : 'HP'} {enemy.hp}</div>
        <div className="flex gap-0.5 mt-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-sm ${
                i < Math.ceil(enemy.difficulty / 2)
                  ? enemy.difficulty <= 4 ? 'bg-green-500' : enemy.difficulty <= 7 ? 'bg-yellow-500' : 'bg-red-500'
                  : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </button>
  )
}

// ── Composant principal ───────────────────────────────────────────────────────

export function EnemyPanel() {
  const { selectedEnemy, setEnemy } = useEnemyStore()
  const [typeFilter, setTypeFilter] = useState<EnemyType | 'all'>('all')
  const [factionFilter, setFactionFilter] = useState<Faction | 'all'>('all')
  const [search, setSearch] = useState('')

  const allFactions: Faction[] = Array.from(
    new Set(ALL_ENEMIES.map((e) => e.faction))
  ) as Faction[]

  const filtered = ALL_ENEMIES.filter((e) => {
    if (typeFilter !== 'all' && e.type !== typeFilter) return false
    if (factionFilter !== 'all' && e.faction !== factionFilter) return false
    if (search && !e.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="bg-[#111118] border border-slate-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-widest uppercase text-slate-400">Ennemis</h2>
        {selectedEnemy && (
          <button
            onClick={() => setEnemy(null)}
            className="text-xs text-slate-600 hover:text-slate-300 transition"
          >
            × Désélectionner
          </button>
        )}
      </div>

      {/* Filtres type */}
      <div className="grid grid-cols-4 gap-1">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setTypeFilter(f.id)}
            className={`py-1.5 rounded border text-xs font-bold transition ${
              typeFilter === f.id
                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                : 'border-slate-800 text-slate-500 hover:border-slate-600'
            }`}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Filtre faction */}
      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setFactionFilter('all')}
          className={`px-2 py-1 rounded text-[10px] border transition ${
            factionFilter === 'all'
              ? 'border-slate-400 text-slate-200'
              : 'border-slate-800 text-slate-600 hover:border-slate-600'
          }`}
        >
          Toutes
        </button>
        {allFactions.map((f) => (
          <button
            key={f}
            onClick={() => setFactionFilter(f)}
            className={`px-2 py-1 rounded text-[10px] border transition ${
              factionFilter === f
                ? FACTION_COLORS[f]
                : 'border-slate-800 text-slate-600 hover:border-slate-600'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recherche */}
      <input
        type="text"
        placeholder="Rechercher…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full bg-transparent border border-slate-700 rounded px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-purple-500 outline-none"
      />

      {/* Liste scrollable */}
      <div className="space-y-1 max-h-52 overflow-y-auto pr-1 scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="text-xs text-slate-600 text-center py-4">Aucun résultat</div>
        ) : (
          filtered.map((enemy) => (
            <EnemyRow
              key={enemy.id}
              enemy={enemy}
              selected={selectedEnemy?.id === enemy.id}
              onSelect={() => setEnemy(selectedEnemy?.id === enemy.id ? null : enemy)}
            />
          ))
        )}
      </div>

      {/* Carte ennemi sélectionné */}
      {selectedEnemy && <EnemyCard enemy={selectedEnemy} />}
    </div>
  )
}
