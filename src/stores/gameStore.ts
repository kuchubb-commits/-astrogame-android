import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, Starship, PlayTab, MapData, HexState, CycleEntry, CombatState, CombatantState, OracleEntry, StarshipCombatState, SettlementState, GeneratedNpc, FactionMission, Crewmember, Connection } from '../types/game'
import { ALL_HEXES, STARTING_HEX } from '../engine/hexMap'
import type { ExploreResult } from '../engine/exploration'
import {
  rollInitiative, resolveEnemyAction, applyDamage, tickStatuses,
  parseDamageFormula, extractWeaponFormula, hasStatus,
} from '../engine/combat'
import { resolveHack, getHackResolution } from '../engine/hackResolver'
import {
  findModule, getEngineConfig, rollDice, canActivate,
  resolveModuleActivation, resolveEnemyShipTurn,
  getStarshipData, calcStartingShields,
} from '../engine/starshipCombat'
import type { BattleCtx } from '../engine/starshipCombat'
import { rollD66, generateNetwork, getEncounter, getReward, extractClockDelta } from '../engine/cybersphere'
import enemiesData from '../../data/enemies.json'
import cybertechData from '../../data/cybertech.json'
import itemsData from '../../data/items.json'
import npcsData from '../../data/npcs.json'
import missionsData from '../../data/missions.json'

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
  shipCombat: StarshipCombatState | null
  settlement: SettlementState | null
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

  equipHack: (hackName: string, slotIndex: number) => void

  // Oracle
  addOracleEntry: (entry: Omit<OracleEntry, 'id'>) => void

  // Cybertech
  installCybertech: (id: string) => void
  removeCybertech: (id: string) => void

  // Drones
  deployDrone: (id: string) => void
  undeployDrone: () => void

  // Settlement
  enterSettlement: () => void
  exitSettlement: () => void
  refuelShip: (units: number) => void
  buyItem: (itemId: string) => void
  craftItem: (itemId: string) => void
  dismantleSlot: (index: number) => void
  useTestFlight: (type: 'race' | 'drill') => void
  startCybersphere: () => void
  cybersphereAdvance: () => void
  cybersphereCollectReward: () => void
  exitCybersphere: () => void
  generateNpc: () => void

  // Crew & Connections
  recruitCrew: (crew: Crewmember, costSerum?: number) => void
  dismissCrew: (index: number) => void
  updateCrewHp: (index: number, current: number) => void
  updateCrewStat: (crewIndex: number, stat: keyof Crewmember['stats'], delta: number) => void
  setCrewInventorySlot: (crewIndex: number, slotIndex: number, value: string | null) => void
  addConnection: (conn: Connection) => void
  removeConnection: (index: number) => void
  updateConnectionAffinity: (index: number, delta: number) => void

  // Factions
  joinFaction: (factionId: string) => void
  leaveFaction: () => void
  generateFactionMission: () => void
  completeFactionMission: () => void
  failFactionMission: () => void
  gainFavor: (delta: number) => void

  // Combat terrestre
  startCombat: (enemyId: string, isSim?: boolean) => void
  playerAttack: (weaponStr: string) => void
  playerUseHack: (hackId: string) => void
  enemyAct: () => void
  playerEscape: () => void
  endCombat: () => void

  // Combat spatial
  startStarshipCombat: (enemyShipId: string) => void
  rollShipDice: () => void
  activateShipModule: (moduleName: string, dieIndex: number) => void
  endPlayerShipTurn: () => void
  enemyShipAct: () => void
  escapeStarship: () => void
  endStarshipCombat: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: null,
      starship: null,
      mapData: null,
      combat: null,
      shipCombat: null,
      settlement: null,
      oracleLog: [],
      activeTab: 'player',

      startGame: (character, starship) => {
        const c = character.crewmembers ? character : { ...character, crewmembers: [], connections: [] }
        set({ character: c, starship, mapData: initMapData(), combat: null, shipCombat: null, settlement: null, oracleLog: [], activeTab: 'player' })
      },

      ensureMap: () => set((s) => s.mapData ? s : { mapData: initMapData() }),

      resetGame: () => set({ character: null, starship: null, mapData: null, combat: null, shipCombat: null, settlement: null, activeTab: 'player' }),

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
          const cost = cybertech.cost ?? 0
          if (s.character.resources.exp < cost) return s
          const boost = cybertech.statBoost ?? {}
          const stats = { ...s.character.stats }
          for (const k of Object.keys(boost) as Array<keyof typeof stats>) {
            stats[k] = (stats[k] ?? 0) + (boost[k] ?? 0)
          }
          return {
            character: {
              ...s.character,
              stats,
              resources: { ...s.character.resources, exp: s.character.resources.exp - cost },
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

      equipHack: (hackName, slotIndex) =>
        set((s) => {
          if (!s.character) return s
          const memorySlots = [...s.character.memorySlots]
          memorySlots[slotIndex] = hackName
          return { character: { ...s.character, memorySlots } }
        }),

      addOracleEntry: (entry) =>
        set((s) => ({ oracleLog: [{ ...entry, id: Date.now() }, ...s.oracleLog].slice(0, 30) })),

      // ── COMBAT ──────────────────────────────────────────────────────────────

      startCombat: (enemyId, isSim = false) => {
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
          log: [
            { text: isSim ? `🎮 Simulation de combat contre ${enemyData.name} (HP ${enemyData.hp}, Armor ${enemyData.armor})` : `⚔ Combat contre ${enemyData.name} (HP ${enemyData.hp}, Armor ${enemyData.armor})`, type: 'system' },
            { text: initText, type: 'system' },
          ],
          round: 1,
          expReward: Math.ceil(enemyData.hp / 5),
          isSim,
          preSimHp: isSim ? character.health.current : undefined,
          preSimEnergy: isSim ? character.energy.current : undefined,
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
          if (combat.isSim) {
            // Sim mode: can't die — force HP to 1 and continue
            currentPlayer = { ...currentPlayer, hp: 1 }
            const simLog = [...newLog, { text: `[SIM] HP à 0 → maintenu à 1 (simulation).`, type: 'status' as const }]
            set({ combat: { ...combat, enemy: currentEnemy, player: currentPlayer, turn: 'player', round: combat.round + 1, log: simLog } })
            return
          }
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
        if (combat.isSim) {
          // Restore HP/Energy to pre-sim values, grant EXP on victory
          const restoredHp = combat.preSimHp ?? character.health.current
          const restoredEnergy = combat.preSimEnergy ?? character.energy.current
          const expGain = combat.phase === 'victory' ? combat.expReward : 0
          const updatedChar = {
            ...character,
            health: { ...character.health, current: restoredHp },
            energy: { ...character.energy, current: restoredEnergy },
            resources: { ...character.resources, exp: character.resources.exp + expGain },
          }
          set({ combat: null, character: updatedChar })
          return
        }
        const updatedChar = combat.phase === 'victory'
          ? { ...character, health: { ...character.health, current: combat.player.hp }, resources: { ...character.resources, exp: character.resources.exp + combat.expReward } }
          : { ...character, health: { ...character.health, current: Math.max(1, combat.player.hp) } }
        set({ combat: null, character: updatedChar })
      },

      // ── COMBAT SPATIAL ──────────────────────────────────────────────────────

      startStarshipCombat: (enemyShipId) => {
        const { starship } = get()
        if (!starship) return
        const enemyData = getStarshipData(enemyShipId)
        if (!enemyData) return

        const playerInit = Math.floor(Math.random() * 6) + 1
        const enemyInit = Math.floor(Math.random() * 6) + 1
        const playerFirst = playerInit >= enemyInit

        const playerStartShields = Math.min(8, starship.shields + calcStartingShields(starship.modules, playerFirst))
        const enemyStartShields = calcStartingShields(enemyData.modules, !playerFirst)

        const sc: StarshipCombatState = {
          enemyShipId,
          enemyShipName: enemyData.name,
          enemyModules: enemyData.modules,
          playerModules: starship.modules,
          player: { hull: starship.hull.current, maxHull: starship.hull.max, shields: playerStartShields },
          enemy: { hull: enemyData.hull, maxHull: enemyData.hull, shields: Math.min(8, enemyStartShields) },
          turn: playerFirst ? 'player' : 'enemy',
          phase: 'active',
          log: [
            { text: `⚔ Combat spatial : ${enemyData.name} (Hull ${enemyData.hull}, Classe ${enemyData.class})`, type: 'system' },
            { text: `Initiative d6 [vous: ${playerInit}, ennemi: ${enemyInit}] — ${playerFirst ? 'vous agissez en premier' : "l'ennemi agit en premier"}.`, type: 'system' },
          ],
          round: 1,
          actionDice: [],
          usedDiceIndices: [],
          playerDoubleNext: false,
          playerExtraDmg: 0,
          playerApolloUsed: false,
          playerDeltaUsed: false,
          expReward: enemyData.exp,
        }
        set({ shipCombat: sc })
        if (!playerFirst) setTimeout(() => get().enemyShipAct(), 800)
      },

      rollShipDice: () => {
        const { shipCombat } = get()
        if (!shipCombat || shipCombat.turn !== 'player' || shipCombat.phase !== 'active') return
        if (shipCombat.actionDice.length > 0) return

        const config = getEngineConfig(shipCombat.playerModules)
        let count = config.diceCount
        if (shipCombat.round === 1 && config.firstTurnBonus > 0) count += config.firstTurnBonus
        if (shipCombat.player.hull <= 10 && shipCombat.playerModules.some((n) => findModule(n)?.id === 'eclipse-bridge')) count += 1

        set({ shipCombat: { ...shipCombat, actionDice: rollDice(count), usedDiceIndices: [] } })
      },

      activateShipModule: (moduleName, dieIndex) => {
        const { shipCombat } = get()
        if (!shipCombat || shipCombat.phase !== 'active' || shipCombat.turn !== 'player') return
        if (shipCombat.usedDiceIndices.includes(dieIndex)) return
        const die = shipCombat.actionDice[dieIndex]
        if (die === undefined) return
        const mod = findModule(moduleName)
        if (!mod || !canActivate(die, mod.activationRoll)) return

        const ctx: BattleCtx = { doubleNextAttack: shipCombat.playerDoubleNext, extraDamage: shipCombat.playerExtraDmg }
        const result = resolveModuleActivation(moduleName, die, shipCombat.player, shipCombat.enemy, ctx)

        let newPlayer = result.newOwner
        let newEnemy = result.newTarget
        const newUsed = [...shipCombat.usedDiceIndices, dieIndex]
        let logs = [...shipCombat.log, { text: `[d${die}] ${result.log}`, type: 'attack' as const }]

        // orion-command: +1 hull per shield gained
        const shieldsGained = newPlayer.shields - shipCombat.player.shields
        if (shieldsGained > 0 && shipCombat.playerModules.some((n) => findModule(n)?.id === 'orion-command')) {
          const healed = Math.min(shieldsGained, newPlayer.maxHull - newPlayer.hull)
          if (healed > 0) {
            newPlayer = { ...newPlayer, hull: newPlayer.hull + healed }
            logs = [...logs, { text: `Orion Command — +${healed} Hull.`, type: 'system' as const }]
          }
        }

        // apollo-cockpit: first time entering critical, +2 shields
        let playerApolloUsed = shipCombat.playerApolloUsed
        if (!playerApolloUsed && newPlayer.hull > 0 && newPlayer.hull <= 10) {
          if (shipCombat.playerModules.some((n) => findModule(n)?.id === 'apollo-cockpit')) {
            newPlayer = { ...newPlayer, shields: Math.min(8, newPlayer.shields + 2) }
            logs = [...logs, { text: `Apollo Cockpit — Condition critique ! +2 Shields.`, type: 'system' as const }]
            playerApolloUsed = true
          }
        }

        logs = logs.slice(-30)

        if (newEnemy.hull <= 0) {
          set({
            shipCombat: {
              ...shipCombat, player: newPlayer, enemy: newEnemy, phase: 'victory',
              usedDiceIndices: newUsed, playerDoubleNext: result.newCtx.doubleNextAttack,
              playerExtraDmg: result.newCtx.extraDamage, playerApolloUsed,
              log: [...logs, { text: `✓ ${shipCombat.enemyShipName} détruit ! +${shipCombat.expReward} EXP.`, type: 'victory' as const }],
            }
          })
          return
        }

        const allUsed = newUsed.length >= shipCombat.actionDice.length
        set({
          shipCombat: {
            ...shipCombat, player: newPlayer, enemy: newEnemy,
            usedDiceIndices: newUsed, playerDoubleNext: result.newCtx.doubleNextAttack,
            playerExtraDmg: result.newCtx.extraDamage, playerApolloUsed, log: logs,
          }
        })
        if (allUsed) setTimeout(() => get().enemyShipAct(), 600)
      },

      endPlayerShipTurn: () => {
        const { shipCombat } = get()
        if (!shipCombat || shipCombat.phase !== 'active' || shipCombat.turn !== 'player') return
        const unused = shipCombat.actionDice.length - shipCombat.usedDiceIndices.length
        const log = unused > 0
          ? [...shipCombat.log, { text: `Fin du tour (${unused} dé(s) ignoré(s)).`, type: 'system' as const }].slice(-30)
          : shipCombat.log
        set({ shipCombat: { ...shipCombat, log } })
        setTimeout(() => get().enemyShipAct(), 400)
      },

      enemyShipAct: () => {
        const { shipCombat } = get()
        if (!shipCombat || shipCombat.phase !== 'active') return

        const { newPlayer, newEnemy, logs } = resolveEnemyShipTurn(
          shipCombat.enemyModules,
          shipCombat.player,
          shipCombat.enemy,
          shipCombat.round,
        )

        let curPlayer = newPlayer
        const combatLogs: StarshipCombatState['log'] = logs.map((t) => ({ text: t, type: 'enemy' as const }))

        // delta-cargo-bridge: survive first destruction
        let playerDeltaUsed = shipCombat.playerDeltaUsed
        if (curPlayer.hull <= 0 && !playerDeltaUsed && shipCombat.playerModules.some((n) => findModule(n)?.id === 'delta-cargo-bridge')) {
          curPlayer = { ...curPlayer, hull: 10, shields: Math.min(8, curPlayer.shields + 1) }
          combatLogs.push({ text: `Delta Cargo Bridge — Destruction évitée ! Hull 10, +1 Shield.`, type: 'system' })
          playerDeltaUsed = true
        }

        // apollo-cockpit trigger from enemy attack
        let playerApolloUsed = shipCombat.playerApolloUsed
        if (!playerApolloUsed && curPlayer.hull > 0 && curPlayer.hull <= 10) {
          if (shipCombat.playerModules.some((n) => findModule(n)?.id === 'apollo-cockpit')) {
            curPlayer = { ...curPlayer, shields: Math.min(8, curPlayer.shields + 2) }
            combatLogs.push({ text: `Apollo Cockpit — Condition critique ! +2 Shields.`, type: 'system' })
            playerApolloUsed = true
          }
        }

        const allLogs = [...shipCombat.log, ...combatLogs].slice(-30)

        if (curPlayer.hull <= 0) {
          set({
            shipCombat: {
              ...shipCombat, player: curPlayer, enemy: newEnemy, phase: 'defeat',
              playerDeltaUsed, playerApolloUsed,
              log: [...allLogs, { text: `✗ Votre vaisseau est détruit !`, type: 'defeat' as const }],
            }
          })
          return
        }

        set({
          shipCombat: {
            ...shipCombat, player: curPlayer, enemy: newEnemy,
            turn: 'player', round: shipCombat.round + 1,
            actionDice: [], usedDiceIndices: [],
            playerDeltaUsed, playerApolloUsed, log: allLogs,
          }
        })
      },

      escapeStarship: () =>
        set((s) => {
          if (!s.shipCombat) return s
          return {
            shipCombat: {
              ...s.shipCombat, phase: 'escaped',
              log: [...s.shipCombat.log, { text: `Fuite spatiale réussie.`, type: 'system' as const }].slice(-30),
            }
          }
        }),

      endStarshipCombat: () => {
        const { shipCombat, starship, character } = get()
        if (!shipCombat || !starship || !character) return
        const updatedStarship = {
          ...starship,
          hull: { ...starship.hull, current: Math.max(0, shipCombat.player.hull) },
          shields: shipCombat.player.shields,
        }
        const updatedChar = shipCombat.phase === 'victory'
          ? { ...character, resources: { ...character.resources, exp: character.resources.exp + shipCombat.expReward } }
          : character
        set({ shipCombat: null, starship: updatedStarship, character: updatedChar })
      },

      // ── SETTLEMENT ───────────────────────────────────────────────────────────

      enterSettlement: () => {
        const { character, starship } = get()
        if (!character || !starship) return
        // Roll d10 for controlling faction
        const roll = Math.ceil(Math.random() * 10)
        const factionTable = [
          { range: [1, 2], id: 'corsair', name: 'Corsair Syndicate' },
          { range: [3, 4], id: 'warg', name: 'W.A.R.G.' },
          { range: [5, 6], id: 'medusa', name: 'Medusa Sector' },
          { range: [7, 8], id: 'isf', name: 'Intersolar Federation' },
          { range: [9, 10], id: 'synth-arch', name: 'Synth Arch' },
        ]
        const entry = factionTable.find((f) => roll >= f.range[0] && roll <= f.range[1])!
        // Full heal Hull + Health on entry
        const updatedStarship = { ...starship, hull: { ...starship.hull, current: starship.hull.max } }
        const updatedChar = { ...character, health: { ...character.health, current: character.health.max } }
        const settlement: SettlementState = {
          factionId: entry.id,
          factionName: entry.name,
          activitiesUsed: [],
          cybersphere: null,
          lastNpc: null,
          testFlightResult: null,
        }
        set({ settlement, starship: updatedStarship, character: updatedChar })
      },

      exitSettlement: () => set({ settlement: null }),

      refuelShip: (units) =>
        set((s) => {
          if (!s.character || !s.starship) return s
          const cost = units * 3
          if (s.character.resources.serum < cost) return s
          const newFuel = Math.min(s.starship.fuel.max, s.starship.fuel.current + units)
          return {
            starship: { ...s.starship, fuel: { ...s.starship.fuel, current: newFuel } },
            character: { ...s.character, resources: { ...s.character.resources, serum: s.character.resources.serum - cost } },
          }
        }),

      buyItem: (itemId) =>
        set((s) => {
          if (!s.character) return s
          const item = (itemsData.items as any[]).find((i) => i.id === itemId)
          if (!item || item.cost == null) return s
          if (s.character.resources.serum < item.cost) return s
          const emptySlot = s.character.inventory.findIndex((slot) => slot === null)
          if (emptySlot === -1) return s
          const inventory = [...s.character.inventory]
          inventory[emptySlot] = item.name
          return {
            character: {
              ...s.character,
              inventory,
              resources: { ...s.character.resources, serum: s.character.resources.serum - item.cost },
            },
          }
        }),

      craftItem: (itemId) =>
        set((s) => {
          if (!s.character) return s
          const item = (itemsData.items as any[]).find((i) => i.id === itemId)
          if (!item || item.cost == null) return s
          const scrapCost = item.cost
          if (s.character.resources.scraps < scrapCost) return s
          const emptySlot = s.character.inventory.findIndex((slot) => slot === null)
          if (emptySlot === -1) return s
          const inventory = [...s.character.inventory]
          inventory[emptySlot] = item.name
          return {
            character: {
              ...s.character,
              inventory,
              resources: { ...s.character.resources, scraps: s.character.resources.scraps - scrapCost },
            },
          }
        }),

      dismantleSlot: (index) =>
        set((s) => {
          if (!s.character) return s
          const slotValue = s.character.inventory[index]
          if (!slotValue) return s
          const item = (itemsData.items as any[]).find((i) => i.name === slotValue)
          const scrapGain = item?.cost != null ? Math.ceil(item.cost / 2) : 10
          const inventory = [...s.character.inventory]
          inventory[index] = null
          return {
            character: {
              ...s.character,
              inventory,
              resources: { ...s.character.resources, scraps: s.character.resources.scraps + scrapGain },
            },
          }
        }),

      useTestFlight: (type) =>
        set((s) => {
          if (!s.character || !s.settlement) return s
          if (s.character.resources.serum < 3) return s
          if (s.settlement.activitiesUsed.includes('test-flight')) return s
          const statValue = s.character.stats.grace
          const roll = Math.ceil(Math.random() * 10)
          const total = roll + statValue
          const success = total >= 6
          const effects = {
            race: 'Votre vaisseau se déplace 1 tuile supplémentaire pour les 2 prochaines batailles.',
            drill: '+1 Dé d\'Action par tour lors de votre prochaine bataille spatiale.',
          }
          const result = { type, roll: total, success, effect: success ? effects[type] : 'Échec — aucun bonus.' }
          return {
            character: { ...s.character, resources: { ...s.character.resources, serum: s.character.resources.serum - 3 } },
            settlement: {
              ...s.settlement,
              activitiesUsed: [...s.settlement.activitiesUsed, 'test-flight'],
              testFlightResult: result,
            },
          }
        }),

      startCybersphere: () =>
        set((s) => {
          if (!s.character || !s.settlement) return s
          if (s.character.hyperdrive.current < 5) return s
          if (s.settlement.activitiesUsed.includes('cybersphere')) return s
          const tiles = generateNetwork()
          const cyber = {
            tiles,
            position: 0,
            memoryClock: 0,
            matrixNodesReached: 0,
            log: [{ text: 'Connexion au réseau Cybersphere établie. Mémoire : 12 mouvements.', type: 'system' as const }],
            phase: 'active' as const,
            pendingReward: false,
          }
          return {
            character: { ...s.character, hyperdrive: { ...s.character.hyperdrive, current: s.character.hyperdrive.current - 5 } },
            settlement: {
              ...s.settlement,
              activitiesUsed: [...s.settlement.activitiesUsed, 'cybersphere'],
              cybersphere: cyber,
            },
          }
        }),

      cybersphereAdvance: () =>
        set((s) => {
          if (!s.character || !s.settlement?.cybersphere) return s
          const cyber = s.settlement.cybersphere
          if (cyber.phase !== 'active') return s
          const nextPos = cyber.position + 1
          if (nextPos >= cyber.tiles.length) return s
          const tileType = cyber.tiles[nextPos]
          const roll = rollD66()
          const encounterText = getEncounter(roll)
          const clockDelta = extractClockDelta(encounterText)
          let newClock = Math.max(0, cyber.memoryClock + 1 + clockDelta)
          const logs = [
            ...cyber.log,
            { text: `[Tuile ${nextPos}/9 — ${tileType}] d66=${roll} : ${encounterText}`, type: 'encounter' as const },
          ]
          const pendingReward = tileType === 'matrix-node'
          if (tileType === 'matrix-node') {
            logs.push({ text: `✦ Nœud matriciel atteint ! Collectez votre récompense.`, type: 'system' as const })
          }
          if (newClock >= 12) {
            const scarRoll = Math.ceil(Math.random() * 6)
            logs.push({ text: `⚠ MÉMOIRE SATURÉE (${newClock}/12) — Abyssal Scar d6=${scarRoll}. Déconnexion forcée.`, type: 'warning' as const })
            return {
              settlement: {
                ...s.settlement,
                cybersphere: { ...cyber, position: nextPos, memoryClock: 12, log: logs, phase: 'abyssal', pendingReward },
              },
            }
          }
          return {
            settlement: {
              ...s.settlement,
              cybersphere: { ...cyber, position: nextPos, memoryClock: newClock, log: logs, pendingReward },
            },
          }
        }),

      cybersphereCollectReward: () =>
        set((s) => {
          if (!s.settlement?.cybersphere) return s
          const cyber = s.settlement.cybersphere
          if (!cyber.pendingReward || cyber.phase !== 'active') return s
          const roll = rollD66()
          const rewardText = getReward(roll)
          const clockDelta = extractClockDelta(rewardText)
          const newClock = Math.max(0, cyber.memoryClock + clockDelta)
          const logs = [
            ...cyber.log,
            { text: `★ Récompense Nœud — d66=${roll} : ${rewardText}`, type: 'reward' as const },
          ]
          if (newClock >= 12) {
            logs.push({ text: `⚠ MÉMOIRE SATURÉE après récompense — Abyssal Scar. Déconnexion forcée.`, type: 'warning' as const })
            return {
              settlement: {
                ...s.settlement,
                cybersphere: { ...cyber, memoryClock: 12, matrixNodesReached: cyber.matrixNodesReached + 1, log: logs, phase: 'abyssal', pendingReward: false },
              },
            }
          }
          return {
            settlement: {
              ...s.settlement,
              cybersphere: { ...cyber, memoryClock: newClock, matrixNodesReached: cyber.matrixNodesReached + 1, log: logs, pendingReward: false },
            },
          }
        }),

      exitCybersphere: () =>
        set((s) => {
          if (!s.settlement?.cybersphere) return s
          const cyber = s.settlement.cybersphere
          const logs = [...cyber.log, { text: `Déconnexion. Nœuds collectés : ${cyber.matrixNodesReached}/3. Mémoire utilisée : ${cyber.memoryClock}/12.`, type: 'system' as const }]
          return {
            settlement: {
              ...s.settlement,
              cybersphere: { ...cyber, phase: 'escaped', log: logs },
            },
          }
        }),

      // ── FACTIONS ─────────────────────────────────────────────────────────────

      joinFaction: (factionId) =>
        set((s) => {
          if (!s.character) return s
          return {
            character: {
              ...s.character,
              joinedFactionId: factionId,
              currentMission: null,
              resources: { ...s.character.resources, favor: 0 },
            },
          }
        }),

      leaveFaction: () =>
        set((s) => {
          if (!s.character) return s
          return {
            character: {
              ...s.character,
              joinedFactionId: null,
              currentMission: null,
              resources: { ...s.character.resources, favor: 0 },
            },
          }
        }),

      gainFavor: (delta) =>
        set((s) => {
          if (!s.character) return s
          const newFavor = s.character.resources.favor + delta
          if (newFavor < 0) {
            return {
              character: {
                ...s.character,
                joinedFactionId: null,
                currentMission: null,
                resources: { ...s.character.resources, favor: 0 },
              },
            }
          }
          return {
            character: {
              ...s.character,
              resources: { ...s.character.resources, favor: Math.min(10, newFavor) },
            },
          }
        }),

      generateFactionMission: () =>
        set((s) => {
          if (!s.character) return s
          const factionId = s.character.joinedFactionId ?? null
          if (!factionId) return s
          if (s.character.currentMission?.status === 'active') return s
          const roll = Math.ceil(Math.random() * 10)
          const roll2 = Math.ceil(Math.random() * 10)
          const mKey = factionId === 'synth-arch' ? 'synthArch' : factionId
          const mData = (missionsData as any)[mKey]
          if (!mData) return s
          let objectiveText = ''
          let locationText = ''
          let complicationText: string | null = null
          let rewardText: string | null = null
          const pickByRoll = (arr: any[], r: number) =>
            arr.find((e: any) => e.roll === r) ?? arr[0]
          if (factionId === 'warg') {
            const obj = pickByRoll(mData.objectives, roll)
            objectiveText = obj.objective
            locationText = obj.location
          } else if (factionId === 'isf') {
            const cargo = pickByRoll(mData.cargo, roll)
            const compl = pickByRoll(mData.complications, roll2)
            objectiveText = `Transporter : ${cargo.cargo}`
            locationText = cargo.destination
            complicationText = compl.complication
            rewardText = compl.reward
          } else if (factionId === 'medusa') {
            const obj = pickByRoll(mData.data, roll)
            const compl = pickByRoll(mData.complications, roll2)
            objectiveText = obj.objective
            locationText = obj.location
            complicationText = compl.complication
            rewardText = compl.reward
          } else if (factionId === 'corsair') {
            const target = pickByRoll(mData.target, roll)
            const compl = pickByRoll(mData.complications, roll2)
            objectiveText = `Cible : ${target.target}`
            locationText = target.location
            complicationText = compl.complication
            rewardText = compl.reward
          } else if (factionId === 'synth-arch') {
            const goal = pickByRoll(mData.goal, roll)
            const compl = pickByRoll(mData.complications, roll2)
            objectiveText = goal.goal
            locationText = goal.location
            complicationText = compl.complication
            rewardText = compl.reward
          }
          const mission: FactionMission = { factionId, objectiveText, locationText, complicationText, rewardText, status: 'active' }
          return { character: { ...s.character, currentMission: mission } }
        }),

      completeFactionMission: () =>
        set((s) => {
          if (!s.character?.currentMission || s.character.currentMission.status !== 'active') return s
          const newFavor = Math.min(10, s.character.resources.favor + 1)
          const newExp = s.character.resources.exp + 3
          return {
            character: {
              ...s.character,
              currentMission: { ...s.character.currentMission, status: 'completed' },
              resources: { ...s.character.resources, favor: newFavor, exp: newExp },
            },
          }
        }),

      failFactionMission: () => {
        const { character } = get()
        if (!character?.currentMission || character.currentMission.status !== 'active') return
        const newFavor = character.resources.favor - 1
        if (newFavor < 0) {
          set({
            character: {
              ...character,
              joinedFactionId: null,
              currentMission: null,
              resources: { ...character.resources, favor: 0 },
            },
          })
          return
        }
        set((s) => {
          if (!s.character?.currentMission) return s
          return {
            character: {
              ...s.character,
              currentMission: { ...s.character.currentMission, status: 'failed' },
              resources: { ...s.character.resources, favor: newFavor },
            },
          }
        })
      },

      generateNpc: () =>
        set((s) => {
          if (!s.settlement) return s
          const pickValue = (table: any[], max: number) => {
            const roll = Math.ceil(Math.random() * max)
            const entry = table.find((e: any) => {
              const r = e.roll
              if (typeof r === 'string') {
                const parts = r.split('-').map(Number)
                return roll >= parts[0] && roll <= (parts[1] ?? parts[0])
              }
              return r === roll
            })
            return entry?.value ?? entry?.request ?? '—'
          }
          const npc: GeneratedNpc = {
            trade:            pickValue((npcsData as any).trade, 20),
            emotion:          pickValue((npcsData as any).emotion, 20),
            look:             pickValue((npcsData as any).look, 20),
            style:            pickValue((npcsData as any).style, 6),
            reaction:         pickValue((npcsData as any).reaction, 12),
            faction:          pickValue((npcsData as any).faction, 6),
            goal:             pickValue((npcsData as any).goal, 10),
            apocalypseTheory: pickValue((npcsData as any).apocalypseTheory, 10),
            requests:         pickValue((npcsData as any).requests, 100),
          }
          return { settlement: { ...s.settlement, lastNpc: npc } }
        }),

      // ── CREW & CONNECTIONS ──────────────────────────────────────────────────

      recruitCrew: (crew, costSerum = 0) =>
        set((s) => {
          if (!s.character) return s
          const current = s.character.crewmembers ?? []
          if (current.length >= 4) return s
          if (costSerum > 0 && s.character.resources.serum < costSerum) return s
          const resources = costSerum > 0
            ? { ...s.character.resources, serum: s.character.resources.serum - costSerum }
            : s.character.resources
          return { character: { ...s.character, crewmembers: [...current, crew], resources } }
        }),

      dismissCrew: (index) =>
        set((s) => {
          if (!s.character) return s
          const crewmembers = (s.character.crewmembers ?? []).filter((_, i) => i !== index)
          return { character: { ...s.character, crewmembers } }
        }),

      updateCrewHp: (index, current) =>
        set((s) => {
          if (!s.character) return s
          const crewmembers = [...(s.character.crewmembers ?? [])]
          if (!crewmembers[index]) return s
          crewmembers[index] = { ...crewmembers[index], hp: { ...crewmembers[index].hp, current: Math.max(0, current) } }
          return { character: { ...s.character, crewmembers } }
        }),

      updateCrewStat: (crewIndex, stat, delta) =>
        set((s) => {
          if (!s.character) return s
          const crewmembers = [...(s.character.crewmembers ?? [])]
          if (!crewmembers[crewIndex]) return s
          const oldStats = crewmembers[crewIndex].stats
          crewmembers[crewIndex] = { ...crewmembers[crewIndex], stats: { ...oldStats, [stat]: Math.max(0, oldStats[stat] + delta) } }
          return { character: { ...s.character, crewmembers } }
        }),

      setCrewInventorySlot: (crewIndex, slotIndex, value) =>
        set((s) => {
          if (!s.character) return s
          const crewmembers = [...(s.character.crewmembers ?? [])]
          if (!crewmembers[crewIndex]) return s
          const inventory = [...crewmembers[crewIndex].inventory]
          inventory[slotIndex] = value
          crewmembers[crewIndex] = { ...crewmembers[crewIndex], inventory }
          return { character: { ...s.character, crewmembers } }
        }),

      addConnection: (conn) =>
        set((s) => {
          if (!s.character) return s
          const connections = [...(s.character.connections ?? []), conn]
          return { character: { ...s.character, connections } }
        }),

      removeConnection: (index) =>
        set((s) => {
          if (!s.character) return s
          const connections = (s.character.connections ?? []).filter((_, i) => i !== index)
          return { character: { ...s.character, connections } }
        }),

      updateConnectionAffinity: (index, delta) =>
        set((s) => {
          if (!s.character) return s
          const connections = [...(s.character.connections ?? [])]
          if (!connections[index]) return s
          connections[index] = { ...connections[index], affinity: Math.max(0, Math.min(5, connections[index].affinity + delta)) }
          return { character: { ...s.character, connections } }
        }),
    }),
    { name: 'astroprisma-save' }
  )
)
