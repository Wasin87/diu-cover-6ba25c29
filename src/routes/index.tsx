import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { coverStore, useCoverStore } from "@/lib/cover-store";
import type { CoverType } from "@/components/CoverPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DIU Cover Page Studio — Choose Cover Type" },
      { name: "description", content: "Generate beautiful Daffodil International University cover pages for Lab Reports, Assignments, and Lab Finals." },
    ],
  }),
  component: HomePage,
});

const TYPE_META: { id: CoverType; title: string; desc: string; total: number; icon: string }[] = [
  { id: "lab-report", title: "Lab Report", desc: "Understanding • Implementation • Report", total: 25, icon: "🧪" },
  { id: "assignment", title: "Course Assignment", desc: "Content • Clarity • Grammar • Format", total: 5, icon: "📘" },
  { id: "lab-final", title: "Lab Final", desc: "Understanding • Analysis • Impl • Report", total: 40, icon: "🎓" },
];

function HomePage() {
  const navigate = useNavigate();
  const { selected } = useCoverStore();

  const pick = (t: CoverType) => {
    coverStore.setSelected(t);
    navigate({ to: "/form" });
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <header className="px-4 sm:px-6 md:px-12 pt-8 sm:pt-10 pb-4 sm:pb-6">
        <div className="max-w-6xl mx-auto text-center md:text-left">
          <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#65A30D] font-semibold uppercase">
            Daffodil International University
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#166534] mt-1">
            Cover Page Studio
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-xl mx-auto md:mx-0">
            Generate a print-ready DIU cover in seconds. Pick a type to begin.
          </p>
        </div>
      </header>

      <section className="px-4 sm:px-6 md:px-12 mt-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-xl sm:text-2xl text-[#166534] mb-4 sm:mb-5">
            Choose your cover page
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {TYPE_META.map((t, i) => {
              const active = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => pick(t.id)}
                  style={{ animationDelay: `${i * 90}ms` }}
                  className={`card-deep pop-in rounded-2xl p-5 sm:p-6 text-left active:scale-[.98] ${
                    active ? "is-active lime-glow" : ""
                  }`}
                >
                  <div className={`text-3xl sm:text-4xl mb-2 sm:mb-3 soft-float inline-block ${active ? "" : ""}`}>{t.icon}</div>
                  <h3 className={`font-display text-xl sm:text-2xl ${active ? "text-white" : "text-[#166534]"}`}>{t.title}</h3>
                  <p className={`text-xs sm:text-sm mt-1 ${active ? "text-white/90" : "text-[#3f6212]"}`}>{t.desc}</p>
                  <div className={`mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full ${
                    active ? "bg-white/20 text-white" : "bg-white/70 text-[#65A30D] border border-[#A3E635]"
                  }`}>
                    Total Mark · {t.total}
                  </div>
                  <div className={`mt-4 text-xs font-semibold flex items-center gap-1 ${active ? "text-white" : "text-[#166534]"}`}>
                    Open form <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <SiteFooter />
      <MobileNav current="home" />
    </div>
  );
}

function SocialIcon({
  href,
  label,
  brand,
  children,
}: {
  href: string;
  label: string;
  brand: string;
  children: React.ReactNode;
}) {
  const open = (e: React.MouseEvent) => {
    // Force open in top window so iframe sandboxes (preview, embeds) don't block it
    e.preventDefault();
    try {
      window.open(href, "_blank", "noopener,noreferrer");
    } catch {
      window.location.href = href;
    }
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      onClick={open}
      onAuxClick={open}
      style={{ ["--brand" as never]: brand }}
      className="social-icon group relative w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 hover:bg-white hover:text-[var(--brand)] hover:shadow-[0_8px_24px_-6px_var(--brand)]"
    >
      <span className="absolute inset-0 rounded-full ring-2 ring-white/0 group-hover:ring-white/40 transition" />
      {children}
    </a>
  );
}

function SiteFooter() {
  return (
    <footer className="mt-16 px-4 sm:px-6 md:px-12 pb-24 md:pb-10">
      <div className="footer-card relative overflow-hidden max-w-6xl mx-auto rounded-3xl bg-gradient-to-r from-[#166534] via-[#3f6212] to-[#65A30D] text-white p-6 sm:p-8 shadow-[0_20px_60px_-20px_rgba(22,101,52,0.6)]">
        <span className="footer-shine" aria-hidden />
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="font-display text-sm sm:text-xl font-semibold tracking-wide whitespace-nowrap">
              Developed by <span className="underline decoration-[#A3E635] decoration-2 underline-offset-4">Md Wasin Ahmed</span>
            </p>
            <p className="text-[10px] sm:text-sm text-white/80 mt-1">
              © {new Date().getFullYear()} DIU Cover Page Studio. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SocialIcon
              href="https://www.facebook.com/wasin.ahmed.79/"
              label="Facebook profile of Md Wasin Ahmed"
              brand="#1877F2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
              </svg>
            </SocialIcon>
            <SocialIcon
              href="https://www.linkedin.com/in/md-wasin-ahmed/"
              label="LinkedIn profile of Md Wasin Ahmed"
              brand="#0A66C2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34v-7.9H5.67v7.9h2.67zM7.01 9.27a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.32 9.07v-4.33c0-2.4-1.28-3.52-2.99-3.52-1.38 0-2 .76-2.34 1.29v-1.11h-2.67c.04.75 0 7.9 0 7.9h2.67v-4.41c0-.24.02-.48.09-.65.19-.48.63-.98 1.37-.98.97 0 1.36.74 1.36 1.82v4.22h2.51z"/>
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileNav({ current }: { current: "home" | "form" | "preview" }) {
  const items: { id: "home" | "form" | "preview"; icon: string; label: string; to: "/" | "/form" | "/preview" }[] = [
    { id: "home", icon: "🏠", label: "Home", to: "/" },
    { id: "form", icon: "📝", label: "Form", to: "/form" },
    { id: "preview", icon: "👁️", label: "View", to: "/preview" },
  ];
  return (
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-[9999] glass rounded-2xl px-2 py-2 flex justify-around">
      {items.map((t) => {
        const active = current === t.id;
        return (
          <Link
            key={t.id}
            to={t.to}
            className={`flex flex-col items-center px-4 py-1.5 rounded-xl transition ${
              active ? "bg-[#84CC16] text-white" : "text-[#166534]"
            }`}
          >
            <span className="text-lg leading-none">{t.icon}</span>
            <span className="text-[10px] mt-0.5 font-semibold">{t.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
