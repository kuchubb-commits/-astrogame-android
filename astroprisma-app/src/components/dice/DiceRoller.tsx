import { useState, useEffect } from 'react'
import { useCharacterStore } from '../../stores/characterStore'
import { useEnemyStore } from '../../stores/enemyStore'
import {
  initiativeRoll,
  challengeRoll,
  xxChallengeRoll,
  malwareRoll,
  useDiceStore,
  MALWARE_TABLE,
} from '../../stores/diceStore'

// ── Types de jets disponibles ─────────────────────────────────────────────────
type Mode = 'initiative' | 'challenge' | 'escape' | 'hack' | 'malware'

const MODES: { id: Mode; label: string; icon: string; desc: string }[] = [
  { id: 'initiative', label: 'Initiative', icon: '⚡', desc: 'd10 + GRA' },
  { id: 'challenge', label: 'Challenge', icon: '🎲', desc: 'd10+stat vs d10+stat' },
  { id: 'escape', label: 'Escape', icon: '🏃', desc: 'xROLL GRA vs ennemi' },
  { id: 'hack', label: 'Hack', icon: '💻', desc: 'xROLL MIN vs ennemi' },
  { id: 'malware', label: 'Malware', icon: '☠️', desc: 'd10 → table malware' },
]

// ── Résultat générique ────────────────────────────────────────────────────────
interface RollResult {
  success?: boolean
  mainText: string
  subText: string
  color: 'green' | 'red' | 'purple' | 'blue'
}

