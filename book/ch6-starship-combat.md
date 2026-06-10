# Chapitre 6 — Starship Combat (pages 51–56)

> Extraction complète — agents Sonnet, lecture visuelle directe des PNG.
> ⚠️ Nombreuses valeurs partiellement illisibles — à valider.

---

> **Challenge Rolls** : tous les rolls de stats utilisent **d10 + stat** vs **d10 + stat adversaire**. Succès si résultat joueur > résultat ennemi. (→ ch2-rules.md §2.4)
> Note : le combat spatial utilise des **Action Dice (d6)** pour les modules vaisseau — distinct des Challenge Rolls personnage.
> **Symboles** : `HP` Health · `⚡` Energy · `♡` Armor · `◈` Hyperdrive · `✳` Damage · `❄` Serum · `✦` Scraps · `★` Favor · `♦` Action cost

## 6.1 — SPACE BATTLE RULES (p.51–52)

### Combat Procedure (p.51)

Le combat spatial suit la même séquence que le combat standard.

**Ordre de tour :**
- Roll **d10 + GRA** (joueur) vs **d10 + ACTIONS** (ennemi) — le plus haut agit en premier
- L'ennemi utilise son score d'**ACTIONS** à la place de GRA pour ce roll

**Tour ennemi :**
- Roll un **d10** sur la liste de moves ennemis une fois par point **ACTION**
- Exemple : un ennemi avec **2 ACTIONS** roll 2 fois sur sa liste de moves par tour

### Action Dice (p.51)

Principale différence avec le combat personnage-à-personnage :

- Au début de chaque tour, roll un nombre de **d6** déterminé par le score **Engines** du vaisseau
- Ces dés sont dépensés sur les modules **Weapons** et **Systems** pour les activer
- **1 Action Die = 1 activation** de module par tour
- Le résultat du dé doit correspondre à la plage d'activation indiquée sur le module (ex : `3-5 ▶`)

### Hull (p.51)

- Réduire le Hull ennemi à **0** → vaisseau désactivé
- Roll sur le d6 Difficulty de l'ennemi

### Shields (p.52)

- Les Shields annulent **tous les dégâts** de la prochaine attaque entrante
- Après avoir bloqué une attaque → le Shield disparaît
- Les Shields se **cumulent** (stack) jusqu'à 8 maximum
- Les Shields se **réinitialisent à 0** à la fin de chaque combat (p.140)

### Boarding Ships (p.52)

- Certains modules permettent **d'aborder** un vaisseau ennemi (téléportation de troupes ou docking)
- Une fois à bord → combat standard
- Objectif : vaincre le **Capitaine** ennemi → le vaisseau est capturé

### Escaping Space Combat (p.52)

- Dépenser **2 Action Dice** pour tenter de fuir
- Roll contre le nombre d'Actions ennemies
- **Succès** → l'ennemi ne rattrape pas le vaisseau

### Boost Escape (p.52)

- Fuite **immédiate sans jet de dé**
- Coût : **5 Fuel**
- Peut être utilisé à tout moment, même pendant le tour ennemi

### Critical Condition (p.52)

- Vaisseau à **10 Hull ou moins** = Critical Condition
- Certains modules ont des effets différents selon cet état

---

## 6.2 — STARSHIP MODULES (p.53–56)

### ENGINES (p.53)

| Module | Tier | Action Dice | Effet spécial | Coût |
|---|---|---|---|---|
| **HOVER PROPULSORS** | 1 | 2d6 / tour | Reroll 1 Action Die par tour | 3⚡ 70★ |
| **OXYGEN JETS** | 1 | 2d6 / tour | +1 Action Die lors du premier tour de combat | 3⚡ 70★ |
| **VELOCITY ROCKETS** | 2 | 2d6 / tour | +2 Action Dice si Hull = 20 | 5⚡ 125★ |
| **QUAD REACTOR** | 2 | 3d6 / tour | — | 5⚡ 125★ |
| **AVE ACCELERATORS** | 3 | 3d6 / tour | Reroll 1 Action Die par tour | 7⚡ 200★ |
| **ION ENGINES** | 3 | 3d6 / tour | +1 Action Die lors du premier tour de combat | 7⚡ 200★ |
| **NUCLEAR PULSE JETS** | 4 | 3d6 / tour | +2 Action Dice si Hull = 20 | 9⚡ 350★ |
| **PARTICLE REACTOR** | 4 | 4d6 / tour | — | 9⚡ 350★ |

### CONTROL (p.54)

