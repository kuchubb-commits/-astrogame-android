import starshipModulesData from '../../data/starship-modules.json'
import starshipsData from '../../data/starships.json'

interface RawModule {
  id: string
  name: string
  category: 'engines' | 'control' | 'systems' | 'weapons'
  tier: number
  activationRoll: string
  effect: string
  cost: number
}

const allModules = starshipModulesData as RawModule[]

export function findModule(nameOrId: string): RawModule | undefined {
  const n = nameOrId.toLowerCase().trim()
  return allModules.find((m) => m.id === n || m.name.toLowerCase() === n)
}

export interface EngineConfig {
  diceCount: number
  firstTurnBonus: number
  rerollCount: number
}

export function getEngineConfig(moduleNames: string[]): EngineConfig {
  for (const name of moduleNames) {
    const mod = findModule(name)
    if (mod?.category === 'engines') {
      const countMatch = mod.activationRoll.match(/^(\d)d6/)
      const diceCount = countMatch ? parseInt(countMatch[1]) : 2
      const rerollCount = mod.effect.toLowerCase().includes('reroll') ? 1 : 0
      const bonusMatch = mod.effect.match(/\+(\d)\s+action\s+di/i)
      const firstTurnBonus = bonusMatch ? parseInt(bonusMatch[1]) : 0
      return { diceCount, firstTurnBonus, rerollCount }
    }
  }
  return { diceCount: 2, firstTurnBonus: 0, rerollCount: 0 }
}

export function rollDice(count: number): number[] {
  return Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1)
}

export function canActivate(die: number, activationRoll: string): boolean {
  const r = activationRoll.trim()
  if (!r || r.includes('/')) return false
  if (r === 'X') return true
  const parts = r.split('-').map(Number)
  if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) return die >= parts[0] && die <= parts[1]
  if (parts.length === 1 && !isNaN(parts[0])) return die === parts[0]
  return false
}

export function getActivatableModules(moduleNames: string[], die: number): string[] {
  return moduleNames.filter((name) => {
    const mod = findModule(name)
    if (!mod || mod.category === 'engines' || mod.category === 'control') return false
    return canActivate(die, mod.activationRoll)
  })
}

export function getPassiveEffects(moduleNames: string[]): Array<{ name: string; effect: string }> {
  return moduleNames
    .map((name) => findModule(name))
    .filter((m): m is RawModule => m?.category === 'control')
    .map((m) => ({ name: m.name, effect: m.effect }))
}

export interface ShipBattle {
  hull: number
  maxHull: number
  shields: number
}

export interface BattleCtx {
  doubleNextAttack: boolean
  extraDamage: number
}

export interface ActivationResult {
  log: string
  newOwner: ShipBattle  // ship that owns the module (repairs/shields apply here)
  newTarget: ShipBattle // opposing ship (weapon damage applies here)
  newCtx: BattleCtx
  extraDie: boolean
}

