interface StatBlockProps {
  label: string
  value: number | string
  accent?: boolean
}

export default function StatBlock({ label, value, accent = false }: StatBlockProps) {
  return (
    <div className="flex flex-col items-center border-2 border-astro-ink rounded-lg p-3 bg-[#1a1025] min-w-[64px]">
      <span className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-1">
        {label}
      </span>
      <span className={`font-display text-3xl leading-none ${accent ? 'text-accent' : 'text-bone'}`}>
        {value}
      </span>
    </div>
  )
}
