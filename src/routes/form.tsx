import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { coverStore, useCoverStore } from "@/lib/cover-store";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TOTAL, TITLES, TITLE_VARIANTS } from "@/components/CoverPage";
import { MobileNav } from "./index";
import { hitStat } from "@/lib/stats";

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
      { key: "submissionDate", label: "Submission Date", type: "date" },
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
  const { selected, titleVariant, form, generated, extraText, images } =
    useCoverStore();
  const [loading, setLoading] = useState(false);

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

  const variants = TITLE_VARIANTS[selected];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    void hitStat("generates");
    setTimeout(() => {
      coverStore.setGenerated({
        ...form,
        type: selected,
        titleVariant: variants ? titleVariant || variants[0] : undefined,
        extraText,
        images,
      });
      setLoading(false);

      toast.success("Cover page generated!", {
        description: "Opening preview & download...",
      });
      navigate({ to: "/preview" });
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
            {variants && (
              <div>
                <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-[#65A30D] font-bold mb-3">
                  Cover Page Title
                </h3>
                <select
                  aria-label="Cover page title"
                  value={titleVariant || variants[0]}
                  onChange={(e) => coverStore.setTitleVariant(e.target.value)}
                  className="w-full rounded-2xl border border-[#A3E635] bg-white px-4 py-3 text-sm sm:text-base font-semibold text-[#166534] outline-none focus:ring-2 focus:ring-[#65A30D]"
                >
                  {variants.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-gray-600">
                  This title will be printed on the generated cover page.
                </p>
              </div>
            )}

            {FIELD_GROUPS.map((g) => {
              const fields = g.fields;
              return (
                <div key={g.title}>
                  <h3 className="text-[10px] sm:text-xs uppercase tracking-widest text-[#65A30D] font-bold mb-3">
                    {g.title}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {fields.map((f) => {
                      const isDate = "type" in f && f.type === "date";
                      return (
                        <div
                          className={`float-label${isDate ? " is-date" : ""}`}
                          key={f.key}
                        >
                          <input
                            id={f.key}
                            type={isDate ? "date" : "text"}
                            placeholder=" "
                            required
                            value={form[f.key as keyof typeof form]}
                            onChange={(e) =>
                              coverStore.updateField(
                                f.key as keyof typeof form,
                                e.target.value,
                              )
                            }
                            onClick={(e) => {
                              if (!isDate) return;
                              const el = e.currentTarget as HTMLInputElement & {
                                showPicker?: () => void;
                              };
                              try {
                                el.showPicker?.();
                              } catch {
                                /* not supported */
                              }
                            }}
                          />
                          <label htmlFor={f.key}>{f.label}</label>
                          {isDate && (
                            <span className="date-icon" aria-hidden>
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <rect x="3" y="4" width="18" height="18" rx="2" />
                                <path d="M16 2v4M8 2v4M3 10h18" />
                              </svg>
                            </span>
                          )}
                        </div>
                      );
                    })}

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


          </form>
        </div>
      </section>

      <MobileNav current="form" />
    </div>
  );
}
