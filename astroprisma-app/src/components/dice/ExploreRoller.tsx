import { useState } from 'react'
import { d6, useDiceStore } from '../../stores/diceStore'
import type { Ring } from '../../data/exploration'
import {
  EXPLORATION_D6,
  HOSTILE_ENCOUNTERS,
  NEUTRAL_ENCOUNTERS,
  RING_EVENTS,
  RING_LABELS,
  RING_DESCRIPTIONS,
} from '../../data/exploration'

// ── Helpers ───────────────────────────────────────────────────────────────────

function rollD(max: number) {
  return Math.floor(Math.random() * max) + 1
}

// ── Composant ─────────────────────────────────────────────────────────────────

type SubRoll = { label: string; die: number; result: string; detail: string } | null

export function ExploreRoller() {
  const addEntry = useDiceStore((s) => s.addEntry)
  const [ring, setRing] = useState<Ring>('outer')
  const [mainResult, setMainResult] = useState<{ die: number; label: string } | null>(null)
  const [subRoll, setSubRoll] = useState<SubRoll>(null)
  const [rolling, setRolling] = useState(false)

  const RING_STYLES: Record<Ring, { active: string; bg: string; text: string }> = {
    outer: { active: 'border-slate-400 bg-slate-800/60 text-slate-200', bg: 'bg-slate-900/40', text: 'text-slate-300' },
    middle: { active: 'border-green-500 bg-green-900/40 text-green-200', bg: 'bg-green-900/20', text: 'text-green-300' },
    inner:  { active: 'border-orange-500 bg-orange-900/40 text-orange-200', bg: 'bg-orange-900/20', text: 'text-orange-300' },
  }

  function doMainRoll() {
    setRolling(true)
    setSubRoll(null)
    setTimeout(() => {
      const die = d6()
      const label = EXPLORATION_D6[die - 1]
      setMainResult({ die, label })
      addEntry({ type: 'exploration', label: `Exploration Roll — ${RING_LABELS[ring]}`, result: label, detail: `d6 = ${die}` })
      setRolling(false)
    }, 250)
  }

  function doSubRoll(type: 'hostile' | 'neutral' | 'ring-event' | 'faction') {
    let die: number
    let result: string
    let label: string

    if (type === 'hostile') {
      die = rollD(12)
      result = HOSTILE_ENCOUNTERS[die - 1] ?? 'Résultat inconnu'
      label = 'Hostile Encounter — d12'
    } else if (type === 'neutral') {
      die = rollD(12)
      result = NEUTRAL_ENCOUNTERS[die - 1] ?? 'Résultat inconnu'
      label = 'Neutral Encounter — d12'
    } else if (type === 'ring-event') {
      const events = RING_EVENTS[ring]
      die = rollD(events.length)
      const ev = events[die - 1]
      result = ev ? `${ev.title} — ${ev.desc}` : 'Résultat inconnu'
      label = `${RING_LABELS[ring]} Event — d${events.length}`
    } else {
      die = rollD(12)
      result = `Faction Encounter ${die} — voir p.92 du Core Book`
      label = 'Faction Encounter — d12'
    }

    setSubRoll({ label, die, result, detail: `d${type === 'ring-event' ? RING_EVENTS[ring].length : 12} = ${die}` })
    addEntry({ type: 'exploration', label, result: result.slice(0, 50), detail: `dé = ${die}` })
  }

  const currentStyle = RING_STYLES[ring]

  return (
    <div className="bg-[#111118] border border-slate-800 rounded-lg p-4 space-y-4">
      <h2 className="text-xs tracking-widest uppercase text-slate-400">Exploration</h2>

      {/* Ring selector */}
      <div className="space-y-1">
        <span className="text-xs text-slate-500 tracking-widest uppercase">Zone du vaisseau</span>
        <div className="grid grid-cols-3 gap-1">
          {(['outer', 'middle', 'inner'] as Ring[]).map((r) => (
            <button
              key={r}
              onClick={() => { setRing(r); setMainResult(null); setSubRoll(null) }}
              className={`py-2 px-1 rounded border text-center transition ${
                ring === r ? RING_STYLES[r].active : 'border-slate-800 text-slate-600 hover:border-slate-600'
              }`}
            >
              <div className="text-xs font-bold tracking-wide">{RING_LABELS[r]}</div>
              <div className="text-[10px] text-slate-600 mt-0.5 leading-tight">{RING_DESCRIPTIONS[r].split('—')[1]?.trim()}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Exploration Roll */}
      <button
        onClick={doMainRoll}
        disabled={rolling}
        className="w-full py-3 border border-purple-500 text-purple-300 text-sm font-bold tracking-widest uppercase rounded hover:bg-purple-500/20 active:scale-95 transition disabled:opacity-50"
      >
        {rolling ? '…' : '🌌 Exploration Roll (d6)'}
      </button>

      {/* Résultat principal */}
      {mainResult && !rolling && (
        <div className={`rounded border p-3 space-y-2 ${currentStyle.bg} border-slate-700`}>
          <div className="flex items-center justify-between">
            <span className={`text-lg font-black tracking-wide ${currentStyle.text}`}>{mainResult.label}</span>
            <span className="text-xs text-slate-600">d6 = {mainResult.die}</span>
          </div>

          {/* Sous-jet selon résultat */}
          <div className="flex flex-wrap gap-1 pt-1">
            {mainResult.label === 'Hostile Encounter' && (
              <SubButton label="Lancer Hostile (d12)" onClick={() => doSubRoll('hostile')} color="red" />
            )}
            {mainResult.label === 'Neutral Encounter' && (
              <SubButton label="Lancer Neutral (d12)" onClick={() => doSubRoll('neutral')} color="blue" />
            )}
            {mainResult.label === 'Ring Event' && (
              <SubButton label={`Lancer ${RING_LABELS[ring]} Event`} onClick={() => doSubRoll('ring-event')} color="purple" />
            )}
            {mainResult.label === 'Faction Encounter' && (
              <SubButton label="Lancer Faction (d12)" onClick={() => doSubRoll('faction')} color="yellow" />
            )}
            {mainResult.label === 'Planet' && (
              <p className="text-xs text-slate-500">Voir tables de planètes du Core Book (p.73+)</p>
            )}
            {mainResult.label === 'Settlement' && (
              <p className="text-xs text-slate-500">Un Settlement de la faction dominante est découvert.</p>
            )}
          </div>
        </div>
      )}

      {/* Résultat sous-jet */}
      {subRoll && (
        <div className="rounded border border-slate-700 bg-slate-900/60 p-3 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500 tracking-widest uppercase">{subRoll.label}</span>
            <span className="text-xs text-slate-600">{subRoll.detail}</span>
          </div>
          <p className="text-sm text-white leading-snug">{subRoll.result}</p>
        </div>
      )}

      {/* Légende ring */}
      <div className={`text-xs rounded p-2 ${currentStyle.bg} ${currentStyle.text} opacity-70`}>
        {RING_DESCRIPTIONS[ring]}
      </div>
    </div>
  )
}

function SubButton({ label, onClick, color }: { label: string; onClick: () => void; color: string }) {
  const colors: Record<string, string> = {
    red:    'border-red-700 text-red-400 hover:bg-red-500/20',
    blue:   'border-blue-700 text-blue-400 hover:bg-blue-500/20',
    purple: 'border-purple-700 text-purple-400 hover:bg-purple-500/20',
    yellow: 'border-yellow-700 text-yellow-400 hover:bg-yellow-500/20',
  }
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded border text-xs font-bold transition ${colors[color] ?? colors.purple}`}
    >
      {label}
    </button>
  )
}
