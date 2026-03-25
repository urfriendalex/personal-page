# AGENTS.md

## Cursor Cloud specific instructions

This is a React + Vite portfolio SPA (`___FOLIO`) with no backend, no database, and no external API dependencies.

### Running the dev server

```
npm run dev
```

Serves on `http://localhost:5173` by default. Add `-- --host 0.0.0.0` to expose on all interfaces.

### Case-sensitive imports

The `src/Components/` directory uses a capital `C`. All import paths must match this casing exactly (e.g. `./Components/Landing`, not `./components/Landing`), since Linux is case-sensitive. If you add new imports referencing files in this directory, use the capital `C`.

### No lint or test commands

The project has no ESLint config, no test framework, and no `lint` or `test` scripts in `package.json`. The only relevant scripts are `dev`, `build`, `preview`, and `optimize-images`.

### Tech stack summary

- React 18, Vite 5, SCSS/Sass, Bootstrap 5
- GSAP 3 + ScrollTrigger for animations, Lenis for smooth scrolling
- Redux Toolkit + Redux Persist (localStorage) for state
- npm as package manager (lockfile: `package-lock.json`)
