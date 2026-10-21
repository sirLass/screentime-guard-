# Product Requirements Document (PRD)

## Project: ScreenTime Guard (working title)
**An open source, privacy-first browser extension that tracks time spent on websites and automatically blocks them when a parent-set limit is reached.**

| | |
|---|---|
| **Version** | 0.1 (Draft) |
| **Status** | Planning |
| **Author** | Brian Perez |
| **Last updated** | October 21, 2026 |
| **License (proposed)** | MIT or AGPL-3.0 (see Open Questions) |

---

## 1. Overview

### 1.1 Summary
ScreenTime Guard is a browser extension (Chrome first, then Edge and Firefox) that measures how long a child actively spends on specific websites, compares that time against limits set by a parent, and blocks the site when the allowance is used up. A companion parent dashboard lets parents view usage reports and change limits remotely.

### 1.2 Problem Statement
Parents want to limit how much time their children spend on sites like YouTube, TikTok, Facebook, or online games. Existing options have gaps:

- **DNS-level blockers** (Pi-hole, AdGuard Home) only see *requests*, not *time spent*, so they cannot enforce "1 hour per day."
- **Built-in tools** (Google Family Link, Apple Screen Time) are tied to one company's ecosystem and devices.
- **Paid apps** (Qustodio, Bark, Net Nanny) are subscription-based and store a child's browsing data on third-party servers.
- **Open source options** are scarce, mostly Linux-only (e.g., Timekpr-nExT), and not friendly to non-technical parents.

### 1.3 Proposed Solution
A browser extension that measures time **on the device** (accurate), enforces limits **locally** (works even offline), and syncs to an optional parent dashboard (convenient remote control), with a self-hostable backend for families who want full data ownership.

### 1.4 Vision
Become the go-to open source, transparent, and privacy-respecting screen-time tool for families, easy enough for a non-technical parent to set up in under 10 minutes.

---

## 2. Goals and Non-Goals

### 2.1 Goals
1. Accurately track **active** time per website (not just open tabs).
2. Let parents set **daily time limits per site** (and optionally per category).
3. Automatically **block** a site when its limit is reached and show a friendly "Time's up" page.
4. Provide **PIN-protected** settings so a child cannot change limits.
5. Provide **usage reports** (daily, weekly, monthly) for parents.
6. Support **remote management** from a parent dashboard (Phase 2).
7. Be **open source**, transparent about what data is collected, and self-hostable.
8. Work **offline-first**: limits are enforced even without internet.

### 2.2 Non-Goals (v1)
- Native mobile apps (Android/iOS) or monitoring of non-browser apps (YouTube app, TikTok app, games).
- Reading page content, messages, keystrokes, or screenshots. The product will never do this.
- AI content filtering or detection of harmful content.
- Network-level (router/DNS) blocking, although future integration with AdGuard Home/Pi-hole is possible.
- Location tracking.
- Enterprise or school-wide deployment.

### 2.3 Success Metrics

| Metric | Target (6 months after launch) |
|---|---|
| Time-tracking accuracy vs. manual stopwatch test | Within ±5% |
| Time for a parent to complete setup | Under 10 minutes |
| Limit enforcement delay after limit reached | Under 5 seconds |
| GitHub stars | 500+ |
| Active installs | 1,000+ |
| Crash/error rate of background worker | Under 1% of sessions |
| Parent satisfaction (survey, 5-point scale) | 4.0+ |

---

## 3. Target Users and Personas

### 3.1 Persona 1: The Parent (Primary)
- **Name:** Maria, 38, office worker, two children (ages 9 and 13).
- **Tech level:** Comfortable with Facebook and smartphones; not technical.
- **Needs:** Simple setup, clear reports, confidence that the child cannot easily bypass limits.
- **Pain points:** Existing apps are expensive or confusing; worries about privacy of her children's data.

### 3.2 Persona 2: The Child (Secondary)
- **Name:** Miguel, 13, uses a family laptop for school and entertainment.
- **Needs:** Clear understanding of how much time is left; no surprise cutoffs.
- **Behavior:** May try to bypass limits (new profile, other browser, incognito, disabling the extension).

### 3.3 Persona 3: The Self-Hoster / Contributor (Tertiary)
- **Name:** Alex, 30, developer and privacy advocate.
- **Needs:** Self-hostable backend, clear documentation, hackable codebase.

