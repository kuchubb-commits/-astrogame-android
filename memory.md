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
| Phase 2 | Carte hex SVG 36 cases, MOVE/EXPLORE/MARK, journal de cycle persisté | ✅ |
| Phase 3 | Oracle Yes/No d6×d6 + mots-clés, historique Zustand (Gemini reporté) | ✅ |
| Phase 4 | Combat terrestre : initiative, armes, hacks, statuts, victoire/défaite | ✅ |
| Phase 5 | Arsenal : équiper hacks, coût EXP cybertech, noms drones | ✅ |
| Phase 6 | Combat spatial : Action Dice, modules, Shields, Critical, victoire/défaite | ✅ |
| Phase 7 | Settlements : Hangar, WireDoc, Commerce, Scrapyard, Cybersphere, Combat Sim, NPC Generator | ✅ |
| Phase 8 | Factions : Favor (-X→10), joinFaction/leaveFaction, missions d10, événements 2/5/10, fins, troupes/vaisseaux d6, badge MapScreen | ✅ |

### Prochaine étape

**Phase 9 — Équipage & progression longue** :
- Recrutement de crewmembers depuis Home Pods
- Compétences actives des membres d'équipage
- Progression équipage (EXP partagé)
- Effets passifs en combat (bonus stats)

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

### Contenu supplémentaire — Spacefarer's Journal (découvert 2026-06-10)

> Source : `character/Spacefarer_s_Journal_-_Digital_File__Form-Fillable_.pdf`
> À intégrer dans les JSON et l'app (non encore codé).

- **18 ennemis supplémentaires** (DATABASE 01+02) : WARG Grenadier, WARG Partisan Guard, ISF Starscout, ISF Walking Fortress, Medusa Cyphersteel, Medusa Gridripper, Synth Chromesage, Corsair Buccaneer, Corsair Casino Shark + 9 autres (Clone Colonist, Narcoaddict, Afterlife Ghoul, Corpo Paramilitary, Melting Metalskin, Scrapeater, Emperor Scrapeater, Cortex Brainworm, Quetzal Decalaris, Horned Tarrasosaur)
- **12 vaisseaux supplémentaires** (DATABASE 03+04) : 6 vaisseaux de départ alternatifs + 6 vaisseaux **Class-Y exclusifs par faction** (Favor ≥ 4 requis)
- **100 PNJ nommés** (Characters d100) — table de rencontres NPC
- **100 Settlement Quirks** — table de particularités de lieux
- **7 Achievements** : ASTROPRISMA / ORIGIN STORY / SERUM ADDICT / CORE CONFLICT / LONE WOLF / HARDCORE / IMMORTAL

### Audit des données — TERMINÉ ✅ (2026-06-10)

`chapitres/data-verified.md` : toutes les valeurs numériques vérifiées zoom ×4 sur PNG sources.
**Utiliser ce fichier comme référence avant tout codage de stats, dés ou prix.**

Corrections critiques retenues :
- Armures : tiers **+1 / +2 / +3** (jamais +4)
- Weapon Mods : **6 tiers** Ranged + Melee (achetés WARG Settlements)
- MANTIS SCYTHES : **d6 × GRA** (pas d8)
- SUPERNOVA : **3d6** (pas 3d8)
- Critical Condition vaisseau : Hull **≤ 10** (pas ≤ 0)
- Boost Escape : fuite immédiate sans dé, **5 Fuel**, tout moment
- Drones : achat **Synth Settlements uniquement**
- Narcobiotics : obtenus via **rencontres faction Corsaire** — pas d'achat, pas de prix

## Concept central du jeu

> Astroprisma est un **arbre de décision en cascade piloté par des jets de dés successifs** — chaque lancer ouvre une branche, chaque branche mène à un nouveau lancer, jusqu'au texte narratif final (généré par l'IA Gemini à partir du résultat de table + contexte).

Boucle : MOVE (−1 Fuel) → EXPLORE (d6 par anneau) → MARK (carte + journal). But : explorer les 36 hexes d'un système et mener une faction à l'une de ses fins.

## Règles de collaboration

1. **Valider avant de coder** — chaque module discuté avant implémentation. Pas de gold-plating.
2. **Petits commits fréquents** — chaque fonctionnalité = 1 commit, message clair.
3. **Tests manuels d'abord** — lancer l'app et vérifier le comportement avant de passer à la suite.
4. **Données = Core Book + data-verified.md** — tout vient de `book/` et des JSON. Pour toute valeur numérique (dés, prix, stats), vérifier d'abord `chapitres/data-verified.md`. Aucune règle inventée.
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
