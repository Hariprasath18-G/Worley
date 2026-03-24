'use client';

/**
 * PDF.js text extraction utility.
 * Runs client-side only.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist');

  // Use local worker file copied from node_modules/pdfjs-dist/build/
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

  const arrayBuffer = await file.arrayBuffer();

  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  const textParts: string[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .filter((item) => 'str' in item)
      .map((item) => (item as { str: string }).str)
      .join(' ');
    textParts.push(pageText);
  }

  const fullText = textParts.join('\n\n');

  // Truncate to 50,000 characters to avoid exceeding API limits
  if (fullText.length > 50000) {
    return fullText.slice(0, 50000);
  }

  return fullText;
}
