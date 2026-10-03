import type { ArchLayer } from "@/content/types";

/**
 * Conceptual architecture, drawn as stacked layers rather than copied from any
 * internal document. Each layer names a responsibility; the chips name the
 * capabilities inside it. Deliberately whiteboard-level.
 */
export default function ArchitectureDiagram({
  layers,
  caption,
}: {
  layers: ArchLayer[];
  caption: string;
}) {
  return (
    <figure className="mt-10">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/45 p-5 sm:p-8">
        <div
          aria-hidden="true"
          className="aura top-[-30%] left-1/2 size-96 -translate-x-1/2 bg-signal/8"
        />

        <div className="relative space-y-0">
          {layers.map((layer, i) => {
            const last = i === layers.length - 1;
            return (
              <div key={layer.name}>
                <div className="group relative grid gap-3 rounded-xl border border-line-2/70 bg-surface-2/50 p-4 transition-colors duration-500 hover:border-signal/25 sm:grid-cols-[11rem_1fr] sm:items-center sm:gap-6 sm:p-5">
                  <div className="flex items-center gap-2.5">
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-signal/55 transition-colors duration-500 group-hover:bg-signal"
                    />
                    <span className="mono-label text-ink-2">{layer.name}</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {layer.nodes.map((node) => (
                      <span
                        key={node}
                        className="rounded-lg border border-line-2 bg-void/55 px-2.5 py-1.5 font-mono text-[11px] leading-none tracking-[0.01em] text-ink-2"
                      >
                        {node}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Flow connector between layers */}
                {!last && (
                  <div
                    aria-hidden="true"
                    className="relative mx-auto flex h-7 w-px justify-center bg-gradient-to-b from-line-2 via-signal/35 to-line-2"
                  >
                    <span className="animate-node absolute top-1/2 size-1 -translate-y-1/2 rounded-full bg-signal" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <figcaption className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-3">
        {caption}
      </figcaption>
    </figure>
  );
}
