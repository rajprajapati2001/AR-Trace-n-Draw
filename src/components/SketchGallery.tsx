import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  ArrowRight, 
  Image as ImageIcon, 
  HelpCircle
} from 'lucide-react';
import { SketchItem } from '../types';

import { AppLogo } from './AppLogo';

interface SketchGalleryProps {
  sketches: SketchItem[];
  onSelectSketch: (sketch: SketchItem) => void;
  onImportCustomImage: (item: SketchItem) => void;
  onOpenGuide: () => void;
}

export const SketchGallery: React.FC<SketchGalleryProps> = ({
  sketches,
  onSelectSketch,
  onImportCustomImage,
  onOpenGuide,
}) => {
  const [urlInput, setUrlInput] = useState<string>('');
  const [urlError, setUrlError] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraCaptureInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (PNG, JPG, SVG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newSketch: SketchItem = {
        id: `custom-${Date.now()}`,
        title: file.name.replace(/\.[^/.]+$/, '').slice(0, 20) || 'Custom Sketch',
        category: 'Custom',
        imageUrl: dataUrl,
        difficulty: 'Medium',
        tags: ['Custom'],
        isCustom: true,
      };
      onImportCustomImage(newSketch);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUrlError('');
    if (!urlInput.trim()) return;

    try {
      new URL(urlInput.trim());
    } catch {
      setUrlError('Please enter a valid HTTP/HTTPS URL.');
      return;
    }

    const testImg = new Image();
    testImg.onload = () => {
      const newSketch: SketchItem = {
        id: `url-${Date.now()}`,
        title: 'Web Image',
        category: 'Custom',
        imageUrl: urlInput.trim(),
        difficulty: 'Medium',
        tags: ['Custom'],
        isCustom: true,
      };
      onImportCustomImage(newSketch);
    };
    testImg.onerror = () => {
      setUrlError('Unable to load image from this URL. Try uploading the file directly.');
    };
    testImg.src = urlInput.trim();
  };

  const handlePasteFromClipboard = async () => {
    try {
      const items = await navigator.clipboard.read();
      for (const item of items) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const file = new File([blob], 'clipboard-image.png', { type: imageType });
          handleFileUpload(file);
          return;
        }
      }
      alert('No image found on clipboard. Copy an image first.');
    } catch (err) {
      console.warn('Clipboard read error:', err);
      alert('Clipboard access was blocked. You can upload the image file or paste an image URL instead.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 text-slate-100 p-3 sm:p-6 md:p-8 pb-16 pb-safe">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        

{/* Premium Hero Section */}
<section className="relative isolate overflow-hidden rounded-3xl border border-white/[0.09] bg-[#090e1b] shadow-[0_24px_80px_-30px_rgba(0,0,0,0.7)]">

  {/* Ambient Background */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(99,102,241,0.15),transparent_45%),radial-gradient(ellipse_at_bottom_left,rgba(34,211,238,0.09),transparent_40%)]"
  />
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/50 to-transparent"
  />

  <div className="relative p-5 sm:p-7 md:p-9">
    <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between lg:gap-10">

      {/* Brand and Heading */}
      <div className="flex min-w-0 items-start gap-4 sm:gap-5">

        {/* App Icon */}


        <div className="min-w-0 flex-1">

          {/* Eyebrow */}
<div className="mb-3 flex flex-wrap items-center gap-2">
  {/* Visible on all devices */}
  <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300 sm:text-[11px]">
    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
    AR Trace & Drawing Studio
  </span>

  {/* Hidden on mobile, matches perfectly on laptop/desktop */}
  <span className="hidden md:inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300 sm:text-[11px]">
    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
    Camera overlay tracing
  </span>
</div>


          {/* Main Heading */}
          <h1 className="max-w-2xl text-3xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
            Bring your{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-sky-300 to-cyan-300 bg-clip-text text-transparent">
              sketches
            </span>
            {" "}to life.
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-[15px]">
            Choose an image or upload your own photo, then trace it onto paper
            using your phone camera and augmented reality.
          </p>

        </div>
      </div>

      {/* Feature Panel */}
      <div className="hidden md:block flex shrink-0 flex-col gap-4 border-t border-white/[0.08] pt-5 lg:max-w-[260px] lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Built for precision
          </p>
          <p className="mt-1 text-sm font-medium text-slate-200">
            Your reference. Your canvas.
          </p>
        </div>

        {/* Feature Chips */}
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-indigo-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 2.94-.09-.03a1.7 1.7 0 0 0-1.82.55l-.06.08h-3.4l-.03-.1a1.7 1.7 0 0 0-1.3-1.25 1.7 1.7 0 0 0-1.03.09l-.09.04-2.94-1.7.03-.1a1.7 1.7 0 0 0-.55-1.81l-.08-.06v-3.4l.1-.03a1.7 1.7 0 0 0 1.25-1.3 1.7 1.7 0 0 0-.09-1.03l-.04-.09 1.7-2.94.1.03a1.7 1.7 0 0 0 1.81-.55l.06-.08h3.4l.03.1a1.7 1.7 0 0 0 1.3 1.25 1.7 1.7 0 0 0 1.03-.09l.09-.04 2.94 1.7-.03.1a1.7 1.7 0 0 0 .55 1.81l.08.06v3.4l-.1.03A1.7 1.7 0 0 0 19.4 15Z" />
            </svg>
            Opacity control
          </span>

          <span className="inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs font-medium text-slate-300">
            <svg
              aria-hidden="true"
              className="h-4 w-4 text-cyan-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="10" width="14" height="11" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />
            </svg>
            Lock overlay
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <svg
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m5 12 4 4L19 6"
            />
          </svg>
          <span>Designed for a natural tracing workflow</span>
        </div>

      </div>
    </div>
  </div>
</section>


        {/* Import Hub */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-semibold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-indigo-400" />
              Import Your Own Image
            </h2>
            <span className="text-[11px] text-slate-400 hidden xs:inline">PNG, JPG, WebP</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {/* Drag & Browse Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingOver(true);
              }}
              onDragLeave={() => setIsDraggingOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`md:col-span-2 border-2 border-dashed rounded-2xl p-4 sm:p-6 flex flex-col items-center justify-center gap-2 sm:gap-3 cursor-pointer transition-all min-h-[110px] sm:min-h-[140px] ${
                isDraggingOver
                  ? 'border-indigo-400 bg-indigo-500/10'
                  : 'border-slate-700 hover:border-slate-600 bg-slate-800/40 hover:bg-slate-800/70'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm font-semibold text-slate-200">
                  Tap to upload from photo gallery or files
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Any picture can be traced with real-time outline filters
                </p>
              </div>
            </div>

            {/* Quick Camera Snap & URL / Clipboard */}
            <div className="flex flex-col justify-between gap-2.5 bg-slate-800/30 p-3 sm:p-4 rounded-2xl border border-slate-800">
              <input
                ref={cameraCaptureInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <button
                type="button"
                onClick={() => cameraCaptureInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors min-h-[44px]"
              >
                <Camera className="w-4 h-4" />
                <span>Take Photo to Trace</span>
              </button>

              <form onSubmit={handleUrlSubmit} className="flex gap-1.5">
                <input
                  type="url"
                  placeholder="Paste image link..."
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 min-h-[40px]"
                />
                <button
                  type="submit"
                  className="px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-medium min-h-[40px] flex items-center justify-center shrink-0"
                >
                  Load
                </button>
              </form>
              {urlError && <p className="text-[10px] text-red-400">{urlError}</p>}

              <button
                type="button"
                onClick={handlePasteFromClipboard}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium border border-slate-700 transition-colors min-h-[40px]"
              >
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Paste from Clipboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* Curated Sketch Templates - Only show (All) as requested */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <span>Curated Sketch Templates</span>
              <span className="text-xs font-medium text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">All</span>
            </h2>
            <span className="text-xs text-slate-400">
              {sketches.length} templates
            </span>
          </div>

          {/* Sketch Cards Grid (All items shown directly, no extra category tabs) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {sketches.map((sketch) => (
              <div
                key={sketch.id}
                className="group flex flex-col bg-slate-900/90 border border-slate-800 hover:border-indigo-500/60 rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/10"
              >
                {/* Image Frame */}
                <div 
                  onClick={() => onSelectSketch(sketch)}
                  className="relative aspect-square bg-slate-950 flex items-center justify-center p-3 sm:p-4 overflow-hidden cursor-pointer"
                >
                  <img
                    src={sketch.imageUrl}
                    alt={sketch.title}
                    className="w-full h-full object-contain filter group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  {sketch.isCustom && (
                    <span className="absolute top-2 right-2 bg-indigo-600/95 text-white text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                      Your Upload
                    </span>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-2.5 sm:p-3.5 flex flex-col flex-1 justify-between gap-2 sm:gap-3">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                      {sketch.title}
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-0.5 truncate">
                      <span>{sketch.difficulty}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectSketch(sketch)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-sm active:scale-98 min-h-[44px]"
                  >
                    <Camera className="w-3.5 h-3.5 shrink-0" />
                    <span className="whitespace-nowrap">Start Sketch</span>
                    <ArrowRight className="w-3 h-3 ml-0.5 shrink-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
