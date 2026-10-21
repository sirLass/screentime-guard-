/**
 * Rule engine (plan milestone M3, PRD §5.2).
 *
 * Implements `evaluate(domain, usage, rules, extensions, now)` returning
 * `{ allowed, remainingSec, reason }`:
 *  - limit types: minutes, `0` (always blocked), `null` (track only)
 *  - day-of-week overrides, allowed time windows (incl. crossing midnight)
 *  - global "all sites" daily limit, temporary time extensions
 *
 * Runs after every usage update and on rule changes.
 */
export {};
