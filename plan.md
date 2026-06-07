# Plan de développement — Astroprisma App

## Vue d'ensemble

| Phase | Contenu | Priorité |
|---|---|---|
| 0 — Fondations | Setup projet, structure, CI/CD | ⬜ |
| 1 — Star System Map | Carte hexagonale interactive, 3 anneaux, position vaisseau | ⬜ |
| 2 — Exploration System | Cycles d'exploration, rolls par anneau, tables d'événements | ⬜ |
| 3 — Oracle | Système Oracle, tables aléatoires, narration procédurale | ⬜ |
| 4 — Personnage | Feuille de perso, stats, origins, starship | ⬜ |
| 5 — Dés & Rencontres | Moteur de dés, résultats automatiques, encounters | ⬜ |
| 6 — Combat | Combat au sol + spatial (vaisseaux) | ⬜ |
| 7 — Factions | Favor system, missions, rivalités, victoire | ⬜ |
| 8 — Database | Ennemis, vaisseaux, PNJ, random tables | ⬜ |
| 9 — Narration IA | Gemini contextuel sur chaque action | ⬜ |
| 10 — UI/UX | Design SF dark cohérent, animations, responsive | ⬜ |
| 11 — Polish & Deploy | PWA, offline, déploiement final Cloudflare | ⬜ |

---

## Architecture modulaire — Principe fondamental

Chaque phase est **indépendante** et développée avec données mockées.
L'intégration se fait via les **stores Zustand partagés** sans modifier le code existant.

### Stores partagés
```
src/stores/
├── useMapStore.ts          ← Phase 1 écrit — position vaisseau, hexs explorés
├── useExplorationStore.ts  ← Phase 2 écrit — cycles, rings, événements
├── useOracleStore.ts       ← Phase 3 écrit — tables oracle, résultats
├── useCharacterStore.ts    ← Phase 4 écrit — stats, origins, starship
├── useDiceStore.ts         ← Phase 5 écrit — historique des rolls
├── useCombatStore.ts       ← Phase 6 écrit — tours, initiative, dégâts
├── useFactionStore.ts      ← Phase 7 écrit — favor, missions, rivalités
└── useNarrationStore.ts    ← Phase 9 écrit/lit tous les stores
```

---

## Phase 0 — Fondations

- [ ] `npm create vite@latest astroprisma-app -- --template react-ts`
- [ ] Installer Tailwind CSS + Zustand + Gemini SDK
- [ ] Structure de dossiers `src/features/<phase>/`
- [ ] Connecter GitHub → Cloudflare Pages (auto-deploy)
- [ ] `.env` pour clé Gemini (jamais commitée)
- [ ] Page d'accueil placeholder déployée

**Résultat :** URL Cloudflare Pages fonctionnelle avec page vide.

---

## Phase 1 — Star System Map

**Composant central de l'app.**

- Carte hexagonale interactive (3 anneaux : Outer, Middle, Inner)
- Position du vaisseau du joueur sur la carte
- Déplacement de 5 hexs par cycle
- Marquage des hexs explorés / non explorés
- Indicateur de l'anneau actuel

### Composants
```
StarSystemMap.tsx    → carte hex principale
HexCell.tsx          → cellule hex (état : vide / exploré / actuel)
RingIndicator.tsx    → affichage de l'anneau actuel
ShipMarker.tsx       → position du vaisseau
```

**Résultat :** Carte navigable, vaisseau déplaçable, hexs marqués.

---

## Phase 2 — Exploration System

- Cycles d'exploration (5 tours)
- Roll d6 selon l'anneau actuel → table d'événements correspondante
- Affichage du résultat (lieu + événement)
- Génération de planètes et satellites (tables p.73 & p.81)
- Journal de campagne (log des événements)

### Composants
```
ExplorationCycle.tsx   → gestion du cycle en cours
RingRollTable.tsx      → table d'événements par anneau
PlanetGenerator.tsx    → génération procédurale
CampaignJournal.tsx    → log scrollable des événements
```

**Résultat :** Cycle complet jouable, planètes générées, journal tenu.

---

## Phase 3 — Oracle

*(Contenu à définir après lecture des pages 7-8)*

**Résultat :** Consultation de l'Oracle → résultat narratif automatique.

---

## Phase 4 — Personnage

- Création : choix d'Origine (Origin system)
- Stats : VIGOR, GRACE, MIND, TECH
- Ressources : HEALTH, ENERGY, ARMOR, EXP, HYPERDRIVE
- Status Conditions : STUN, BREACH, SHOCK, SILENCE, IMMUNITY, OVERHEAT
- Connexions (NPCs) + Équipage (Crewmembers)
- Starship stats

### Composants
```
CharacterCreation.tsx   → wizard étape par étape
CharacterSheet.tsx      → feuille consultable/modifiable
StarshipPanel.tsx       → stats du vaisseau
```

**Résultat :** Personnage créé, sauvegardé en localStorage.

---

## Phase 5 — Dés & Rencontres

- Système de dés : d4, d6, d8, d10, d12, d20
- Résultats automatiques selon le contexte (anneau, stats du perso)
- Historique des rolls
- Gestion des encounters (hostile, neutral)

**Résultat :** Roll → résultat interprété automatiquement.

---

## Phase 6 — Combat

- Initiative (dé + stat)
- Tour : Attaque → jet → dégâts → application
- Armes de mêlée vs portée
- Armures et réduction de dégâts
- Combat spatial (vaisseaux, modules)

**Résultat :** Combat tour-par-tour jusqu'à victoire/défaite.

---

## Phase 7 — Factions

- Suivi du Favor avec les 5 factions
- Missions disponibles par faction
- Système Mark Rivals (factions en opposition directe)
- Condition de victoire (faction dominante)

**Résultat :** Progression faction visible, missions jouables.

---

## Phase 8 — Database

- Ennemis avec stats complètes (par faction)
- Vaisseaux ennemis
- Générateur de PNJ
- Tables aléatoires contextuelles (d100)

**Résultat :** Base de données consultable en jeu.

---

## Phase 9 — Narration IA

- Gemini génère 2-3 phrases narratives à chaque action
- Contexte injecté : anneau actuel, événement, faction, résultat du dé
- Mode Journaling : suggestions de notes pour le journal

```typescript
// lib/gemini.ts
async function narrateAction(context: GameContext): Promise<string>
```

**Résultat :** Chaque action joueur génère une narration contextuelle.

---

## Phase 10 — UI/UX

- Dark theme SF cohérent (palette, typographie)
- Animations dés et déplacements
- Responsive mobile 375px → desktop
- Composants réutilisables (boutons, cartes, modals)

---

## Phase 11 — Polish & Déploiement

- PWA : manifest + service worker + mode offline
- Variables Gemini dans le dashboard Cloudflare
- `git push` → build automatique

---

## Règles de collaboration

1. On valide avant de coder — chaque module discuté avant implémentation
2. Petits commits fréquents — chaque fonctionnalité = 1 commit
3. Tests manuels d'abord — lancer l'app dans le navigateur avant de passer à la suite
4. Les données viennent du PDF — aucune règle inventée, tout extrait du Core Book
5. Pages = numérotation projet uniquement (p.1 = The World, offset PDF -3)
6. Lecture PDF = image obligatoire via les PNG existants ou `pdf_to_image.py`
7. Phases indépendantes — intégration via stores Zustand, sans modifier le code existant

---

## Prochaine étape immédiate

> Attendre les instructions pour la suite de la mise à jour de `idee.md` et `plan.md`.
