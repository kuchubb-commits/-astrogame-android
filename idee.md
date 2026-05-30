# Idée — Astroprisma Digital Companion

## Concept central

Remplacer le PDF physique par une **application web/mobile interactive** permettant de jouer à Astroprisma en solo (ou multi) sans jamais ouvrir le PDF. L'application intègre toutes les règles, tables, lore et mécaniques du jeu, enrichis par une narration IA (Gemini).

## Le jeu : Astroprisma en deux mots

- **Genre** : Jeu de rôle solo/coopératif de science-fiction spatiale
- **Boucle de jeu** : Explorer des mondes, rencontrer des factions, combattre, hacker, voyager entre étoiles
- **Particularité** : Système Oracle (dés + tables) qui génère narration et événements aléatoires — parfait pour l'IA
- **Langue source** : PDF en anglais, interface cible en français (ou bilingue)

## Problème résolu

| Avec le PDF | Avec l'app |
|---|---|
| Tourner les pages pour retrouver une règle | Recherche instantanée |
| Lancer des dés physiques + consulter des tables | Automatisé + résultat narratif |
| Gérer sa feuille de perso à la main | Feuille interactive persistante |
| Narration imaginée seul | Suggestions IA contextuelles (Gemini) |
| Impossible à jouer sur mobile | Mobile-first PWA |

## Vision produit

Une **Progressive Web App (PWA)** accessible depuis un navigateur mobile ou desktop :

1. **Feuille de personnage interactive** — stats, inventaire, connexions, vaisseaux
2. **Compagnon de règles** — toutes les mécaniques consultables en un clic
3. **Système de dés intégré** — lancers automatiques avec lecture de tables
4. **Narration IA** — Gemini suggère des descriptions, dialogues, retournements
5. **Journal de campagne** — log des sessions, sauvegarde locale/cloud
6. **Mode exploration** — génération de planètes, rencontres, factions selon les tables du jeu

## Contraintes

- **Budget API** : Gemini via Google One AI Premium (inclus, sans surcoût)
- **Déploiement** : Gratuit (Cloudflare Pages ou Vercel free tier)
- **Développement** : En duo avec Claude Code, pas de framework inconnu imposé
- **Phase 1** : Solo uniquement
- **Phase 2** : Extension multijoueur (architecture prévue dès le départ)

## Contenu confirmé dans les fichiers officiels

### Spacefarer's Journal (PDF form-fillable, 17 pages)
> Source directe pour les données JSON à intégrer dans l'app

**Achievements (7) — à implémenter comme système de succès :**
- ASTROPRISMA · ORIGIN STORY · SERUM ADDICT · CORE CONFLICT · LONE WOLF · HARDCORE · IMMORTAL

**Tables aléatoires d100 (page 12) :**
- `CHARACTER ENCOUNTERS` — 100 entrées de rencontres de personnages
- `SETTLEMENT QUIRKS` — 100 entrées de particularités de colonies

**DATABASE 01 & 02 — Ennemis avec stats complètes :**
- Faction WARG : Grenadier, Partisan Guard
- Faction ISF : Starscout, Walking Fortress
- Faction Medusa : Griddper, Cyphersteel
- Faction Corsair : Buccaneer, Casino Shark
- Faction Synth : Chromesage, Solarsphynx
- Indépendants : Clone Colonist, Corpo Paramilitary, Narco-Addict, Afterlife Ghoul, Melting-Machine
- Créatures : Scrapeater, Emperor Scrapeater, Cortex Brainworm, Quetzal Declarlis, Horned Tarrasqosaur

**DATABASE 03 & 04 — Vaisseaux avec stats :**
- Classe Ultra : V-Ace Thunderbolt, Typhoon Speeder, Duskwind Heron, Scabas Pharaoh, Vector-7 Orchid, Hammerhead Hauler
- Classe Y : Venus Transporter, X-Surface Crawler, Neon-Sea Delta, Lunar-Charger, A-2 Voyager, Gamma Interceptor

**Journal de session :**
- 9 doubles pages vierges lignées (format journal physique à reproduire en digital)
- PLAYTHROUGHS tracker (suivi du nombre de parties)

---

## Périmètre Phase 1

- [ ] Création et gestion de personnage
- [ ] Système de dés + lecture automatique des tables
- [ ] Règles de combat (standard + spatial)
- [ ] Règles de hacking et drones
- [ ] Équipement et loot
- [ ] Exploration (planètes, colonies, rencontres)
- [ ] Factions (faveurs, missions)
- [ ] Narration IA via Gemini
- [ ] Sauvegarde locale (localStorage / IndexedDB)
