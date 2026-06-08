# Mémoire — Astroprisma App

## Projet

- **Dossier** : `C:\Users\PC-DELL\.claude\projects\astrogame-android`
- **GitHub** : https://github.com/kuchubb-commits/-astrogame-android.git
- **Stack** : React + Vite + TypeScript + Tailwind + Zustand + Gemini AI
- **Skill** : dire "astrogame" charge le skill de projet

## État actuel — 2026-06-08

### Extraction Core Book — progression

| Chapitre | Pages | Statut |
|---|---|---|
| ch1 — The World | p.1–15 | ✅ extrait |
| ch2 — Characters | p.16–29 | ✅ extrait |
| ch3 — Combat | p.30–36 | ✅ extrait + corrigé |
| ch4 — Hacking & Drones | p.38–44 | ✅ extrait + corrigé |
| ch5 — Equipment | p.46–50 | ✅ extrait + corrigé |
| ch6 — Starship Combat | p.51–56 | ✅ extrait + corrigé |
| ch7 — Exploration | p.57–89 | ⬜ à faire (33 pages) |
| ch8–10 | p.90+ | ⬜ à faire |

**Prochaine étape : extraire ch7 (p.57–89)**

### Fichiers book/

Tous les chapitres extraits sont dans `book/` :
- `ch3-combat.md`
- `ch4-hacking-drones.md`
- `ch5-equipment.md`
- `ch6-starship-combat.md`

### Mécanique importante découverte — ch6

Les modules SYSTEMS et WEAPONS s'activent selon le **résultat du dé Action** :
- ex : `5-6 ▶` = il faut rouler 5 ou 6 sur un dé Action pour activer ce module
- Tier 1–4 = 3⚡70★ / 5⚡125★ / 7⚡200★ / 9⚡350★

### Skill zoom — intégré

Règle active dans `CLAUDE.md` et `skills/astrogame/skill.md` :
→ Si image illisible → crop + zoom ×3 (Pillow) → agent Sonnet relit la zone → jamais de (?) sans avoir tenté le zoom.

Fichiers présents : `idee.md`, `plan.md`, `toc.txt`, `pdf_to_image.py`, `convert_all_pages.py`

## Règles PDF — PERMANENTES

### RÈGLE 1 — Numérotation : système de pages du PROJET (pas le PDF)

Le projet utilise sa **propre numérotation** — différente du fichier PDF.

| Pages projet | Contenu | Pages PDF (livre) |
|---|---|---|
| 0.1 → 0.3 | Front matter (cover, blank, TOC) | 1 → 3 |
| 1 → fin | Contenu du jeu (The World = p.1) | 4 → fin |

**Offset : pages PDF − 3 = pages projet** (valable pour toutes les pages ≥ 4 du fichier PDF)

Processus :
1. L'utilisateur donne un numéro de page **projet** (ex. p.9)
2. Convertir en page PDF : p.9 + 3 = page 12 du fichier PDF
3. Générer l'image avec `pdf_to_image.py <page_pdf>`
4. Lire le numéro imprimé en bas de l'image pour confirmer
5. Si ce n'est pas la bonne page, ajuster et retester

### RÈGLE 2 — Lecture : image obligatoire
Ne jamais utiliser l'extraction texte brute. Toujours convertir en PNG via `pdf_to_image.py` puis lire visuellement. Le style RPG positionne les infos de façon non-linéaire — l'extraction texte mélange tout.

### RÈGLE 3 — Validation systématique
Après lecture image, soumettre les données extraites à l'utilisateur avant tout usage.

### RÈGLE 4 — PDF trop lourd
Si le PDF échoue à la lecture, le dire immédiatement. Ne jamais continuer avec des données inventées ou partielles. Proposer un agent ciblé sur la page exacte nécessaire.

## Concept central du jeu

> Astroprisma est un **arbre de décision en cascade piloté par des jets de dés successifs** — chaque lancer ouvre une branche, chaque branche mène à un nouveau lancer, jusqu'au texte narratif final.

## Règles de collaboration

1. On valide avant de coder — chaque module discuté avant implémentation
2. Petits commits fréquents — chaque fonctionnalité = 1 commit
3. Tests manuels d'abord — lancer l'app dans le navigateur avant de passer à la suite
4. Les données viennent du PDF — aucune règle inventée, tout extrait du Core Book
