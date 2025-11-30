// server/services/pdfService.js
import PDFDocument from "pdfkit";

/**
 * Create a PDF for a report and pipe it to the response.
 */
export const streamReportPdf = (report, res) => {
  const doc = new PDFDocument({ margin: 40 });

  // Set headers for download
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="report-${report._id}.pdf"`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  // Title
  doc.fontSize(20).text("Medical Report Summary", { align: "center" });
  doc.moveDown();

  // Summary
  doc.fontSize(14).text("Summary", { underline: true });
  doc.moveDown(0.5);
  doc.fontSize(12).text(report.summary || "No summary.");
  doc.moveDown();

  // Medical terms
  if (report.medicalTerms?.length) {
    doc.fontSize(14).text("Key Medical Terms", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12);
    report.medicalTerms.forEach((term) => {
      doc.text(`• ${term}`);
    });
    doc.moveDown();
  }

  // Raw text (optional)
  if (report.rawText) {
    doc.addPage();
    doc.fontSize(14).text("Original Report Text", { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(10).text(report.rawText);
  }

  doc.end();
};
