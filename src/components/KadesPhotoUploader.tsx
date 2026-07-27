'use client';

import React, { useState, useRef } from 'react';
import ImageCropper from './ImageCropper';

export default function KadesPhotoUploader({ existingUrl }: { existingUrl?: string }) {
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
    // Show preview
    const croppedUrl = URL.createObjectURL(croppedBlob);
    setPreviewUrl(croppedUrl);
    setSelectedImage(null); // Close cropper modal

    // Inject the Blob into the hidden file input
    if (fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File([croppedBlob], 'kades.jpg', { type: 'image/jpeg' }));
      fileInputRef.current.files = dataTransfer.files;
    }
  };

  const handleCancelCrop = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; // Reset input so user can re-select same file
    }
  };

  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Foto Kepala Desa</label>
      
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {previewUrl && (
          <img 
            src={previewUrl} 
            alt="Preview Kades" 
            style={{ width: '120px', height: '160px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #cbd5e1' }}
          />
        )}
        
        <div style={{ flex: 1 }}>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleFileChange}
            style={{ width: '100%', padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}
          />
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
            Pilih foto untuk di-crop (Rasio 3:4 disarankan).
          </p>
        </div>
      </div>

      {/* Hidden input to hold the cropped file for Server Action */}
      <input 
        type="file" 
        name="fotoKades" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
      />

      {selectedImage && (
        <ImageCropper 
          imageSrc={selectedImage} 
          aspect={3 / 4} 
          onCropComplete={handleCropComplete} 
          onCancel={handleCancelCrop} 
        />
      )}
    </div>
  );
}
