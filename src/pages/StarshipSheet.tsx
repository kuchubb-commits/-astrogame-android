import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ResourceBar from '../components/ui/ResourceBar'
import { useGameStore } from '../stores/gameStore'
import starshipsData from '../../data/starships.json'

export default function StarshipSheet() {
  const starship = useGameStore((s) => s.starship)!
  const updateHull = useGameStore((s) => s.updateHull)
  const updateFuel = useGameStore((s) => s.updateFuel)
  const updateShields = useGameStore((s) => s.updateShields)
  const setCargoSlot = useGameStore((s) => s.setCargoSlot)
  const startStarshipCombat = useGameStore((s) => s.startStarshipCombat)
  const [showSelector, setShowSelector] = useState(false)

  const shipData = starshipsData.find((s) => s.id === starship.dataId)

  if (showSelector) {
    return (
      <div className="min-h-screen bg-astro-black px-4 pt-8 pb-24 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setShowSelector(false)} className="font-mono text-[10px] text-off-white hover:text-bone">← Retour</button>
          <h1 className="font-display text-2xl text-bone uppercase">Choisir l'ennemi</h1>
        </div>
        <div className="space-y-2">
          {(starshipsData as Array<{ id: string; name: string; class: string; hull: number; modules: string[]; skill: string; exp: number }>).map((s) => (
            <button
              key={s.id}
              onClick={() => { startStarshipCombat(s.id); setShowSelector(false) }}
              className="w-full text-left rounded-lg border-2 border-astro-ink bg-[#1a1025] hover:border-accent px-4 py-3 transition-all active:scale-95"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border border-astro-ink ${s.class === 'S' ? 'bg-accent text-bone' : s.class === 'A' ? 'bg-astro-yellow text-astro-black' : 'bg-[#130d1c] text-off-white'}`}>
                    Cl. {s.class}
                  </span>
                  <span className="font-display text-sm text-bone uppercase">{s.name}</span>
                </div>
                <div className="font-mono text-[10px] text-off-white text-right">
                  <div>Hull <span className="text-bone">{s.hull}</span></div>
                  <div className="text-astro-yellow">{s.exp} EXP</div>
                </div>
              </div>
              <p className="font-serif italic text-[10px] text-off-white opacity-60 mt-1">{s.skill}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-astro-black px-4 pt-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl text-bone uppercase tracking-wider">{starship.customName}</h1>
            {shipData && (
              <div className="flex items-center gap-2 mt-1">
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border border-astro-ink
                  ${shipData.class === 'S' ? 'bg-accent text-bone' : shipData.class === 'A' ? 'bg-astro-yellow text-astro-black' : 'bg-[#130d1c] text-off-white'}`}>
                  Classe {shipData.class}
                </span>
                <span className="font-mono text-[10px] text-off-white">
                  {shipData.actions} Actions/tour
                </span>
              </div>
            )}
          </div>
          <Button
            variant="primary"
            onClick={() => setShowSelector(true)}
            className="text-[10px] shrink-0"
          >
            ⚔ Combat
          </Button>
        </div>
        {shipData && (
          <p className="font-serif italic text-off-white text-sm mt-2">{shipData.skill}</p>
        )}
      </div>

      {/* Jauges */}
      <Card className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">État du vaisseau</p>
        <div className="space-y-4">
          <div>
            <ResourceBar label="HULL" value={starship.hull.current} max={starship.hull.max} />
            <div className="flex gap-2 mt-1 justify-end">
              <button onClick={() => updateHull(starship.hull.current - 1)} className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-bone hover:border-accent active:scale-95">−1</button>
              <button onClick={() => updateHull(starship.hull.current + 1)} className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-bone hover:border-accent active:scale-95">+1</button>
              <button onClick={() => updateHull(starship.hull.max)} className="font-mono text-[10px] px-2 py.5 rounded border border-astro-ink bg-[#130d1c] text-off-white hover:border-accent active:scale-95 ml-2">Full</button>
            </div>
          </div>
          <div>
            <ResourceBar label="FUEL" value={starship.fuel.current} max={starship.fuel.max} />
            <div className="flex gap-2 mt-1 justify-end">
              <button onClick={() => updateFuel(starship.fuel.current - 1)} className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-bone hover:border-accent active:scale-95">−1</button>
              <button onClick={() => updateFuel(starship.fuel.current + 1)} className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-bone hover:border-accent active:scale-95">+1</button>
              <button onClick={() => updateFuel(starship.fuel.max)} className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-off-white hover:border-accent active:scale-95 ml-2">Refuel</button>
            </div>
          </div>
        </div>
      </Card>

      {/* Boucliers */}
      <Card className="mb-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] uppercase tracking-widest text-off-white">Shields</p>
          <div className="flex items-center gap-3">
            <button onClick={() => updateShields(-1)} className="w-7 h-7 rounded border-2 border-astro-ink bg-[#1a1025] font-mono font-bold text-bone hover:border-accent active:scale-95">−</button>
            <span className="font-display text-3xl text-astro-yellow w-8 text-center">{starship.shields}</span>
            <button onClick={() => updateShields(1)} className="w-7 h-7 rounded border-2 border-astro-ink bg-[#1a1025] font-mono font-bold text-bone hover:border-accent active:scale-95">+</button>
          </div>
        </div>
        <div className="flex gap-1 mt-3">
          {Array.from({ length: Math.max(8, starship.shields) }).map((_, i) => (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full border border-astro-ink ${i < starship.shields ? 'bg-intersolar' : 'bg-[#130d1c]'}`}
            />
          ))}
        </div>
      </Card>

      {/* Modules */}
      <Card className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">
          Modules <span className="opacity-50">({starship.modules.length}/6)</span>
        </p>
        <div className="space-y-1.5">
          {starship.modules.map((mod, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#130d1c] border border-astro-ink">
              <span className="font-mono text-[9px] text-accent w-4">{i + 1}</span>
              <span className="font-mono text-xs text-bone">{mod}</span>
            </div>
          ))}
          {Array.from({ length: Math.max(0, 6 - starship.modules.length) }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#130d1c] border border-dashed border-astro-ink opacity-30">
              <span className="font-mono text-[9px] text-off-white w-4">{starship.modules.length + i + 1}</span>
              <span className="font-mono text-xs text-off-white">Slot vide</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Cargo */}
      <Card>
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">
          Cargo Hold <span className="opacity-50">({starship.cargo.filter(Boolean).length}/6)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {starship.cargo.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-off-white opacity-40 w-3">{i + 1}</span>
              <input
                type="text"
                value={item ?? ''}
                placeholder={`Cargo ${i + 1}…`}
                onChange={(e) => setCargoSlot(i, e.target.value || null)}
                className="flex-1 bg-[#130d1c] border-2 border-astro-ink rounded px-2 py-1.5 font-mono text-xs text-bone placeholder-off-white placeholder-opacity-30 focus:outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
