import { useState, useEffect } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { rollOracle, RESULT_COLOR } from '../engine/oracle'
import type { OracleResult } from '../engine/oracle'
import { generateNarration, getApiKey, setApiKey } from '../ai/gemini'
import { useGameStore } from '../stores/gameStore'

interface OracleEntry {
  id: number
  question: string
  result: OracleResult
  narration: string | null
}

export default function OracleScreen() {
  const character = useGameStore((s) => s.character)
  const mapData = useGameStore((s) => s.mapData)
  const playerHexId = mapData?.playerHexId ?? 'I1'
  const currentHex = mapData?.hexes[playerHexId]

  const [question, setQuestion] = useState('')
  const [current, setCurrent] = useState<OracleResult | null>(null)
  const [narration, setNarration] = useState<string | null>(null)
  const [narrating, setNarrating] = useState(false)
  const [history, setHistory] = useState<OracleEntry[]>([])
  const [apiKey, setApiKeyState] = useState(getApiKey)
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  const hasKey = apiKey.length > 10

  function handleRoll() {
    const result = rollOracle()
    setCurrent(result)
    setNarration(null)
    setApiError(null)
  }

  async function handleNarrate() {
    if (!current || !character) return
    setNarrating(true)
    setApiError(null)
    try {
      const ctx = {
        characterName: character.name,
        originId: character.originId,
        hexId: playerHexId,
        ring: currentHex?.ring ?? 'inner',
        discoveryType: currentHex?.discoveryType ?? null,
        discoveryText: currentHex?.discoveryText ?? null,
        oracleResult: current.result,
        oracleKeyword: current.keyword,
        question,
      }
      const text = await generateNarration(ctx)
      setNarration(text)
      // Save to history
      setHistory((prev) => [
        { id: Date.now(), question, result: current, narration: text },
        ...prev,
      ].slice(0, 10))
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      if (msg === 'no-key') {
        setApiError('Aucune clé API Gemini configurée.')
        setShowKeyInput(true)
      } else {
        setApiError(msg)
      }
    } finally {
      setNarrating(false)
    }
  }

  function confirmRollAndSave() {
    if (!current) return
    setHistory((prev) => [
      { id: Date.now(), question, result: current, narration },
      ...prev,
    ].slice(0, 10))
    setCurrent(null)
    setNarration(null)
    setQuestion('')
  }

  function saveKey(k: string) {
    setApiKey(k)
    setApiKeyState(k)
    setShowKeyInput(false)
  }

  const color = current ? (RESULT_COLOR[current.result] ?? '#f0eee8') : '#f0eee8'

  return (
    <div className="min-h-screen bg-astro-black px-4 pt-6 pb-24 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl text-bone uppercase tracking-wider">Oracle</h1>
          <p className="font-serif italic text-off-white text-sm">Consulter le destin</p>
        </div>
        <button
          onClick={() => setShowKeyInput((v) => !v)}
          className={`font-mono text-[10px] uppercase px-2 py-1 rounded border active:scale-95
            ${hasKey ? 'border-medusa text-medusa' : 'border-astro-orange text-astro-orange'}`}
        >
          {hasKey ? 'IA ✓' : 'IA ?'}
        </button>
      </div>

      {/* API key input */}
      {showKeyInput && (
        <Card className="mb-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-2">Clé API Gemini</p>
          <div className="flex gap-2">
            <input
              type="password"
              defaultValue={apiKey}
              placeholder="AIza..."
              id="gemini-key-input"
              className="flex-1 bg-[#130d1c] border-2 border-astro-ink rounded px-2 py-1.5 font-mono text-xs text-bone placeholder-off-white placeholder-opacity-30 focus:outline-none focus:border-accent"
            />
            <Button
              variant="secondary"
              onClick={() => {
                const el = document.getElementById('gemini-key-input') as HTMLInputElement
                saveKey(el?.value ?? '')
              }}
            >
              OK
            </Button>
          </div>
          <p className="font-mono text-[9px] text-off-white opacity-50 mt-1">
            Stockée localement — jamais envoyée ailleurs que Google.
          </p>
        </Card>
      )}

      {/* Question input */}
      <div className="mb-4">
        <label className="font-mono text-[10px] uppercase tracking-widest text-off-white block mb-2">
          Question (optionnelle)
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Est-ce que l'ennemi est seul ?"
          className="w-full bg-[#1a1025] border-2 border-astro-ink rounded-lg px-3 py-2 font-mono text-sm text-bone placeholder-off-white placeholder-opacity-30 focus:outline-none focus:border-accent"
          onKeyDown={(e) => e.key === 'Enter' && handleRoll()}
        />
      </div>

      {/* Roll button */}
      <Button variant="primary" onClick={handleRoll} className="w-full mb-6">
        Consulter l'Oracle
      </Button>

      {/* Result */}
      {current && (
        <div className="mb-4">
          {/* Yes/No result */}
          <div
            className="rounded-lg border-2 p-5 mb-3 text-center"
            style={{ borderColor: color, backgroundColor: color + '15' }}
          >
            <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-1">
              d6 = {current.roll} · {current.description}
            </p>
            <p
              className="font-display text-5xl uppercase mb-2"
              style={{ color }}
            >
              {current.result}
            </p>
            <div className="inline-block px-3 py-1 rounded-full border font-mono text-xs uppercase tracking-widest" style={{ borderColor: color, color }}>
              {current.keyword}
            </div>
          </div>

          {/* Narration */}
          {narration && (
            <Card variant="inset" className="mb-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-2">Narration IA</p>
              <p className="font-serif italic text-bone text-sm leading-relaxed">{narration}</p>
            </Card>
          )}

          {apiError && (
            <p className="font-mono text-[10px] text-astro-orange mb-3">{apiError}</p>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {hasKey && !narration && (
              <Button
                variant="secondary"
                onClick={handleNarrate}
                disabled={narrating}
                className="flex-1"
              >
                {narrating ? 'Génération…' : 'Narrer avec IA'}
              </Button>
            )}
            <Button variant="ghost" onClick={confirmRollAndSave} className="flex-1">
              Suivant
            </Button>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div className="mt-6">
          <p className="font-mono text-[10px] uppercase tracking-widest text-off-white mb-3">Historique</p>
          <div className="space-y-2">
            {history.map((entry) => {
              const c = RESULT_COLOR[entry.result.result] ?? '#f0eee8'
              return (
                <div key={entry.id} className="rounded-lg border border-astro-ink px-3 py-2 bg-[#1a1025]">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-sm uppercase" style={{ color: c }}>
                      {entry.result.result}
                    </span>
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full border" style={{ color: c, borderColor: c }}>
                      {entry.result.keyword}
                    </span>
                    {entry.question && (
                      <span className="font-mono text-[9px] text-off-white opacity-50 truncate">{entry.question}</span>
                    )}
                  </div>
                  {entry.narration && (
                    <p className="font-serif italic text-off-white text-xs leading-relaxed line-clamp-2">
                      {entry.narration}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
