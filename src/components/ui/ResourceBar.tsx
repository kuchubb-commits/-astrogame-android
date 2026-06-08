interface ResourceBarProps {
  label: string
  value: number
  max: number
}

export default function ResourceBar({ label, value, max }: ResourceBarProps) {
  const pct = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0

  const barColor =
    pct < 0.3 ? 'bg-astro-orange' :
    pct < 0.6 ? 'bg-astro-yellow' :
    'bg-medusa'

  return (
    <div className="w-full">
      <div className="flex justify-between items-baseline mb-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-off-white">{label}</span>
        <span className="font-mono text-xs text-bone">{value}/{max}</span>
      </div>
      <div className="h-3 rounded-full bg-[#1a1025] border-2 border-astro-ink overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${barColor}`}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
    </div>
  )
}
