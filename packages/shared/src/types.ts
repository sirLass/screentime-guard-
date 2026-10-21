/**
 * Core data model, as specified in PRD §7.5.
 *
 * These types are the contract between the extension (tracker, rule engine,
 * blocker, UI) and — in Phase 2 — the sync client and parent dashboard.
 * Keep them dependency-free and framework-agnostic.
 */

/** Day-of-week index in local time: 0 = Sunday … 6 = Saturday. */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Persisted extension settings (PRD §7.5, FR-4.x). */
export type Settings = {
  schemaVersion: number;
  /** Salted hash of the parent PIN. Never store the PIN itself (FR-4.2). */
  pinHash: string;
  pinSalt: string;
  /** Idle threshold in seconds before time stops counting (FR-1.3). Default 60. */
  idleThresholdSec: number;
  /** Minutes remaining at which the child gets a warning (FR-3.6). Default 5. */
  warnBeforeMin: number;
  /** Days to keep usage history (FR-6.4). Default 90. */
  retentionDays: number;
  /** Whether optional cloud sync is enabled (FR-8.8). Phase 2. */
  syncEnabled: boolean;
};

/** A parent-defined rule: track this domain, block after the daily limit (PRD §7.5, FR-2.x). */
export type Rule = {
  id: string;
  /** Registrable domain, e.g. "youtube.com". Subdomains match automatically (FR-1.1). */
  domain: string;
  categoryId?: string;
  /** Minutes per day. `null` = unlimited (track only); `0` = always blocked (FR-2.2). */
  dailyLimitMin: number | null;
  /** Per-weekday limit overrides, e.g. different limits on weekends (FR-2.1, P-3). */
  dayOverrides?: Partial<Record<DayOfWeek, number | null>>;
  /** Allowed time windows, e.g. "15:00"–"19:00". Outside these, the site is blocked (FR-2.3). */
  allowedWindows?: { start: string; end: string }[];
  /** Last-write-wins timestamp for local/sync conflict resolution (FR-2.8). */
  updatedAt: number;
};

/** A temporary grant of extra minutes from a parent, expiring at end of day (FR-2.5). */
export type TimeExtension = {
  ruleId: string;
  /** Local date key, e.g. "2026-10-21". */
  date: string;
  extraMin: number;
};

/** One day of tracked usage (PRD §7.5). Only domains and durations — never URLs or content (§6.4). */
export type UsageDay = {
  /** Local date key, e.g. "2026-10-21". */
  date: string;
  /** Seconds spent per registrable domain. */
  byDomain: Record<string, number>;
  /** Optional hour → domain → seconds buckets, for the time-of-day heatmap. */
  byHour?: Record<string, Record<string, number>>;
};

/** The in-progress tracking session, persisted so MV3 service-worker restarts lose ≤15s (FR-1.7). */
export type Session = {
  domain: string;
  /** Epoch ms when the session started. */
  startedAt: number;
  /** Epoch ms of the last accounted tick; elapsed time is computed from this. */
  lastTickAt: number;
};
