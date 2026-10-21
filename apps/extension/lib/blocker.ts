/**
 * Blocker (plan milestone M3, PRD §5.3).
 *
 * declarativeNetRequest enforcement:
 *  - blockDomain(): add a dynamic rule redirecting main_frame to
 *    /blocked.html?domain=...&reason=...
 *  - unblockDomain() and syncBlockRules() to reconcile dynamic rules
 *  - stable rule IDs derived from a domain hash (no duplicates)
 *  - redirect already-open tabs within 5s of the limit being reached
 *  - daily reset at local midnight: clear rules, start a new bucket
 */
export {};