export function DiceRoller() {
  const addEntry = useDiceStore((s) => s.addEntry)
  const character = useCharacterStore((s) => s.character)
  const selectedEnemy = useEnemyStore((s) => s.selectedEnemy)

  const [mode, setMode] = useState<Mode>('initiative')
  const [challengeStat, setChallengeStat] = useState(0)

  // Sync challenge stat from selected enemy
  useEffect(() => {
    if (selectedEnemy) setChallengeStat(selectedEnemy.difficulty)
  }, [selectedEnemy])
  const [selectedStat, setSelectedStat] = useState<'vigor' | 'grace' | 'mind' | 'tech'>('vigor')
  const [xxMode, setXxMode] = useState(false)
  const [result, setResult] = useState<RollResult | null>(null)
  const [rolling, setRolling] = useState(false)

  // stat actuelle du personnage pour le mode sélectionné
  const autoStat: Record<Mode, number> = {
    initiative: character.grace,
    challenge: character[selectedStat],
    escape: character.grace,
    hack: character.mind,
    malware: 0,
  }

  const statLabel: Record<Mode, string> = {
    initiative: 'GRA',
    challenge: selectedStat.slice(0, 3).toUpperCase(),
    escape: 'GRA',
    hack: 'MIN',
    malware: '—',
  }

  function doRoll() {
    setRolling(true)
    setTimeout(() => {
      let res: RollResult

      if (mode === 'initiative') {
        const r = initiativeRoll(character.grace)
        res = {
          mainText: `${r.total}`,
          subText: `d10(${r.die}) + GRA(${r.gra})`,
          color: 'blue',
        }
        addEntry({ type: 'initiative', label: 'Initiative', result: `${r.total}`, detail: res.subText })
      }

      else if (mode === 'challenge') {
        const stat = character[selectedStat]
        const r = xxMode ? xxChallengeRoll(stat, challengeStat) : challengeRoll(stat, challengeStat)
        const prefix = xxMode ? 'xxROLL' : 'xROLL'
        res = {
          success: r.success,
          mainText: r.success ? 'SUCCÈS' : 'ÉCHEC',
          subText: xxMode
            ? `Joueur: d10(${r.playerDie})+${stat}=${r.playerTotal} | Défi: max(${(r as ReturnType<typeof xxChallengeRoll>).cd1},${(r as ReturnType<typeof xxChallengeRoll>).cd2})+${challengeStat}=${r.challengeTotal}`
            : `Joueur: d10(${r.playerDie})+${stat}=${r.playerTotal} | Défi: d10(${r.challengeDie})+${challengeStat}=${r.challengeTotal}`,
          color: r.success ? 'green' : 'red',
        }
        addEntry({ type: 'challenge', label: `${prefix} ${statLabel[mode]}`, result: res.mainText, detail: res.subText })
      }

      else if (mode === 'escape') {
        const r = challengeRoll(character.grace, challengeStat)
        res = {
          success: r.success,
          mainText: r.success ? 'FUITE RÉUSSIE' : 'ÉCHEC — reste en combat',
          subText: `GRA: d10(${r.playerDie})+${character.grace}=${r.playerTotal} | Défi: d10(${r.challengeDie})+${challengeStat}=${r.challengeTotal}`,
          color: r.success ? 'green' : 'red',
        }
        addEntry({ type: 'escape', label: 'Escape xROLL GRA', result: r.success ? 'FUITE OK' : 'ÉCHEC', detail: res.subText })
      }

      else if (mode === 'hack') {
        const r = challengeRoll(character.mind, challengeStat)
        res = {
          success: r.success,
          mainText: r.success ? 'HACK RÉUSSI' : 'HACK ÉCHOUÉ → Malware',
          subText: `MIN: d10(${r.playerDie})+${character.mind}=${r.playerTotal} | Défi: d10(${r.challengeDie})+${challengeStat}=${r.challengeTotal}`,
          color: r.success ? 'green' : 'red',
        }
        addEntry({ type: 'hack', label: 'Hack xROLL MIN', result: r.success ? 'RÉUSSI' : 'MALWARE', detail: res.subText })
        // Si échec → suggérer de lancer Malware
        if (!r.success) res.subText += ' — Lance Malware !'
      }

      else {
        const r = malwareRoll()
        res = {
          mainText: r.result,
          subText: `d10 = ${r.die}`,
          color: 'red',
        }
        addEntry({ type: 'malware', label: 'Malware', result: r.result, detail: res.subText })
      }

      setResult(res)
      setRolling(false)
    }, 250)
  }

  const colorClasses: Record<string, string> = {
    green: 'border-green-500/40 bg-green-500/10 text-green-400',
    red: 'border-red-500/40 bg-red-500/10 text-red-400',
    purple: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    blue: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
  }

  const needsChallengeStat = ['challenge', 'escape', 'hack'].includes(mode)
  const needsStatSelector = mode === 'challenge'

  return (
    <div className="bg-[#111118] border border-slate-800 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs tracking-widest uppercase text-slate-400">Jets de dés</h2>
        {selectedEnemy && (
          <span className="text-[10px] px-2 py-0.5 rounded border border-purple-700 text-purple-400 bg-purple-900/20">
            ⚔️ {selectedEnemy.name} (diff. {selectedEnemy.difficulty})
          </span>
        )}
      </div>

      {/* Mode selector */}
      <div className="grid grid-cols-3 gap-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => { setMode(m.id); setResult(null) }}
            className={`py-2 px-1 rounded border text-center transition ${
              mode === m.id
                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                : 'border-slate-800 text-slate-500 hover:border-slate-600 hover:text-slate-300'
            }`}
          >
            <div className="text-base">{m.icon}</div>
            <div className="text-xs font-bold tracking-wide mt-0.5">{m.label}</div>
            <div className="text-[10px] text-slate-600 mt-0.5">{m.desc}</div>
          </button>
        ))}
      </div>

      {/* Stat selector (Challenge only) */}
      {needsStatSelector && (
        <div className="space-y-1">
          <span className="text-xs text-slate-500 tracking-widest uppercase">Votre stat</span>
          <div className="flex gap-1">
            {(['vigor', 'grace', 'mind', 'tech'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSelectedStat(s)}
                className={`flex-1 py-1.5 rounded border text-xs font-bold transition ${
                  selectedStat === s
                    ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                    : 'border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
              >
                {s.slice(0, 3).toUpperCase()}
                <span className="block text-[10px] text-slate-400">{character[s]}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Stat auto-info (initiative, escape, hack) */}
      {!needsStatSelector && autoStat[mode] !== undefined && mode !== 'malware' && (
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/40 rounded px-3 py-2">
          <span>Stat auto :</span>
          <span className="font-bold text-white">{statLabel[mode]} = {autoStat[mode]}</span>
          <span className="text-slate-600">(depuis feuille de perso)</span>
        </div>
      )}

      {/* Challenge stat input */}
      {needsChallengeStat && (
        <label className="block space-y-1">
          <span className="text-xs text-slate-500 tracking-widest uppercase">Stat ennemi (0 = environnement)</span>
          <input
            type="number"
            min={0}
            max={10}
            value={challengeStat}
            onChange={(e) => setChallengeStat(Number(e.target.value))}
            className="w-full bg-transparent border border-slate-700 rounded px-3 py-2 text-white text-center text-lg font-bold focus:border-purple-500 outline-none"
          />
        </label>
      )}

      {/* xxROLL toggle (Challenge only) */}
      {mode === 'challenge' && (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setXxMode(x => !x)}
            className={`w-8 h-4 rounded-full transition ${xxMode ? 'bg-purple-500' : 'bg-slate-700'} relative`}
          >
            <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${xxMode ? 'left-4' : 'left-0.5'}`} />
          </div>
          <span className="text-xs text-slate-400">xxROLL — difficulté renforcée (défi = meilleur de 2d10)</span>
        </label>
      )}

      {/* Roll button */}
      <button
        onClick={doRoll}
        disabled={rolling}
        className="w-full py-3 border border-purple-500 text-purple-300 text-sm font-bold tracking-widest uppercase rounded hover:bg-purple-500/20 active:scale-95 transition disabled:opacity-50"
      >
        {rolling ? '…' : '🎲 Lancer'}
      </button>

      {/* Result */}
      {result && !rolling && (
        <div className={`rounded border p-4 text-center space-y-1 ${colorClasses[result.color]}`}>
          <div className="text-2xl font-black tracking-widest">{result.mainText}</div>
          <div className="text-xs text-slate-400">{result.subText}</div>
        </div>
      )}

      {/* Tables de référence rapide */}
      {mode === 'malware' && (
        <div className="text-xs text-slate-600 space-y-0.5">
          {MALWARE_TABLE.map((r, i) => (
            <div key={i} className="flex gap-2">
              <span className="w-4 text-right text-slate-700">{i + 1}</span>
              <span>{r}</span>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
