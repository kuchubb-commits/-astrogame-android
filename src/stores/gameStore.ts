import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, Starship, PlayTab, MapData, HexState, CycleEntry } from '../types/game'
import { ALL_HEXES, STARTING_HEX } from '../engine/hexMap'
import type { ExploreResult } from '../engine/exploration'

function initMapData(): MapData {
  const hexes: Record<string, HexState> = {}
  for (const h of ALL_HEXES) {
    hexes[h.id] = {
      id: h.id,
      ring: h.ring,
      explored: false,
      discoveryType: null,
      discoveryText: null,
      hexColor: null,
    }
  }
  return {
    hexes,
    playerHexId: STARTING_HEX,
    cycleLog: [],
    cycleCount: 0,
  }
}

interface GameState {
  character: Character | null
  starship: Starship | null
  mapData: MapData | null
  activeTab: PlayTab

  startGame: (character: Character, starship: Starship) => void
  ensureMap: () => void
  resetGame: () => void
  setTab: (tab: PlayTab) => void

  // Character actions
  updateStat: (stat: keyof Character['stats'], delta: number) => void
  updateBar: (bar: 'health' | 'energy' | 'armor' | 'hyperdrive', current: number) => void
  updateBarMax: (bar: 'health' | 'energy' | 'armor' | 'hyperdrive', max: number) => void
  updateResource: (resource: keyof Character['resources'], delta: number) => void
  setInventorySlot: (index: number, value: string | null) => void
  setWeaponSlot: (index: number, value: string | null) => void
  setMemorySlot: (index: number, value: string) => void

  // Starship actions
  updateHull: (current: number) => void
  updateFuel: (current: number) => void
  updateShields: (delta: number) => void
  setCargoSlot: (index: number, value: string | null) => void

  // Map actions
  movePlayer: (hexId: string) => void
  exploreCurrentHex: (result: ExploreResult) => void
  addLogEntry: (entry: Omit<CycleEntry, 'id'>) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: null,
      starship: null,
      mapData: null,
      activeTab: 'player',

      startGame: (character, starship) =>
        set({ character, starship, mapData: initMapData(), activeTab: 'player' }),

      ensureMap: () =>
        set((s) => s.mapData ? s : { mapData: initMapData() }),

      resetGame: () => set({ character: null, starship: null, mapData: null, activeTab: 'player' }),

      setTab: (tab) => set({ activeTab: tab }),

      updateStat: (stat, delta) =>
        set((s) => {
          if (!s.character) return s
          return {
            character: {
              ...s.character,
              stats: { ...s.character.stats, [stat]: Math.max(0, s.character.stats[stat] + delta) },
            },
          }
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
          return {
            character: {
              ...s.character,
              resources: {
                ...s.character.resources,
                [resource]: Math.max(0, s.character.resources[resource] + delta),
              },
            },
          }
        }),

      setInventorySlot: (index, value) =>
        set((s) => {
          if (!s.character) return s
          const inventory = [...s.character.inventory]
          inventory[index] = value
          return { character: { ...s.character, inventory } }
        }),

      setWeaponSlot: (index, value) =>
        set((s) => {
          if (!s.character) return s
          const weapons = [...s.character.weapons]
          weapons[index] = value
          return { character: { ...s.character, weapons } }
        }),

      setMemorySlot: (index, value) =>
        set((s) => {
          if (!s.character) return s
          const memorySlots = [...s.character.memorySlots]
          memorySlots[index] = value
          return { character: { ...s.character, memorySlots } }
        }),

      updateHull: (current) =>
        set((s) => {
          if (!s.starship) return s
          return { starship: { ...s.starship, hull: { ...s.starship.hull, current: Math.max(0, current) } } }
        }),

      updateFuel: (current) =>
        set((s) => {
          if (!s.starship) return s
          return { starship: { ...s.starship, fuel: { ...s.starship.fuel, current: Math.max(0, current) } } }
        }),

      updateShields: (delta) =>
        set((s) => {
          if (!s.starship) return s
          return { starship: { ...s.starship, shields: Math.max(0, s.starship.shields + delta) } }
        }),

      setCargoSlot: (index, value) =>
        set((s) => {
          if (!s.starship) return s
          const cargo = [...s.starship.cargo]
          cargo[index] = value
          return { starship: { ...s.starship, cargo } }
        }),

      movePlayer: (hexId) =>
        set((s) => {
          if (!s.mapData || !s.starship) return s
          const newFuel = Math.max(0, s.starship.fuel.current - 1)
          return {
            starship: { ...s.starship, fuel: { ...s.starship.fuel, current: newFuel } },
            mapData: {
              ...s.mapData,
              playerHexId: hexId,
              cycleCount: s.mapData.cycleCount + 1,
            },
          }
        }),

      exploreCurrentHex: (result) =>
        set((s) => {
          if (!s.mapData) return s
          const hexId = s.mapData.playerHexId
          const hexes = { ...s.mapData.hexes }
          hexes[hexId] = {
            ...hexes[hexId],
            explored: true,
            discoveryType: result.type,
            discoveryText: result.text,
            hexColor: result.hexColor,
          }
          const newEntry: CycleEntry = {
            id: Date.now(),
            hexId,
            type: result.type,
            text: `[${hexId}] d6=${result.roll} → ${result.type}: ${result.text}`,
          }
          return {
            mapData: {
              ...s.mapData,
              hexes,
              cycleLog: [newEntry, ...s.mapData.cycleLog].slice(0, 50),
            },
          }
        }),

      addLogEntry: (entry) =>
        set((s) => {
          if (!s.mapData) return s
          const newEntry: CycleEntry = { ...entry, id: Date.now() }
          return {
            mapData: {
              ...s.mapData,
              cycleLog: [newEntry, ...s.mapData.cycleLog].slice(0, 50),
            },
          }
        }),
    }),
    { name: 'astroprisma-save' }
  )
)