---

## 4. User Stories

### 4.1 Parent
| ID | Story | Priority |
|---|---|---|
| P-1 | As a parent, I want to set a PIN so my child cannot change settings. | Must |
| P-2 | As a parent, I want to add a website and set a daily time limit for it. | Must |
| P-3 | As a parent, I want different limits for weekdays and weekends. | Should |
| P-4 | As a parent, I want to set "allowed hours" (e.g., no social media after 9 PM). | Should |
| P-5 | As a parent, I want to block a website completely (limit = 0). | Must |
| P-6 | As a parent, I want to see how much time my child spent on each site today and this week. | Must |
| P-7 | As a parent, I want to grant extra time (e.g., +15 minutes) when needed. | Should |
| P-8 | As a parent, I want to manage limits from my own phone when away from home. | Should (Phase 2) |
| P-9 | As a parent, I want alerts when a limit is reached or the extension is disabled or removed. | Should (Phase 2) |
| P-10 | As a parent, I want to group sites into categories (Social, Video, Games) with a shared limit. | Could |
| P-11 | As a parent, I want to manage multiple children, each with their own profile and limits. | Should (Phase 2) |
| P-12 | As a parent, I want to export or delete all my child's data at any time. | Must |

### 4.2 Child
| ID | Story | Priority |
|---|---|---|
| C-1 | As a child, I want to see how much time I have left on a site. | Should |
| C-2 | As a child, I want a warning before time runs out (e.g., at 5 minutes left). | Should |
| C-3 | As a child, I want to request more time from my parent from the "Time's up" page. | Could (Phase 2) |

### 4.3 Self-Hoster
| ID | Story | Priority |
|---|---|---|
| S-1 | As a self-hoster, I want to run the backend with Docker in one command. | Could (Phase 3) |

---

## 5. Functional Requirements

### 5.1 Time Tracking Engine (Phase 1)

| ID | Requirement |
|---|---|
| FR-1.1 | The extension SHALL track time per **domain** (e.g., `youtube.com`), including subdomains (e.g., `m.youtube.com`) unless configured otherwise. |
| FR-1.2 | Time SHALL be counted only when **all** of the following are true: the tab is in the active tab of its window, the browser window is focused, and the user is not idle. |
| FR-1.3 | The idle threshold SHALL default to 60 seconds and be configurable (using the `chrome.idle` API). |
| FR-1.4 | Media exception: if audio or video is playing in the tab (`tab.audible`), time SHALL continue counting even without keyboard/mouse activity, so passive video watching is measured. |
| FR-1.5 | The engine SHALL handle multiple windows and tab switches without double-counting. |
| FR-1.6 | Usage SHALL be stored in daily buckets keyed by `date` and `domain`, in seconds. |
| FR-1.7 | The engine SHALL persist state at regular intervals (every 10 to 15 seconds) so that service-worker shutdowns, browser crashes, or restarts lose no more than that interval of data. |
| FR-1.8 | Day boundaries SHALL follow the device's local time zone and reset at midnight (configurable reset time as a future option). |
| FR-1.9 | Incognito/private browsing activity SHALL be tracked when the extension is allowed in incognito (see 5.5). |

**Implementation note:** Manifest V3 background scripts are service workers that can be suspended. The tracker must not rely on in-memory timers alone. Use `chrome.alarms` (minimum period is 30 seconds in released Chrome versions) combined with event-driven timestamps (`tabs.onActivated`, `tabs.onUpdated`, `windows.onFocusChanged`, `idle.onStateChanged`) and compute elapsed time from stored timestamps.

### 5.2 Limits and Rules

| ID | Requirement |
|---|---|
| FR-2.1 | A parent SHALL be able to create a **rule** consisting of: domain (or category), daily limit in minutes, and optional day-of-week overrides. |
| FR-2.2 | A rule SHALL support a limit of `0` (always blocked) and `unlimited` (track only). |
| FR-2.3 | A rule MAY include **allowed time windows** (e.g., 15:00 to 19:00) outside of which the site is blocked. |
| FR-2.4 | The engine SHALL compare usage against limits after every update and trigger blocking as soon as the limit is reached. |
| FR-2.5 | A parent SHALL be able to grant a **time extension** (e.g., +15 min for today), which expires at the end of the day. |
| FR-2.6 | A global **"all sites" daily limit** MAY be configured (total browsing time). |
| FR-2.7 | Rules SHALL be validated (valid domain format, limit between 0 and 1440 minutes). |
| FR-2.8 | Rules SHALL be stored locally and work offline. When synced, the most recent change wins (with a version timestamp). |

