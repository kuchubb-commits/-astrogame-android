# schema.md — Astroprisma App

> Modèles de données, interfaces TypeScript, fichiers JSON et relations entre entités.
> Source : `src/types/game.ts` · `src/stores/gameStore.ts` · `data/*.json`
> Dernière mise à jour : 2026-06-10

---

## 1. État global (Zustand — `gameStore.ts`)

Tout l'état de la partie est dans un seul store persisté en `localStorage` sous la clé `astroprisma-save`.

```
GameState
├── character        : Character | null       ← fiche personnage
├── starship         : Starship | null         ← fiche vaisseau
├── mapData          : MapData | null          ← carte + journal de cycle
├── combat           : CombatState | null      ← combat terrestre actif
├── shipCombat       : StarshipCombatState | null ← combat spatial actif
├── settlement       : SettlementState | null  ← settlement actif
├── oracleLog        : OracleEntry[]           ← historique Oracle
└── activeTab        : PlayTab                 ← onglet actif
```

> Les états `combat`, `shipCombat` et `settlement` sont **mutuellement exclusifs** — un seul actif à la fois.

---

## 2. Interfaces TypeScript (`src/types/game.ts`)

### Character
```ts
interface Character {
  name: string
  originId: string                              // → origins.json[].id
  stats: {
    vigor: number
    grace: number
    mind: number
    tech: number
  }
  health:     { current: number; max: number }  // max défaut = 20
  energy:     { current: number; max: number }  // max défaut = 20
  armor:      { current: number; max: number }  // max défaut = 0
  hyperdrive: { current: number; max: number }  // max défaut = 3
  inventory:  (string | null)[]                 // 8 slots — string = nom d'item
  weapons:    (string | null)[]                 // 3 slots — string = "NOM d8+STAT"
  memorySlots: string[]                         // 3 slots — string = hackId
  resources: {
    exp:    number                              // EXP pour acheter cybertech
    serum:  number                              // monnaie principale
    scraps: number                              // craft & réparation
    favor:  number                              // Favor faction (0–10)
  }
  installedCybertech: string[]                  // cybertech[].id[]
  deployedDroneId:    string | null             // drones[].id
  joinedFactionId:    string | null             // factions[].id
  currentMission:     FactionMission | null
}
```

### Starship
```ts
interface Starship {
  dataId:     string                            // → starships.json[].id
  customName: string
  hull:    { current: number; max: number }     // max = 20
  fuel:    { current: number; max: number }     // max = 20
  cargo:   (string | null)[]                    // 6 slots
  modules: string[]                             // starship-modules.json[].id[]
  shields: number                               // 0–8
}
```

### MapData
```ts
interface MapData {
  hexes:       Record<string, HexState>         // 36 hexes, clé = hexId
  playerHexId: string                           // hex courant
  cycleLog:    CycleEntry[]                     // 50 entrées max
  cycleCount:  number
}

interface HexState {
  id:            string                         // ex: "outer-1"
  ring:          'inner' | 'middle' | 'outer'
  explored:      boolean
  discoveryType: string | null                  // "settlement" | "hostile" | etc.
  discoveryText: string | null
  hexColor:      string | null                  // couleur affichée sur la carte
}

interface CycleEntry {
  id:    number                                 // timestamp
  hexId: string
  type:  string
  text:  string
}
```

### CombatState (terrestre)
```ts
interface CombatState {
  enemyId:    string                            // → enemies.json[].id
  enemyName:  string
  enemyStats: { vigor: number; grace: number; mind: number; tech: number }
  enemy:      CombatantState
  player:     CombatantState
  turn:       'player' | 'enemy'
  phase:      'active' | 'victory' | 'defeat' | 'escaped'
  log:        CombatLogEntry[]                  // 20 entrées max
  round:      number
  expReward:  number
  isSim?:     boolean                           // mode simulation (Combat Sim)
  preSimHp?:  number
  preSimEnergy?: number
}

interface CombatantState {
  hp:        number
  maxHp:     number
  armor:     number
  baseArmor: number
  statuses:  ActiveStatus[]
}

interface ActiveStatus {
  id:        string                             // "stun" | "breach" | "shock" | etc.
  name:      string
  turnsLeft: number | null                      // null = permanent jusqu'à fin de combat
}
```

