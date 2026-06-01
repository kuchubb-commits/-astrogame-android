import { useRef, useEffect } from 'react'
import { useCombatStore } from '../../stores/combatStore'
import { useCharacterStore } from '../../stores/characterStore'
import { d10, d6 } from '../../stores/diceStore'
import type { StatusEffect } from '../../stores/combatStore'
import { FACTION_COLORS } from '../../data/enemies'

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseDamage(formula: string): number {
  // Parse les formules type "d6+VIG", "d10+MIN", "2d6", "d12" etc. en lançant des dés
  const match = formula.match(/(\d*)d(\d+)/i)
  if (!match) return 0
  const count = parseInt(match[1] || '1')
  const sides = parseInt(match[2])
  let total = 0
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1
  }
  return total
}

function rollWeaponDamage(damageFormula: string, stats: { vigor: number; grace: number; mind: number; tech: number }) {
  const formula = damageFormula.toLowerCase()
  const base = parseDamage(formula)
  let stat = 0
  if (formula.includes('vig')) stat = stats.vigor
  else if (formula.includes('gra')) stat = stats.grace
  else if (formula.includes('min')) stat = stats.mind
  else if (formula.includes('tec')) stat = stats.tech
  return { base, stat, total: base + stat }
}

function rollEnemyAction(actions: { range: string; desc: string }[]) {
  const roll = d10()
  const action = actions.find(a => {
    if (a.range.includes('-')) {
      const [lo, hi] = a.range.split('-').map(Number)
      return roll >= lo && roll <= hi
    }
    return roll === Number(a.range)
  })
  return { roll, action: action ?? actions[actions.length - 1] }
}

// ── StatusBadge ───────────────────────────────────────────────────────────────

function StatusBadge({ s }: { s: StatusEffect }) {
  const colors: Record<string, string> = {
    STUNNED: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
    BREACHED: 'bg-red-900/40 text-red-300 border-red-700',
    OVERHEATED: 'bg-orange-900/40 text-orange-300 border-orange-700',
    INVULNERABLE: 'bg-blue-900/40 text-blue-300 border-blue-700',
    HACKED: 'bg-purple-900/40 text-purple-300 border-purple-700',
    CYBERTECH_DISABLED: 'bg-slate-900/40 text-slate-300 border-slate-600',
  }
  return (
    <span className={`px-1.5 py-0.5 rounded border text-[10px] font-bold ${colors[s.key] ?? ''}`}>
      {s.key} {s.turnsLeft}t
    </span>
  )
}

// ── HpBar ─────────────────────────────────────────────────────────────────────

