# Need to Clarify

Points à vérifier avant implémentation. Résoudre par ordre de priorité.

**Priorité :**
- 🔴 Bloquant — impacte directement l'implémentation d'une mécanique core
- 🟡 Important — valeur manquante ou ambiguë, à corriger avant le module concerné
- 🟢 Cosmétique — nom, typo ou détail mineur, peut attendre

---

## Tableau de suivi

| # | Priorité | Chapitre | Sujet | Page livre | PNG exact | Statut |
|---|---|---|---|---|---|---|
| 1 | 🔴 | CH7 | Coût entrée Cybersphere : 3₵ vs 5★ | p.59 et p.61 | `page_059.png` + `page_061.png` | ✅ |
| 2 | 🔴 | CH2 | Légende des icônes ◆ / ★ / ✦ / ⊕ dans les récompenses | p.13–14 | `page_013.png` + `page_014.png` | ✅ |
| 3 | 🔴 | CH2 | GRACE vs DACE — nom exact du stat sur p.15 | p.15 | `page_015.png` | ✅ |
| 4 | 🟡 | CH7 | Numérotation "1-x" Gaian ET Calorian — conflit de labels | p.75 et p.76 | `page_075.png` + `page_076.png` | ✅ |
| 5 | 🟡 | CH7 | Références pages Cybersphere Encounters + Matrix Nodes (coin droit coupé) | p.62 | `page_062.png` (bord droit) | ✅ |
| 6 | 🟡 | CH4 | DRONE_Greyhound : ability FETCH illisible | p.41 | `page_041.png` | ✅ |
| 7 | 🟡 | CH5 | Table de Loot p.48 — structure et colonnes inconnues | p.48 | `page_048.png` | ✅ |
| 8 | 🟡 | CH7 | Matrix Nodes entrée 61 — texte masqué par illustration | p.62 | `page_062.png` | ✅ |
| 9 | 🟢 | CH7 | "S Energy" dans Treetop Parkour S-5 — probablement "5" | p.79 | `page_079.png` | ✅ |
| 10 | 🟢 | CH7 | Nom exact DRONE_ÔwÓ — caractères spéciaux à confirmer | p.80 | `page_080.png` | ✅ |

**Tous les points résolus — session 2026-06-08**

---

## Résolutions

### 1. ✅ Coût d'entrée Cybersphere → **5★**
p.59 dit explicitement : *"Once per cycle, you may spend 5★ to log into a sector of the Cybersphere."*
La mention "3₵" était une erreur de lecture. p.61 ne mentionne pas de coût (page Encounters uniquement).

---

### 2. ✅ Légende des icônes inline

| Symbole | Signification |
|---|---|
| `✕` | Damage |
| `⚡` | Energy |
| `⚙` | Scraps |
| `◎` | Hyperdrive |
| `♡` | Armor |
| `HP` | Health (texte, pas pictogramme) |
| `✳` | Serum (astérisque orné 6 branches — pas `★`) |
| `◆` | Challenge Rolls |

EXP et Favor sont des termes textuels, pas des icônes graphiques.

---

### 3. ✅ Nom du stat → **GRACE**
Erreur OCR/lecture sur le "G". La liste sur p.15 est bien : VIGOR / GRACE / MIND / TECH.

---

### 4. ✅ Numérotation Gaian/Calorian → pas de conflit
- Gaian (planète 01) : entrées `1-1` à `1-6`
- Calorian (planète 02) : entrées `2-1` à `2-6`
- Mapping : `planetType + "-" + d6Roll` (ex: "2-4" = Endless Shift)

Gaian encounters : Sinking Into Quicksand / The Wanderer / Winged Nightmare / Jewel Looters / Lost In The Mirage / The Desert Temple
Calorian encounters : Alpha 2 Observatory / Ground Fissure / Spoils of War / Endless Shift / The Martian / Skirmish at Meteor Keep

---

### 5. ✅ Références pages Cybersphere
- **Cybersphere Encounters** → page 61
- **Matrix Nodes** → page 62

---

### 6. ✅ DRONE_Greyhound — ability FETCH
- **Coût :** 3 Energy (pas 1)
- **Effet :** *Gain a random narco-biotic or grenade*

---

### 7. ✅ Table p.48 — liste d'achat (pas loot aléatoire)
p.48 = **prix d'achat en scrops** (monnaie settlement). Pas de dé de tirage.

**Ranged Weapons (achat)**
| Arme | Damage | Coût |
|---|---|---|
| Revolver | d6 + VIG | 25 scrops |
| Gauss SMG | d6 + GRA | 25 scrops |
| Laser Blaster | d8 + VIG | 75 scrops |
| Gamma Gun | d8 + TEC | 75 scrops |
| Ignition Shotgun | d10 + VIG | 100 scrops |
| Ion Carbine | d10 + GRA | 100 scrops |
| Pulse Rifle | 2d6 + VIG | 150 scrops |
| Gravity Rifle | d12 + GRA | 150 scrops |

**Melee Weapons (achat)**
| Arme | Damage | Coût |
|---|---|---|
| Carbon Dagger | d6 + GRA | 25 scrops |
| Helix Wire | d8 + VIG | 75 scrops |
| Halo Discs | 2d6 + GRA | 150 scrops |
| Plasma Shield | d8 + VIG | 100 scrops |
| Rocket Hammer | d10 + VIG | 100 scrops |
| Neon Blade | d12 + VIG | 150 scrops |

**Quest Items**
| Item | Effet |
|---|---|
| Warp Drive | Téléporte vers n'importe quelle tuile pour 6 Fuel. Doit être dans le Cargo Hold. |
| Trading License | Vend des items exclusifs dans les ISF Settlements (sauf Narcobiotics). +10 scrops à la vente. |
| Tesseract | Restaure 3+ pour chaque implant Cybertech équipé. |
| Contraband Package | Cargo illégal. Se vend uniquement dans les Syndicate Settlements pour 100 scrops. Perdu si vaisseau détruit. |
| NGHTMR Key | Breach un ennemi 5 tours OU force un vaisseau ennemi à passer son tour. |
| Terraform Seeds | +1 Hyperdrive à la plantation. |

Les tables **Status Cures d10** et **Grenades d10** sur p.48 sont identiques à celles de p.138 (déjà dans ch5).

---

### 8. ✅ Matrix Nodes entrée 61
Texte complet : **"Broken Tesseract, can be repaired with 100★"**
Pas de modificateur [CLOCK] — le texte est complet, l'illustration en arrière-plan créait l'ambiguïté visuelle.

---

### 9. ✅ "S Energy" dans Treetop Parkour S-5
Le texte exact est : *"Gain +1♦ Hyperdrive charge and restore Energy"*
Le "S" = identifiant de l'entrée (S-5). Pas de quantité précisée — "restore Energy" sans chiffre.

---

### 10. ✅ Nom du drone → **DRONE_ÔwÓ**
Intentionnel : visage expressif stylisé (Ô w Ó). Ce n'est pas une erreur OCR.

---

## À compléter au fil des sessions

*(Ajouter ici tout nouveau doute découvert lors des sessions suivantes)*
