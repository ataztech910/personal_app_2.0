import { resume } from "@/lib/resume-data";

// Browser-only: imported on click so jsPDF never enters the server bundle.
// PDF colors are print colors, independent from the screen theme.
export async function downloadResumePdf() {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  const width = doc.internal.pageSize.getWidth() - margin * 2;
  const bottom = doc.internal.pageSize.getHeight() - margin;
  let y = margin;

  const write = (text: string, size = 10, bold = false, color: [number, number, number] = [17, 17, 17], gap = 4) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, width) as string[];
    for (const line of lines) {
      if (y + size > bottom) {
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y + size);
      y += size * 1.3;
    }
    y += gap;
  };
  const green: [number, number, number] = [10, 125, 69];
  const heading = (t: string) => {
    y += 10;
    write(t, 11, true, green, 2);
  };

  write(resume.name, 24, true, undefined, 2);
  write(resume.title, 11, false, green, 0);
  write(`${resume.location} · ${resume.languages} · ${resume.website}`, 9, false, [85, 85, 85]);
  heading("Summary");
  write(resume.summary);
  heading("Focus areas");
  resume.focus.forEach((f) => write(`${f.t}: ${f.d}`, 10, false, undefined, 2));
  heading("Conference talks");
  resume.talks.forEach((t) => write(`• ${t}`, 10, false, undefined, 2));
  heading("Books");
  resume.books.forEach((t) => write(`• ${t}`, 10, false, undefined, 2));
  heading("Products");
  resume.projects.forEach((t) => write(`• ${t}`, 10, false, undefined, 2));

  doc.save("Andrei-Tazetdinov-CV.pdf");
}
