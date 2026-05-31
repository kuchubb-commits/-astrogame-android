// Données ennemies extraites du Core Book PDF (p.59-61)

export type EnemyType = 'character' | 'creature' | 'ship'
export type Faction = 'ISF' | 'WARG' | 'Synth Arch' | 'Corsair Syndicate' | 'Medusa Sector' | 'Créature' | 'Indépendant'

export interface EnemyAction {
  range: string   // ex: "1", "2-6", "7-10"
  desc: string
}

export interface Enemy {
  id: string
  name: string
  type: EnemyType
  faction: Faction
  hp: number         // HP pour perso/créature, Hull pour vaisseau
  shields?: number   // vaisseaux uniquement
  difficulty: number // stat challenge équivalente (0–10)
  actions: EnemyAction[]
  skills?: string[]
}

// ── PERSONNAGES ───────────────────────────────────────────────────────────────

export const CHARACTERS: Enemy[] = [
  {
    id: 'isf-soldier',
    name: 'ISF Soldier',
    type: 'character',
    faction: 'ISF',
    hp: 12,
    difficulty: 4,
    actions: [
      { range: '1-3', desc: 'Shock Shackles — STUN 1 tour' },
      { range: '4-7', desc: 'Pulse Rifle — d10+VIG dégâts' },
      { range: '8-9', desc: 'HACK_IGNITE — d12+MIN + Overheat' },
      { range: '10',  desc: 'Renforts — 1 ISF Soldier supplémentaire' },
    ],
    skills: ['Immune aux HACKS'],
  },
  {
    id: 'isf-sentinel',
    name: 'ISF Sentinel',
    type: 'character',
    faction: 'ISF',
    hp: 16,
    difficulty: 5,
    actions: [
      { range: '1-3', desc: 'Shock Shackles — STUN 1 tour' },
      { range: '4-7', desc: 'Pulse Rifle — d10+VIG dégâts' },
      { range: '8-9', desc: 'HACK_IGNITE — d12+MIN + Overheat' },
      { range: '10',  desc: 'Renforts — 1 ISF Sentinel' },
    ],
    skills: ['Immune aux HACKS'],
  },
  {
    id: 'isf-trade-baron',
    name: 'ISF Trade Baron',
    type: 'character',
    faction: 'ISF',
    hp: 14,
    difficulty: 5,
    actions: [
      { range: '1-4', desc: 'Carbon Dagger — d6+GRA dégâts' },
      { range: '5-7', desc: 'HACK_EMBER — Overheat' },
      { range: '8-10', desc: 'HACK_IGNITE — d12+MIN + Overheat' },
    ],
  },
  {
    id: 'nethacker',
    name: 'NetHacker',
    type: 'character',
    faction: 'Medusa Sector',
    hp: 10,
    difficulty: 5,
    actions: [
      { range: '1-3', desc: 'Carbon Dagger — d6+GRA' },
      { range: '4-6', desc: 'HACK_TROJAN — Breach' },
      { range: '7-9', desc: 'HACK_IGNITE — d12+MIN + Overheat' },
      { range: '10',  desc: 'Stratogen Hormones — boost' },
    ],
  },
  {
    id: 'cyber-terrorist',
    name: 'Cyber-Terrorist',
    type: 'character',
    faction: 'Medusa Sector',
    hp: 14,
    difficulty: 6,
    actions: [
      { range: '1-2', desc: 'HP Injection — restaure TEC HP/tour' },
      { range: '3-5', desc: 'Mechanical Wrench — d6+TEC' },
      { range: '6-7', desc: 'EMP Relay — SILENCE' },
      { range: '8-10', desc: 'Nano-Taser — SHOCK' },
    ],
    skills: ['HP Injection passive : restaure TEC HP par tour'],
  },
  {
    id: 'master-hacker',
    name: 'Master Hacker',
    type: 'character',
    faction: 'Medusa Sector',
    hp: 16,
    difficulty: 8,
    actions: [
      { range: '1-2', desc: 'HACK_PARASITE — Breach tous les ennemis' },
      { range: '3-5', desc: 'HACK_HYDRA — d10×MIN dégâts' },
      { range: '6-8', desc: 'HACK_MINDSTEAL — MIN cible = 0' },
      { range: '9-10', desc: 'HACK_SHADOW — Immunité 1 tour' },
    ],
  },
  {
    id: 'android-synth',
    name: 'Android Synth',
    type: 'character',
    faction: 'Synth Arch',
    hp: 18,
    difficulty: 6,
    actions: [
      { range: '1-2', desc: 'Self-Repair — +d6 HP' },
      { range: '3-5', desc: 'Shoulder Turrets — d6+TEC' },
      { range: '6-8', desc: 'HACK_VOLT — d10+TEC + STUN' },
      { range: '9-10', desc: 'CYBER_Chromefist — Armor×VIG' },
    ],
    skills: ['Defense Protocol : +2 Armor si seul'],
  },
  {
    id: 'android-titan',
    name: 'Android Titan',
    type: 'character',
    faction: 'Synth Arch',
    hp: 24,
    difficulty: 9,
    actions: [
      { range: '1-2', desc: 'System Reset — restaure HP' },
      { range: '3-5', desc: 'HACK_ARCHANGEL — d10×TEC restauré' },
      { range: '6-8', desc: 'CYBER_ChainsawArms — d10×VIG' },
      { range: '9-10', desc: 'Machine Learning — +1TEC +1GRA permanent' },
    ],
  },
  {
    id: 'synth-apostle',
    name: 'Synth Apostle',
    type: 'character',
    faction: 'Synth Arch',
    hp: 14,
    difficulty: 6,
    actions: [
      { range: '1-3', desc: 'Gauss SMG — d6+GRA' },
      { range: '4-6', desc: 'HACK_TROJAN — Breach' },
      { range: '7-9', desc: 'HACK_IGNITE — d12+MIN + Overheat' },
      { range: '10',  desc: 'Testogre Hormones — +1VIG' },
    ],
  },
  {
    id: 'rebel-fighter',
    name: 'Rebel Fighter',
    type: 'character',
    faction: 'WARG',
    hp: 10,
    difficulty: 3,
    actions: [
      { range: '1-4', desc: 'Revolver — d6+VIG' },
      { range: '5-7', desc: 'Flash Round — STUN' },
      { range: '8-10', desc: 'Steal — vole 50 Serum' },
    ],
  },
  {
    id: 'guerrilla-commander',
    name: 'Guerrilla Commander',
    type: 'character',
    faction: 'WARG',
    hp: 16,
    difficulty: 6,
    actions: [
      { range: '1-2', desc: 'Bandage — +d10 HP' },
      { range: '3-6', desc: 'Ignition Shotgun — d10+VIG' },
      { range: '7-8', desc: 'Heat Bomb — Overheat zone' },
      { range: '9-10', desc: 'Zero-G Liquor — Déplace 2× ce tour' },
    ],
  },
  {
    id: 'warg-major-general',
    name: 'W.A.R.G. Major General',
    type: 'character',
    faction: 'WARG',
    hp: 20,
    difficulty: 7,
    actions: [
      { range: '1-3', desc: 'Laser Blaster — d8+VIG' },
      { range: '4-5', desc: 'Flash Round — STUN' },
      { range: '6-8', desc: 'Tracking Shot — d12 + ennemi -2GRA' },
      { range: '9-10', desc: 'Precision Shot — lance 2 fois, garde le meilleur' },
    ],
  },
  {
    id: 'edge-worlder',
    name: 'Edge-worlder',
    type: 'character',
    faction: 'Corsair Syndicate',
    hp: 14,
    difficulty: 5,
    actions: [
      { range: '1-3', desc: 'Revolver — d6+VIG' },
      { range: '4-6', desc: 'Pulse Rifle — d10+VIG' },
      { range: '7-8', desc: 'Heat Bomb — Overheat' },
      { range: '9-10', desc: 'Frag Grenade — 3d6 zone' },
    ],
    skills: ["Immune au STUN", "Immune au SHOCK"],
  },
  {
    id: 'mercenary',
    name: 'Mercenary',
    type: 'character',
    faction: 'Corsair Syndicate',
    hp: 16,
    difficulty: 5,
    actions: [
      { range: '1-2', desc: 'Shield Stim — retire SHOCK' },
      { range: '3-4', desc: 'Bandage — +d10 HP' },
      { range: '5-8', desc: 'Ignition Shotgun — d10+VIG' },
      { range: '9-10', desc: 'Heat Bomb — Overheat' },
    ],
  },
  {
    id: 'looter',
    name: 'Looter',
    type: 'character',
    faction: 'Corsair Syndicate',
    hp: 8,
    difficulty: 2,
    actions: [
      { range: '1-2', desc: 'Burn Patch — soin' },
      { range: '3-6', desc: 'Ion Carbine — d10+GRA' },
      { range: '7-8', desc: 'Flash Round — STUN' },
      { range: '9-10', desc: 'Tricillin Tablet — +1 à toutes stats' },
    ],
  },
  {
    id: 'bounty-hunter',
    name: 'Bounty Hunter',
    type: 'character',
    faction: 'Corsair Syndicate',
    hp: 18,
    difficulty: 7,
    actions: [
      { range: '1-3', desc: 'Neon Blade — d12+VIG' },
      { range: '4-5', desc: 'Flash Round — STUN' },
      { range: '6-7', desc: 'Frag Grenade — 3d6 zone' },
      { range: '8-9', desc: 'Zero-G Liquor — déplace 2×' },
      { range: '10',  desc: 'Tricillin Tablet — +1 toutes stats' },
    ],
  },
  {
    id: 'or-crime-boss',
    name: 'O.R. Crime Boss',
    type: 'character',
    faction: 'Corsair Syndicate',
    hp: 22,
    difficulty: 8,
    actions: [
      { range: '1-3', desc: 'Carbon Dagger — d6+GRA' },
      { range: '4-7', desc: 'Gauss SMG — d6+GRA rafale' },
      { range: '8-10', desc: 'Frag Grenade — 3d6 zone' },
    ],
  },
  {
    id: 'merchant',
    name: 'Merchant',
    type: 'character',
    faction: 'Indépendant',
    hp: 8,
    difficulty: 2,
    actions: [
      { range: '1-4', desc: 'Carbon Dagger — d6+GRA' },
      { range: '5-7', desc: 'HACK_EMBER — Overheat' },
      { range: '8-10', desc: 'HACK_IGNITE — d12+MIN + Overheat' },
    ],
  },
  {
    id: 'scientist',
    name: 'Scientist',
    type: 'character',
    faction: 'Indépendant',
    hp: 8,
    difficulty: 2,
    actions: [
      { range: '1-3', desc: 'Traitement — +d10 HP' },
      { range: '4-6', desc: 'Gamma Gun — d8+TEC' },
      { range: '7-9', desc: 'HACK_KRAKEN — STUN tous 1 tour' },
      { range: '10',  desc: 'Electroxyn Capsule — boost' },
    ],
  },
]

