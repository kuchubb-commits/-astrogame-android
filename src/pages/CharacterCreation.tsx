import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { useGameStore } from '../stores/gameStore'
import type { Character, Starship } from '../types/game'
import originsData from '../../data/origins.json'
import starshipsData from '../../data/starships.json'
import namesData from '../../data/names.json'

type Origin = typeof originsData[number]
type Ship = typeof starshipsData[number]

const STEP_ORIGIN = 0
const STEP_SHIP = 1
const STEP_NAME = 2

function randomName(): string {
  const pools = [
    ...namesData.character.feminine,
    ...namesData.character.neutral,
    ...namesData.character.masculine,
  ]
  return pools[Math.floor(Math.random() * pools.length)]
}

function buildCharacter(origin: Origin, name: string): Character {
  return {
    name,
    originId: origin.id,
    stats: { ...origin.stats },
    health: { current: 12, max: 12 },
    energy: { current: 8, max: 8 },
    armor: { current: 0, max: 0 },
    hyperdrive: { current: 4, max: 4 },
    inventory: origin.startingGear.map((g) => g).concat(Array(8).fill(null)).slice(0, 8),
    weapons: origin.startingWeapon
      ? [origin.startingWeapon, null, null]
      : [null, null, null],
    memorySlots: ['', '', ''],
    resources: { exp: 0, serum: 3, scraps: 0, favor: 0 },
  }
}

function buildStarship(ship: Ship): Starship {
  return {
    dataId: ship.id,
    customName: ship.name,
    hull: { current: ship.hull, max: ship.hull },
    fuel: { current: 10, max: 10 },
    cargo: Array(6).fill(null),
    modules: ship.modules,
    shields: 0,
  }
}

export default function CharacterCreation() {
  const startGame = useGameStore((s) => s.startGame)
  const [step, setStep] = useState(STEP_ORIGIN)
  const [selectedOrigin, setSelectedOrigin] = useState<Origin | null>(null)
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null)
  const [name, setName] = useState('')

  function confirm() {
    if (!selectedOrigin || !selectedShip || !name.trim()) return
    startGame(buildCharacter(selectedOrigin, name.trim()), buildStarship(selectedShip))
  }

  return (
    <div className="min-h-screen bg-astro-black px-4 py-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-4xl text-bone uppercase tracking-wider">Création</h1>
        <p className="font-serif italic text-off-white mt-1">Spaceborne</p>
        {/* Step indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {['Origin', 'Vaisseau', 'Identité'].map((label, i) => (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full border-2 border-astro-ink flex items-center justify-center font-mono text-[10px] font-bold
                  ${i < step ? 'bg-medusa text-astro-black' : i === step ? 'bg-accent text-bone' : 'bg-[#1a1025] text-off-white'}`}
              >
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`font-mono text-[10px] uppercase tracking-widest ${i === step ? 'text-bone' : 'text-off-white opacity-50'}`}>
                {label}
              </span>
              {i < 2 && <div className="w-4 h-px bg-off-white opacity-30" />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 0 — Origin */}
      {step === STEP_ORIGIN && (
        <div>
          <h2 className="font-display text-xl text-accent uppercase tracking-widest mb-4">Choisir une Origin</h2>
          <div className="space-y-3">
            {originsData.map((origin) => (
              <button
                key={origin.id}
                onClick={() => setSelectedOrigin(origin)}
                className={`w-full text-left rounded-lg border-2 p-4 transition-all
                  ${selectedOrigin?.id === origin.id
                    ? 'border-accent bg-[#2a1030]'
                    : 'border-astro-ink bg-[#1a1025] hover:border-off-white'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-display text-lg text-bone uppercase">{origin.name}</p>
                    <p className="font-mono text-[11px] text-off-white mt-1 leading-relaxed">{origin.description}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {origin.startingGear.map((g, i) => (
                        <span key={i} className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-[#130d1c] border border-astro-ink text-off-white">
                          {g}
                        </span>
                      ))}
                      {origin.startingWeapon && (
                        <span className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-accent text-bone border border-accent-deep">
                          {origin.startingWeapon}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    {(['vigor', 'grace', 'mind', 'tech'] as const).map((stat) => (
                      origin.stats[stat] > 0 && (
                        <div key={stat} className="font-mono text-[10px] uppercase text-astro-yellow">
                          {stat} +{origin.stats[stat]}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button variant="primary" disabled={!selectedOrigin} onClick={() => setStep(STEP_SHIP)}>
              Suivant →
            </Button>
          </div>
        </div>
      )}

      {/* Step 1 — Starship */}
      {step === STEP_SHIP && (
        <div>
          <h2 className="font-display text-xl text-accent uppercase tracking-widest mb-4">Choisir un Vaisseau</h2>
          <div className="space-y-2">
            {starshipsData.map((ship) => (
              <button
                key={ship.id}
                onClick={() => setSelectedShip(ship)}
                className={`w-full text-left rounded-lg border-2 p-3 transition-all
                  ${selectedShip?.id === ship.id
                    ? 'border-accent bg-[#2a1030]'
                    : 'border-astro-ink bg-[#1a1025] hover:border-off-white'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-display text-base text-bone uppercase">{ship.name}</p>
                      <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border border-astro-ink
                        ${ship.class === 'S' ? 'bg-accent text-bone' : ship.class === 'A' ? 'bg-astro-yellow text-astro-black' : 'bg-[#130d1c] text-off-white'}`}>
                        Classe {ship.class}
                      </span>
                    </div>
                    <p className="font-mono text-[10px] text-off-white mt-1 leading-relaxed">{ship.skill}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {ship.modules.map((m, i) => (
                        <span key={i} className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-[#130d1c] border border-astro-ink text-off-white">
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 text-right font-mono text-[10px] text-off-white space-y-0.5">
                    <div>Hull <span className="text-bone font-bold">{ship.hull}</span></div>
                    <div>Actions <span className="text-bone font-bold">{ship.actions}</span></div>
                    <div className="text-astro-yellow">{ship.cost} Scope</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(STEP_ORIGIN)}>← Retour</Button>
            <Button variant="primary" disabled={!selectedShip} onClick={() => setStep(STEP_NAME)}>
              Suivant →
            </Button>
          </div>
        </div>
      )}

      {/* Step 2 — Name */}
      {step === STEP_NAME && (
        <div>
          <h2 className="font-display text-xl text-accent uppercase tracking-widest mb-6">Ton identité</h2>

          {selectedOrigin && (
            <Card className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-1">Origin choisie</p>
              <p className="font-display text-xl text-bone uppercase">{selectedOrigin.name}</p>
            </Card>
          )}

          {selectedShip && (
            <Card className="mb-6">
              <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-1">Vaisseau</p>
              <p className="font-display text-xl text-bone uppercase">{selectedShip.name}</p>
              <p className="font-mono text-[10px] text-off-white mt-1">{selectedShip.skill}</p>
            </Card>
          )}

          <div className="mb-6">
            <label className="font-mono text-[10px] uppercase tracking-widest text-off-white block mb-2">
              Nom du Spaceborne
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entrer un nom..."
                className="flex-1 bg-[#1a1025] border-2 border-astro-ink rounded-lg px-3 py-2 font-mono text-base text-bone placeholder-off-white placeholder-opacity-40 focus:outline-none focus:border-accent"
              />
              <Button variant="secondary" onClick={() => setName(randomName())}>
                Aléatoire
              </Button>
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="ghost" onClick={() => setStep(STEP_SHIP)}>← Retour</Button>
            <Button variant="primary" disabled={!name.trim()} onClick={confirm}>
              Jouer →
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
