import type { Ring } from './hexMap'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import explorationData from '../../data/exploration-tables.json'

export interface ExploreResult {
  roll: number
  type: string
  text: string
  hexColor: string
}

const TYPE_COLORS: Record<string, string> = {
  SETTLEMENT:          '#ffbd5c',
  PLANET:              '#3fb87f',
  'HOSTILE ENCOUNTER': '#ff603e',
  'NEUTRAL ENCOUNTER': '#2fa3a3',
  'RING EVENT':        '#3b6fd4',
  'OUTER RING EVENT':  '#3b6fd4',
  'MIDDLE RING EVENT': '#3b6fd4',
  'INNER RING EVENT':  '#3b6fd4',
  'FACTION ENCOUNTER': '#9b6dff',
}

function d(sides: number): number {
  return Math.floor(Math.random() * sides) + 1
}

function normalizeType(raw: string): string {
  if (raw.includes('RING EVENT')) return 'RING EVENT'
  return raw
}

function resolveRingEvent(ring: Ring): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events = (explorationData[ring] as any).events
  const isOdd = d(2) === 1
  const group = isOdd ? events.odd : events.even
  const roll = d(6)
  const entry = group.table.find((t: any) => t.roll === roll) ?? group.table[0]
  return `${group.name} (d6=${roll}) — ${entry.text}`
}

function resolvePlanet(ring: Ring): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const shapes = (explorationData[ring] as any).planetShapes as any[]
  const roll = d(6)
  const shape = shapes.find((s: any) => {
    const parts = String(s.roll).split('-').map(Number)
    return roll >= parts[0] && roll <= (parts[1] ?? parts[0])
  }) ?? shapes[0]
  return `${shape.type} — ${shape.description}`
}

function resolveHostile(): string {
  const roll8 = d(8)
  if (roll8 === 1) return 'Secteur calme — aucune rencontre hostile.'
  const categories = explorationData.hostile.categories
  const catIdx = Math.min(roll8, 6) - 2
  const category = categories[Math.max(0, catIdx)]
  const roll6 = d(6)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event: any = category.table.find((t: any) => (t.d6 ?? t.roll) === roll6) ?? category.table[0]
  const ship = event.ship ? ` (${event.ship})` : ''
  const notes = event.notes ?? event.text ?? ''
  return `${category.name}${ship}: ${notes}`
}

function resolveNeutral(): string {
  const roll8 = d(8)
  if (roll8 === 1) return 'Secteur vide — aucune rencontre.'
  const categories = explorationData.neutral.categories
  const catIdx = Math.min(roll8, 6) - 2
  const category = categories[Math.max(0, catIdx)]
  const roll6 = d(6)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event: any = category.table.find((t: any) => (t.d6 ?? t.roll) === roll6) ?? category.table[0]
  return `${category.name}: ${event.text ?? ''}`
}

function resolveFaction(): string {
  const battles = explorationData.hostile.categories.find((c) => c.roll === 6)
  if (!battles) return 'Rencontre de faction.'
  const roll6 = d(6)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const event: any = battles.table.find((t: any) => t.d6 === roll6) ?? battles.table[0]
  return `FACTION BATTLE: ${event.text ?? ''}`
}

export function rollExploration(ring: Ring): ExploreResult {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const table = (explorationData[ring] as any).table as { roll: number; type: string }[]
  const roll = d(6)
  const entry = table.find((t) => t.roll === roll) ?? table[0]
  const type = normalizeType(entry.type)

  let text = ''
  switch (type) {
    case 'SETTLEMENT':
      text = 'Un Settlement est découvert. Hull et Health sont restaurés. Refuel disponible (3₵/unit).'
      break
    case 'RING EVENT':
      text = resolveRingEvent(ring)
      break
    case 'PLANET':
      text = resolvePlanet(ring)
      break
    case 'HOSTILE ENCOUNTER':
      text = resolveHostile()
      break
    case 'NEUTRAL ENCOUNTER':
      text = resolveNeutral()
      break
    case 'FACTION ENCOUNTER':
      text = resolveFaction()
      break
    default:
      text = entry.type
  }

  return {
    roll,
    type,
    text,
    hexColor: TYPE_COLORS[type] ?? '#f0eee8',
  }
}
