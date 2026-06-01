<!-- SUMMONIQ-OSS-HEADER:START -->
<div align="center">

  <h1>AppLab Studio</h1>
  <p>Designer dashboard for creating, editing, and shipping pages across SummonIQ projects.</p>

  <p>
    <a href="https://github.com/SummonIQ/applab-studio"><img alt="Repository" src="https://img.shields.io/badge/github-SummonIQ%2Fapplab--studio-24292f?logo=github"></a>
    <a href="https://unlicense.org/"><img alt="License: Unlicense" src="https://img.shields.io/badge/license-Unlicense-blue.svg"></a>
  </p>

</div>

---
<!-- SUMMONIQ-OSS-HEADER:END -->

# AppLab Studio

AppLab Studio is a Next.js and Electron workspace for designing, editing, and shipping pages from SummonIQ projects.

## Run

1. Install dependencies:

   ```bash
   bun install
   ```

2. Start the web and desktop development processes:

   ```bash
   bun run dev
   ```

## Useful Scripts

- `bun run next:dev` starts the Next.js app on port 30020.
- `bun run electron:start` launches the Electron shell.
- `bun run build` creates the production Next.js build.
- `bun run lint` runs ESLint.
- `bun run typecheck` runs TypeScript without emitting files.

## Project Areas

- `app/` contains the Next.js routes and API handlers.
- `components/studio/` contains the builder interface.
- `electron/` contains the desktop shell.
- `prisma/` contains the database schema and seed scripts.
