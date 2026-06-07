# Idée — Astroprisma Digital Companion

## Concept central

Remplacer le PDF physique par une **application web interactive** permettant de jouer à Astroprisma en solo sans jamais ouvrir le PDF.

> **Principe fondamental du jeu :** Astroprisma est un **jeu d'exploration de carte hexagonale** en espace post-apocalyptique. Le joueur incarne un Spacefarer qui se déplace sur une Star System Map découpée en 3 anneaux, rencontre des événements aléatoires, et cherche à aider l'une des 5 factions à prendre le pouvoir.

---

## L'univers

**Contexte post-apocalyptique spatial.** La civilisation s'est effondrée. La technologie avancée a disparu. Deux modes de vie subsistent :
- Les **Settlements** : petites colonies planétaires isolées
- Les **Ships** : groupes nomades voyageant dans l'espace

**L'Ancien Monde (Old World)** : une ère technologique détruite dont les reliques (armes, implants cybernétiques, hubs virtuels) sont les objets les plus précieux.

**Les Spacefarers** : ceux qui ont quitté la sécurité des settlements pour explorer l'univers — c'est le rôle du joueur.

**Les 5 Factions** : W.A.R.G. / Intersolar Federation / Medusa Sector / Corsair Syndicate / Synth Arch — en conflit permanent pour les ressources, le territoire et le pouvoir.

---

## But du jeu

> Explorer l'intégralité de la **Star System Map** et aider l'une des 5 factions à prendre le pouvoir.

---

## La boucle de jeu (Exploration Cycle)

La campagne est découpée en **cycles de 5 tours** :

| Étape | Action |
|---|---|
| 1. Move | Déplacer son vaisseau de 5 hexs sur la carte |
| 2. Explore | Roll d6 selon l'anneau → lieu + événement |
| 3. Mark / Rivals | Noter les découvertes sur la carte, avancer la relation avec les factions |

---

## La Star System Map — composant central

Carte hexagonale divisée en **3 anneaux concentriques** :

| Anneau | Ambiance | Dangers |
|---|---|---|
| **Outer Ring** | Sauvage, volatile | Pirates, contrebandiers, artefacts, champs d'astéroïdes |
| **Middle Ring** | Ruines de l'Ancien Monde | Colonies abandonnées, routes commerciales, labo expérimentaux |
| **Inner Ring** | Extrême, proche de l'étoile | Éruptions solaires, radiations, Solar Cores (ressources rares) |

Chaque nouveau hex → roll sur les tables **Planets** et **Satellites** pour générer le contenu procéduralement.

---

## Modes de jeu

- **Quick Mode** : résolution rapide, tout en un seul roll
- **Journaling Mode** *(recommandé)* : narration, notes, décisions progressives — idéal pour l'intégration IA

---

## Problème résolu

| Avec le PDF | Avec l'app |
|---|---|
| Gérer la carte hex à la main | Carte interactive avec position du vaisseau |
| Consulter plusieurs tables à chaque roll | Tables automatisées avec résultat immédiat |
| Tenir un journal papier | Journal de campagne intégré |
| Narration imaginée seul | Suggestions IA contextuelles (Gemini) |
| Impossible sur mobile | Mobile-first PWA |

---

## Stack technique

- **Frontend** : React + Vite + TypeScript + Tailwind CSS
- **State** : Zustand (stores partagés entre modules)
- **IA** : Gemini API (narration contextuelle)
- **Déploiement** : Cloudflare Pages (auto-deploy sur git push)
- **Format** : Progressive Web App (PWA), mobile-first

---

## Contraintes

- Budget API : Gemini via Google One AI Premium (inclus)
- Déploiement : gratuit (Cloudflare Pages)
- Développement solo avec Claude Code
- Phase 1 : solo uniquement
- Phase 2 (future) : extension multijoueur (architecture prévue dès le départ)
