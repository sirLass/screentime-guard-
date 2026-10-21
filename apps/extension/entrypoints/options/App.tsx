/**
 * Parent settings page (PRD §5.4, §9; plan milestone M4).
 *
 * Final version is PIN-gated and includes:
 *  - Dashboard: today's usage with progress bars vs. limits (FR-6.1)
 *  - Rules: list, add, edit, delete; day overrides and allowed windows (FR-2.x)
 *  - Reports: daily/weekly/monthly charts with CSV/JSON export (FR-6.2, FR-6.5)
 *  - Security: change PIN, idle threshold, warning time, retention, delete data (FR-4.6)
 *  - Setup wizard on first run (FR-4.1, section 8.1)
 */
const plannedSections = [
  { name: 'Dashboard', detail: "Today's usage, alerts, quick actions" },
  { name: 'Rules', detail: 'Per-site limits, day overrides, allowed hours' },
  { name: 'Reports', detail: 'Daily / weekly / monthly charts, export' },
  { name: 'Security', detail: 'PIN, idle threshold, retention, danger zone' },
] as const;

export default function App() {
  return (
    <main className="min-h-screen bg-white p-8 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold">ScreenTime Guard — Settings</h1>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Bootstrap skeleton. The PIN gate and these sections land in milestone M4.
          </p>
        </header>
        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-700 dark:border-slate-700">
          {plannedSections.map((section) => (
            <li key={section.name} className="flex items-baseline justify-between gap-4 p-4">
              <span className="font-medium">{section.name}</span>
              <span className="text-right text-sm text-slate-500 dark:text-slate-400">
                {section.detail}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
