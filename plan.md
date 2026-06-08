# plan.md — Astroprisma App

> Roadmap de développement, ordonnée du minimum jouable vers l'app complète.
> Stack : React + Vite + TypeScript + Tailwind + Zustand + Gemini AI.
> Source de toutes les données : `book/` (extraction Core Book complète).

---

## Règles de collaboration

- **Valider avant de coder** : on discute du périmètre d'une phase / d'une fonctionnalité avant l'implémentation. Pas de gold-plating.
- **Petits commits** : un commit = une fonctionnalité ou un correctif clair. Messages explicites.
- **Tests manuels** : chaque fonctionnalité est testée à la main dans l'app avant de passer à la suivante. On vérifie que les règles correspondent au livre.
- **Données = PDF uniquement** : toutes les valeurs (stats, dés, coûts, tables) viennent des fichiers `book/`. **Aucune règle inventée.** En cas de doute, on relit le chapitre concerné.
- **Données en JSON** : le contenu du livre est extrait dans des fichiers `data/*.json` séparés de la logique. La logique de jeu ne hardcode pas les valeurs.
- **Langue** : UI en français, code/chemins/identifiants en anglais.
- **Validation de phase** : une phase est close uniquement quand son critère « c'est fini quand… » est rempli et testé.

---

## Phase 0 — Fondations techniques ⬜

**Objectif** : projet qui démarre, structure claire, données prêtes à l'emploi.

- Init Vite + React + TS + Tailwind + Zustand.
- Arborescence : `src/`, `data/`, `components/`, `stores/`, `engine/`, `ai/`.
- Extraire le Core Book en JSON : `origins.json`, `weapons.json`, `armor.json`, `items.json`, `hacks.json`, `cybertech.json`, `drones.json`, `enemies.json`, `starships.json`, `modules.json`, `factions.json`, `oracle.json`, `exploration-tables.json`, `planets.json`, `satellites.json`, `npcs.json`, `names.json`.
- Composant de jet de dés central (d4–d20, d66, 2d6, d6×stat, dé+mod).

**C'est fini quand** : l'app démarre, les JSON sont chargeables, et un lanceur de dés générique fonctionne.

---

## Phase Design — Système visuel & composants de base ⬜

**Objectif** : poser l'identité visuelle Astroprisma dans l'app avant de construire les écrans, pour que toutes les phases suivantes réutilisent les mêmes briques. Référence : `design.md`.

- **Palette Tailwind custom** : étendre `tailwind.config` avec les couleurs du jeu — `indigo-black #130d1c`, `bone-white #f0eee8`, `off-white #e0dfdb`, accent `#ef476e` / `#d50059`, gradient `yellow #ffbd5c` / `orange #ff603e` / `magenta #d50059` / `indigo`, et les couleurs de factions (WARG Red, Medusa Green, Wire Teal, Intersolar Blue — échantillonner/valider les hex manquants sur le Core Book).
- **Typographie** : intégrer les polices (corps `Space Mono`, titres `Anton`/POWERR, italique `Instrument Serif`) ; définir l'échelle de tailles.
- **Composants de base** : `Card` (bordure noire épaisse, fond surface), `Button` (primaire/secondaire/disabled + état pressé `#d50059`), `StatBlock` (label mono + valeur), `DiceButton` (déclenche le lanceur central de la Phase 0), `ResourceBar` (jauge Health/Energy/Hull/Fuel avec états danger/warning), `Badge` (pastille de faction colorée).
- **Grille mobile & breakpoints** : base 4 px (4/8/12/16/24/32), arrondis (`rounded-lg`/`xl`), bordures noires 2-3 px ; breakpoints Tailwind mobile-first (`sm`/`md`/`lg`), layout pensé pour portrait.
- **Dark mode par défaut** : fond `#130d1c`, texte `#f0eee8` ; overlay halftone/grain subtil optionnel.
- **États standardisés** : actif / inactif / danger / succès / warning (voir tableau des états dans `design.md`).

**C'est fini quand** : une page de démo (`/styleguide`) affiche tous les composants de base (Card, Button, StatBlock, DiceButton, ResourceBar, Badge) dans le style Astroprisma, en dark mode, avec la palette et les polices appliquées.

---

## Phase 1 — Personnage & feuilles (jouer « à vide ») ⬜

**Objectif** : créer un personnage et consulter/éditer ses fiches.

