import { useState } from 'react'
import { challengeRoll, useDiceStore } from '../../stores/diceStore'

const STATS = ['VIG', 'GRA', 'MIN', 'TEC'] as const

export function DiceRoller() {
  const addEntry = useDiceStore((s) => s.addEntry)
  const [playerStat, setPlayerStat] = useState(0)
  const [challengeStat, setChallengeStat] = useState(0)
  const [selectedStat, setSelectedStat] = useState<string>('VIG')
  const [last, setLast] = useState<ReturnType<typeof challengeRoll> | null>(null)
  const [rolling, setRolling] = useState(false)

  function roll() {
    setRolling(true)
    setTimeout(() => {
      const res = challengeRoll(playerStat, challengeStat)
      setLast(res)
      setRolling(false)
      addEntry({
        type: 'challenge',
        label: `Challenge Roll (${selectedStat}+${playerStat} vs ${challengeStat})`,
        result: res.success ? 'SUCCÈS' : 'ÉCHEC',
        detail: `Joueur: ${res.playerDie}+${playerStat}=${res.playerTotal} | Défi: ${res.challengeDie}+${challengeStat}=${res.challengeTotal}`,
      })
    }, 300)
  }

  return (
    <div className="bg-[#111118] border border-slate-800 rounded-lg p-4 space-y-4">
      <h2 className="text-xs tracking-widest uppercase text-slate-400">Challenge Roll — 2d10</h2>

      {/* Stat selector */}
      <div className="flex gap-2">
        {STATS.map((s) => (
          <button
            key={s}
            onClick={() => setSelectedStat(s)}
            className={`flex-1 py-1.5 text-xs font-bold tracking-widest rounded border transition ${
              selectedStat === s
                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                : 'border-slate-700 text-slate-500 hover:border-slate-500'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Stat inputs */}
      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1">
          <span className="text-xs text-slate-500 tracking-widest uppercase">Votre stat</span>
          <input
            type="number"
            min={0}
            max={10}
            value={playerStat}
            onChange={(e) => setPlayerStat(Number(e.target.value))}
            className="w-full bg-transparent border border-slate-700 rounded px-3 py-2 text-white text-center text-lg font-bold focus:border-purple-500 outline-none"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs text-slate-500 tracking-widest uppercase">Défi (0 = env.)</span>
          <input
            type="number"
            min={0}
            max={10}
            value={challengeStat}
            onChange={(e) => setChallengeStat(Number(e.target.value))}
            className="w-full bg-transparent border border-slate-700 rounded px-3 py-2 text-white text-center text-lg font-bold focus:border-purple-500 outline-none"
          />
        </label>
      </div>

      {/* Roll button */}
      <button
        onClick={roll}
        disabled={rolling}
        className="w-full py-3 border border-purple-500 text-purple-300 text-sm font-bold tracking-widest uppercase rounded hover:bg-purple-500/20 active:scale-95 transition disabled:opacity-50"
      >
        {rolling ? '...' : '🎲 Lancer'}
      </button>

      {/* Result */}
      {last && !rolling && (
        <div className={`rounded border p-4 text-center space-y-1 ${
          last.success ? 'border-green-500/40 bg-green-500/10' : 'border-red-500/40 bg-red-500/10'
        }`}>
          <div className={`text-2xl font-black tracking-widest ${last.success ? 'text-green-400' : 'text-red-400'}`}>
            {last.success ? 'SUCCÈS' : 'ÉCHEC'}
          </div>
          <div className="text-xs text-slate-400">
            Joueur <span className="text-white font-bold">{last.playerDie}+{playerStat}={last.playerTotal}</span>
            {' '}vs Défi <span className="text-white font-bold">{last.challengeDie}+{challengeStat}={last.challengeTotal}</span>
          </div>
        </div>
      )}
    </div>
  )
}
