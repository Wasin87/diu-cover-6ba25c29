import { TOTAL, type CoverData } from "@/components/CoverPage";
import diuLogo from "@/assets/diu-logo.png";

export const fileBase = (data: CoverData) =>
  `${data.type}-${(data.studentName || "student").replace(/\s+/g, "_")}`;

// Mobile-friendly save: try Web Share with files, fall back to anchor download
async function saveBlob(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: blob.type });
  const nav = navigator as Navigator & {
    canShare?: (d: { files: File[] }) => boolean;
    share?: (d: { files: File[]; title?: string }) => Promise<void>;
  };
  // Use share sheet on mobile when possible (saves to Gallery/Files)
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: filename });
      return;
    } catch {
      // user cancelled or failed -> fall back to download
    }
  }
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    a.remove();
    URL.revokeObjectURL(url);
  }, 100);
}

export async function downloadPDF(data: CoverData) {
  const html2pdf = (await import("html2pdf.js")).default;
  const el = document.getElementById("cover-page");
  if (!el) throw new Error("Cover not ready");
  const blob: Blob = await html2pdf()
    .set({
      margin: 0,
      filename: `${fileBase(data)}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    })
    .from(el)
    .outputPdf("blob");
  await saveBlob(blob, `${fileBase(data)}.pdf`);
}

export async function downloadImage(data: CoverData, type: "png" | "jpg") {
  const html2canvas = (await import("html2canvas")).default;
  const el = document.getElementById("cover-page");
  if (!el) throw new Error("Cover not ready");
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const mime = type === "png" ? "image/png" : "image/jpeg";
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Encode failed"))),
      mime,
      0.95,
    ),
  );
  await saveBlob(blob, `${fileBase(data)}.${type}`);
}

let logoB64Cache: string | null = null;
async function getLogoBase64(): Promise<string> {
  if (logoB64Cache) return logoB64Cache;
  const res = await fetch(diuLogo);
  const blob = await res.blob();
  logoB64Cache = await new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
  return logoB64Cache;
}

const titleOf = (t: CoverData["type"]) =>
  t === "lab-report"
    ? "Lab Report"
    : t === "assignment"
      ? "Course Assignment Report"
      : "Lab Final";

const criteriaOf = (t: CoverData["type"]): [string, number][] =>
  t === "lab-report"
    ? [["Understanding/Analysis", 7], ["Implementation", 8], ["Report Writing", 10]]
    : t === "assignment"
      ? [["Content Quality", 2], ["Clarity", 1], ["Spelling & Grammar", 1], ["Organization and Formatting", 1]]
      : [["Understanding", 10], ["Analysis", 15], ["Implementation", 10], ["Report Writing", 5]];

export async function downloadDoc(data: CoverData) {
  const logo = await getLogoBase64();
  const total = TOTAL[data.type];
  const teacherLabel = data.type === "lab-final" ? "Teacher Name" : "Course Teacher Name";
  const showId = data.type !== "assignment";
  const rowsHtml = criteriaOf(data.type)
    .map(
      ([label, mark]) =>
        `<tr><td style="border:1px solid #000;padding:6px;font-weight:bold;">${label}</td><td style="border:1px solid #000;padding:6px;text-align:center;font-weight:bold;">${mark}</td><td style="border:1px solid #000;padding:6px;">&nbsp;</td><td style="border:1px solid #000;padding:6px;">&nbsp;</td><td style="border:1px solid #000;padding:6px;">&nbsp;</td><td style="border:1px solid #000;padding:6px;">&nbsp;</td></tr>`,
    )
    .join("");
  const html = `<!DOCTYPE html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><title>Cover</title><!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]--><style>@page{size:A4;margin:1in;}body{font-family:'Times New Roman',serif;color:#000;}table{border-collapse:collapse;width:100%;}td{border:1px solid #000;padding:6px;}</style></head><body>
<div style="text-align:center;margin-bottom:18px;"><img src="${logo}" style="height:140px;" alt="DIU"/></div>
<h1 style="text-align:center;font-size:32pt;font-weight:normal;margin:10px 0 24px;">${titleOf(data.type)}</h1>
<table><tbody>
<tr><td colspan="6" style="text-align:center;font-weight:bold;">Only for course Teacher</td></tr>
<tr style="font-weight:bold;text-align:center;"><td>&nbsp;</td><td>Needs Improvement</td><td>Developing</td><td>Sufficient</td><td>Above Average</td><td>Total Mark</td></tr>
<tr style="text-align:center;font-weight:bold;"><td>Allocate mark &amp; Percentage</td><td>25%</td><td>50%</td><td>75%</td><td>100%</td><td>${total}</td></tr>
${rowsHtml}
<tr><td colspan="5" style="text-align:right;font-weight:bold;">Total obtained mark</td><td>&nbsp;</td></tr>
<tr><td style="font-weight:bold;height:70px;">Comments</td><td colspan="5">&nbsp;</td></tr>
</tbody></table>
<div style="margin-top:30px;font-size:14pt;line-height:2;">
<div style="font-weight:bold;font-size:16pt;">Semester: ${data.semester}</div>
<div><b>Student Name:</b> ${data.studentName}</div>
${showId ? `<div><b>Student ID:</b> ${data.studentId}</div>` : ""}
<div><b>Batch:</b> ${data.batch} &nbsp;&nbsp;&nbsp;&nbsp;<b>Section:</b> ${data.section}</div>
<div><b>Course Code:</b> ${data.courseCode}</div>
<div><b>Course Name:</b> ${data.courseName}</div>
<div><b>${teacherLabel}:</b> ${data.teacherName}</div>
<div><b>Designation:</b> ${data.designation}</div>
<div><b>Submission Date:</b> ${data.submissionDate}</div>
</div></body></html>`;
  const blob = new Blob(["\ufeff", html], { type: "application/msword" });
  await saveBlob(blob, `${fileBase(data)}.doc`);
}

export async function downloadDocx(data: CoverData) {
  const docxMod = await import("docx");
  const {
    Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, ImageRun,
    AlignmentType, WidthType, BorderStyle, HeightRule,
  } = docxMod;

  const total = TOTAL[data.type];
  const teacherLabel = data.type === "lab-final" ? "Teacher Name" : "Course Teacher Name";
  const showId = data.type !== "assignment";

  const logoRes = await fetch(diuLogo);
  const logoBuf = new Uint8Array(await logoRes.arrayBuffer());

  const border = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const cell = (
    text: string,
    opts: { bold?: boolean; align?: "center" | "right" | "left"; cs?: number; height?: number } = {},
  ) =>
    new TableCell({
      borders,
      columnSpan: opts.cs,
      children: [
        new Paragraph({
          alignment:
            opts.align === "center"
              ? AlignmentType.CENTER
              : opts.align === "right"
                ? AlignmentType.RIGHT
                : AlignmentType.LEFT,
          children: [new TextRun({ text, bold: opts.bold })],
        }),
      ],
      ...(opts.height ? { height: { value: opts.height, rule: HeightRule.ATLEAST } } : {}),
    });

  const table = new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [cell("Only for course Teacher", { bold: true, align: "center", cs: 6 })] }),
      new TableRow({
        children: [
          cell("", { bold: true }),
          cell("Needs Improvement", { bold: true, align: "center" }),
          cell("Developing", { bold: true, align: "center" }),
          cell("Sufficient", { bold: true, align: "center" }),
          cell("Above Average", { bold: true, align: "center" }),
          cell("Total Mark", { bold: true, align: "center" }),
        ],
      }),
      new TableRow({
        children: [
          cell("Allocate mark & Percentage", { bold: true, align: "center" }),
          cell("25%", { bold: true, align: "center" }),
          cell("50%", { bold: true, align: "center" }),
          cell("75%", { bold: true, align: "center" }),
          cell("100%", { bold: true, align: "center" }),
          cell(String(total), { bold: true, align: "center" }),
        ],
      }),
      ...criteriaOf(data.type).map(
        ([label, mark]) =>
          new TableRow({
            children: [
              cell(label, { bold: true }),
              cell(String(mark), { bold: true, align: "center" }),
              cell(""), cell(""), cell(""), cell(""),
            ],
          }),
      ),
      new TableRow({
        children: [cell("Total obtained mark", { bold: true, align: "right", cs: 5 }), cell("")],
      }),
      new TableRow({
        children: [cell("Comments", { bold: true, height: 1400 }), cell("", { cs: 5 })],
      }),
    ],
  });

  const info = (label: string, value: string) =>
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: `${label}: `, bold: true }), new TextRun(value)],
    });

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 } } },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new ImageRun({
                type: "png",
                data: logoBuf,
                transformation: { width: 180, height: 180 },
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 400 },
            children: [new TextRun({ text: titleOf(data.type), size: 56 })],
          }),
          table,
          new Paragraph({
            spacing: { before: 400, after: 120 },
            children: [new TextRun({ text: `Semester: ${data.semester}`, bold: true, size: 28 })],
          }),
          info("Student Name", data.studentName),
          ...(showId ? [info("Student ID", data.studentId)] : []),
          info("Batch", `${data.batch}        Section: ${data.section}`),
          info("Course Code", data.courseCode),
          info("Course Name", data.courseName),
          info(teacherLabel, data.teacherName),
          info("Designation", data.designation),
          info("Submission Date", data.submissionDate),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  await saveBlob(blob, `${fileBase(data)}.docx`);
}
