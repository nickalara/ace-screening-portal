import React, { useRef, useState } from 'react';
import { Upload, File, CheckCircle, X } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  error?: string;
  currentFile?: File | null;
}

export function FileUpload({ onFileSelect, error, currentFile }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      onFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">
        Resume Upload
        <span className="text-error-600 ml-1">*</span>
      </label>

      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200
          ${isDragging ? 'border-blue-600 bg-blue-100 scale-[1.02]' : ''}
          ${error ? 'border-error-600 bg-error-50' : !currentFile ? 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50' : 'border-success-600 bg-success-50'}
        `}
      >
        {!currentFile ? (
          <>
            <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
            <p className="text-base font-medium text-slate-700 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-slate-500">PDF, DOC, or DOCX (max 5MB)</p>
          </>
        ) : (
          <>
            <File className="w-12 h-12 mx-auto mb-4 text-success-600" />
            <p className="text-base font-medium text-slate-900 mb-1 truncate max-w-md mx-auto">
              {currentFile.name}
            </p>
            <p className="text-sm text-slate-600 mb-3">{formatFileSize(currentFile.size)}</p>
            <CheckCircle className="w-8 h-8 mx-auto mb-3 text-success-600" />
            <button
              type="button"
              onClick={handleRemove}
              className="inline-flex items-center gap-1 text-sm text-error-600 hover:underline"
            >
              <X className="w-4 h-4" />
              Remove file
            </button>
          </>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Upload resume"
        />
      </div>

      {error && (
        <p className="text-xs text-error-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
