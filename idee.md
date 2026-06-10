# idee.md — Astroprisma App

> Vision, concept et mécaniques du jeu que l'application doit couvrir.
> Source unique : Astroprisma Core Book (extraction complète dans `book/`).

---

## 1. Vision du projet

**Astroprisma App** est une application mobile compagnon qui permet de jouer au jeu de rôle solo (et coopératif) **Astroprisma** de bout en bout, **sans jamais ouvrir le livre physique**.

- **Pour qui** : un joueur solo (ou un petit groupe sans maître de jeu) qui veut explorer la galaxie d'Astroprisma sur son téléphone, en mode Quick (parties courtes) ou Journaling (narration immersive).
- **Pourquoi** : le jeu de base repose sur des dizaines de tables de résolution, une feuille de personnage complexe, une feuille de vaisseau, une carte hexagonale à dessiner, des règles de combat terrestre et spatial, du hacking, de l'exploration, cinq factions avec leurs quêtes, une base de données d'ennemis et de vaisseaux. Tout cela est lourd à manipuler à la main : feuille papier + crayon + dés polyédriques + va-et-vient constant dans le livre.
- **Ce que l'app résout** : elle automatise les jets de dés, applique les règles, tient à jour les fiches et la carte, déroule les tables de rencontre, gère le combat tour par tour, et utilise une **IA narrative (Gemini)** pour transformer les résultats de tables (souvent abstraits, façon Oracle) en récit vivant et cohérent.

---

## 2. Concept central du jeu

Le joueur incarne un **Spaceborne** : un explorateur qui quitte la sécurité de sa communauté pour fouiller les ruines de l'**Old World** à la recherche de reliques (vaisseaux, armes, implants cybernétiques). L'univers est post-apocalyptique : civilisation effondrée, humanité dispersée, espace sauvage peuplé de pirates et de chasseurs de primes.

**But du jeu** : explorer l'intégralité d'un **système stellaire** (carte hexagonale de 36 hexes organisée en 3 anneaux : Outer / Middle / Inner) et aider l'une des **5 factions** à atteindre l'un de ses objectifs finaux. En mode Campagne, on enchaîne 3 systèmes de difficulté croissante.

### Boucle de gameplay (Exploration Cycle)

Chaque cycle d'exploration suit 3 étapes :

1. **MOVE** — Déplacer le vaisseau de 1 hex sur la carte (coûte **1 Fuel**).
2. **EXPLORE** — Lancer un **d6** sur l'Exploration Roll de l'anneau courant, identifier la rencontre (Settlement, Ring Event, Hostile, Neutral, Planet, Faction), la résoudre via les sous-tables et jets en cascade.
3. **MARK** — Noter la découverte sur la carte et consigner l'événement dans le Journal.

Autour de cette boucle se greffent : combat terrestre, combat spatial, hacking, activités en Settlement (soin, ravitaillement, craft, recrutement, Cybersphere), montée de Favor avec les factions, et événements narratifs déclenchés par l'**Oracle**.

---

## 3. Grandes mécaniques à couvrir

### 3.1 Création de personnage
- **6 Origins** (Esoterorist, Glitchblade, Wirehead, Astromancer, Desperado, Chromeskin) — chacune fixe les stats de départ et l'équipement initial.
- **4 stats** : VIGOR, GRACE, MIND, TECH.
- Départ : 2 Health Packs, 50 Scope, 3 Serum.
- Générateur de noms (personnage, vaisseau, planète, satellite, settlement) via tables d66/d100/d20.

### 3.2 Feuilles & ressources
- **3 feuilles** : Player Sheet, Starship Sheet (partagée), Star System Map (partagée).
- Ressources : Health, Energy, Armor, **Hyperdrive** (jauge spéciale : reroll / dégâts max / capacité gratuite), Status Tracker.
- Économie : **EXP** (implants, modules), **Serum** (monnaie), **Scraps** (craft/réparation), **Favor** (par faction, -X à +10).
- Inventaire 8 slots, max 3 armes, 3 Memory Slots (extensibles).

