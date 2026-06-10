# design.md — Astroprisma App

> Identité visuelle et système de design de l'app, extraits des fichiers officiels
> du Creator Kit (Design Guide, Assets), des SVG (Star System Map Tool, Starship
> Builder), des logos « Compatible with ASTROPRISMA » et des feuilles de personnage.
> Objectif : recréer en mobile (dark mode) l'esthétique rétro sci-fi du jeu de base.

---

## 1. Identité visuelle

### Palette de couleurs

Couleurs confirmées par les hex codes extraits des SVG officiels + Design Guide.

**Neutres (noir & blanc de marque)** — hex confirmés Design Guide PDF

| Rôle | Nom officiel | Hex | Usage |
|---|---|---|---|
| Noir principal | ASTROPRISMA BLACK | `#2D2A32` | Fond de page & texte. Indigo très sombre (pas un noir pur). **Base du dark mode.** |
| Noir profond | RICH BASIC BLACK | `#171318` | Quasi-noir pour les bordures les plus marquées |
| Noir pur | Pure Black | `#000000` | Contours, bordures épaisses, traits d'icônes |
| Blanc | ASTROPRISMA WHITE | `#F6F4EC` | Texte sur fond sombre, fonds de page clairs |
| Blanc 2 | ASTROPRISMA OFF-WHITE | `#F6F5EE` | Détails de fond, séparateurs, surfaces secondaires |
| Blanc chaud | BASIC WHITE | `#F0E7DF` | Variante chaude, surfaces de composants |

**Accent (rose, couleur signature du jeu)** — hex confirmés Design Guide PDF

| Rôle | Nom officiel | Hex | Usage |
|---|---|---|---|
| Accent principal | ASTROPRISMA PINK | `#EC3571` | Titres, éléments interactifs, boutons primaires |
| Accent foncé | DARK PINK | `#DF195E` | États pressés, variante |
| Accent très foncé | SHADOW PINK | `#B71E49` | Médailles d'achievement, ombres d'accent |

**Gradient ASTROPRISMA** (4 couleurs — logo officiel) — hex confirmés Design Guide PDF

| Position | Nom officiel | Hex | Section du livre |
|---|---|---|---|
| 1 | GRADIENT YELLOW | `#FAC855` | Equipment & Loot |
| 2 | GRADIENT ORANGE | `#EE5439` | (transition) |
| 3 | GRADIENT MAGENTA | `#DE125C` | (transition) |
| 4 | GRADIENT INDIGO | `#4E2F90` | Factions |

> Le gradient se lit Yellow → Orange → Magenta → Indigo. Barres verticales du logo, dégradés de titres, séparateurs de sections.

**Couleurs de factions** — hex confirmés Design Guide PDF (5 factions)

| Faction | Nom officiel | Hex | Section du livre |
|---|---|---|---|
| W.A.R.G. | WARG RED | `#D8222F` | Weapons |
| ISF / Intersolar | INTERSOLAR BLUE | `#61C3BC` | Hacks *(teal, pas bleu)* |
| Medusa Sector | MEDUSA GREEN | `#49B773` | Cybertech |
| Corsair Syndicate | CORSAIR YELLOW | `#F8AE16` | — |
| Synth Arch | SYNTH MAGENTA | `#DF1B60` | — |

> Note : Wire Teal (Drones & Mechs) = variante de Medusa Green, légèrement plus froide.

### Typographie

Polices officielles (du Design Guide, p.2). Toutes ont des équivalents Google Fonts.

| Police | Rôle | Usage dans le jeu | Équivalent web |
|---|---|---|---|
| **Feature Mono** | Texte principal | Corps de texte. *Light* = normal, *Medium* = gras, *Hairline* = détails. | `Space Mono`, `JetBrains Mono`, ou `IBM Plex Mono` |
| **Newake** (payante) | Titres / logo | Titres principaux, logo ASTROPRISMA. | **POWERR** (gratuite, alternative officielle) |
| **Rimma Sans** | Titres secondaires | Page Settlements, titres d'Achievements. | `Archivo`, `Anton` |
| **Free Fat Font** | Display | Noms d'Origins, certains titres. | `Anton`, `Bungee` |
| **Genesys** | Graphiques | Noms d'armes, certains titres. | display géométrique |
| **Instrument Serif** | Italique | Texte italique, titres, labels sur les cartes système. | `Instrument Serif` (Google Fonts) |
| **ST-Cyberillic** | Décoratif | Page ORACLE, Quick Tables. | display sci-fi |
| **Schabo** | Décoratif / titres | Page Cybersphere, noms de Hacks. | `Oswald` condensé |

