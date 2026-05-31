// Données d'exploration extraites du Core Book PDF

export type Ring = 'outer' | 'middle' | 'inner'

// ── Table principale d6 (commune aux 3 rings) ─────────────────────────────────
export const EXPLORATION_D6: string[] = [
  'Faction Encounter',
  'Neutral Encounter',
  'Hostile Encounter',
  'Planet',
  'Ring Event',
  'Settlement',
]

// ── Hostile Encounters (commune aux 3 rings) — d12 ───────────────────────────
export const HOSTILE_ENCOUNTERS = [
  'Duskwing rocket ship warps in front of you — combat maneuvers. Space Pirates.',
  'Snowstorm Delta posing as trader — attacks once close.',
  'Hologram projection (fake cargo vessel) from a Starpredator.',
  'Vector-7 Mantis attacks (patchwork ship from scavenged parts).',
  'Epsilon Interceptor pirate approaches in autopilot. Gain 1 Zero-G Liquor after defeating.',
  'Tarrasque Titan mothership (stolen from Old World military base).',
  'Smuggler Speeder — Gain 1 Contraband Package after defeating.',
  'Twinrotor Hauler — overloaded, laser cuts on hatch confirm it\'s stolen.',
  'Shell-4 Transporter — stealth cargo route. Attacks when pilot sees you.',
  'Beluga Transporter — no identification, contraband cargo ship.',
  'Orion Moth — mistakes you for ISF Trade Patrol.',
  'Edgecharger W mothership — secret contraband trade hub construction.',
]

// ── Neutral Encounters (commune aux 3 rings) — d12 ───────────────────────────
export const NEUTRAL_ENCOUNTERS = [
  'ISF checkpoint — Edgecharger W. Reveal cargo → items confiscated [-1 Favor]. Bribe → 100 Serum.',
  'Stationary Beluga Transporter = WARG explosive outpost. Provide support → Pulse Rifle [+1 Favor].',
  'Synth Arch space station. Synth Apostle offers cybertech implant [+1 Favor] or attacks if refused.',
  'Three research stations — alien specimen escaped containment. Help scientist → fight Deepworm → random HACK.',
  'Fortified concrete building on asteroid. ATLAS PROJECT. Robotic surgery unit. Choose implant.',
  'Three NetHackers cracking NGHTMR virus. ROLL MIND → Success: NGHTMR Key [+1 Favor].',
  'Luxury staryacht. Crew buys up to 5 BurnPatches → 50 Serum each.',
  'ISF terraformer starship. Plant Terraforming Seeds on planet 1 tile south [+1 Favor].',
  'Abandoned cyber-lab ship. Survivor gives random HACK [+1 Favor].',
  'Rotating colony ship. 80 people in cryo-pods. Power converter stopped. Wake them up or leave.',
  'Edgecharger W generation ship — buy items or Armor Sets.',
  'Tarrasque Titan ghost ship — 2 Looters. Bargain 100 Serum or fight for Contraband Package.',
]

// ── Ring Events ───────────────────────────────────────────────────────────────

export const OUTER_RING_EVENTS = [
  { roll: 1, title: 'Debris field', desc: 'Débris d\'une station détruite. Butin : 60 Scraps, 1 EMP Grenade, 1 Taser Shell.' },
  { roll: 2, title: 'Asteroid field', desc: 'Collision imminente. ROLL GRACE → Succès : +1⚛ / Échec : -5 Hull.' },
  { roll: 3, title: 'Corsair Syndicate Race', desc: 'Course dans les astéroïdes. Roll Action Dice + Engines. ❶15pts [Master Hack] ❷12pts [Weapon Mod] ❸9pts [Narcobiotic].' },
  { roll: 4, title: 'WARG rebel cell', desc: 'Vaisseau Duskwing vous confronte. Combattre → weapon mod. Allié → Settlement WARG [+1 Favor].' },
  { roll: 5, title: 'Asteroid ocean', desc: 'Champs d\'astéroïdes interconnectés. Cache : 3 Testogre Hormones + 2 Tricillin Tablets.' },
  { roll: 6, title: 'Synth Arch station', desc: '3 Android Synths. [+3 Favor] → Livrer un Tesseract à un Settlement Synth Arch (3 tuiles NO).' },
  { roll: 7, title: 'Pirate Starpredator', desc: 'Payer liberté 120 Serum, ou combattre pour 3 Contraband Packages. [+2 Favor] → livraison.' },
  { roll: 8, title: 'Epsilon Interceptor', desc: '"Livrez votre cargo ou soyez annihilés." Céder 3 items/100 Serum, ou combattre pour 2 Contraband.' },
  { roll: 9, title: 'Snowstorm Delta', desc: 'Tire de loin. Combattre → 50 Scraps. Fuir → tuile Middle Ring voisine, -3 Fuel.' },
  { roll: 10, title: 'Smuggler Speeder', desc: 'En route vers une Pirate Hideout. Attaquer → 40 Scraps + ranged weapon + Contraband Package.' },
  { roll: 11, title: 'Old World pirate base', desc: 'A-1 Voyager en parfait état trouvé. Remplacer votre vaisseau ou prendre ses modules.' },
  { roll: 12, title: 'Rookie pirates', desc: 'Vector-7 Mantis fonce sur vous. Fuir → -3 Fuel. Combattre → 2 Frag Grenades.' },
]