### 3.3 Système de dés & résolution
- Notation : d6, 2d6, d66, d6+N, d6×stat ; dés polyédriques d4→d20.
- **Challenge Roll** : dé + modificateur vs dé de difficulté (réussi si ≥).
- **Oracle** : table double d6 (Yes/No + 6 nuances : No And → Yes And) + tables de mots-clés narratifs ; questions ouvertes comme amorces narratives.

### 3.4 Combat terrestre
- Tour par tour, ordre d'initiative (d10 + GRA).
- Actions : WEAPON, HACK, CYBERTECH, ESCAPE + Main/Side Action.
- **Status conditions** : Overheat, Shock, Stun, Silence, Breach, Immunity (+ Blinded, Beaconed, Toxins).
- Armes (8 ranged, 6 melee), **Weapon Mods (Tiers 1–6, max 2 par arme, achetés aux WARG Settlements)**, calcul des dégâts ordonné, dégâts directs, multi-ennemis, EXP par difficulté.
- Mods Ranged : Silencer(1/75★) · Laser Accelerator(2/75★) · Reflex Sight(3/100★) · Malware Injection(4/100★) · Auto Reloader(5/150★) · Smart Aim(6/150★).
- Mods Melee : Stealth Grip(1/75★) · Counter Guard(2/75★) · Vibrating Motor(3/100★) · Heat Chamber(4/100★) · Kinetic Engine(5/150★) · Charge Attack(6/150★).

### 3.5 Hacking & Drones
- HACKS (10) résolus en MIN ; échec → Malware (table d10). Achetés aux **Medusa Settlements (150★)**.
- Master Hacks (6) — coût 3♦ chacun, non-achetables, vendus 200★.
- 4 Drones/Mechs (Spider 150★ · Greyhound 350★ · Ladybug 350★ · ÔwÓ 600★) avec ability passive + actives.
- **Dégâts drones = jamais Direct Damage** → ignorent IMMUNITY et Armor.
- **Achat exclusif : Synth Settlements uniquement.**

### 3.6 Cybertech
- 6 fabricants (Synbios, Yedrsl, Frontera, Orbital, Evo, Rip Tec), 18 implants (3 tiers), boost de stats + abilities, achat/retrait chez les Wiredocs.
- Valeur vérifiée : **MANTIS SCYTHES = d6 × GRA** (Frontera tier 3), ×2 si premier dans l'ordre de tour.

### 3.7 Équipement & loot
- 22 items, grenades, status cures, quest items, scraps.
- Armor Sets (10 sets, tiers **+1/+2/+3 Armor**, immunités pour tiers +2 ATHENA/ORION/MERCURIAN/HADES, prix 50→300★).
- Narcobiotics (6 : B1→B6) + règle d'Overdose (Stage 0→4). Obtenus **uniquement via les rencontres de faction Corsaire** — pas de prix, pas d'achat.
- Tables de loot aléatoire (d18 loot, d6 boss).

