# AGENTS.md

## Cursor Cloud specific instructions

This is a React + Vite portfolio SPA (`___FOLIO`) with no backend, no database, and no external API dependencies.

### Running the dev server

```
npm run dev
```

Serves on `http://localhost:5173` by default. Add `-- --host 0.0.0.0` to expose on all interfaces.

### Known issue: case-sensitive imports

The `src/Components/` directory uses a capital `C`, but import paths in source files (e.g. `src/App.jsx`, `src/Components/Landing.jsx`) reference `./components/` with a lowercase `c`. This works on macOS/Windows (case-insensitive FS) and in Vite dev mode, but **`vite build` fails on Linux** with `Could not resolve "./components/..."`. The dev server still works fine for development.

### No lint or test commands

The project has no ESLint config, no test framework, and no `lint` or `test` scripts in `package.json`. The only relevant scripts are `dev`, `build`, `preview`, and `optimize-images`.

### Tech stack summary

- React 18, Vite 5, SCSS/Sass, Bootstrap 5
- GSAP 3 + ScrollTrigger for animations, Lenis for smooth scrolling
- Redux Toolkit + Redux Persist (localStorage) for state
- npm as package manager (lockfile: `package-lock.json`)