### 5.3 Blocking and Enforcement

| ID | Requirement |
|---|---|
| FR-3.1 | When a limit is reached, the extension SHALL block the site using `declarativeNetRequest` **dynamic rules**, redirecting main-frame navigation to the extension's "Time's up" page. |
| FR-3.2 | Already-open tabs on the blocked site SHALL be redirected or reloaded to the "Time's up" page within 5 seconds of the limit being reached. |
| FR-3.3 | Blocking SHALL be removed automatically at the next daily reset (or when a parent grants an extension). |
| FR-3.4 | Blocking rules SHALL be re-evaluated on browser startup and extension update. |
| FR-3.5 | The "Time's up" page SHALL show: the blocked domain, the limit that was reached, when access resets, and (Phase 2) a "Request more time" button. |
| FR-3.6 | The extension SHALL show a **warning** (in-page toast or notification) when 5 minutes (configurable) remain on a limited site. |
| FR-3.7 | A **parent override** SHALL be available on the "Time's up" page: entering the correct PIN grants temporary access (e.g., 15 minutes) for that site. |

### 5.4 Parent Settings and PIN Protection

| ID | Requirement |
|---|---|
| FR-4.1 | On first run, a setup wizard SHALL ask the parent to create a PIN (minimum 4 digits, recommended 6). |
| FR-4.2 | The PIN SHALL be stored only as a salted hash (e.g., PBKDF2 or Argon2 via WebCrypto/WASM), never in plain text. |
| FR-4.3 | Access to the settings page SHALL require the PIN. |
| FR-4.4 | After 5 incorrect PIN attempts, the settings page SHALL lock for an increasing delay (e.g., 1, 5, 15 minutes). |
| FR-4.5 | A PIN recovery flow SHALL exist: via the parent account (Phase 2) or by a documented local reset method that clears all data (with clear warning). |
| FR-4.6 | The settings page SHALL include: rules management, usage reports, PIN change, idle threshold, warning time, data export/delete. |

### 5.5 Tamper Resistance

A child may try to bypass the tool. The product SHALL document its limits honestly and include these mitigations:

| ID | Requirement |
|---|---|
| FR-5.1 | Documentation SHALL describe how to **force-install** and lock the extension using Chrome managed policies (`ExtensionInstallForcelist`) so it cannot be removed without admin rights. |
| FR-5.2 | Documentation SHALL describe how to **disable incognito mode** (`IncognitoModeAvailability` policy) or how to set the extension to run in incognito. |
| FR-5.3 | Documentation SHALL describe how to restrict **other browsers** (e.g., via OS-level parental controls) and **other Chrome profiles** (e.g., restrict profile creation/guest mode via policy). |
| FR-5.4 | The extension SHALL detect and log **clock changes** (a sudden jump in system time) and avoid resetting limits because of them. |
| FR-5.5 | When synced (Phase 2), the backend SHALL record a **heartbeat**; if no heartbeat is received for a configurable period, the parent SHALL be notified ("extension may be disabled or removed"). |
| FR-5.6 | Settings, rules, and usage data SHALL not be exposed to web pages (no content-script access to extension storage). |

### 5.6 Usage Reports

| ID | Requirement |
|---|---|
| FR-6.1 | The settings page SHALL show **today's usage** per site with progress bars against limits. |
| FR-6.2 | Reports SHALL be available for **daily, weekly, and monthly** ranges, with bar and line charts (Recharts or a lightweight alternative). |
| FR-6.3 | Reports SHALL include: total time, top sites, time-of-day heatmap, and number of times a limit was hit. |
| FR-6.4 | Usage history SHALL be retained locally for 90 days by default (configurable). |
| FR-6.5 | Data SHALL be exportable as **CSV and JSON**. |

### 5.7 Child-Facing Experience

