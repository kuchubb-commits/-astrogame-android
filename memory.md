# Mémoire — Astroprisma App

## Projet

- **Dossier** : `C:\Users\PC-DELL\.claude\projects\astrogame-android`
- **GitHub** : https://github.com/kuchubb-commits/-astrogame-android.git
- **Stack** : React + Vite + TypeScript + Tailwind + Zustand + Gemini AI
- **Skill** : dire "astrogame" charge le skill de projet

## État actuel

### Phases complétées ✅

| Phase | Contenu | Statut |
|---|---|---|
| Phase 0 | Vite + React + TS + Tailwind + Zustand + 23 JSON | ✅ |
| Phase Design | Palette Tailwind, polices Google, 6 composants UI, Styleguide | ✅ |
| Phase 1 | CharacterCreation, PlayerSheet, StarshipSheet, Zustand persist | ✅ |

### Prochaine étape

**Phase 2 — Carte & cycle d'exploration** :
- Grille hex SVG 36 cases (3 anneaux + étoile centrale)
- MOVE (−1 Fuel) → EXPLORE (d6 par anneau) → MARK (carte + journal)
- Résolution via `data/exploration-tables.json`
- Journal de cycle persisté
- 3ème onglet "Carte" dans BottomNav

### Architecture actuelle (`src/`)

```
src/
├── engine/dice.ts           ← moteur de dés
├── components/ui/           ← Card, Button, StatBlock, DiceButton, ResourceBar, Badge, BottomNav
├── pages/                   ← CharacterCreation, PlayerSheet, StarshipSheet, Styleguide
├── stores/gameStore.ts      ← état global Zustand (persist localStorage)
├── types/game.ts            ← Character, Starship, PlayTab
└── App.tsx                  ← routing : création → fiches (BottomNav)
```

### Extraction Core Book — TERMINÉE ✅

`book/` : 11 chapitres (ch1–ch11). Toutes les données du jeu viennent de là.
`data/` : 23 fichiers JSON extraits — source unique de vérité.

## Concept central du jeu

> Astroprisma est un **arbre de décision en cascade piloté par des jets de dés successifs** — chaque lancer ouvre une branche, chaque branche mène à un nouveau lancer, jusqu'au texte narratif final (généré par l'IA Gemini à partir du résultat de table + contexte).

Boucle : MOVE (−1 Fuel) → EXPLORE (d6 par anneau) → MARK (carte + journal). But : explorer les 36 hexes d'un système et mener une faction à l'une de ses fins.

## Règles de collaboration

1. **Valider avant de coder** — chaque module discuté avant implémentation. Pas de gold-plating.
2. **Petits commits fréquents** — chaque fonctionnalité = 1 commit, message clair.
3. **Tests manuels d'abord** — lancer l'app et vérifier le comportement avant de passer à la suite.
4. **Données = Core Book uniquement** — tout vient de `book/`. Aucune règle inventée.
5. **Langue** — UI en français, code/chemins/identifiants en anglais.

## Règle zoom images (Pillow ×3)

Si une zone d'image est trop peu lisible pour extraire une info avec certitude :
1. Ne jamais inventer ni mettre `(?)` sans avoir tenté le zoom.
2. Identifier la zone illisible (coordonnées approximatives).
3. Agent Sonnet → crop + zoom ×3 avec Pillow :
   ```python
   from PIL import Image
   img = Image.open("fichier.png")
   zone = img.crop((x1, y1, x2, y2))
   zone.resize((zone.width * 3, zone.height * 3), Image.LANCZOS).save("zoom_temp.png")
   ```
4. L'agent lit `zoom_temp.png` et extrait l'info.
5. Supprimer `zoom_temp.png` immédiatement — jamais committer les fichiers temp.
6. `(?)` uniquement si le zoom reste illisible → demander à l'utilisateur.
