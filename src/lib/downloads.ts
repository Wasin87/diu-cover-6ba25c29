import { TOTAL, type CoverData } from "@/components/CoverPage";
import diuLogo from "@/assets/diu-logo.png";

type GeneratedData = CoverData & {
  extraText: string;
  images: { id: string; dataUrl: string; name: string }[];
};

export const fileBase = (data: CoverData) =>
  `${data.type}-${(data.studentName || "student").replace(/\s+/g, "_")}`;

// Mobile-friendly save: try Web Share with files, fall back to anchor download
async function saveBlob(blob: Blob, filename: string) {
  const file = new File([blob], filename, { type: blob.type });
  const nav = navigator as Navigator & {
    canShare?: (d: { files: File[] }) => boolean;
    share?: (d: { files: File[]; title?: string }) => Promise<void>;
  };
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile && nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
    try {
      await nav.share({ files: [file], title: filename });
      return;
    } catch {
      // user cancelled or failed -> fall back
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

// Render a single .doc-page DOM element to a canvas data URL
async function renderElToImage(el: HTMLElement): Promise<string> {
  const html2canvas = (await import("html2canvas")).default;
  const canvas = await html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });
  return canvas.toDataURL("image/jpeg", 0.95);
}

// Get image natural size from a data URL
function imageSize(src: string): Promise<{ w: number; h: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = reject;
    img.src = src;
  });
}

export async function downloadPDF(data: GeneratedData, textPages: string[]) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });
  const pageW = pdf.internal.pageSize.getWidth(); // 210
  const pageH = pdf.internal.pageSize.getHeight(); // 297

  // Collect every .doc-page in DOM order (cover + images + text)
  const nodes = Array.from(
    document.querySelectorAll<HTMLElement>(".doc-page"),
  );
  if (!nodes.length) throw new Error("Nothing to export");

  for (let i = 0; i < nodes.length; i++) {
    const img = await renderElToImage(nodes[i]);
    if (i > 0) pdf.addPage();
    pdf.addImage(img, "JPEG", 0, 0, pageW, pageH, undefined, "FAST");
  }

  // Touch unused values to avoid lint warnings (these are intentionally unused)
  void data;
  void textPages;

  const blob = pdf.output("blob");
  await saveBlob(blob, `${fileBase(data)}.pdf`);
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

function dataUrlToUint8(dataUrl: string): Uint8Array {
  const base64 = dataUrl.split(",")[1] || "";
  const bin = atob(base64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

function imageMime(dataUrl: string): "png" | "jpg" | "gif" | "bmp" {
  if (dataUrl.startsWith("data:image/png")) return "png";
  if (dataUrl.startsWith("data:image/gif")) return "gif";
  if (dataUrl.startsWith("data:image/bmp")) return "bmp";
  return "jpg";
}

export async function downloadDocx(data: GeneratedData, textPages: string[]) {
  const docxMod = await import("docx");
  const {
    Document,
    Packer,
    Paragraph,
    TextRun,
    Table,
    TableRow,
    TableCell,
    ImageRun,
    AlignmentType,
    WidthType,
    BorderStyle,
    HeightRule,
    PageBreak,
    HeadingLevel,
  } = docxMod;

  const total = TOTAL[data.type];
  const teacherLabel = data.type === "lab-final" ? "Teacher Name" : "Course Teacher Name";
  const showId = data.type !== "assignment";

  // Logo
  const logoDataUrl = await getLogoBase64();
  const logoBuf = dataUrlToUint8(logoDataUrl);

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

  const gradingTable = new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [2200, 1500, 1300, 1300, 1500, 1226],
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
      children: [
        new TextRun({ text: `${label}: `, bold: true, size: 26 }),
        new TextRun({ text: value, size: 26 }),
      ],
    });

  const coverChildren = [
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
    gradingTable,
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
  ];

  // Image pages — one per image, each preceded by page break
  const imageChildren: InstanceType<typeof Paragraph>[] = [];
  for (let i = 0; i < data.images.length; i++) {
    const img = data.images[i];
    const { w, h } = await imageSize(img.dataUrl);
    // Fit into ~480x650 px area while preserving aspect
    const maxW = 480;
    const maxH = 650;
    const ratio = Math.min(maxW / w, maxH / h, 1);
    const dispW = Math.max(80, Math.round(w * ratio));
    const dispH = Math.max(80, Math.round(h * ratio));

    imageChildren.push(
      new Paragraph({
        children: [new PageBreak()],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 200 },
        children: [
          new ImageRun({
            type: imageMime(img.dataUrl),
            data: dataUrlToUint8(img.dataUrl),
            transformation: { width: dispW, height: dispH },
          }),
        ],
      }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({ text: `Figure ${i + 1}`, italics: true, size: 22 }),
        ],
      }),
    );
  }

  // Text pages
  const textChildren: InstanceType<typeof Paragraph>[] = [];
  for (let p = 0; p < textPages.length; p++) {
    textChildren.push(new Paragraph({ children: [new PageBreak()] }));
    const paragraphs = textPages[p].split(/\n{2,}/);
    for (const para of paragraphs) {
      const lines = para.split("\n");
      textChildren.push(
        new Paragraph({
          alignment: AlignmentType.JUSTIFIED,
          spacing: { after: 200, line: 360 },
          children: lines.flatMap((line, idx) => {
            const runs: InstanceType<typeof TextRun>[] = [
              new TextRun({ text: line, size: 24 }),
            ];
            if (idx < lines.length - 1) {
              runs.push(new TextRun({ text: "", break: 1 }));
            }
            return runs;
          }),
        }),
      );
    }
  }

  const doc = new Document({
    styles: {
      default: {
        document: { run: { font: "Times New Roman", size: 24 } },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          quickFormat: true,
          run: { size: 32, bold: true, font: "Times New Roman" },
          paragraph: { spacing: { before: 240, after: 240 }, outlineLevel: 0 },
        },
      ],
    },
    sections: [
      {
        properties: {
          page: {
            size: { width: 11906, height: 16838 },
            margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 },
          },
        },
        children: [...coverChildren, ...imageChildren, ...textChildren],
      },
    ],
  });

  // Suppress unused warning
  void HeadingLevel;

  const blob = await Packer.toBlob(doc);
  await saveBlob(blob, `${fileBase(data)}.docx`);
}