| Module | Tier | Coût | Effet |
|---|---|---|---|
| **AURORA COCKPIT** | 1 | 3⚡ 70★ | Si vaisseau en Critical Condition → les attaques ennemies infligent **-2 dégâts** |
| **VECTOR COCKPIT** | 1 | 3⚡ 70★ | Commencer le combat spatial avec **1 Shield** |
| **ORION COMMAND** | 2 | 5⚡ 125★ | Restaure **1 Hull** chaque fois que l'on gagne un nouveau Shield |
| **STARDAGGER DECK** | 2 | 5⚡ 125★ | Les attaques infligent **+2 dégâts** aux vaisseaux en Critical Condition |
| **APOLLO COCKPIT** | 3 | 7⚡ 200★ | La première fois que l'on entre en Critical Condition → gagner **2 Shields** |
| **ECLIPSE BRIDGE** | 3 | 7⚡ 200★ | Le vaisseau a **+1 Action Die** tant qu'il est en Critical Condition |
| **FREIGHTER COMMAND** | 4 | 9⚡ 350★ | Commencer le combat avec **2 Shields** si on n'est pas premier dans l'ordre de tour |
| **DELTA CARGO BRIDGE** | 4 | 9⚡ 350★ | La première fois que le vaisseau serait détruit → Hull mis à **10** et gagner **1 Shield** à la place |

### SYSTEMS (p.55)

> Les valeurs entre crochets (ex : `2-4 ▶`) = résultat de dé Action nécessaire pour activer le module.

| Module | Tier | Coût | Activation | Effet |
|---|---|---|---|---|
| **REPAIR DRONES** | 1 | 3⚡ 70★ | `2-4 ▶` | Restaure **4 Hull** |
| **SHIELD GENERATOR** | 1 | 3⚡ 70★ | `4-6 ▶` | Gagne **1 Shield** |
| **BREACH SYSTEM** | 2 | 5⚡ 125★ | `1-2 ▶` | Tous les vaisseaux ennemis ont **-1 Action** lors de leur prochain tour |
| **SOLAR PANELS** | 2 | 5⚡ 125★ | `1-2 ▶` | Gagne **+1d6 Action Die** supplémentaire au prochain tour |
| **TRACKING RADAR** | 3 | 7⚡ 200★ | `2-4 ▶` | Prochaine attaque inflige **double dégâts**. *Une fois par tour* |
| **DISRUPTOR BEAMS** | 3 | 7⚡ 200★ | `6 ▶` | Détruire **tous les Shields ennemis** |
| **QUANTUM SYSTEM** | 4 | 9⚡ 350★ | `6 ▶` | Téléporter **1 PC** à bord d'un vaisseau ennemi |
| **AEGIS GENERATOR** | 4 | 9⚡ 350★ | `5-6 ▶` | Gagner **3 Shields**. `[3+]` *Une fois par tour* |

### WEAPONS (p.56)

> Les valeurs entre crochets = résultat de dé Action nécessaire pour activer le module.

| Module | Tier | Coût | Activation | Effet |
|---|---|---|---|---|
| **SPARK MULTILASERS** | 1 | 3⚡ 70★ | `3-5 ▶` | Deal **3 damage**, ignore les Shields |
| **O.G.R.E. MISSILES** | 1 | 3⚡ 70★ | `5-6 ▶` | Deal **6 damage** |
| **AUTO-TURRETS** | 2 | 5⚡ 125★ | `1-2 ▶` | Deal **2 damage** à **tous les vaisseaux ennemis** |
| **PARTICLE CANNONS** | 2 | 5⚡ 125★ | `3-5 ▶` | Deal **3 damage**. Prochaine attaque +1 damage supplémentaire **[stackable]** |
| **BERSERK TURRETS** | 3 | 7⚡ 200★ | `X ▶` | Deal **X damage** à tous les vaisseaux ennemis. *Une fois par tour* |
| **GLAIVE LASERS** | 3 | 7⚡ 200★ | `X ▶` | Deal **X damage**, ignore les Shields. *Une fois par tour* |
| **GRAVITY RAILGUN** | 4 | 9⚡ 350★ | `6 ▶` | Deal **3 damage** + **+3 dégâts** par Shield actif. *Une fois par tour* |
| **HARPOON MISSILES** | 4 | 9⚡ 350★ | `5-6 ▶` | Deal **10 damage**. *Une fois par tour* |

---

## Index rapide — Chapitre 6

| Concept | Page |
|---|---|
| Action Dice (d6 × Dexterity/Engines) | 51 |
| Hull à 0 → vaisseau désactivé | 51 |
| Shields (stack jusqu'à 8, bloque 1 attaque) | 52 |
| Boarding (docking, capturer capitaine) | 52 |
| Escape (2 Action Dice) | 52 |
| Boost Escape (fuite immédiate sans dé, 5 Fuel, tout moment) | 52 |
| Critical Condition (Hull **≤ 10**) | 52 |
| 8 Engine modules | 53 |
| 8 Control modules | 54 |
| 8 System modules | 55 |
| 8 Weapon modules | 56 |
| HARPOON MISSILES (10 damage, 1/tour) | 56 |
| DISRUPTOR BEAMS (détruit tous Shields) | 55 |
| QUANTUM SYSTEM (téléporte PC) | 55 |
