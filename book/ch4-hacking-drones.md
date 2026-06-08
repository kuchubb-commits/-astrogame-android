# Chapitre 4 — Hacking & Drones (pages 38–44)

> Extraction complète — agents Sonnet, lecture visuelle directe des PNG.
> Révisé après relecture approfondie page par page.

---

## 4.1 — HACKING & DRONE RULES (p.38)

### HACKING

Les HACKS sont des abilities puissantes utilisant la stat **MIN** (MIND) pour s'infiltrer dans les systèmes ennemis.

**Résolution :**
- Roll **MIN** contre l'ennemi
- **Succès** → le HACK est uploadé dans son interface virtuelle, l'effet s'applique
- **Échec** → le HACK échoue, le personnage est infecté par un **Malware**

### MALWARE

Quand un personnage échoue un HACK, ses systèmes sont corrompus.

- Roll un **D10** sur la table Malware pour déterminer l'effet
- Les DRONES peuvent aussi être affectés par des Malwares

### DRONES

Robots et mechs avancés contrôlables à distance en combat.

- Dépenser une action **DEPLOY** pour déployer un DRONE dans sa zone
- Le Drone agit sur les futures actions DEPLOY du joueur
- Contrôler le DRONE = choisir l'une de ses abilities à activer
- Chaque DRONE possède **1 ability passive** qui s'active après déploiement

---

## 4.2 — HACKS & MASTER HACKS (p.39–40)

### Règle de découverte

Roll **d10** sur la table Hacks quand une Hack aléatoire est trouvée en exploration ou en loot.

La stat utilisée pour les effets des HACKS est **MIN** (MIND).

### Les 10 Hacks

| # | Hack | Coût | Effet |
|---|---|---|---|
| 01 | **JAVELIN** | 1♦ | d12 + MIN damage. Les ennemis **Breached** subissent double damage |
| 02 | **TROJAN** | 1♦ | **Breach** un ennemi pour MIN tours |
| 03 | **EMBER** | 1♦ | **Overheat** un ennemi pour MIN tours |
| 04 | **BLACKOUT** | 1♦ | **Shock** TOUS les ennemis pour TEC tours |
| 05 | **SHADOW** | 2♦ | Devenir **Immune** jusqu'au prochain dégât direct infligé. Coûte 2♦/tour actif |
| 06 | **COUNTERSPELL** | 1♦ | **Silence** TOUS les ennemis pour MIN tours + désactive leur passive skill |
| 07 | **VOLT** | 2♦ | d10 + TEC damage + **Stun** ennemi 1 tour |
| 08 | **KRAKEN** | 2♦ | **Stun** TOUS les ennemis 1 tour |
| 09 | **IGNITE** | 3♦ | d12 + MIN damage + **Overheat** ennemi 2 tours |
| 10 | **HYDRA** | 3♦ | d10 × MIN damage sur un ennemi **Breached** |

### Table Malware (D10)

| Roll | Effet |
|---|---|
| 1 | Nothing |
| 2 | Lose 1+ Energy |
| 3 | Take 2 damage |
| 4 | Lose 2+ Energy |
| 5 | Become **Stunned** for 1 turn |
| 6 | Take 4 damage |
| 7 | Become **Shocked** for 1 turn |
| 8 | Lose 3+ Energy |
| 9 | Become **Silenced** for 1 turn |
| 10 | Learn a random **HACK** |

### Achat de HACKS

- HACKS achetés aux **Medusa Settlements** pour **150★**
- **MASTER HACKS** : vendus pour **200★**, ne peuvent pas être achetés

### Master Hacks (6) — coût 34⚡ chacun

