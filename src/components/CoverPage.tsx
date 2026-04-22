import diuLogo from "@/assets/diu-logo.png";

export type CoverType = "lab-report" | "assignment" | "lab-final";

export interface CoverData {
  type: CoverType;
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

const TITLES: Record<CoverType, string> = {
  "lab-report": "Lab Report",
  assignment: "Course Assignment Report",
  "lab-final": "Lab Final",
};

const CRITERIA: Record<CoverType, { label: string; mark: number }[]> = {
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
};

export const TOTAL: Record<CoverType, number> = {
  "lab-report": 25,
  assignment: 5,
  "lab-final": 40,
};

export function CoverPage({ data }: { data: CoverData }) {
  const criteria = CRITERIA[data.type];
  const total = TOTAL[data.type];
  const teacherLabel =
    data.type === "lab-final" ? "Teacher Name" : "Course Teacher Name";
  const showStudentId = data.type !== "assignment";

  return (
    <div id="cover-page" className="a4-page">
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <img
          src={diuLogo}
          alt="Daffodil International University"
          style={{ height: 140, margin: "0 auto", display: "block" }}
          crossOrigin="anonymous"
        />
      </div>
      <h1
        style={{
          textAlign: "center",
          fontSize: 38,
          fontWeight: 400,
          margin: "10px 0 28px",
          fontFamily: "'Times New Roman', serif",
        }}
      >
        {TITLES[data.type]}
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

      <div style={{ marginTop: 36, fontSize: 15, lineHeight: 2 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>
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
