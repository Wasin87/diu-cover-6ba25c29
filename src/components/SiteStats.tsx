import { useEffect, useState } from "react";
import { countVisitOnce, getStat } from "@/lib/stats";

function format(n: number | null) {
  if (n === null) return "—";
  return n.toLocaleString();
}

export function SiteStats() {
  const [visits, setVisits] = useState<number | null>(null);
  const [generates, setGenerates] = useState<number | null>(null);

  useEffect(() => {
    (window as unknown as { __statsEffect?: boolean }).__statsEffect = true;
    (async () => {
      const [v, g] = await Promise.all([countVisitOnce(), getStat("generates")]);
      (window as unknown as { __statsVal?: unknown }).__statsVal = [v, g];
      setVisits(v);
      setGenerates(g);
    })();
  }, []);

  return (
    <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[10px] sm:text-xs font-semibold text-white">
        <span aria-hidden>👀</span> Visitors: {format(visits)}
      </span>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/25 px-3 py-1 text-[10px] sm:text-xs font-semibold text-white">
        <span aria-hidden>📄</span> Covers generated: {format(generates)}
      </span>
    </div>
  );
}
