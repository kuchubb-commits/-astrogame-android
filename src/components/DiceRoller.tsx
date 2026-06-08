import { useState } from 'react'
import { roll, RollResult } from '../engine/dice'

const DICE_OPTIONS = [4, 6, 8, 10, 12, 20] as const

export default function DiceRoller() {
  const [history, setHistory] = useState<RollResult[]>([])

  function rollDie(sides: typeof DICE_OPTIONS[number]) {
    const result = roll({ type: 'd', sides })
    setHistory(prev => [result, ...prev].slice(0, 10))
  }

  function roll2d6() {
    const result = roll({ type: '2d6' })
    setHistory(prev => [result, ...prev].slice(0, 10))
  }

  function rollD66() {
    const result = roll({ type: 'd66' })
    setHistory(prev => [result, ...prev].slice(0, 10))
  }

  const last = history[0]

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <h2 className="text-2xl font-bold text-purple-400">Lanceur de dés</h2>

      {/* Résultat principal */}
      <div className="w-40 h-40 rounded-2xl bg-gray-800 border-2 border-purple-500 flex flex-col items-center justify-center">
        {last ? (
          <>
            <span className="text-5xl font-black text-white">{last.total}</span>
            <span className="text-sm text-gray-400 mt-1">{last.formula}</span>
            {last.rolls.length > 1 && (
              <span className="text-xs text-gray-500">[{last.rolls.join(', ')}]</span>
            )}
          </>
        ) : (
          <span className="text-gray-500 text-sm">—</span>
        )}
      </div>

      {/* Boutons dés standards */}
      <div className="flex flex-wrap gap-3 justify-center">
        {DICE_OPTIONS.map(sides => (
          <button
            key={sides}
            onClick={() => rollDie(sides)}
            className="w-14 h-14 rounded-xl bg-gray-800 border border-gray-600 hover:border-purple-400 hover:bg-gray-700 text-white font-bold transition-colors"
          >
            d{sides}
          </button>
        ))}
      </div>

      {/* Boutons spéciaux */}
      <div className="flex gap-3">
        <button
          onClick={roll2d6}
          className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 hover:border-purple-400 hover:bg-gray-700 text-white font-bold transition-colors"
        >
          2d6
        </button>
        <button
          onClick={rollD66}
          className="px-4 py-2 rounded-xl bg-gray-800 border border-gray-600 hover:border-purple-400 hover:bg-gray-700 text-white font-bold transition-colors"
        >
          d66
        </button>
      </div>

      {/* Historique */}
      {history.length > 1 && (
        <div className="w-full max-w-xs">
          <p className="text-xs text-gray-500 mb-2 text-center">Historique</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {history.slice(1).map((r, i) => (
              <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                {r.formula} → {r.total}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
