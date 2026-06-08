import { useState } from 'react'
import { roll } from '../../engine/dice'

type DieSides = 4 | 6 | 8 | 10 | 12 | 20

interface DiceButtonProps {
  sides: DieSides | '2d6' | 'd66'
  onRoll?: (result: number) => void
  className?: string
}

export default function DiceButton({ sides, onRoll, className = '' }: DiceButtonProps) {
  const [result, setResult] = useState<number | null>(null)

  function handleRoll() {
    let r: number
    if (sides === '2d6') {
      r = roll({ type: '2d6' }).total
    } else if (sides === 'd66') {
      r = roll({ type: 'd66' }).total
    } else {
      r = roll({ type: 'd', sides }).total
    }
    setResult(r)
    onRoll?.(r)
  }

  return (
    <button
      onClick={handleRoll}
      className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl border-2 border-astro-ink bg-[#1a1025] hover:border-accent hover:bg-[#1c1429] active:scale-95 transition-all ${className}`}
    >
      <span className="font-display text-xl text-bone leading-none">
        {result ?? '—'}
      </span>
      <span className="font-mono text-[9px] text-off-white mt-1">
        {sides === '2d6' ? '2d6' : sides === 'd66' ? 'd66' : `d${sides}`}
      </span>
    </button>
  )
}
