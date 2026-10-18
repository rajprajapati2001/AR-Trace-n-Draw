import React, { useRef, useEffect, useState, useCallback } from 'react';
import { 
  Camera, 
  FlipHorizontal, 
  RotateCw, 
  Lock, 
  Unlock, 
  AlertCircle, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Sliders, 
  Sun, 
  Grid as GridIcon,
  Layers,
  Sparkles,
  Download,
  Info,
  User
} from 'lucide-react';
import { FilterMode, OverlayTransform, SketchItem } from '../types';
import { applyImageFilter } from '../utils/imageProcessing';

interface CameraWorkspaceProps {
  activeSketch: SketchItem;
  transform: OverlayTransform;
  onTransformChange: (updater: (prev: OverlayTransform) => OverlayTransform) => void;
  filterMode: FilterMode;
  isLocked: boolean;
  onToggleLock: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onOpenGallery: () => void;
  onOpenGuide: () => void;
  onSnapshotTaken: (dataUrl: string) => void;
  setHasTorch: (hasTorch: boolean) => void;
  isTorchOn: boolean;
  setIsTorchOn: React.Dispatch<React.SetStateAction<boolean>>;
  cameraFacing: 'environment' | 'user';
  onCameraFacingChange: (facing: 'environment' | 'user') => void;
}

