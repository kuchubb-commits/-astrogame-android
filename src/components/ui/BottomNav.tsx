import type { PlayTab } from '../../types/game'

interface NavItem {
  id: PlayTab
  label: string
  icon: string
}

const NAV_ITEMS: NavItem[] = [
  { id: 'player',   label: 'Perso',   icon: '◈' },
  { id: 'map',      label: 'Carte',   icon: '⬡' },
  { id: 'oracle',   label: 'Oracle',  icon: '◉' },
  { id: 'starship', label: 'Ship',    icon: '◇' },
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
            className={`relative flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors
              ${active === id ? 'text-accent' : 'text-off-white hover:text-bone'}`}
          >
            <span className="text-base leading-none">{icon}</span>
            <span className="font-mono text-[9px] uppercase tracking-wider">{label}</span>
            {active === id && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-10 bg-accent rounded-t-full" />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}
