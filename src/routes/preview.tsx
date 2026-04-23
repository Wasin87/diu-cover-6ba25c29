import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useCoverStore } from "@/lib/cover-store";
import {
  CoverPage,
  ImagePage,
  TextPage,
  TOTAL,
  splitTextIntoPages,
} from "@/components/CoverPage";
import { downloadPDF, downloadDocx } from "@/lib/downloads";
import { MobileNav } from "./index";

export const Route = createFileRoute("/preview")({
  head: () => ({
    meta: [
      { title: "Preview & Download — DIU Cover Page Studio" },
      { name: "description", content: "Preview your generated DIU cover page and download it as PDF or DOCX." },
    ],
  }),
  component: PreviewPage,
});

type Fmt = "PDF" | "DOCX";

function PreviewPage() {
  const { generated } = useCoverStore();
  const navigate = useNavigate();
  const [busy, setBusy] = useState<Fmt | null>(null);

  useEffect(() => {
    if (!generated) navigate({ to: "/form" });
  }, [generated, navigate]);

  const textPages = useMemo(
    () => (generated ? splitTextIntoPages(generated.extraText) : []),
    [generated],
  );

  if (!generated) return null;

  const run = async (fmt: Fmt, fn: () => Promise<void>) => {
    if (busy) return;
    setBusy(fmt);
    const tId = toast.loading(`Preparing ${fmt}...`);
    try {
      await fn();
      toast.success(`${fmt} downloaded successfully!`, {
        id: tId,
        description: "Check your downloads or gallery.",
      });
    } catch (err) {
      console.error(err);
      toast.error(`Failed to download ${fmt}`, {
        id: tId,
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setBusy(null);
    }
  };

  const buttons: { label: Fmt; color: string; icon: string; fn: () => Promise<void> }[] = [
    {
      label: "PDF",
      color: "#84CC16",
      icon: "📄",
      fn: () => downloadPDF(generated, textPages),
    },
    {
      label: "DOCX",
      color: "#166534",
      icon: "💾",
      fn: () => downloadDocx(generated, textPages),
    },
  ];

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      <header className="px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 pb-2">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/form"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] bg-white/70 hover:bg-white px-3 py-2 rounded-full border border-[#A3E635]/50 transition"
          >
            <span aria-hidden>←</span> Back to Form
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#65A30D] hover:text-[#166534] transition"
          >
            🏠 Home
          </Link>
        </div>
      </header>

      <section className="px-4 sm:px-6 md:px-12 mt-4 sm:mt-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-[#166534] mb-1">
            Your document
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-5 sm:mb-6">
            Total mark: <strong>{TOTAL[generated.type]}</strong> · Pages:{" "}
            <strong>{1 + generated.images.length + textPages.length}</strong>{" "}
            (1 cover + {generated.images.length} image{generated.images.length === 1 ? "" : "s"} + {textPages.length} text)
          </p>

          {/* Download toolbar */}
          <div className="sticky top-2 z-30 bg-white/80 backdrop-blur-md rounded-2xl p-3 mb-5 border border-[#A3E635]/40 shadow-sm">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center sm:justify-start">
              {buttons.map((b) => (
                <button
                  key={b.label}
                  onClick={() => run(b.label, b.fn)}
                  disabled={busy !== null}
                  className="px-5 sm:px-6 py-2.5 rounded-full text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition active:scale-95 hover:scale-105 shadow-md disabled:opacity-60 disabled:cursor-not-allowed min-w-[110px] justify-center"
                  style={{ background: b.color }}
                >
                  {busy === b.label ? (
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <span>{b.icon}</span>
                  )}
                  Download {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* A4 preview - all pages */}
          <div className="overflow-x-auto bg-[#F7FEE7] rounded-2xl p-3 sm:p-6 md:p-8 border border-[#A3E635]/40">
            <div className="a4-wrap mx-auto flex flex-col items-center gap-6" style={{ width: 794 }}>
              <CoverPage data={generated} />
              {generated.images.map((img, i) => (
                <ImagePage
                  key={img.id}
                  src={img.dataUrl}
                  index={i}
                  pageNumber={i + 2}
                />
              ))}
              {textPages.map((t, i) => (
                <TextPage
                  key={`text-${i}`}
                  content={t}
                  pageNumber={generated.images.length + i + 2}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <MobileNav current="preview" />
    </div>
  );
}