export const CameraWorkspace: React.FC<CameraWorkspaceProps> = ({
  activeSketch,
  transform,
  onTransformChange,
  filterMode,
  isLocked,
  onToggleLock,
  showGrid,
  onToggleGrid,
  onOpenGallery,
  onOpenGuide,
  onSnapshotTaken,
  setHasTorch,
  isTorchOn,
  setIsTorchOn,
  cameraFacing,
  onCameraFacingChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayImgRef = useRef<HTMLImageElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraStatus, setCameraStatus] = useState<'requesting' | 'active' | 'denied' | 'unsupported'>('requesting');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [processedImageUrl, setProcessedImageUrl] = useState<string>(activeSketch.imageUrl);
  const [isProcessingFilter, setIsProcessingFilter] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [traceSurface, setTraceSurface] = useState<'camera' | 'lightbox'>('camera');

  // Drag & Touch Gesture state
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<{ x: number; y: number; initialX: number; initialY: number }>({ x: 0, y: 0, initialX: 0, initialY: 0 });
  const touchDistanceStart = useRef<number | null>(null);
  const touchAngleStart = useRef<number | null>(null);
  const touchScaleStart = useRef<number>(1);
  const touchRotationStart = useRef<number>(0);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  const startCamera = useCallback(async (facing: 'environment' | 'user') => {
    setCameraStatus('requesting');
    setErrorMessage('');

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraStatus('unsupported');
      setErrorMessage('Camera access is not supported in this browser or context.');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      setCameraStatus('active');

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }

      const track = newStream.getVideoTracks()[0];
      if (track) {
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        setHasTorch(!!capabilities.torch);
      }
    } catch (err: any) {
      console.warn('getUserMedia error:', err);
      setCameraStatus('denied');
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setErrorMessage('Camera permission was blocked. Please allow camera permissions in your browser settings.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setErrorMessage('No camera device was detected on your device.');
      } else {
        setErrorMessage(err.message || 'Unable to start camera.');
      }
    }
  }, [setHasTorch, stream]);

  useEffect(() => {
    if (traceSurface === 'camera') {
      startCamera(cameraFacing);
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraFacing, traceSurface]);

  useEffect(() => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track && (track.getCapabilities as any)?.().torch) {
      try {
        (track as any).applyConstraints({
          advanced: [{ torch: isTorchOn }],
        }).catch((err: any) => console.warn('Torch constraint error:', err));
      } catch (err) {
        console.warn('Torch toggle error:', err);
      }
    }
  }, [isTorchOn, stream]);

  useEffect(() => {
    let isCancelled = false;
    const process = async () => {
      setIsProcessingFilter(true);
      try {
        const res = await applyImageFilter(activeSketch.imageUrl, filterMode);
        if (!isCancelled) {
          setProcessedImageUrl(res);
        }
      } catch (err) {
        console.warn('Filter processing error:', err);
        if (!isCancelled) {
          setProcessedImageUrl(activeSketch.imageUrl);
        }
      } finally {
        if (!isCancelled) {
          setIsProcessingFilter(false);
        }
      }
    };
    process();
    return () => {
      isCancelled = true;
    };
  }, [activeSketch.imageUrl, filterMode]);

  // Pointer / Drag Event Handlers with Mobile Safety
  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    isDragging.current = true;
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: transform.x,
      initialY: transform.y,
    };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || isLocked) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    onTransformChange((prev) => ({
      ...prev,
      x: dragStart.current.initialX + dx,
      y: dragStart.current.initialY + dy,
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging.current) {
      isDragging.current = false;
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  // Touch Pinch-to-zoom & 2-finger rotate
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isLocked) return;
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const angle = (Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180) / Math.PI;
      touchDistanceStart.current = dist;
      touchAngleStart.current = angle;
      touchScaleStart.current = transform.scale;
      touchRotationStart.current = transform.rotation;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isLocked) return;
    if (e.touches.length === 2 && touchDistanceStart.current !== null && touchAngleStart.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY);
      const currentAngle = (Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180) / Math.PI;

      const scaleFactor = currentDist / touchDistanceStart.current;
      const newScale = Math.max(0.2, Math.min(3.5, touchScaleStart.current * scaleFactor));

      const angleDelta = currentAngle - touchAngleStart.current;
      const newRotation = (Math.round(touchRotationStart.current + angleDelta) % 360 + 360) % 360;

      onTransformChange((prev) => ({
        ...prev,
        scale: newScale,
        rotation: newRotation,
      }));
    }
  };

  const handleTouchEnd = () => {
    touchDistanceStart.current = null;
    touchAngleStart.current = null;
  };

  const takeSnapshot = () => {
    const canvas = document.createElement('canvas');
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 600;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (videoRef.current && videoRef.current.readyState >= 2) {
      ctx.save();
      if (cameraFacing === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(videoRef.current, 0, 0, width, height);
      ctx.restore();
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, width, height);
    }

    if (overlayImgRef.current && overlayImgRef.current.complete) {
      ctx.save();
      ctx.globalAlpha = transform.opacity;
      ctx.translate(width / 2 + transform.x, height / 2 + transform.y);
      ctx.rotate((transform.rotation * Math.PI) / 180);
      ctx.scale(
        transform.scale * (transform.flipH ? -1 : 1),
        transform.scale * (transform.flipV ? -1 : 1)
      );

      const imgW = Math.min(width * 0.7, 360);
      const imgH = imgW;
      ctx.drawImage(overlayImgRef.current, -imgW / 2, -imgH / 2, imgW, imgH);
      ctx.restore();
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onSnapshotTaken(dataUrl);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-slate-950 select-none touch-none"
    >
      {/* 1. Camera Feed / Lightbox Surface */}
      {traceSurface === 'camera' ? (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 pointer-events-none ${
              cameraFacing === 'user' ? '-scale-x-100' : ''
            } ${cameraStatus === 'active' ? 'opacity-100' : 'opacity-0'}`}
          />

          {cameraStatus !== 'active' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 md:p-6 text-center z-10 bg-slate-900/95 backdrop-blur-sm">
              {cameraStatus === 'requesting' ? (
                <div className="flex flex-col items-center gap-3">
                  <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin" />
                  <p className="text-sm font-semibold text-slate-200">
                    Connecting to {cameraFacing === 'environment' ? 'Back' : 'Selfie'} Camera...
                  </p>
                  <p className="text-xs text-slate-400 max-w-xs">
                    Please approve camera access to track and trace your sketch.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3 max-w-xs sm:max-w-sm">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-white">Camera Permission Needed</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {errorMessage || 'Camera access was blocked or is unavailable.'}
                  </p>

                  {/* Camera Mode Selector in Error Screen */}
                  <div className="flex items-center gap-2 p-1 bg-slate-800 rounded-xl w-full justify-center">
                    <button
                      onClick={() => onCameraFacingChange('environment')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        cameraFacing === 'environment' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Back Camera</span>
                    </button>
                    <button
                      onClick={() => onCameraFacingChange('user')}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        cameraFacing === 'user' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Selfie Camera</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 pt-1 w-full">
                    <button
                      onClick={() => startCamera(cameraFacing)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm min-h-[44px]"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Retry Camera
                    </button>
                    <button
                      onClick={() => setTraceSurface('lightbox')}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-700 min-h-[44px]"
                    >
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      Use Screen Lightbox Mode
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 bg-white flex flex-col items-center justify-between p-4 z-0">
          <div className="bg-slate-900/90 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2 mt-2 backdrop-blur-md">
            <span>Lightbox Screen Trace Mode</span>
            <button
              onClick={() => setTraceSurface('camera')}
              className="text-indigo-400 font-semibold underline hover:text-indigo-300 min-h-[44px] flex items-center"
            >
              Back to Camera
            </button>
          </div>
          <div className="text-[11px] text-slate-500 mb-20 pointer-events-none text-center">
            Place thin paper directly on top of your illuminated phone screen to trace.
          </div>
        </div>
      )}

      {/* 2. Alignment Grid Guide */}
      {showGrid && (
        <div className="absolute inset-0 pointer-events-none z-20 grid grid-cols-3 grid-rows-3 border border-indigo-400/25">
          <div className="border-r border-b border-indigo-400/20"></div>
          <div className="border-r border-b border-indigo-400/20"></div>
          <div className="border-b border-indigo-400/20"></div>
          <div className="border-r border-b border-indigo-400/20"></div>
          <div className="border-r border-b border-indigo-400/20 flex items-center justify-center">
            <div className="w-6 h-6 border border-indigo-400/40 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-indigo-400/70 rounded-full"></div>
            </div>
          </div>
          <div className="border-b border-indigo-400/20"></div>
          <div className="border-r border-b border-indigo-400/20"></div>
          <div className="border-r border-b border-indigo-400/20"></div>
          <div></div>
        </div>
      )}

      {/* 3. AR Overlay Image Layer */}
      <div
        className={`absolute z-30 flex items-center justify-center transition-shadow ${
          isLocked ? 'cursor-default pointer-events-none' : 'cursor-grab active:cursor-grabbing'
        }`}
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) rotate(${transform.rotation}deg) scale(${transform.scale}) scaleX(${transform.flipH ? -1 : 1}) scaleY(${transform.flipV ? -1 : 1})`,
          opacity: transform.opacity,
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative group">
          {!isLocked && (
            <div className="absolute -inset-2 border-0 border-dashed border-indigo-400/60 rounded-2xl pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
          )}

          <img
            ref={overlayImgRef}
            src={processedImageUrl}
            alt={activeSketch.title}
            className="w-64 h-64 xs:w-72 xs:h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 object-contain pointer-events-none select-none drop-shadow-xl"
            referrerPolicy="no-referrer"
          />

          {isProcessingFilter && (
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] rounded-2xl flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* 4. Top Overlay Bar */}
      <div className="absolute top-2 inset-x-2 sm:top-3 sm:inset-x-3 flex items-center justify-between z-40 pointer-events-none">
        {/* Left: Change Image / Cup Guide */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            onClick={onOpenGallery}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-slate-900/85 hover:bg-slate-900 text-slate-100 backdrop-blur-md rounded-xl text-xs font-semibold border border-slate-700/80 shadow-lg min-h-[44px] transition-all"
            title="Change Sketch Image"
          >
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span className="whitespace-nowrap">Image</span>
          </button>

          <button
            onClick={onOpenGuide}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 bg-slate-900/85 hover:bg-slate-900 text-slate-200 backdrop-blur-md rounded-xl text-xs font-semibold border border-slate-700/80 shadow-lg min-h-[44px] transition-all"
            title="Cup & Stand Setup Guide"
          >
            <Info className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline whitespace-nowrap">Setup</span>
          </button>
        </div>

        {/* Center: Locked indicator without blinking animation */}
        <div className="pointer-events-auto">
          {isLocked && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-slate-950 rounded-full font-bold text-[11px] sm:text-xs shadow-md shadow-amber-500/20 backdrop-blur-sm whitespace-nowrap">
              <Lock className="w-3.5 h-3.5" />
              <span>LOCKED</span>
            </div>
          )}
        </div>

        {/* Right: Camera Mode Selector + TOP-RIGHT FULLSCREEN OPTION */}
        <div className="pointer-events-auto flex items-center gap-1.5">
          {/* Explicit Camera Mode Selector: Back Camera / Selfie Camera */}
          {traceSurface === 'camera' && (
            <div className="flex items-center p-0.5 bg-slate-900/85 backdrop-blur-md rounded-xl border border-slate-700/80 shadow-lg">
              <button
                onClick={() => onCameraFacingChange('environment')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all min-h-[38px] ${
                  cameraFacing === 'environment'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Use Back Camera (Desk / Paper Tracing)"
              >
                <Camera className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Back</span>
              </button>
              <button
                onClick={() => onCameraFacingChange('user')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all min-h-[38px] ${
                  cameraFacing === 'user'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Use Selfie Front Camera"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Selfie</span>
              </button>
            </div>
          )}

          {/* Dedicated In-Canvas Top-Right Fullscreen Option */}
          <button
            onClick={toggleFullscreen}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-2 bg-slate-900/85 hover:bg-slate-900 text-slate-100 backdrop-blur-md rounded-xl text-xs font-semibold border border-slate-700/80 shadow-lg min-h-[44px] transition-all"
            title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
            aria-label="Full Screen"
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline whitespace-nowrap">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline whitespace-nowrap">Full</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
