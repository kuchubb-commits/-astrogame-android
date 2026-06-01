import { create } from 'zustand'
import type { Enemy } from '../data/enemies'

export type CombatPhase = 'setup' | 'player-turn' | 'enemy-turn' | 'victory' | 'defeat' | 'escaped'

export type StatusKey = 'STUNNED' | 'BREACHED' | 'OVERHEATED' | 'INVULNERABLE' | 'HACKED' | 'CYBERTECH_DISABLED'

export interface StatusEffect {
  key: StatusKey
  turnsLeft: number
}

export interface LogEntry {
  id: string
  turn: number
  actor: 'player' | 'enemy' | 'system'
  text: string
}

interface CombatStore {
  phase: CombatPhase
  enemy: Enemy | null
  enemyHp: number
  enemyStatuses: StatusEffect[]
  playerStatuses: StatusEffect[]
  playerFirst: boolean
  turn: number
  log: LogEntry[]

  startCombat: (enemy: Enemy, playerFirst: boolean, initiativeDetail: string) => void
  addLog: (actor: LogEntry['actor'], text: string) => void
  damageEnemy: (amount: number) => void
  damagePlayer: (amount: number, store: { health: number; armor: number }) => number
  applyEnemyStatus: (key: StatusKey, turns: number) => void
  applyPlayerStatus: (key: StatusKey, turns: number) => void
  tickStatuses: () => void
  nextTurn: () => void
  endCombat: (result: 'victory' | 'defeat' | 'escaped') => void
  reset: () => void
}

const makeLog = (turn: number, actor: LogEntry['actor'], text: string): LogEntry => ({
  id: crypto.randomUUID(),
  turn,
  actor,
  text,
})

export const useCombatStore = create<CombatStore>((set, get) => ({
  phase: 'setup',
  enemy: null,
  enemyHp: 0,
  enemyStatuses: [],
  playerStatuses: [],
  playerFirst: true,
  turn: 1,
  log: [],

  startCombat: (enemy, playerFirst, initiativeDetail) => {
    set({
      phase: playerFirst ? 'player-turn' : 'enemy-turn',
      enemy,
      enemyHp: enemy.hp,
      enemyStatuses: [],
      playerStatuses: [],
      playerFirst,
      turn: 1,
      log: [
        makeLog(0, 'system', `⚔️ Combat contre ${enemy.name} !`),
        makeLog(0, 'system', initiativeDetail),
        makeLog(0, 'system', playerFirst ? '▶ Tu commences en premier.' : '▶ L\'ennemi commence en premier.'),
      ],
    })
  },

  addLog: (actor, text) => {
    const { turn, log } = get()
    set({ log: [...log, makeLog(turn, actor, text)] })
  },

  damageEnemy: (amount) => {
    const { enemyHp, log, turn, enemy } = get()
    const newHp = Math.max(0, enemyHp - amount)
    const entry = makeLog(turn, 'player', `💥 ${amount} dégâts à ${enemy?.name}. HP : ${newHp}/${enemy?.hp}`)
    if (newHp === 0) {
      set({ enemyHp: 0, log: [...log, entry], phase: 'victory' })
    } else {
      set({ enemyHp: newHp, log: [...log, entry] })
    }
  },

  damagePlayer: (amount, charState) => {
    // Retourne les dégâts nets après armor (appelant applique au characterStore)
    const { playerStatuses, log, turn } = get()
    const isInvulnerable = playerStatuses.some(s => s.key === 'INVULNERABLE')
    if (isInvulnerable) {
      const entry = makeLog(turn, 'system', '🛡 INVULNÉRABLE — aucun dégât.')
      set({ log: [...log, entry] })
      return 0
    }
    const net = Math.max(0, amount - charState.armor)
    const entry = makeLog(turn, 'enemy', `💢 ${amount} dégâts (−${charState.armor} armure) = ${net} dégâts nets.`)
    const newHp = charState.health - net
    if (newHp <= 0) {
      set({ log: [...log, entry], phase: 'defeat' })
    } else {
      set({ log: [...log, entry] })
    }
    return net
  },

  applyEnemyStatus: (key, turns) => {
    const { enemyStatuses, log, turn } = get()
    const existing = enemyStatuses.find(s => s.key === key)
    let next: StatusEffect[]
    if (existing) {
      next = enemyStatuses.map(s => s.key === key ? { ...s, turnsLeft: s.turnsLeft + turns } : s)
    } else {
      next = [...enemyStatuses, { key, turnsLeft: turns }]
    }
    set({ enemyStatuses: next, log: [...log, makeLog(turn, 'system', `🔴 Ennemi : ${key} (${turns} tours)`)] })
  },

  applyPlayerStatus: (key, turns) => {
    const { playerStatuses, log, turn } = get()
    const existing = playerStatuses.find(s => s.key === key)
    let next: StatusEffect[]
    if (existing) {
      next = playerStatuses.map(s => s.key === key ? { ...s, turnsLeft: s.turnsLeft + turns } : s)
    } else {
      next = [...playerStatuses, { key, turnsLeft: turns }]
    }
    set({ playerStatuses: next, log: [...log, makeLog(turn, 'system', `🔵 Toi : ${key} (${turns} tours)`)] })
  },

  tickStatuses: () => {
    const { enemyStatuses, playerStatuses } = get()
    const tick = (list: StatusEffect[]) =>
      list.map(s => ({ ...s, turnsLeft: s.turnsLeft - 1 })).filter(s => s.turnsLeft > 0)
    set({ enemyStatuses: tick(enemyStatuses), playerStatuses: tick(playerStatuses) })
  },

  nextTurn: () => {
    const { phase, turn, playerFirst } = get()
    if (phase === 'player-turn') {
      set({ phase: 'enemy-turn' })
    } else if (phase === 'enemy-turn') {
      get().tickStatuses()
      const newTurn = turn + 1
      set({ phase: 'player-turn', turn: newTurn })
      get().addLog('system', `── Tour ${newTurn} ──`)
    }
  },

  endCombat: (result) => set({ phase: result }),

  reset: () => set({
    phase: 'setup',
    enemy: null,
    enemyHp: 0,
    enemyStatuses: [],
    playerStatuses: [],
    playerFirst: true,
    turn: 1,
    log: [],
  }),
}))
