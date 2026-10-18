import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { CameraWorkspace } from './components/CameraWorkspace';
import { ControlHUD } from './components/ControlHUD';
import { SketchGallery } from './components/SketchGallery';
import { SetupGuideModal } from './components/SetupGuideModal';
import { SnapshotModal } from './components/SnapshotModal';
import { SAMPLE_SKETCHES } from './data/sampleSketches';
import { FilterMode, OverlayTransform, SketchItem } from './types';

export default function App() {
  // Always start on Choose or Import Sketch gallery page (no camera permission requested until entering studio)
  const [currentView, setCurrentView] = useState<'studio' | 'gallery'>('gallery');
  const [sketches, setSketches] = useState<SketchItem[]>(SAMPLE_SKETCHES);
  const [activeSketch, setActiveSketch] = useState<SketchItem>(SAMPLE_SKETCHES[0]);
  const [cameraFacing, setCameraFacing] = useState<'environment' | 'user'>('environment');

  // Overlay state: opacity, rotation, scale, flip, offsets
  const [transform, setTransform] = useState<OverlayTransform>({
    x: 0,
    y: 0,
    scale: 1,
    rotation: 0,
    flipH: false,
    flipV: false,
    opacity: 0.55, // optimal default transparency for tracing through paper
  });

  const [filterMode, setFilterMode] = useState<FilterMode>('normal');
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [snapshotDataUrl, setSnapshotDataUrl] = useState<string | null>(null);

  // When user selects a sketch from gallery or imports a new one
  const handleSelectSketch = (sketch: SketchItem) => {
    setActiveSketch(sketch);
    // Reset transform positions for new sketch but preserve opacity
    setTransform((prev) => ({
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
      flipH: false,
      flipV: false,
      opacity: prev.opacity,
    }));
    setCurrentView('studio');
  };

  const handleImportCustomImage = (newSketch: SketchItem) => {
    setSketches((prev) => [newSketch, ...prev]);
    handleSelectSketch(newSketch);
  };

  const centerOverlay = () => {
    setTransform((prev) => ({
      ...prev,
      x: 0,
      y: 0,
    }));
  };

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden bg-slate-950 font-sans text-slate-100 select-none">
      {/* 1. Header with Top-Right Full Screen Option */}
      <TopBar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenGuide={() => setIsGuideOpen(true)}
        activeSketchTitle={activeSketch.title}
        isLocked={isLocked}
      />

      {/* 2. Main Body: Camera AR Studio or Image Library */}
      <main className="relative flex-1 w-full overflow-hidden flex flex-col">
        {currentView === 'studio' ? (
          <div className="relative w-full h-full flex flex-col">
            {/* The AR Camera Workspace & Live Video Layer */}
            <div className="relative flex-1 w-full h-full overflow-hidden">
              <CameraWorkspace
                activeSketch={activeSketch}
                transform={transform}
                onTransformChange={setTransform}
                filterMode={filterMode}
                isLocked={isLocked}
                onToggleLock={() => setIsLocked((prev) => !prev)}
                showGrid={showGrid}
                onToggleGrid={() => setShowGrid((prev) => !prev)}
                onOpenGallery={() => setCurrentView('gallery')}
                onOpenGuide={() => setIsGuideOpen(true)}
                onSnapshotTaken={(dataUrl) => setSnapshotDataUrl(dataUrl)}
                setHasTorch={setHasTorch}
                isTorchOn={isTorchOn}
                setIsTorchOn={setIsTorchOn}
                cameraFacing={cameraFacing}
                onCameraFacingChange={setCameraFacing}
              />

              {/* Floating Bottom HUD with Transparency, Rotate, Scale, Flip, and Filters */}
              <div className="absolute bottom-4 inset-x-0 z-40 pointer-events-none flex justify-center">
                <ControlHUD
                  transform={transform}
                  onTransformChange={setTransform}
                  filterMode={filterMode}
                  onFilterModeChange={setFilterMode}
                  isLocked={isLocked}
                  onToggleLock={() => setIsLocked((prev) => !prev)}
                  showGrid={showGrid}
                  onToggleGrid={() => setShowGrid((prev) => !prev)}
                  hasTorch={hasTorch}
                  isTorchOn={isTorchOn}
                  onToggleTorch={() => setIsTorchOn((prev) => !prev)}
                  onCaptureSnapshot={() => {
                    // Trigger snapshot via synthetic event or helper
                    const snapshotBtn = document.querySelector('button[title*="Capture Photo"]') as HTMLButtonElement;
                    if (snapshotBtn) snapshotBtn.click();
                  }}
                  onCenterOverlay={centerOverlay}
                  cameraFacing={cameraFacing}
                  onCameraFacingChange={setCameraFacing}
                />
              </div>
            </div>
          </div>
        ) : (
          <SketchGallery
            sketches={sketches}
            onSelectSketch={handleSelectSketch}
            onImportCustomImage={handleImportCustomImage}
            onOpenGuide={() => setIsGuideOpen(true)}
          />
        )}
      </main>

      {/* 3. Setup Guide Modal */}
      <SetupGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* 4. Snapshot Captured Modal */}
      <SnapshotModal
        dataUrl={snapshotDataUrl}
        onClose={() => setSnapshotDataUrl(null)}
        sketchTitle={activeSketch.title}
      />
    </div>
  );
}
