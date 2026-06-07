# Chapitre 3 — Combat (pages 30–36)

> Extraction complète — agents Sonnet, lecture visuelle directe des PNG.
> ⚠️ Certaines valeurs numériques partiellement illisibles sont signalées avec (?)

---

## 3.1 — COMBAT MOVES & TURN STRUCTURE (p.30)

### Combat Moves — 4 actions majeures possibles

| Action | Règle |
|---|---|
| **WEAPON** | Attaquer avec une arme équipée. Roll damage + stat pertinente |
| **HACK** | ROLL+MIND contre l'ennemi. Succès → hack prend effet |
| **CYBERTECH** | Utiliser une ability active depuis les modules cybertech installés |
| **ESCAPE** | Fuir un combat → ROLL+MOVE. Succès → quitter le combat |

### Turn Basics

Le combat est divisé en **tours**. Chaque tour est partagé entre tous les personnages — les GM-characters agissent aussi.

### Turn Order

Déterminé au début du combat. Tous les combattants roll **d10 + GRA**.

- Le plus haut résultat agit en premier, puis les suivants dans l'ordre décroissant
- En cas d'égalité : **GRA** la plus haute passe en premier
- Ultime égalité : lancé de dé

### Turn Steps (numérotés)

| # | Étape | Description |
|---|---|---|
| 1 | **ENEMY MOVE** | Les ennemis se déplacent / réagissent selon les règles GM |
| 2 | **MAIN ACTION** | Action principale : attaque, hack, cybertech, escape, ou autre action majeure |
| 3 | **SIDE ACTION** | Action secondaire/mineure : déplacement, interaction, action rapide |

---

## 3.2 — COMBAT MECHANICS (p.31)

### Enemy Statblock

Chaque ennemi possède un statblock standardisé avec :
- **Health (HP)** & Armor **(M)**
- **Attack (ATK)** / Defense **(DEF)**
- **Difficulty (★ à ★★★)**

### Damage Bonuses

Ordre de calcul des dégâts quand plusieurs sources s'accumulent :

1. **Base damage** roll + **stat bonus** comptés en premier `[dmg +STR]`
2. **Skill dice** additionnels ajoutés ensuite `[+1d, +2d]`
3. **Multiplicateurs** appliqués en dernier `[x2]`
4. Les dégâts multipliés se calculent à partir du total des étapes précédentes

### Fighting Multiple Enemies

Possible d'affronter plusieurs ennemis simultanément :
- Difficulté = **la plus haute parmi les ennemis** affrontés
- Pour **Escape** : roll contre la **plus basse difficulté** du groupe + modificateurs de skills

### Fighting Alongside Allies

- Chaque personnage agit à son **tour dans l'ordre de combat**
- Le joueur contrôle son personnage, le GM gère les PNJ alliés
- Exemple : si l'ennemi a 2 dés, chaque allié roll contre ces 2 dés à son tour

### Difficulty & EXP

| Difficulté | EXP gagné |
|---|---|
| **Easy** | +1 EXP |
| **Medium** | +3 EXP |
| **Hard** | +6 EXP |
| **Boss** | +10 EXP |

> Battre des ennemis de difficulté plus élevée → meilleur loot drop.

### Exemple de Statblock — WARG MAJOR GENERAL

**6★ Neon Blade** [Agility/ATK]
- Inflige **2d6** physical damage **+150** en cas de succès
- Inflige **3d6** dégâts supplémentaires sur **Overkill**
- **Overkill** : tous les ennemis présents subissent **2d6** dégâts

---

## 3.3 — STATUS CONDITIONS & WEAPON MODS INTRO (p.32)

### Status Conditions

Effets qui prennent effet **le même tour** où ils sont appliqués. Disparaissent à la **fin du combat**. Les durées se cumulent (**stack**).

> Exemple : ennemi Stunned 2 tours + Stun de 3 tours → dure maintenant 5 tours.

| Condition | Effet |
|---|---|
| **OVERHEAT** | Prend **d6 dégâts** au début de son tour, ignore Armor et Shields |
| **SHOCK** | Perd temporairement **toute l'Armor** (mise à 0) |
| **STUN** | Roll d6 au début du tour. Si résultat = **1** → tour skippé |
| **SILENCE** | Ne peut pas utiliser **Cybertech**. Bonus de stats et abilities désactivés |
| **BREACH** | Les HACKS ennemis sont **toujours réussis**. Ne peut plus contrôler ni utiliser les **DRONES** |
| **IMMUNITY** | Ne reçoit **aucun dégât direct** (direct damage) |

### Direct Damage

Les dégâts directs = attaques d'armes, Cybertech, HACKS offensifs, grenades.

Les dégâts des **Status Conditions** et des **DRONES** ne comptent **pas** comme Direct Damage.

### Weapon Mods — Règles générales (intro)

