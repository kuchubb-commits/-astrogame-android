# Plan de développement — Astroprisma App

## Vue d'ensemble

| Phase | Contenu | Durée estimée |
|---|---|---|
| 0 — Fondations | Setup projet, structure, CI/CD | 1 session |
| 1 — Personnage | Feuille de perso interactive | 2-3 sessions |
| 2 — Dés & Oracle | Moteur de dés + tables | 1-2 sessions |
| 3 — Combat | Système de combat complet | 2-3 sessions |
| 4 — IA Gemini | Narration contextuelle | 1-2 sessions |
| 5 — Exploration | Génération de mondes | 2-3 sessions |
| 6 — Factions & DB | Factions, ennemis, PNJ | 2 sessions |
| 7 — Polish | UI, PWA, déploiement final | 1-2 sessions |

---

## Phase 0 — Fondations

### Objectif
Avoir un projet qui tourne, déployé, avec la bonne structure.

### Étapes
- [ ] `npm create vite@latest astroprisma-app -- --template react-ts`
- [ ] Installer Tailwind CSS + config
- [ ] Installer Zustand (state management)
- [ ] Installer Gemini SDK (`@google/generative-ai`)
- [ ] Créer structure de dossiers `src/`
- [ ] Connecter GitHub → Cloudflare Pages (auto-deploy sur push)
- [ ] Page d'accueil placeholder déployée
- [ ] `.env` pour la clé Gemini (jamais commitée)

### Résultat attendu
URL Cloudflare Pages fonctionnelle avec page d'accueil vide.

---

## Phase 1 — Feuille de personnage

### Objectif
Créer un personnage complet et le sauvegarder localement.

### Contenu du chapitre 2 à implémenter
- Création : choix d'origine (Background/Origin system)
- Stats de base : VIGOR, GRACE, MIND, TECH *(noms exacts — Character Sheet 2.0)*
- Ressources : HEALTH (20), ENERGY (20), ARMOR, EXP, HYPERDRIVE (jauge)
- Status Conditions : STUN, BREACH, SHOCK, SILENCE, IMMUNITY, OVERHEAT
- Map de compétences (Skills map)
- Connexions (NPCs liés)
- Équipage (Crewmembers)
- Vaisseau (Starship stats)

### Composants à créer
```
CharacterCreation.tsx   → wizard de création étape par étape
CharacterSheet.tsx      → feuille principale consultable/modifiable
StatBlock.tsx           → bloc de stats avec +/-
OriginCard.tsx          → carte d'origine avec effets
ConnectionList.tsx      → liste des connexions
StarshipPanel.tsx       → stats du vaisseau
```

### Données JSON à extraire du PDF
```json
// data/origins.json
{ "id": "soldier", "name": "Soldier", "bonuses": {...}, "ability": "..." }

// data/stats.json
{ "base_hp_formula": "...", "defense_formula": "..." }
```

### Résultat attendu
Wizard de création → feuille affichée → sauvegarde localStorage.

---

## Phase 2 — Moteur de dés & Oracle

### Objectif
Lancer des dés, lire les tables automatiquement.

### Mécanique Astroprisma
- Système de base : 2d6 + stat vs difficulté
- Résultats : Succès Total / Succès / Succès Partiel / Échec / Échec Critique
- Oracle : table de 36 entrées (2d6 × 2d6) pour narration libre

### Composants
```
DiceRoller.tsx       → interface de lancer visuelle
DiceResult.tsx       → affichage résultat avec couleur
OracleTable.tsx      → table Oracle cliquable
DiceHistory.tsx      → historique scrollable
```

### Résultat attendu
Lancer n'importe quel dé, voir le résultat narratif, consulter l'Oracle.

---

## Phase 3 — Combat

### Objectif
Gérer un combat complet (phase par phase).

### Mécaniques (Chapitres 3 & 6)
- Initiative (dé + stat)
- Tour : Attaque → jet → dégâts → application
- Armes de mêlée vs portée (tables de dommages)
- Armures et réduction de dégâts
- Combat spatial (vaisseaux, modules)

### Composants
```
CombatSetup.tsx      → choisir ennemis + terrain
CombatTracker.tsx    → timeline des tours
WeaponSelector.tsx   → choisir arme + lancer
EnemyCard.tsx        → PV ennemi + attaques
SpaceBattleMode.tsx  → vue combat spatial
```

### Résultat attendu
Combat tour-par-tour jouable jusqu'à victoire/défaite.

---

## Phase 4 — IA Narrative (Gemini)

### Objectif
Gemini raconte le jeu en temps réel.

### Intégration
```typescript
// lib/gemini.ts
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function narrateAction(context: GameContext): Promise<string> {
  const prompt = buildNarrativePrompt(context);
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### Contexte injecté dans chaque prompt
- Nom + origine du personnage
- Scène actuelle (lieu, situation)
- Action tentée
- Résultat du dé
- Faction(s) présentes
- Ambiance souhaitée (neutre / tendu / épique)

### Résultat attendu
Chaque action joueur génère 2-3 phrases narratives. L'Oracle génère une description de situation.

---

## Phase 5 — Exploration

### Objectif
Générer des mondes, rencontres et activités procéduralement.

### Tables à implémenter (Chapitre 7)
- Génération de planètes (type, atmosphère, population)
- Satellites et anomalies
- Colonies et activités disponibles
- Ring Encounters (rencontres aléatoires)
- Cybersphère (missions numériques)
- Abyssal Scars (zones dangereuses)

### Résultat attendu
Appuyer sur "Explorer" génère une planète avec description IA et événement aléatoire.

---

## Phase 6 — Factions & Base de données

### Objectif
Suivre les relations avec les 5 factions, accéder aux missions et ennemis.

### Factions (Chapitre 8)
- W.A.R.G.
- Intersolar Federation
- Medusa Sector
- Corsair Syndicate
- Synth Arch

### Base de données (Chapitre 9)
- Ennemis avec stats complètes
- Vaisseaux ennemis
- Générateur de PNJ
- Tables aléatoires contextuelles

---

## Phase 7 — Polish & Déploiement

### PWA
- `vite-plugin-pwa` → manifest + service worker
- Icône app + splash screen
- Mode offline (les données JSON sont en cache)

### UI finale
- Dark theme SF cohérent
- Animations dés (CSS)
- Responsive mobile 375px → desktop

### Déploiement final
- `git push` → Cloudflare Pages build auto
- Variables d'environnement Gemini dans le dashboard Cloudflare

---

## Règles de collaboration

1. **On valide avant de coder** — chaque module discuté avant implémentation
2. **Petits commits fréquents** — chaque fonctionnalité = 1 commit
3. **Tests manuels d'abord** — lancer l'app dans le navigateur avant de passer à la suite
4. **Les données viennent du PDF** — aucune règle inventée, tout extrait du Core Book

---

## Prochaine étape immédiate

> **Phase 0** : Initialiser le projet React + Vite + TypeScript et déployer sur Cloudflare Pages.

Commande de départ :
```bash
cd C:\Users\PC-DELL\.claude\projects\astrogame-android
npm create vite@latest astroprisma-app -- --template react-ts
```
