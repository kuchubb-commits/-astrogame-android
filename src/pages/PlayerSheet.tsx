import Card from '../components/ui/Card'
import ResourceBar from '../components/ui/ResourceBar'
import { useGameStore } from '../stores/gameStore'
import originsData from '../../data/origins.json'

function Counter({
  label,
  value,
  onDec,
  onInc,
  accent,
}: {
  label: string
  value: number
  onDec: () => void
  onInc: () => void
  accent?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="font-mono text-[10px] uppercase tracking-widest text-off-white">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={onDec}
          className="w-7 h-7 rounded border-2 border-astro-ink bg-[#1a1025] font-mono font-bold text-bone hover:border-accent active:scale-95"
        >
          −
        </button>
        <span className={`font-display text-2xl w-8 text-center ${accent ? 'text-accent' : 'text-bone'}`}>
          {value}
        </span>
        <button
          onClick={onInc}
          className="w-7 h-7 rounded border-2 border-astro-ink bg-[#1a1025] font-mono font-bold text-bone hover:border-accent active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  )
}

function SlotInput({
  value,
  placeholder,
  onChange,
}: {
  value: string | null
  placeholder: string
  onChange: (v: string | null) => void
}) {
  return (
    <input
      type="text"
      value={value ?? ''}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value || null)}
      className="w-full bg-[#130d1c] border-2 border-astro-ink rounded px-2 py-1.5 font-mono text-xs text-bone placeholder-off-white placeholder-opacity-30 focus:outline-none focus:border-accent"
    />
  )
}

function GaugeRow({
  label,
  bar,
}: {
  label: string
  bar: 'health' | 'energy' | 'armor' | 'hyperdrive'
}) {
  const character = useGameStore((s) => s.character)!
  const updateBar = useGameStore((s) => s.updateBar)
  const updateBarMax = useGameStore((s) => s.updateBarMax)
  const { current, max } = character[bar]

  return (
    <div>
      <ResourceBar label={label} value={current} max={max} />
      <div className="flex gap-2 mt-1 justify-end">
        <button
          onClick={() => updateBar(bar, current - 1)}
          className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-bone hover:border-accent active:scale-95"
        >
          −1
        </button>
        <button
          onClick={() => updateBar(bar, current + 1)}
          className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-bone hover:border-accent active:scale-95"
        >
          +1
        </button>
        <span className="font-mono text-[10px] text-off-white opacity-50 ml-1">max</span>
        <button
          onClick={() => updateBarMax(bar, max - 1)}
          className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-off-white hover:border-accent active:scale-95"
        >
          −
        </button>
        <button
          onClick={() => updateBarMax(bar, max + 1)}
          className="font-mono text-[10px] px-2 py-0.5 rounded border border-astro-ink bg-[#130d1c] text-off-white hover:border-accent active:scale-95"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default function PlayerSheet() {
  const character = useGameStore((s) => s.character)!
  const updateStat = useGameStore((s) => s.updateStat)
  const updateResource = useGameStore((s) => s.updateResource)
  const setInventorySlot = useGameStore((s) => s.setInventorySlot)
  const setWeaponSlot = useGameStore((s) => s.setWeaponSlot)
  const setMemorySlot = useGameStore((s) => s.setMemorySlot)
  const resetGame = useGameStore((s) => s.resetGame)

  const origin = originsData.find((o) => o.id === character.originId)

  return (
    <div className="min-h-screen bg-astro-black px-4 pt-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-3xl text-bone uppercase tracking-wider">{character.name}</h1>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
              {origin?.name ?? character.originId}
            </span>
          </div>
          <button
            onClick={() => {
              if (confirm('Réinitialiser la partie ?')) resetGame()
            }}
            className="font-mono text-[10px] uppercase px-2 py-1 rounded border border-astro-ink text-off-white hover:border-accent active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Stats */}
      <Card className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">Stats</p>
        <div className="grid grid-cols-4 gap-2">
          {(['vigor', 'grace', 'mind', 'tech'] as const).map((stat) => (
            <Counter
              key={stat}
              label={stat}
              value={character.stats[stat]}
              onDec={() => updateStat(stat, -1)}
              onInc={() => updateStat(stat, 1)}
            />
          ))}
        </div>
      </Card>

      {/* Jauges */}
      <Card className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">Ressources vitales</p>
        <div className="space-y-4">
          <GaugeRow label="HEALTH" bar="health" />
          <GaugeRow label="ENERGY" bar="energy" />
          <GaugeRow label="ARMOR" bar="armor" />
          <GaugeRow label="HYPERDRIVE" bar="hyperdrive" />
        </div>
      </Card>

      {/* Ressources économiques */}
      <Card className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">Ressources</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {(['exp', 'serum', 'scraps', 'favor'] as const).map((res) => (
            <Counter
              key={res}
              label={res}
              value={character.resources[res]}
              onDec={() => updateResource(res, -1)}
              onInc={() => updateResource(res, 1)}
              accent={res === 'exp'}
            />
          ))}
        </div>
      </Card>

      {/* Armes */}
      <Card className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">
          Armes <span className="opacity-50">({character.weapons.filter(Boolean).length}/3)</span>
        </p>
        <div className="space-y-2">
          {character.weapons.map((w, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-off-white opacity-50 w-4">{i + 1}</span>
              <SlotInput
                value={w}
                placeholder={`Arme ${i + 1}…`}
                onChange={(v) => setWeaponSlot(i, v)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Inventaire */}
      <Card className="mb-4">
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">
          Inventaire <span className="opacity-50">({character.inventory.filter(Boolean).length}/8)</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {character.inventory.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="font-mono text-[10px] text-off-white opacity-40 w-3">{i + 1}</span>
              <SlotInput
                value={item}
                placeholder={`Slot ${i + 1}…`}
                onChange={(v) => setInventorySlot(i, v)}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Memory Slots */}
      <Card>
        <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">
          Memory Slots <span className="opacity-50">(3)</span>
        </p>
        <div className="space-y-2">
          {character.memorySlots.map((m, i) => (
            <div key={i} className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-accent w-4">M{i + 1}</span>
              <input
                type="text"
                value={m}
                placeholder="Hack / Mémoire…"
                onChange={(e) => setMemorySlot(i, e.target.value)}
                className="flex-1 bg-[#130d1c] border-2 border-astro-ink rounded px-2 py-1.5 font-mono text-xs text-bone placeholder-off-white placeholder-opacity-30 focus:outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