// MIDDLE RING EVENTS — extraits du Core Book p.66
export const MIDDLE_RING_EVENTS = [
  { roll: 1,  title: 'ISF Checkpoint', desc: 'Edgecharger W ISF. En ordre → continuer. Révéler cargo → items confisqués [-1 Favor]. Corrompre → 100 Serum. Combattre → fuite [-2 Favor].' },
  { roll: 2,  title: 'WARG explosive outpost', desc: 'Beluga Transporter = base WARG. Soutenir → Pulse Rifle [+1 Favor]. Infiltrer → 5 Frag Grenades [-2 Favor].' },
  { roll: 3,  title: 'Synth Arch station', desc: 'Synth Apostle propose un implant cybertech [+1 Favor] — refuser → attaque [-1 Favor].' },
  { roll: 4,  title: 'Research stations', desc: '3 stations orbitent une planète terraformée. Specimen alien en fuite. Combattre le Deepworm → random HACK.' },
  { roll: 5,  title: 'ATLAS PROJECT', desc: 'Dossier super-soldats cyborgs. Unité chirurgicale (10 Energy) → choisir : Titanium Bones / Forceblast Hand / Trigger Fingers.' },
  { roll: 6,  title: 'NetHackers — NGHTMR virus', desc: 'xxROLL MIND → Succès : 1 NGHTMR Key [+1 Favor]. Combattre → détruire station [-1 Favor].' },
  { roll: 7,  title: 'Luxury staryacht', desc: 'Shell-4 converti. Vendre jusqu\'à 5 BurnPatches → 50 Serum chacun.' },
  { roll: 8,  title: 'ISF terraformer', desc: 'Graines terraformantes à replanter sur planète (1 tuile sud) [+1 Favor].' },
  { roll: 9,  title: 'Cyber-lab abandonné', desc: 'Survivante cachée. L\'emmener à un Settlement → random HACK [+1 Favor].' },
  { roll: 10, title: 'Vaisseau colonie', desc: '80 personnes en cryo-sommeil, 7 mois de carburant. Réveiller ou laisser (-7 Fuel) [+2 Réputation].' },
  { roll: 11, title: 'Edgecharger W — génération', desc: 'Vaisseau-génération 125 ans de voyage. Acheter items ou Armor Sets.' },
  { roll: 12, title: 'Tarrasque Titan fantôme', desc: '2 Looters à bord. Négocier 100 Serum ou combattre → 1 Contraband Package.' },
]

export const INNER_RING_EVENTS = [
  { roll: 1, title: 'Energy receptors', desc: 'Récepteurs d\'énergie solaire. Restaurer d10 Energy.' },
  { roll: 2, title: 'Helios farm', desc: 'Ferme solaire Corsair. Attendre → Fuel max -5 Energy. Acheter illégalement → 4 Serum/unité.' },
  { roll: 3, title: 'RED SOL STATION', desc: 'Station-carburant. Refuel → 3 Serum/unité. Bar → Zero-G Liquor, Soda, narcobiotics.' },
  { roll: 4, title: 'Dyson sphere', desc: 'Structure annulaire inachevée. Restaurer 8 Energy et 6 Fuel.' },
  { roll: 5, title: 'Solar farm endommagée', desc: 'ROLL TECH → Succès : +10 Fuel. ROLL MIND → Succès : +10 Energy.' },
  { roll: 6, title: 'Medusa vs WARG', desc: 'Stingray Frontier + 3 Vector Ace Fighters. Défendre → +20 Fuel [+1 Favor]. Attaquer → +7 Fuel + weapon.' },
  { roll: 7, title: 'Solar flares', desc: 'Éruptions solaires. ROLL GRACE → Succès : +1⚛ / Échec : -3 Fuel, -4 Hull.' },
  { roll: 8, title: 'Chaleur extrême', desc: 'ROLL VIGOR → Succès : +1⚛ / Échec : -6 Hull.' },
  { roll: 9, title: 'Radiation wave', desc: 'ROLL MIND → Succès : +1⚛ / Échec : -5 Health, -4 Hull.' },
  { roll: 10, title: 'Incendie compartiment', desc: 'ROLL TECH → Succès : +1⚛ / Échec : -6 Health.' },
  { roll: 11, title: 'Twinrotor en détresse', desc: 'Réparer (50 Scraps) → 100 Serum. Transporter l\'équipage → 2 Vesterone + Supranova.' },
  { roll: 12, title: 'Mega solar flare', desc: 'Mur de feu imminent. Encaisser → -8 Hull. Surcharger propulseurs → -5 Fuel, esquive.' },
]

export type RingEventEntry = { roll: number; title: string; desc: string }

export const RING_EVENTS: Record<Ring, RingEventEntry[]> = {
  outer: OUTER_RING_EVENTS,
  middle: MIDDLE_RING_EVENTS,
  inner: INNER_RING_EVENTS,
}

export const RING_LABELS: Record<Ring, string> = {
  outer: 'Outer Ring',
  middle: 'Middle Ring',
  inner: 'Inner Ring',
}

export const RING_DESCRIPTIONS: Record<Ring, string> = {
  outer: 'Loin de l\'étoile — astéroïdes, pirates, WARG',
  middle: 'Anneau central — vie, eau, checkpoints ISF',
  inner: 'Proche de l\'étoile — chaleur, radiations, énergie',
}

export const RING_COLORS: Record<Ring, string> = {
  outer: 'border-slate-500 text-slate-300',
  middle: 'border-green-600 text-green-300',
  inner: 'border-orange-600 text-orange-300',
}
