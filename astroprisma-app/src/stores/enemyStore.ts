import { create } from 'zustand'
import type { Enemy } from '../data/enemies'

interface EnemyStore {
  selectedEnemy: Enemy | null
  setEnemy: (enemy: Enemy | null) => void
  enemyCurrentHp: number
  setEnemyHp: (hp: number) => void
  resetEnemyHp: () => void
}

export const useEnemyStore = create<EnemyStore>((set, get) => ({
  selectedEnemy: null,
  enemyCurrentHp: 0,
  setEnemy: (enemy) => set({ selectedEnemy: enemy, enemyCurrentHp: enemy?.hp ?? 0 }),
  setEnemyHp: (hp) => set({ enemyCurrentHp: Math.max(0, hp) }),
  resetEnemyHp: () => set({ enemyCurrentHp: get().selectedEnemy?.hp ?? 0 }),
}))
