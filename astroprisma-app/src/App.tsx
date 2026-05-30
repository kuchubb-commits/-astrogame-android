import { useState } from 'react'
import { testGemini } from './lib/gemini'

function App() {
  const [geminiResult, setGeminiResult] = useState<string>('')
  const [loading, setLoading] = useState(false)

  async function handleTest() {
    setLoading(true)
    try {
      const text = await testGemini()
      setGeminiResult(text)
    } catch (e) {
      setGeminiResult('❌ Erreur : ' + (e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-4">

      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-5xl font-black tracking-widest text-white uppercase">
          ASTRO<span className="text-purple-400">PRISMA</span>
        </h1>
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-3" />
      </div>

      {/* Subtitle */}
      <p className="text-slate-400 text-sm tracking-widest uppercase mb-12">
        Digital Companion — v0.1.0
      </p>

      {/* Status */}
      <div className="border border-purple-500/30 bg-purple-500/5 rounded-lg px-8 py-4 text-purple-300 text-sm tracking-wide">
        ⚡ Système en ligne — Phase 0 opérationnelle
      </div>

      {/* Gemini Test */}
      <div className="mt-8 flex flex-col items-center gap-4">
        <button
          onClick={handleTest}
          disabled={loading}
          className="px-6 py-2 border border-purple-500 text-purple-300 text-sm tracking-widest uppercase rounded hover:bg-purple-500/20 disabled:opacity-50 transition"
        >
          {loading ? 'Connexion...' : '⚡ Tester Gemini'}
        </button>
        {geminiResult && (
          <p className="max-w-md text-slate-300 text-sm text-center italic">{geminiResult}</p>
        )}
      </div>

      {/* Decoration */}
      <div className="mt-12 text-slate-700 text-xs tracking-widest">
        VIGOR · GRACE · MIND · TECH
      </div>
    </div>
  )
}

export default App