| ID | Requirement |
|---|---|
| FR-7.1 | The extension popup SHALL show the child's remaining time for the current site and today's total, with no access to settings without the PIN. |
| FR-7.2 | The extension badge MAY display the minutes remaining for the current site. |
| FR-7.3 | The "Time's up" page SHALL use friendly, non-punitive language and suggest alternatives (e.g., "Time for a break!"). |

### 5.8 Cloud Sync and Parent Dashboard (Phase 2)

| ID | Requirement |
|---|---|
| FR-8.1 | A parent SHALL be able to create an account (email + password or OAuth) and link one or more child devices/profiles using a **pairing code** or QR code. |
| FR-8.2 | The extension SHALL sync usage summaries (per domain, per day, plus optional per-hour buckets) to the backend at an interval (default every 5 minutes) when online. |
| FR-8.3 | The extension SHALL pull rule and extension changes from the backend in near real time (WebSocket/real-time subscription) with a polling fallback. |
| FR-8.4 | The dashboard SHALL allow parents to: view live and historical usage, add, edit, or delete rules, grant extra time, and approve or deny time requests. |
| FR-8.5 | The dashboard SHALL support **multiple children**, each with their own devices and rules. |
| FR-8.6 | Parents SHALL receive **notifications** (email and/or web push) for: limit reached, time request, extension offline, and weekly summary. |
| FR-8.7 | The dashboard SHALL be responsive and usable on a phone. |
| FR-8.8 | Sync SHALL be **optional**; the extension must remain fully functional in local-only mode. |

### 5.9 Optional Integrations (Phase 3)

| ID | Requirement |
|---|---|
| FR-9.1 | Optional integration with **AdGuard Home / Pi-hole APIs** to block a domain network-wide when a limit is reached (covers other devices on the home network). |
| FR-9.2 | **Docker Compose** setup to self-host the backend and dashboard. |
| FR-9.3 | Support for **Firefox and Edge** builds from the same codebase. |
| FR-9.4 | **Category lists** (Social, Video, Games, Adult) maintained as open data files. |

---

## 6. Non-Functional Requirements

### 6.1 Performance
- Background tracking SHALL use negligible CPU (target under 1% average) and under 50 MB memory.
- Blocking SHALL not noticeably slow down page loads (rely on `declarativeNetRequest`, which is evaluated by the browser engine).
- Settings page initial load under 1 second on a typical laptop.

### 6.2 Reliability
- Tracking state SHALL survive service-worker restarts, browser restarts, and crashes (max loss of 15 seconds).
- All storage operations SHALL be wrapped in error handling with safe fallbacks.
- Schema migrations SHALL be versioned so updates do not wipe user data.

### 6.3 Security
- No remote code execution; all code is bundled (Manifest V3 requirement).
- Minimal permissions (see 7.3). Request the least privilege required.
- PIN stored as a salted hash; sync tokens stored in `chrome.storage.local`, not exposed to content scripts.
- Backend: row-level security so parents can only access their own children's data; HTTPS only; rate limiting on auth and pairing endpoints.
- Dependencies reviewed; lockfile committed; automated dependency scanning (Dependabot).

### 6.4 Privacy and Compliance
- **Data minimization:** store only domain names and durations, never full URLs, page titles, or content (configurable option for path-level tracking is out of scope for v1).
- **Transparency:** a plain-language Privacy Policy and in-extension disclosure of exactly what is collected.
- **Local-first:** all data remains on the device unless the parent explicitly enables sync.
- **Parental consent and rights:** parent can export and permanently delete all data at any time.
- **Regulations to review before cloud launch:** Philippine Data Privacy Act of 2012 (RA 10173), and, if distributed internationally, COPPA (US), GDPR/GDPR-K (EU/UK). Obtain legal review before launching hosted sync.
- **Chrome Web Store policies:** a single, clearly described purpose; limited-use disclosure for user data; accurate permission justifications.
- **Ethical stance:** the tool is meant for transparent parental guidance; docs should encourage telling children about the monitoring and discussing limits together. No covert-spyware features.

### 6.5 Usability and Accessibility
- Setup wizard with at most 5 steps.
- Plain, jargon-free language; English first, with i18n structure ready for Filipino (Tagalog) and other languages.
- WCAG 2.1 AA: keyboard navigation, sufficient contrast, screen-reader labels.
- Light and dark mode.

