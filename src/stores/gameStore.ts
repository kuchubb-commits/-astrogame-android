import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, Starship, PlayTab, MapData, HexState, CycleEntry, CombatState, CombatantState, OracleEntry } from '../types/game'
import { ALL_HEXES, STARTING_HEX } from '../engine/hexMap'
import type { ExploreResult } from '../engine/exploration'
import {
  rollInitiative, resolveEnemyAction, applyDamage, tickStatuses,
  parseDamageFormula, extractWeaponFormula, hasStatus,
} from '../engine/combat'
import { resolveHack, getHackResolution } from '../engine/hackResolver'
import enemiesData from '../../data/enemies.json'
import cybertechData from '../../data/cybertech.json'

function initMapData(): MapData {
  const hexes: Record<string, HexState> = {}
  for (const h of ALL_HEXES) {
    hexes[h.id] = { id: h.id, ring: h.ring, explored: false, discoveryType: null, discoveryText: null, hexColor: null }
  }
  return { hexes, playerHexId: STARTING_HEX, cycleLog: [], cycleCount: 0 }
}

interface GameState {
  character: Character | null
  starship: Starship | null
  mapData: MapData | null
  combat: CombatState | null
  oracleLog: OracleEntry[]
  activeTab: PlayTab

  startGame: (character: Character, starship: Starship) => void
  ensureMap: () => void
  resetGame: () => void
  setTab: (tab: PlayTab) => void

  // Character
  updateStat: (stat: keyof Character['stats'], delta: number) => void
  updateBar: (bar: 'health' | 'energy' | 'armor' | 'hyperdrive', current: number) => void
  updateBarMax: (bar: 'health' | 'energy' | 'armor' | 'hyperdrive', max: number) => void
  updateResource: (resource: keyof Character['resources'], delta: number) => void
  setInventorySlot: (index: number, value: string | null) => void
  setWeaponSlot: (index: number, value: string | null) => void
  setMemorySlot: (index: number, value: string) => void

  // Starship
  updateHull: (current: number) => void
  updateFuel: (current: number) => void
  updateShields: (delta: number) => void
  setCargoSlot: (index: number, value: string | null) => void

  // Map
  movePlayer: (hexId: string) => void
  exploreCurrentHex: (result: ExploreResult) => void
  addLogEntry: (entry: Omit<CycleEntry, 'id'>) => void

  // Oracle
  addOracleEntry: (entry: Omit<OracleEntry, 'id'>) => void

  // Cybertech
  installCybertech: (id: string) => void
  removeCybertech: (id: string) => void

  // Drones
  deployDrone: (id: string) => void
  undeployDrone: () => void

  // Combat
  startCombat: (enemyId: string) => void
  playerAttack: (weaponStr: string) => void
  playerUseHack: (hackId: string) => void
  enemyAct: () => void
  playerEscape: () => void
  endCombat: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: null,
      starship: null,
      mapData: null,
      combat: null,
      oracleLog: [],
      activeTab: 'player',

      startGame: (character, starship) =>
        set({ character, starship, mapData: initMapData(), combat: null, oracleLog: [], activeTab: 'player' }),

      ensureMap: () => set((s) => s.mapData ? s : { mapData: initMapData() }),

      resetGame: () => set({ character: null, starship: null, mapData: null, combat: null, activeTab: 'player' }),

      setTab: (tab) => set({ activeTab: tab }),

      updateStat: (stat, delta) =>
        set((s) => {
          if (!s.character) return s
          return { character: { ...s.character, stats: { ...s.character.stats, [stat]: Math.max(0, s.character.stats[stat] + delta) } } }
        }),

      updateBar: (bar, current) =>
        set((s) => {
          if (!s.character) return s
          return { character: { ...s.character, [bar]: { ...s.character[bar], current: Math.max(0, current) } } }
        }),

      updateBarMax: (bar, max) =>
        set((s) => {
          if (!s.character) return s
          return { character: { ...s.character, [bar]: { ...s.character[bar], max: Math.max(0, max) } } }
        }),

