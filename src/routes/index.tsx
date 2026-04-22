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
            {TYPE_META.map((t) => {
              const active = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => pick(t.id)}
                  className={`glass rounded-2xl p-5 sm:p-6 text-left border-l-4 transition-all duration-300 active:scale-[.98] ${
                    active
                      ? "lime-glow border-[#84CC16] -translate-y-1"
                      : "border-[#A3E635] hover:-translate-y-1"
                  }`}
                >
                  <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{t.icon}</div>
                  <h3 className="font-display text-xl sm:text-2xl text-[#166534]">{t.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">{t.desc}</p>
                  <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#65A30D] bg-[#F7FEE7] px-3 py-1 rounded-full">
                    Total Mark · {t.total}
                  </div>
                  <div className="mt-4 text-xs font-semibold text-[#166534] flex items-center gap-1">
                    Open form <span aria-hidden>→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <MobileNav current="home" />
    </div>
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
