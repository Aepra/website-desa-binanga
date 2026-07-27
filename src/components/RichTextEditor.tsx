'use client';

import dynamic from 'next/dynamic';
import React, { useState, useEffect } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false, 
  loading: () => <div style={{ height: '200px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '16px', color: '#64748b' }}>Memuat Editor Teks...</div> 
});

interface RichTextEditorProps {
  name: string;
  defaultValue: string;
  placeholder?: string;
}

export default function RichTextEditor({ name, defaultValue, placeholder }: RichTextEditorProps) {
  const [value, setValue] = useState(defaultValue || '');

  // We use a hidden input to pass the quill value to the server action form
  return (
    <div className="rich-text-editor-container">
      <input type="hidden" name={name} value={value} />
      <ReactQuill 
        theme="snow" 
        value={value} 
        onChange={setValue} 
        placeholder={placeholder}
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['clean']
          ]
        }}
        style={{ background: '#fff' }}
      />
      <style jsx global>{`
        .rich-text-editor-container .ql-container {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
          min-height: 150px;
          font-family: inherit;
          font-size: 1rem;
        }
        .rich-text-editor-container .ql-toolbar {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
          background: #f8fafc;
        }
        .rich-text-editor-container .ql-editor {
          min-height: 150px;
        }
      `}</style>
    </div>
  );
}
