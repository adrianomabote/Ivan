---
name: External deployment lockfiles
description: Keep npm dependency locks portable when deploying this Vite app outside Replit.
---

Before deploying this project from GitHub to Vercel, ensure `package-lock.json` resolves package tarballs from a public npm registry, not Replit's internal package firewall.

**Why:** Vercel cannot resolve `package-firewall.replit.internal`, which makes dependency installation fail with `ENOTFOUND`.

**How to apply:** When changing or regenerating the lockfile in Replit, check for `replit.internal` URLs and use public `https://registry.npmjs.org/` tarball URLs while preserving versions and integrity hashes.