export function resolveModuleActivation(
  moduleName: string,
  dieValue: number,
  owner: ShipBattle,
  target: ShipBattle,
  ctx: BattleCtx,
): ActivationResult {
  const mod = findModule(moduleName)
  const fallback: ActivationResult = {
    log: `${moduleName} — aucun effet`,
    newOwner: { ...owner },
    newTarget: { ...target },
    newCtx: { ...ctx },
    extraDie: false,
  }
  if (!mod) return fallback

  let newOwner = { ...owner }
  let newTarget = { ...target }
  let newCtx = { ...ctx }
  let extraDie = false

  // Apply weapon damage, consuming doubleNextAttack + extraDamage
  const dealDamage = (base: number, ignoresShields = false): number => {
    let total = base + newCtx.extraDamage
    if (newCtx.doubleNextAttack) total = total * 2
    newCtx.doubleNextAttack = false
    newCtx.extraDamage = 0
    let remaining = total
    let sh = newTarget.shields
    if (!ignoresShields && sh > 0) {
      const blocked = Math.min(sh, remaining)
      sh -= blocked
      remaining -= blocked
    }
    newTarget = { ...newTarget, hull: Math.max(0, newTarget.hull - remaining), shields: sh }
    return total
  }

  let log = mod.name

  switch (mod.id) {
    case 'spark-multilasers': {
      const dmg = dealDamage(3, true)
      log += ` — ${dmg} dégâts (ignore Shields)`
      break
    }
    case 'ogre-missiles': {
      const dmg = dealDamage(6)
      log += ` — ${dmg} dégâts`
      break
    }
    case 'auto-turrets': {
      const dmg = dealDamage(2)
      log += ` — ${dmg} dégâts`
      break
    }
    case 'particle-cannons': {
      // PC deals base damage but does NOT consume extraDamage (stacks for later)
      let base = 3
      if (newCtx.doubleNextAttack) { base *= 2; newCtx.doubleNextAttack = false }
      let remaining = base
      let sh = newTarget.shields
      if (sh > 0) { const b = Math.min(sh, remaining); sh -= b; remaining -= b }
      newTarget = { ...newTarget, hull: Math.max(0, newTarget.hull - remaining), shields: sh }
      newCtx.extraDamage += 1
      log += ` — ${base} dégâts, +1 dgt accumulé (pool: ${newCtx.extraDamage})`
      break
    }
    case 'berserk-turrets': {
      const dmg = dealDamage(dieValue)
      log += ` — ${dmg} dégâts (X=${dieValue})`
      break
    }
    case 'glaive-lasers': {
      const dmg = dealDamage(dieValue, true)
      log += ` — ${dmg} dégâts (X=${dieValue}, ignore Shields)`
      break
    }
    case 'gravity-railgun': {
      const bonus = owner.shields * 3
      const dmg = dealDamage(3 + bonus)
      log += ` — ${dmg} dégâts (3 + ${bonus} depuis Shields)`
      break
    }
    case 'harpoon-missiles': {
      const dmg = dealDamage(10)
      log += ` — ${dmg} dégâts`
      break
    }
    case 'repair-drones': {
      const healed = Math.min(4, newOwner.maxHull - newOwner.hull)
      newOwner = { ...newOwner, hull: newOwner.hull + healed }
      log += healed > 0 ? ` — +${healed} Hull réparé` : ` — Hull déjà max`
      break
    }
    case 'shield-generator': {
      if (newOwner.shields < 8) {
        newOwner = { ...newOwner, shields: Math.min(8, newOwner.shields + 1) }
        log += ` — +1 Shield (total ${newOwner.shields})`
      } else {
        log += ` — Shields déjà à 8`
      }
      break
    }
    case 'breach-system': {
      log += ` — Ennemi : -1 action au prochain tour`
      break
    }
    case 'solar-panels': {
      extraDie = true
      log += ` — +1d6 dé supplémentaire`
      break
    }
    case 'tracking-radar': {
      newCtx.doubleNextAttack = true
      log += ` — Prochain tir : dégâts ×2`
      break
    }
    case 'disruptor-beams': {
      newTarget = { ...newTarget, shields: 0 }
      log += ` — Tous les Shields ennemis détruits`
      break
    }
    case 'quantum-system': {
      log += ` — Téléportation ennemie — Boarding initié !`
      break
    }
    case 'aegis-generator': {
      const add = Math.min(3, 8 - newOwner.shields)
      newOwner = { ...newOwner, shields: newOwner.shields + add }
      log += ` — +${add} Shields (total ${newOwner.shields})`
      break
    }
    default:
      log += ` — ${mod.effect}`
  }

  return { log, newOwner, newTarget, newCtx, extraDie }
}

export function resolveEnemyShipTurn(
  enemyModules: string[],
  player: ShipBattle,
  enemy: ShipBattle,
  round: number,
): { newPlayer: ShipBattle; newEnemy: ShipBattle; logs: string[] } {
  const config = getEngineConfig(enemyModules)
  let count = config.diceCount
  if (round === 1 && config.firstTurnBonus > 0) count += config.firstTurnBonus

  // eclipse-bridge: +1 die if enemy in critical
  if (enemy.hull <= 10 && enemyModules.some((n) => findModule(n)?.id === 'eclipse-bridge')) count += 1

  const dice = rollDice(count)
  const logs: string[] = [`Tour ennemi · dés [${dice.join(', ')}]`]

  let curPlayer = { ...player }
  let curEnemy = { ...enemy }
  const ctx: BattleCtx = { doubleNextAttack: false, extraDamage: 0 }
  const usedMods = new Set<string>()

  for (const die of dice) {
    const activatable = getActivatableModules(enemyModules, die).filter((m) => !usedMods.has(m))
    if (activatable.length === 0) continue

    // Prefer weapons, then systems
    const chosen =
      activatable.find((n) => findModule(n)?.category === 'weapons') ?? activatable[0]
    usedMods.add(chosen)

    // Enemy = owner, player = target
    const result = resolveModuleActivation(chosen, die, curEnemy, curPlayer, ctx)
    curEnemy = result.newOwner
    curPlayer = result.newTarget
    ctx.doubleNextAttack = result.newCtx.doubleNextAttack
    ctx.extraDamage = result.newCtx.extraDamage
    logs.push(`[d${die}] ${result.log}`)

    if (curPlayer.hull <= 0) break
  }

  return { newPlayer: curPlayer, newEnemy: curEnemy, logs }
}

export interface StarshipEntry {
  id: string
  name: string
  class: string
  hull: number
  actions: number
  modules: string[]
  skill: string
  exp: number
}

export function getStarshipData(id: string): StarshipEntry | undefined {
  return (starshipsData as StarshipEntry[]).find((s) => s.id === id)
}

export function calcStartingShields(moduleNames: string[], goesFirst: boolean): number {
  let shields = 0
  for (const name of moduleNames) {
    const mod = findModule(name)
    if (mod?.id === 'vector-cockpit') shields += 1
    if (mod?.id === 'freighter-command' && !goesFirst) shields += 2
  }
  return Math.min(shields, 8)
}
