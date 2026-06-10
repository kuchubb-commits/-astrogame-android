import type { Crewmember } from '../../types/game'
import { useGameStore } from '../../stores/gameStore'

const ROLE_LABELS: Record<Crewmember['role'], string> = {
  'pilot':               'Pilote',
  'medic':               'Médecin',
  'mechanic-navigator':  'Mécanicien / Nav.',
  'gunner-marine':       'Artilleur / Marine',
}

export default function CrewCard({ crew, index }: { crew: Crewmember; index: number }) {
  const updateCrewHp       = useGameStore((s) => s.updateCrewHp)
  const updateCrewStat     = useGameStore((s) => s.updateCrewStat)
  const setCrewInventory   = useGameStore((s) => s.setCrewInventorySlot)
  const dismissCrew        = useGameStore((s) => s.dismissCrew)

  return (
    <div className="rounded-lg border-2 border-astro-ink bg-[#1a1025] p-3 space-y-2">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[9px] text-accent opacity-60">#{index + 1}</span>
            <span className="font-display text-sm text-bone uppercase">{crew.name}</span>
          </div>
          <span className="font-mono text-[9px] text-off-white opacity-60">{ROLE_LABELS[crew.role]}</span>
        </div>
        <button
          onClick={() => dismissCrew(index)}
          className="font-mono text-[9px] text-astro-orange border border-astro-orange/40 px-1.5 py-0.5 rounded hover:bg-astro-orange/10 active:scale-95"
        >
          Licencier
        </button>
      </div>

      {/* HP */}
      <div className="flex items-center gap-2">
        <span className="font-mono text-[9px] text-off-white opacity-60 w-7">HP</span>
        <button
          onClick={() => updateCrewHp(index, crew.hp.current - 1)}
          className="w-6 h-6 rounded border border-astro-ink bg-[#130d1c] font-mono text-xs text-bone hover:border-accent active:scale-95"
        >−</button>
        <span className={`font-mono text-sm w-12 text-center ${crew.hp.current <= Math.floor(crew.hp.max / 2) ? 'text-astro-orange' : 'text-bone'}`}>
          {crew.hp.current}/{crew.hp.max}
        </span>
        <button
          onClick={() => updateCrewHp(index, crew.hp.current + 1)}
          className="w-6 h-6 rounded border border-astro-ink bg-[#130d1c] font-mono text-xs text-bone hover:border-accent active:scale-95"
        >+</button>
      </div>

      {/* Stats VIG/GRA/MIN/TEC */}
      <div className="grid grid-cols-4 gap-1">
        {(['vigor', 'grace', 'mind', 'tech'] as const).map((stat) => (
          <div key={stat} className="flex flex-col items-center gap-0.5">
            <span className="font-mono text-[8px] text-off-white opacity-50 uppercase">{stat.slice(0, 3)}</span>
            <div className="flex items-center gap-0.5">
              <button
                onClick={() => updateCrewStat(index, stat, -1)}
                className="w-4 h-4 rounded border border-astro-ink bg-[#130d1c] font-mono text-[9px] text-bone leading-none hover:border-accent active:scale-95"
              >−</button>
              <span className="font-mono text-xs text-bone w-4 text-center">{crew.stats[stat]}</span>
              <button
                onClick={() => updateCrewStat(index, stat, 1)}
                className="w-4 h-4 rounded border border-astro-ink bg-[#130d1c] font-mono text-[9px] text-bone leading-none hover:border-accent active:scale-95"
              >+</button>
            </div>
          </div>
        ))}
      </div>

      {/* Passive */}
      <div>
        <span className="font-mono text-[8px] uppercase text-off-white opacity-50">Passif</span>
        <p className="font-mono text-[10px] text-bone mt-0.5">{crew.passiveSkill || '—'}</p>
      </div>

      {/* Active Skills */}
      <div>
        <span className="font-mono text-[8px] uppercase text-off-white opacity-50">Compétences actives</span>
        <div className="space-y-0.5 mt-0.5">
          {[0, 1, 2].map((i) => (
            <p key={i} className="font-mono text-[10px] text-bone">
              {crew.activeSkills[i] || <span className="opacity-30">Vide</span>}
            </p>
          ))}
        </div>
      </div>

      {/* Inventory (4 slots) */}
      <div>
        <span className="font-mono text-[8px] uppercase text-off-white opacity-50">Inventaire</span>
        <div className="grid grid-cols-2 gap-1 mt-0.5">
          {[0, 1, 2, 3].map((si) => (
            <div key={si} className="flex items-center gap-1">
              <span className="font-mono text-[8px] text-off-white opacity-30 w-3">{si + 1}</span>
              <input
                type="text"
                value={crew.inventory[si] ?? ''}
                placeholder="—"
                onChange={(e) => setCrewInventory(index, si, e.target.value || null)}
                className="flex-1 bg-[#130d1c] border border-astro-ink rounded px-1.5 py-1 font-mono text-[9px] text-bone placeholder-off-white/20 focus:outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
