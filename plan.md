# Plan de développement — Astroprisma App

## Vue d'ensemble

| Phase | Contenu | Durée estimée |
|---|---|---|
| 0 — Fondations | Setup projet, structure, CI/CD | 1 session |
| 1 — Personnage | Feuille de perso interactive | 2-3 sessions |
| 2 — Exploration | Génération de mondes, planètes, rencontres | 2-3 sessions |
| 3 — Dés | Moteur de dés, lancers, résultats | 1-2 sessions |
| 4 — Oracle | Tables Oracle, narration aléatoire | 1-2 sessions |
| 5 — Combat | Système de combat complet | 2-3 sessions |
| 6 — Narration | Narration contextuelle Gemini | 1-2 sessions |
| 7 — Factions & DB | Factions, ennemis, PNJ | 2 sessions |
| 8 — UI/UX Design | Design cohérent, animations, thème SF | 1-2 sessions |
| 9 — Polish | PWA, responsive, déploiement final | 1-2 sessions |

---

## Architecture modulaire — Principe fondamental

Chaque phase est **indépendante** et peut être développée dans n'importe quel ordre.

### Pendant le développement d'une phase
- Données **mockées localement** — aucune dépendance aux autres phases
- Dossier propre dans `src/features/<phase>/`
- Testable et déployable seule

### Lors de l'intégration entre phases
- Les phases se **branchent sur le store Zustand partagé** (`src/stores/`)
- Aucune modification du code des phases existantes nécessaire
- Non-destructif : intégrer une phase ne casse pas les autres

### Stores partagés (pont entre phases)
```
src/stores/
├── useCharacterStore.ts   ← Phase 1 écrit, Phases 3/4/5 lisent
├── useDiceStore.ts        ← Phase 3 écrit, Phases 4/5 lisent
├── useExplorationStore.ts ← Phase 2 écrit, Phase 6 lit
├── useCombatStore.ts      ← Phase 5 écrit
└── useNarrationStore.ts   ← Phase 6 écrit/lit
```

### Exemple de flux d'intégration
```
Phase 1 seule  → useCharacterStore (VIGOR, GRACE, HP...)
Phase 3 rejoint → useDiceStore lit useCharacterStore → jets avec stats réelles
Phase 5 rejoint → useCombatStore lit les deux stores → combat complet
```

---

## Phase 0 — Fondations

### Objectif
Avoir un projet qui tourne, déployé, avec la bonne structure.

### Étapes
- [ ] `npm create vite@latest astroprisma-app -- --template react-ts`
- [ ] Installer Tailwind CSS + config
- [ ] Installer Zustand (state management)
- [ ] Installer Gemini SDK (`@google/generative-ai`)
- [ ] Créer structure de dossiers `src/`
- [ ] Connecter GitHub → Cloudflare Pages (auto-deploy sur push)
- [ ] Page d'accueil placeholder déployée
- [ ] `.env` pour la clé Gemini (jamais commitée)

### Résultat attendu
URL Cloudflare Pages fonctionnelle avec page d'accueil vide.

---

## Phase 1 — Feuille de personnage

### Objectif
Créer un personnage complet et le sauvegarder localement.

### Contenu du chapitre 2 à implémenter
- Création : choix d'origine (Background/Origin system)
- Stats de base : VIGOR, GRACE, MIND, TECH *(noms exacts — Character Sheet 2.0)*
- Ressources : HEALTH (20), ENERGY (20), ARMOR, EXP, HYPERDRIVE (jauge)
- Status Conditions : STUN, BREACH, SHOCK, SILENCE, IMMUNITY, OVERHEAT
- Map de compétences (Skills map)
- Connexions (NPCs liés)
- Équipage (Crewmembers)
- Vaisseau (Starship stats)

### Composants à créer
```
CharacterCreation.tsx   → wizard de création étape par étape
CharacterSheet.tsx      → feuille principale consultable/modifiable
StatBlock.tsx           → bloc de stats avec +/-
OriginCard.tsx          → carte d'origine avec effets
ConnectionList.tsx      → liste des connexions
StarshipPanel.tsx       → stats du vaisseau
```

### Données JSON à extraire du PDF
```json
// data/origins.json
{ "id": "soldier", "name": "Soldier", "bonuses": {...}, "ability": "..." }

// data/stats.json
{ "base_hp_formula": "...", "defense_formula": "..." }
```

### Store
```typescript
// stores/useCharacterStore.ts
// Écrit par cette phase, lu par : Dés, Oracle, Combat, Narration
```

### Résultat attendu
Wizard de création → feuille affichée → sauvegarde localStorage.

---

## Phase 2 — Exploration

### Objectif
Générer des mondes, rencontres et activités procéduralement.

### Tables à implémenter (Chapitre 7)
- Génération de planètes (type, atmosphère, population)
- Satellites et anomalies
- Colonies et activités disponibles
- Ring Encounters (rencontres aléatoires)
- Cybersphère (missions numériques)
- Abyssal Scars (zones dangereuses)

### Composants à créer
```
ExplorationHub.tsx       → hub principal d'exploration
PlanetGenerator.tsx      → génération de planète
PlanetCard.tsx           → affichage planète avec stats
EncounterTable.tsx       → tables de rencontres
ColonyView.tsx           → vue colonie + activités
```

### Store
```typescript
// stores/useExplorationStore.ts
// Écrit par cette phase, lu par : Narration
```

### Résultat attendu
Appuyer sur "Explorer" génère une planète avec événement aléatoire.

