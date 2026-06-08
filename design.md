# design.md — Astroprisma App

> Identité visuelle et système de design de l'app, extraits des fichiers officiels
> du Creator Kit (Design Guide, Assets), des SVG (Star System Map Tool, Starship
> Builder), des logos « Compatible with ASTROPRISMA » et des feuilles de personnage.
> Objectif : recréer en mobile (dark mode) l'esthétique rétro sci-fi du jeu de base.

---

## 1. Identité visuelle

### Palette de couleurs

Couleurs confirmées par les hex codes extraits des SVG officiels + Design Guide.

**Neutres (noir & blanc de marque)**

| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Noir | Indigo Black | `#130d1c` | Texte et fond de page. Indigo très sombre — fait fusionner les tons mieux qu'un noir pur. **Base du dark mode.** |
| Noir pur | Black | `#000000` | Contours, bordures épaisses, traits d'icônes. |
| Blanc | Bone White | `#f0eee8` | Texte sur fond sombre, fonds de page clairs. Blanc chaud (os). |
| Blanc 2 | Off-White | `#e0dfdb` | Détails de fond, séparateurs, surfaces secondaires. |

**Accent (rose, couleur signature du jeu)**

| Rôle | Hex | Usage |
|---|---|---|
| Accent clair | `#ef476e` | Surlignage des titres, éléments interactifs, boutons primaires. |
| Accent profond | `#d50059` | Variante foncée (médailles d'achievement, états pressés). |

**Gradient ASTROPRISMA** (4 couleurs — logo officiel)

| Position | Nom | Hex | Section du livre |
|---|---|---|---|
| 1 | Yellow | `#ffbd5c` | Equipment & Loot |
| 2 | Orange | `#ff603e` | (transition gradient) |
| 3 | Magenta | `#d50059` | (accent / transition) |
| 4 | Indigo | `#5b2d8e` *(≈, violet du logo/hex de carte)* | Factions |

> Le gradient se lit Yellow → Orange → Magenta → Indigo. Il sert de signature
> (barres verticales du logo, dégradés de titres, séparateurs de sections).

**Couleurs de factions** (chacune identifie une section du livre)

| Faction / Section | Nom couleur | Hex (à confirmer en finesse) | Usage |
|---|---|---|---|
| WARG / Weapons | WARG Red | `#ff603e` *(rouge-orangé)* | Armes |
| Medusa / Hacks | Medusa Green | `#3fb87f` *(vert, à valider)* | Hacks |
| Medusa / Drones | Wire Teal | `#2fa3a3` *(teal, à valider)* | Drones & Mechs |
| Intersolar / Cybertech | Intersolar Blue | `#3b6fd4` *(bleu, à valider)* | Cybertech |

> Les hex des factions Green/Teal/Blue ne sont pas présents en clair dans les
> fichiers analysés (swatches rasterisés dans le PDF). Valeurs approchées —
> à confirmer par échantillonnage sur le Core Book avant de figer le thème Tailwind.

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

### Feuille de personnage (Player Sheet)

D'après la Character Sheet 2.0 (3 pages, form-fillable) et la Phase 1 du plan :
- **En-tête** : nom du personnage, Origin.
- **Stats** : bloc de caractéristiques (valeurs numériques) — à afficher en `StatBlock`.
- **Jauges** : Health, Energy, Armor, Hyperdrive (barres/compteurs).
- **Inventaire** : 8 slots d'objets.
- **Armes** : 3 emplacements.
- **Memory Slots** : capacités mémorisées.
- **Ressources** : EXP, Serum, Scraps, Favor (compteurs).

Mise en page jeu : blocs encadrés (bordure noire), labels en mono majuscules, champs remplissables.

### Feuille de vaisseau (Starship Sheet)

D'après le SVG « Starship Builder » et la Phase 1 :
- **En-tête** : nom du vaisseau.
- **Jauges** : Hull (20), Fuel.
- **Cargo** : 6 slots.
- **Modules** : 6 emplacements (Engines / Control / Systems / Weapons).
- Le Starship Builder SVG est un canevas grand format (viewBox ≈ 4450 × 1519) :
  composition horizontale, blocs/tuiles assemblés, fond bone white texturé,
  accents rose `#ef476e`, bordures noires.

### Carte hexagonale (Star System Map)

D'après le SVG « Star System Map Tool » (viewBox 1111 × 540) et la Phase 2 :
- **36 hexagones**, 3 anneaux concentriques + étoile centrale.
- **Tuile hex** (confirmé visuellement) : fond **indigo/violet** texturé halftone,
  **bordure noire épaisse**, **3 cercles orbitaux concentriques** (les Rings),
  **disque central noir** = étoile, petits **cercles noirs** = planètes/satellites sur les orbites.
- Couleurs de tuile extraites : violet de fond, accents `#ffbd5c` (jaune) et `#ff603e` (orange)
  pour certains marqueurs, `#f0eee8` pour les détails clairs, `#d50059` pour un point d'accent.
- **Labels** en italique (Instrument Serif) sur la carte.
- Token de position du joueur à déplacer hex par hex.

### Autres composants identifiés

- **Badge de faction** : pastille colorée à la couleur de faction (rouge WARG, vert Medusa, etc.).
- **Icônes de stat / ressource** : pictos simples, trait noir, style flaticon.
- **Médailles d'achievement** : usage de l'accent profond `#d50059`.
- **DiceButton** : lanceur de dés central (d4–d20, d66, 2d6, d6×stat) — bouton accentué.
- **Tables** (Oracle, Quick Tables, loot) : grilles à bordures, alternance de fonds clairs.

---

## 3. Règles de design pour l'app

### Thème mobile (dark mode par défaut)

- **Fond** : `#130d1c` (Indigo Black).
- **Surfaces / cartes** : indigo légèrement éclairci sur le fond, ou bone white inversé selon le composant.
- **Texte principal** : `#f0eee8` (Bone White) sur fond sombre.
- **Texte secondaire** : `#e0dfdb` (Off-White) / opacité réduite.
- **Accent / interactif** : `#ef476e`, état pressé `#d50059`.
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

## 4. Références visuelles extraites

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
