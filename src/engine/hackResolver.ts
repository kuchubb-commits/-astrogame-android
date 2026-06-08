import type { CombatantState } from '../types/game'
import { roll, applyDamage, applyStatus } from './combat'
import hacksData from '../../data/hacks.json'

export interface HackResolution {
  hyperCost: number
  energyCost: number
  damageDice?: number
  damageSides?: number
  damageStat?: 'mind' | 'tech'
  damageMultiply?: boolean      // d10 × MIND (Hydra)
  damageCount?: number          // e.g. 3d6
  applyToEnemy?: string         // status id
  applyToPlayer?: string        // status id
  applyToAll?: boolean
  statusTurns?: number | 'mind' | 'tech'
  selfHealDice?: number
  selfHealStat?: 'tech'
}

const RESOLUTIONS: Record<string, HackResolution> = {
  javelin:      { hyperCost: 1,  energyCost: 0, damageDice: 1,  damageSides: 12, damageStat: 'mind' },
  trojan:       { hyperCost: 1,  energyCost: 0, applyToEnemy: 'breach',   statusTurns: 'mind' },
  ember:        { hyperCost: 1,  energyCost: 0, applyToEnemy: 'overheat', statusTurns: 'mind' },
  blackout:     { hyperCost: 1,  energyCost: 0, applyToEnemy: 'shock',    statusTurns: 'tech', applyToAll: true },
  shadow:       { hyperCost: 2,  energyCost: 0, applyToPlayer: 'immunity', statusTurns: 3 },
  counterspell: { hyperCost: 1,  energyCost: 0, applyToEnemy: 'silence',  statusTurns: 'mind', applyToAll: true },
  volt:         { hyperCost: 2,  energyCost: 0, damageDice: 1, damageSides: 10, damageStat: 'tech', applyToEnemy: 'stun', statusTurns: 1 },
  kraken:       { hyperCost: 2,  energyCost: 0, applyToEnemy: 'stun', statusTurns: 1, applyToAll: true },
  ignite:       { hyperCost: 3,  energyCost: 0, damageDice: 1, damageSides: 12, damageStat: 'mind', applyToEnemy: 'overheat', statusTurns: 2 },
  hydra:        { hyperCost: 3,  energyCost: 0, damageDice: 1, damageSides: 10, damageStat: 'mind', damageMultiply: true },
  // Master Hacks — cost Energy
  supernova:    { hyperCost: 0,  energyCost: 34, damageDice: 3, damageSides: 6, applyToEnemy: 'shock', statusTurns: 'mind', applyToAll: true },
  ragnarok:     { hyperCost: 0,  energyCost: 34, applyToEnemy: 'overheat', statusTurns: 'tech', applyToAll: true },
  aegis:        { hyperCost: 0,  energyCost: 34, applyToPlayer: 'immunity', statusTurns: 'mind' },
  archangel:    { hyperCost: 0,  energyCost: 34, selfHealDice: 10, selfHealStat: 'tech' },
  parasite:     { hyperCost: 0,  energyCost: 34, applyToEnemy: 'breach', statusTurns: 'mind', applyToAll: true },
  mindsteal:    { hyperCost: 0,  energyCost: 34, applyToEnemy: 'silence', statusTurns: 2 },
}

export interface HackResult {
  log: string
  newEnemy: CombatantState
  newPlayer: CombatantState
  damageDealt: number
}

export function resolveHack(
  hackId: string,
  enemy: CombatantState,
  player: CombatantState,
  stats: { vigor: number; grace: number; mind: number; tech: number },
): HackResult | null {
  const res = RESOLUTIONS[hackId]
  if (!res) return null

  const hack = hacksData.hacks.find((h) => h.id === hackId)
  if (!hack) return null

  let newEnemy = { ...enemy }
  let newPlayer = { ...player }
  let damageDealt = 0
  const parts: string[] = [`${hack.name}`]

  // Damage
  if (res.damageSides) {
    const count = res.damageCount ?? res.damageDice ?? 1
    const rawRoll = roll(res.damageSides, count)
    const statVal = res.damageStat ? stats[res.damageStat] : 0
    const raw = res.damageMultiply ? rawRoll * statVal : rawRoll + statVal
    const { target, dealt } = applyDamage(newEnemy, raw)
    newEnemy = target
    damageDealt = dealt
    parts.push(`${raw} brut → ${dealt} dégâts`)
  }

  // Heal self
  if (res.selfHealDice) {
    const statVal = res.selfHealStat ? stats[res.selfHealStat] : 0
    const healed = roll(res.selfHealDice) * statVal
    newPlayer = { ...newPlayer, hp: Math.min(newPlayer.maxHp, newPlayer.hp + healed) }
    parts.push(`+${healed} HP récupérés`)
  }

  // Status turns
  const turns: number | null =
    res.statusTurns === 'mind' ? stats.mind :
    res.statusTurns === 'tech' ? stats.tech :
    typeof res.statusTurns === 'number' ? res.statusTurns : null

  // Enemy status
  if (res.applyToEnemy) {
    const status = { id: res.applyToEnemy, name: capitalize(res.applyToEnemy), turnsLeft: turns }
    newEnemy = applyStatus(newEnemy, status)
    parts.push(`${capitalize(res.applyToEnemy)} (${turns ?? '∞'} tours)`)
  }

  // Player status
  if (res.applyToPlayer) {
    const status = { id: res.applyToPlayer, name: capitalize(res.applyToPlayer), turnsLeft: turns }
    newPlayer = applyStatus(newPlayer, status)
    parts.push(`${capitalize(res.applyToPlayer)} sur vous (${turns ?? '∞'} tours)`)
  }

  return { log: parts.join(' — '), newEnemy, newPlayer, damageDealt }
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export function findHackByName(name: string) {
  const n = name.toLowerCase().trim()
  return hacksData.hacks.find((h) => n.includes(h.name.toLowerCase()))
}

export function getHackResolution(hackId: string): HackResolution | undefined {
  return RESOLUTIONS[hackId]
}

export { hacksData }
