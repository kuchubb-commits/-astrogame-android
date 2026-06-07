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

Déterminé au début du combat. Tous les combattants roll **AGI + BRA**.

- Le plus haut résultat agit en premier, puis les suivants dans l'ordre décroissant
- En cas d'égalité : AGI la plus haute passe en premier
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

| Difficulté | EXP gagné | Loot |
|---|---|---|
| **Easy** | +10 EXP | Basic |
| **Normal** | +25 EXP | Standard |
| **Hard** | +50 EXP | Better |
| **Very Hard** | +100 EXP | Good |
| **Extreme** | (?) EXP | Best |

> Battre des ennemis de difficulté plus élevée → meilleur loot drop.

### Exemple de Statblock — WARG MAJOR GENERAL

**6★ Neon Blade** [Agility/ATK]
- Inflige **2d6** physical damage **+150** en cas de succès
- Inflige **3d6** dégâts supplémentaires sur **Overkill**
- **Overkill** : tous les ennemis présents subissent **2d6** dégâts

---

## 3.3 — STATUS CONDITIONS & WEAPON MODS INTRO (p.32)

### Status Conditions

Effets qui durent sur un nombre défini de tours. Les durées se cumulent (**stack**).

| Condition | Effet |
|---|---|
| **OVERHEAT** | Inflige **2D damage** à l'action en cours, ignore Armor et Shields |
| **STUN** | Skip un tour sur la roue d'initiative. Si 1 obtenu → déséquiper l'arme |
| **HACK** | Chaque test HACK réussi → test supplémentaire (drone/item) |
| **SHOCK** | Perd temporairement **toute l'Armor** (mise à 0) |
| **SILENCE** | Impossible d'utiliser **Communications** + effets additionnels bloqués |
| **GRAVITY** | Aucun dégât reçu d'aucune source pendant la durée *(à vérifier)* |

> **[CURED]** : après 2 tours → la condition dure maintenant 5 tours (Stymied).

### Direct Damage

Les dégâts directs provenant d'actions infligeant des conditions ignorent **Armor et Shields**.

Les dégâts des **Status Conditions** elles-mêmes ne comptent **pas** comme Direct Damage.

### Weapon Mods — Règles générales (intro)

- Chaque arme peut avoir jusqu'à **3 Weapon Mods uniques**
- Swap libre entre armes pendant une pause (hors combat)
- Swap en combat = coûte **1 Action**
- Mods acquis dans les **WAR Stores**

---

## 3.4 — RANGED WEAPONS (p.33–34)

> Roll d6 quand une arme est trouvée pour déterminer le modèle.

### Liste complète des armes à distance

| # | Arme | Dés + Stat | Portée |
|---|---|---|---|
| 01 | **REVOLVER** | d6 + VIG | < 25m |
| 02 | **GAUSS GUN** | d6 + GRA | < 25m |
| 03 | **LASER BLASTER** | d8 + GRA | < 75m |
| 04 | **ION CARBINE** | d10 + GRA | < 100m |
| 05 | **GAMMA GUN** | d8 + TEC | + 75m |
| 06 | **IGNITION SHOTGUN** | d10 + VIG | + 40m |
| 07 | **PULSE RIFLE** | 2d8 + VIG | + 150m |
| 08 | **GRAVITY RIFLE** | d12 + GRA | + 150m |

---

## 3.5 — MELEE WEAPONS (p.35)

> FAQ : roll d6 quand une arme de mêlée est trouvée pour déterminer le mode.

| # | Arme | Dés | Prix | Propriété |
|---|---|---|---|---|
| 01 | **CARBON DAGGER** | d6 + d4 | 12G | — |
| 02 | **HELIX ROPE** | d4 + d4 | 75M | — |
| 03 | **HALO DISCUS** | d4R + d4 | — | — |
| 04 | **NEON BLADE** | d10 + d6 | 200M | — |
| 05 | **ROCKET HAMMER** | d8 + V3 | 1500A | — |
| 06 | **PLASMA SHIELD** | d6 + V3 | 500W | **+d4R** passif tant qu'équipé |

> Unités monétaires (G, M, A, W) — à confirmer avec le glossaire économique

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
