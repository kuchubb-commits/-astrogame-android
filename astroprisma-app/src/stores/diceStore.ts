import { create } from 'zustand'

export type RollType =
  | 'initiative'
  | 'challenge'
  | 'challenge-xx'
  | 'escape'
  | 'hack'
  | 'exploration'
  | 'malware'
  | 'oracle-yesno'
  | 'oracle-open'

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

// ── Dice primitives ───────────────────────────────────────────────────────────

export const d6 = () => Math.floor(Math.random() * 6) + 1
export const d10 = () => Math.floor(Math.random() * 10) + 1

// ── Initiative: d10 + GRA (joueur) vs d10 + difficulty (ennemi) ──────────────
export function initiativeRoll(gra: number, enemyDifficulty?: number) {
  const playerDie = d10()
  const playerTotal = playerDie + gra
  if (enemyDifficulty == null) {
    return { playerDie, gra, playerTotal, enemyDie: null, enemyTotal: null, playerFirst: null }
  }
  const enemyDie = d10()
  const enemyTotal = enemyDie + enemyDifficulty
  return { playerDie, gra, playerTotal, enemyDie, enemyDifficulty, enemyTotal, playerFirst: playerTotal >= enemyTotal }
}

// ── Challenge Roll: Player d10+stat vs Challenge d10+opponentStat ─────────────
export function challengeRoll(playerStat: number, challengeStat: number) {
  const playerDie = d10()
  const challengeDie = d10()
  const playerTotal = playerDie + playerStat
  const challengeTotal = challengeDie + challengeStat
  return { playerDie, challengeDie, playerTotal, challengeTotal, success: playerTotal > challengeTotal }
}

// ── xxROLL: Player d10+stat vs TWO d10s (keep highest) + opponentStat ─────────
export function xxChallengeRoll(playerStat: number, challengeStat: number) {
  const playerDie = d10()
  const cd1 = d10()
  const cd2 = d10()
  const challengeDie = Math.max(cd1, cd2)
  const playerTotal = playerDie + playerStat
  const challengeTotal = challengeDie + challengeStat
  return { playerDie, cd1, cd2, challengeDie, playerTotal, challengeTotal, success: playerTotal > challengeTotal }
}

// ── Malware: d10 ─────────────────────────────────────────────────────────────
export const MALWARE_TABLE = [
  'Rien',
  'Perd 1⚡ Énergie',
  'Prend 2 dégâts',
  'Perd 2⚡ Énergie',
  'STUNNED pendant 1 tour',
  'Prend 4 dégâts',
  'SHOCKED pendant 1 tour',
  'Perd 3⚡ Énergie',
  'SILENCED pendant 1 tour',
  'Apprend un HACK aléatoire',
]

export function malwareRoll() {
  const die = d10()
  return { die, result: MALWARE_TABLE[die - 1] }
}

// ── Oracle YES/NO: d6 ─────────────────────────────────────────────────────────
export const YES_NO_TABLE = [
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

// ── Oracle Open-Ended: 2d6 table 6×6 ────────────────────────────────────────
export const OPEN_TABLE: string[][] = [
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
  return { d1, d2, word: OPEN_TABLE[d1 - 1][d2 - 1] }
}
