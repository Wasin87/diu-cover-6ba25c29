import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { CoverPage, type CoverData, type CoverType, TOTAL } from "@/components/CoverPage";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export const Route = createFileRoute("/")({
  component: Index,
});

const TYPE_META: { id: CoverType; title: string; desc: string; total: number; icon: string }[] = [
  { id: "lab-report", title: "Lab Report", desc: "Understanding • Implementation • Report", total: 25, icon: "🧪" },
  { id: "assignment", title: "Course Assignment", desc: "Content • Clarity • Grammar • Format", total: 5, icon: "📘" },
  { id: "lab-final", title: "Lab Final", desc: "Understanding • Analysis • Impl • Report", total: 40, icon: "🎓" },
];

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

function Index() {
  const [selected, setSelected] = useState<CoverType | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState<CoverData | null>(null);
  const [activeTab, setActiveTab] = useState<string>("home");
  const previewRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState<Omit<CoverData, "type">>({
    semester: "",
    studentName: "",
    studentId: "",
    batch: "",
    section: "",
    courseCode: "",
    courseName: "",
    teacherName: "",
    designation: "",
    submissionDate: "",
  });

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      setGenerated({ ...form, type: selected });
      setLoading(false);
      setTimeout(() => {
        document.getElementById("preview")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }, 2000);
  };

  const fileBase = () =>
    `${selected ?? "cover"}-${(form.studentName || "student").replace(/\s+/g, "_")}`;

  const downloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;
    const el = document.getElementById("cover-page");
    if (!el) return;
    html2pdf()
      .set({
        margin: 0,
        filename: `${fileBase()}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(el)
      .save();
  };

  const downloadImage = async (type: "png" | "jpg") => {
    const html2canvas = (await import("html2canvas")).default;
    const el = document.getElementById("cover-page");
    if (!el) return;
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: "#ffffff" });
    const mime = type === "png" ? "image/png" : "image/jpeg";
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${fileBase()}.${type}`;
        a.click();
        URL.revokeObjectURL(url);
      },
      mime,
      0.95,
    );
  };

  const downloadDoc = (ext: "doc" | "docx") => {
    const el = document.getElementById("cover-page");
    if (!el) return;
    const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Cover</title></head><body>${el.outerHTML}</body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileBase()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pb-28 md:pb-12">
      {loading && <LoadingOverlay />}

      {/* Header */}
      <header className="px-6 md:px-12 pt-10 pb-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.3em] text-[#65A30D] font-semibold uppercase">
              Daffodil International University
            </p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-[#166534] mt-1">
              Cover Page Studio
            </h1>
          </div>
          <div className="hidden md:flex gap-2 text-sm">
            {TYPE_META.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`px-4 py-2 rounded-full transition ${
                  selected === t.id
                    ? "bg-[#84CC16] text-white"
                    : "bg-[#ECFCCB] text-[#166534] hover:bg-[#A3E635]"
                }`}
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Type Selector */}
      <section id="select" className="px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-2xl text-[#166534] mb-5">
            1 · Choose your cover page
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TYPE_META.map((t) => {
              const active = selected === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className={`glass rounded-2xl p-6 text-left border-l-4 transition-all duration-300 ${
                    active
                      ? "lime-glow border-[#84CC16] -translate-y-1"
                      : "border-[#A3E635] hover:-translate-y-1"
                  }`}
                >
                  <div className="text-4xl mb-3">{t.icon}</div>
                  <h3 className="font-display text-2xl text-[#166534]">{t.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{t.desc}</p>
                  <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#65A30D] bg-[#F7FEE7] px-3 py-1 rounded-full">
                    Total Mark · {t.total}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form */}
      {selected && (
        <section id="form" className="px-6 md:px-12 mt-12 slide-in-right">
          <div className="max-w-4xl mx-auto glass rounded-3xl p-6 md:p-10">
            <h2 className="font-display text-2xl text-[#166534] mb-6">
              2 · Fill in your details
            </h2>
            <form onSubmit={handleGenerate} className="space-y-7">
              {FIELD_GROUPS.map((g) => {
                const fields =
                  selected === "assignment"
                    ? g.fields.filter((f) => f.key !== "studentId")
                    : g.fields;
                return (
                  <div key={g.title}>
                    <h3 className="text-xs uppercase tracking-widest text-[#65A30D] font-bold mb-3">
                      {g.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {fields.map((f) => (
                        <div className="float-label" key={f.key}>
                          <input
                            id={f.key}
                            placeholder=" "
                            required
                            value={form[f.key as keyof typeof form]}
                            onChange={(e) => update(f.key, e.target.value)}
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
                className="btn-lime w-full py-4 rounded-2xl font-display text-xl tracking-wide"
              >
                ✨ Generate Cover Page
              </button>
            </form>
          </div>
        </section>
      )}

      {/* Preview + Downloads */}
      {generated && (
        <section id="preview" className="px-6 md:px-12 mt-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-2xl text-[#166534] mb-2">
              3 · Your cover page
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Total Mark configured: <strong>{TOTAL[generated.type]}</strong>
            </p>

            <div className="flex flex-wrap gap-3 mb-6" id="download">
              {[
                { label: "PDF", color: "#84CC16", fn: downloadPDF, icon: "📄" },
                { label: "PNG", color: "#A3E635", fn: () => downloadImage("png"), icon: "🖼️" },
                { label: "JPG", color: "#65A30D", fn: () => downloadImage("jpg"), icon: "📸" },
                { label: "DOC", color: "#166534", fn: () => downloadDoc("doc"), icon: "📝" },
                { label: "DOCX", color: "#4d7c0f", fn: () => downloadDoc("docx"), icon: "💾" },
              ].map((b) => (
                <button
                  key={b.label}
                  onClick={b.fn}
                  className="px-5 py-2.5 rounded-full text-white font-semibold text-sm flex items-center gap-2 transition hover:scale-105 shadow-md"
                  style={{ background: b.color }}
                >
                  <span>{b.icon}</span> {b.label}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto bg-[#F7FEE7] rounded-2xl p-4 md:p-8 border border-[#A3E635]/40">
              <div ref={previewRef} className="a4-wrap mx-auto" style={{ width: 794 }}>
                <CoverPage data={generated} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-[9999] glass rounded-2xl px-2 py-2 flex justify-around">
        {[
          { id: "home", icon: "🏠", label: "Home", target: "select" },
          { id: "lab-report", icon: "🧪", label: "Lab", target: "select", type: "lab-report" as CoverType },
          { id: "assignment", icon: "📘", label: "Assign", target: "select", type: "assignment" as CoverType },
          { id: "lab-final", icon: "🎓", label: "Final", target: "select", type: "lab-final" as CoverType },
          { id: "download", icon: "⬇️", label: "Save", target: "download" },
        ].map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                if (t.type) setSelected(t.type);
                document.getElementById(t.target)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl transition ${
                active ? "bg-[#84CC16] text-white" : "text-[#166534]"
              }`}
            >
              <span className="text-lg leading-none">{t.icon}</span>
              <span className="text-[10px] mt-0.5 font-semibold">{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
