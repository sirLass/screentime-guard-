/**
 * MV3 background service worker.
 *
 * `defineBackground` is auto-imported by WXT — do not import it explicitly.
 *
 * This is the heart of the extension. Phase 1 plugs in here:
 *  - M2: the time tracker — event-driven sessions (tabs/idle/alarms) with
 *    timestamp-based accounting that survives service-worker suspension (PRD §5.1)
 *  - M3: the rule engine and the declarativeNetRequest blocker (PRD §5.2, §5.3)
 *
 * Note the PRD's implementation warning: never rely on in-memory timers alone.
 * Read session state from storage at the start of every handler and compute
 * elapsed time from stored timestamps.
 */
export default defineBackground(() => {
  console.info('[ScreenTime Guard] background service worker started');
});