**Recommandation app** : limiter à 2-3 familles pour la perf mobile.
- Corps : `Space Mono` (mono = base de l'identité).
- Titres : `Anton` / `POWERR` (display gras condensé).
- Accents italiques (labels carte, citations) : `Instrument Serif`.

### Formes, motifs & texture

- **Hexagone** : motif central. Tuiles de la carte stellaire = grands hexagones à bordure noire épaisse.
- **Bordures noires épaisses** (`#000000`) tout autour des cartes/tuiles — style sticker/rétro.
- **Cercles concentriques** : anneaux orbitaux (les 3 Rings du système), étoile centrale en disque plein.
- **Barres verticales arrondies** : motif gradient du logo (4 barres Yellow/Orange/Magenta/Indigo).
- **Filtre halftone** : trame de points sur chaque fond, opacité 50 % → aspect rétro imprimé.
- **Filtre noise/grain** : grain léger superposé (visible sur les fonds bone white).

### Ambiance & style

**Rétro sci-fi / retro-futurisme imprimé**, et non cyberpunk néon. Caractéristiques :
- Palette chaude (bone white, indigo profond) plutôt que froide.
- Texture papier/halftone qui évoque le pulp sci-fi et le print vintage.
- Accents vifs (rose, gradient solaire) sur fonds sobres.
- Typo mono + display gras = ambiance « manuel de bord » + affiche rétro.
- Espace, exploration, station spatiale ; ton aventure narrative, pas dystopique.

---

## 2. Composants UI à recréer

### Feuille de personnage — Character Sheet 2.0 (3 pages)

> Source : `character/Character_Sheet_2.0__Digital_Form-Fillable_PDF_.pdf`
> Format A3 paysage, 2 colonnes par page, fond blanc, noir pur, zéro couleur.

#### PAGE 1 — Stats & équipement

**Colonne gauche :**
- `DialKnob` × 4 en ligne : **HEALTH** (grand) · **ARMOR** · **EXP** · **ENERGY** (grand) — cercle avec tick-marks radiales, valeur centrale
- `SegmentedBar` horizontal : **HYPERDRIVE** (~12 segments activables) + champ numérique ✳
- `FactionCounter` × 5 en ligne : icônes dragon / globe / méduse / roue barrée / crâne + champ `0` chacune
- `DialKnob` × 4 en colonne : **VIGOR · GRACE · MIND · TECH** — label dans rectangle noir + cadran
- Zone texte `CYBERTECH` : 6 lignes dashed numérotées
- `EnemyTracker` bas : colonnes **Health | Armor | Effects**
- Éléments décoratifs : boulons aux coins, hachures diagonales, code-barres vertical `STEREO`

**Colonne droite :**
- Champs texte : **NAME** + **ORIGIN** côte à côte
- `NumberedSlot` × 6 : **MEMORY SLOTS** (slots 4–6 avec icône cadenas = verrouillés)
- `WeaponCard` × 2 côte à côte : **WEAPON 1 / WEAPON 2** — label vertical `MODS` sur bord, 3–4 lignes dashed
- `NumberedSlot` × 8 en 2 colonnes : **INVENTORY**

**Bande bas pleine largeur :**
- `StatusConditionBadge` × 6 : **STUN · BREACH · SHOCK · SILENCE · IMMUNITY · OVERHEAT**
- Style stencil bold blanc sur fond noir, checkbox rond devant chaque
- Zone **NOTES** en bas droit

#### PAGE 2 — Vaisseau & Équipage

**Colonne gauche (vaisseau) :**
- Grande zone graph-paper quadrillée (dessin libre du plan vaisseau)
- Grille **6 modules** en 2×3 : CONTRÔL · ENGINES · MODULE × 4 (labels verticaux, zones texte)
- Ligne : **HULL** `20` · **FUEL** `20` · **SHIELDS** champ texte
- `NumberedSlot` × 6 en 2×3 : **CARGO HOLD**
- Logo décoratif `ST/AR/SH/IP` bold très large

**Colonne droite (équipage & connexions) :**
- `CrewCard` × 4 empilées, chacune contient :
  - Champs : NAME · ROLE · PASSIVE
  - `DialKnob` : HP (défaut 20) + icône bouclier
  - Mini-`DialKnob` × 4 en ligne : VIG · GRA · MIN · TEC
  - `NumberedSlot` × 4 : INVENTORY équipier
  - Champs SKILL 1 · SKILL 2 · SKILL 3
  - Numéro de carte (1–4) en coin
- `ConnectionRow` × 7 : colonnes **NAME | LOCATION | DATA** + 3 hexagones à droite
- Tracker : **STARSHIP NAME** + **CREW NAME**

#### PAGE 3 — Carte & Journal

**Colonne gauche :**
- `HexGrid` 36 hexagones numérotés, concentrique, hexagone central `STAR` (fond noir), cercles orbitaux superposés
- Champs : **SYSTEM NAME** · **SYSTEM TYPE** · **FACTION STRENGTH** (5 compteurs faction)

**Colonne centre :**
- `QuestEntry` × 8 : numéros romains I–VIII, 2 lignes dashed chacun, vis aux coins
- `MissionCard` × 3 côte à côte (I, II, III) : zone hachurée + champ **OUTCOME**

**Colonne droite :**
- `MemoryClockCard` × 6 : header `MEMORY CLOCK` + `SegmentedBar` (10–12 segments) + grille de losanges (◇×9–12) à cocher
- Bord gauche : rayures diagonales noires (motif attention)
- Zone **CYBERSPHERE** : label + icône engrenage

---

### Feuille de vaisseau (Starship Sheet)

D'après le SVG « Starship Builder » et la Phase 1 :
- **En-tête** : nom du vaisseau.
- **Jauges** : Hull (20), Fuel.
- **Cargo** : 6 slots.
- **Modules** : 6 emplacements (Engines / Control / Systems / Weapons).
- Le Starship Builder SVG est un canevas grand format (viewBox ≈ 4450 × 1519) :
  composition horizontale, blocs/tuiles assemblés, fond bone white texturé,
  accents rose `#EC3571`, bordures noires.

---

### Spacefarer's Journal — 17 pages

> Source : `character/Spacefarer_s_Journal_-_Digital_File__Form-Fillable_.pdf`
> Format : couvertures A4 portrait + spreads A3 paysage. Palette noir & blanc strict.

#### Structure des 17 pages

| Pages | Section | Type | Usage app |
|---|---|---|---|
| P1 | Couverture | Illustration système solaire | Splash screen |
| P2–P4 | LOG A (6 pages) | Notes libres lignées | Textarea multilignes |
| P5–P7 | LOG B (6 pages) | Notes libres lignées | Textarea multilignes |
| P8–P10 | LOG C (6 pages) | Notes libres lignées | Textarea multilignes |
| P11 gauche | PLAYTHROUGHS × 7 | Suivi des runs | Formulaire structuré |
| P11 droite | ACHIEVEMENTS × 7 | Succès à débloquer | Toggle COMPLETED |
| P12 gauche | Characters d100 | 100 PNJ nommés | Consultation / Roll |
| P12 droite | Settlements d100 | 100 quirks de lieux | Consultation / Roll |
| P13 | DATABASE 01 — Enemies A | 9 cartes ennemis extras | Statblocks consultables |
| P14 | DATABASE 02 — Enemies B | 9 cartes ennemis extras | Statblocks consultables |
| P15 | DATABASE 03 — Starships A | 6 vaisseaux de départ extras | Sélection au début |
| P16 | DATABASE 04 — Starships B | 6 vaisseaux Class-Y faction | Sélection conditionnelle (Favor ≥ 4) |
| P17 | Couverture arrière | — | — |

#### Éléments graphiques du journal

- **Pages LOG** : pastilles œillet × 2 en haut (effet reliure spirale), lignes horizontales fines, footer bandeau noir biseauté avec label `LOG X-N` en monospace LCD
- **Footer** : bande noire biseautée diagonalement côté intérieur — signature visuelle de toutes les pages
- **PLAYTHROUGHS** : bande verticale noire sur bord gauche avec texte rotatif 90°, blocs numérotés
- **ACHIEVEMENTS** : badge `COMPLETED` = rectangle fond blanc + bordure hachures diagonal noir/blanc
- **DATABASE enemies** : carte ennemi = header noir (nom bold large) + badges faction/type + actions numérotées + box lore italique
- **DATABASE starships** : carte vaisseau = illustration sur grille blueprint + stats + actions + tags équipage

#### 7 Achievements identifiés

| # | Nom | Condition |
|---|---|---|
| 1 | ASTROPRISMA | Compléter une partie standard (36 hexes + fin de faction) |
| 2 | ORIGIN STORY | Compléter une partie avec chacune des Origins |
| 3 | SERUM ADDICT | Accumuler une grande fortune en Serum |
| 4 | CORE CONFLICT | Compléter campagne avec chacune des 5 factions |
| 5 | LONE WOLF | Finir solo sans crewmembers |
| 6 | HARDCORE | Campagne sans heal en Settlement, ennemis +2 HP, vaisseaux +2 Hull |
| 7 | IMMORTAL | HARDCORE sans aucun mort ni Abyssal Scar |

---

### Carte hexagonale (Star System Map)

D'après le SVG « Star System Map Tool » (viewBox 1111 × 540) et la Phase 2 :
- **36 hexagones**, 3 anneaux concentriques + étoile centrale.
- **Tuile hex** : fond **indigo/violet** texturé halftone, **bordure noire épaisse**, **3 cercles orbitaux concentriques**, **disque central noir** = étoile, petits **cercles noirs** = planètes/satellites.
- Couleurs de tuile : violet de fond, accents `#FAC855` (jaune) et `#EE5439` (orange) pour marqueurs, `#F6F4EC` détails clairs, `#DE125C` point d'accent.
- **Labels** en italique (Instrument Serif) sur la carte.
- Token de position du joueur à déplacer hex par hex.

---

### Autres composants

- **Badge de faction** : pastille colorée (WARG Red, Intersolar Blue/Teal, Medusa Green, Corsair Yellow, Synth Magenta).
- **Icônes de stat / ressource** : trait noir style flaticon (flaticon.com recommandé par Design Guide).
- **DiceButton** : lanceur de dés (d4–d20, d66, 2d6, d6×stat) — bouton accentué `#EC3571`.
- **Tables** (Oracle, Quick Tables, loot) : grilles à bordures, alternance de fonds clairs.

---

### Bibliothèque de composants mobiles (synthèse)

| Composant | Données | Notes |
|---|---|---|
| `DialKnob` | HEALTH, ENERGY, VIG, GRA, MIN, TEC, HP crew | Cercle tick-marks, valeur centrale |
| `SegmentedBar` | HYPERDRIVE, Memory Clock | N segments activables |
| `DashedTextField` | Tous champs texte libres | Ligne dashed, label au-dessus |
| `NumberedSlot` | INVENTORY, MEMORY SLOTS, CARGO | Ligne + numéro gris italic |
| `StatusConditionBadge` | STUN/BREACH/SHOCK/SILENCE/IMMUNITY/OVERHEAT | Checkbox rond + stencil bold |
| `FactionCounter` | 5 factions | Icône + champ numérique |
| `WeaponCard` | WEAPON 1 & 2 | Panel + label MODS vertical |
| `CrewCard` | 4 équipiers | Mini-fiche dial HP + 4 attrs |
| `ConnectionRow` | 7 connexions | 3 colonnes + 3 hexagones |
| `HexGrid` | Star System Map | 36 hexs numérotés, concentrique |
| `QuestEntry` | Quest Log I–VIII | 2 lignes dashed + chiffre romain |
| `MissionCard` | Campaign I–III | Zone hachurée + OUTCOME |
| `MemoryClockCard` | 6 clocks | Barre + grille losanges ◇ |
| `EnemyTracker` | Combat | Health / Armor / Effects |
| `LogPage` | Journal A/B/C | Textarea + footer LCD biseauté |
| `PlaythroughEntry` | 7 runs | Formulaire CHARACTER/CREWMEMBERS/DIFFICULTY/GAME MODE |
| `AchievementBadge` | 7 succès | Toggle COMPLETED + hachures |
| `EnemyCard` | DATABASE 01/02 (18 extras) | Header noir + actions + lore |
| `StarshipCard` | DATABASE 03/04 (12 extras) | Grille blueprint + stats + actions |

---

## 3. Règles de design pour l'app

### Thème mobile (dark mode par défaut)

- **Fond** : `#2D2A32` (ASTROPRISMA BLACK).
- **Surfaces / cartes** : indigo légèrement éclairci sur le fond, ou `#F0E7DF` (BASIC WHITE) pour composants clairs.
- **Texte principal** : `#F6F4EC` (ASTROPRISMA WHITE) sur fond sombre.
- **Texte secondaire** : `#F6F5EE` (OFF-WHITE) / opacité réduite.
- **Accent / interactif** : `#EC3571` (ASTROPRISMA PINK), état pressé `#DF195E` (DARK PINK).
- Texture halftone/grain en overlay très subtil (opacité basse) pour rappeler le print, sans nuire à la lisibilité mobile.

### Spacing, arrondis, ombres

- **Grille** : base 4 px (4 / 8 / 12 / 16 / 24 / 32).
- **Arrondis** : barres et boutons fortement arrondis (rappel des barres du logo, `rounded-lg`/`rounded-xl`) ; tuiles hex à coins nets.
- **Bordures** : épaisses et noires (`#000000`, 2-3 px) sur les cartes/tuiles « jeu » — signature visuelle.
- **Ombres** : discrètes ; privilégier la bordure noire au drop-shadow pour l'effet sticker rétro.

### États

| État | Couleur / traitement |
|---|---|
| Actif / primaire | Accent `#ef476e`, texte bone white |
| Pressé | Accent profond `#d50059` |
| Inactif / désactivé | Off-white `#e0dfdb` à opacité réduite, pas d'accent |
| Danger / dégâts | Rouge-orangé `#ff603e` (WARG / Health) |
| Avertissement | Jaune `#ffbd5c` (Fuel bas, Energy) |
| Succès / soin | Vert `#3fb87f` (Medusa, à valider) |
| Sélection (faction) | Badge à la couleur de la faction concernée |

---

## 4. Filtres & textures — paramètres exacts (Design Guide PDF)

### Halftone (filtre 01)
- Type : **soft halftone** appliqué sur chaque page (couche calque Affinity)
- **Opacité : 50%**
- Rendu CSS/app : `background-image: radial-gradient(...)` ou SVG pattern halftone à ~50% opacity

### Noise (filtre 02) — GIMP CIE Ich Noise, preset « G soft »

| Paramètre | Valeur |
|---|---|
| Dulling | 8 |
| Lightness | 15.36 |
| Chroma | 40.00 |
| Hue | 3.00 |
| Résolution | 2500 px de large avant export |

> Pour l'app mobile : simuler avec un PNG de grain semi-transparent en overlay (`opacity: 0.08–0.12`) ou une texture SVG noise.

---

## 5. Bibliothèque de composants UI (Assets PDF)

### Panneaux / conteneurs (8 types)

| # | Nom | Description | Usage |
|---|---|---|---|
| 1 | Panel outline rose | Bordure rose fine, fond blanc cassé, coins droits | Fenêtre principale, zone de contenu |
| 2 | Double panel biseau | Deux rectangles côte à côte, coins coupés en biseau bas-gauche | Stat block, carte double |
| 3 | Banner rose plein | Fond rose vif, coins biseautés style sci-fi | Titre de section, bannière d'action |
| 4 | Panel accent gauche | Surface claire + barre verticale rose sur bord gauche | Zone de description |
| 5 | Panel dark triangle | Grand rectangle noir + triangle décoratif bas-gauche | Map, données principales |
| 6 | HUD window | Coins coupés en haut, barre de titre `— » ×` style terminal | Boîte de dialogue, stat window |
| 7 | Panel dark header | Fond sombre + header noir séparé | Tableau, liste de données |
| 8 | Panel white minimaliste | Rectangle fond blanc, bordure fine noire | Champ texte, input |

### Listes numérotées (2 types)

| Type | Description |
|---|---|
| Fond blanc | Numéros roses (1–6) + lignes horizontales roses |
| Fond noir | Numéros texte blanc + lignes grises |

### Motifs / textures (5 types)

| Motif | Description | Usage |
|---|---|---|
| Hachures diagonales roses | Rayures 45° rose/blanc, denses | Accent de coin, zone d'alerte |
| Hachures diagonales noir/blanc | Rayures 45° noir/blanc | Danger, zone interdite |
| Bandes diagonales roses larges | Rayures épaisses rose foncé/clair | Fill décoratif de bannière |
| Rayures horizontales beiges | Bandes horizontales beige clair/moyen | Texture neutre de fond |
| Accent triangulaire rose | Petit triangle/coin rose | Marqueur, indicateur de sélection |

### Icônes de stats (barre 10 icônes)

| Position | Icône | Symbole ASTROPRISMA |
|---|---|---|
| 1 | Flocon/cristal | `❄` Serum |
| 2 | Astérisque | `✳` Damage |
| 3 | Éclair | `⚡` Energy |
| 4 | Bouclier | `♡` Armor |
| 5 | Engrenage/atome | — |
| 6 | **HP** texte | HP Health |
| 7 | Gemme/cristal | — |
| 8 | Maison/abri | Settlement |
| 9 | Engrenage | — |
| 10 | Croix/explosion | — |

### Chevrons directionnels (3 types)

| Type | Couleur | Usage |
|---|---|---|
| Fins | Beige | Direction subtile, progression |
| Gras pleins | Noir | Action, navigation |
| Gras pleins | Rose | Priorité haute, action principale |

### Stat-blocks jouables

**ENEMIES** — colonnes : `HP | Armor | VIG | GRA | MIN | TEC | [barre de points]`
**STARSHIPS** — colonnes : `HULL | ACTIONS | [barre de points]` + ligne `MODS`

> Système de **barre de points** (style pixel) : taille décroissante selon le rang de l'ennemi/vaisseau.

### Composants avancés

| Composant | Description |
|---|---|
| **Écran navigation** | Panel arrondi noir + petit écran blanc + grille carrée intégrée |
| **Zone désactivée** | Panel arrondi noir + rayures diagonales blanches denses |
| **Identité faction** | Grille de losanges roses outline + diamant plein + motif ondes |
| **Carte de secteur** | Grille hexagonale outline fond noir + hexagone central rose `STAR` |
| **Rang I–V** | Colonne de 5 hexagones fond noir, numérotés en chiffres romains roses, étoiles décoratives entre chaque |

### Éléments graphiques de carte

- **Système planétaire** : cercle rose (planète) + anneaux orbitaux outline + petites planètes
- **Nœuds de diagramme** : cercles pleins roses sur tiges verticales
- **Indicateur de cible** : double cercle concentrique outline
- **Ressource** : diamant outline noir / diamant plein rose

---

## 6. Références visuelles extraites

- **Logo « Compatible with ASTROPRISMA »** (PNG White & Black) : wordmark display ultra-gras
  (« ASTRO PRISMA » sur 2 lignes) + planète à anneau stylisée sur le O ; sous le mot, les
  **4 barres verticales arrondies** du gradient (jaune `#ffbd5c`, orange `#ff603e`, magenta `#d50059`, indigo/violet).
  Version Black = traits indigo/noir ; version White = traits bone white (`#f0eee8`).
- **Design Guide [PDF]** : définit Noir (indigo sombre), Blanc (2 tons d'os), Accent (rose),
  Gradient (4 couleurs = sections), Factions (Weapons/Hacks/Cybertech/Drones colorées),
  filtre **halftone** (50 % opacité) + filtre **noise** (GIMP CIE lch) = aspect rétro imprimé.
- **Assets [PDF]** : page de typographie complète (Feature Mono, Newake/POWERR, Rimma Sans,
  Free Fat Font, Genesys, Instrument Serif, ST-Cyberillic, Schabo) + chiffres romains (I–V) des anneaux.
- **Star System Map Tool.svg** : tuiles hexagonales indigo texturées, bordure noire, anneaux
  orbitaux concentriques, étoile centrale, planètes ; couleurs `#130d1c #f0eee8 #ffbd5c #ff603e #d50059`.
- **Starship Builder.svg** : canevas large, blocs assemblés, fond bone white grainé,
  accent rose `#ef476e`, neutres `#130d1c / #e0dfdb`, bordures noires.
- **Character Sheet 2.0 / Spacefarer's Journal (PDF form-fillable)** : structure des feuilles
  perso & vaisseau (stats, jauges, slots, ressources) — référence de mise en page des fiches.

> Note : certains hex de factions (Medusa Green, Wire Teal, Intersolar Blue) sont rasterisés
> dans le PDF et marqués « à valider ». Les échantillonner sur le Core Book avant de figer
> le thème Tailwind (voir Phase Design du plan).
