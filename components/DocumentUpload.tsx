'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { extractTextFromPDF } from '@/lib/pdfExtractor';
import { extractTextFromDocument } from '@/lib/documentExtractor';
import type { AssetProfile } from '@/lib/types';

interface DocumentUploadProps {
  onExtractedData: (data: Partial<AssetProfile>) => void;
  isExtracting: boolean;
  onExtractionStart: () => void;
  onExtractionEnd: () => void;
  onError: (message: string) => void;
}

type UploadState = 'default' | 'dragover' | 'selected' | 'extracting' | 'success' | 'error';

/**
 * Drag-and-drop document upload zone with extraction trigger.
 * Extracts text from documents and sends to AI for auto-population.
 */
export default function DocumentUpload({
  onExtractedData,
  isExtracting,
  onExtractionStart,
  onExtractionEnd,
  onError,
}: DocumentUploadProps) {
  const [state, setState] = useState<UploadState>('default');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const SUPPORTED_EXTENSIONS = ['.pdf', '.xlsx', '.xls', '.csv', '.docx'];

  const handleFile = useCallback(
    async (file: File) => {
      const fileName = file.name.toLowerCase();
      const isSupported = SUPPORTED_EXTENSIONS.some((ext) => fileName.endsWith(ext));
      if (!isSupported) {
        setErrorMessage('Unsupported file type. PDF, Excel, CSV, and Word documents are supported.');
        setState('error');
        return;
      }

      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      setState('extracting');
      onExtractionStart();

      try {
        // Extract text from document client-side
        const isPDF = fileName.endsWith('.pdf');
        const text = isPDF
          ? await extractTextFromPDF(file)
          : await extractTextFromDocument(file);

        if (!text || text.trim().length === 0) {
          throw new Error('No extractable text found in this PDF. The file may contain only images.');
        }

        // Send extracted text to API for parsing
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            analysisType: 'extractProfile',
            assetProfile: { documentText: text },
          }),
        });

        const result = await response.json();

        if (result.success) {
          onExtractedData(result.data);
          setState('success');
          // Show success state briefly then switch to selected
          setTimeout(() => {
            setState('selected');
          }, 1500);
        } else {
          throw new Error(result.error || 'Failed to extract data from document.');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Could not extract text from this document. Please enter data manually.';
        setErrorMessage(message);
        setState('error');
        onError(message);
      } finally {
        onExtractionEnd();
      }
    },
    [onExtractedData, onExtractionStart, onExtractionEnd, onError]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => (prev === 'extracting' || prev === 'success' ? prev : 'dragover'));
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setState((prev) => (prev === 'extracting' || prev === 'success' ? prev : 'default'));
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleRemove = useCallback(() => {
    setState('default');
    setFileName('');
    setFileSize('');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const handleRetry = useCallback(() => {
    setState('default');
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  const borderClasses: Record<UploadState, string> = {
    default: 'border-2 border-dashed border-worley-input-border',
    dragover: 'border-2 border-dashed border-worley-orange bg-worley-teal-lightest',
    selected: 'border-2 border-dashed border-worley-input-border',
    extracting: 'border border-solid border-worley-orange',
    success: 'border-2 border-dashed border-worley-teal',
    error: 'border-2 border-dashed border-worley-red/60',
  };

  return (
    <div
      className={`flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl bg-white p-8 text-center transition-colors duration-200 ${borderClasses[state]}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => state !== 'extracting' && fileInputRef.current?.click()}
      role="button"
      tabIndex={0}
      aria-label="Upload asset document"
      aria-busy={isExtracting}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && state !== 'extracting') {
          fileInputRef.current?.click();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.xlsx,.xls,.csv,.docx"
        className="hidden"
        onChange={handleFileSelect}
        aria-describedby="upload-hint"
      />

      {state === 'default' || state === 'dragover' ? (
        <>
          <Upload
            className={`mb-3 h-10 w-10 transition-colors duration-200 ${
              state === 'dragover' ? 'text-worley-orange' : 'text-worley-text-muted'
            }`}
          />
          <p className="text-base font-medium text-worley-text-secondary">
            Drag and drop asset documents
          </p>
          <p className="mt-1 text-sm text-worley-text-muted">or click to browse</p>
          <p id="upload-hint" className="mt-2 text-xs text-worley-text-muted">
            PDF, Excel, CSV, and Word documents supported
          </p>
        </>
      ) : state === 'extracting' ? (
        <>
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-worley-orange" />
          <p className="text-sm font-medium text-worley-orange" aria-live="polite">
            AI extracting asset data...
          </p>
          <p className="mt-1 text-xs text-worley-text-muted">This may take a few seconds</p>
        </>
      ) : state === 'success' ? (
        <>
          <CheckCircle className="mb-3 h-8 w-8 text-worley-teal" />
          <p className="text-sm font-medium text-worley-teal" aria-live="polite">
            Data extracted successfully
          </p>
        </>
      ) : state === 'error' ? (
        <>
          <AlertCircle className="mb-3 h-8 w-8 text-worley-red" />
          <p className="text-sm text-worley-red">{errorMessage}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRetry();
            }}
            className="mt-2 text-xs font-medium text-worley-orange underline-offset-2 hover:underline"
          >
            Try again
          </button>
        </>
      ) : state === 'selected' ? (
        <>
          <FileText className="mb-3 h-6 w-6 text-worley-orange" />
          <p className="text-sm font-medium text-worley-text-primary">{fileName}</p>
          <p className="mt-0.5 text-xs text-worley-text-muted">{fileSize}</p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRemove();
            }}
            className="mt-2 text-xs text-worley-red underline-offset-2 hover:underline"
          >
            Remove
          </button>
        </>
      ) : null}
    </div>
  );
}