// ── CRÉATURES ─────────────────────────────────────────────────────────────────

export const CREATURES: Enemy[] = [
  {
    id: 'dust-wasp',
    name: 'Dust Wasp',
    type: 'creature',
    faction: 'Créature',
    hp: 10,
    difficulty: 3,
    actions: [
      { range: '1-3', desc: 'Shock Shackles — STUN' },
      { range: '4-6', desc: 'Gravity Rifle — d12+VIG' },
      { range: '7-9', desc: 'Retractable Mandibles — d6+GRA' },
      { range: '10',  desc: 'Swarm — appelle d6 Dust Wasps si d6=6' },
    ],
    skills: ['Immune aux HACKS'],
  },
  {
    id: 'glyph-moth',
    name: 'Glyph Moth',
    type: 'creature',
    faction: 'Créature',
    hp: 10,
    difficulty: 3,
    actions: [
      { range: '1-2', desc: 'Diptera Wings — +1GRA cette action' },
      { range: '3-7', desc: 'Poisonous Stinger — d6+GRA + Toxines persistantes' },
      { range: '8-10', desc: 'Swarm — appelle des alliés' },
    ],
  },
  {
    id: 'deepworm',
    name: 'Deepworm',
    type: 'creature',
    faction: 'Créature',
    hp: 30,
    difficulty: 7,
    actions: [
      { range: '1-2', desc: 'Hardening Skin — +2 Armor' },
      { range: '3-4', desc: 'Straining Tail — STUN 2 tours' },
      { range: '5-7', desc: 'Gargantuan Bite — d8+VIG' },
      { range: '8-9', desc: 'Corrosive Spit — Overheat zone' },
      { range: '10',  desc: 'Feral Rage — +1VIG +1GRA permanent' },
    ],
  },
  {
    id: 'glyphworm',
    name: 'Glyphworm',
    type: 'creature',
    faction: 'Créature',
    hp: 18,
    difficulty: 6,
    actions: [
      { range: '1-2', desc: 'Echolocation — tous -3GRA' },
      { range: '3-5', desc: 'Curved Fangs — d8+GRA' },
      { range: '6-8', desc: 'Vampiric Bite — d10+VIG, restaure ½ dégâts infligés' },
      { range: '9-10', desc: 'Fast Claw — 2d6' },
    ],
  },
  {
    id: 'void-creature',
    name: 'Void Creature',
    type: 'creature',
    faction: 'Créature',
    hp: 14,
    difficulty: 5,
    actions: [
      { range: '1-3', desc: 'Fuel Secretion — ennemis -3 dégâts' },
      { range: '4-8', desc: 'Retractable Mandibles — d6+GRA' },
      { range: '9-10', desc: 'Teleport — si d6=6, téléportation' },
    ],
  },
  {
    id: 'psychic-alien',
    name: 'Psychic Alien',
    type: 'creature',
    faction: 'Créature',
    hp: 20,
    difficulty: 8,
    actions: [
      { range: '1-2', desc: 'Chrysalis Shield — +2 Armor' },
      { range: '3-4', desc: 'Hypnosis — Breach + Silence' },
      { range: '5-6', desc: 'Telepathic Strain — d6×MIN' },
      { range: '7-8', desc: 'Penetrating Gaze — d8+MIN' },
      { range: '9-10', desc: 'Mental Shock — SHOCK + Breach tous' },
    ],
  },
]

