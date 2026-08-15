import diuLogo from "@/assets/diu-logo.png";

export type CoverType =
  | "lab-report"
  | "assignment"
  | "lab-final"
  | "lab-project-assignment"
  | "lab-performance";

export interface CoverData {
  type: CoverType;
  titleVariant?: string;
  semester: string;
  studentName: string;
  studentId: string;
  batch: string;
  section: string;
  courseCode: string;
  courseName: string;
  teacherName: string;
  designation: string;
  submissionDate: string;
}

export type ExtraImage = { id: string; dataUrl: string; name: string };

export const TITLES: Record<CoverType, string> = {
  "lab-report": "Lab Report",
  assignment: "Course Assignment Report",
  "lab-final": "Lab Final",
  "lab-project-assignment": "Lab/Project Assignment Report",
  "lab-performance": "Lab Performance Report",
};

// Title options selectable on the form for certain cover types
export const TITLE_VARIANTS: Partial<Record<CoverType, string[]>> = {
  "lab-report": ["Lab Report", "Project Report"],
  "lab-final": ["Lab Final", "Project Final"],
  "lab-project-assignment": [
    "Lab/Project Assignment Report",
    "Lab Assignment Report",
    "Project Assignment Report",
  ],
};

export const resolveTitle = (data: Pick<CoverData, "type" | "titleVariant">) => {
  const options = TITLE_VARIANTS[data.type];
  if (data.titleVariant && (!options || options.includes(data.titleVariant)))
    return data.titleVariant;
  return TITLES[data.type];
};

export const CRITERIA: Record<CoverType, { label: string; mark: number }[]> = {
  "lab-report": [
    { label: "Understanding/Analysis", mark: 7 },
    { label: "Implementation", mark: 8 },
    { label: "Report Writing", mark: 10 },
  ],
  assignment: [
    { label: "Content Quality", mark: 2 },
    { label: "Clarity", mark: 1 },
    { label: "Spelling & Grammar", mark: 1 },
    { label: "Organization and Formatting", mark: 1 },
  ],
  "lab-final": [
    { label: "Understanding", mark: 10 },
    { label: "Analysis", mark: 15 },
    { label: "Implementation", mark: 10 },
    { label: "Report Writing", mark: 5 },
  ],
  "lab-project-assignment": [
    { label: "Creativity", mark: 1 },
    { label: "Content Development", mark: 2 },
    { label: "Problem solving", mark: 1 },
    { label: "Organization and Formatting", mark: 1 },
  ],
  "lab-performance": [
    { label: "Lab Work", mark: 10 },
    { label: "Lab Assignment", mark: 10 },
    { label: "Viva", mark: 5 },
  ],
};

export const TOTAL: Record<CoverType, number> = {
  "lab-report": 25,
  assignment: 5,
  "lab-final": 40,
  "lab-project-assignment": 5,
  "lab-performance": 25,
};


// Page sizing (matches A4 at 96dpi-ish)
const PAGE_W = 794;
const PAGE_H = 1123;
// Body capacity (px) inside a text page after padding
const TEXT_PAGE_PADDING_TOP = 90;
const TEXT_PAGE_PADDING_BOTTOM = 80;
const TEXT_PAGE_PADDING_X = 80;
const TEXT_BODY_HEIGHT = PAGE_H - TEXT_PAGE_PADDING_TOP - TEXT_PAGE_PADDING_BOTTOM;
// approximate chars per page (15px font, ~1.7 line height, ~70 chars wide, ~32 lines)
const CHARS_PER_PAGE = 2200;

export function splitTextIntoPages(text: string): string[] {
  if (!text || !text.trim()) return [];
  // Split by paragraphs first, accumulate
  const paragraphs = text.split(/\n{2,}/);
  const pages: string[] = [];
  let buf = "";
  const push = () => {
    if (buf.trim()) pages.push(buf.trim());
    buf = "";
  };
  for (const p of paragraphs) {
    // If a single paragraph is huge, hard-split
    let remaining = p;
    while (remaining.length > CHARS_PER_PAGE) {
      const slice = remaining.slice(0, CHARS_PER_PAGE);
      // try to break at last space
      const cut = slice.lastIndexOf(" ");
      const safe = cut > CHARS_PER_PAGE * 0.7 ? cut : slice.length;
      if (buf) push();
      pages.push(remaining.slice(0, safe).trim());
      remaining = remaining.slice(safe).trim();
    }
    if (buf.length + remaining.length + 2 > CHARS_PER_PAGE) {
      push();
    }
    buf += (buf ? "\n\n" : "") + remaining;
  }
  push();
  return pages;
}