### 6.6 Compatibility
- Chrome (latest 2 major versions) on Windows, macOS, Linux, ChromeOS (Phase 1).
- Edge (Chromium) (Phase 1/2); Firefox (Phase 3, subject to API differences).
- Chrome on Android does not support extensions; mobile is out of scope for v1.

### 6.7 Maintainability
- TypeScript strict mode, ESLint, Prettier.
- Unit test coverage of 80%+ for core tracking and rule logic.
- Clear contribution guide, code of conduct, issue templates.

---

## 7. Technical Design

### 7.1 Recommended Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Extension framework | **WXT** (Manifest V3) + TypeScript | Multi-browser builds, hot reload, modern DX |
| Extension UI | **React** + Tailwind CSS | Existing skill set; fast to build popup/options/blocked pages |
| Local storage | `chrome.storage.local` (settings, rules, daily totals); optional IndexedDB for longer history | Persistent, available to service worker |
| Charts | Recharts (options page) | Already familiar from Taku |
| Backend (Phase 2) | **Convex** or **Supabase** | Both known; Convex for real-time, Supabase for SQL + auth + RLS |
| Parent dashboard | **Next.js** + Tailwind + Recharts | Reuse of existing experience |
| Auth | Supabase Auth / Convex Auth / Clerk | Parent accounts |
| Notifications | Resend (email), Web Push | Parent alerts |
| Testing | Vitest (unit), Playwright (E2E with extension loaded) | Reliable automation |
| CI/CD | GitHub Actions; Vercel (dashboard) | Free and straightforward |
| Self-hosting (Phase 3) | Docker Compose | Existing skill |

### 7.2 System Architecture

```
┌──────────────────────────── Child's Browser ────────────────────────────┐
│                                                                         │
│  ┌──────────────────┐   messages   ┌───────────────────────────────┐    │
│  │ Popup / Options  │◄────────────►│  Background Service Worker    │    │
│  │ (React UI)       │              │  - Tracker (tabs/idle/alarms) │    │
│  └──────────────────┘              │  - Rule Engine                │    │
│  ┌──────────────────┐              │  - Blocker (DNR dynamic rules)│    │
│  │ "Time's up" page │◄────────────►│  - Sync Client (Phase 2)      │    │
│  └──────────────────┘              └──────────────┬────────────────┘    │
│  ┌──────────────────┐                             │                     │
│  │ Content script   │  (warning toast only)       │ chrome.storage      │
│  └──────────────────┘                             ▼                     │
│                                         [ Local data: rules, usage ]    │
└─────────────────────────────────────────────┬───────────────────────────┘
                                              │ HTTPS / WebSocket (optional)
                                              ▼
                              ┌──────────────────────────────┐
                              │ Backend (Convex / Supabase)  │
                              │ Auth • Usage • Rules • Alerts│
                              └──────────────┬───────────────┘
                                             │
                                             ▼
                              ┌──────────────────────────────┐
                              │ Parent Dashboard (Next.js)   │
                              │ Reports • Remote limits      │
                              └──────────────────────────────┘
```

### 7.3 Extension Permissions

| Permission | Purpose |
|---|---|
| `tabs` | Read the active tab's URL/domain and audible state |
| `idle` | Detect user inactivity |
| `alarms` | Periodic saves and checks that survive service-worker suspension |
| `storage` | Persist rules and usage |
| `declarativeNetRequest` | Redirect blocked domains to the "Time's up" page |
| `notifications` (optional) | Warnings when time is almost up |
| Host permissions (`<all_urls>` or user-granted per site) | Needed for redirect rules and the warning toast; evaluate optional host permissions to minimize scope and ease Web Store review |

### 7.4 Core Algorithm (Time Tracking)

