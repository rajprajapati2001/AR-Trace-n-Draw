import React, { useState } from 'react';
import { 
  RotateCw, 
  RotateCcw, 
  FlipHorizontal, 
  FlipVertical, 
  ZoomIn, 
  ZoomOut, 
  Lock, 
  Unlock, 
  Sliders, 
  Grid, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw as ResetIcon,
  Sun,
  Camera,
  Eye,
  X
} from 'lucide-react';
import { FilterMode, OverlayTransform } from '../types';

interface ControlHUDProps {
  transform: OverlayTransform;
  onTransformChange: (updater: (prev: OverlayTransform) => OverlayTransform) => void;
  filterMode: FilterMode;
  onFilterModeChange: (mode: FilterMode) => void;
  isLocked: boolean;
  onToggleLock: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  hasTorch: boolean;
  isTorchOn: boolean;
  onToggleTorch: () => void;
  onCaptureSnapshot: () => void;
  onCenterOverlay: () => void;
  cameraFacing?: 'environment' | 'user';
  onCameraFacingChange?: (facing: 'environment' | 'user') => void;
}

export const ControlHUD: React.FC<ControlHUDProps> = ({
  transform,
  onTransformChange,
  filterMode,
  onFilterModeChange,
  isLocked,
  onToggleLock,
  showGrid,
  onToggleGrid,
  hasTorch,
  isTorchOn,
  onToggleTorch,
  onCaptureSnapshot,
  onCenterOverlay,
  cameraFacing,
  onCameraFacingChange,
}) => {
  const [activeTab, setActiveTab] = useState<'adjust' | 'filters' | 'position'>('adjust');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [showOpacitySlider, setShowOpacitySlider] = useState<boolean>(false);

  const setOpacity = (opacity: number) => {
    onTransformChange(prev => ({ ...prev, opacity: Math.max(0.05, Math.min(1, opacity)) }));
  };

  const setScale = (scale: number) => {
    onTransformChange(prev => ({ ...prev, scale: Math.max(0.2, Math.min(3.5, scale)) }));
  };

  const setRotation = (rotation: number) => {
    const norm = (rotation % 360 + 360) % 360;
    onTransformChange(prev => ({ ...prev, rotation: Math.round(norm) }));
  };

  const rotateBy = (delta: number) => {
    setRotation(transform.rotation + delta);
  };

  const toggleFlipH = () => {
    onTransformChange(prev => ({ ...prev, flipH: !prev.flipH }));
  };

  const toggleFlipV = () => {
    onTransformChange(prev => ({ ...prev, flipV: !prev.flipV }));
  };

  const nudge = (dx: number, dy: number) => {
    onTransformChange(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
  };

  const resetAllTransforms = () => {
    onTransformChange(() => ({
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      flipH: false,
      flipV: false,
      opacity: 0.55,
    }));
  };

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-2 max-w-lg mx-auto w-full px-2 sm:px-4 pb-2 pb-safe transition-all duration-300">
      
      {/* Quick Opacity Floating Popover on Mobile (if active) */}
      {showOpacitySlider && (
        <div className="w-full max-w-sm bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 animate-fade-in mb-1">
          <div className="flex items-center justify-between text-xs text-slate-200">
            <span className="font-semibold flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-indigo-400" />
              Overlay Transparency
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-indigo-400 font-bold">{Math.round(transform.opacity * 100)}%</span>
              <button 
                onClick={() => setShowOpacitySlider(false)}
                className="p-1 text-slate-400 hover:text-white"
                aria-label="Close opacity slider"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <input
            type="range"
            min="5"
            max="100"
            value={Math.round(transform.opacity * 100)}
            onChange={(e) => setOpacity(Number(e.target.value) / 100)}
            className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <div className="flex justify-between gap-1">
            {[20, 40, 60, 80, 100].map((val) => (
              <button
                key={val}
                onClick={() => setOpacity(val / 100)}
                className={`flex-1 py-1 text-[11px] font-mono rounded-lg transition-colors ${
                  Math.round(transform.opacity * 100) === val
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val}%
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Primary Mobile Bottom Action Strip (Fits within natural thumb zone) */}
      <div className="flex items-center justify-between gap-1 sm:gap-2 px-2.5 sm:px-3 py-2 bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700/80 shadow-2xl shadow-black/80 text-slate-200 w-full">
        {/* 1. Lock Button: Highest Priority in AR Drawing */}
        <button
          onClick={onToggleLock}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all min-h-[44px] min-w-[44px] shrink-0 ${
            isLocked
              ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
          }`}
          title={isLocked ? 'Overlay Locked (Safe from accidental touches)' : 'Lock Overlay in place'}
          aria-label={isLocked ? 'Unlock overlay' : 'Lock overlay'}
        >
          {isLocked ? <Lock className="w-4 h-4 shrink-0" /> : <Unlock className="w-4 h-4 text-slate-400 shrink-0" />}
        </button>

        {/* 2. Quick Opacity Trigger Button */}
        <button
          onClick={() => setShowOpacitySlider(!showOpacitySlider)}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-mono tabular-nums transition-colors min-h-[44px] border shrink-0 ${
            showOpacitySlider
              ? 'bg-indigo-600/30 text-indigo-200 border-indigo-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Adjust Overlay Transparency"
        >
          <Eye className="w-3.5 h-3.5 text-indigo-400" />
          <span>{Math.round(transform.opacity * 100)}%</span>
        </button>

        {/* 3. Quick 90 deg Rotate */}
        <button
          onClick={() => rotateBy(90)}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-700 shrink-0"
          title="Rotate 90 degrees"
          aria-label="Rotate 90 degrees"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* 4. Quick Flip H (Mirror) */}
        <button
          onClick={toggleFlipH}
          className={`p-2 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border shrink-0 ${
            transform.flipH
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Flip Horizontal (Mirror)"
          aria-label="Flip Horizontal"
        >
          <FlipHorizontal className="w-4 h-4" />
        </button>

        {/* 5. Torch / Flashlight (if available on mobile camera) */}
        {hasTorch && (
          <button
            onClick={onToggleTorch}
            className={`p-2 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center border shrink-0 ${
              isTorchOn
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-md shadow-amber-400/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="Toggle Flashlight Torch"
            aria-label="Flashlight"
          >
            <Sun className="w-4 h-4" />
          </button>
        )}

        {/* 6. Alignment Grid */}
        <button
          onClick={onToggleGrid}
          className={`hidden xs:flex p-2 rounded-xl transition-colors min-h-[44px] min-w-[44px] items-center justify-center border shrink-0 ${
            showGrid
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
          }`}
          title="Toggle Grid Guide"
          aria-label="Toggle Grid"
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* 7. Snapshot Photo */}
        <button
          onClick={onCaptureSnapshot}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center border border-slate-700 shrink-0"
          title="Capture Photo of Your Drawing"
          aria-label="Capture Snapshot"
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* 8. More Sliders & Filters Drawer Toggle */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className={`flex items-center gap-1 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-colors min-h-[44px] border shrink-0 ${
            isDrawerOpen
              ? 'bg-indigo-600 text-white border-indigo-500'
              : 'bg-slate-800 hover:bg-slate-700 text-indigo-300 border-slate-700'
          }`}
          title={isDrawerOpen ? 'Close Sliders' : 'Open Adjustments & Line Art Filters'}
          aria-label="Toggle Settings Drawer"
        >
          <Sliders className="w-4 h-4" />
          <span className="hidden sm:inline">Tune</span>
          {isDrawerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Bottom Sheet / Drawer for Advanced Controls */}
      {isDrawerOpen && (
        <div className="w-full bg-slate-900/98 backdrop-blur-2xl rounded-3xl border border-slate-700/80 p-4 shadow-2xl shadow-black text-slate-200 animate-slide-up max-h-[60vh] overflow-y-auto">
          {/* Drawer Grab Handle for mobile touch affordance */}
          <div className="w-10 h-1 bg-slate-700 rounded-full mx-auto mb-3"></div>

          {/* Sub-Tabs: Adjust, Filters, Position */}
          <div className="flex items-center gap-1 p-1 bg-slate-800/90 rounded-xl mb-3 text-xs font-medium">
            <button
              onClick={() => setActiveTab('adjust')}
              className={`flex-1 py-2 px-2 rounded-lg transition-all text-center whitespace-nowrap min-h-[38px] ${
                activeTab === 'adjust'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Transform
            </button>
            <button
              onClick={() => setActiveTab('filters')}
              className={`flex-1 py-2 px-2 rounded-lg transition-all text-center whitespace-nowrap min-h-[38px] ${
                activeTab === 'filters'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Line Art
            </button>
            <button
              onClick={() => setActiveTab('position')}
              className={`flex-1 py-2 px-2 rounded-lg transition-all text-center whitespace-nowrap min-h-[38px] ${
                activeTab === 'position'
                  ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Nudge
            </button>
          </div>

          {/* Tab 1: Adjust (Opacity, Rotation, Flip, Scale) */}
          {activeTab === 'adjust' && (
            <div className="space-y-4 text-xs">
              {/* Opacity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-indigo-400" />
                    Transparency
                  </span>
                  <span className="font-mono tabular-nums text-indigo-400 font-bold">
                    {Math.round(transform.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={Math.round(transform.opacity * 100)}
                  onChange={(e) => setOpacity(Number(e.target.value) / 100)}
                  className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              {/* Rotation & Flip */}
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Rotate</span>
                    <span className="font-mono text-indigo-400">{transform.rotation}°</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => rotateBy(-90)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center justify-center gap-1 min-h-[44px]"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>-90°</span>
                    </button>
                    <button
                      onClick={() => rotateBy(90)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center justify-center gap-1 min-h-[44px]"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
                      <span>+90°</span>
                    </button>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="359"
                    value={transform.rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 mt-1"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold">Flip Mirror</span>
                    <span className="text-[11px] text-slate-400">
                      {transform.flipH ? 'H ' : ''}{transform.flipV ? 'V' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={toggleFlipH}
                      className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1 min-h-[44px] ${
                        transform.flipH
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <FlipHorizontal className="w-3.5 h-3.5" />
                      <span>Flip H</span>
                    </button>
                    <button
                      onClick={toggleFlipV}
                      className={`flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1 min-h-[44px] ${
                        transform.flipV
                          ? 'bg-indigo-600 text-white font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <FlipVertical className="w-3.5 h-3.5" />
                      <span>Flip V</span>
                    </button>
                  </div>
                  <button
                    onClick={() => setRotation(0)}
                    className="w-full text-[11px] py-1 text-slate-400 hover:text-slate-200 text-center"
                  >
                    Reset Angle (0°)
                  </button>
                </div>
              </div>

              {/* Scale / Zoom */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold flex items-center gap-1.5">
                    <ZoomIn className="w-3.5 h-3.5 text-indigo-400" />
                    Scale Size
                  </span>
                  <span className="font-mono tabular-nums text-indigo-400">
                    {Math.round(transform.scale * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScale(transform.scale - 0.1)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={Math.round(transform.scale * 100)}
                    onChange={(e) => setScale(Number(e.target.value) / 100)}
                    className="w-full h-3 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <button
                    onClick={() => setScale(transform.scale + 0.1)}
                    className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-200 min-h-[44px] min-w-[44px] flex items-center justify-center"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Camera Mode (Back Camera / Selfie Camera) */}
              {onCameraFacingChange && (
                <div className="pt-2 border-t border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-indigo-400" />
                      Camera Mode
                    </span>
                    <span className="text-[11px] text-indigo-400 font-medium">
                      {cameraFacing === 'environment' ? 'Back (Desk Tracing)' : 'Front (Selfie)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onCameraFacingChange('environment')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
                        cameraFacing === 'environment'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Back Camera</span>
                    </button>
                    <button
                      onClick={() => onCameraFacingChange('user')}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all min-h-[44px] ${
                        cameraFacing === 'user'
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Selfie Camera</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Line Art Filters */}
          {activeTab === 'filters' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Extract stencil outlines to make lines visible over paper:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: 'normal', label: 'Original', desc: 'Standard colors' },
                  { id: 'outline', label: 'Sobel Line Art', desc: 'Contour edge lines' },
                  { id: 'monochrome', label: 'Monochrome', desc: 'Pencil grayscale' },
                  { id: 'invert', label: 'Inverted', desc: 'High contrast' },
                  { id: 'tint-red', label: 'Ruby Trace', desc: 'Contrasts on paper' },
                  { id: 'tint-cyan', label: 'Cyan Draft', desc: 'Architectural cyan' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onFilterModeChange(item.id as FilterMode)}
                    className={`flex flex-col items-start p-3 rounded-2xl border transition-all text-left min-h-[56px] ${
                      filterMode === item.id
                        ? 'bg-indigo-600/30 border-indigo-500 text-white shadow-md shadow-indigo-500/20'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-semibold text-xs whitespace-nowrap">{item.label}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Precision Position Nudge */}
          {activeTab === 'position' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-400">
                Micro-adjust paper alignment without moving the phone:
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-2">
                <div className="grid grid-cols-3 gap-2 w-44">
                  <div></div>
                  <button
                    onClick={() => nudge(0, -10)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
                    title="Nudge Up"
                    aria-label="Nudge Up"
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                  <div></div>

                  <button
                    onClick={() => nudge(-10, 0)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
                    title="Nudge Left"
                    aria-label="Nudge Left"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onCenterOverlay}
                    className="p-2 bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl flex items-center justify-center text-[10px] font-bold min-h-[44px] min-w-[44px]"
                    title="Center Image"
                  >
                    Center
                  </button>
                  <button
                    onClick={() => nudge(10, 0)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
                    title="Nudge Right"
                    aria-label="Nudge Right"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div></div>
                  <button
                    onClick={() => nudge(0, 10)}
                    className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl flex items-center justify-center min-h-[44px] min-w-[44px] active:scale-95 transition-transform"
                    title="Nudge Down"
                    aria-label="Nudge Down"
                  >
                    <ArrowDown className="w-5 h-5" />
                  </button>
                  <div></div>
                </div>

                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  <div className="bg-slate-800/80 p-3 rounded-xl flex justify-between gap-4 font-mono text-xs">
                    <span className="text-slate-400">X: <b className="text-white">{Math.round(transform.x)}px</b></span>
                    <span className="text-slate-400">Y: <b className="text-white">{Math.round(transform.y)}px</b></span>
                  </div>
                  <button
                    onClick={resetAllTransforms}
                    className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-colors min-h-[44px] text-xs font-semibold"
                  >
                    <ResetIcon className="w-4 h-4" />
                    Reset All Transforms
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Close Drawer Button */}
          <div className="mt-3 pt-3 border-t border-slate-800 flex justify-end">
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium min-h-[44px] flex items-center justify-center"
            >
              Done Adjusting
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