      updateResource: (resource, delta) =>
        set((s) => {
          if (!s.character) return s
          return { character: { ...s.character, resources: { ...s.character.resources, [resource]: Math.max(0, s.character.resources[resource] + delta) } } }
        }),

      setInventorySlot: (index, value) =>
        set((s) => {
          if (!s.character) return s
          const inventory = [...s.character.inventory]; inventory[index] = value
          return { character: { ...s.character, inventory } }
        }),

      setWeaponSlot: (index, value) =>
        set((s) => {
          if (!s.character) return s
          const weapons = [...s.character.weapons]; weapons[index] = value
          return { character: { ...s.character, weapons } }
        }),

      setMemorySlot: (index, value) =>
        set((s) => {
          if (!s.character) return s
          const memorySlots = [...s.character.memorySlots]; memorySlots[index] = value
          return { character: { ...s.character, memorySlots } }
        }),

      updateHull: (current) =>
        set((s) => { if (!s.starship) return s; return { starship: { ...s.starship, hull: { ...s.starship.hull, current: Math.max(0, current) } } } }),

      updateFuel: (current) =>
        set((s) => { if (!s.starship) return s; return { starship: { ...s.starship, fuel: { ...s.starship.fuel, current: Math.max(0, current) } } } }),

      updateShields: (delta) =>
        set((s) => { if (!s.starship) return s; return { starship: { ...s.starship, shields: Math.max(0, s.starship.shields + delta) } } }),

      setCargoSlot: (index, value) =>
        set((s) => {
          if (!s.starship) return s
          const cargo = [...s.starship.cargo]; cargo[index] = value
          return { starship: { ...s.starship, cargo } }
        }),

      installCybertech: (id) =>
        set((s) => {
          if (!s.character) return s
          const cybertech = (cybertechData as any[]).find((c) => c.id === id)
          if (!cybertech) return s
          const boost = cybertech.statBoost ?? {}
          const stats = { ...s.character.stats }
          for (const k of Object.keys(boost) as Array<keyof typeof stats>) {
            stats[k] = (stats[k] ?? 0) + (boost[k] ?? 0)
          }
          return {
            character: {
              ...s.character,
              stats,
              installedCybertech: [...(s.character.installedCybertech ?? []), id],
            },
          }
        }),

      removeCybertech: (id) =>
        set((s) => {
          if (!s.character) return s
          const cybertech = (cybertechData as any[]).find((c) => c.id === id)
          if (!cybertech) return s
          const boost = cybertech.statBoost ?? {}
          const stats = { ...s.character.stats }
          for (const k of Object.keys(boost) as Array<keyof typeof stats>) {
            stats[k] = Math.max(0, (stats[k] ?? 0) - (boost[k] ?? 0))
          }
          return {
            character: {
              ...s.character,
              stats,
              installedCybertech: (s.character.installedCybertech ?? []).filter((i) => i !== id),
            },
          }
        }),

      deployDrone: (id) =>
        set((s) => {
          if (!s.character) return s
          return { character: { ...s.character, deployedDroneId: id } }
        }),

      undeployDrone: () =>
        set((s) => {
          if (!s.character) return s
          return { character: { ...s.character, deployedDroneId: null } }
        }),

      movePlayer: (hexId) =>
        set((s) => {
          if (!s.mapData || !s.starship) return s
          return {
            starship: { ...s.starship, fuel: { ...s.starship.fuel, current: Math.max(0, s.starship.fuel.current - 1) } },
            mapData: { ...s.mapData, playerHexId: hexId, cycleCount: s.mapData.cycleCount + 1 },
          }
        }),

      exploreCurrentHex: (result) =>
        set((s) => {
          if (!s.mapData) return s
          const hexId = s.mapData.playerHexId
          const hexes = { ...s.mapData.hexes }
          hexes[hexId] = { ...hexes[hexId], explored: true, discoveryType: result.type, discoveryText: result.text, hexColor: result.hexColor }
          const entry: CycleEntry = { id: Date.now(), hexId, type: result.type, text: `[${hexId}] d6=${result.roll} → ${result.type}: ${result.text}` }
          return { mapData: { ...s.mapData, hexes, cycleLog: [entry, ...s.mapData.cycleLog].slice(0, 50) } }
        }),

