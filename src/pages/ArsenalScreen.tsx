import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useGameStore } from '../stores/gameStore'
import { findHackByName, getHackResolution } from '../engine/hackResolver'
import hacksData from '../../data/hacks.json'
import cybertechData from '../../data/cybertech.json'
import dronesData from '../../data/drones.json'

type Section = 'hacks' | 'cybertech' | 'drones'

const SECTION_LABELS: Record<Section, string> = {
  hacks: 'Hacks',
  cybertech: 'Cybertech',
  drones: 'Drones',
}

type Cybertech = typeof cybertechData[number]
type Drone = typeof dronesData[number]

function HacksSection() {
  const character = useGameStore((s) => s.character)!
  const equipHack = useGameStore((s) => s.equipHack)
  const [pickingSlot, setPickingSlot] = useState<string | null>(null)

  const loadedIds = new Set(
    character.memorySlots.filter(Boolean).map((s) => findHackByName(s)?.id)
  )

  function handleEquip(hackName: string) {
    const emptySlot = character.memorySlots.findIndex((s) => !s)
    if (emptySlot !== -1) {
      equipHack(hackName, emptySlot)
    } else {
      setPickingSlot(hackName)
    }
  }

  function handleReplaceSlot(slotIndex: number) {
    if (!pickingSlot) return
    equipHack(pickingSlot, slotIndex)
    setPickingSlot(null)
  }

  const activeHacks = character.memorySlots
    .map((slot, i) => {
      if (!slot) return null
      const hack = findHackByName(slot)
      return hack ? { slot, hack, slotIndex: i } : null
    })
    .filter(Boolean) as { slot: string; hack: typeof hacksData.hacks[number]; slotIndex: number }[]

  return (
    <div className="space-y-3">
      {/* Slot picker overlay */}
      {pickingSlot && (
        <div className="rounded-lg border border-accent bg-accent/10 px-3 py-3 mb-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-accent mb-2">
            Slots pleins — remplacer lequel ?
          </p>
          <div className="space-y-1">
            {character.memorySlots.map((slot, i) => (
              <button
                key={i}
                onClick={() => handleReplaceSlot(i)}
                className="w-full text-left rounded border border-astro-ink bg-[#130d1c] px-3 py-1.5 font-mono text-[10px] text-bone hover:border-accent transition-colors"
              >
                Slot {i + 1} : {slot || '—'}
              </button>
            ))}
          </div>
          <button onClick={() => setPickingSlot(null)} className="mt-2 font-mono text-[9px] text-off-white opacity-50">
            Annuler
          </button>
        </div>
      )}

      <p className="font-mono text-[10px] uppercase tracking-widest text-off-white">
        Memory Slots ({activeHacks.length}/3)
      </p>

      {activeHacks.length === 0 && (
        <p className="font-mono text-[11px] text-off-white opacity-50">
          Aucun hack chargé. Appuyez sur "Équiper" ci-dessous.
        </p>
      )}

      {activeHacks.map(({ hack, slotIndex }) => {
        const res = getHackResolution(hack.id)
        const costLabel = res
          ? res.energyCost > 0 ? `${res.energyCost} Energy` : `${res.hyperCost} Hyperdrive`
          : '?'
        return (
          <Card key={hack.id}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-[9px] text-off-white opacity-50">#{slotIndex + 1}</span>
                  <span className="font-display text-sm text-bone uppercase">{hack.name}</span>
                  {hack.isMaster && <span className="font-mono text-[9px] px-1.5 py-0.5 bg-accent text-bone rounded">MASTER</span>}
                  <span className="font-mono text-[9px] text-astro-yellow">{costLabel}</span>
                </div>
                <p className="font-mono text-[10px] text-off-white leading-relaxed">{hack.effect}</p>
              </div>
              <button
                onClick={() => equipHack('', slotIndex)}
                className="font-mono text-[9px] text-off-white opacity-40 hover:opacity-80 shrink-0"
              >
                ✕
              </button>
            </div>
          </Card>
        )
      })}

      <div className="mt-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-2">Tous les hacks</p>
        <div className="space-y-1">
          {hacksData.hacks.map((hack) => {
            const isLoaded = loadedIds.has(hack.id)
            return (
              <div key={hack.id} className="rounded border border-astro-ink bg-[#1a1025] px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-display text-xs text-bone uppercase">{hack.name}</span>
                    {hack.isMaster && <span className="font-mono text-[9px] px-1 py-0.5 bg-accent text-bone rounded">MASTER</span>}
                  </div>
                  <Button
                    variant={isLoaded ? 'secondary' : 'ghost'}
                    onClick={() => !isLoaded && handleEquip(hack.name)}
                    disabled={isLoaded}
                    className="text-[9px] shrink-0 py-1 px-2"
                  >
                    {isLoaded ? 'Chargé' : 'Équiper'}
                  </Button>
                </div>
                <p className="font-mono text-[9px] text-off-white opacity-70 mt-0.5 leading-relaxed">{hack.effect}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function CybertechSection() {
  const character = useGameStore((s) => s.character)!
  const installCybertech = useGameStore((s) => s.installCybertech)
  const removeCybertech = useGameStore((s) => s.removeCybertech)

  const installed = new Set(character.installedCybertech ?? [])
  const exp = character.resources.exp

  const TIER_COLORS: Record<number, string> = {
    1: 'text-medusa',
    2: 'text-astro-yellow',
    3: 'text-accent',
  }

  return (
    <div className="space-y-2">
      <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">
        Installé : {installed.size} implant{installed.size !== 1 ? 's' : ''} · EXP disponible : <span className="text-bone">{exp}</span>
      </p>
      {(cybertechData as Cybertech[]).map((cyb) => {
        const isInstalled = installed.has(cyb.id)
        const canAfford = isInstalled || exp >= (cyb as any).cost
        const hasBoost = Object.values(cyb.statBoost).some((v) => v > 0)
        const boostStr = hasBoost
          ? Object.entries(cyb.statBoost)
              .filter(([, v]) => v > 0)
              .map(([k, v]) => `+${v} ${k.toUpperCase()}`)
              .join(', ')
          : null
        return (
          <Card key={cyb.id} className={isInstalled ? 'border-accent/40' : ''}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-sm text-bone uppercase">{cyb.name}</span>
                  <span className={`font-mono text-[9px] ${TIER_COLORS[cyb.tier] ?? 'text-off-white'}`}>T{cyb.tier}</span>
                  {boostStr && <span className="font-mono text-[9px] text-medusa">{boostStr}</span>}
                  {!isInstalled && (
                    <span className={`font-mono text-[9px] ${canAfford ? 'text-astro-yellow' : 'text-off-white opacity-40'}`}>
                      {(cyb as any).cost} EXP
                    </span>
                  )}
                </div>
                <p className="font-mono text-[9px] text-off-white opacity-60">{cyb.manufacturer}</p>
                {cyb.passiveEffect && (
                  <p className="font-mono text-[10px] text-off-white mt-1 leading-relaxed">
                    <span className="text-astro-yellow">Passif :</span> {cyb.passiveEffect}
                  </p>
                )}
                {cyb.activeEffect && (
                  <p className="font-mono text-[10px] text-off-white mt-0.5 leading-relaxed">
                    <span className="text-accent">Actif :</span> {cyb.activeEffect}
                  </p>
                )}
              </div>
              <Button
                variant={isInstalled ? 'secondary' : 'ghost'}
                onClick={() => isInstalled ? removeCybertech(cyb.id) : installCybertech(cyb.id)}
                disabled={!isInstalled && !canAfford}
                className="text-[10px] shrink-0"
              >
                {isInstalled ? 'Retirer' : 'Installer'}
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

function droneName(raw: string): string {
  return raw.replace(/^DRONE_/i, '').replace(/_/g, ' ')
}

function DronesSection() {
  const character = useGameStore((s) => s.character)!
  const deployDrone = useGameStore((s) => s.deployDrone)
  const undeployDrone = useGameStore((s) => s.undeployDrone)
  const deployedId = character.deployedDroneId

  return (
    <div className="space-y-3">
      {deployedId && (
        <div className="rounded-lg border border-medusa bg-medusa/10 px-3 py-2 flex items-center justify-between">
          <p className="font-mono text-[10px] text-medusa uppercase tracking-wider">
            Drone déployé : {droneName((dronesData as Drone[]).find((d) => d.id === deployedId)?.name ?? deployedId)}
          </p>
          <Button variant="ghost" onClick={undeployDrone} className="text-[10px]">Rappeler</Button>
        </div>
      )}
      {(dronesData as Drone[]).map((drone) => {
        const isDeployed = drone.id === deployedId
        return (
          <Card key={drone.id} className={isDeployed ? 'border-medusa/40' : ''}>
            <div className="flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display text-sm text-bone uppercase">{droneName(drone.name)}</span>
                  {isDeployed && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 bg-medusa text-astro-black rounded">ACTIF</span>
                  )}
                </div>
                {drone.passiveAbility && (
                  <p className="font-mono text-[10px] text-off-white mb-2 leading-relaxed">
                    <span className="text-astro-yellow">Passif :</span> {drone.passiveAbility}
                  </p>
                )}
                <div className="space-y-1">
                  {drone.activeAbilities.map((ab, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="font-mono text-[9px] text-accent shrink-0">[{ab.cost}]</span>
                      <div>
                        <span className="font-mono text-[9px] text-bone">{ab.name} —</span>
                        <span className="font-mono text-[9px] text-off-white opacity-70"> {ab.effect}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Button
                variant={isDeployed ? 'secondary' : 'ghost'}
                onClick={() => isDeployed ? undeployDrone() : deployDrone(drone.id)}
                className="text-[10px] shrink-0"
                disabled={!isDeployed && !!deployedId}
              >
                {isDeployed ? 'Rappeler' : 'Déployer'}
              </Button>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

export default function ArsenalScreen() {
  const [section, setSection] = useState<Section>('hacks')

  return (
    <div className="min-h-screen bg-astro-black flex flex-col pb-20">
      {/* Header */}
      <div className="px-4 pt-4 pb-3">
        <h1 className="font-display text-2xl text-bone uppercase tracking-wider">Arsenal</h1>
        <p className="font-serif italic text-off-white text-sm">Hacks · Cybertech · Drones</p>
      </div>

      {/* Section tabs */}
      <div className="px-4 pb-3">
        <div className="flex gap-1 rounded-lg bg-[#1a1025] p-1">
          {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
            <button
              key={s}
              onClick={() => setSection(s)}
              className={`flex-1 font-mono text-[10px] uppercase tracking-wider rounded py-2 transition-colors
                ${section === s ? 'bg-accent text-bone' : 'text-off-white hover:text-bone'}`}
            >
              {SECTION_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 flex-1 overflow-y-auto">
        {section === 'hacks'    && <HacksSection />}
        {section === 'cybertech' && <CybertechSection />}
        {section === 'drones'   && <DronesSection />}
      </div>
    </div>
  )
}
