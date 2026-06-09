import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ResourceBar from '../components/ui/ResourceBar'
import { useGameStore } from '../stores/gameStore'
import { getActivatableModules, getPassiveEffects, findModule } from '../engine/starshipCombat'
import starshipsData from '../../data/starships.json'

type ShipEntry = { id: string; name: string; class: string; hull: number; modules: string[]; skill: string; exp: number }

const CLASS_COLORS: Record<string, string> = {
  S: 'bg-accent text-bone border-accent',
  A: 'bg-astro-yellow text-astro-black border-astro-yellow',
  B: 'bg-[#130d1c] text-off-white border-astro-ink',
}

function ShieldPips({ count, max = 8 }: { count: number; max?: number }) {
  const total = Math.max(count, max)
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`w-3 h-3 rounded-full border ${i < count ? 'bg-intersolar border-intersolar' : 'bg-[#130d1c] border-astro-ink'}`}
        />
      ))}
    </div>
  )
}

function EnemySelector({ onSelect }: { onSelect: (id: string) => void }) {
  const ships = starshipsData as ShipEntry[]
  return (
    <div className="min-h-screen bg-astro-black px-4 pt-8 pb-24 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl text-bone uppercase tracking-wider mb-1">Combat Spatial</h1>
      <p className="font-serif italic text-off-white mb-6">Choisir le vaisseau ennemi</p>
      <div className="space-y-2">
        {ships.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="w-full text-left rounded-lg border-2 border-astro-ink bg-[#1a1025] hover:border-accent px-4 py-3 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${CLASS_COLORS[s.class] ?? CLASS_COLORS.B}`}>
                  Cl. {s.class}
                </span>
                <span className="font-display text-base text-bone uppercase">{s.name}</span>
              </div>
              <div className="font-mono text-[10px] text-off-white text-right space-y-0.5">
                <div>Hull <span className="text-bone font-bold">{s.hull}</span></div>
                <div className="text-astro-yellow">{s.exp} EXP</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {s.modules.map((m) => {
                const mod = findModule(m)
                const catColors: Record<string, string> = {
                  engines: 'text-medusa', control: 'text-intersolar',
                  systems: 'text-astro-yellow', weapons: 'text-accent',
                }
                return (
                  <span key={m} className={`font-mono text-[8px] ${catColors[mod?.category ?? ''] ?? 'text-off-white'}`}>
                    {m}
                  </span>
                )
              })}
            </div>
            <p className="font-serif italic text-[10px] text-off-white opacity-60 mt-1">{s.skill}</p>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function StarshipCombatScreen() {
  const shipCombat = useGameStore((s) => s.shipCombat)
  const startStarshipCombat = useGameStore((s) => s.startStarshipCombat)
  const rollShipDice = useGameStore((s) => s.rollShipDice)
  const activateShipModule = useGameStore((s) => s.activateShipModule)
  const endPlayerShipTurn = useGameStore((s) => s.endPlayerShipTurn)
  const enemyShipAct = useGameStore((s) => s.enemyShipAct)
  const escapeStarship = useGameStore((s) => s.escapeStarship)
  const endStarshipCombat = useGameStore((s) => s.endStarshipCombat)

  const [selectedDie, setSelectedDie] = useState<number | null>(null)
  const [showSelector, setShowSelector] = useState(!shipCombat)

  // Auto-advance enemy turn if combat resumed mid-enemy-turn
  useEffect(() => {
    if (shipCombat?.phase === 'active' && shipCombat.turn === 'enemy') {
      const t = setTimeout(() => enemyShipAct(), 600)
      return () => clearTimeout(t)
    }
  }, [shipCombat?.turn, shipCombat?.phase])

  // Reset die selection when dice change
  useEffect(() => { setSelectedDie(null) }, [shipCombat?.actionDice.length, shipCombat?.round])

  if (showSelector || !shipCombat) {
    return (
      <EnemySelector
        onSelect={(id) => {
          startStarshipCombat(id)
          setShowSelector(false)
        }}
      />
    )
  }

  const { player, enemy, turn, phase, log, round, actionDice, usedDiceIndices, playerModules, enemyModules } = shipCombat
  const isPlayerTurn = turn === 'player' && phase === 'active'
  const isOver = phase !== 'active'
  const hasRolled = actionDice.length > 0
  const isCriticalPlayer = player.hull <= 10 && player.hull > 0
  const isCriticalEnemy = enemy.hull <= 10 && enemy.hull > 0

  // Modules the selected die can activate (not already used)
  const activatable = selectedDie !== null
    ? getActivatableModules(playerModules, actionDice[selectedDie])
    : []

  const passiveEffects = getPassiveEffects(playerModules)

  const dieLabel = (v: number) => ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][v] ?? v

  return (
    <div className="min-h-screen bg-astro-black px-4 pt-4 pb-6 max-w-2xl mx-auto flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-bone uppercase">🚀 {shipCombat.enemyShipName}</h1>
        <span className="font-mono text-[10px] text-off-white uppercase">
          Round {round}{isOver ? '' : ` · ${isPlayerTurn ? 'Votre tour' : 'Tour ennemi…'}`}
        </span>
      </div>

      {/* Enemy ship */}
      <Card className={isCriticalEnemy ? 'border-astro-orange/60' : ''}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-astro-orange">Ennemi</p>
          {isCriticalEnemy && <span className="font-mono text-[9px] text-astro-orange animate-pulse">⚠ CRITIQUE</span>}
        </div>
        <ResourceBar label={`Hull ${enemy.hull}/${enemy.maxHull}`} value={enemy.hull} max={enemy.maxHull} />
        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono text-[9px] text-off-white uppercase">Shields</span>
          <ShieldPips count={enemy.shields} />
          {enemy.shields > 0 && <span className="font-mono text-[9px] text-intersolar">{enemy.shields}</span>}
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {enemyModules.map((m) => {
            const mod = findModule(m)
            const catColors: Record<string, string> = {
              engines: 'text-medusa', control: 'text-intersolar',
              systems: 'text-astro-yellow', weapons: 'text-accent',
            }
            return <span key={m} className={`font-mono text-[8px] ${catColors[mod?.category ?? ''] ?? 'text-off-white'}`}>{m}</span>
          })}
        </div>
      </Card>

      {/* Player ship */}
      <Card className={isCriticalPlayer ? 'border-astro-yellow/60' : ''}>
        <div className="flex items-center justify-between mb-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent">Votre vaisseau</p>
          {isCriticalPlayer && <span className="font-mono text-[9px] text-astro-yellow animate-pulse">⚠ CRITIQUE</span>}
        </div>
        <ResourceBar label={`Hull ${player.hull}/${player.maxHull}`} value={player.hull} max={player.maxHull} />
        <div className="flex items-center gap-2 mt-2">
          <span className="font-mono text-[9px] text-off-white uppercase">Shields</span>
          <ShieldPips count={player.shields} />
          {player.shields > 0 && <span className="font-mono text-[9px] text-intersolar">{player.shields}</span>}
        </div>
      </Card>

      {/* Passive modules */}
      {passiveEffects.length > 0 && (
        <Card variant="inset">
          <p className="font-mono text-[9px] uppercase tracking-widest text-intersolar mb-1">Modules passifs</p>
          <div className="space-y-0.5">
            {passiveEffects.map((e) => (
              <p key={e.name} className="font-mono text-[9px] text-off-white">
                <span className="text-intersolar">{e.name}</span> — {e.effect}
              </p>
            ))}
          </div>
        </Card>
      )}

      {/* Action section — player turn */}
      {isPlayerTurn && (
        <div className="space-y-2">
          {!hasRolled ? (
            <Button variant="primary" onClick={rollShipDice} className="w-full">
              🎲 Lancer les dés d'action
            </Button>
          ) : (
            <>
              {/* Dice */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-1">
                  Dés d'action — sélectionner un dé, puis un module
                </p>
                <div className="flex gap-2 flex-wrap">
                  {actionDice.map((die, i) => {
                    const used = usedDiceIndices.includes(i)
                    const selected = selectedDie === i
                    return (
                      <button
                        key={i}
                        onClick={() => !used && setSelectedDie(selected ? null : i)}
                        disabled={used}
                        className={`w-12 h-12 rounded-lg border-2 font-display text-2xl transition-all active:scale-95
                          ${used ? 'border-astro-ink text-astro-ink bg-[#130d1c] cursor-default' : ''}
                          ${!used && selected ? 'border-accent bg-accent/20 text-bone scale-105' : ''}
                          ${!used && !selected ? 'border-astro-ink bg-[#1a1025] text-bone hover:border-accent' : ''}`}
                      >
                        {used ? '✓' : dieLabel(die)}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Modules list */}
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-1">Modules actifs</p>
                <div className="space-y-1">
                  {playerModules.map((modName) => {
                    const mod = findModule(modName)
                    if (!mod || mod.category === 'engines' || mod.category === 'control') return null
                    const isActivatable = activatable.includes(modName)
                    const catColors: Record<string, string> = {
                      systems: 'text-astro-yellow', weapons: 'text-accent',
                    }
                    return (
                      <div
                        key={modName}
                        className={`rounded border px-3 py-2 transition-all
                          ${isActivatable ? 'border-accent bg-accent/10 cursor-pointer hover:bg-accent/20' : 'border-astro-ink bg-[#1a1025] opacity-50'}`}
                        onClick={() => {
                          if (isActivatable && selectedDie !== null) {
                            activateShipModule(modName, selectedDie)
                            setSelectedDie(null)
                          }
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className={`font-display text-xs uppercase ${catColors[mod.category] ?? 'text-bone'}`}>
                              {mod.name}
                            </span>
                            <span className="font-mono text-[8px] text-off-white opacity-50">[{mod.activationRoll}]</span>
                          </div>
                          {isActivatable && selectedDie !== null && (
                            <span className="font-mono text-[9px] text-accent shrink-0">Activer ▶</span>
                          )}
                        </div>
                        <p className="font-mono text-[9px] text-off-white opacity-60 mt-0.5">{mod.effect}</p>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="ghost" onClick={endPlayerShipTurn} className="flex-1">
                  Fin du tour
                </Button>
                <Button variant="ghost" onClick={escapeStarship} className="flex-1">
                  Fuir
                </Button>
              </div>
            </>
          )}
          {!hasRolled && (
            <Button variant="ghost" onClick={escapeStarship} className="w-full">
              Fuir
            </Button>
          )}
        </div>
      )}

      {/* Enemy acting */}
      {!isOver && !isPlayerTurn && (
        <div className="text-center py-4">
          <p className="font-mono text-[10px] text-off-white animate-pulse">Tour de l'ennemi…</p>
        </div>
      )}

      {/* Combat log */}
      <Card variant="inset" className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-2">Journal de combat</p>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {[...log].reverse().map((entry, i) => {
            const colors: Record<string, string> = {
              attack: 'text-accent', enemy: 'text-astro-orange',
              status: 'text-astro-yellow', system: 'text-off-white',
              victory: 'text-medusa', defeat: 'text-astro-orange',
            }
            return (
              <p key={i} className={`font-mono text-[10px] leading-relaxed ${colors[entry.type] ?? 'text-off-white'}`}>
                {entry.text}
              </p>
            )
          })}
        </div>
      </Card>

      {/* End states */}
      {isOver && (
        <div
          className={`rounded-lg border-2 p-4 text-center ${
            phase === 'victory' ? 'border-medusa bg-medusa/10' :
            phase === 'defeat' ? 'border-astro-orange bg-astro-orange/10' :
            'border-astro-ink bg-[#1a1025]'
          }`}
        >
          {phase === 'victory' && (
            <>
              <p className="font-display text-3xl text-medusa uppercase mb-1">Victoire !</p>
              <p className="font-mono text-sm text-bone">+{shipCombat.expReward} EXP gagné</p>
            </>
          )}
          {phase === 'defeat' && (
            <>
              <p className="font-display text-3xl text-astro-orange uppercase mb-1">Défaite</p>
              <p className="font-mono text-sm text-off-white">Hull rétabli à 1 au retour.</p>
            </>
          )}
          {phase === 'escaped' && (
            <p className="font-display text-2xl text-off-white uppercase">Fuite réussie</p>
          )}
          <Button variant="primary" onClick={endStarshipCombat} className="mt-4 w-full">
            Retour
          </Button>
        </div>
      )}
    </div>
  )
}
