# Brainstorming — Astroprisma App

## Architecture générale

### Stack retenu
```
Frontend  : React 18 + Vite + TypeScript
Style     : Tailwind CSS (mobile-first)
IA        : Gemini API (Google One AI Premium)
Deploy    : Cloudflare Pages (gratuit, CDN mondial)
Stockage  : localStorage + IndexedDB (Phase 1) → Cloudflare D1 (Phase 2)
PWA       : Vite PWA plugin (installable sur mobile)
```

### Pourquoi ces choix ?
- **React** : composants réutilisables, état facile à gérer (feuille de perso = gros state)
- **Vite** : build ultra-rapide, DX agréable pour apprendre
- **Tailwind** : classes utilitaires = UI rapide sans CSS custom
- **Cloudflare Pages** : déploiement git push, domaine .pages.dev gratuit
- **Gemini** : déjà inclus dans l'abonnement Google One, API moderne

---

## Modules fonctionnels identifiés

### 1. Personnage (Character Sheet)
> ⚠️ Données vérifiées sur la **Character Sheet 2.0** officielle (PDF form-fillable)

**Stats de base (4) — noms exacts :**
- **VIGOR** (force physique)
- **GRACE** (agilité / discrétion)
- **MIND** (intelligence / perception)
- **TECH** (technologie / hacking)

**Ressources trackables :**
- **HEALTH** (20 de base) + **ARMOR**
- **ENERGY** (20 de base) — 2e pool distinct de la santé
- **EXP** — points d'expérience
- **HYPERDRIVE** — jauge dédiée (barre de progression)