| # | Master Hack | Effet |
|---|---|---|
| 01 | **MINDSTEAL** | Set enemy MIN à 0 + gain X MIN pour 2 tours (X = MIN de base de l'ennemi) |
| 02 | **PARASITE** | **Breach** TOUS les ennemis pour MIN tours + restore 2 Health par ennemi affecté |
| 03 | **SUPERNOVA** | 3d6 damage à TOUS les ennemis + **Shock** pour MIN tours |
| 04 | **RAGNAROK** | **Overheat** TOUS les ennemis pour TEC tours. Overheat inflige +MIN dégâts supplémentaires jusqu'à fin de combat |
| 05 | **AEGIS** | Gagne TEC Armor temporaire pour MIN tours |
| 06 | **ARCHANGEL** | Restore d10 × TEC Health à soi-même ou un allié |

---

## 4.3 — DRONES & MECHS (p.41–42)

### DRONE_Spider

**Description :** Drone terrestre rapide construit à partir de pièces mécaniques reconditionnées. Le "Spider" est le drone le plus commun, utilisé par les hackers et opérateurs de rue pour surveiller les terrains dangereux.

| Move | Coût | Effet |
|---|---|---|
| **OCTOMORPHOSIS** | 1 | S'infiltre dans les espaces étroits |
| **CARBON CLAW** | 1 | d6 + TEC damage |
| **PARALYZING WEB** | 1 | d4 Kinetic damage + la cible **ne peut pas se déplacer** |

---

### DRONE_Greyhound

**Description :** Unité K9 mécanique télécommandée fabriquée par PRAXTON CORP. Déployée lors de missions de reconnaissance et patrouilles. Rare mais encore en circulation.

Trouvé dans : DRONES / Synth Settlements

| Move | Coût | Effet |
|---|---|---|
| **CAMOUFLAGE** | 1 | Pilot effectue un check DRONES furtivité — drone devient invisible |
| **FETCH** | 3⚡ | Gain a random narco-biotic or grenade |
| **BITE** | 1 | d6 Kinetic damage |

---

### DRONE_Ladybug

**Description :** Drone compact 4cm×9cm construit par **Yihiro Industries**. Spécialisé en cyber-défense, équipé d'un émetteur EMP pour désactiver les systèmes et l'électronique ennemis.

| Move | Coût | Effet |
|---|---|---|
| **HP INJECTION** | PASSIF | Restore **TEC** Health chaque tour |
| **EMP RELAY** | 2⚡ | **Silence** un ennemi pour **2 tours** |
| **TASER SHOT** | 3⚡ | **Shock** un ennemi pour **2 tours** |

---

### DRONE_ÔwÓ

**Description :** Version jailbreakée et modifiée du **Berserk MKII** Mech Unit. L'UI militaire et le software ont été remplacés par l'IA d'un forum de virtual pets. Ancienne version.

| Move | Coût | Effet |
|---|---|---|
| **AUTO-TURRET** | PASSIF | Deal **TEC** damage chaque tour |
| **DOUBLE MINIGUN** | 4⚡ | Deal **2d6 + TEC** damage |
| **MISSILE STRIKE** | 6⚡ | Deal **d8 × TEC** damage |

---

## 4.4 — CYBERTECH (p.43–44)

### Règles générales

- Roll pour trouver un Cybertech aléatoire en exploration
- Acheter n'importe quel implant Cybertech au coût listé dans les **Settlements**
- Coûts : **3♦ + 100★** (tier 1) / **6♦ + 200★** (tier 2) / **9♦ + 300★** (tier 3)

### Fabricants & Implants

#### 01 — SYNBIOS LABORATORIES

| Implant | Effet | Coût |
|---|---|---|
| **DETOX SYSTEM** | **+1 TEC** — Double le bonus de stat des **Narcobiotics** | 3♦ + 100★ |
| **CORTEX FIREWALL** | Si MIN supérieure à l'ennemi → pas de **Malware** quand les HACKS échouent. **[+1 Memory Slot]** | 6♦ + 200★ |
| **HEALING NANOBOTS** | Restore **2d8 + TEC** Health. **[3+][♦ Main]** | 9♦ + 300★ |

#### 02 — YEDRSL INDUSTRIES

| Implant | Effet | Coût |
|---|---|---|
| **CODE PROCESSOR** | **+1 MIN** — Le premier HACK lancé lors du premier tour de combat coûte **0★** | 3♦ + 100★ |
| **ZETTABYTE RAM** | **+1 MIN** — Choisir un **MASTER HACK** à apprendre. **[+1 Memory Slot]** | 6♦ + 200★ |
| **SECOND BRAIN** | Peut lancer des HACKS via **◇ Side Action** en ajoutant **+3★** à leur coût | 9♦ + 300★ |

#### 03 — FRONTERA CORP

| Implant | Effet | Coût |
|---|---|---|
| **TITANIUM BONES** | **+1 VIG** — +1★ Armor | 3♦ + 100★ |
| **FORCEBLAST HAND** | **+1 VIG** — Attaques mêlée infligent **+d6X** jusqu'à la fin du combat. **[2★][◇ Side]** | 6♦ + 200★ |
| **MANTIS SCYTHES** | Deal **d8 × GRA**, multiplié ×2 si premier dans l'ordre de tour. **[5★][♦ Main]** | 9♦ + 300★ |

#### 04 — ORBITAL DYNAMICS

| Implant | Effet | Coût |
|---|---|---|
| **JET PROPULSORS** | **+1 GRA** — Fuir le combat coûte seulement une **◇ Side Action**. Roll le dé joueur deux fois, garder le meilleur | 3♦ + 100★ |
| **TRIGGER FINGERS** | **+1 GRA** — Attaques à distance infligent **+d6X** jusqu'à la fin du combat. **[2★][◇ Side]** | 6♦ + 200★ |
| **HYPER REFLEXES** | Ralentir le temps pour esquiver la prochaine attaque ennemie. Coûte **+1★ par point d'Armor** possédé. **[3+][◇ Side]** | 9♦ + 300★ |

#### 05 — EVO ROBOTICS

| Implant | Effet | Coût |
|---|---|---|
| **CHROMEFIST** | Inflige **Armor × VIG** damage. Compte comme une attaque d'arme de mêlée. **[6★][♦ Main]** | 3♦ + 100★ |
| **DUAL PROCESSOR** | Attaquer avec les **deux armes équipées** via une seule **♦ Main Action**. **[4★]** | 6♦ + 200★ |
| **HEART ENGINE** | La première fois que l'on atteint **0 HP** dans un combat, restaurer la Health à **10 HP** | 9♦ + 300★ |

#### 06 — RIP TEC

| Implant | Effet | Coût |
|---|---|---|
| **SCANNER EYE** | **+1 TEC** — Une fois par rencontre, payer **2★** pour éviter le roll MIN lors d'un HACK. **[+1 Memory Slot]** | 3♦ + 100★ |
| **ATLAS HANDS** | Si Armor supérieure à l'ennemi → ennemi **Stunned** pour VIG tours. **[4★][◇ Side]** | 6♦ + 200★ |
| **CHAINSAW ARMS** | **d10 × VIG★**. **[5★][♦ Main]** | 9♦ + 300★ |

---

## Index rapide — Chapitre 4

| Concept | Page |
|---|---|
| Hacking (MIN, succès/échec → Malware) | 38 |
| Malware table D10 (1→10 effets) | 38 |
| Drones (DEPLOY action, passive ability) | 38 |
| 10 Hacks (roll d10, JAVELIN→HYDRA) | 39 |
| Hacks achetés Medusa Settlements (150★) | 40 |
| Master Hacks (×6, 34⚡, non-achetables) | 40 |
| DRONE_Spider (CARBON CLAW d6+TEC) | 41 |
| DRONE_Greyhound (CAMOUFLAGE, PRAXTON CORP) | 41 |
| DRONE_Ladybug (EMP, HP INJECTION) | 42 |
| DRONE_ÔwÓ (jailbreak, AUTO-TURRET) | 42 |
| Cybertech — achat Settlements | 43 |
| SYNBIOS : HEALING NANOBOTS (2d8+TEC) | 44 |
| YEDRSL : ZETTABYTE RAM → Master Hack | 44 |
| FRONTERA : MANTIS SCYTHES (d8×GRA) | 44 |
| ORBITAL : HYPER REFLEXES (esquive) | 44 |
| EVO : HEART ENGINE (résurrection 10HP) | 44 |
| RIP TEC : CHAINSAW ARMS (d10×VIG) | 44 |
