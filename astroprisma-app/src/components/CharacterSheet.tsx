import { useState } from 'react'
import { StatsPanel } from './sheet/StatsPanel'
import { ResourcesPanel } from './sheet/ResourcesPanel'
import { StatusPanel } from './sheet/StatusPanel'
import { GearPanel } from './sheet/GearPanel'
import { StarshipPanel } from './sheet/StarshipPanel'

type Tab = 'perso' | 'status' | 'gear' | 'ship'

const TABS: { id: Tab; label: string }[] = [
  { id: 'perso', label: '👤 Perso' },
  { id: 'status', label: '⚡ Status' },
  { id: 'gear', label: '🎒 Gear' },
  { id: 'ship', label: '🚀 Vaisseau' },
]

export function CharacterSheet() {
  const [tab, setTab] = useState<Tab>('perso')

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white pb-8">
      {/* Tab bar */}
      <div className="sticky top-0 z-10 bg-[#0a0a0f]/95 backdrop-blur border-b border-slate-800">
        <div className="flex overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-3 text-xs tracking-widest uppercase whitespace-nowrap transition border-b-2 ${
                tab === t.id
                  ? 'border-purple-500 text-purple-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-6 flex flex-col gap-6">
        {tab === 'perso' && (
          <>
            <StatsPanel />
            <ResourcesPanel />
          </>
        )}
        {tab === 'status' && <StatusPanel />}
        {tab === 'gear' && <GearPanel />}
        {tab === 'ship' && <StarshipPanel />}
      </div>
    </div>
  )
}