- Chaque arme peut avoir jusqu'à **2 Weapon Mods uniques**
- Swap libre entre armes hors combat (gratuit)
- Swap en combat = coûte **◆ Side Action**
- Mods acquis aux **WARG Settlements**

---

## 3.4 — RANGED WEAPONS (p.33–34)

> Roll d6 quand une arme est trouvée pour déterminer le modèle.

### Liste complète des armes à distance

| # | Arme | Dés + Stat | Prix (Serum) |
|---|---|---|---|
| 01 | **REVOLVER** | d6 + VIG | 25 |
| 02 | **GAUSS GUN** | d6 + GRA | 25 |
| 03 | **LASER BLASTER** | d8 + VIG | 75 |
| 04 | **ION CARBINE** | d10 + GRA | 100 |
| 05 | **GAMMA GUN** | d8 + TEC | 75 |
| 06 | **IGNITION SHOTGUN** | d10 + VIG | 100 |
| 07 | **PULSE RIFLE** | 2d6 + VIG | 150 |
| 08 | **GRAVITY RIFLE** | d12 + GRA | 150 |

---

## 3.5 — MELEE WEAPONS (p.35)

> Roll +d quand une arme de mêlée aléatoire est trouvée pour déterminer le modèle.

| # | Arme | Dés + Stat | Prix (M) | Propriété |
|---|---|---|---|---|
| 01 | **CARBON DAGGER** | d6 + BRA | 175 | — |
| 02 | **HELIX KNIFE** | d10 + VIG | 75 | — |
| 03 | **HALO DISCUS** | d6 + BRA | 75 | — |
| 04 | **ROCKET HAMMER** | d8 + VIG | 150 | — |
| 05 | **PLASMA SHIELD** | d6 + VIG | 100 | **d8** while equipped |
| 06 | **NEON BLADE** | d10 + VIG | 100 | — |

---

## 3.6 — WEAPON MODS (p.36)

Niveaux de rareté/tier indiqués par dés : **D1** (commun) → **D4** (rare).

### Ranged Mods

| Mod | Tier | Effet |
|---|---|---|
| **SILENCER** | D1 | Dégâts divisés par 2 (arrondi bas). L'attaquant ne compte pas comme *discovered* |
| **REFLEX SHOT** | D2 | Si dé supérieur à l'ennemi → attaque additionnelle à +0 damage |
| **AUTO RELOADER** | D2 | Attaquer avec cette arme comme Side Action (au lieu de Main Action) |
| **STEADY SHOT** | D1 | Si premier dans l'ordre de tour → arme gagne +1Die. Un échec ne coûte pas d'Action |
| **LASER ACCELERATOR** | D2 | Cette arme **ignore l'Armor ennemie** sur les dégâts |
| **SMART AIM** | D2 | Roll +1Die Bonus et garder le meilleur résultat |
| **HIGH NOISE MAKER** | D3 | Dés additionnels à l'attaque (valeurs ?) |
| **AMMO STATION** | D3 | Restaure (?) à chaque attaque avec cette arme |
| **NAILHEAD INJECTION** | D3 | Roll base damage 4 ou 5 → **STUN** l'ennemi + 0+2 Bonus damage |
| **THERMAL ROUND** | D? | (données partiellement illisibles) |
| **ACID SHRAPNEL** | D3 | Dépenser (?) pour reaction attack à -1Die contre tout ennemi qui attaque dans le groupe |
| **CHARGED STRIKE** | D3 | +1Die à l'attaque. L'ennemi subit des dégâts additionnels (?) |
| **RANDOM STRIKE** | D4 | Dégâts spéciaux (valeurs illisibles) |

### Melee Mods

> Colonne droite partiellement hors cadre sur le PNG — titres visibles mais données incomplètes.
> À compléter lors d'une relecture.

---

## Index rapide — Chapitre 3

| Concept | Page |
|---|---|
| Combat Moves (WEAPON, HACK, CYBERTECH, ESCAPE) | 30 |
| Turn Order (AGI + BRA) | 30 |
| Turn Steps (Enemy Move / Main Action / Side Action) | 30 |
| Damage Bonuses (ordre de calcul) | 31 |
| Fighting Multiple Enemies (difficulté max) | 31 |
| Fighting Alongside Allies | 31 |
| Difficulty table (Easy→Extreme + EXP) | 31 |
| Enemy Statblock (HP, ATK, DEF, ★) | 31 |
| Status Conditions (6 types) | 32 |
| OVERHEAT / STUN / HACK / SHOCK / SILENCE / GRAVITY | 32 |
| Direct Damage (ignore Armor + Shields) | 32 |
| Weapon Mods — règles générales (3 max, swap) | 32 |
| Ranged Weapons (8 armes, dés + portées) | 33–34 |
| Melee Weapons (6 armes, Carbon Dagger → Plasma Shield) | 35 |
| Weapon Mods list (D1→D4, 13 mods) | 36 |
