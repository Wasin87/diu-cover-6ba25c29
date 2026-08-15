import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { coverStore, useCoverStore } from "@/lib/cover-store";
import type { CoverType } from "@/components/CoverPage";
import diuLogo from "@/assets/diu-logo.png";
import { SiteStats } from "@/components/SiteStats";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DIU Cover — Choose Cover Type" },
      { name: "description", content: "Generate beautiful Daffodil International University cover pages for Lab Reports, Assignments, and Lab Finals." },
      { property: "og:title", content: "DIU Cover — Choose Cover Type" },
      { property: "og:description", content: "Pick a cover type and generate a print-ready DIU cover in seconds." },
      { property: "og:url", content: "https://diu-cover.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://diu-cover.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "DIU Cover",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          url: "https://diu-cover.lovable.app/",
          description: "Generate print-ready Daffodil International University cover pages for Lab Reports, Assignments, and Lab Finals.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        }),
      },
    ],
  }),
  component: HomePage,
});

const TYPE_META: { id: CoverType; title: string; desc: string; total: number; icon: string }[] = [
  { id: "lab-report", title: "Lab Report", desc: "Understanding • Implementation • Report", total: 25, icon: "🧪" },
  { id: "assignment", title: "Course Assignment", desc: "Content • Clarity • Grammar • Format", total: 5, icon: "📘" },
  { id: "lab-final", title: "Lab Final", desc: "Understanding • Analysis • Impl • Report", total: 40, icon: "🎓" },
  { id: "lab-project-assignment", title: "Lab/Project Assignment Report", desc: "Creativity • Content • Problem solving • Format", total: 5, icon: "🧩" },
  { id: "lab-performance", title: "Lab Performance Report", desc: "Lab Work • Lab Assignment • Viva", total: 25, icon: "⚙️" },
];

function HomePage() {
  const navigate = useNavigate();
  const { selected } = useCoverStore();

  const pick = (t: CoverType) => {
    coverStore.setSelected(t);
    navigate({ to: "/form" });
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12 relative overflow-hidden">
      {/* Decorative blobs for unique vibe */}
      <div aria-hidden className="pointer-events-none absolute -top-24 -left-24 w-72 h-72 rounded-full bg-[#BEF264]/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-40 -right-24 w-80 h-80 rounded-full bg-[#65A30D]/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-40" />

      
      <header className="relative px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 pb-4 sm:pb-6">
        <Link
          to="/"
          aria-label="DIU Cover home"
          className="absolute top-3 left-3 sm:top-5 sm:left-6 md:top-6 md:left-10 inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-md border border-[#A3E635]/50 pl-1.5 pr-3 py-1 sm:pl-2 sm:pr-4 sm:py-1.5 shadow-[0_8px_24px_-12px_rgba(22,101,52,0.4)] hover:shadow-[0_10px_28px_-10px_rgba(22,101,52,0.55)] hover:scale-[1.03] active:scale-95 transition-all"
        >
          <span className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-[#166534] to-[#65A30D] shadow-inner">
            <img src="/icon-192.png" alt="" className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-contain" />
          </span>
          <span className="font-display text-sm sm:text-base font-bold text-[#166534] tracking-tight whitespace-nowrap">
            DIU Cover
          </span>
        </Link>
        <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
          <img
            src={diuLogo}
            alt="Daffodil International University logo"
            className="h-24 sm:h-32 md:h-40 w-auto object-contain drop-shadow-md soft-float"
          />
          <p className="mt-2 text-[10px] sm:text-xs tracking-[0.3em] text-[#65A30D] font-semibold uppercase">
            Daffodil International University
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#166534] mt-1">
            DIU Cover
          </h1>
          <div className="mt-2 h-[3px] w-20 rounded-full bg-gradient-to-r from-[#A3E635] via-[#65A30D] to-[#166534]" />
          <p className="text-sm sm:text-base text-gray-600 mt-3 max-w-xl">
            Generate a print-ready DIU cover in seconds. Pick a type to begin.
          </p>
        </div>
      </header>

      <section className="relative px-3 sm:px-6 md:px-12 mt-2 sm:mt-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-lg sm:text-2xl text-[#166534] mb-3 sm:mb-5 text-center sm:text-left">
            Choose your cover page
          </h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-5">
            {TYPE_META.map((t, i) => {
              const active = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => pick(t.id)}
                  style={{ animationDelay: `${i * 90}ms` }}
                  className={`card-deep pop-in rounded-xl sm:rounded-2xl p-2.5 sm:p-6 text-left active:scale-[.98] flex flex-col ${
                    active ? "is-active lime-glow" : ""
                  }`}
                >
                  <div className="text-2xl sm:text-4xl mb-1 sm:mb-3 soft-float inline-block">{t.icon}</div>
                  <h3 className={`font-display text-[13px] leading-tight sm:text-2xl ${active ? "text-black" : "text-[#166534]"}`}>{t.title}</h3>
                  <p className={`hidden sm:block text-xs sm:text-sm mt-1 ${active ? "text-black/80" : "text-[#3f6212]"}`}>{t.desc}</p>
                  <div className={`mt-2 sm:mt-4 inline-flex items-center gap-1 text-[9px] sm:text-xs font-semibold px-1.5 sm:px-3 py-0.5 sm:py-1 rounded-full self-start ${
                    active ? "bg-black/10 text-black border border-black/20" : "bg-white/70 text-[#65A30D] border border-[#A3E635]"
                  }`}>
                    <span className="hidden sm:inline">Total Mark · </span>{t.total}
                  </div>
                  <div className={`hidden sm:flex mt-4 text-xs font-semibold items-center gap-1 ${active ? "text-black" : "text-[#166534]"}`}>
                    Open form <span aria-hidden>→</span>
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
              © {new Date().getFullYear()} DIU Cover. All rights reserved.
            </p>
            <SiteStats />
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

import { Home as HomeIcon, FileText, Eye } from "lucide-react";

export function MobileNav({ current }: { current: "home" | "form" | "preview" }) {
  const items: {
    id: "home" | "form" | "preview";
    Icon: typeof HomeIcon;
    label: string;
    to: "/" | "/form" | "/preview";
  }[] = [
    { id: "home", Icon: HomeIcon, label: "Home", to: "/" },
    { id: "form", Icon: FileText, label: "Form", to: "/form" },
    { id: "preview", Icon: Eye, label: "Preview", to: "/preview" },
  ];
  return (
    <nav
      className="md:hidden fixed left-3 right-3 z-[9999] rounded-2xl bg-[#FBF9F2] border border-black/5 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.18)] px-3 py-2 flex justify-around items-stretch"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)",
        maxWidth: "calc(100vw - 24px)",
      }}
    >
      {items.map((t) => {
        const active = current === t.id;
        const { Icon } = t;
        return (
          <Link
            key={t.id}
            to={t.to}
            className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 px-1 py-1"
          >
            <span
              className={`flex items-center justify-center w-11 h-9 rounded-xl transition-all ${
                active ? "bg-[#166534] text-white shadow-[0_4px_12px_-4px_rgba(22,101,52,0.55)]" : "text-[#1f2937]"
              }`}
            >
              <Icon size={22} strokeWidth={active ? 2.4 : 2} />
            </span>
            <span
              className={`text-[11px] font-semibold tracking-wide truncate ${
                active ? "text-[#166534]" : "text-[#374151]"
              }`}
            >
              {t.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