- Création de personnage : choix d'Origin (stats + équipement de départ), nom (manuel ou générateur).
- Player Sheet : stats, Health/Energy/Armor/Hyperdrive, inventaire 8 slots, 3 armes, Memory Slots, ressources (EXP/Serum/Scraps/Favor).
- Starship Sheet : Hull 20, Fuel, Cargo 6, 6 slots modules ; choix d'un vaisseau de départ.
- Persistance Zustand (sauvegarde locale d'une partie).

**C'est fini quand** : on crée un Spaceborne complet, ses fiches sont éditables et survivent à un rechargement.

---

## Phase 2 — Carte & cycle d'exploration minimal ⬜

**Objectif** : jouer le premier cycle d'exploration de bout en bout (hors combat détaillé).

- Carte hexagonale 36 hexes, 3 anneaux, étoile centrale, position du token.
- MOVE (−1 Fuel) + EXPLORE (d6 Exploration Roll de l'anneau) + MARK (découverte sur la carte).
- Résolution en cascade des résultats simples (Settlement / Ring Event / Planet / Neutral) via les tables.
- Journal de cycle (log des événements).

**C'est fini quand** : on peut enchaîner plusieurs cycles, la carte se remplit, le Journal s'écrit, et le Fuel se décompte.

---

## Phase 3 — Oracle & IA narrative ⬜

**Objectif** : transformer les résultats de tables en récit.

- Moteur Oracle (Yes/No double d6 + mots-clés, questions ouvertes).
- Intégration Gemini : prompt construit à partir du résultat de table + contexte (lieu, anneau, faction, état du personnage) → texte narratif.
- Affichage narratif dans le Journal, mode Quick vs Journaling.

**C'est fini quand** : une rencontre tirée au sort produit un paragraphe narratif cohérent, et l'Oracle répond aux questions Yes/No et ouvertes.

---

## Phase 4 — Combat terrestre ⬜

**Objectif** : résoudre un combat contre les ennemis de la base de données.

- Moteur de tours : initiative (d10+GRA), Main/Side Action, ordre de jeu.
- Actions WEAPON / HACK / CYBERTECH / ESCAPE, calcul des dégâts ordonné.
- Status conditions (Overheat, Shock, Stun, Silence, Breach, Immunity + variantes) avec stack et expiration.
- Statblocks ennemis (20) jouables : actions par jet, skills, loot, gain d'EXP par difficulté.
- Multi-ennemis, bosses.

**C'est fini quand** : on lance un combat contre un ou plusieurs ennemis, on gagne/perd correctement, et le loot/EXP est attribué.

---

## Phase 5 — Hacking, Drones, Cybertech, Équipement ⬜

**Objectif** : compléter l'arsenal du personnage.

- HACKS (10) + Malware (d10) + Master Hacks (6).
- Drones (4) déployables avec abilities.
- Cybertech (18 implants) : achat/retrait, effets passifs/actifs.
- Items, grenades, status cures, Armor Sets (10), Narcobiotics + Overdose, quest items.
- Tables de loot (d18, boss d6), craft (Scrapyard).

**C'est fini quand** : le personnage peut acquérir, équiper et utiliser hacks, drones, implants et équipement, avec leurs effets en combat.

---

## Phase 6 — Combat spatial ⬜

**Objectif** : résoudre un affrontement de vaisseaux.

- Action Dice (d6 selon Engines), Shields (stack 8), Hull, Critical Condition.
- Modules (Engines/Control/Systems/Weapons, 8×4) avec seuils d'activation.
- Boarding, Escape, Boost Escape.
- 18 vaisseaux pré-construits + Captains.

**C'est fini quand** : on mène un combat spatial complet contre un vaisseau ennemi, modules et shields fonctionnent, le boarding bascule vers le combat terrestre.

---

## Phase 7 — Settlements & activités ⬜

**Objectif** : disposer des hubs de jeu.

- Settlement : faction au contrôle (d10), refuel, full heal Hull/Health, Bounty payoff.
- Trade Post / Trading Hub (achat/vente, items exclusifs par faction).
- Activités : Test Flight, Scrapyard (craft/dismantle), Combat Sim, Home Pods (PNJ + recrutement).
- **Cybersphere** : mini-jeu réseau (d8 layout, 10 tuiles, Memory Clock 12, tables d66 encounters/rewards, Abyssal Scar).
- Sidequests par faction.

**C'est fini quand** : on peut entrer dans un Settlement, se soigner, ravitailler, commercer, crafter, recruter, et jouer une partie de Cybersphere.

---

## Phase 8 — Factions & narration longue ⬜

**Objectif** : donner un but à la campagne.

- Système de Favor (-X → +10), seuils 2/5/10, expulsion.
- Faction Events (rejoindre / mission majeure / 3 fins).
- Missions répétables par faction (tables d10 objectif+lieu+complication+récompense).
- Encounters neutres/hostiles par faction, troupes, vaisseaux.
- Faction Strength sur la carte.

**C'est fini quand** : on peut monter en Favor, rejoindre une faction, enchaîner ses missions et déclencher une fin de faction.

---

## Phase 9 — Crew, Connections & PNJ ⬜

**Objectif** : enrichir l'équipage et le social.

- Connections (Affinity 5 → recrutement), Social Stats/Rolls.
- Crewmembers (max 4, rôles, passive + 3 active skills, inventaire), actions d'équipage.
- Générateur de PNJ complet (trade/emotion/look/reaction/goal/requests d100).

**C'est fini quand** : on recrute des crewmembers et des connections, ils agissent en jeu, et le générateur de PNJ produit des rencontres exploitables par l'IA.

---

## Phase 10 — Abyssal Scars, Campagne, Multijoueur, Polish ⬜

**Objectif** : finaliser l'expérience longue.

- Abyssal Scars (quasi-mort d6, séquelles permanentes).
- Mode Campagne (3 systèmes enchaînés, difficulté croissante).
- Achievements.
- Export du journal de campagne.
- Polish UI/UX mobile, modes Quick/Journaling, sauvegardes multiples.

**C'est fini quand** : une campagne complète est jouable du premier cycle à une fin, avec gestion de la mort et un journal exportable.

---

## Note de priorisation

La Phase 0 et la Phase Design forment les **fondations** (technique + système visuel) ; les phases 0→3 forment le **MVP jouable** (créer un perso, explorer, narrer). Les phases 4→6 ajoutent les systèmes de résolution lourds (combats, arsenal). Les phases 7→10 apportent la profondeur de campagne. On ne démarre une phase qu'après validation de la précédente.
