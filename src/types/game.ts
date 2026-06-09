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
  installedCybertech: string[]
  deployedDroneId: string | null
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

export interface HexState {
  id: string
  ring: 'inner' | 'middle' | 'outer'
  explored: boolean
  discoveryType: string | null
  discoveryText: string | null
  hexColor: string | null
}

export interface CycleEntry {
  id: number
  hexId: string
  type: string
  text: string
}

export interface MapData {
  hexes: Record<string, HexState>
  playerHexId: string
  cycleLog: CycleEntry[]
  cycleCount: number
}

export interface ActiveStatus {
  id: string
  name: string
  turnsLeft: number | null
}

export interface CombatantState {
  hp: number
  maxHp: number
  armor: number
  baseArmor: number
  statuses: ActiveStatus[]
}

export interface CombatLogEntry {
  text: string
  type: 'attack' | 'enemy' | 'status' | 'system' | 'victory' | 'defeat'
}

export interface CombatState {
  enemyId: string
  enemyName: string
  enemyStats: { vigor: number; grace: number; mind: number; tech: number }
  enemy: CombatantState
  player: CombatantState
  turn: 'player' | 'enemy'
  phase: 'active' | 'victory' | 'defeat' | 'escaped'
  log: CombatLogEntry[]
  round: number
  expReward: number
}

export interface OracleEntry {
  id: number
  question: string
  result: string
  keyword: string
  isYes: boolean
  narration: string | null
}

export type PlayTab = 'player' | 'map' | 'oracle' | 'arsenal' | 'starship'
