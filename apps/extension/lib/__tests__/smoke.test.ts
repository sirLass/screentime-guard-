import { describe, expect, it } from 'vitest';
import type { Rule, Settings, UsageDay } from '@screentime-guard/shared';

/**
 * Bootstrap smoke test.
 *
 * Proves the test runner works and that the `@screentime-guard/shared` package
 * resolves correctly from the extension workspace. Real coverage of the tracker,
 * rule engine, and PIN logic arrives with milestones M1–M4 (see the PRD's
 * testing strategy in §11: 80%+ on core logic).
 */
describe('bootstrap', () => {
  it('runs the test runner', () => {
    expect(1 + 1).toBe(2);
  });

  it('resolves the shared package types (PRD §7.5)', () => {
    const settings: Settings = {
      schemaVersion: 1,
      pinHash: '',
      pinSalt: '',
      idleThresholdSec: 60,
      warnBeforeMin: 5,
      retentionDays: 90,
      syncEnabled: false,
    };
    const rule: Rule = { id: 'r1', domain: 'youtube.com', dailyLimitMin: 60, updatedAt: 0 };
    const usage: UsageDay = { date: '2026-10-21', byDomain: { 'youtube.com': 120 } };

    expect(settings.idleThresholdSec).toBe(60);
    expect(rule.dailyLimitMin).toBe(60);
    expect(usage.byDomain['youtube.com']).toBe(120);
  });
});
