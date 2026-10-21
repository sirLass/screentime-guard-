/**
 * "Time's up" page (PRD §5.3, §7.3, FR-3.5, FR-7.3; plan milestone M3).
 *
 * Requirements for the final version:
 *  - Show the blocked domain, the limit that was reached, and when access resets
 *  - Friendly, non-punitive language — this page is shown to children (FR-7.3)
 *  - PIN override form granting temporary access (FR-3.7)
 *  - Escape/sanitize the `domain` query parameter (avoid injection and open redirects)
 */
export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-50 p-8 text-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="max-w-md space-y-4 text-center">
        <h1 className="text-3xl font-semibold">Time for a break!</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          You've reached today's limit for this site. Why not do something else for a while?
        </p>
        <p className="text-sm text-slate-400">
          (Bootstrap skeleton — blocking logic, the reset time, and the parent override land in
          milestone M3.)
        </p>
      </div>
    </main>
  );
}
