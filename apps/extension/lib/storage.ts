/**
 * Storage layer (plan milestone M1, PRD §6.2, §7.5).
 *
 * Typed wrapper over `chrome.storage.local`:
 *  - get/set/update with defaults for Settings, Rule, TimeExtension, UsageDay
 *  - schema versioning and a migration runner (updates must not wipe data)
 *  - atomic updates to avoid races between popup/options and the service worker
 *  - a change-listener utility so the UI reacts to updates
 *
 * All operations wrapped in error handling with safe fallbacks.
 */
export {};
