# Contributing to ScreenTime Guard

Thanks for your interest in contributing! This project aims to be a transparent, privacy-first tool that non-technical parents can trust — contributions that strengthen either goal are especially welcome.

## Ground rules

- Read the [Code of Conduct](CODE_OF_CONDUCT.md).
- **Privacy is a feature.** Do not add content capture, keystroke logging, screenshots, or any data beyond domain names and durations. See PRD §6.4.
- Keep the extension **local-first**: no network calls unless the user explicitly opts in.

## Getting started

Prerequisites: Node.js >= 22, [pnpm](https://pnpm.io) 11 (or `corepack enable`).

```bash
git clone https://github.com/sirLass/screentime-guard-.git
cd screentime-guard-
pnpm install
pnpm dev        # extension dev server with hot reload
```

Load the unpacked build in Chrome: `chrome://extensions` → Developer mode → **Load unpacked** → `apps/extension/.output/chrome-mv3`.

Use a **separate Chrome profile** for development so your own browsing is not tracked while testing.

## Supply-chain policy

This repo enforces pnpm's `minimumReleaseAge: 1440` (see `pnpm-workspace.yaml`): package versions published to npm less than **24 hours ago** are rejected at install time. This is a supply-chain defense (PRD §6.3), and CI re-verifies the committed lockfile against the same policy — so a lockfile resolved here always passes CI.

Two quirks worth knowing:

- pnpm **verifies** the release-age policy but does **not** filter versions during resolution. If you install a dependency whose latest release is under 24 hours old, the install fails with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` and **no lockfile is written**. Fix: install/pin an older version, or wait a day and retry.
- pnpm can reconstruct a resolution from an existing `node_modules` tree even when `pnpm-lock.yaml` is deleted. If an install keeps resolving a policy-violating version despite an older pin in `package.json`, delete `node_modules` and install again.
- `@types/chrome` is deliberately pinned to the exact version `0.3.5` because newer releases landed inside the cutoff window. Dependabot will propose bumps once versions age past 24 hours.

## Project structure

| Path              | What it holds                                                               |
| ----------------- | --------------------------------------------------------------------------- |
| `apps/extension`  | The WXT (Manifest V3) extension: entrypoints and `lib/` modules             |
| `packages/shared` | Shared types and pure utilities (domain matching, date helpers, validation) |
| `docs`            | User-facing documentation                                                   |
| `DOCUMENTATION`   | PRD and implementation plan                                                 |

## Workflow

1. Pick an item from [DOCUMENTATION/IMPLEMENTATION_PLAN.md](DOCUMENTATION/IMPLEMENTATION_PLAN.md) — ideally from the current milestone.
2. Create a branch: `git checkout -b feat/short-description`.
3. Make your change. New logic needs unit tests; bug fixes need a regression test.
4. Run the quality gates locally:

   ```bash
   pnpm lint && pnpm typecheck && pnpm test && pnpm build
   ```

   Husky runs lint-staged (ESLint + Prettier) automatically on commit.

5. Open a pull request. CI must be green. Reference the plan item or issue it closes.

## Code style

- TypeScript **strict** mode, no `any` without a written justification.
- ESLint + Prettier do the heavy lifting — don't hand-format.
- Keep modules in `lib/` focused: `tracker`, `rules`, `blocker`, `storage`, `pin` (see PRD §7.7).
- UI copy must be plain, jargon-free, and non-punitive (this tool is shown to children).

## Reporting bugs and security issues

- Bugs: open a [bug report](.github/ISSUE_TEMPLATE/bug_report.yml) with browser/version and reproduction steps.
- **Security vulnerabilities: do not open a public issue.** See [SECURITY.md](SECURITY.md).

## Questions

Open a discussion or an issue labeled `question`. If you're unsure where to start, check the plan's Phase 1 milestones — M1 (foundation helpers and storage) is the most beginner-friendly entry point.
