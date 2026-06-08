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
| 1 | 🔴 | CH7 | Coût entrée Cybersphere : 3₵ vs 5★ | p.59 et p.61 | `page_059.png` + `page_061.png` | ⬜ |
| 2 | 🔴 | CH2 | Légende des icônes ◆ / ★ / ✦ / ⊕ dans les récompenses | p.13–14 | `page_013.png` + `page_014.png` | ⬜ |
| 3 | 🔴 | CH2 | GRACE vs DACE — nom exact du stat sur p.15 | p.15 | `page_015.png` | ⬜ |
| 4 | 🟡 | CH7 | Numérotation "1-x" Gaian ET Calorian — conflit de labels | p.75 et p.76 | `page_075.png` + `page_076.png` | ⬜ |
| 5 | 🟡 | CH7 | Références pages Cybersphere Encounters + Matrix Nodes (coin droit coupé) | p.62 | `page_062.png` (bord droit) | ⬜ |
| 6 | 🟡 | CH4 | DRONE_Greyhound : ability FETCH illisible | p.41 | `page_041.png` | ⬜ |
| 7 | 🟡 | CH5 | Table de Loot p.48 — structure et colonnes inconnues | p.48 | `page_048.png` | ⬜ |
| 8 | 🟡 | CH7 | Matrix Nodes entrée 61 — texte masqué par illustration | p.62 | `page_062.png` | ⬜ |
| 9 | 🟢 | CH7 | "S Energy" dans Treetop Parkour S-5 — probablement "5" | p.79 | `page_079.png` | ⬜ |
| 10 | 🟢 | CH7 | Nom exact DRONE_ÔwÓ — caractères spéciaux à confirmer | p.80 | `page_080.png` | ⬜ |

---

## Détail des points

### 1. 🔴 Coût d'entrée Cybersphere
- **PNG** : `page_059.png` + `page_061.png`
- **Doute** : p.59 (Settlement Activities) dit **"3₵"** — p.61 (Cybersphere section) dit **"5★"**. Le coût réel est l'un ou l'autre.
- **Résolution** : zoom sur la ligne de coût dans chacune des deux pages, comparer

---

### 2. 🔴 Légende des icônes inline
- **PNG** : `page_013.png` + `page_014.png` (feuille de personnage)
- **Doute** : petits symboles ◆ / ★ / ✦ / ⊕ apparaissent partout dans les récompenses et pénalités de ch7. Les valeurs numériques (+1, -1...) sont certaines mais l'icône associée (quelle faction ? EXP ? Serum ?) reste ambiguë.
- **Ce qu'on sait déjà** (ch2-rules.md p.16) : `★` ou `#` = **Serum** (monnaie universelle). `Favor` = relation faction. `EXP` = expérience pour cybertech.
- **Ce qui manque** : le symbole visuel exact pour chacun — la feuille de personnage p.13–14 a probablement une légende avec les icônes imprimées.
- **Résolution** : lire `page_013.png` + `page_014.png` pour identifier chaque icône visuellement

---

### 3. 🔴 GRACE vs DACE — nom du stat
- **PNG** : `page_015.png`
- **Doute** : la stat est nommée **GRACE** dans tout le document, mais l'agent a lu **"DACE"** sur p.15. Faute de frappe dans le livre ou erreur de lecture ?
- **Impact** : le nom exact est utilisé dans le code (store Zustand, labels UI)
- **Résolution** : zoom sur le label de la stat sur `page_015.png`

---

### 4. 🟡 Numérotation "1-x" Gaian ET Calorian
- **PNG** : `page_075.png` + `page_076.png`
- **Doute** : les deux pages utilisent le préfixe "1-x" pour leurs encounters (1-1 à 1-6). Or Gaian = type 01 et Calorian = type 02 dans la table des planètes. Impossible que les deux aient le même préfixe — erreur d'agent ou système de numérotation différent.
- **Impact** : la logique de roll (d6 type → d6 encounter) dépend du bon mapping
- **Résolution** : zoom sur les en-têtes et numéros d'entrée sur `page_075.png` et `page_076.png`

---

### 5. 🟡 Références pages Cybersphere Encounters + Matrix Nodes
- **PNG** : `page_062.png` (bord droit de l'image coupé)
- **Doute** : les deux références "[p.(?)]" dans la section Cybersphere (table Encounters et table Matrix Nodes) sont dans une zone coupée à droite. On sait d'après ch7 que les tables sont sur p.61 et p.62 — mais la référence imprimée dans le livre doit être confirmée.
- **Résolution** : zoom unique sur le coin droit de `page_062.png` — résout les deux points en une seule opération

---

### 6. 🟡 DRONE_Greyhound — ability FETCH illisible
- **PNG** : `page_041.png`
- **Doute** : L'ability **FETCH** (coût Energy : 1) a ses données partiellement illisibles. L'effet est inconnu.
- **Impact** : la fiche du drone Greyhound est incomplète pour l'implémentation
- **Résolution** : zoom sur la ligne FETCH dans le tableau des moves du DRONE_Greyhound

---

### 7. 🟡 Table de Loot p.48 — structure inconnue
- **PNG** : `page_048.png`
- **Doute** : la table contient des colonnes pour armes Ranged + Melee, mais toutes les valeurs sont `(?)`. Probable table de tirage aléatoire (d6 → quelle arme est trouvée en loot). La structure exacte des colonnes est inconnue.
- **Note** : les stats des armes sont déjà dans `ch3-combat.md` — cette table ne sert probablement qu'au loot aléatoire, pas aux achats
- **Résolution** : zoom sur `page_048.png` pour lire la structure (colonnes, dé de tirage)

---

### 8. 🟡 Matrix Nodes entrée 61 — texte masqué
- **PNG** : `page_062.png`
- **Doute** : "Broken Tesseract *(texte masqué par illustration)*, can be repaired with 100★" — le début de la description de l'entrée 61 est caché par une image décorative de planète en arrière-plan
- **Résolution** : zoom sur la ligne 61 de la table d66 dans `page_062.png`

---

### 9. 🟢 "S Energy" dans Treetop Parkour (S-5)
- **PNG** : `page_079.png`
- **Doute** : "restore **S Energy**" — le "S" est très probablement le chiffre "5" mal reconnu par l'agent (résolution basse)
- **Résolution** : zoom sur la ligne Success de l'entrée S-5

---

### 10. 🟢 Nom exact du drone (DRONE_ÔwÓ ?)
- **PNG** : `page_080.png`
- **Doute** : l'agent a lu "DRONE_ÔwÓ" — ce nom semble étrange. Peut-être "DRONE_OwO" ou autre chose entièrement.
- **Résolution** : zoom sur l'entrée 6-4 dans `page_080.png`

---

## À compléter au fil des sessions

*(Ajouter ici tout nouveau doute découvert lors de l'extraction des chapitres suivants)*