### StarshipCombatState
```ts
interface StarshipCombatState {
  enemyShipId:       string                     // → starships.json[].id
  enemyShipName:     string
  enemyModules:      string[]
  playerModules:     string[]
  player:            { hull: number; maxHull: number; shields: number }
  enemy:             { hull: number; maxHull: number; shields: number }
  turn:              'player' | 'enemy'
  phase:             'active' | 'victory' | 'defeat' | 'escaped'
  log:               CombatLogEntry[]           // 30 entrées max
  round:             number
  actionDice:        number[]                   // résultats des d6 du tour
  usedDiceIndices:   number[]                   // indices de dés déjà utilisés
  playerDoubleNext:  boolean                    // TRACKING RADAR actif
  playerExtraDmg:    number                     // PARTICLE CANNONS stackable
  playerApolloUsed:  boolean                    // APOLLO COCKPIT déjà déclenché
  playerDeltaUsed:   boolean                    // DELTA CARGO BRIDGE déjà déclenché
  expReward:         number
}
```

### SettlementState
```ts
interface SettlementState {
  factionId:       string                       // faction qui contrôle le settlement
  factionName:     string
  activitiesUsed:  string[]                     // ["test-flight", "cybersphere", ...]
  cybersphere:     CybersphereState | null
  lastNpc:         GeneratedNpc | null
  testFlightResult: { type: string; roll: number; success: boolean; effect: string } | null
}

interface CybersphereState {
  tiles:              ('access-port' | 'normal' | 'matrix-node')[]  // 10 tuiles
  position:           number                    // 0–9
  memoryClock:        number                    // 0–12 (12 = Abyssal Scar)
  matrixNodesReached: number
  log:                CybersphereLogEntry[]
  phase:              'active' | 'escaped' | 'abyssal'
  pendingReward:      boolean
}
```

### Oracle & NPC
```ts
interface OracleEntry {
  id:       number
  question: string
  result:   string
  keyword:  string
  isYes:    boolean
  narration: string | null
}

interface GeneratedNpc {
  trade:    string
  emotion:  string
  look:     string
  style:    string
  reaction: string
  faction:  string
  goal:     string
}
```

### Faction Mission
```ts
interface FactionMission {
  factionId:        string
  objectiveText:    string
  locationText:     string
  complicationText: string | null
  rewardText:       string | null
  status:           'active' | 'completed' | 'failed'
}
```

### Types utilitaires
```ts
type PlayTab = 'player' | 'map' | 'oracle' | 'arsenal' | 'starship'

interface CombatLogEntry {
  text: string
  type: 'attack' | 'enemy' | 'status' | 'system' | 'victory' | 'defeat'
}

interface CybersphereLogEntry {
  text: string
  type: 'encounter' | 'reward' | 'system' | 'warning'
}
```

---

## 3. Fichiers JSON (`data/*.json`)

### origins.json
```
Origin[]
  id:          string         // "ecoterrorist" | "glitchblade" | ...
  name:        string
  stats:       { vigor, grace, mind, tech }   // valeurs de départ
  description: string
  startingItems: string[]
```
6 origins : ECOTERRORIST · GLITCHBLADE · WIREHEAD · ASTROMANCER · DESPERADO · CHROMESKIN

---

### weapons.json
```
Weapon[]
  id:      string
  name:    string
  type:    'ranged' | 'melee'
  formula: string             // ex: "d8+VIG", "2d6+GRA"
  cost:    number             // en Serum (★)
```
14 armes : 8 ranged (25–150★) · 6 melee (25–150★)

---

### weapon-mods.json
```
WeaponMod[]
  id:     string
  name:   string
  type:   'ranged' | 'melee'
  tier:   number              // 1–6
  effect: string
  cost:   number              // 75★ (tiers 1-2) · 100★ (tiers 3-4) · 150★ (tiers 5-6)
```
12 mods : 6 ranged + 6 melee — achetés aux WARG Settlements

---

### hacks.json
```
Hack[]
  id:      string
  name:    string
  cost:    number             // en ♦ Action Dice
  effect:  string
  isMaster: boolean           // true = Master Hack (3♦, non-achetable)
```
16 hacks : 10 Hacks (1–3♦) + 6 Master Hacks (3♦ chacun)

---