1. Maintain a `currentSession` record in storage: `{ domain, startedAt, lastTickAt }`.
2. On any of these events, **close and re-evaluate** the session: tab activated, tab URL changed, window focus changed, idle state changed, alarm fired, browser startup.
3. Closing a session: `elapsed = min(now - lastTickAt, MAX_TICK)` added to `usage[date][domain]`. The cap (e.g., 90 seconds) prevents counting time while the computer was asleep.
4. A new session starts only if: the window is focused, the tab is active, a valid (non-extension, non-blank) domain exists, and the state is `active` (or media is playing).
5. After each update, run the **Rule Engine**: for the domain (and its categories and the global rule), compute `remaining = limit + extensions - used`. If `remaining <= 0` or outside the allowed window, call the **Blocker**.
6. The **Blocker** adds a dynamic DNR rule (`redirect` to `/blocked.html?domain=...`) and redirects any open tabs on that domain.
7. A daily alarm at local midnight clears dynamic block rules and starts a new daily bucket; startup also checks if the date changed.

### 7.5 Data Model

**Local (`chrome.storage.local`)**

```ts
type Settings = {
  schemaVersion: number;
  pinHash: string;           // salted hash
  pinSalt: string;
  idleThresholdSec: number;  // default 60
  warnBeforeMin: number;     // default 5
  retentionDays: number;     // default 90
  syncEnabled: boolean;
};

type Rule = {
  id: string;
  domain: string;            // "youtube.com"
  categoryId?: string;
  dailyLimitMin: number | null;   // null = unlimited (track only)
  dayOverrides?: Partial<Record<0|1|2|3|4|5|6, number | null>>;
  allowedWindows?: { start: string; end: string }[]; // "15:00"-"19:00"
  updatedAt: number;
};

type Extension = { ruleId: string; date: string; extraMin: number };

type UsageDay = {
  date: string;              // "2026-10-21"
  byDomain: Record<string, number>;       // seconds
  byHour?: Record<string, Record<string, number>>; // hour -> domain -> seconds
};
```

**Backend (Phase 2), relational view**

| Table | Key fields |
|---|---|
| `parents` | id, email, created_at |
| `children` | id, parent_id, display_name, birth_year (optional) |
| `devices` | id, child_id, label, pairing_status, last_heartbeat_at, extension_version |
| `rules` | id, child_id, domain, daily_limit_min, day_overrides, allowed_windows, version, updated_at |
| `extensions_granted` | id, rule_id, date, extra_min, granted_by |
| `usage_daily` | id, device_id, date, domain, seconds, (unique: device_id + date + domain) |
| `time_requests` | id, child_id, domain, requested_min, status, created_at, resolved_at |
| `alerts` | id, parent_id, type, payload, created_at, read_at |

Security: row-level security (Supabase) or equivalent Convex auth checks, so every query is scoped to the authenticated parent's children.

### 7.6 Sync Protocol (Phase 2)

1. **Pairing:** the parent generates a short-lived (10 min) pairing code in the dashboard; the extension submits it and receives a device token.
2. **Upload:** extension sends usage deltas (idempotent, keyed by device + date + domain) every 5 minutes and on limit events.
3. **Download:** extension subscribes to rule changes; changes are applied immediately and re-evaluated.
4. **Conflict resolution:** last-write-wins by `updatedAt`; the backend is the source of truth for rules when online.
5. **Offline:** the extension queues uploads and keeps enforcing the last known rules.
6. **Heartbeat:** a lightweight ping every 5 minutes updates `last_heartbeat_at`.

### 7.7 Proposed Repository Structure

