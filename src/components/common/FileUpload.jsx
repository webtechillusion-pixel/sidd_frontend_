import React, { useState, useRef } from 'react';
import { Upload, X, Image, FileText, CheckCircle } from 'lucide-react';

const FileUpload = ({
  label,
  name,
  accept = 'image/*,.pdf',
  multiple = false,
  maxSize = 5, // in MB
  required = false,
  value = [],
  onChange,
  onError,
  preview = true,
  className = '',
}) => {
  const [files, setFiles] = useState(value);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      throw new Error(`File size should be less than ${maxSize}MB`);
    }

    // Check file type
    const acceptedTypes = accept.split(',');
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    
    if (accept !== '*/*') {
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase();
        }
        if (type.includes('/*')) {
          const mainType = type.split('/')[0];
          return file.type.startsWith(mainType);
        }
        return file.type === type;
      });

      if (!isAccepted) {
        throw new Error(`File type not allowed. Accepted: ${accept}`);
      }
    }

    return true;
  };

  const handleFileChange = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = [];
    const errors = [];

    fileArray.forEach(file => {
      try {
        validateFile(file);
        validFiles.push(file);
      } catch (error) {
        errors.push(`${file.name}: ${error.message}`);
      }
    });

    if (errors.length > 0) {
      onError?.(errors.join(', '));
    }

    const newFiles = multiple ? [...files, ...validFiles] : validFiles;
    setFiles(newFiles);
    onChange?.(multiple ? newFiles : newFiles[0] || null);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    if (e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange?.(multiple ? newFiles : newFiles[0] || null);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <Image className="h-8 w-8 text-blue-500" />;
    }
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    return <FileText className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
          dragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          <span className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
            Click to upload
          </span>{' '}
          or drag and drop
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {multiple ? 'Multiple files allowed' : 'Single file only'} • Max {maxSize}MB
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {accept === 'image/*' ? 'Images only' : `Accepted: ${accept}`}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
          required={required && files.length === 0}
        />
      </div>

      {files.length > 0 && preview && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">
            Selected Files ({files.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0">
                    {getFileIcon(file)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="ml-3 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;