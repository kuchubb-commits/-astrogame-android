# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Astroprisma Digital Companion — a React PWA that replaces the Astroprisma RPG PDF, allowing solo play without opening the book. All game data comes exclusively from the Core Book; nothing is invented.

## Commands

All commands run inside `astroprisma-app/`:

```bash
npm run dev        # dev server with HMR
npm run build      # tsc -b && vite build → dist/
npm run lint       # eslint on all .ts/.tsx
npm run preview    # serve dist/ locally
```

Deployment is automatic: `git push` → Cloudflare Pages builds and deploys `astroprisma-app/dist/`.

## Architecture

### Repository layout

```
astrogame-android/
├── astroprisma-app/        ← Vite + React + TS app (source of truth for code)
│   └── src/
│       ├── features/       ← one folder per game phase (character, combat, dice…)
│       ├── stores/         ← Zustand stores shared across features
│       └── data/           ← JSON game data consumed by the app
├── book/                   ← extracted game rules (ch1–ch11 markdown, authoritative)
├── pdf_to_image.py         ← converts a single PDF page to PNG
└── convert_all_pages.py    ← converts all pages at once
```

### Feature isolation pattern

Each feature is **independent**: it reads/writes only its own Zustand store plus shared stores. Features never import from each other. Integration happens through stores, not direct calls.

```
src/features/<feature>/
    ├── components/   ← React UI
    ├── hooks/        ← feature-specific logic
    └── index.ts      ← public surface (store + main component)
```

### Zustand stores

Stores live in `src/stores/` and are the **only** cross-feature communication layer. Each phase owns one store; the narration store (`useNarrationStore`) reads all of them to build AI context.

### Game data pipeline

`book/ch*.md` → JSON files in `src/data/` → consumed by stores/components. Never hardcode game values inline; always source from these JSON files.

## PDF extraction rules

These rules are permanent — never bypass them.

- **Always use PNG images** via `pdf_to_image.py <page_number>`. Never use raw text extraction.
- **Page offset**: ch1–ch6 use offset +3 (PDF page = book page + 3). Ch7 onwards: offset = 0.
- **Zoom before `(?)`**: if a zone is illegible, crop + zoom ×3 with Pillow before marking anything uncertain.
- **Validate before integrating**: extracted data must be confirmed before writing to `book/` or `src/data/`.

## Game data reference

Canonical game rules are in `book/`. Key symbols used throughout:

| Symbol | Meaning |
|--------|---------|
| `★` | Serum (currency) |
| `⚡` | Energy |
| `⚙` | Scraps |
| `◎` | Hyperdrive |
| `♡` | Armor |
| `✳` | Serum (astérisque 6 branches) |
| `◆` | Challenge Roll |

Stats: **VIGOR / GRACE / MIND / TECH**. Status conditions: OVERHEAT, SHOCK, STUN, SILENCE, BREACH, IMMUNITY.

## Gemini API

Key stored in `.env` as `VITE_GEMINI_API_KEY` — never committed. Narration calls go through `src/lib/gemini.ts`.
