# ScreenTime Guard

> **Status: early development (Phase 0 bootstrap).** Not yet usable — no tracking, limits, or blocking implemented yet. Follow [DOCUMENTATION/IMPLEMENTATION_PLAN.md](DOCUMENTATION/IMPLEMENTATION_PLAN.md) for the build order.

An open source, privacy-first browser extension that measures how long a child actively spends on specific websites, compares that time against limits set by a parent, and blocks the site when the allowance is used up.

## Why this exists

- **DNS-level blockers** (Pi-hole, AdGuard Home) see requests, not time spent — they can't enforce "1 hour per day on YouTube."
- **Built-in tools** (Google Family Link, Apple Screen Time) are locked to one company's ecosystem.
- **Paid apps** (Qustodio, Bark, Net Nanny) store a child's browsing data on third-party servers.

ScreenTime Guard measures time **on the device**, enforces limits **locally** (works offline), and never sends data anywhere unless you explicitly enable a future sync feature.

## Principles

- **Local-first:** all data stays on the device by default. No accounts, no telemetry.
- **Data minimization:** only domain names and durations are stored — never full URLs, page titles, or page content.
- **Transparent:** open source, documented limits, nothing covert. The tool is meant for open conversation between parent and child.
- **Honest about limits:** a determined child can bypass any browser extension. Docs explain how to make it harder (managed policies) and where the boundaries are.

## Planned features (Phase 1, local-only)

- Active-time tracking per domain (counts only focused tabs with an active user, with an exception for playing video/audio)
- Per-site daily limits with weekday/weekend overrides and allowed-hours windows
- Automatic blocking via `declarativeNetRequest` with a friendly "Time's up" page
- PIN-protected parent settings (salted-hash PIN, lockout after failed attempts)
- Usage reports with charts, CSV/JSON export, and 90-day retention

See [DOCUMENTATION/PRD.md](DOCUMENTATION/PRD.md) for the full requirements.

## Repository layout

```
screentime-guard/
├── apps/
│   └── extension/        # WXT (Manifest V3) + React + TypeScript extension
├── packages/
│   └── shared/           # Shared types and utilities (domain matching, dates, validation)
├── docs/                 # User-facing docs (privacy policy, hardening guide, ...)
├── DOCUMENTATION/        # PRD and implementation plan (internal planning docs)
└── .github/              # CI, Dependabot, issue/PR templates
```

## Development

Prerequisites: Node.js >= 22 and pnpm 11 (`corepack enable`).

```bash
pnpm install        # install dependencies and generate WXT types
pnpm dev            # start the extension dev server (hot reload)
pnpm build          # build the production extension to apps/extension/.output/
pnpm lint           # ESLint
pnpm typecheck      # TypeScript (strict)
pnpm test           # Vitest unit tests
```

To load the extension in Chrome: run `pnpm build`, then open `chrome://extensions`, enable **Developer mode**, click **Load unpacked**, and select `apps/extension/.output/chrome-mv3`.

## Documentation

| Document                                                                     | Purpose                                                           |
| ---------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| [DOCUMENTATION/PRD.md](DOCUMENTATION/PRD.md)                                 | Product requirements                                              |
| [DOCUMENTATION/IMPLEMENTATION_PLAN.md](DOCUMENTATION/IMPLEMENTATION_PLAN.md) | Ordered build plan with milestones                                |
| [docs/](docs/)                                                               | User-facing docs (privacy policy, hardening guide — coming in M6) |

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). Be kind — see the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

[AGPL-3.0](LICENSE). You may use, modify, and share this project under the terms of the GNU Affero General Public License v3. If you run a modified version as a network service, you must make its source available to its users.
