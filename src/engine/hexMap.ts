export type Ring = 'inner' | 'middle' | 'outer'

export interface HexDef {
  id: string
  ring: Ring
  position: number
  angle: number  // degrees, 0 = right, -90 = top
  cx: number
  cy: number
}

const SVG_CX = 200
const SVG_CY = 200

const RING_CONFIG = {
  inner:  { count: 6,  radius: 62,  hexSize: 18, prefix: 'I' },
  middle: { count: 12, radius: 112, hexSize: 15, prefix: 'M' },
  outer:  { count: 18, radius: 163, hexSize: 12, prefix: 'O' },
}

function buildRing(ring: Ring): HexDef[] {
  const { count, radius, prefix } = RING_CONFIG[ring]
  return Array.from({ length: count }, (_, i) => {
    const angle = (360 / count) * i - 90  // start from top
    const rad = (Math.PI / 180) * angle
    return {
      id: `${prefix}${i + 1}`,
      ring,
      position: i + 1,
      angle,
      cx: SVG_CX + radius * Math.cos(rad),
      cy: SVG_CY + radius * Math.sin(rad),
    }
  })
}

export const ALL_HEXES: HexDef[] = [
  ...buildRing('inner'),
  ...buildRing('middle'),
  ...buildRing('outer'),
]

export const HEX_MAP: Record<string, HexDef> = Object.fromEntries(
  ALL_HEXES.map((h) => [h.id, h])
)

export function getHexSize(ring: Ring): number {
  return RING_CONFIG[ring].hexSize
}

function angleDiff(a: number, b: number): number {
  let d = Math.abs(a - b) % 360
  if (d > 180) d = 360 - d
  return d
}

export function getNeighbors(hexId: string): string[] {
  const hex = HEX_MAP[hexId]
  if (!hex) return []
  const neighbors: string[] = []

  // Same-ring neighbors (wrap around)
  const cfg = RING_CONFIG[hex.ring]
  const prevPos = ((hex.position - 2 + cfg.count) % cfg.count) + 1
  const nextPos = (hex.position % cfg.count) + 1
  neighbors.push(`${cfg.prefix}${prevPos}`)
  neighbors.push(`${cfg.prefix}${nextPos}`)

  // Cross-ring neighbors (inner↔middle, middle↔outer)
  const crossRings: Partial<Record<Ring, Ring[]>> = {
    inner:  ['middle'],
    middle: ['inner', 'outer'],
    outer:  ['middle'],
  }
  for (const targetRing of crossRings[hex.ring] ?? []) {
    const targetCfg = RING_CONFIG[targetRing]
    const threshold = 360 / targetCfg.count  // angular slot width
    ALL_HEXES.filter((h) => h.ring === targetRing).forEach((h) => {
      if (angleDiff(h.angle, hex.angle) <= threshold) {
        neighbors.push(h.id)
      }
    })
  }

  return [...new Set(neighbors)]
}

export const STARTING_HEX = 'I1'
