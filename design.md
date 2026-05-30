# Design & Direction Artistique — Astroprisma App

> ⚠️ Références visuelles à compléter par l'utilisateur — voir section "Inspirations"

---

## Ambiance générale

**Mots-clés** : SF sombre / spatial / cyberpunk industriel / survie / mystère cosmique

Le jeu se passe dans un espace hostile, entre factions corrompues et mondes inconnus.
L'interface doit **respirer le danger et l'exploration** — pas de couleurs vives, pas de design joyeux.
Chaque écran doit donner l'impression d'être dans le cockpit d'un vaisseau ou un terminal de station spatiale.

---

## Palette de couleurs

### Couleurs de base
| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Fond principal | Void Black | `#0A0B0F` | Arrière-plan général |
| Fond secondaire | Deep Space | `#12141A` | Cartes, panneaux |
| Fond tertiaire | Hull Gray | `#1C1F28` | Éléments surélevés |
| Bordures | Steel | `#2A2D3A` | Séparateurs, contours |
| Texte principal | Star White | `#E8EAF0` | Corps de texte |
| Texte secondaire | Nebula Gray | `#7A7F94` | Labels, sous-titres |

### Couleurs d'accent
| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Accent principal | Plasma Blue | `#3D8EFF` | Boutons, liens, focus |
| Accent secondaire | Ion Teal | `#00C9A7` | Succès, validation |
| Danger | Nova Red | `#FF4444` | Dégâts, erreurs, mort |
| Avertissement | Amber Alert | `#FFB020` | Avertissements, états critiques |
| Énergie | Pulse Purple | `#8B5CF6` | Hacking, cybersphère |

### Couleurs des factions
| Faction | Couleur | Hex |
|---|---|---|
| W.A.R.G. | Rouge sang | `#C0392B` |
| Intersolar Federation | Bleu officiel | `#2980B9` |
| Medusa Sector | Vert toxique | `#27AE60` |
| Corsair Syndicate | Orange brûlé | `#E67E22` |
| Synth Arch | Violet synthétique | `#9B59B6` |

---

## Typographie

### Polices (Google Fonts — gratuites)
| Usage | Police | Style |
|---|---|---|
| Titres | `Orbitron` | Majuscules, SF géométrique |
| Corps de texte | `Inter` | Lisible, moderne, propre |
| Code / stats | `JetBrains Mono` | Monospace, données techniques |
| Narration IA | `Crimson Pro` (italic) | Serif élégant pour le texte narratif |

### Tailles (base mobile 375px)
```
xs  : 12px — labels, badges
sm  : 14px — texte secondaire
base: 16px — corps de texte
lg  : 18px — sous-titres
xl  : 20px — titres de section
2xl : 24px — titres de page
3xl : 30px — titres principaux
```

---

## Composants UI récurrents

### Cartes (Cards)
```
Fond        : Hull Gray (#1C1F28)
Bordure     : Steel (#2A2D3A) — 1px
Border-radius : 8px
Padding     : 16px
Ombre       : 0 4px 16px rgba(0,0,0,0.4)
Hover       : bordure Plasma Blue, légère lueur
```

### Boutons
```
Primary   : fond Plasma Blue, texte blanc, radius 6px
Secondary : fond transparent, bordure Steel, texte Nebula Gray
Danger    : fond Nova Red, texte blanc
Disabled  : opacité 40%
```

### Badges de statut
```
Succès total  : fond Ion Teal    — texte "SUCCÈS TOTAL"
Succès        : fond Plasma Blue — texte "SUCCÈS"
Succès partiel: fond Amber Alert — texte "PARTIEL"
Échec         : fond Nova Red    — texte "ÉCHEC"
Critique      : fond Nova Red + animation pulse
```

### Barre de PV (Health Bar)
```
Fond    : Deep Space
Rempli  : dégradé Ion Teal → Amber Alert → Nova Red selon %
Hauteur : 8px, radius 4px
Animation : transition smooth 300ms
```

---

## Layout principal (mobile-first)

### Navigation
```
Bottom navigation bar (mobile) — 5 onglets :
  [Perso]  [Dés]  [Combat]  [Explorer]  [Journal]
  Icônes + labels courts
  Actif : Plasma Blue + underline
```

### Écran de jeu principal (Play.tsx)
```
┌─────────────────────────┐
│  [Nom perso]  PV: ██░░  │  ← Header compact
├─────────────────────────┤
│                         │
│   Zone narrative IA     │  ← Texte Gemini (Crimson Pro italic)
│   (scrollable)          │
│                         │
├─────────────────────────┤
│  [Dé] [Oracle] [Action] │  ← Actions rapides
└─────────────────────────┘
```

---

## Iconographie

**Style cible** : icônes en lignes fines (stroke), pas de remplissage solid
**Librairie** : `lucide-react` (gratuit, TypeScript-friendly)

| Élément | Icône Lucide |
|---|---|
| Personnage | `User` |
| Combat | `Sword` |
| Dés | `Dice5` |
| Exploration | `Globe` |
| Vaisseau | `Rocket` |
| Hacking | `Terminal` |
| Factions | `Shield` |
| Journal | `BookOpen` |
| IA Narrative | `Sparkles` |
| Inventaire | `Package` |

---

## Animations

- **Lancer de dés** : rotation 360° rapide (CSS keyframe, 400ms) avant d'afficher le résultat
- **Résultat critique** : pulse rouge sur le badge + vibration légère (`navigator.vibrate` sur mobile)
- **Narration IA** : apparition mot par mot (streaming Gemini) → effet "terminal qui écrit"
- **Transitions de page** : fade 150ms (pas de slide — trop lent sur mobile)
- **Barres de PV** : transition smooth sur chaque modification

---

## Inspirations visuelles

> À compléter par l'utilisateur

- [ ] Référence 1 : _______________
- [ ] Référence 2 : _______________
- [ ] Référence 3 : _______________

*(Jeux, films, apps, sites — n'importe quoi qui donne le ton)*

---

## Config Tailwind (extrait)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        void: '#0A0B0F',
        space: '#12141A',
        hull: '#1C1F28',
        steel: '#2A2D3A',
        plasma: '#3D8EFF',
        ion: '#00C9A7',
        nova: '#FF4444',
        amber: '#FFB020',
        pulse: '#8B5CF6',
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        narrative: ['Crimson Pro', 'serif'],
      }
    }
  }
}
```
