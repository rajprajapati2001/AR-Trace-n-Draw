import React from 'react';
import { X, Download, Share2, Check } from 'lucide-react';

interface SnapshotModalProps {
  dataUrl: string | null;
  onClose: () => void;
  sketchTitle: string;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  dataUrl,
  onClose,
  sketchTitle,
}) => {
  if (!dataUrl) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `ar-sketch-${sketchTitle.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Captured Drawing Progress</h3>
            <p className="text-xs text-slate-400">Snapshot from your AR camera workspace</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close snapshot modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Snapshot Preview */}
        <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center max-h-[60vh]">
          <img
            src={dataUrl}
            alt="Captured Sketch Progress"
            className="w-full h-auto object-contain max-h-[60vh]"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors min-h-[44px] flex items-center justify-center text-center"
          >
            Close &amp; Resume Tracing
          </button>
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-sm min-h-[44px]"
          >
            <Download className="w-4 h-4" />
            <span>Download Image</span>
          </button>
        </div>
      </div>
    </div>
  );
};