      addLogEntry: (entry) =>
        set((s) => {
          if (!s.mapData) return s
          return { mapData: { ...s.mapData, cycleLog: [{ ...entry, id: Date.now() }, ...s.mapData.cycleLog].slice(0, 50) } }
        }),

      addOracleEntry: (entry) =>
        set((s) => ({ oracleLog: [{ ...entry, id: Date.now() }, ...s.oracleLog].slice(0, 30) })),

      // ── COMBAT ──────────────────────────────────────────────────────────────

      startCombat: (enemyId) => {
        const { character } = get()
        if (!character) return
        const enemyData = (enemiesData as any[]).find((e) => e.id === enemyId)
        if (!enemyData) return

        const playerCombatant: CombatantState = {
          hp: character.health.current,
          maxHp: character.health.max,
          armor: character.armor.current,
          baseArmor: character.armor.current,
          statuses: [],
        }
        const enemyCombatant: CombatantState = {
          hp: enemyData.hp,
          maxHp: enemyData.hp,
          armor: enemyData.armor,
          baseArmor: enemyData.armor,
          statuses: [],
        }
        const firstTurn = rollInitiative(character.stats.grace, enemyData.stats.grace)
        const initText = firstTurn === 'player'
          ? `Initiative : vous agissez en premier (d10+GRA).`
          : `Initiative : ${enemyData.name} agit en premier.`

        const combat: CombatState = {
          enemyId,
          enemyName: enemyData.name,
          enemyStats: enemyData.stats,
          enemy: enemyCombatant,
          player: playerCombatant,
          turn: firstTurn,
          phase: 'active',
          log: [{ text: `⚔ Combat contre ${enemyData.name} (HP ${enemyData.hp}, Armor ${enemyData.armor})`, type: 'system' }, { text: initText, type: 'system' }],
          round: 1,
          expReward: Math.ceil(enemyData.hp / 5),
        }
        set({ combat })

        // If enemy goes first, trigger their turn automatically
        if (firstTurn === 'enemy') {
          setTimeout(() => get().enemyAct(), 600)
        }
      },

      playerAttack: (weaponStr) => {
        const state = get()
        const { combat, character } = state
        if (!combat || !character || combat.phase !== 'active' || combat.turn !== 'player') return

        const formula = extractWeaponFormula(weaponStr)
        const raw = parseDamageFormula(formula, character.stats)
        const { target: newEnemy, dealt } = applyDamage(combat.enemy, raw)

        const logEntry = { text: `Vous attaquez avec ${weaponStr} : ${raw} brut → ${dealt} dégâts (Armor ${combat.enemy.armor}).`, type: 'attack' as const }

        if (newEnemy.hp <= 0) {
          // Victory
          set({
            combat: {
              ...combat,
              enemy: newEnemy,
              phase: 'victory',
              log: [...combat.log, logEntry, { text: `✓ ${combat.enemyName} vaincu ! +${combat.expReward} EXP.`, type: 'victory' }],
            },
          })
          return
        }

        set({ combat: { ...combat, enemy: newEnemy, turn: 'enemy', log: [...combat.log, logEntry].slice(-20) } })
        setTimeout(() => get().enemyAct(), 800)
      },

