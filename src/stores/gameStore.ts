import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Character, Starship, PlayTab } from '../types/game'

interface GameState {
  character: Character | null
  starship: Starship | null
  activeTab: PlayTab

  startGame: (character: Character, starship: Starship) => void
  resetGame: () => void
  setTab: (tab: PlayTab) => void

  updateStat: (stat: keyof Character['stats'], delta: number) => void
  updateBar: (bar: 'health' | 'energy' | 'armor' | 'hyperdrive', current: number) => void
  updateBarMax: (bar: 'health' | 'energy' | 'armor' | 'hyperdrive', max: number) => void
  updateResource: (resource: keyof Character['resources'], delta: number) => void
  setInventorySlot: (index: number, value: string | null) => void
  setWeaponSlot: (index: number, value: string | null) => void
  setMemorySlot: (index: number, value: string) => void

  updateHull: (current: number) => void
  updateFuel: (current: number) => void
  updateShields: (delta: number) => void
  setCargoSlot: (index: number, value: string | null) => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      character: null,
      starship: null,
      activeTab: 'player',

      startGame: (character, starship) => set({ character, starship, activeTab: 'player' }),
      resetGame: () => set({ character: null, starship: null, activeTab: 'player' }),
      setTab: (tab) => set({ activeTab: tab }),

      updateStat: (stat, delta) =>
        set((s) => {
          if (!s.character) return s
          const current = s.character.stats[stat]
          return {
            character: {
              ...s.character,
              stats: { ...s.character.stats, [stat]: Math.max(0, current + delta) },
            },
          }
        }),

      updateBar: (bar, current) =>
        set((s) => {
          if (!s.character) return s
          return {
            character: {
              ...s.character,
              [bar]: { ...s.character[bar], current: Math.max(0, current) },
            },
          }
        }),

      updateBarMax: (bar, max) =>
        set((s) => {
          if (!s.character) return s
          return {
            character: {
              ...s.character,
              [bar]: { ...s.character[bar], max: Math.max(0, max) },
            },
          }
        }),

      updateResource: (resource, delta) =>
        set((s) => {
          if (!s.character) return s
          const current = s.character.resources[resource]
          return {
            character: {
              ...s.character,
              resources: { ...s.character.resources, [resource]: Math.max(0, current + delta) },
            },
          }
        }),

      setInventorySlot: (index, value) =>
        set((s) => {
          if (!s.character) return s
          const inv = [...s.character.inventory]
          inv[index] = value
          return { character: { ...s.character, inventory: inv } }
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
          const slots = [...s.character.memorySlots]
          slots[index] = value
          return { character: { ...s.character, memorySlots: slots } }
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
    }),
    { name: 'astroprisma-save' }
  )
)