```
screentime-guard/
├── apps/
│   ├── extension/            # WXT project
│   │   ├── entrypoints/
│   │   │   ├── background.ts
│   │   │   ├── popup/
│   │   │   ├── options/
│   │   │   ├── blocked/      # "Time's up" page
│   │   │   └── content.ts    # warning toast
│   │   ├── lib/
│   │   │   ├── tracker.ts
│   │   │   ├── rules.ts
│   │   │   ├── blocker.ts
│   │   │   ├── storage.ts
│   │   │   ├── pin.ts
│   │   │   └── sync.ts
│   │   └── wxt.config.ts
│   └── dashboard/            # Next.js parent dashboard (Phase 2)
├── packages/
│   └── shared/               # shared types, validation, category lists
├── backend/                  # Convex or Supabase schema + functions
├── docs/                     # setup, force-install guides, privacy policy
├── docker-compose.yml        # Phase 3
├── .github/workflows/
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

---

## 8. User Flows

### 8.1 First-Time Setup (Parent)
1. Install the extension from the Web Store or a developer build.
2. Welcome screen explains what is tracked and what is not.
3. Create a PIN.
4. Choose a starter template ("Study mode," "Balanced," "Strict," or "Custom") or add sites manually.
5. Review the summary and finish. Optional: view the "Make it harder to remove" guide (force-install and incognito).

### 8.2 Setting a Limit
Options page → enter PIN → "Add site" → type domain or pick a popular site → set daily minutes (and optional day overrides or time window) → Save. The rule is active immediately.

### 8.3 Child Hits a Limit
Child browses YouTube → 5-minute warning toast → limit reached → tab redirects to "Time's up" page showing the reset time → child may wait, do something else, or (Phase 2) request more time.

### 8.4 Parent Grants More Time
Locally: on "Time's up" page, enter PIN → choose +15 min → site unblocks.
Remotely (Phase 2): parent gets a notification → opens dashboard → approves → extension receives update in seconds.

### 8.5 Reviewing Reports
Parent opens options page (PIN) or dashboard → sees today's usage, weekly trend, top sites, and time-of-day pattern.

---

## 9. UI Requirements (Screens)

| Screen | Key elements |
|---|---|
| **Popup** | Current site, time used vs. limit (progress ring), today's total, "Open settings" |
| **Options: Dashboard** | Today's usage bars, alerts, quick actions |
| **Options: Rules** | Table of rules, add/edit modal, day overrides, time windows |
| **Options: Reports** | Date range picker, charts, CSV/JSON export |
| **Options: Security** | Change PIN, idle threshold, retention, sync toggle, delete data |
| **Time's up page** | Friendly message, reset time, PIN override, (Phase 2) request more time |
| **Setup wizard** | 5 steps described in 8.1 |
| **Parent dashboard (Phase 2)** | Child switcher, live usage, rules, requests inbox, devices and heartbeat status |

Design principles: calm, non-punitive tone; large readable text; minimal clicks to common actions.

---

## 10. Release Plan and Milestones

### Phase 1: MVP (Local-only), target 6 to 8 weeks
| Milestone | Deliverables |
|---|---|
| M1: Foundation (Week 1) | WXT project, CI, linting, storage layer, schema versioning |
| M2: Tracker (Weeks 2-3) | Active-time tracking with idle and media handling; unit tests; manual accuracy test |
| M3: Rules and Blocking (Weeks 3-4) | Rule engine, DNR blocking, "Time's up" page, midnight reset |
| M4: Settings and PIN (Weeks 5-6) | Setup wizard, PIN, rules UI, popup, warnings |
| M5: Reports and Polish (Weeks 6-7) | Charts, export, accessibility pass, documentation |
| M6: Release (Week 8) | GitHub release, README, demo video, Chrome Web Store submission |

### Phase 2: Sync and Parent Dashboard, target 6 to 8 weeks
Backend and auth, pairing, usage sync, remote rules, dashboard, notifications, time requests, heartbeat alerts.

### Phase 3: Expansion
Firefox/Edge builds, AdGuard Home/Pi-hole integration, Docker self-hosting, categories, i18n (Filipino), community contributions.

### Phase 4 (Future Ideas)
Companion Android app, usage anomaly alerts, forecasting ("limit will be reached by 4 PM at this pace"), reward-based time system.

---

## 11. Testing Strategy

| Type | Scope |
|---|---|
| Unit tests (Vitest) | Time accumulation, day rollover, rule evaluation, PIN hashing, domain matching, schema migrations |
| Integration tests | Service worker event sequences (tab switch, idle, window blur, sleep/wake) using mocked Chrome APIs |
| E2E tests (Playwright) | Load unpacked extension, visit test sites, verify tracking, blocking, redirect, and PIN override |
| Accuracy test | Stopwatch comparison across scenarios (single tab, multi-tab, video watching, idle) |
| Tamper tests | Disable extension, incognito, new profile, change system clock, clear storage; document results |
| Security review | Permission audit, dependency audit, backend access-control tests |
| Usability test | 5 non-technical parents complete setup and set a limit without help |

---

## 12. Risks and Mitigations

| Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|
| Child removes/disables extension | High | High | Force-install policy guide, heartbeat alerts, honest docs about limits |
| Child uses another browser/profile/incognito | High | High | Policy guidance, OS parental controls; consider future companion apps |
| MV3 service worker suspension causes lost time | Medium | Medium | Timestamp-based accounting, frequent persistence, alarms |
| Inaccurate tracking (e.g., background video, multiple windows) | Medium | Medium | Audible-tab handling, extensive tests, tunable thresholds |
| Chrome Web Store rejection (broad host permissions) | Medium | Medium | Clear single purpose, permission justifications, optional host permissions |
| Privacy/legal concerns around children's data | High | Low-Medium | Local-first design, minimal data, transparent policy, legal review before hosted launch |
| Misuse as covert surveillance | Medium | Low | Visible extension indicator, docs encouraging transparency, no content capture |
| Scope creep stalls the project | High | Medium | Strict phases; ship the local MVP before building the backend |
| Browser API changes | Medium | Low | Abstraction layer in WXT, CI against Chrome beta |

---

## 13. Dependencies and Assumptions

**Assumptions**
- The child uses a desktop/laptop Chromium-based browser as the primary device for the targeted sites.
- The parent has enough access to the device to install the extension and (optionally) configure managed policies.
- Domain-level tracking is sufficient for v1 (no per-page or per-video tracking).

**Dependencies**
- Chrome Extension APIs (Manifest V3): `tabs`, `idle`, `alarms`, `storage`, `declarativeNetRequest`.
- Third-party services for Phase 2: Convex or Supabase, Vercel, an email provider.

---

## 14. Open Questions

1. **License:** MIT (maximum adoption) vs. AGPL-3.0 (prevents closed-source hosted forks)?
2. **Final project name** and branding (check trademark and Web Store availability).
3. **Distribution:** Chrome Web Store, GitHub-only developer builds, or both for v1?
4. **Convex vs. Supabase** for the backend: real-time convenience vs. SQL/RLS and easier self-hosting.
5. **Tracking granularity:** domain only, or optional path-level (e.g., allow `youtube.com/edu`)? What are the privacy trade-offs?
6. **Shared computer handling:** how to support a family computer with multiple children (per-profile vs. per-login-account) without confusion?
7. **Category lists:** build and maintain our own, or reuse an existing open list (e.g., blocklist projects)?
8. **Monetization (if any):** donations or sponsorship only, or an optional paid hosted sync service while keeping self-hosting free?
9. **Child transparency:** should the extension always show a visible indicator and a "what's being tracked" page to the child? (Recommended: yes.)

---

## 15. Appendix

### 15.1 Glossary
- **DNR:** `declarativeNetRequest`, Chrome's API for blocking/redirecting requests with rules.
- **MV3:** Manifest V3, the current Chrome extension platform using service workers.
- **Service worker:** the background script of an MV3 extension, which the browser can suspend when idle.
- **Heartbeat:** a periodic signal showing the extension is alive and running.
- **Force-install:** an enterprise/managed-policy method of installing an extension so the user cannot remove it.

### 15.2 Competitive Landscape

| Product | Strengths | Weaknesses vs. this project |
|---|---|---|
| Google Family Link | Free, deep Android/Chromebook integration | Tied to Google ecosystem; limited per-site time control on desktop |
| Apple Screen Time | Free, built into Apple devices | Apple-only; closed system |
| Qustodio / Bark / Net Nanny | Rich features, multi-platform | Paid; child data stored on third-party servers |
| NextDNS (Recreation time) | Network-wide, no install on device | Estimates time from DNS activity; easy to bypass on mobile data |
| Pi-hole / AdGuard Home | Powerful, open source | No time-spent tracking; technical to set up |
| Timekpr-nExT | Open source | Linux only, computer-time limits rather than per-site |

**Differentiators:** open source, per-site active-time tracking, offline-first enforcement, privacy-first with optional self-hosting, friendly setup for non-technical parents.

### 15.3 Reference Links to Review Before Building
- Chrome Extensions documentation: `chrome.tabs`, `chrome.idle`, `chrome.alarms`, `chrome.declarativeNetRequest`
- Chrome Web Store program policies and the Limited Use requirements
- WXT documentation (wxt.dev)
- Chrome Enterprise policies: `ExtensionInstallForcelist`, `IncognitoModeAvailability`
- Philippine Data Privacy Act of 2012 (RA 10173) and National Privacy Commission guidance