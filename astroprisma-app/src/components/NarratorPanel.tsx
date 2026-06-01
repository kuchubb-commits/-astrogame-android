import { useState, useEffect, useRef } from 'react'
import { narrateAction, narrateOracle, geminiAvailable } from '../lib/gemini'
import type { NarrativeContext } from '../lib/gemini'

// ── Typewriter hook ───────────────────────────────────────────────────────────

function useTypewriter(text: string, speed = 28) {
  const [displayed, setDisplayed] = useState('')
  useEffect(() => {
    setDisplayed('')
    if (!text) return
    let i = 0
    const id = setInterval(() => {
      setDisplayed(text.slice(0, i + 1))
      i++
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return displayed
}

// ── NarratorPanel ─────────────────────────────────────────────────────────────

interface NarratorPanelProps {
  ctx: NarrativeContext | null
  oracleWord?: string | null
  characterName?: string
}

export function NarratorPanel({ ctx, oracleWord, characterName = 'Inconnu' }: NarratorPanelProps) {
  const [narration, setNarration] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const prevKey = useRef('')
  const displayed = useTypewriter(narration)

  useEffect(() => {
    const key = ctx
      ? `${ctx.action}|${ctx.outcome}`
      : oracleWord
      ? `oracle:${oracleWord}`
      : ''

    if (!key || key === prevKey.current) return
    prevKey.current = key

    setLoading(true)
    setError(null)
    setNarration('')

    const run = async () => {
      try {
        const text = ctx
          ? await narrateAction(ctx)
          : await narrateOracle(oracleWord!, characterName)
        setNarration(text)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur Gemini')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [ctx, oracleWord, characterName])

  if (!geminiAvailable) return null

  return (
    <div className="bg-[#0d0d1a] border border-purple-900/40 rounded-lg p-3 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-purple-400 text-[10px] uppercase tracking-widest font-bold">✦ Narrateur</span>
        {loading && (
          <span className="text-slate-500 text-[10px] animate-pulse">génération…</span>
        )}
      </div>

      {error && (
        <div className="text-red-400 text-xs opacity-70">{error}</div>
      )}

      {!loading && !error && displayed && (
        <p className="text-slate-300 text-sm leading-relaxed italic">
          {displayed}
          <span className="animate-pulse text-purple-400">|</span>
        </p>
      )}

      {!loading && !error && !displayed && (
        <p className="text-slate-600 text-xs italic">En attente d'une action…</p>
      )}
    </div>
  )
}
