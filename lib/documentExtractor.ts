const MAX_TEXT_LENGTH = 50_000;

/**
 * Extract text from an Excel spreadsheet (.xlsx, .xls) using SheetJS.
 */
async function extractTextFromSpreadsheet(file: File): Promise<string> {
  const XLSX = (await import('xlsx')).default;
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: 'array' });

  const lines: string[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet);
    lines.push(`--- Sheet: ${sheetName} ---`);
    lines.push(csv);
  }

  const text = lines.join('\n');
  return text.slice(0, MAX_TEXT_LENGTH);
}

/**
 * Extract text from a CSV file using native text reading.
 */
async function extractTextFromCSV(file: File): Promise<string> {
  const text = await file.text();
  return text.slice(0, MAX_TEXT_LENGTH);
}

/**
 * Extract text from a DOCX file using mammoth.
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  const mammoth = (await import('mammoth')).default;
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value.slice(0, MAX_TEXT_LENGTH);
}

/**
 * Router function: dispatch text extraction by file extension.
 */
export async function extractTextFromDocument(file: File): Promise<string> {
  const name = file.name.toLowerCase();

  if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
    return extractTextFromSpreadsheet(file);
  }
  if (name.endsWith('.csv')) {
    return extractTextFromCSV(file);
  }
  if (name.endsWith('.docx')) {
    return extractTextFromDOCX(file);
  }

  throw new Error(`Unsupported file type: ${name}`);
}
