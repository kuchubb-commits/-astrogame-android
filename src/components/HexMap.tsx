import { ALL_HEXES, getNeighbors, getHexSize } from '../engine/hexMap'
import type { MapData } from '../types/game'

function hexPolygon(cx: number, cy: number, r: number): string {
  return Array.from({ length: 6 }, (_, i) => {
    const angle = (Math.PI / 3) * i - Math.PI / 6
    return `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`
  }).join(' ')
}

function hexLabel(type: string): string {
  const map: Record<string, string> = {
    SETTLEMENT:          'S',
    PLANET:              'P',
    'HOSTILE ENCOUNTER': '!',
    'NEUTRAL ENCOUNTER': '~',
    'RING EVENT':        'E',
    'FACTION ENCOUNTER': 'F',
  }
  return map[type] ?? '?'
}

interface HexMapProps {
  mapData: MapData
  selectedHexId: string | null
  onSelectHex: (id: string) => void
}

export default function HexMap({ mapData, selectedHexId, onSelectHex }: HexMapProps) {
  const { hexes, playerHexId } = mapData
  const neighbors = new Set(getNeighbors(playerHexId))

  return (
    <svg
      viewBox="0 0 400 400"
      className="w-full"
      style={{ touchAction: 'none', display: 'block' }}
    >
      {/* Background */}
      <rect width="400" height="400" fill="#130d1c" />

      {/* Ring guides (subtle) */}
      {[62, 112, 163].map((r) => (
        <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="#1a1025" strokeWidth="1" />
      ))}

      {/* Star */}
      <circle cx="200" cy="200" r="16" fill="#ffbd5c" opacity="0.9" />
      <circle cx="200" cy="200" r="20" fill="none" stroke="#ffbd5c" strokeWidth="1" opacity="0.4" />
      <circle cx="200" cy="200" r="26" fill="none" stroke="#ffbd5c" strokeWidth="0.5" opacity="0.2" />
      <text x="200" y="205" textAnchor="middle" fill="#130d1c" fontSize="9" fontFamily="monospace" fontWeight="bold">
        ☀
      </text>

      {/* Hexes */}
      {ALL_HEXES.map((hex) => {
        const state = hexes[hex.id]
        const isPlayer = hex.id === playerHexId
        const isNeighbor = neighbors.has(hex.id)
        const isSelected = hex.id === selectedHexId
        const size = getHexSize(hex.ring)
        const points = hexPolygon(hex.cx, hex.cy, size - 1)

        let fill = '#1a1025'
        let stroke = '#000000'
        let strokeWidth = 1.5
        let opacity = 1

        if (isPlayer) {
          fill = '#ef476e'
          stroke = '#d50059'
          strokeWidth = 2
        } else if (state?.explored && state.hexColor) {
          fill = state.hexColor + '33'  // 20% opacity
          stroke = state.hexColor
          strokeWidth = 1.5
        } else if (isSelected) {
          fill = '#2a1030'
          stroke = '#ef476e'
          strokeWidth = 2
        } else if (isNeighbor) {
          fill = '#1e1530'
          stroke = '#5b2d8e'
          strokeWidth = 1.5
        } else {
          opacity = 0.7
        }

        return (
          <g
            key={hex.id}
            onClick={() => onSelectHex(hex.id)}
            style={{ cursor: isPlayer ? 'default' : 'pointer' }}
          >
            <polygon
              points={points}
              fill={fill}
              stroke={stroke}
              strokeWidth={strokeWidth}
              opacity={opacity}
            />
            {/* Hex ID label */}
            <text
              x={hex.cx}
              y={hex.cy - (size * 0.15)}
              textAnchor="middle"
              fill={isPlayer ? '#fff' : state?.explored ? state.hexColor ?? '#e0dfdb' : '#5a5060'}
              fontSize={size * 0.48}
              fontFamily="monospace"
              fontWeight={isPlayer ? 'bold' : 'normal'}
            >
              {isPlayer ? '◈' : state?.explored && state.discoveryType ? hexLabel(state.discoveryType) : hex.id}
            </text>
            {/* Ring indicator dot for neighbors */}
            {isNeighbor && !isPlayer && (
              <circle cx={hex.cx} cy={hex.cy + size * 0.35} r={1.5} fill="#9b6dff" />
            )}
          </g>
        )
      })}
    </svg>
  )
}