### enemies.json
```
Enemy[]
  id:      string
  name:    string
  hp:      number
  armor:   number
  stats:   { vigor, grace, mind, tech }
  actions: EnemyAction[]
    roll:    number | string   // ex: 1, "2-6", 10
    name:    string
    effect:  string
    damage:  string | null     // formule ou null
  skills:   string[]
  loot:     string
  isBoss:   boolean
  exp:      number             // calculé = ceil(hp/5)
```
30 ennemis validés (ch9-enemies.md) + 18 extras (Spacefarer's Journal DATABASE 01+02, à ajouter)

---

### cybertech.json
```
Cybertech[]
  id:        string
  name:      string
  maker:     string           // "synbios" | "yedrsl" | "frontera" | "orbital" | "evo" | "rip-tec"
  tier:      1 | 2 | 3
  cost:      number           // en EXP : 3 (t1) · 6 (t2) · 9 (t3)
  serumCost: number           // 100★ (t1) · 200★ (t2) · 300★ (t3)
  effect:    string
  statBoost: { vigor?, grace?, mind?, tech? }
  memorySlot: boolean         // true = +1 Memory Slot
```
18 implants : 6 fabricants × 3 tiers

---

### drones.json
```
Drone[]
  id:     string
  name:   string
  cost:   number              // en Serum (★) : 150/350/350/600
  moves:  DroneMove[]
    name:    string
    cost:    string           // "PASSIF" | "2♦" | "3♦" | ...
    effect:  string
    isDirect: false           // toujours false — drones ignorent IMMUNITY et Armor
```
4 drones : Spider (150★) · Greyhound (350★) · Ladybug (350★) · ÔwÓ (600★)
> Achat exclusif : **Synth Settlements uniquement**

---

### armor.json
```
ArmorSet[]
  id:         string
  name:       string
  armorBonus: number          // +1 | +2 | +3
  effect:     string | null
  immunity:   string | null   // "silence" | "shock" | "stun" | "overheat" | null
  cost:       number          // 50–300★
```
10 armures : +1 (50–100★) · +2 (200–250★) · +3 (300★)

---

### items.json
```
{ items: Item[] }
  id:     string
  name:   string
  effect: string
  cost:   number | null       // en Serum (★) — null = non-achetable
  type:   'consumable' | 'grenade' | 'status-cure' | 'quest'
```
22 items (Health Pack · Energy Cell · grenades · status cures · quest items)
> Narcobiotics : **pas dans items.json** — obtenus uniquement via rencontres Corsaire, pas d'achat

---

### starships.json
```
Starship[] (données de référence, pas l'état)
  id:       string
  name:     string
  class:    'C' | 'B' | 'A' | 'S'
  hull:     number            // toujours 20
  actions:  number            // 2–4
  modules:  string[]          // starship-modules[].id[] préconfigurés
  cost:     { serum: number; energy: number }
  exp:      number            // EXP accordé si détruit
  isEnemy:  boolean
```
18 vaisseaux ennemis + vaisseaux joueurs de départ
> +12 vaisseaux supplémentaires à ajouter (Journal DATABASE 03+04)

---

### starship-modules.json
```
StarshipModule[]
  id:         string
  name:       string
  category:   'engine' | 'control' | 'system' | 'weapon'
  tier:       1 | 2 | 3 | 4
  cost:       { energy: number; serum: number }
  diceCount:  number | null   // engines uniquement
  activation: string | null   // ex: "3-5" | "6" | "X" | null (engines)
  effect:     string
```
32 modules : 8 Engines + 8 Control + 8 Systems + 8 Weapons

---

### factions.json
```
Faction[]
  id:      string             // "warg" | "isf" | "medusa" | "corsair" | "synth-arch"
  name:    string
  color:   string             // hex couleur faction
  events:  FactionEvent[]
    favorThreshold: 2 | 5 | 10
    description:    string
  endings: string[]           // 3 fins possibles
  troops:  string[]
  ships:   string[]
```

---

### missions.json
```
{
  warg:      { objectives: [{roll, objective, location}] }
  isf:       { cargo: [{roll, cargo, destination}], complications: [...] }
  medusa:    { data: [{roll, objective, location}], complications: [...] }
  corsair:   { target: [{roll, target, location}], complications: [...] }
  synthArch: { goal: [{roll, goal, location}], complications: [...] }
}
```

---

### exploration-tables.json
```
{
  outer:  ExplorationEntry[]   // anneau extérieur
  middle: ExplorationEntry[]
  inner:  ExplorationEntry[]
    roll: number               // 1–6
    type: string
    text: string
    hexColor: string | null
}
```

---

### oracle.json
```
{
  yesNo: OracleResult[]        // table double d6 (Yes And → No And)
    roll: number
    result: string
    isYes: boolean
  keywords: string[]           // mots-clés narratifs pour questions ouvertes
}
```

---

### loot-tables.json
```
{
  loot: LootEntry[]            // d18 (01–18)
    roll: number
    reward: string
  boss: LootEntry[]            // d6 (01–06)
    roll: number
    reward: string
}
```

---

### abyssal-scars.json
```
AbyssalScar[]
  roll:   number               // 1–6
  effect: string
```

---

### status-conditions.json
```
StatusCondition[]
  id:     string
  name:   string
  effect: string
  isDot:  boolean              // true = dégâts de dot (OVERHEAT)
```
6 conditions : OVERHEAT · SHOCK · STUN · SILENCE · BREACH · IMMUNITY

---

### planets.json / satellites.json
```
{ types: PlanetType[] }
  id:      string
  name:    string
  landing: string[]
  events:  string[]
```

---

### settlements.json
```
Settlement[]
  id:         string
  factionId:  string
  activities: string[]
```

---

### npcs.json
```
{
  trade:    [{roll, value}]    // d20
  emotion:  [{roll, value}]    // d20
  look:     [{roll, value}]    // d20
  style:    [{roll, value}]    // d6
  reaction: [{roll, value}]    // d12
  faction:  [{roll, value}]    // d6
  goal:     [{roll, value}]    // d10
}
```

---

### names.json
```
{
  character: string[]
  starship:  string[]
  planet:    string[]
  satellite: string[]
  settlement: string[]
}
```

---

## 4. Relations entre entités

```
Character
  ├── originId          → origins[].id
  ├── installedCybertech[] → cybertech[].id
  ├── deployedDroneId   → drones[].id
  ├── joinedFactionId   → factions[].id
  ├── weapons[]         → libres (format "NOM formula")
  ├── inventory[]       → libres (item.name)
  └── memorySlots[]     → hacks[].id

Starship
  ├── dataId            → starships[].id
  └── modules[]         → starship-modules[].id

CombatState
  ├── enemyId           → enemies[].id
  └── statuses[]        → status-conditions[].id

StarshipCombatState
  ├── enemyShipId       → starships[].id
  ├── enemyModules[]    → starship-modules[].id
  └── playerModules[]   → starship-modules[].id

SettlementState
  └── factionId         → factions[].id

FactionMission
  └── factionId         → factions[].id → missions[factionKey]
```

---

## 5. Règles de persistance

| Donnée | Persistée | Durée |
|---|---|---|
| Character | ✅ localStorage | Inter-sessions |
| Starship | ✅ localStorage | Inter-sessions |
| MapData (hexes + journal) | ✅ localStorage | Inter-sessions |
| OracleLog | ✅ localStorage | Inter-sessions |
| CombatState | ✅ localStorage | Survit à rechargement |
| StarshipCombatState | ✅ localStorage | Survit à rechargement |
| SettlementState | ✅ localStorage | Survit à rechargement |
| GeneratedNpc | ✅ dans SettlementState | Jusqu'à exit settlement |
| CybersphereState | ✅ dans SettlementState | Jusqu'à exit cybersphere |

> Toute la partie est dans un seul objet `astroprisma-save` en localStorage.
> `resetGame()` vide character, starship, mapData, combat, shipCombat, settlement.

---

## 6. Constantes importantes

| Constante | Valeur | Source |
|---|---|---|
| Hull vaisseau (max) | 20 | Vérifié PNG |
| Shields (max) | 8 | ch6 |
| Critical Condition | Hull ≤ 10 | Vérifié PNG |
| Boost Escape | 5 Fuel, sans dé | Vérifié PNG |
| Memory Clock (max) | 12 | ch4 |
| Cybersphere tiles | 10 | ch4 |
| Inventory slots | 8 | Character Sheet |
| Weapon slots | 3 | Character Sheet |
| Memory slots | 3 (extensibles) | Character Sheet |
| Cargo slots | 6 | Starship Sheet |
| Module slots | 6 | Starship Sheet |
| Crew slots | 4 | Character Sheet |
| Connection slots | 7 | Character Sheet |
| OracleLog (max) | 30 entrées | gameStore |
| CycleLog (max) | 50 entrées | gameStore |
| Combat log (max) | 20 entrées | gameStore |
| Shipbattle log (max) | 30 entrées | gameStore |
| Favor (max) | 10 | ch8 |
| Favor (expulsion) | < 0 → leaveFaction() | gameStore |
