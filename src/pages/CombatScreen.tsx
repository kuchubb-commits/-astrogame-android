import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ResourceBar from '../components/ui/ResourceBar'
import { useGameStore } from '../stores/gameStore'
import type { CombatLogEntry, ActiveStatus } from '../types/game'
import { findHackByName, getHackResolution } from '../engine/hackResolver'
import enemiesData from '../../data/enemies.json'

const LOG_COLORS: Record<CombatLogEntry['type'], string> = {
  attack:  'text-accent',
  enemy:   'text-astro-orange',
  status:  'text-astro-yellow',
  system:  'text-off-white',
  victory: 'text-medusa',
  defeat:  'text-astro-orange',
}

function StatusPill({ status }: { status: ActiveStatus }) {
  const colors: Record<string, string> = {
    overheat: 'bg-astro-orange', shock: 'bg-wire', stun: 'bg-astro-yellow',
    silence: 'bg-synth', breach: 'bg-accent', immunity: 'bg-medusa',
    blinded: 'bg-off-white', beaconed: 'bg-intersolar', toxins: 'bg-medusa',
  }
  const bg = colors[status.id] ?? 'bg-off-white'
  return (
    <span className={`${bg} text-astro-black font-mono text-[9px] uppercase px-1.5 py-0.5 rounded border border-astro-ink`}>
      {status.name}{status.turnsLeft !== null ? ` (${status.turnsLeft})` : ''}
    </span>
  )
}

