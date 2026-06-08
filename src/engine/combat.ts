import type { CombatantState, ActiveStatus } from '../types/game'

export interface Stats {
  vigor: number
  grace: number
  mind: number
  tech: number
}

// ── Dice ─────────────────────────────────────────────────────────────────────

export function roll(sides: number, count = 1): number {
  let t = 0
  for (let i = 0; i < count; i++) t += Math.floor(Math.random() * sides) + 1
  return t
}

// ── Damage parsing ────────────────────────────────────────────────────────────

const STAT_MAP: Record<string, keyof Stats> = {
  vig: 'vigor', vigor: 'vigor',
  gra: 'grace', grace: 'grace',
  min: 'mind',  mind: 'mind',
  tec: 'tech',  tech: 'tech',
}

export function parseDamageFormula(formula: string, stats: Stats): number {
  const f = formula.toLowerCase().replace(/\s/g, '')
  const m = f.match(/^(\d*)d(\d+)(?:[+](\w+))?/)
  if (!m) return 1
  const count = parseInt(m[1] || '1')
  const sides = parseInt(m[2])
  const mod = m[3] ?? ''
  let total = roll(sides, count)
  const statKey = STAT_MAP[mod]
  if (statKey) total += stats[statKey]
  else if (/^\d+$/.test(mod)) total += parseInt(mod)
  return Math.max(1, total)
}

// Extracts damage formula from weapon strings like "Pulse Rifle (d8+1 / 2A)"
export function extractWeaponFormula(weaponStr: string): string {
  const m = weaponStr.match(/\(([^/)]+)/)
  if (m) return m[1].trim()
  // Try bare formula
  const bare = weaponStr.match(/([\dd]+d\d+[+\w]*)/)
  if (bare) return bare[1]
  return 'd6'
}

// ── Enemy action resolution ───────────────────────────────────────────────────

export interface EnemyAction {
  name: string
  effect: string
  damageRoll: number | null  // null if not a direct damage action
}

export function resolveEnemyAction(
  actions: { roll: string; name: string; effect: string }[],
  enemyStats: Stats,
): EnemyAction {
  const d10 = roll(10)
  let chosen = actions[0]
  for (const a of actions) {
    const parts = a.roll.split('-').map(Number)
    const lo = parts[0], hi = parts[1] ?? parts[0]
    if (d10 >= lo && d10 <= hi) { chosen = a; break }
  }

  // Try to parse damage from effect string (e.g. "d10+VIG damage", "2d6+VIG damage")
  const dmgMatch = chosen.effect.match(/([\d]*)d(\d+)(?:[+](\w+))?\s+damage/i)
  let damageRoll: number | null = null
  if (dmgMatch) {
    const formula = `${dmgMatch[1]}d${dmgMatch[2]}${dmgMatch[3] ? '+' + dmgMatch[3] : ''}`
    damageRoll = parseDamageFormula(formula, enemyStats)
  }

  return { name: chosen.name, effect: chosen.effect, damageRoll }
}

// ── Status conditions ─────────────────────────────────────────────────────────

export function hasStatus(target: CombatantState, id: string): boolean {
  return target.statuses.some((s) => s.id === id)
}

export function applyStatus(
  target: CombatantState,
  status: ActiveStatus,
): CombatantState {
  const existing = target.statuses.find((s) => s.id === status.id)
  if (existing) {
    // Stack: reset turns to highest
    return {
      ...target,
      statuses: target.statuses.map((s) =>
        s.id === status.id
          ? { ...s, turnsLeft: Math.max(s.turnsLeft ?? 0, status.turnsLeft ?? 0) }
          : s
      ),
    }
  }
  const updated = { ...target, statuses: [...target.statuses, status] }
  if (status.id === 'shock') updated.armor = 0
  return updated
}

export function removeStatus(target: CombatantState, id: string): CombatantState {
  const updated = { ...target, statuses: target.statuses.filter((s) => s.id !== id) }
  if (id === 'shock') updated.armor = updated.baseArmor
  return updated
}

// Returns [updatedTarget, dotDamage, expiredIds]
export function tickStatuses(target: CombatantState): {
  target: CombatantState
  dotDamage: number
  expired: string[]
} {
  let dotDamage = 0
  const expired: string[] = []
  let statuses: ActiveStatus[] = []

  for (const s of target.statuses) {
    if (s.id === 'overheat') dotDamage += roll(6)
    if (s.id === 'toxins') dotDamage += 1

    const newTurns = s.turnsLeft === null ? null : s.turnsLeft - 1
    if (newTurns === null || newTurns > 0) {
      statuses.push({ ...s, turnsLeft: newTurns })
    } else {
      expired.push(s.id)
    }
  }

  let updated = { ...target, statuses }
  // Restore armor when shock expires
  if (expired.includes('shock')) updated.armor = updated.baseArmor

  return { target: updated, dotDamage, expired }
}

// ── Initiative ────────────────────────────────────────────────────────────────

export function rollInitiative(playerGrace: number, enemyGrace: number): 'player' | 'enemy' {
  const p = roll(10) + playerGrace
  const e = roll(10) + enemyGrace
  return p >= e ? 'player' : 'enemy'
}

// ── Damage application ────────────────────────────────────────────────────────

export function applyDamage(target: CombatantState, raw: number): { target: CombatantState; dealt: number } {
  const armor = hasStatus(target, 'immunity') ? raw : (hasStatus(target, 'shock') ? 0 : target.armor)
  const dealt = hasStatus(target, 'immunity') ? 0 : Math.max(1, raw - armor)
  return { target: { ...target, hp: Math.max(0, target.hp - dealt) }, dealt }
}
