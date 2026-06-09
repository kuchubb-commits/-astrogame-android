import { useGameStore } from './stores/gameStore'
import CharacterCreation from './pages/CharacterCreation'
import PlayerSheet from './pages/PlayerSheet'
import StarshipSheet from './pages/StarshipSheet'
import MapScreen from './pages/MapScreen'
import OracleScreen from './pages/OracleScreen'
import CombatScreen from './pages/CombatScreen'
import ArsenalScreen from './pages/ArsenalScreen'
import StarshipCombatScreen from './pages/StarshipCombatScreen'
import BottomNav from './components/ui/BottomNav'

function App() {
  const character = useGameStore((s) => s.character)
  const combat = useGameStore((s) => s.combat)
  const shipCombat = useGameStore((s) => s.shipCombat)
  const activeTab = useGameStore((s) => s.activeTab)
  const setTab = useGameStore((s) => s.setTab)

  if (!character) return <CharacterCreation />

  // Les combats prennent tout l'écran (pas de BottomNav)
  if (combat) return <CombatScreen />
  if (shipCombat) return <StarshipCombatScreen />

  return (
    <>
      {activeTab === 'player'   && <PlayerSheet />}
      {activeTab === 'map'      && <MapScreen />}
      {activeTab === 'oracle'   && <OracleScreen />}
      {activeTab === 'arsenal'  && <ArsenalScreen />}
      {activeTab === 'starship' && <StarshipSheet />}
      <BottomNav active={activeTab} onChange={setTab} />
    </>
  )
}

export default App
