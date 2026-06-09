import settlementsData from '../../data/settlements.json'

export type TileType = 'access-port' | 'normal' | 'matrix-node'

export function rollD66(): number {
  const d1 = Math.ceil(Math.random() * 6)
  const d2 = Math.ceil(Math.random() * 6)
  return d1 * 10 + d2
}

export function generateNetwork(): TileType[] {
  // 10 tiles: access-port | 8 middle (3 matrix-nodes + 5 normal, random) | access-port
  const tiles: TileType[] = ['access-port']
  const matrixPositions = new Set<number>()
  while (matrixPositions.size < 3) {
    matrixPositions.add(Math.floor(Math.random() * 8) + 1)
  }
  for (let i = 1; i <= 8; i++) {
    tiles.push(matrixPositions.has(i) ? 'matrix-node' : 'normal')
  }
  tiles.push('access-port')
  return tiles
}

export function getEncounter(roll: number): string {
  const table = settlementsData.cybersphere.encounterTable as { roll: number; effect: string }[]
  return table.find((e) => e.roll === roll)?.effect ?? 'Couloir vide — rien à signaler.'
}

export function getReward(roll: number): string {
  const table = settlementsData.cybersphere.rewardTable as { roll: number; reward: string }[]
  return table.find((r) => r.roll === roll)?.reward ?? 'Nœud matriciel vide.'
}

// Parse {CLOCK +N} or {CLOCK -N} from encounter/reward text
export function extractClockDelta(text: string): number {
  const match = text.match(/\{CLOCK ([+-]\d+)\}/)
  return match ? parseInt(match[1], 10) : 0
}
