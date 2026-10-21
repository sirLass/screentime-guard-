/**
 * Time tracker (plan milestone M2, PRD §5.1).
 *
 * Implements the core algorithm from PRD §7.4:
 *  - Maintain a persisted `Session` (domain, startedAt, lastTickAt)
 *  - Re-evaluate on tabs.onActivated, tabs.onUpdated, tabs.onRemoved,
 *    windows.onFocusChanged, idle.onStateChanged, alarms, and browser startup
 *  - closeSession(): elapsed = min(now - lastTickAt, MAX_TICK) added to
 *    usage[date][domain] — the cap prevents counting computer-sleep time
 *  - Start a session only when: window focused, tab active, valid trackable
 *    domain, user active (or the tab is audible — FR-1.4)
 *
 * Do not rely on in-memory timers: MV3 service workers get suspended.
 */
export {};
