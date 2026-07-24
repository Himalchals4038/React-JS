import React, { useState, useRef } from 'react';
import { UploadCloud, X, FileAudio, CheckCircle } from 'lucide-react';

export function LocalImportModal({ isOpen, onClose, onImportTracks }) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [importedList, setImportedList] = useState([]);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFiles = (files) => {
    const validTracks = [];
    Array.from(files).forEach((file, idx) => {
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|flac|aac)$/i)) {
        const audioUrl = URL.createObjectURL(file);
        
        // Format clean title and artist from filename
        let rawName = file.name.replace(/\.[^/.]+$/, '');
        let title = rawName;
        let artist = 'Local Artist';

        if (rawName.includes('-')) {
          const parts = rawName.split('-');
          artist = parts[0].trim();
          title = parts.slice(1).join('-').trim();
        }

        validTracks.push({
          id: `local-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
          title: title || 'Untitled Audio',
          artist: artist,
          genre: 'Local Track',
          coverArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80',
          audioUrl: audioUrl,
          duration: 180,
          source: 'local',
          fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        });
      }
    });

    if (validTracks.length > 0) {
      setImportedList(prev => [...prev, ...validTracks]);
      onImportTracks(validTracks);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            <UploadCloud className="brand-icon" size={24} />
            Import Local Audio Files
          </h3>
          <button className="ctrl-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Drag & Drop Zone */}
        <div
          className={`dropzone ${isDragActive ? 'drag-active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud size={48} className="dropzone-icon" />
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '4px' }}>
              Drag & Drop your music files here
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Supports MP3, WAV, OGG, M4A, FLAC format files
            </p>
          </div>
          <button className="btn btn-primary" style={{ marginTop: '8px' }}>
            Browse Audio Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        {/* Imported Summary List */}
        {importedList.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--color-primary)' }}>
              Successfully Imported ({importedList.length} tracks):
            </h4>
            <div style={{ maxHeight: '140px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {importedList.map(t => (
                <div
                  key={t.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FileAudio size={16} color="var(--color-primary)" />
                    <span style={{ fontWeight: '600' }}>{t.title}</span>
                    <span style={{ color: 'var(--text-muted)' }}>({t.artist})</span>
                  </div>
                  <CheckCircle size={16} color="var(--color-success)" />
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Done & Play
          </button>
        </div>
      </div>
    </div>
  );
}
