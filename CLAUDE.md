# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commandes

```bash
npm run dev       # serveur de développement (Vite, port 5173)
npm run build     # build production (tsc -b && vite build)
npm run preview   # prévisualiser le build
npx tsc --noEmit  # vérification TypeScript sans compilation
```

Pas de tests automatisés à ce stade — validation manuelle dans le navigateur.

## Architecture

### Vue d'ensemble

App React mobile-first pour jouer au jeu de rôle solo **Astroprisma** sans le livre physique. Stack : Vite + React 18 + TypeScript + Tailwind + Zustand + Gemini AI (à venir).

### Structure `src/`

```
src/
├── engine/        ← logique de jeu pure (pas de React)
│   └── dice.ts    ← moteur de dés : roll(DiceFormula) → RollResult
├── components/
│   └── ui/        ← design system Astroprisma (Card, Button, StatBlock, DiceButton, ResourceBar, Badge)
├── pages/         ← écrans complets (Styleguide, à terme CharacterSheet, Map, Combat…)
├── stores/        ← état Zustand (à venir Phase 1)
├── ai/            ← intégration Gemini (à venir Phase 3)
└── App.tsx        ← point d'entrée (actuellement → Styleguide)
```

### `data/` — Source unique de vérité

23 fichiers JSON extraits du Core Book officiel (jamais de valeurs inventées) :
`origins`, `weapons`, `weapon-mods`, `armor`, `items`, `hacks`, `cybertech`, `drones`, `enemies`, `starships`, `starship-modules`, `factions`, `oracle`, `exploration-tables`, `planets`, `satellites`, `settlements`, `missions`, `npcs`, `names`, `loot-tables`, `status-conditions`, `abyssal-scars`.

La logique de jeu dans `engine/` lit ces JSON — elle ne hardcode aucune valeur.

### Design system (`src/components/ui/`)

Palette Tailwind custom définie dans `tailwind.config.js` :
- Fond : `bg-astro-black` (`#130d1c`)
- Texte : `text-bone` (`#f0eee8`)
- Accent interactif : `bg-accent` (`#ef476e`) / `bg-accent-deep` (`#d50059`)
- Factions : `bg-warg`, `bg-medusa`, `bg-wire`, `bg-intersolar`, `bg-synth`

Polices : `font-mono` (Space Mono), `font-display` (Anton), `font-serif` (Instrument Serif italic).

Tous les nouveaux écrans doivent utiliser les composants `ui/` — ne pas re-créer des styles ad hoc.

### Moteur de dés (`src/engine/dice.ts`)

Fonction centrale : `roll(formula: DiceFormula): RollResult`. Couvre d4–d20, 2d6, d66, dN+mod, d6×stat. `DiceButton` en est le wrapper React. Pour ajouter une mécanique de résolution, utiliser `roll()` directement dans `engine/` — pas dans les composants.

## Règles projet

- **Valider avant de coder** : chaque module discuté avant implémentation.
- **Données = `book/` uniquement** : toute valeur de règle vient des fichiers `book/*.md` ou des JSON `data/`. Rien d'inventé.
- **Pas de valeur hardcodée** dans la logique : toujours lire depuis `data/*.json`.
- **UI en français**, code/identifiants/JSON en anglais.
- Référence design : `design.md` (palette, composants, ambiance rétro sci-fi).
- Référence gameplay : `idee.md` + `plan.md` (phases, mécaniques, roadmap).