export function CoverPage({ data }: { data: CoverData }) {
  const criteria = CRITERIA[data.type];
  const total = TOTAL[data.type];
  const teacherLabel =
    data.type === "lab-final" ? "Teacher Name" : "Course Teacher Name";
  const showStudentId = true;

  return (
    <div id="cover-page" className="a4-page doc-page">
      <div style={{ textAlign: "center", marginBottom: -60, marginTop: -40 }}>
        <img
          src={diuLogo}
          alt="Daffodil International University"
          style={{ height: 235, margin: "0 auto", display: "block" }}
          crossOrigin="anonymous"
        />
      </div>
      <h1
        style={{
          textAlign: "center",
          fontSize: 38,
          fontWeight: 400,
          lineHeight: 1.5,
          margin: "0 0 8px",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        {resolveTitle(data)}
      </h1>


      <table className="a4-table">
        <tbody>
          <tr>
            <td colSpan={6} style={{ textAlign: "center", fontWeight: 700 }}>
              Only for course Teacher
            </td>
          </tr>
          <tr style={{ fontWeight: 700, textAlign: "center" }}>
            <td style={{ width: "22%" }}></td>
            <td>Needs Improvement</td>
            <td>Developing</td>
            <td>Sufficient</td>
            <td>Above Average</td>
            <td>Total Mark</td>
          </tr>
          <tr style={{ textAlign: "center", fontWeight: 700 }}>
            <td>Allocate mark &amp; Percentage</td>
            <td>25%</td>
            <td>50%</td>
            <td>75%</td>
            <td>100%</td>
            <td>{total}</td>
          </tr>
          {criteria.map((c) => (
            <tr key={c.label}>
              <td style={{ fontWeight: 700 }}>{c.label}</td>
              <td style={{ textAlign: "center", fontWeight: 700 }}>{c.mark}</td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          ))}
          <tr>
            <td colSpan={5} style={{ textAlign: "right", fontWeight: 700 }}>
              Total obtained mark
            </td>
            <td></td>
          </tr>
          <tr>
            <td style={{ fontWeight: 700, height: 70 }}>Comments</td>
            <td colSpan={5}></td>
          </tr>
        </tbody>
      </table>

      <div style={{ marginTop: 20, fontSize: 15, lineHeight: 1.5 }}>
        <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
          Semester: {data.semester}
        </div>

        <div>
          <strong>Student Name:</strong> {data.studentName}
        </div>
        {showStudentId && (
          <div>
            <strong>Student ID:</strong> {data.studentId}
          </div>
        )}
        <div>
          <strong>Batch:</strong> {data.batch} &nbsp;&nbsp;&nbsp;&nbsp;
          <strong>Section:</strong> {data.section}
        </div>
        <div>
          <strong>Course Code:</strong> {data.courseCode}
        </div>
        <div>
          <strong>Course Name:</strong> {data.courseName}
        </div>
        <div>
          <strong>{teacherLabel}:</strong> {data.teacherName}
        </div>
        <div>
          <strong>Designation:</strong> {data.designation}
        </div>
        <div>
          <strong>Submission Date:</strong> {data.submissionDate}
        </div>
      </div>
    </div>
  );
}

export function ImagePage({
  src,
  index,
  pageNumber,
}: {
  src: string;
  index: number;
  pageNumber: number;
}) {
  return (
    <div
      id={`doc-page-${pageNumber}`}
      className="a4-page doc-page"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
      }}
    >
      <img
        src={src}
        alt={`Attachment ${index + 1}`}
        crossOrigin="anonymous"
        style={{
          maxWidth: "100%",
          maxHeight: PAGE_H - 120,
          objectFit: "contain",
          display: "block",
        }}
      />
      <div
        style={{
          marginTop: 16,
          fontSize: 12,
          color: "#444",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        Figure {index + 1}
      </div>
    </div>
  );
}

export function TextPage({
  content,
  pageNumber,
}: {
  content: string;
  pageNumber: number;
}) {
  return (
    <div
      id={`doc-page-${pageNumber}`}
      className="a4-page doc-page"
      style={{
        padding: `${TEXT_PAGE_PADDING_TOP}px ${TEXT_PAGE_PADDING_X}px ${TEXT_PAGE_PADDING_BOTTOM}px`,
        fontFamily: "'Times New Roman', serif",
        fontSize: 15,
        lineHeight: 1.8,
        textAlign: "justify",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        color: "#000",
      }}
    >
      <div style={{ maxHeight: TEXT_BODY_HEIGHT, overflow: "hidden" }}>
        {content}
      </div>
    </div>
  );
}