// Enemy selector shown before combat starts
function EnemySelector({ onSelect }: { onSelect: (id: string) => void }) {
  const enemies = enemiesData as { id: string; name: string; hp: number; armor: number; isBoss: boolean }[]
  return (
    <div className="min-h-screen bg-astro-black px-4 pt-8 pb-24 max-w-2xl mx-auto">
      <h1 className="font-display text-3xl text-bone uppercase tracking-wider mb-1">Combat</h1>
      <p className="font-serif italic text-off-white mb-6">Choisir l'adversaire</p>
      <div className="space-y-2">
        {enemies.map((e) => (
          <button
            key={e.id}
            onClick={() => onSelect(e.id)}
            className="w-full text-left rounded-lg border-2 border-astro-ink bg-[#1a1025] hover:border-accent px-4 py-3 transition-all active:scale-95"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-display text-base text-bone uppercase">{e.name}</span>
                {e.isBoss && <span className="ml-2 font-mono text-[9px] px-1.5 py-0.5 bg-accent text-bone rounded border border-accent-deep">BOSS</span>}
              </div>
              <div className="font-mono text-[10px] text-off-white text-right space-y-0.5">
                <div>HP <span className="text-bone font-bold">{e.hp}</span></div>
                <div>Armor <span className="text-bone font-bold">{e.armor}</span></div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function CombatScreen() {
  const combat = useGameStore((s) => s.combat)
  const character = useGameStore((s) => s.character)!
  const startCombat = useGameStore((s) => s.startCombat)
  const playerAttack = useGameStore((s) => s.playerAttack)
  const playerUseHack = useGameStore((s) => s.playerUseHack)
  const playerEscape = useGameStore((s) => s.playerEscape)
  const endCombat = useGameStore((s) => s.endCombat)

  const [showSelector, setShowSelector] = useState(!combat)

  if (showSelector || !combat) {
    return (
      <EnemySelector
        onSelect={(id) => {
          startCombat(id)
          setShowSelector(false)
        }}
      />
    )
  }

  const { enemy, player, phase, log, round, enemyName, expReward } = combat
  const weapons = character.weapons.filter(Boolean) as string[]
  const isPlayerTurn = phase === 'active' && combat.turn === 'player'
  const isOver = phase !== 'active'

  // Hacks from memory slots
  const activeHacks = character.memorySlots
    .filter(Boolean)
    .map((slot) => {
      const hack = findHackByName(slot)
      if (!hack) return null
      const res = getHackResolution(hack.id)
      if (!res) return null
      const canAfford = character.hyperdrive.current >= (res.hyperCost ?? 0) && character.energy.current >= (res.energyCost ?? 0)
      const costLabel = res.energyCost > 0 ? `${res.energyCost}E` : `${res.hyperCost}H`
      return { hack, costLabel, canAfford }
    })
    .filter(Boolean) as { hack: { id: string; name: string }; costLabel: string; canAfford: boolean }[]

  return (
    <div className="min-h-screen bg-astro-black px-4 pt-4 pb-6 max-w-2xl mx-auto flex flex-col gap-3">
      {/* Round indicator */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-bone uppercase">⚔ {enemyName}</h1>
        <span className="font-mono text-[10px] text-off-white uppercase">
          Round {round}{isOver ? '' : ` · ${isPlayerTurn ? 'Votre tour' : 'Tour ennemi…'}`}
        </span>
      </div>

      {/* Enemy */}
      <Card>
        <p className="font-mono text-[10px] uppercase tracking-widest text-astro-orange mb-2">Ennemi</p>
        <ResourceBar label={`${enemyName} — Armor ${enemy.armor}`} value={enemy.hp} max={enemy.maxHp} />
        {enemy.statuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {enemy.statuses.map((s) => <StatusPill key={s.id} status={s} />)}
          </div>
        )}
      </Card>

      {/* Player */}
      <Card>
        <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">Vous — Armor {player.armor}</p>
        <ResourceBar label="HP" value={player.hp} max={player.maxHp} />
        {player.statuses.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {player.statuses.map((s) => <StatusPill key={s.id} status={s} />)}
          </div>
        )}
      </Card>

      {/* Combat log */}
      <Card variant="inset" className="flex-1">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-2">Journal de combat</p>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {[...log].reverse().map((entry, i) => (
            <p key={i} className={`font-mono text-[10px] leading-relaxed ${LOG_COLORS[entry.type]}`}>
              {entry.text}
            </p>
          ))}
        </div>
      </Card>

      {/* Actions */}
      {!isOver && (
        <div className="space-y-2">
          {isPlayerTurn ? (
            <>
              <p className="font-mono text-[10px] uppercase tracking-widest text-off-white">Attaquer avec :</p>
              <div className="space-y-2">
                {weapons.length > 0 ? weapons.map((w, i) => (
                  <Button key={i} variant="primary" onClick={() => playerAttack(w)} className="w-full text-left">
                    {w}
                  </Button>
                )) : (
                  <Button variant="primary" onClick={() => playerAttack('Poing (d6+VIG)')} className="w-full">
                    Poing (d6+VIG)
                  </Button>
                )}
              </div>
              {activeHacks.length > 0 && (
                <>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mt-3">Hacks :</p>
                  <div className="space-y-2">
                    {activeHacks.map(({ hack, costLabel, canAfford }) => (
                      <Button
                        key={hack.id}
                        variant="secondary"
                        onClick={() => playerUseHack(hack.id)}
                        disabled={!canAfford}
                        className="w-full text-left"
                      >
                        <span className="text-astro-yellow font-mono text-[9px] mr-2">[{costLabel}]</span>
                        {hack.name}
                      </Button>
                    ))}
                  </div>
                </>
              )}
              <Button variant="ghost" onClick={playerEscape} className="w-full mt-2">
                Fuir
              </Button>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="font-mono text-[10px] text-off-white animate-pulse">Tour de l'ennemi…</p>
            </div>
          )}
        </div>
      )}

      {/* End states */}
      {isOver && (
        <div
          className={`rounded-lg border-2 p-4 text-center ${phase === 'victory' ? 'border-medusa bg-medusa/10' : phase === 'defeat' ? 'border-astro-orange bg-astro-orange/10' : 'border-astro-ink bg-[#1a1025]'}`}
        >
          {phase === 'victory' && (
            <>
              <p className="font-display text-3xl text-medusa uppercase mb-1">Victoire !</p>
              <p className="font-mono text-sm text-bone">+{expReward} EXP gagné</p>
            </>
          )}
          {phase === 'defeat' && (
            <>
              <p className="font-display text-3xl text-astro-orange uppercase mb-1">Défaite</p>
              <p className="font-mono text-sm text-off-white">HP restauré à 1 au retour.</p>
            </>
          )}
          {phase === 'escaped' && (
            <p className="font-display text-2xl text-off-white uppercase">Fuite réussie</p>
          )}
          <Button variant="primary" onClick={endCombat} className="mt-4 w-full">
            Retour à la carte
          </Button>
        </div>
      )}
    </div>
  )
}
