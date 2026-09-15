import React, { useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';

interface ImageCropperProps {
  value: string;
  onChange: (base64: string) => void;
  className?: string;
}

export function ImageCropper({ value, onChange, className = '' }: ImageCropperProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');

  const TARGET_SIZE = 300;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file.');
      return;
    }

    setError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = TARGET_SIZE;
        canvas.height = TARGET_SIZE;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Calculate cover crop dimensions
        const scale = Math.max(TARGET_SIZE / img.width, TARGET_SIZE / img.height);
        const x = (TARGET_SIZE / scale - img.width) / 2;
        const y = (TARGET_SIZE / scale - img.height) / 2;

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, TARGET_SIZE, TARGET_SIZE);
        
        ctx.save();
        ctx.scale(scale, scale);
        ctx.drawImage(img, x, y);
        ctx.restore();

        // Output base64
        const base64 = canvas.toDataURL('image/jpeg', 0.9);
        onChange(base64);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = ''; // Reset input
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      <div className="relative group">
        {/* Image Preview Container */}
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-primary-50 border-4 border-white shadow-md flex items-center justify-center relative">
          {value ? (
            <img src={value} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <Camera className="w-10 h-10 text-primary-200" />
          )}
          
          {/* Hover Overlay */}
          <div 
            className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Remove Button */}
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -right-2 top-0 bg-red-500 text-white p-1.5 rounded-full shadow-sm hover:bg-red-600 transition-colors"
            title="Remove photo"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="text-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {value ? 'Change Photo' : 'Upload Photo'}
        </button>
        <p className="text-xs text-gray-500 mt-1">
          Auto-resized to 300x300. Max 5MB.
        </p>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />
    </div>
  );
}
