import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { coverStore, useCoverStore } from "@/lib/cover-store";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TOTAL, TITLES, TITLE_VARIANTS } from "@/components/CoverPage";
import { MobileNav } from "./index";

export const Route = createFileRoute("/form")({
  head: () => ({
    meta: [
      { title: "Fill Cover Details — DIU Cover" },
      { name: "description", content: "Enter your student and course information to generate the cover page." },
      { property: "og:title", content: "Fill Cover Details — DIU Cover" },
      { property: "og:description", content: "Enter your student and course information to generate the cover page." },
      { property: "og:url", content: "https://diu-cover.lovable.app/form" },
    ],
    links: [
      { rel: "canonical", href: "https://diu-cover.lovable.app/form" },
    ],
  }),
  component: FormPage,
});

const FIELD_GROUPS = [
  {
    title: "Student Info",
    fields: [
      { key: "studentName", label: "Student Name" },
      { key: "studentId", label: "Student ID" },
      { key: "batch", label: "Batch" },
      { key: "section", label: "Section" },
    ],
  },
  {
    title: "Course Info",
    fields: [
      { key: "semester", label: "Semester" },
      { key: "courseCode", label: "Course Code" },
      { key: "courseName", label: "Course Name" },
    ],
  },
  {
    title: "Submission Details",
    fields: [
      { key: "teacherName", label: "Teacher Name" },
      { key: "designation", label: "Designation" },
      { key: "submissionDate", label: "Submission Date" },
    ],
  },
] as const;

const TYPE_TITLE = TITLES;

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function FormPage() {
  const navigate = useNavigate();
  const { selected, form, generated, extraText, images } = useCoverStore();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!!generated);

  useEffect(() => {
    if (!selected) navigate({ to: "/" });
  }, [selected, navigate]);

  if (!selected) return null;

  const handleImages = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const accepted = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!accepted.length) {
      toast.error("Please select image files only.");
      return;
    }
    try {
      const imgs = await Promise.all(
        accepted.map(async (f) => ({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          dataUrl: await readFileAsDataUrl(f),
          name: f.name,
        })),
      );
      coverStore.addImages(imgs);
      toast.success(`${imgs.length} image${imgs.length > 1 ? "s" : ""} added`);
    } catch {
      toast.error("Failed to read one or more images.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      coverStore.setGenerated({
        ...form,
        type: selected,
        extraText,
        images,
      });
      setLoading(false);
      setDone(true);
      toast.success("Cover page generated!", {
        description: "Tap “View Cover Page” to preview & download.",
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      {loading && <LoadingOverlay />}

      <header className="px-4 sm:px-6 md:px-12 pt-6 sm:pt-10 pb-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#166534] bg-white/70 hover:bg-white px-3 py-2 rounded-full border border-[#A3E635]/50 transition"
          >
            <span aria-hidden>←</span> Back
          </Link>
          <div className="text-right">
            <p className="text-[10px] sm:text-xs tracking-[0.3em] text-[#65A30D] font-semibold uppercase">
              Step 2 of 3
            </p>
            <h1 className="font-display text-xl sm:text-3xl text-[#166534] leading-tight">
              {TYPE_TITLE[selected]}
            </h1>
          </div>
        </div>
      </header>

      <section className="px-4 sm:px-6 md:px-12 mt-4 sm:mt-6">
        <div className="max-w-4xl mx-auto glass rounded-3xl p-5 sm:p-8 md:p-10 slide-in-right">
          <h2 className="font-display text-xl sm:text-2xl text-[#166534] mb-1">
            Fill in your details
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-5 sm:mb-7">
            All fields are required. Total mark configured: <strong>{TOTAL[selected]}</strong>
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-7">
            {FIELD_GROUPS.map((g) => {
              const fields =
                selected === "assignment"
                  ? g.fields.filter((f) => f.key !== "studentId")
                  : g.fields;
              return (
                <div key={g.title}>
                  <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-[#65A30D] font-bold mb-3">
                    {g.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {fields.map((f) => (
                      <div className="float-label" key={f.key}>
                        <input
                          id={f.key}
                          placeholder=" "
                          required
                          value={form[f.key as keyof typeof form]}
                          onChange={(e) =>
                            coverStore.updateField(
                              f.key as keyof typeof form,
                              e.target.value,
                            )
                          }
                        />
                        <label htmlFor={f.key}>{f.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Extra content */}
            <div>
              <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-[#65A30D] font-bold mb-3">
                Additional Content (Optional)
              </h3>

              <div className="float-label mb-4">
                <textarea
                  id="extraText"
                  placeholder=" "
                  rows={8}
                  value={extraText}
                  onChange={(e) => coverStore.setExtraText(e.target.value)}
                  style={{ minHeight: 180, resize: "vertical" }}
                />
                <label htmlFor="extraText">Long Text (added as pages after the cover)</label>
              </div>

              <div className="rounded-2xl border-2 border-dashed border-[#A3E635] bg-[#F7FEE7]/60 p-4 sm:p-5">
                <label
                  htmlFor="imageUpload"
                  className="flex flex-col items-center justify-center cursor-pointer text-center py-4"
                >
                  <span className="text-3xl mb-2">🖼️</span>
                  <span className="font-semibold text-[#166534] text-sm sm:text-base">
                    Upload images
                  </span>
                  <span className="text-xs text-gray-600 mt-1">
                    Click to add multiple images. Each image becomes a new page.
                  </span>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleImages(e.target.files);
                      e.target.value = "";
                    }}
                  />
                </label>

                {images.length > 0 && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#65A30D]">
                        {images.length} image{images.length > 1 ? "s" : ""} added
                      </span>
                      <button
                        type="button"
                        onClick={() => coverStore.clearImages()}
                        className="text-xs text-red-600 hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                      {images.map((img) => (
                        <div
                          key={img.id}
                          className="relative aspect-square rounded-lg overflow-hidden border border-[#A3E635]/50 bg-white group"
                        >
                          <img
                            src={img.dataUrl}
                            alt={`Attachment preview: ${img.name}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => coverStore.removeImage(img.id)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center opacity-80 hover:opacity-100"
                            aria-label="Remove"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="btn-lime w-full py-4 rounded-2xl font-display text-lg sm:text-xl tracking-wide"
            >
              ✨ Generate Cover Page
            </button>

            {done && (
              <Link
                to="/preview"
                className="relative block w-full text-center py-4 rounded-2xl font-display text-lg sm:text-xl tracking-wide text-white shadow-[0_18px_40px_-12px_rgba(22,101,52,0.75)] bg-gradient-to-r from-[#166534] via-[#3f6212] to-[#65A30D] ring-2 ring-[#A3E635] hover:scale-[1.02] active:scale-95 transition-all animate-[pop-in_.5s_cubic-bezier(.2,.8,.2,1)_both] overflow-hidden"
              >
                <span className="absolute inset-0 rounded-2xl ring-4 ring-[#A3E635]/40 animate-pulse pointer-events-none" />
                <span className="relative z-10">👁️ View Cover Page</span>
              </Link>
            )}

          </form>
        </div>
      </section>

      <MobileNav current="form" />
    </div>
  );
}
