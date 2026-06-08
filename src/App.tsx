import { useGameStore } from './stores/gameStore'
import CharacterCreation from './pages/CharacterCreation'
import PlayerSheet from './pages/PlayerSheet'
import StarshipSheet from './pages/StarshipSheet'
import MapScreen from './pages/MapScreen'
import BottomNav from './components/ui/BottomNav'

function App() {
  const character = useGameStore((s) => s.character)
  const activeTab = useGameStore((s) => s.activeTab)
  const setTab = useGameStore((s) => s.setTab)

  if (!character) {
    return <CharacterCreation />
  }

  return (
    <>
      {activeTab === 'player'   && <PlayerSheet />}
      {activeTab === 'starship' && <StarshipSheet />}
      {activeTab === 'map'      && <MapScreen />}
      <BottomNav active={activeTab} onChange={setTab} />
    </>
  )
}

export default App
