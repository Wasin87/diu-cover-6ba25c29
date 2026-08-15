const BASE = "https://abacus.jasoncameron.dev";
const NS = "diu-cover-lovable";

export type StatKey = "visits" | "generates";

async function call(path: string): Promise<number | null> {
  try {
    const res = await fetch(`${BASE}/${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = (await res.json()) as { value?: number };
    return typeof json.value === "number" ? json.value : null;
  } catch {
    return null;
  }
}

export function getStat(key: StatKey) {
  return call(`get/${NS}/${key}`);
}

export function hitStat(key: StatKey) {
  return call(`hit/${NS}/${key}`);
}

/** Counts a visit only once per browser session. */
export async function countVisitOnce(): Promise<number | null> {
  if (typeof window === "undefined") return null;
  try {
    if (sessionStorage.getItem("diu-cover-visited")) return getStat("visits");
    sessionStorage.setItem("diu-cover-visited", "1");
  } catch {
    /* ignore storage errors */
  }
  return hitStat("visits");
}
