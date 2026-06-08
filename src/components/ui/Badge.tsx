type Faction = 'warg' | 'medusa' | 'wire' | 'intersolar' | 'synth'

interface BadgeProps {
  faction: Faction
  label?: string
}

const FACTION_STYLES: Record<Faction, { bg: string; label: string }> = {
  warg:       { bg: 'bg-warg',       label: 'W.A.R.G.' },
  medusa:     { bg: 'bg-medusa',     label: 'Medusa' },
  wire:       { bg: 'bg-wire',       label: 'Wire' },
  intersolar: { bg: 'bg-intersolar', label: 'Intersolar' },
  synth:      { bg: 'bg-synth',      label: 'Synth Arch' },
}

export default function Badge({ faction, label }: BadgeProps) {
  const { bg, label: defaultLabel } = FACTION_STYLES[faction]
  return (
    <span className={`${bg} text-astro-black font-mono font-bold text-[10px] uppercase tracking-widest px-2 py-1 rounded-full border-2 border-astro-ink`}>
      {label ?? defaultLabel}
    </span>
  )
}
