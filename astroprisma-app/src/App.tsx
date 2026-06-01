import { useState } from 'react'
import { CharacterSheet } from './components/CharacterSheet'
import { DiceRoller } from './components/dice/DiceRoller'
import { OraclePanel } from './components/dice/OraclePanel'
import { DiceHistory } from './components/dice/DiceHistory'
import { ExploreRoller } from './components/dice/ExploreRoller'
import { EnemyPanel } from './components/enemies/EnemyPanel'
import { CombatSetup } from './components/combat/CombatSetup'
import { CombatTracker } from './components/combat/CombatTracker'
import { useCombatStore } from './stores/combatStore'

type Page = 'home' | 'character' | 'dice' | 'enemies' | 'combat'

function NavBar({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <nav className="sticky top-0 z-10 bg-[#0a0a0f]/90 backdrop-blur border-b border-slate-800 px-4 py-3 flex items-center gap-4">
      <button
        onClick={onBack}
        className="text-slate-400 hover:text-white text-sm tracking-widest uppercase transition"
      >
        ← Accueil
      </button>
      <span className="text-purple-400 text-sm tracking-widest uppercase">{title}</span>
    </nav>
  )
}

function DicePage({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <NavBar onBack={onBack} title="Dés & Oracle" />
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <DiceRoller />
        <ExploreRoller />
        <OraclePanel />
        <DiceHistory />
      </div>
    </div>
  )
}

function EnemiesPage({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <NavBar onBack={onBack} title="Ennemis" />
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        <EnemyPanel />
        <DiceRoller />
        <DiceHistory />
      </div>
    </div>
  )
}

function CombatPage({ onBack }: { onBack: () => void }) {
  const { phase, reset } = useCombatStore()
  const inCombat = phase !== 'setup'

  return (
    <div>
      <NavBar onBack={() => { reset(); onBack() }} title="Combat" />
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="bg-[#111118] border border-slate-800 rounded-lg p-4">
          {inCombat ? <CombatTracker /> : <CombatSetup />}
        </div>
      </div>
    </div>
  )
}

function App() {
  const [page, setPage] = useState<Page>('home')

  if (page === 'character') {
    return (
      <div>
        <NavBar onBack={() => setPage('home')} title="Feuille de personnage" />
        <CharacterSheet />
      </div>
    )
  }

  if (page === 'dice') {
    return <DicePage onBack={() => setPage('home')} />
  }

  if (page === 'enemies') {
    return <EnemiesPage onBack={() => setPage('home')} />
  }

  if (page === 'combat') {
    return <CombatPage onBack={() => setPage('home')} />
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center text-center px-4">

      <div className="mb-8">
        <h1 className="text-5xl font-black tracking-widest text-white uppercase">
          ASTRO<span className="text-purple-400">PRISMA</span>
        </h1>
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent mt-3" />
      </div>

      <p className="text-slate-400 text-sm tracking-widest uppercase mb-12">
        Digital Companion — v0.2.0
      </p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => setPage('character')}
          className="px-6 py-3 border border-purple-500 text-purple-300 text-sm tracking-widest uppercase rounded hover:bg-purple-500/20 transition"
        >
          👤 Feuille de personnage
        </button>
        <button
          onClick={() => setPage('dice')}
          className="px-6 py-3 border border-purple-500 text-purple-300 text-sm tracking-widest uppercase rounded hover:bg-purple-500/20 transition"
        >
          🎲 Dés & Oracle
        </button>
        <button
          onClick={() => setPage('enemies')}
          className="px-6 py-3 border border-purple-500 text-purple-300 text-sm tracking-widest uppercase rounded hover:bg-purple-500/20 transition"
        >
          📋 Ennemis & Base de données
        </button>
        <button
          onClick={() => setPage('combat')}
          className="px-6 py-3 border border-red-600 text-red-300 text-sm tracking-widest uppercase rounded hover:bg-red-500/20 transition"
        >
          ⚔️ Combat
        </button>
      </div>

      <div className="mt-12 text-slate-700 text-xs tracking-widest">
        VIGOR · GRACE · MIND · TECH
      </div>
    </div>
  )
}

export default App
