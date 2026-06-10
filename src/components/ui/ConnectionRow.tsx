import type { Connection } from '../../types/game'
import { useGameStore } from '../../stores/gameStore'

export default function ConnectionRow({ conn, index }: { conn: Connection; index: number }) {
  const updateAffinity   = useGameStore((s) => s.updateConnectionAffinity)
  const removeConnection = useGameStore((s) => s.removeConnection)
  const recruitCrew      = useGameStore((s) => s.recruitCrew)
  const character        = useGameStore((s) => s.character)

  const canRecruit = conn.affinity >= 5 && (character?.crewmembers?.length ?? 0) < 4

  return (
    <div className="flex items-center gap-2 rounded-lg border border-astro-ink bg-[#1a1025] px-2 py-1.5">
      {/* Name */}
      <span className="font-mono text-[10px] text-bone w-28 truncate">{conn.name || '—'}</span>

      {/* Location */}
      <span className="font-mono text-[9px] text-off-white opacity-60 w-20 truncate">{conn.location || '—'}</span>

      {/* Data */}
      <span className="font-mono text-[9px] text-off-white opacity-50 flex-1 truncate">{conn.data || '—'}</span>

      {/* Affinity hexagons */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => updateAffinity(index, -1)}
          className="w-4 h-4 font-mono text-[9px] text-off-white/40 hover:text-bone active:scale-95"
        >−</button>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => updateAffinity(index, n > conn.affinity ? 1 : -1)}
            className={`w-4 h-4 flex items-center justify-center font-display text-[10px] transition-all active:scale-95
              ${n <= conn.affinity ? 'text-accent' : 'text-astro-ink'}`}
            title={`Affinité ${n}/5`}
          >
            ⬡
          </button>
        ))}
        <button
          onClick={() => updateAffinity(index, 1)}
          className="w-4 h-4 font-mono text-[9px] text-off-white/40 hover:text-bone active:scale-95"
        >+</button>
      </div>

      {/* Recruit or Remove */}
      {canRecruit ? (
        <button
          onClick={() => recruitCrew({
            name: conn.name,
            role: 'pilot',
            passiveSkill: '',
            activeSkills: [],
            hp: { current: 20, max: 20 },
            stats: { vigor: 0, grace: 0, mind: 0, tech: 0 },
            inventory: [null, null, null, null],
          })}
          className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-accent text-accent hover:bg-accent/10 active:scale-95 shrink-0"
        >
          Recruter
        </button>
      ) : (
        <button
          onClick={() => removeConnection(index)}
          className="font-mono text-[8px] px-1.5 py-0.5 rounded border border-astro-ink text-off-white/30 hover:border-astro-orange hover:text-astro-orange active:scale-95 shrink-0"
        >
          ×
        </button>
      )}
    </div>
  )
}