### 3.8 Combat spatial
- **Action Dice** (d6 selon Engines), Hull **20 fixe**, Shields (stack jusqu'à 8), Boarding, Escape / Boost Escape.
- **Critical Condition** = Hull **≤ 10** (pas ≤ 0).
- **Boost Escape** = fuite immédiate sans dé, coût 5 Fuel, même pendant le tour ennemi.
- Modules de vaisseau (Engines, Control, Systems, Weapons — 8 par catégorie, 4 tiers, prix 70→350★).
- 18 vaisseaux pré-construits en classes C/B/A/S + tables de Captains.

### 3.9 Exploration & contenu
- Settlements : Hangar (refuel, ships, modules), Wiredoc (heal, cybertech), Trade Post, Trading Hub, activités (Test Flight, Cybersphere, Scrapyard, Combat Sim, Home Pods), Sidequests par faction.
- **Cybersphere** : mini-jeu de réseau (10 tuiles diamant, Memory Clock 12 mouvements, tables d66 d'encounters et de rewards, Abyssal Scar si épuisement).
- Rencontres par anneau (Outer/Middle/Inner Events), Hostile/Neutral encounters, Faction encounters.
- **Planètes** (6 types, landing spots + encounters) et **Satellites** (6 types, landing spots + encounters).
- **Abyssal Scars** : table de quasi-mort (d6) gérant survie et séquelles permanentes.

### 3.10 Factions & narration longue
- 5 factions (W.A.R.G., ISF, Medusa Sector, Corsair Syndicate, Synth Arch).
- Favor 2/5/10 → Faction Events (rejoindre / mission majeure / 3 fins possibles).
- Missions répétables (tables d10 : objectif + lieu + complication + récompense), encounters neutres/hostiles, troupes et vaisseaux par faction.
- Générateur de PNJ (trade, emotion, look, reaction, goal, requests d100).

### 3.11 Base de données (auditée et vérifiée — `data-verified.md`)
- **30 ennemis** Core Book (statblocks complets : HP, Armor, stats, actions par jet, skills, loot, bosses). Tous validés sur PNG.
- **+18 ennemis supplémentaires** (Spacefarer's Journal DATABASE 01+02) — à intégrer.
- **18 vaisseaux ennemis** Core Book (classes C/B/A/S, Hull 20, Actions 2–4), modules, Captains.
- **+6 vaisseaux de départ alternatifs** + **+6 vaisseaux Class-Y faction** (Favor ≥ 4, exclusifs) — Spacefarer's Journal DATABASE 03+04.
- **100 PNJ nommés** (Characters d100) + **100 Settlement Quirks** — tables de rencontres du Journal.
- **7 Achievements** : ASTROPRISMA · ORIGIN STORY · SERUM ADDICT · CORE CONFLICT · LONE WOLF · HARDCORE · IMMORTAL.
- **Source de vérité stats** : `chapitres/data-verified.md` — toutes les valeurs vérifiées zoom ×4 sur PNG sources.

---

## 4. Ce que l'app remplace concrètement

Tout ce qu'un joueur devrait sinon chercher dans le livre ou gérer à la main :

- **Feuille de personnage papier** → fiche interactive (stats, ressources, inventaire, armes, statuts, mémoire).
- **Feuille de vaisseau** → fiche vaisseau (Hull, Fuel, modules, cargo, équipage).
- **Carte hexagonale dessinée au crayon** → carte numérique interactive (hexes, anneaux, découvertes, factions, points d'intérêt).
- **Dés polyédriques** → lanceur intégré (d4→d20, d66, 2d6, formules d6×stat).
- **Toutes les tables de résolution** → moteur de tables (Oracle, exploration par anneau, planètes, satellites, rencontres, loot, missions, PNJ, noms).
- **Allers-retours dans le livre pour les statblocks** → base de données ennemis/vaisseaux/modules consultable et jouable.
- **Suivi mental du combat** (tours, statuts qui stack, dégâts, initiative) → moteur de combat terrestre et spatial.
- **Calculs** (dégâts ordonnés, overdose, favor, EXP, coûts) → automatisés.
- **Narration façon « j'invente à partir du résultat »** → assistant IA Gemini qui transforme tables + contexte (lieu, faction, état du personnage) en récit cohérent et journalisé.
- **Mémoire de campagne** (état des factions, Favor, séquelles, journal) → persistance via Zustand.

---

## 5. Ambition finale

Faire d'Astroprisma App **le seul outil nécessaire pour jouer** : on ouvre l'app, on crée son Spaceborne, et on joue une campagne complète (3 systèmes) du premier cycle d'exploration jusqu'à l'une des fins de faction — sans livre, sans dés physiques, sans feuille papier. L'IA narrative donne vie à chaque rencontre pour que le jeu se lise comme une histoire dont on est le héros, pas comme une succession de jets de tableaux.

À terme : fidélité de règles à 100 % avec le Core Book, expérience mobile fluide, et un journal de campagne exportable que le joueur garde comme trace de son aventure.
