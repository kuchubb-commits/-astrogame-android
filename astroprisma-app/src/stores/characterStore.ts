import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Origin = 'soldier' | 'pilot' | 'scientist' | 'outlaw' | 'diplomat' | 'engineer'
export type FactionKey = 'warg' | 'isf' | 'medusa' | 'corsair' | 'synth'
export type StatusKey = 'STUN' | 'BREACH' | 'SHOCK' | 'SILENCE' | 'IMMUNITY' | 'OVERHEAT'

export interface Weapon {
  name: string
  damage: string
  mods: [string, string]
}

export interface CrewMember {
  name: string
  role: string
  passive: string
  hp: number
  vig: number
  gra: number
  min: number
  tec: number
  inventory: [string, string, string, string]
  skills: [string, string, string]
}

export interface Connection {
  name: string
  location: string
  data: string
  favor: number
}

export interface Starship {
  name: string
  hull: number
  hullMax: number
  fuel: number
  fuelMax: number
  shields: number
  actionDice: number
  modules: {
    control: string
    engines: string
    open: [string, string, string, string]
  }
  cargo: [string, string, string, string, string, string]
}

export interface Character {
  // Identité
  name: string
  origin: Origin | null
  pronouns: string
  // Ressources principales
  health: number
  maxHealth: number
  energy: number
  maxEnergy: number
  armor: number
  exp: number
  hyperdrive: number
  serum: number
  // Stats
  vigor: number
  grace: number
  mind: number
  tech: number
  // Factions (favor)
  favor: Record<FactionKey, number>
  // Status conditions
  status: Record<StatusKey, boolean>
  // Cybertech (6 slots)
  cybertech: [string, string, string, string, string, string]
  // Memory slots (6, dont 3 verrouillés par défaut)
  memorySlots: [string, string, string, string, string, string]
  memorySlotsUnlocked: number
  // Armes
  weapons: [Weapon, Weapon]
  // Inventaire (8 slots)
  inventory: [string, string, string, string, string, string, string, string]
  // Enemy tracker
  enemyTracker: { health: string; armor: string; effects: string }
  // Notes
  notes: string
  // Vaisseau
  starship: Starship
  // Équipage (4 membres)
  crew: [CrewMember, CrewMember, CrewMember, CrewMember]
  // Connexions (7)
  connections: Connection[]
}

const defaultCrew = (): CrewMember => ({
  name: '', role: '', passive: '', hp: 20,
  vig: 0, gra: 0, min: 0, tec: 0,
  inventory: ['', '', '', ''],
  skills: ['', '', ''],
})

const defaultCharacter: Character = {
  name: 'Nouveau Personnage',
  origin: null,
  pronouns: '',
  health: 20, maxHealth: 20,
  energy: 20, maxEnergy: 20,
  armor: 0, exp: 0, hyperdrive: 0, serum: 0,
  vigor: 0, grace: 0, mind: 0, tech: 0,
  favor: { warg: 0, isf: 0, medusa: 0, corsair: 0, synth: 0 },
  status: { STUN: false, BREACH: false, SHOCK: false, SILENCE: false, IMMUNITY: false, OVERHEAT: false },
  cybertech: ['', '', '', '', '', ''],
  memorySlots: ['', '', '', '', '', ''],
  memorySlotsUnlocked: 3,
  weapons: [
    { name: '', damage: '', mods: ['', ''] },
    { name: '', damage: '', mods: ['', ''] },
  ],
  inventory: ['', '', '', '', '', '', '', ''],
  enemyTracker: { health: '', armor: '', effects: '' },
  notes: '',
  starship: {
    name: '', hull: 20, hullMax: 20, fuel: 20, fuelMax: 20,
    shields: 0, actionDice: 2,
    modules: { control: '', engines: '', open: ['', '', '', ''] },
    cargo: ['', '', '', '', '', ''],
  },
  crew: [defaultCrew(), defaultCrew(), defaultCrew(), defaultCrew()],
  connections: Array.from({ length: 7 }, () => ({ name: '', location: '', data: '', favor: 0 })),
}

interface CharacterStore {
  character: Character
  patch: (fn: (c: Character) => void) => void
  resetCharacter: () => void
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set) => ({
      character: defaultCharacter,
      patch: (fn) =>
        set((s) => {
          const next = structuredClone(s.character)
          fn(next)
          return { character: next }
        }),
      resetCharacter: () => set({ character: structuredClone(defaultCharacter) }),
    }),
    { name: 'astroprisma-character-v2' }
  )
)