---

## Phase 3 — Dés

### Objectif
Lancer des dés avec lecture automatique des résultats selon les stats du personnage.

### Mécanique Astroprisma
- Système de base : 2d6 + stat vs difficulté
- Résultats : Succès Total / Succès / Succès Partiel / Échec / Échec Critique
- Intégration avec useCharacterStore (stats réelles quand disponibles, mockées sinon)

### Composants
```
DiceRoller.tsx       → interface de lancer visuelle
DiceResult.tsx       → affichage résultat avec couleur
DiceHistory.tsx      → historique scrollable
```

### Store
```typescript
// stores/useDiceStore.ts
// Écrit par cette phase, lu par : Oracle, Combat
```

### Résultat attendu
Lancer n'importe quel dé, voir le résultat avec interprétation automatique.

---

## Phase 4 — Oracle

### Objectif
Consulter les tables Oracle pour générer narration et événements aléatoires.

### Mécanique
- Table de 36 entrées (2d6 × 2d6)
- Lecture automatique du résultat
- Intégration avec useDiceStore

### Composants
```
OracleTable.tsx      → table Oracle interactive
OracleResult.tsx     → affichage résultat narratif
```

### Résultat attendu
Lancer l'Oracle → lire le résultat narratif automatiquement.

---

## Phase 5 — Combat

### Objectif
Gérer un combat complet (phase par phase).

### Mécaniques (Chapitres 3 & 6)
- Initiative (dé + stat)
- Tour : Attaque → jet → dégâts → application
- Armes de mêlée vs portée (tables de dommages)
- Armures et réduction de dégâts
- Combat spatial (vaisseaux, modules)

### Composants
```
CombatSetup.tsx      → choisir ennemis + terrain
CombatTracker.tsx    → timeline des tours
WeaponSelector.tsx   → choisir arme + lancer
EnemyCard.tsx        → PV ennemi + attaques
SpaceBattleMode.tsx  → vue combat spatial
```

### Store
```typescript
// stores/useCombatStore.ts
// Lit : useCharacterStore, useDiceStore
```

### Résultat attendu
Combat tour-par-tour jouable jusqu'à victoire/défaite.

---

## Phase 6 — Narration

### Objectif
Gemini raconte le jeu en temps réel.

### Intégration
```typescript
// lib/gemini.ts
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function narrateAction(context: GameContext): Promise<string> {
  const prompt = buildNarrativePrompt(context);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Contexte injecté dans chaque prompt
- Nom + origine du personnage
- Scène actuelle (lieu, situation)
- Action tentée
- Résultat du dé
- Faction(s) présentes
- Ambiance souhaitée (neutre / tendu / épique)

### Store
```typescript
// stores/useNarrationStore.ts
// Lit : useCharacterStore, useExplorationStore, useDiceStore
```

### Résultat attendu
Chaque action joueur génère 2-3 phrases narratives. L'Oracle génère une description de situation.

---

## Phase 7 — Factions & Base de données

### Objectif
Suivre les relations avec les 5 factions, accéder aux missions et ennemis.

### Factions (Chapitre 8)
- W.A.R.G.
- Intersolar Federation
- Medusa Sector
- Corsair Syndicate
- Synth Arch

### Base de données (Chapitre 9)
- Ennemis avec stats complètes
- Vaisseaux ennemis
- Générateur de PNJ
- Tables aléatoires contextuelles

---

## Phase 8 — UI/UX Design

### Objectif
Appliquer un design cohérent SF dark sur toutes les phases.

### Contenu
- Dark theme SF cohérent (palette, typographie, icônes)
- Animations dés (CSS)
- Transitions entre vues
- Composants UI réutilisables (boutons, cartes, modals)
- Responsive mobile 375px → desktop

### Approche
- Développable indépendamment via Storybook ou page de démo composants
- S'applique par-dessus les phases existantes sans modifier leur logique

---

## Phase 9 — Polish & Déploiement

### PWA
- `vite-plugin-pwa` → manifest + service worker
- Icône app + splash screen
- Mode offline (les données JSON sont en cache)

### Déploiement final
- `git push` → Cloudflare Pages build auto
- Variables d'environnement Gemini dans le dashboard Cloudflare

---

## Règles de collaboration

1. **On valide avant de coder** — chaque module discuté avant implémentation
2. **Petits commits fréquents** — chaque fonctionnalité = 1 commit
3. **Tests manuels d'abord** — lancer l'app dans le navigateur avant de passer à la suite
4. **Les données viennent du PDF** — aucune règle inventée, tout extrait du Core Book
5. **Pages = numérotation du LIVRE uniquement** — jamais la numérotation du fichier PDF. Aucun offset fixe. Toujours vérifier visuellement le numéro imprimé en bas de l'image générée.
6. **Lecture PDF = image obligatoire** — toujours utiliser `pdf_to_image.py` pour convertir en PNG et lire visuellement. Jamais d'extraction texte brute. Toujours valider les données extraites avant intégration.
7. **Phases indépendantes** — chaque phase se développe seule avec données mockées. L'intégration se fait via les stores Zustand partagés, sans modifier le code des phases existantes.

---

## Prochaine étape immédiate

> **Phase 0** : Initialiser le projet React + Vite + TypeScript et déployer sur Cloudflare Pages.

Commande de départ :
```bash
cd C:\Users\PC-DELL\.claude\projects\astrogame-android
npm create vite@latest astroprisma-app -- --template react-ts
```
