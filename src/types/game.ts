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
  joinedFactionId: string | null
  currentMission: FactionMission | null
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
  isSim?: boolean
  preSimHp?: number
  preSimEnergy?: number
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

export interface GeneratedNpc {
  trade: string
  emotion: string
  look: string
  style: string
  reaction: string
  faction: string
  goal: string
}

export interface CybersphereLogEntry {
  text: string
  type: 'encounter' | 'reward' | 'system' | 'warning'
}

export interface CybersphereState {
  tiles: ('access-port' | 'normal' | 'matrix-node')[]
  position: number
  memoryClock: number
  matrixNodesReached: number
  log: CybersphereLogEntry[]
  phase: 'active' | 'escaped' | 'abyssal'
  pendingReward: boolean
}

export interface SettlementState {
  factionId: string
  factionName: string
  activitiesUsed: string[]
  cybersphere: CybersphereState | null
  lastNpc: GeneratedNpc | null
  testFlightResult: { type: string; roll: number; success: boolean; effect: string } | null
}

export interface FactionMission {
  factionId: string
  objectiveText: string
  locationText: string
  complicationText: string | null
  rewardText: string | null
  status: 'active' | 'completed' | 'failed'
}

export interface StarshipCombatState {
  enemyShipId: string
  enemyShipName: string
  enemyModules: string[]
  playerModules: string[]
  player: { hull: number; maxHull: number; shields: number }
  enemy: { hull: number; maxHull: number; shields: number }
  turn: 'player' | 'enemy'
  phase: 'active' | 'victory' | 'defeat' | 'escaped'
  log: CombatLogEntry[]
  round: number
  actionDice: number[]
  usedDiceIndices: number[]
  playerDoubleNext: boolean
  playerExtraDmg: number
  playerApolloUsed: boolean
  playerDeltaUsed: boolean
  expReward: number
}
