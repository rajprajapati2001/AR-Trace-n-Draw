import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Maximize2, 
  Minimize2, 
  BookOpen, 
  Layers,
  Sparkles
} from 'lucide-react';
import { AppLogo } from './AppLogo';

interface TopBarProps {
  currentView: 'studio' | 'gallery';
  setCurrentView: (view: 'studio' | 'gallery') => void;
  onOpenGuide: () => void;
  activeSketchTitle?: string;
  isLocked?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  setCurrentView,
  onOpenGuide,
  activeSketchTitle,
  isLocked,
}) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          await (document.documentElement as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  return (
    <header className="flex items-center justify-between gap-2 md:gap-8 px-3 md:px-6 h-13 md:h-14 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 z-50 shrink-0 pt-safe">
      {/* Zone 1: Single text element Brand Wordmark with new App Logo */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <button
          onClick={() => setCurrentView('gallery')}
          className="flex items-center gap-2 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1 min-h-[44px]"
          title="AR Trace & Draw Home"
        >
          <div className="rounded-xl overflow-hidden shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform flex items-center justify-center">
            <AppLogo size={32} showBackground={true} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm md:text-base font-bold tracking-tight text-white whitespace-nowrap leading-none">
              AR Trace &amp; Draw
            </span>
            {activeSketchTitle && currentView === 'studio' && (
              <span className="text-[10px] md:text-[11px] text-indigo-400 font-medium truncate max-w-[100px] sm:max-w-[160px] md:max-w-[220px] leading-tight mt-0.5">
                {activeSketchTitle} {isLocked ? '• Locked' : ''}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links (Responsive layout) */}
      <nav className="flex items-center gap-1 md:gap-3 text-xs md:text-sm font-medium">
        <button
          onClick={() => setCurrentView('studio')}
          className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px] ${
            currentView === 'studio'
              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="AR Camera Studio"
        >
          <Camera className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden xs:inline">Studio</span>
        </button>

        <button
          onClick={() => setCurrentView('gallery')}
          className={`flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 min-h-[44px] ${
            currentView === 'gallery'
              ? 'bg-indigo-600/20 text-indigo-300 font-semibold border border-indigo-500/30'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Image Library & Upload"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden xs:inline">Library</span>
        </button>

        <button
          onClick={onOpenGuide}
          className="hidden sm:flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 transition-colors whitespace-nowrap shrink-0 min-h-[44px]"
          title="How to setup phone on cup or stand"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Guide</span>
        </button>
      </nav>

      {/* Zone 3: Setup Guide (mobile trigger) & TOP-RIGHT FULLSCREEN OPTION */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          onClick={onOpenGuide}
          className="sm:hidden p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
          title="Phone Setup Guide"
          aria-label="Setup Guide"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
        </button>

        {/* Top-Right Fullscreen Option */}
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 px-2.5 md:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg border border-slate-700 text-xs font-medium transition-all shadow-sm active:scale-95 min-h-[44px] min-w-[44px] justify-center"
          title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
          aria-label={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
        >
          {isFullscreen ? (
            <>
              <Minimize2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline whitespace-nowrap">Exit Fullscreen</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline whitespace-nowrap">Full Screen</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
