# Mémoire — Astroprisma App

## Projet

- **Dossier** : `C:\Users\PC-DELL\.claude\projects\astrogame-android`
- **GitHub** : https://github.com/kuchubb-commits/-astrogame-android.git
- **Stack** : React + Vite + TypeScript + Tailwind + Zustand + Gemini AI
- **Skill** : dire "astrogame" charge le skill de projet

## État actuel

### Extraction Core Book — TERMINÉE ✅

L'intégralité du Core Book (ch1 à ch11) est extraite et disponible dans `book/` :

| Fichier | Contenu |
|---|---|
| `ch1-introduction.md` | The World, The Game, Exploration, Oracle |
| `ch2-rules.md` | Création perso, Origins, Stats, Connections, Crew, Starship Sheet, Travel |
| `ch3-combat.md` | Combat terrestre, armes, weapon mods |
| `ch4-hacking-drones.md` | Hacks, Malware, Master Hacks, Drones, Cybertech |
| `ch5-equipment.md` | Items, grenades, armures, narcobiotics, loot tables |
| `ch6-starship-combat.md` | Combat spatial, modules (Engines/Control/Systems/Weapons) |
| `ch7-exploration.md` | Settlements, Cybersphere, rencontres par anneau, planètes, satellites, Abyssal Scars |
| `ch8-factions.md` | 5 factions, Favor, Faction Events, missions, encounters |
| `ch9-enemies.md` | 20 ennemis (statblocks complets) |
| `ch10-starships.md` | 18 vaisseaux + tables de Captains |
| `ch11-name-generator.md` | Tables de noms, exploration, générateur de PNJ |

Toutes les données du jeu viennent de ces fichiers. Aucune règle inventée.

### Documents de référence

- `idee.md` — vision, concept, mécaniques à couvrir, ce que l'app remplace.
- `plan.md` — roadmap par phases (toutes ⬜ à faire), du MVP jouable à l'app complète.
- `book/` — extraction complète du Core Book.

### Prochaine étape

Démarrer la **Phase 0** du `plan.md` (fondations techniques + extraction JSON), après validation du périmètre.

## Concept central du jeu

> Astroprisma est un **arbre de décision en cascade piloté par des jets de dés successifs** — chaque lancer ouvre une branche, chaque branche mène à un nouveau lancer, jusqu'au texte narratif final (généré par l'IA Gemini à partir du résultat de table + contexte).

Boucle : MOVE (−1 Fuel) → EXPLORE (d6 par anneau) → MARK (carte + journal). But : explorer les 36 hexes d'un système et mener une faction à l'une de ses fins.

## Règles de collaboration

1. **Valider avant de coder** — chaque module discuté avant implémentation. Pas de gold-plating.
2. **Petits commits fréquents** — chaque fonctionnalité = 1 commit, message clair.
3. **Tests manuels d'abord** — lancer l'app et vérifier le comportement avant de passer à la suite.
4. **Données = Core Book uniquement** — tout vient de `book/`. Aucune règle inventée. En cas de doute, relire le chapitre.
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
