import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { EvaluationPhoto } from '../../types';

interface PhotoUploadProps {
  photos: EvaluationPhoto[];
  maxPhotos?: number;
  onUpload: (files: File[]) => Promise<void>;
  onDelete: (photoId: string) => Promise<void>;
  isUploading?: boolean;
}

export default function PhotoUpload({
  photos,
  maxPhotos = 10,
  onUpload,
  onDelete,
  isUploading = false,
}: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = maxPhotos - photos.length;

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (file) => file.type.startsWith('image/')
      );

      if (droppedFiles.length > 0) {
        const filesToUpload = droppedFiles.slice(0, remainingSlots);
        await onUpload(filesToUpload);
      }
    },
    [remainingSlots, onUpload]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = e.target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      const imageFiles = Array.from(selectedFiles).filter((file) =>
        file.type.startsWith('image/')
      );

      if (imageFiles.length > 0) {
        const filesToUpload = imageFiles.slice(0, remainingSlots);
        await onUpload(filesToUpload);
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [remainingSlots, onUpload]
  );

  const handleDelete = async (photoId: string) => {
    setDeletingId(photoId);
    try {
      await onDelete(photoId);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Photos ({photos.length}/{maxPhotos})
        </label>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={photo.storagePath}
                alt={photo.caption || 'Section photo'}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => handleDelete(photo.id)}
                disabled={deletingId === photo.id}
                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {remainingSlots > 0 && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging
              ? 'border-primary-400 bg-primary-50'
              : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
          } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-2">
            {isUploading ? (
              <>
                <div className="w-10 h-10 border-4 border-primary-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-600">Uploading photos...</p>
              </>
            ) : (
              <>
                {isDragging ? (
                  <ImageIcon className="w-10 h-10 text-primary-400" />
                ) : (
                  <Upload className="w-10 h-10 text-gray-400" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Drag & drop or click to upload
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Max {remainingSlots} more {remainingSlots === 1 ? 'photo' : 'photos'}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {photos.length >= maxPhotos && (
        <p className="text-xs text-gray-500 text-center">
          Maximum number of photos reached
        </p>
      )}
    </div>
  );
}
