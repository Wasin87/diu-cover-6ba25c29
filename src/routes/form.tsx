import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { coverStore, useCoverStore } from "@/lib/cover-store";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { TOTAL } from "@/components/CoverPage";
import { MobileNav } from "./index";

export const Route = createFileRoute("/form")({
  head: () => ({
    meta: [
      { title: "Fill Cover Details — DIU Cover Page Studio" },
      { name: "description", content: "Enter your student and course information to generate the cover page." },
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

const TYPE_TITLE = {
  "lab-report": "Lab Report",
  assignment: "Course Assignment",
  "lab-final": "Lab Final",
} as const;

function FormPage() {
  const navigate = useNavigate();
  const { selected, form, generated } = useCoverStore();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(!!generated);

  useEffect(() => {
    if (!selected) navigate({ to: "/" });
  }, [selected, navigate]);

  if (!selected) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      coverStore.setGenerated({ ...form, type: selected });
      setLoading(false);
      setDone(true);
      toast.success("Cover page generated!", {
        description: "Tap “View Cover Page” to preview & download.",
      });
    }, 2000);
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

            <button
              type="submit"
              className="btn-lime w-full py-4 rounded-2xl font-display text-lg sm:text-xl tracking-wide"
            >
              ✨ Generate Cover Page
            </button>

            {done && (
              <Link
                to="/preview"
                className="block w-full text-center py-4 rounded-2xl font-display text-lg sm:text-xl tracking-wide bg-[#166534] text-white hover:bg-[#14532d] transition shadow-lg"
              >
                👁️ View Cover Page
              </Link>
            )}
          </form>
        </div>
      </section>

      <MobileNav current="form" />
    </div>
  );
}
