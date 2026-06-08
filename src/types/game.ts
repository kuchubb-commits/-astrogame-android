export interface Character {
  name: string
  originId: string
  stats: { vigor: number; grace: number; mind: number; tech: number }
  health: { current: number; max: number }
  energy: { current: number; max: number }
  armor: { current: number; max: number }
  hyperdrive: { current: number; max: number }
  inventory: (string | null)[]
  weapons: (string | null)[]
  memorySlots: string[]
  resources: { exp: number; serum: number; scraps: number; favor: number }
}

export interface Starship {
  dataId: string
  customName: string
  hull: { current: number; max: number }
  fuel: { current: number; max: number }
  cargo: (string | null)[]
  modules: string[]
  shields: number
}

export type PlayTab = 'player' | 'starship'
