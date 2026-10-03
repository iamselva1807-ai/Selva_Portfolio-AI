/**
 * Route-level skeleton. Mirrors the shared page rhythm — a PageHeader
 * (label, display title, lede) followed by two panels on the hairline grid —
 * so the layout does not jump when the real content lands. The pulse is
 * neutralized for reduced-motion users by the global reset in globals.css.
 */

function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse bg-surface-2 ${className}`} />;
}

export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="shell pt-32 pb-24 sm:pt-40">
      <span className="sr-only">Loading page</span>

      <div aria-hidden="true">
        {/* Section label */}
        <div className="flex items-center gap-3">
          <span className="h-px w-6 bg-line-bright" />
          <Bar className="h-2.5 w-28 rounded-sm" />
        </div>

        {/* Display title */}
        <div className="mt-7 space-y-3">
          <Bar className="h-10 w-full max-w-2xl rounded-md sm:h-16" />
          <Bar className="h-10 w-4/5 max-w-lg rounded-md sm:h-16" />
        </div>

        {/* Lede */}
        <div className="mt-8 space-y-2.5">
          <Bar className="h-3.5 w-full max-w-xl rounded-sm" />
          <Bar className="h-3.5 w-full max-w-md rounded-sm" />
        </div>

        <div className="rule-fade mt-12" />

        {/* Two panels */}
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {[0, 1].map((i) => (
            <div key={i} className="bg-surface/90 p-6 sm:p-8">
              <Bar className="h-2.5 w-20 rounded-sm" />
              <div className="mt-6 space-y-2.5">
                <Bar className="h-3 w-full rounded-sm" />
                <Bar className="h-3 w-11/12 rounded-sm" />
                <Bar className="h-3 w-3/4 rounded-sm" />
              </div>
              <div className="mt-8 flex flex-wrap gap-1.5">
                <Bar className="h-6 w-20 rounded-full" />
                <Bar className="h-6 w-16 rounded-full" />
                <Bar className="h-6 w-24 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