**Autres champs :**
- NAME + ORIGIN
- **MEMORY SLOTS** (6 emplacements, certains verrouillés par défaut)
- **CYBERTECH** (6 slots d'améliorations cybernétiques)
- WEAPON 1 + WEAPON 2 chacune avec **MODS**
- INVENTORY (8 slots)
- **Faction scores** — 5 icônes de factions avec score individuel

**Status Conditions (6) — noms exacts :**
STUN · BREACH · SHOCK · SILENCE · IMMUNITY · OVERHEAT

**Enemy Tracker intégré :** Health / Armor / Effects (sur la feuille perso)

**Page 2 — Vaisseau (STARSHIP) :**
- Carte hexagonale du vaisseau (grille libre)
- **HULL 20** + **FUEL 20** + SHIELDS
- CARGO HOLD (6 slots)
- CONTROL PANEL : Controls / Modules / Modules (arbre de modules)
- **4 membres d'équipage (CREW)** : NAME, ROLE, PASSIVE, HP, VIG/GRA/MIN/TEC, INVENTORY, SKILL 1/2/3
- **CONNECTIONS** (7) : NAME, LOCATION, DATA + jauge de relation (dots)

**Page 3 — Campagne / Monde :**
- **STAR SYSTEM map** : grille hexagonale numérotée (36 secteurs + centre STAR)
- **QUEST LOG** (8 quêtes : I → VIII)
- **CAMPAIGN tracker** : 3 actes (I/II/III) avec BASES et OUTCOME
- **MEMORY CLOCK** cards (6 cartes de compte à rebours narratif)
- **CYBER SPHERE** section dédiée

### 2. Système de dés (Dice Engine)
- Lancers 2d6 + modificateurs (le système de base d'Astroprisma)
- Lecture automatique des tables Oracle
- Résultats enrichis par Gemini (description narrative du résultat)
- Historique des lancers dans la session

### 3. Combat
- Tour par tour : initiative, attaques, défense
- Armes portée vs mêlée (tables de dégâts)
- Gestion PV ennemis + joueur
- Log de combat narratif (Gemini)

### 4. Hacking & Drones
- Système de hack (tableaux de succès/échec)
- Gestion des drones/mechs
- Améliorations cybertech du personnage

### 5. Exploration
- Génération de planètes (tables aléatoires)
- Satellites, cicatrices abyssales
- Colonies et activités
- Rencontres aléatoires (Ring Encounters)
- Cybersphère (environnement numérique)

### 6. Factions
- Suivi de faveur par faction (W.A.R.G., Fédération, Médusa, etc.)
- Missions disponibles selon niveau de faveur
- Journal des interactions

### 7. Base de données
> ✅ Contenu confirmé — Spacefarer's Journal DATABASE 01-04

**Ennemis (20 fiches avec stats) :**
- WARG : Grenadier, Partisan Guard
- ISF : Starscout, Walking Fortress
- Medusa : Griddper, Cyphersteel
- Corsair : Buccaneer, Casino Shark
- Synth : Chromesage, Solarsphynx
- Indépendants : Clone Colonist, Corpo Paramilitary, Narco-Addict, Afterlife Ghoul, Melting-Machine
- Créatures : Scrapeater, Emperor Scrapeater, Cortex Brainworm, Quetzal Declarlis, Horned Tarrasqosaur

**Vaisseaux ennemis (12 fiches) :**
- Ultra : Thunderbolt, Typhoon, Duskwind Heron, Scabas Pharaoh, Vector-7 Orchid, Hammerhead Hauler
- Class Y : Venus Transporter, X-Surface Crawler, Neon-Sea Delta, Lunar-Charger, A-2 Voyager, Gamma Interceptor

**Tables d100 à implémenter :**
- `character_encounters.json` (100 entrées)
- `settlement_quirks.json` (100 entrées)

**Générateur de PNJ** (à construire depuis CHARACTER ENCOUNTERS)

### 8. IA Narrative (Gemini)
- Contexte injecté : état du personnage + situation actuelle + règle appliquée
- Suggestions de narration (3 options courtes ou 1 description longue)
- Dialogues PNJ générés
- Descriptions de lieux à l'exploration
- Interprétation dramatique des résultats Oracle

### 9. Journal de campagne
> ✅ Inspiré du Spacefarer's Journal officiel (format journal physique)

- Pages de notes de session (interface type "journal" avec lignes)
- **PLAYTHROUGHS tracker** — compteur de parties avec historique
- **ACHIEVEMENTS (7)** : Astroprisma, Origin Story, Serum Addict, Core Conflict, Lone Wolf, Hardcore, Immortal
- Log automatique des événements
- Résumé de session généré par Gemini
- Export (texte, markdown)

### 10. Mode Campagne (Phase 1 avancée)
- Objectifs et arcs narratifs
- Tableau de bord de progression
- Achievements débloquables

---

## Architecture technique détaillée

### Structure des fichiers (React + Vite)
```
src/
  components/
    character/     → CharacterSheet, StatBlock, Inventory
    dice/          → DiceRoller, OracleTable, DiceHistory
    combat/        → CombatTracker, WeaponCard, EnemyCard
    exploration/   → PlanetGenerator, EncounterCard
    factions/      → FactionTracker, MissionCard
    ai/            → NarratorPanel, GeminiChat
    ui/            → shared (Button, Card, Modal, Badge)
  hooks/
    useCharacter.ts
    useDice.ts
    useCombat.ts
    useGemini.ts
  stores/
    characterStore.ts   → Zustand
    gameStore.ts        → état global de partie
    journalStore.ts
  data/
    rules/         → JSON : tables, stats de base, factions
    enemies.json
    equipment.json
    factions.json
  lib/
    gemini.ts      → wrapper Gemini API
    dice.ts        → moteur de dés
    tables.ts      → lecture tables aléatoires
  pages/
    Home.tsx
    Character.tsx
    Play.tsx        → écran principal de jeu
    Explore.tsx
    Journal.tsx
```

### Flux de données Gemini
```
Action joueur → construire prompt contextuel → Gemini API
                                               ↓
                              Réponse narrative → affichée dans UI
```

**Prompt type :**
```
Tu es le narrateur d'Astroprisma. Contexte : [état perso + situation].
Le joueur vient de [action]. Résultat du dé : [X] (succès/échec).
Décris la scène en 2-3 phrases, style SF spatial sombre.
```

### Gestion de l'état (Zustand)
- `characterStore` : tout le personnage (persisté IndexedDB)
- `gameStore` : session en cours (scène actuelle, ennemis actifs, etc.)
- `journalStore` : log des événements

---

## Questions ouvertes / décisions à prendre

| Question | Options | Décision actuelle |
|---|---|---|
| Dark mode par défaut ? | Oui / Non | Oui (ambiance SF) |
| Langue de l'interface | FR / EN / Bilingue | FR avec termes EN entre parenthèses |
| Son & musique d'ambiance | Oui / Non | Optionnel Phase 2 |
| Connexion utilisateur | Non (local only) / Oui (cloud) | Phase 1 : local only |
| Générateur de carte stellaire | Non / Oui | À évaluer Phase 2 |

---

## Ce qu'on NE fait PAS (Phase 1)

- Pas de backend serveur (tout client-side)
- Pas d'authentification utilisateur
- Pas de multijoueur temps réel
- Pas d'éditeur de scénarios custom
- Pas de son / musique
