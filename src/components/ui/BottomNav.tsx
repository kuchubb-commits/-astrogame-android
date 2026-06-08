import type { PlayTab } from '../../types/game'

interface NavItem {
  id: PlayTab
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'player', label: 'Personnage', icon: '◈' },
  { id: 'starship', label: 'Vaisseau', icon: '◇' },
]

interface BottomNavProps {
  active: PlayTab
  onChange: (tab: PlayTab) => void
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-astro-black border-t-2 border-astro-ink">
      <div className="max-w-2xl mx-auto flex">
        {NAV_ITEMS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`relative flex-1 flex flex-col items-center gap-1 py-3 transition-colors
              ${active === id ? 'text-accent' : 'text-off-white hover:text-bone'}`}
          >
            <span className="text-lg leading-none">{icon}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest">{label}</span>
            {active === id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-12 bg-accent rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