function HpBar({ current, max }: { current: number; max: number }) {
  const pct = max > 0 ? (current / max) * 100 : 0
  return (
    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all ${
          pct > 50 ? 'bg-green-500' : pct > 25 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

// ── CombatLog ─────────────────────────────────────────────────────────────────

function CombatLog() {
  const { log } = useCombatStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight
  }, [log])

  const colors = {
    player: 'text-blue-300',
    enemy: 'text-red-300',
    system: 'text-slate-400',
  }

  return (
    <div
      ref={ref}
      className="bg-slate-900/50 border border-slate-800 rounded p-3 h-36 overflow-y-auto space-y-1"
    >
      {log.map(entry => (
        <div key={entry.id} className={`text-xs ${colors[entry.actor]}`}>
          {entry.actor !== 'system' && (
            <span className="opacity-40 mr-1 font-mono">T{entry.turn}</span>
          )}
          {entry.text}
        </div>
      ))}
    </div>
  )
}

// ── Écran fin de combat ───────────────────────────────────────────────────────

function EndScreen({ phase, onReset }: { phase: string; onReset: () => void }) {
  return (
    <div className="text-center space-y-4 py-6">
      {phase === 'victory' && (
        <>
          <div className="text-4xl">🏆</div>
          <div className="text-xl font-black text-green-400 tracking-widest">VICTOIRE</div>
          <div className="text-slate-400 text-sm">L'ennemi est vaincu.</div>
        </>
      )}
      {phase === 'defeat' && (
        <>
          <div className="text-4xl">💀</div>
          <div className="text-xl font-black text-red-400 tracking-widest">DÉFAITE</div>
          <div className="text-slate-400 text-sm">Tu as été mis hors combat.</div>
        </>
      )}
      {phase === 'escaped' && (
        <>
          <div className="text-4xl">💨</div>
          <div className="text-xl font-black text-yellow-400 tracking-widest">FUITE</div>
          <div className="text-slate-400 text-sm">Tu as réussi à fuir le combat.</div>
        </>
      )}
      <button
        onClick={onReset}
        className="px-6 py-2 rounded border border-purple-500 text-purple-300 text-sm font-bold tracking-widest uppercase hover:bg-purple-500/20 transition"
      >
        Nouveau combat
      </button>
    </div>
  )
}

// ── CombatTracker principal ───────────────────────────────────────────────────

export function CombatTracker() {
  const store = useCombatStore()
  const { character, patch } = useCharacterStore()
  const {
    phase, enemy, enemyHp, enemyStatuses, playerStatuses,
    turn, addLog, damageEnemy, damagePlayer, nextTurn, endCombat, reset,
    applyEnemyStatus, applyPlayerStatus,
  } = store

  if (!enemy) return null

  const factionStyle = FACTION_COLORS[enemy.faction]

  // ── Action joueur : attaque ───────────────────────────────────────────────

  function handleAttack(weaponIndex: 0 | 1) {
    const weapon = character.weapons[weaponIndex]
    if (!weapon.name && !weapon.damage) {
      addLog('system', `⚠️ Arme ${weaponIndex + 1} non configurée dans la feuille.`)
      return
    }
    const { base, stat, total } = rollWeaponDamage(weapon.damage || 'd6+VIG', character)
    const net = Math.max(0, total) // pas d'armure côté joueur → dégâts nets
    addLog('player', `🗡 ${weapon.name || `Arme ${weaponIndex + 1}`} — d(${base}) + stat(${stat}) = ${total} dégâts`)
    damageEnemy(net)
    if (phase !== 'victory') nextTurn()
  }

  // ── Action joueur : fuite ─────────────────────────────────────────────────

  function handleEscape() {
    const playerDie = d10()
    const playerTotal = playerDie + character.grace
    const enemyDie = d10()
    const enemyTotal = enemyDie + enemy.difficulty
    const success = playerTotal > enemyTotal
    addLog('player', `🏃 Fuite — Toi d10(${playerDie})+GRA(${character.grace})=${playerTotal} vs d10(${enemyDie})+${enemy.difficulty}=${enemyTotal}`)
    if (success) {
      addLog('system', '✅ Fuite réussie !')
      endCombat('escaped')
    } else {
      addLog('system', '❌ Fuite échouée — tour ennemi.')
      nextTurn()
    }
  }

  // ── Tour ennemi ───────────────────────────────────────────────────────────

  function handleEnemyTurn() {
    const isStunned = enemyStatuses.some(s => s.key === 'STUNNED')
    if (isStunned) {
      const roll = d6()
      if (roll === 1) {
        addLog('enemy', `😵 ${enemy.name} est STUNNED — dé ${roll} → tour sauté.`)
        nextTurn()
        return
      }
      addLog('enemy', `😵 ${enemy.name} est STUNNED — dé ${roll} → agit quand même.`)
    }

    const { roll, action } = rollEnemyAction(enemy.actions)
    addLog('enemy', `🎲 ${enemy.name} — d10 : ${roll} → ${action.desc}`)

    // Applique les dégâts si la description contient un dé de dégâts
    const dmgMatch = action.desc.match(/(\d*)d(\d+)(?:\+[A-Z]+)?/)
    if (dmgMatch) {
      const count = parseInt(dmgMatch[1] || '1')
      const sides = parseInt(dmgMatch[2])
      let raw = 0
      for (let i = 0; i < count; i++) raw += Math.floor(Math.random() * sides) + 1
      // Stat ennemi : on utilise difficulty comme approximation
      const statBonus = Math.floor(enemy.difficulty / 2)
      raw += statBonus
      const net = damagePlayer(raw, { health: character.health, armor: character.armor })
      if (net > 0 && phase !== 'defeat') {
        patch(c => { c.health = Math.max(0, c.health - net) })
      }
    }

    // Gère OVERHEAT du joueur (d6 dégâts si actif)
    const overheat = playerStatuses.find(s => s.key === 'OVERHEATED')
    if (overheat) {
      const ohDmg = d6()
      addLog('system', `🔥 OVERHEAT — tu prends ${ohDmg} dégâts (ignore armure).`)
      patch(c => { c.health = Math.max(0, c.health - ohDmg) })
      if (character.health - ohDmg <= 0) { endCombat('defeat'); return }
    }

    if (phase !== 'defeat') nextTurn()
  }

  // ── Rendu ─────────────────────────────────────────────────────────────────

  if (['victory', 'defeat', 'escaped'].includes(phase)) {
    return (
      <div className="space-y-4">
        <CombatLog />
        <EndScreen phase={phase} onReset={reset} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* En-tête — HP des deux combattants */}
      <div className="grid grid-cols-2 gap-3">
        {/* Joueur */}
        <div className="bg-slate-900/50 border border-slate-700 rounded p-3 space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-500">Toi</div>
          <div className="font-black text-lg text-green-400">
            {character.health}<span className="text-xs text-slate-500">/{character.maxHealth}</span>
          </div>
          <HpBar current={character.health} max={character.maxHealth} />
          {character.armor > 0 && (
            <div className="text-[10px] text-slate-500">🛡 Armure {character.armor}</div>
          )}
          <div className="flex flex-wrap gap-1">
            {playerStatuses.map(s => <StatusBadge key={s.key} s={s} />)}
          </div>
        </div>

        {/* Ennemi */}
        <div className={`rounded border p-3 space-y-2 ${factionStyle}`}>
          <div className="text-[10px] uppercase tracking-widest opacity-60">Ennemi</div>
          <div className="font-black text-lg">
            {enemyHp}<span className="text-xs opacity-50">/{enemy.hp}</span>
          </div>
          <HpBar current={enemyHp} max={enemy.hp} />
          <div className="text-[10px] opacity-60 truncate">{enemy.name}</div>
          <div className="flex flex-wrap gap-1">
            {enemyStatuses.map(s => <StatusBadge key={s.key} s={s} />)}
          </div>
        </div>
      </div>

      {/* Indicateur de tour */}
      <div className={`text-center text-xs font-black tracking-widest py-2 rounded border ${
        phase === 'player-turn'
          ? 'border-blue-500 bg-blue-500/10 text-blue-300'
          : 'border-red-500 bg-red-500/10 text-red-300'
      }`}>
        {phase === 'player-turn' ? `▶ TON TOUR — Tour ${turn}` : `▶ TOUR ENNEMI — Tour ${turn}`}
      </div>

      {/* Log */}
      <CombatLog />

      {/* Actions joueur */}
      {phase === 'player-turn' && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-500">Actions</div>

          {/* Armes */}
          <div className="grid grid-cols-2 gap-2">
            {([0, 1] as const).map(i => {
              const w = character.weapons[i]
              return (
                <button
                  key={i}
                  onClick={() => handleAttack(i)}
                  className="py-2 px-3 rounded border border-blue-700 text-blue-300 text-xs font-bold hover:bg-blue-500/20 transition text-left"
                >
                  <div className="font-black">⚔ {w.name || `Arme ${i + 1}`}</div>
                  <div className="opacity-60 text-[10px]">{w.damage || 'd6+VIG'}</div>
                </button>
              )
            })}
          </div>

          {/* Statuts manuels */}
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => applyEnemyStatus('STUNNED', 1)}
              className="py-1.5 rounded border border-yellow-700 text-yellow-400 text-[10px] font-bold hover:bg-yellow-500/10 transition"
            >
              + STUN ennemi
            </button>
            <button
              onClick={() => applyEnemyStatus('BREACHED', 2)}
              className="py-1.5 rounded border border-red-700 text-red-400 text-[10px] font-bold hover:bg-red-500/10 transition"
            >
              + BREACH ennemi
            </button>
          </div>

          {/* Fuite */}
          <button
            onClick={handleEscape}
            className="w-full py-2 rounded border border-slate-600 text-slate-400 text-xs font-bold tracking-widest uppercase hover:border-slate-400 transition"
          >
            🏃 Fuir (xROLL GRA vs {enemy.difficulty})
          </button>
        </div>
      )}

      {/* Action ennemi */}
      {phase === 'enemy-turn' && (
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-500">
            Table d'actions — {enemy.name}
          </div>
          {enemy.actions.map((a, i) => (
            <div key={i} className="flex gap-2 text-xs opacity-60">
              <span className="w-8 text-right shrink-0">{a.range}</span>
              <span>{a.desc}</span>
            </div>
          ))}
          <button
            onClick={handleEnemyTurn}
            className="w-full py-2 rounded border border-red-600 text-red-300 text-sm font-bold tracking-widest uppercase hover:bg-red-500/20 transition"
          >
            🎲 LANCER L'ACTION ENNEMIE (d10)
          </button>
        </div>
      )}
    </div>
  )
}
