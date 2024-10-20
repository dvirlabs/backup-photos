import React, { useState } from 'react';
import { Upload } from 'lucide-react';

const PhotoUploader = ({ onUploadComplete }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Reset states
      setSelectedFile(file);
      setUploadError(null);
      setUploadProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('http://localhost:8000/upload_photo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Clear the selected file and reset states
      setSelectedFile(null);
      setUploadProgress(100);
      
      // Notify parent component that upload is complete
      if (onUploadComplete) {
        onUploadComplete();
      }

      // Reset progress after a short delay
      setTimeout(() => {
        setUploadProgress(0);
        setUploading(false);
      }, 1500);

    } catch (error) {
      setUploadError(error.message);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 border rounded-lg bg-white shadow-sm">
      <div className="w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
          />
        </label>
      </div>

      {selectedFile && (
        <div className="w-full">
          <p className="text-sm text-gray-600 mb-2">
            Selected: {selectedFile.name}
          </p>
          <button
            onClick={handleUpload}
            disabled={uploading}
            className={`w-full px-4 py-2 text-white rounded-lg ${
              uploading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {uploading ? 'Uploading...' : 'Upload Photo'}
          </button>
        </div>
      )}

      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {uploadError && (
        <div className="w-full p-3 bg-red-100 text-red-700 rounded-lg">
          {uploadError}
        </div>
      )}
    </div>
  );
};

export default PhotoUploader;