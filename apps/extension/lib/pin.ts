/**
 * PIN security (plan milestone M4, PRD §5.4).
 *
 *  - Salted hash via WebCrypto PBKDF2 (high iteration count) — never store the
 *    PIN in plain text (FR-4.2)
 *  - verifyPin() with constant-time comparison
 *  - Lockout after 5 failed attempts with escalating delays: 1, 5, 15 minutes
 *    (FR-4.4); persist attempt state
 *  - PIN change (requires current PIN) and the documented local reset path (FR-4.5)
 */
export {};
