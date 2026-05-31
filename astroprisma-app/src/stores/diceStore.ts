import { create } from 'zustand'

export type RollType = 'challenge' | 'oracle-yesno' | 'oracle-open'

export interface DiceEntry {
  id: string
  type: RollType
  label: string
  result: string
  detail: string
  timestamp: number
}

interface DiceStore {
  history: DiceEntry[]
  addEntry: (entry: Omit<DiceEntry, 'id' | 'timestamp'>) => void
  clearHistory: () => void
}

export const useDiceStore = create<DiceStore>((set) => ({
  history: [],
  addEntry: (entry) =>
    set((s) => ({
      history: [
        { ...entry, id: crypto.randomUUID(), timestamp: Date.now() },
        ...s.history,
      ].slice(0, 50),
    })),
  clearHistory: () => set({ history: [] }),
}))

// ── Dice helpers ──────────────────────────────────────────────────────────────

export function d10() {
  return Math.floor(Math.random() * 10) + 1
}

export function d6() {
  return Math.floor(Math.random() * 6) + 1
}

// Challenge Roll: Player d10+stat vs Challenge d10+opponentStat
export function challengeRoll(playerStat: number, challengeStat: number) {
  const playerDie = d10()
  const challengeDie = d10()
  const playerTotal = playerDie + playerStat
  const challengeTotal = challengeDie + challengeStat
  const success = playerTotal > challengeTotal
  return { playerDie, challengeDie, playerTotal, challengeTotal, success }
}

// Oracle YES/NO (d6)
const YES_NO_TABLE = [
  'NO, AND…',
  'NO',
  'NO, BUT…',
  'YES, BUT…',
  'YES',
  'YES, AND…',
]

export function oracleYesNo() {
  const roll = d6()
  return { roll, result: YES_NO_TABLE[roll - 1] }
}

// Oracle Open-Ended (2d6 → table 6×6)
const OPEN_TABLE: string[][] = [
  ['Void', 'Treason', 'Chaos', 'Pain', 'Corruption', 'Oppression'],
  ['Suspicion', 'Regression', 'Collision', 'Desire', 'Vengeance', 'Occult'],
  ['Survival', 'Sacrifice', 'Conflict', 'Control', 'Electricity', 'Subversion'],
  ['Nurturing', 'Light', 'Noise', 'Healing', 'Velocity', 'Freedom'],
  ['Compromise', 'Prophecy', 'Evolution', 'Guidance', 'Growth', 'Nature'],
  ['Balance', 'Wealth', 'Change', 'Order', 'Truth', 'Time'],
]

export function oracleOpen() {
  const d1 = d6()
  const d2 = d6()
  const word = OPEN_TABLE[d1 - 1][d2 - 1]
  return { d1, d2, word }
}