      playerUseHack: (hackId) => {
        const state = get()
        const { combat, character } = state
        if (!combat || !character || combat.phase !== 'active' || combat.turn !== 'player') return

        const result = resolveHack(hackId, combat.enemy, combat.player, character.stats)
        if (!result) return

        // Check cost
        const res = getHackResolution(hackId)
        if (!res) return

        const hyperCost = res.hyperCost ?? 0
        const energyCost = res.energyCost ?? 0
        if (character.hyperdrive.current < hyperCost) return
        if (character.energy.current < energyCost) return

        // Deduct costs
        const updatedChar = {
          ...character,
          hyperdrive: { ...character.hyperdrive, current: character.hyperdrive.current - hyperCost },
          energy: { ...character.energy, current: character.energy.current - energyCost },
        }

        const logEntry = { text: result.log, type: 'attack' as const }
        const newLog = [...combat.log, logEntry].slice(-20)

        if (result.newEnemy.hp <= 0) {
          set({
            character: updatedChar,
            combat: {
              ...combat,
              enemy: result.newEnemy,
              player: result.newPlayer,
              phase: 'victory',
              log: [...newLog, { text: `✓ ${combat.enemyName} vaincu ! +${combat.expReward} EXP.`, type: 'victory' }],
            },
          })
          return
        }

        set({
          character: updatedChar,
          combat: { ...combat, enemy: result.newEnemy, player: result.newPlayer, turn: 'enemy', log: newLog },
        })
        setTimeout(() => get().enemyAct(), 800)
      },

      enemyAct: () => {
        const state = get()
        const { combat } = state
        if (!combat || combat.phase !== 'active' || combat.turn !== 'enemy') return

        const enemyData = (enemiesData as any[]).find((e) => e.id === combat.enemyId)
        if (!enemyData) return

        const logs: CombatState['log'] = []

        // Tick enemy statuses (Overheat DOT, etc.)
        const { target: tickedEnemy, dotDamage, expired } = tickStatuses(combat.enemy)
        let currentEnemy = tickedEnemy
        if (dotDamage > 0) logs.push({ text: `${combat.enemyName} subit ${dotDamage} dégâts de statut.`, type: 'status' })
        expired.forEach((id) => logs.push({ text: `${id} expiré sur ${combat.enemyName}.`, type: 'status' }))

        // Check stun
        let stunSkipped = false
        if (hasStatus(currentEnemy, 'stun')) {
          const stunRoll = Math.floor(Math.random() * 6) + 1
          if (stunRoll === 1) {
            stunSkipped = true
            logs.push({ text: `${combat.enemyName} est Stunned (d6=1) — tour annulé.`, type: 'status' })
          }
        }

        let currentPlayer = combat.player
        if (!stunSkipped) {
          const action = resolveEnemyAction(enemyData.actions, combat.enemyStats)
          if (action.damageRoll !== null) {
            const { target: newPlayer, dealt } = applyDamage(currentPlayer, action.damageRoll)
            currentPlayer = newPlayer
            logs.push({ text: `${combat.enemyName} utilise ${action.name} : ${action.damageRoll} brut → ${dealt} dégâts sur vous.`, type: 'enemy' })
          } else {
            logs.push({ text: `${combat.enemyName} utilise ${action.name} : ${action.effect}`, type: 'enemy' })
          }
        }

        const newLog = [...combat.log, ...logs].slice(-20)

        if (currentPlayer.hp <= 0) {
          set({ combat: { ...combat, enemy: currentEnemy, player: currentPlayer, phase: 'defeat', log: [...newLog, { text: '✗ Vous êtes à 0 HP. Défaite.', type: 'defeat' }] } })
          return
        }

        set({
          combat: {
            ...combat,
            enemy: currentEnemy,
            player: currentPlayer,
            turn: 'player',
            round: combat.round + 1,
            log: newLog,
          },
        })
      },

      playerEscape: () =>
        set((s) => {
          if (!s.combat) return s
          return { combat: { ...s.combat, phase: 'escaped', log: [...s.combat.log, { text: 'Vous fuyez le combat.', type: 'system' as const }] } }
        }),

      endCombat: () => {
        const { combat, character } = get()
        if (!combat || !character) return
        const updatedChar = combat.phase === 'victory'
          ? { ...character, health: { ...character.health, current: combat.player.hp }, resources: { ...character.resources, exp: character.resources.exp + combat.expReward } }
          : { ...character, health: { ...character.health, current: Math.max(1, combat.player.hp) } }
        set({ combat: null, character: updatedChar })
      },
    }),
    { name: 'astroprisma-save' }
  )
)
