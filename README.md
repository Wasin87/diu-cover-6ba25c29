# Diu-Cover

uporar image ar item gular moto moto cover page generate kora diba . cover page ar logo ar jonno logo ta dissi aita add korba perfectly javaba coverpage a add kora asa same oivaba. You are an expert full-stack web developer and UI/UX designer. Build a complete, single-file HTML website (all CSS and JS inline) that generates university cover pages for Daffodil International University. This is a professional, animated, lime-and-white themed cover page generator.

---

## 🎨 THEME & DESIGN SYSTEM

- **Primary colors**: Lime green (#84CC16, #65A30D, #A3E635) and White (#FFFFFF, #F7FEE7)
- **Accents**: Deep green (#166534), soft lime tint (#ECFCCB)
- **Font**: Use Google Fonts — "Playfair Display" for headings, "DM Sans" for body
- **Style**: Luxury-editorial meets academic — clean, crisp, with subtle geometric lime patterns, glowing lime borders, frosted glass cards, smooth animated transitions
- **Background**: White with a subtle lime dot-grid or mesh gradient overlay
- **Cards**: Frosted glass effect with lime border-left accent and soft shadow
- **Buttons**: Lime gradient with white text, hover lift animation, ripple effect on click

---

## 📱 FULL RESPONSIVENESS — ALL DEVICES

- Mobile (< 640px): Single column, bottom mobile nav bar (fixed, 5 icons)
- Tablet (640px–1024px): Adaptive 2-column grid where appropriate
- Desktop (> 1024px): Full multi-column layout with sidebar or top nav
- **Mobile bottom navigation bar** (fixed, z-index 9999): 
  - Icons: Home, Lab Report, Assignment, Lab Final, Download
  - Active state: lime background pill highlight
  - Smooth tap animation

---

## 🗂️ THREE COVER PAGE TYPES (as selectable options)

Show 3 animated card options at the top. User clicks one to select it. Selected card gets a glowing lime border.

### Option 1: Lab Report
- Fields: Semester, Student Name, Student ID, Batch, Section, Course Code, Course Name, Course Teacher Name, Designation, Submission Date
- Grading table: Understanding/Analysis (7), Implementation (8), Report Writing (10) — Total Mark: 25
- Grade columns: Needs Improvement (25%), Developing (50%), Sufficient (75%), Above Average (100%)

### Option 2: Course Assignment Report
- Fields: Semester, Student Name, Batch, Section, Course Code, Course Name, Course Teacher Name, Designation, Submission Date
- Grading table: Content Quality (2), Clarity (1), Spelling & Grammar (1), Organization and Formatting (1) — Total Mark: 5
- Same grade columns

### Option 3: Lab Final
- Fields: Semester, Student Name, Student ID, Batch, Section, Course Code, Course Name, Teacher Name, Designation, Submission Date
- Grading table: Understanding (10), Analysis (15), Implementation (10), Report Writing (5) — Total Mark: 40
- Same grade columns

---

## 📝 FORM UI

After selecting a cover page type, show a smooth animated form (slide-in from right):
- Each input has a floating label animation (label floats up when focused/filled)
- Input fields: lime bottom-border focus style, rounded, white background with lime tint on focus
- Inputs are grouped logically in sections (e.g., "Student Info", "Course Info", "Submission Details")
- A large lime "✨ Generate Cover Page" button at the bottom with a shimmer animation

---

## ⚡ LOADING ANIMATION (after clicking Generate)

- Full-screen animated loading overlay
- Centered Daffodil University logo placeholder (DIU shield icon using CSS/SVG)
- Animated lime progress bar (top of screen)
- Spinning lime gradient ring around a document icon
- Floating lime particles/dots rising upward
- Text: "Generating your cover page..." with a typewriter animation
- Duration: ~2 seconds, then fade out and show the result

---

## 📄 GENERATED COVER PAGE

Replicate EXACTLY the layout from these three Daffodil International University cover pages:

**ALL three share this structure:**
1. Top: DIU logo (shield + "Daffodil International University" wordmark in lime/dark green)
2. Title: "Lab Report" / "Course Assignment Report" / "Lab Final" — centered, large serif font
3. "Only for course Teacher" bordered table with grading criteria:
   - Header row: [blank] | Needs Improvement | Developing | Sufficient | Above Average | Total Mark
   - Row: Allocate mark & Percentage | 25% | 50% | 75% | 100% | [total]
   - Criterion rows with allocated marks
   - "Total obtained mark" row
   - "Comments" large cell at bottom
4. Below table: Student details in bold-label format:
   - Semester | Student Name | Student ID | Batch | Section | Course Code | Course Name | Course Teacher Name | Designation | Submission Date
5. The generated page must look like a real printed A4 document — white background, black text, clean borders

**DIU Logo**: Render using HTML/CSS or inline SVG — a shield shape with "DIU" text inside, beside "Daffodil International University" in lime and dark green

---

## 💾 DOWNLOAD OPTIONS

After cover page generates, show a download toolbar with 5 buttons:
1. **PDF** — use html2pdf.js (CDN) to export the cover page div as PDF (A4 size)
2. **PNG** — use html2canvas (CDN) to capture as PNG image
3. **JPG** — same as PNG but JPEG format
4. **Word (.doc)** — generate a .doc blob using Blob and msSaveBlob or anchor download
5. **DOCX** — use docx.js (CDN) or generate a proper .docx structure

For **mobile**: after download, trigger the browser's native share/save dialog so the file goes directly to Gallery (for images) or Files app.

Download buttons: pill-shaped, each with unique lime-shade, icon + label, hover scale animation.

---

## 🏗️ TECHNICAL IMPLEMENTATION

```html
<!-- CDN Libraries to include -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
```

- All in ONE HTML file
- CSS variables for the entire color system
- Smooth page transitions using CSS @keyframes
- Mobile-first media queries
- `@media print` styles for clean PDF output
- Cover page preview area: scrollable, centered, A4 ratio (794px × 1123px at screen scale)
- Responsive scale transform for mobile preview

---

## 📐 COVER PAGE EXACT LAYOUT SPEC  ---

## ✅ QUALITY CHECKLIST

- [ ] All 3 cover types selectable with animated card UI

- [ ] Floating label inputs for each field

- [ ] Animated loading screen (2s) before showing result

- [ ] Generated cover page matches A4 layout exactly

- [ ] PDF download works (A4 size, print-ready)

- [ ] PNG/JPG download saves to device gallery on mobile

- [ ] Word/DOCX download works

- [ ] Mobile bottom nav bar (fixed, 5 tabs)

- [ ] Tablet and desktop responsive

- [ ] Lime + white color scheme throughout

- [ ] Playfair Display + DM Sans fonts

- [ ] No errors in console

- [ ] Single HTML file, no external files needed except CDNs

Generate the complete, fully working single HTML file now.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://diu-cover.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/19aa621e-1622-48e4-b2b0-3cfc1f59c257).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
