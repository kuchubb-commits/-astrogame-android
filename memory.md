# Mémoire — Astroprisma App

## Projet

- **Dossier** : `C:\Users\PC-DELL\.claude\projects\astrogame-android`
- **GitHub** : https://github.com/kuchubb-commits/-astrogame-android.git
- **Stack** : React + Vite + TypeScript + Tailwind + Zustand + Gemini AI
- **Skill** : dire "astrogame" charge le skill de projet

## État actuel

Projet réinitialisé — base propre. Nouvelle vision en cours de définition.

Fichiers présents : `idee.md`, `plan.md`, `toc.txt`, `pdf_to_image.py`, `convert_all_pages.py`

## Règles PDF — PERMANENTES

### RÈGLE 1 — Numérotation : toujours la page du LIVRE
Se référer uniquement aux numéros de pages imprimés dans le livre. Jamais aux numéros du fichier PDF. Il n'existe pas de décalage fixe — ne jamais inventer un offset.

Processus :
1. L'utilisateur donne un numéro de page du livre
2. Générer l'image avec `pdf_to_image.py`
3. Lire le numéro imprimé en bas de l'image pour confirmer
4. Si ce n'est pas la bonne page, ajuster et retester

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
