'use client';

import React, { useState, useRef } from 'react';
import ImageCropper from './ImageCropper';

interface PhotoUploaderProps {
  name: string;
  label?: string;
  aspect?: number;
  existingUrl?: string | null;
}

export default function PhotoUploader({ name, label = "Foto", aspect = 3 / 4, existingUrl }: PhotoUploaderProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
    }
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setPreviewUrl(croppedUrl);
    setSelectedImage(null);

    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([croppedBlob], `${name}_cropped.jpg`, { type: 'image/jpeg' }));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleCancelCrop = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px' }}>{label}</label>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {previewUrl && (
          <img 
            src={previewUrl} 
            alt="Preview" 
            style={{ width: aspect === 1 ? '120px' : '120px', height: aspect === 1 ? '120px' : '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        )}
        
        <div style={{ flex: 1 }}>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}
            required={!previewUrl} // Only required if there's no existing photo
          />
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Pilih foto untuk di-crop (Rasio {aspect === 1 ? '1:1' : '3:4'} disarankan).
          </p>
        </div>
      </div>

      <input 
        type="file" 
        name={name} 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
      />

      {selectedImage && (
        <ImageCropper 
          imageSrc={selectedImage} 
          aspect={aspect} 
          onCropComplete={handleCropComplete} 
          onCancel={handleCancelCrop} 
        />
      )}
    </div>
  );
}
