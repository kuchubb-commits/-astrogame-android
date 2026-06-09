import { useState } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import ResourceBar from '../components/ui/ResourceBar'
import { useGameStore } from '../stores/gameStore'
import enemiesData from '../../data/enemies.json'
import itemsData from '../../data/items.json'

// ── Faction colours ─────────────────────────────────────────────────────────
const FACTION_STYLE: Record<string, { badge: string; text: string }> = {
  warg:         { badge: 'bg-warg text-bone border-warg',               text: 'text-warg' },
  isf:          { badge: 'bg-intersolar text-bone border-intersolar',   text: 'text-intersolar' },
  medusa:       { badge: 'bg-medusa text-bone border-medusa',           text: 'text-medusa' },
  corsair:      { badge: 'bg-astro-yellow text-astro-black border-astro-yellow', text: 'text-astro-yellow' },
  'synth-arch': { badge: 'bg-synth text-bone border-synth',             text: 'text-synth' },
}

type Tab = 'hangar' | 'wiredoc' | 'commerce' | 'activites'
type ActivityView = null | 'test-flight' | 'scrapyard' | 'combat-sim' | 'cybersphere' | 'home-pods'

// ── Cybersphere sub-screen ──────────────────────────────────────────────────
function CybersphereScreen() {
  const settlement    = useGameStore((s) => s.settlement)!
  const advance       = useGameStore((s) => s.cybersphereAdvance)
  const collectReward = useGameStore((s) => s.cybersphereCollectReward)
  const exitCyber     = useGameStore((s) => s.exitCybersphere)

  const cyber = settlement.cybersphere
  if (!cyber) return null

  const isActive   = cyber.phase === 'active'
  const isOver     = cyber.phase !== 'active'
  const atEnd      = cyber.position >= cyber.tiles.length - 1
  const currentTile = cyber.tiles[cyber.position] ?? 'normal'

  const TILE_ICONS: Record<string, string> = {
    'access-port': '⬡',
    'normal':      '◈',
    'matrix-node': '✦',
  }
  const TILE_LABELS: Record<string, string> = {
    'access-port': 'Port d\'accès',
    'normal':      'Tuile normale',
    'matrix-node': 'Nœud matriciel',
  }

  return (
    <div className="min-h-screen bg-astro-black px-4 pt-4 pb-6 max-w-2xl mx-auto flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl text-medusa uppercase tracking-wider">◈ Cybersphere</h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] text-off-white">
            Mémoire <span className={cyber.memoryClock >= 10 ? 'text-astro-orange' : 'text-bone'}>{cyber.memoryClock}</span>/12
          </span>
          {isActive && !cyber.pendingReward && (
            <button onClick={exitCyber} className="font-mono text-[9px] text-off-white hover:text-bone border border-astro-ink px-2 py-1 rounded">
              Déconnecter
            </button>
          )}
        </div>
      </div>

      {/* Memory clock bar */}
      <div className="flex gap-0.5">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${i < cyber.memoryClock ? (cyber.memoryClock >= 10 ? 'bg-astro-orange' : 'bg-medusa') : 'bg-[#130d1c] border border-astro-ink'}`}
          />
        ))}
      </div>

      {/* Network map */}
      <Card>
        <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-2">Réseau — {cyber.matrixNodesReached}/3 nœuds collectés</p>
        <div className="flex items-center gap-1 overflow-x-auto pb-1">
          {cyber.tiles.map((tile, i) => {
            const isPast    = i < cyber.position
            const isCurrent = i === cyber.position
            const isFuture  = i > cyber.position
            return (
              <div key={i} className="flex flex-col items-center gap-0.5 shrink-0">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-display text-sm border-2 transition-all
                    ${isCurrent  ? 'border-medusa bg-medusa/20 text-medusa scale-110' : ''}
                    ${isPast     ? 'border-astro-ink bg-[#130d1c] text-off-white opacity-40' : ''}
                    ${isFuture   ? 'border-astro-ink bg-[#1a1025] text-off-white' : ''}
                  `}
                >
                  {TILE_ICONS[tile]}
                </div>
                <span className="font-mono text-[7px] text-off-white opacity-50">{i}</span>
              </div>
            )
          })}
        </div>
        <p className="font-mono text-[9px] text-off-white mt-2">
          Position <span className="text-bone">{cyber.position}/9</span> — {TILE_LABELS[currentTile]}
        </p>
      </Card>

      {/* Actions */}
      {isActive && (
        <div className="space-y-2">
          {cyber.pendingReward ? (
            <Button variant="primary" onClick={collectReward} className="w-full">
              ✦ Collecter la récompense du nœud
            </Button>
          ) : atEnd ? (
            <Button variant="primary" onClick={exitCyber} className="w-full">
              ⬡ Sortir par le port d'accès
            </Button>
          ) : (
            <Button variant="primary" onClick={advance} className="w-full">
              → Avancer sur la tuile suivante
            </Button>
          )}
        </div>
      )}

      {/* End state */}
      {isOver && (
        <Card className={cyber.phase === 'abyssal' ? 'border-astro-orange/60' : 'border-medusa/60'}>
          {cyber.phase === 'escaped' && (
            <p className="font-display text-xl text-medusa uppercase">Déconnexion réussie</p>
          )}
          {cyber.phase === 'abyssal' && (
            <p className="font-display text-xl text-astro-orange uppercase">⚠ Abyssal Scar</p>
          )}
          <p className="font-mono text-xs text-off-white mt-1">
            Nœuds matriciels : <span className="text-bone">{cyber.matrixNodesReached}/3</span> — Mémoire utilisée : <span className="text-bone">{cyber.memoryClock}/12</span>
          </p>
          <Button variant="ghost" onClick={exitCyber} className="w-full mt-3">
            Retour au Settlement
          </Button>
        </Card>
      )}

      {/* Log */}
      <Card variant="inset" className="flex-1">
        <p className="font-mono text-[9px] uppercase tracking-widest text-medusa mb-2">Journal réseau</p>
        <div className="space-y-1 max-h-52 overflow-y-auto">
          {[...cyber.log].reverse().map((entry, i) => {
            const colors: Record<string, string> = {
              encounter: 'text-bone',
              reward:    'text-astro-yellow',
              system:    'text-off-white',
              warning:   'text-astro-orange',
            }
            return (
              <p key={i} className={`font-mono text-[10px] leading-relaxed ${colors[entry.type] ?? 'text-off-white'}`}>
                {entry.text}
              </p>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

// ── Main SettlementScreen ───────────────────────────────────────────────────
export default function SettlementScreen() {
  const character      = useGameStore((s) => s.character)!
  const starship       = useGameStore((s) => s.starship)!
  const settlement     = useGameStore((s) => s.settlement)!
  const exitSettlement = useGameStore((s) => s.exitSettlement)
  const refuelShip     = useGameStore((s) => s.refuelShip)
  const buyItem        = useGameStore((s) => s.buyItem)
  const craftItem      = useGameStore((s) => s.craftItem)
  const dismantleSlot  = useGameStore((s) => s.dismantleSlot)
  const useTestFlight  = useGameStore((s) => s.useTestFlight)
  const startCybersphere = useGameStore((s) => s.startCybersphere)
  const startCombat    = useGameStore((s) => s.startCombat)
  const generateNpc    = useGameStore((s) => s.generateNpc)

  const [tab, setTab] = useState<Tab>('hangar')
  const [actView, setActView] = useState<ActivityView>(null)
  const [fuelAmount, setFuelAmount] = useState(1)
  const [simEnemyId, setSimEnemyId] = useState<string | null>(null)

  const fStyle = FACTION_STYLE[settlement.factionId] ?? FACTION_STYLE.isf
  const allItems = (itemsData.items as any[]).filter((i) => i.cost != null && i.cost > 0)

  // Show Cybersphere if active
  if (settlement.cybersphere?.phase === 'active') return <CybersphereScreen />

  // ── TAB CONTENT ────────────────────────────────────────────────────────────

  const renderHangar = () => (
    <div className="space-y-4">
      <Card>
        <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-3">État du vaisseau</p>
        <ResourceBar label={`Hull ${starship.hull.current}/${starship.hull.max}`} value={starship.hull.current} max={starship.hull.max} />
        <p className="font-mono text-[9px] text-medusa mt-1">✓ Hull entièrement réparé à l'entrée</p>
      </Card>

      <Card>
        <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-3">Ravitaillement</p>
        <ResourceBar label={`Fuel ${starship.fuel.current}/${starship.fuel.max}`} value={starship.fuel.current} max={starship.fuel.max} />
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => setFuelAmount(Math.max(1, fuelAmount - 1))}
            className="w-8 h-8 rounded border-2 border-astro-ink bg-[#1a1025] font-mono font-bold text-bone hover:border-accent active:scale-95"
          >−</button>
          <div className="text-center">
            <span className="font-display text-2xl text-bone">{fuelAmount}</span>
            <p className="font-mono text-[9px] text-off-white">unités</p>
            <p className="font-mono text-[9px] text-astro-yellow">{fuelAmount * 3} Serum</p>
          </div>
          <button
            onClick={() => setFuelAmount(Math.min(starship.fuel.max - starship.fuel.current, fuelAmount + 1))}
            className="w-8 h-8 rounded border-2 border-astro-ink bg-[#1a1025] font-mono font-bold text-bone hover:border-accent active:scale-95"
          >+</button>
          <Button
            variant="primary"
            onClick={() => refuelShip(fuelAmount)}
            disabled={character.resources.serum < fuelAmount * 3 || starship.fuel.current >= starship.fuel.max}
            className="flex-1 text-[10px]"
          >
            Ravitailler
          </Button>
        </div>
        <p className="font-mono text-[9px] text-off-white opacity-60 mt-1">Coût : 3 Serum / unité. Serum disponible : <span className="text-bone">{character.resources.serum}</span></p>
      </Card>

      <Card>
        <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-2">Modules</p>
        <div className="space-y-1">
          {starship.modules.map((m, i) => (
            <div key={i} className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#130d1c] border border-astro-ink">
              <span className="font-mono text-[9px] text-accent w-4">{i + 1}</span>
              <span className="font-mono text-xs text-bone">{m}</span>
            </div>
          ))}
          {starship.modules.length === 0 && <p className="font-mono text-[10px] text-off-white opacity-40">Aucun module installé</p>}
        </div>
        <p className="font-mono text-[9px] text-off-white opacity-40 mt-2">Achat/vente de modules disponible en Phase 8+</p>
      </Card>
    </div>
  )

  const renderWireDoc = () => (
    <div className="space-y-4">
      <Card>
        <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-3">Santé</p>
        <ResourceBar label={`Health ${character.health.current}/${character.health.max}`} value={character.health.current} max={character.health.max} />
        <p className="font-mono text-[9px] text-medusa mt-1">✓ Santé entièrement restaurée à l'entrée</p>
      </Card>

      <Card>
        <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-2">Cybertech installé</p>
        {character.installedCybertech?.length > 0 ? (
          <div className="space-y-1">
            {character.installedCybertech.map((id) => (
              <div key={id} className="px-2 py-1.5 rounded bg-[#130d1c] border border-astro-ink">
                <span className="font-mono text-xs text-bone">{id}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-[10px] text-off-white opacity-40">Aucun implant installé</p>
        )}
        <p className="font-mono text-[9px] text-off-white opacity-40 mt-2">Achat/installation de cybertech → onglet Arsenal</p>
      </Card>
    </div>
  )

  const renderCommerce = () => (
    <div className="space-y-3">
      <p className="font-mono text-[9px] uppercase tracking-widest text-off-white">
        Serum disponible : <span className="text-astro-yellow font-bold">{character.resources.serum}</span>
        {' '}— Inventaire : <span className="text-bone">{character.inventory.filter(Boolean).length}/8</span>
      </p>
      {allItems.map((item) => {
        const canAfford = character.resources.serum >= item.cost
        const hasSpace  = character.inventory.some((s) => s === null)
        return (
          <div
            key={item.id}
            className="rounded-lg border-2 border-astro-ink bg-[#1a1025] px-3 py-2"
          >
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="font-display text-xs text-bone uppercase">{item.name}</p>
                <p className="font-mono text-[9px] text-off-white opacity-60 mt-0.5 leading-snug">{item.effect}</p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                <span className="font-mono text-[10px] text-astro-yellow">{item.cost} ₺</span>
                <button
                  onClick={() => buyItem(item.id)}
                  disabled={!canAfford || !hasSpace}
                  className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-all active:scale-95
                    ${canAfford && hasSpace ? 'border-accent text-accent hover:bg-accent/10' : 'border-astro-ink text-astro-ink cursor-default'}`}
                >
                  Acheter
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )

  const renderActivities = () => {
    if (actView === 'test-flight') return renderTestFlight()
    if (actView === 'scrapyard') return renderScrapyard()
    if (actView === 'combat-sim') return renderCombatSim()
    if (actView === 'home-pods') return renderHomePods()

    return (
      <div className="space-y-3">
        {/* Test Flight */}
        <button
          onClick={() => setActView('test-flight')}
          className="w-full text-left rounded-lg border-2 border-astro-ink bg-[#1a1025] hover:border-accent px-4 py-3 transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-sm text-bone uppercase">Test Flight</p>
            <div className="flex items-center gap-2">
              {settlement.activitiesUsed.includes('test-flight') && <span className="font-mono text-[9px] text-off-white opacity-50">✓ Utilisé</span>}
              <span className="font-mono text-[9px] text-astro-yellow">3 Serum</span>
            </div>
          </div>
          <p className="font-mono text-[9px] text-off-white opacity-60 mt-1">Speed Race (GRACE) ou Combat Drill — bonus pour votre prochaine bataille.</p>
        </button>

        {/* Scrapyard */}
        <button
          onClick={() => setActView('scrapyard')}
          className="w-full text-left rounded-lg border-2 border-astro-ink bg-[#1a1025] hover:border-accent px-4 py-3 transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-sm text-bone uppercase">Scrapyard</p>
            <span className="font-mono text-[9px] text-astro-yellow">Scraps : {character.resources.scraps}</span>
          </div>
          <p className="font-mono text-[9px] text-off-white opacity-60 mt-1">Fabriquer des items (Scraps = coût Serum) ou démanteler l'inventaire.</p>
        </button>

        {/* Combat Sim */}
        <button
          onClick={() => setActView('combat-sim')}
          className="w-full text-left rounded-lg border-2 border-astro-ink bg-[#1a1025] hover:border-accent px-4 py-3 transition-all active:scale-95"
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-sm text-bone uppercase">Combat Sim</p>
            {settlement.activitiesUsed.includes('combat-sim') && <span className="font-mono text-[9px] text-off-white opacity-50">✓ Utilisé</span>}
          </div>
          <p className="font-mono text-[9px] text-off-white opacity-60 mt-1">Simuler un combat. Pas de mort, HP/Énergie restaurés après. EXP accordé si victoire.</p>
        </button>

        {/* Cybersphere */}
        <button
          onClick={() => {
            if (!settlement.activitiesUsed.includes('cybersphere') && character.hyperdrive.current >= 5) {
              startCybersphere()
            }
          }}
          className={`w-full text-left rounded-lg border-2 bg-[#1a1025] px-4 py-3 transition-all active:scale-95
            ${settlement.activitiesUsed.includes('cybersphere') || character.hyperdrive.current < 5
              ? 'border-astro-ink opacity-50 cursor-default'
              : 'border-astro-ink hover:border-medusa'}`}
        >
          <div className="flex items-center justify-between">
            <p className="font-display text-sm text-bone uppercase">Cybersphere</p>
            <div className="flex items-center gap-2">
              {settlement.activitiesUsed.includes('cybersphere') && <span className="font-mono text-[9px] text-off-white opacity-50">✓ Utilisé</span>}
              <span className="font-mono text-[9px] text-astro-yellow">5 Hyperdrive</span>
            </div>
          </div>
          <p className="font-mono text-[9px] text-off-white opacity-60 mt-1">Réseau 10 tuiles, 12 mouvements max, 3 Nœuds matriciels. Rencontres d66.</p>
          {character.hyperdrive.current < 5 && !settlement.activitiesUsed.includes('cybersphere') && (
            <p className="font-mono text-[9px] text-astro-orange mt-1">Hyperdrive insuffisant ({character.hyperdrive.current}/5)</p>
          )}
          {settlement.cybersphere && settlement.cybersphere.phase !== 'active' && (
            <p className="font-mono text-[9px] text-medusa mt-1">Nœuds : {settlement.cybersphere.matrixNodesReached}/3 — Mémoire : {settlement.cybersphere.memoryClock}/12</p>
          )}
        </button>

        {/* Home Pods */}
        <button
          onClick={() => setActView('home-pods')}
          className="w-full text-left rounded-lg border-2 border-astro-ink bg-[#1a1025] hover:border-accent px-4 py-3 transition-all active:scale-95"
        >
          <p className="font-display text-sm text-bone uppercase">Home Pods</p>
          <p className="font-mono text-[9px] text-off-white opacity-60 mt-1">Rencontrer des PNJ via le générateur de personnages.</p>
        </button>
      </div>
    )
  }

  const renderTestFlight = () => (
    <div className="space-y-3">
      <button onClick={() => setActView(null)} className="font-mono text-[10px] text-off-white hover:text-bone">← Retour</button>
      <h2 className="font-display text-xl text-bone uppercase">Test Flight</h2>
      <Card>
        <p className="font-mono text-[9px] text-off-white mb-1">GRA actuelle : <span className="text-bone">{character.stats.grace}</span></p>
        <p className="font-mono text-[9px] text-off-white mb-3">Coût : <span className="text-astro-yellow">3 Serum</span> — Serum disponible : <span className="text-bone">{character.resources.serum}</span></p>
        {settlement.testFlightResult && (
          <div className={`rounded border px-3 py-2 mb-3 ${settlement.testFlightResult.success ? 'border-medusa bg-medusa/10' : 'border-astro-orange bg-astro-orange/10'}`}>
            <p className="font-mono text-[9px] text-off-white">
              {settlement.testFlightResult.type === 'race' ? 'Speed Race' : 'Combat Drill'} — d10+GRA = <span className="text-bone">{settlement.testFlightResult.roll}</span>
              {settlement.testFlightResult.success ? ' ✓' : ' ✗'}
            </p>
            <p className="font-mono text-[9px] mt-1 text-bone">{settlement.testFlightResult.effect}</p>
          </div>
        )}
        {!settlement.activitiesUsed.includes('test-flight') ? (
          <div className="flex gap-2">
            <Button variant="primary" onClick={() => useTestFlight('race')} disabled={character.resources.serum < 3} className="flex-1">
              Speed Race (GRA)
            </Button>
            <Button variant="ghost" onClick={() => useTestFlight('drill')} disabled={character.resources.serum < 3} className="flex-1">
              Combat Drill (GRA)
            </Button>
          </div>
        ) : (
          <p className="font-mono text-[9px] text-off-white opacity-50">Déjà utilisé ce cycle.</p>
        )}
      </Card>
    </div>
  )

  const renderScrapyard = () => {
    const craftable = allItems
    const dismantlable = character.inventory
      .map((v, i) => ({ value: v, index: i }))
      .filter(({ value }) => value !== null)

    return (
      <div className="space-y-3">
        <button onClick={() => setActView(null)} className="font-mono text-[10px] text-off-white hover:text-bone">← Retour</button>
        <h2 className="font-display text-xl text-bone uppercase">Scrapyard</h2>
        <p className="font-mono text-[9px] text-off-white">Scraps : <span className="text-astro-yellow font-bold">{character.resources.scraps}</span></p>

        <Card>
          <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-2">Fabriquer</p>
          <div className="space-y-1.5">
            {craftable.map((item) => {
              const canCraft  = character.resources.scraps >= item.cost
              const hasSpace  = character.inventory.some((s) => s === null)
              return (
                <div key={item.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-[#130d1c] border border-astro-ink">
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-bone">{item.name}</p>
                    <p className="font-mono text-[8px] text-off-white opacity-50 truncate">{item.effect}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[9px] text-astro-yellow">{item.cost}✦</span>
                    <button
                      onClick={() => craftItem(item.id)}
                      disabled={!canCraft || !hasSpace}
                      className={`font-mono text-[9px] px-2 py-0.5 rounded border transition-all active:scale-95
                        ${canCraft && hasSpace ? 'border-accent text-accent hover:bg-accent/10' : 'border-astro-ink text-astro-ink cursor-default'}`}
                    >
                      Fabriquer
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <p className="font-mono text-[9px] uppercase tracking-widest text-off-white mb-2">Démanteler (inventaire)</p>
          {dismantlable.length === 0 ? (
            <p className="font-mono text-[10px] text-off-white opacity-40">Inventaire vide</p>
          ) : (
            <div className="space-y-1.5">
              {dismantlable.map(({ value, index }) => {
                const item     = (itemsData.items as any[]).find((i) => i.name === value)
                const scrapsGain = item?.cost != null ? Math.ceil(item.cost / 2) : 10
                return (
                  <div key={index} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded bg-[#130d1c] border border-astro-ink">
                    <p className="font-mono text-xs text-bone">{value}</p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-mono text-[9px] text-astro-yellow">+{scrapsGain}✦</span>
                      <button
                        onClick={() => dismantleSlot(index)}
                        className="font-mono text-[9px] px-2 py-0.5 rounded border border-astro-orange text-astro-orange hover:bg-astro-orange/10 active:scale-95 transition-all"
                      >
                        Démanteler
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </Card>
      </div>
    )
  }

  const renderCombatSim = () => {
    const enemies = (enemiesData as any[])
    return (
      <div className="space-y-3">
        <button onClick={() => { setActView(null); setSimEnemyId(null) }} className="font-mono text-[10px] text-off-white hover:text-bone">← Retour</button>
        <h2 className="font-display text-xl text-bone uppercase">Combat Sim</h2>
        <Card variant="inset">
          <p className="font-mono text-[9px] text-off-white leading-relaxed">
            Simulation — HP/Énergie restaurés après. Impossible de mourir. EXP accordé si victoire. Items consommés normalement.
          </p>
        </Card>
        <p className="font-mono text-[9px] uppercase text-off-white">Choisir un ennemi :</p>
        <div className="space-y-1.5">
          {enemies.map((e: any) => (
            <button
              key={e.id}
              onClick={() => setSimEnemyId(e.id)}
              className={`w-full text-left rounded-lg border-2 px-3 py-2 transition-all active:scale-95
                ${simEnemyId === e.id ? 'border-accent bg-accent/10' : 'border-astro-ink bg-[#1a1025] hover:border-accent'}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xs text-bone uppercase">{e.name}</span>
                <div className="font-mono text-[9px] text-right text-off-white space-x-2">
                  <span>HP {e.hp}</span>
                  <span className="text-astro-yellow">+{Math.ceil(e.hp / 5)} EXP</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        {simEnemyId && (
          <Button
            variant="primary"
            className="w-full"
            onClick={() => {
              startCombat(simEnemyId, true)
              setActView(null)
            }}
          >
            🎮 Lancer la simulation
          </Button>
        )}
      </div>
    )
  }

  const renderHomePods = () => {
    const npc = settlement.lastNpc
    return (
      <div className="space-y-3">
        <button onClick={() => setActView(null)} className="font-mono text-[10px] text-off-white hover:text-bone">← Retour</button>
        <h2 className="font-display text-xl text-bone uppercase">Home Pods</h2>
        <Button variant="primary" onClick={generateNpc} className="w-full">
          🎲 Générer un PNJ
        </Button>
        {npc && (
          <Card>
            <p className="font-mono text-[9px] uppercase tracking-widest text-accent mb-3">PNJ Rencontré</p>
            <div className="space-y-1.5">
              {[
                { label: 'Profession', value: npc.trade },
                { label: 'Style',      value: npc.style },
                { label: 'Tenue',      value: npc.look },
                { label: 'Humeur',     value: npc.emotion },
                { label: 'Réaction',   value: npc.reaction },
                { label: 'Faction',    value: npc.faction },
                { label: 'But',        value: npc.goal },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[9px] text-off-white opacity-60 uppercase w-24 shrink-0">{label}</span>
                  <span className="font-mono text-xs text-bone">{value}</span>
                </div>
              ))}
            </div>
            <p className="font-mono text-[9px] text-off-white opacity-40 mt-3">Recrutement de l'équipage disponible en Phase 9.</p>
          </Card>
        )}
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'hangar',    label: 'Hangar',   icon: '◇' },
    { id: 'wiredoc',   label: 'WireDoc',  icon: '⊕' },
    { id: 'commerce',  label: 'Commerce', icon: '◈' },
    { id: 'activites', label: 'Activités', icon: '⚙' },
  ]

  return (
    <div className="min-h-screen bg-astro-black flex flex-col">
      {/* Header */}
      <div className="px-4 pt-6 pb-3 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="font-display text-2xl text-bone uppercase tracking-wider">Settlement</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border ${fStyle.badge}`}>
                {settlement.factionName}
              </span>
              <span className="font-mono text-[10px] text-off-white">
                Favor : <span className="text-bone">{character.resources.favor}</span>
              </span>
            </div>
          </div>
          <button
            onClick={exitSettlement}
            className="font-mono text-[10px] text-off-white hover:text-bone border border-astro-ink px-3 py-1.5 rounded active:scale-95"
          >
            Quitter
          </button>
        </div>

        {/* Inner tabs */}
        <div className="flex gap-1 mt-3">
          {TABS.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => { setTab(id); setActView(null) }}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2 rounded-t border-b-2 transition-colors font-mono text-[9px] uppercase
                ${tab === id ? `border-accent text-accent bg-accent/5` : 'border-astro-ink text-off-white hover:text-bone'}`}
            >
              <span className="text-sm leading-none">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pb-8 max-w-2xl mx-auto w-full overflow-y-auto">
        {tab === 'hangar'    && renderHangar()}
        {tab === 'wiredoc'   && renderWireDoc()}
        {tab === 'commerce'  && renderCommerce()}
        {tab === 'activites' && renderActivities()}
      </div>
    </div>
  )
}
