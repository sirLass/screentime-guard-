/**
 * Child-facing popup (PRD §5.7, FR-7.1, and plan milestone M4).
 *
 * Final version shows: current site, time used vs. limit (progress ring),
 * time left, today's total, and an "Open settings" button behind the PIN gate.
 * It must never expose settings without the PIN.
 */
export default function App() {
  return (
    <main className="w-80 space-y-3 bg-white p-4 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <h1 className="text-lg font-semibold">ScreenTime Guard</h1>
      <p className="text-sm text-slate-600 dark:text-slate-300">
        Bootstrap skeleton. The real popup — current site, time used vs. limit, and time left —
        lands in milestone M4.
      </p>
      <p className="text-xs text-slate-400">Status: Phase 0 complete, Phase 1 not started.</p>
    </main>
  );
}