// ── VAISSEAUX ─────────────────────────────────────────────────────────────────

export const SHIPS: Enemy[] = [
  {
    id: 'vector-ace-fighter',
    name: 'Vector Ace Fighter',
    type: 'ship',
    faction: 'WARG',
    hp: 20,
    shields: 1,
    difficulty: 4,
    actions: [
      { range: '1',    desc: 'Fuite — esquive le combat' },
      { range: '2-7',  desc: '3 dégâts + ignore bouclier' },
      { range: '8-10', desc: 'Ennemi perd 1 Action ce tour' },
    ],
    skills: ['Commence avec 1 bouclier'],
  },
  {
    id: 'epsilon-interceptor',
    name: 'Epsilon Interceptor',
    type: 'ship',
    faction: 'WARG',
    hp: 20,
    difficulty: 5,
    actions: [
      { range: '1',    desc: 'Fuite' },
      { range: '2-4',  desc: 'X dégâts à tous les vaisseaux' },
      { range: '5-10', desc: '6 dégâts Hull' },
    ],
  },
  {
    id: 'snowstorm-delta',
    name: 'Snowstorm Delta',
    type: 'ship',
    faction: 'WARG',
    hp: 20,
    difficulty: 5,
    actions: [
      { range: '1',    desc: 'Fuite' },
      { range: '2-6',  desc: '3 dégâts Hull' },
      { range: '7-10', desc: '6 dégâts Hull' },
    ],
    skills: ['+2 dégâts sur coup critique'],
  },
  {
    id: 'duskwing',
    name: 'Duskwing',
    type: 'ship',
    faction: 'WARG',
    hp: 20,
    difficulty: 5,
    actions: [
      { range: '1-2',  desc: '+1 Action ce tour' },
      { range: '3-5',  desc: '+1 Bouclier' },
      { range: '6-9',  desc: '3 dégâts + weapon +1' },
      { range: '10',   desc: 'Ennemi -1 Action' },
    ],
    skills: ['Coup critique → +1 Action/tour permanent'],
  },
  {
    id: 'shell-4-transporter',
    name: 'Shell-4 Transporter',
    type: 'ship',
    faction: 'ISF',
    hp: 20,
    difficulty: 4,
    actions: [
      { range: '1-6',  desc: 'X dégâts à tous' },
      { range: '7-9',  desc: '4 dégâts Hull' },
      { range: '10',   desc: 'Ennemi perd 1 Action' },
    ],
  },
  {
    id: 'scarab-interceptor',
    name: 'Scarab Interceptor',
    type: 'ship',
    faction: 'ISF',
    hp: 20,
    shields: 2,
    difficulty: 6,
    actions: [
      { range: '1-3',  desc: '3 dégâts Hull' },
      { range: '4-7',  desc: '3 dégâts + weapon +1' },
      { range: '8-10', desc: '2× dégâts' },
    ],
    skills: ['Premier coup critique → 2 boucliers'],
  },
  {
    id: 'tarrasque-titan',
    name: 'Tarrasque Titan',
    type: 'ship',
    faction: 'ISF',
    hp: 20,
    difficulty: 7,
    actions: [
      { range: '1-2',  desc: '4 dégâts Hull' },
      { range: '3-5',  desc: 'X dégâts' },
      { range: '6-9',  desc: '+1 Bouclier' },
      { range: '10',   desc: 'Détruit tous les boucliers ennemis' },
    ],
    skills: ['+1 Hull par bouclier actif'],
  },
  {
    id: 'orion-moth',
    name: 'Orion Moth',
    type: 'ship',
    faction: 'Medusa Sector',
    hp: 20,
    difficulty: 6,
    actions: [
      { range: '1-2',  desc: '4 dégâts Hull' },
      { range: '3-6',  desc: 'X dégâts' },
      { range: '7-9',  desc: '+1 Bouclier' },
      { range: '10',   desc: 'Détruit tous les boucliers ennemis' },
    ],
    skills: ['+1 Hull par bouclier actif'],
  },
  {
    id: 'stingray-frontier',
    name: 'Stingray Frontier',
    type: 'ship',
    faction: 'Medusa Sector',
    hp: 20,
    shields: 1,
    difficulty: 6,
    actions: [
      { range: '1',    desc: '+1 Action ce tour' },
      { range: '2-4',  desc: 'X dégâts à tous' },
      { range: '5-6',  desc: '4 dégâts Hull' },
      { range: '7-10', desc: '+1 Bouclier' },
    ],
    skills: ['Commence avec 1 bouclier'],
  },
  {
    id: 'smuggler-speeder',
    name: 'Smuggler Speeder',
    type: 'ship',
    faction: 'Corsair Syndicate',
    hp: 20,
    difficulty: 4,
    actions: [
      { range: '1-3',  desc: '2 dégâts à tous' },
      { range: '4-7',  desc: 'X dégâts' },
      { range: '8-9',  desc: '2× dégâts' },
      { range: '10',   desc: '10 dégâts Hull' },
    ],
    skills: ['+2 dégâts sur coup critique'],
  },
  {
    id: 'twinrotor-hauler',
    name: 'Twinrotor Hauler',
    type: 'ship',
    faction: 'Corsair Syndicate',
    hp: 20,
    difficulty: 5,
    actions: [
      { range: '1-3',  desc: '4 dégâts Hull' },
      { range: '4-7',  desc: '3 dégâts +1' },
      { range: '8-9',  desc: '10 dégâts Hull' },
      { range: '10',   desc: '+3 Boucliers' },
    ],
    skills: ['Premier coup critique ne détruit pas le vaisseau'],
  },
  {
    id: 'starpredator',
    name: 'Starpredator',
    type: 'ship',
    faction: 'Corsair Syndicate',
    hp: 20,
    shields: 2,
    difficulty: 7,
    actions: [
      { range: '1',    desc: '+1 Action ce tour' },
      { range: '2-6',  desc: '3 dégâts +2' },
      { range: '7-8',  desc: 'Détruit tous les boucliers ennemis' },
      { range: '9-10', desc: '+3 Boucliers' },
    ],
    skills: ['Commence avec 2 boucliers si pas en premier'],
  },
  {
    id: 'eclipse-warden',
    name: 'Eclipse Warden',
    type: 'ship',
    faction: 'Synth Arch',
    hp: 20,
    difficulty: 6,
    actions: [
      { range: '1-4',  desc: 'X dégâts' },
      { range: '5-7',  desc: '3 dégâts +3' },
      { range: '8-10', desc: '+3 Boucliers' },
    ],
  },
  {
    id: 'edgecharger-w',
    name: 'Edgecharger W',
    type: 'ship',
    faction: 'ISF',
    hp: 20,
    difficulty: 6,
    actions: [
      { range: '1-3',  desc: '2 dégâts à tous' },
      { range: '4-7',  desc: 'X dégâts' },
      { range: '8-9',  desc: 'Détruit tous les boucliers ennemis' },
      { range: '10',   desc: '+3 Boucliers' },
    ],
  },
]

// ── Tous les ennemis regroupés ────────────────────────────────────────────────

export const ALL_ENEMIES: Enemy[] = [...CHARACTERS, ...CREATURES, ...SHIPS]

export const FACTION_COLORS: Record<Faction, string> = {
  'ISF':               'text-blue-400 border-blue-700 bg-blue-900/20',
  'WARG':              'text-green-400 border-green-700 bg-green-900/20',
  'Synth Arch':        'text-cyan-400 border-cyan-700 bg-cyan-900/20',
  'Corsair Syndicate': 'text-yellow-400 border-yellow-700 bg-yellow-900/20',
  'Medusa Sector':     'text-purple-400 border-purple-700 bg-purple-900/20',
  'Créature':          'text-red-400 border-red-700 bg-red-900/20',
  'Indépendant':       'text-slate-400 border-slate-700 bg-slate-900/20',
}

export const TYPE_LABELS: Record<EnemyType, string> = {
  character: 'Personnage',
  creature: 'Créature',
  ship: 'Vaisseau',
}

export const TYPE_ICONS: Record<EnemyType, string> = {
  character: '👤',
  creature: '🦑',
  ship: '🚀',
}
