import { useEffect, useState } from "react";
import { Download, Share, Plus, X } from "lucide-react";

type BIPEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const isInIframe = (() => {
  if (typeof window === "undefined") return false;
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
})();

const isPreviewHost = () => {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  return (
    h.includes("id-preview--") ||
    h.includes("lovableproject.com") ||
    h.includes("lovable.app") && h.includes("--")
  );
};

const isStandalone = () =>
  typeof window !== "undefined" &&
  (window.matchMedia("(display-mode: standalone)").matches ||
    // iOS legacy
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true);

const isIOS = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
};

export function PWA() {
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIOS, setShowIOS] = useState(false);

  // Register service worker (production only, never in preview iframe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const inPreview = isInIframe || isPreviewHost();

    if (inPreview) {
      // Clean up any previously registered SWs in preview/iframe contexts
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister());
      });
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    };
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) {
      setInstalled(true);
      return;
    }

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BIPEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice.outcome === "accepted") setInstalled(true);
      } finally {
        setDeferred(null);
      }
      return;
    }
    if (isIOS()) setShowIOS(true);
  };

  if (installed) return null;

  // Show button only when installable: either prompt available OR iOS Safari
  const visible = !!deferred || (isIOS() && !isStandalone());
  if (!visible) return null;

  return (
    <>
      <button
        onClick={handleInstall}
        aria-label="Install app"
        className="fixed z-[10000] right-4 bottom-24 md:bottom-6 group inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_-10px_rgba(22,101,52,0.7)] bg-gradient-to-r from-[#166534] via-[#3f6212] to-[#65A30D] backdrop-blur-md ring-1 ring-white/20 transition-all hover:scale-105 active:scale-95 animate-[pop-in_.5s_cubic-bezier(.2,.8,.2,1)_both]"
      >
        <Download size={18} className="drop-shadow" />
        <span className="whitespace-nowrap">Install App</span>
        <span className="absolute inset-0 rounded-full ring-2 ring-[#A3E635]/0 group-hover:ring-[#A3E635]/60 transition" />
      </button>

      {showIOS && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[10001] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setShowIOS(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-[#A3E635]/40"
          >
            <button
              onClick={() => setShowIOS(false)}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#166534] to-[#65A30D] flex items-center justify-center text-white shadow-lg">
                <Download size={22} />
              </div>
              <div>
                <h3 className="font-display text-lg text-[#166534] font-bold">Install on iPhone</h3>
                <p className="text-xs text-gray-500">Add to your Home Screen</p>
              </div>
            </div>
            <ol className="mt-5 space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#ECFCCB] text-[#166534] text-xs font-bold flex items-center justify-center">1</span>
                <span>Tap the <Share size={14} className="inline -mt-0.5 text-[#65A30D]" /> <b>Share</b> button in Safari.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#ECFCCB] text-[#166534] text-xs font-bold flex items-center justify-center">2</span>
                <span>Choose <Plus size={14} className="inline -mt-0.5 text-[#65A30D]" /> <b>Add to Home Screen</b>.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 w-6 h-6 rounded-full bg-[#ECFCCB] text-[#166534] text-xs font-bold flex items-center justify-center">3</span>
                <span>Tap <b>Add</b> in the top right to finish.</span>
              </li>
            </ol>
            <button
              onClick={() => setShowIOS(false)}
              className="mt-6 w-full rounded-xl py-3 font-semibold text-white bg-gradient-to-r from-[#166534] to-[#65A30D] active:scale-[.98] transition"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
