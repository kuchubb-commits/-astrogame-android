import { useState } from 'react'
import HexMap from '../components/HexMap'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useGameStore } from '../stores/gameStore'
import { getNeighbors, HEX_MAP } from '../engine/hexMap'
import { rollExploration } from '../engine/exploration'
import type { Ring } from '../engine/hexMap'

const HOSTILE_TYPES = ['HOSTILE ENCOUNTER', 'FACTION ENCOUNTER']

function RingLabel({ ring }: { ring: Ring }) {
  const labels: Record<Ring, string> = {
    inner: 'Anneau intérieur',
    middle: 'Anneau médian',
    outer: 'Anneau extérieur',
  }
  const colors: Record<Ring, string> = {
    inner: 'text-astro-orange',
    middle: 'text-astro-yellow',
    outer: 'text-wire',
  }
  return <span className={`font-mono text-[10px] uppercase ${colors[ring]}`}>{labels[ring]}</span>
}

export default function MapScreen() {
  const mapData = useGameStore((s) => s.mapData)
  const ensureMap = useGameStore((s) => s.ensureMap)
  const starship = useGameStore((s) => s.starship)!
  const movePlayer = useGameStore((s) => s.movePlayer)
  const exploreCurrentHex = useGameStore((s) => s.exploreCurrentHex)
  const startCombat = useGameStore((s) => s.startCombat)
  const enterSettlement = useGameStore((s) => s.enterSettlement)
  const setTab = useGameStore((s) => s.setTab)

  if (!mapData) {
    ensureMap()
    return (
      <div className="min-h-screen bg-astro-black flex items-center justify-center">
        <p className="font-mono text-bone">Initialisation de la carte…</p>
      </div>
    )
  }

  const [selectedHexId, setSelectedHexId] = useState<string | null>(null)
  const [lastResult, setLastResult] = useState<{ type: string; text: string; color: string } | null>(null)

  const { playerHexId, hexes, cycleLog } = mapData
  const playerHex = HEX_MAP[playerHexId]
  const currentHexState = hexes[playerHexId]
  const neighbors = new Set(getNeighbors(playerHexId))

  const selectedHex = selectedHexId ? HEX_MAP[selectedHexId] : null
  const canMove = selectedHexId && neighbors.has(selectedHexId) && selectedHexId !== playerHexId
  const noFuel = starship.fuel.current <= 0

  function handleSelectHex(id: string) {
    if (id === playerHexId) {
      setSelectedHexId(null)
    } else {
      setSelectedHexId(id)
    }
  }

  function handleMove() {
    if (!selectedHexId || !canMove || noFuel) return
    movePlayer(selectedHexId)
    setSelectedHexId(null)
    setLastResult(null)
  }

  function handleExplore() {
    if (currentHexState.explored) return
    const result = rollExploration(playerHex.ring as Ring)
    exploreCurrentHex(result)
    setLastResult({ type: result.type, text: result.text, color: result.hexColor })
  }

  const exploredCount = Object.values(hexes).filter((h) => h.explored).length

  return (
    <div className="min-h-screen bg-astro-black flex flex-col pb-16">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl text-bone uppercase tracking-wider">Carte stellaire</h1>
          <p className="font-mono text-[10px] text-off-white">
            {exploredCount}/36 hexes · Cycle {mapData.cycleCount} · Fuel{' '}
            <span className={starship.fuel.current <= 2 ? 'text-astro-orange' : 'text-astro-yellow'}>
              {starship.fuel.current}/{starship.fuel.max}
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <RingLabel ring={playerHex.ring} />
          <p className="font-display text-lg text-accent">{playerHexId}</p>
          <button
            onClick={enterSettlement}
            className="font-mono text-[9px] px-2 py-1 rounded border border-astro-ink bg-[#1a1025] text-off-white hover:border-accent hover:text-bone active:scale-95 transition-all"
          >
            ⬡ Settlement
          </button>
        </div>
      </div>

      {/* Map SVG */}
      <div className="w-full px-2">
        <HexMap
          mapData={mapData}
          selectedHexId={selectedHexId}
          onSelectHex={handleSelectHex}
        />
      </div>

      {/* Action panel */}
      <div className="px-4 pt-2 space-y-2">
        {/* Current hex state */}
        {!currentHexState.explored ? (
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-off-white">Position actuelle — {playerHexId}</p>
                <RingLabel ring={playerHex.ring} />
                <p className="font-mono text-xs text-off-white opacity-60 mt-1">Hex inexploré</p>
              </div>
              <Button variant="primary" onClick={handleExplore}>
                Explorer
              </Button>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-start gap-3">
              <div
                className="w-2 flex-shrink-0 self-stretch rounded-full mt-1"
                style={{ backgroundColor: currentHexState.hexColor ?? '#f0eee8' }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-mono text-[10px] uppercase tracking-widest" style={{ color: currentHexState.hexColor ?? '#f0eee8' }}>
                    {currentHexState.discoveryType}
                  </p>
                  <span className="font-mono text-[10px] text-off-white opacity-50">{playerHexId}</span>
                </div>
                <p className="font-mono text-[11px] text-bone leading-relaxed line-clamp-3">
                  {currentHexState.discoveryText}
                </p>
                {HOSTILE_TYPES.includes(currentHexState.discoveryType ?? '') && (
                  <Button
                    variant="primary"
                    className="mt-2 w-full"
                    onClick={() => {
                      startCombat('space-pirate')
                      setTab('player')
                    }}
                  >
                    ⚔ Engager le combat
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Last result — only shown while the current hex is still unexplored */}
        {lastResult && !currentHexState.explored && (
          <div
            className="rounded-lg border px-3 py-2"
            style={{ borderColor: lastResult.color, backgroundColor: lastResult.color + '18' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: lastResult.color }}>
              {lastResult.type}
            </p>
            <p className="font-mono text-[11px] text-bone leading-relaxed">{lastResult.text}</p>
          </div>
        )}

        {/* Move panel */}
        {selectedHexId && selectedHexId !== playerHexId && (
          <Card>
            <div className="flex items-center justify-between gap-3">
              <div className="flex-1">
                {selectedHex && (
                  <>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-off-white">Cible</p>
                      <span className="font-display text-base text-bone">{selectedHexId}</span>
                      <RingLabel ring={selectedHex.ring} />
                    </div>
                    {!canMove && (
                      <p className="font-mono text-[10px] text-astro-orange mt-1">Non adjacent</p>
                    )}
                    {noFuel && (
                      <p className="font-mono text-[10px] text-astro-orange mt-1">Fuel insuffisant</p>
                    )}
                  </>
                )}
              </div>
              <Button
                variant="primary"
                disabled={!canMove || noFuel}
                onClick={handleMove}
              >
                Move −1 Fuel
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* Journal */}
      {cycleLog.length > 0 && (
        <div className="px-4 pt-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-2">Journal de cycle</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {cycleLog.slice(0, 10).map((entry) => (
              <p key={entry.id} className="font-mono text-[10px] text-off-white opacity-70 leading-relaxed">
                {entry.text}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
