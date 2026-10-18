import React from 'react';
import guideStep1Image from '../assets/images/guide_step1_cup_1792308903914.jpg';
import guideStep2Image from '../assets/images/guide_step2_paper_1792308904425.jpg';
import guideStep3Image from '../assets/images/guide_step3_adjust_1792308905612.jpg';
import guideStep4Image from '../assets/images/guide_step4_trace_1792308906052.jpg';
import { X } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS = [
  {
    step: 1,
    title: 'Elevate Phone Over Paper',
    description: 'Place your phone horizontally on top of a clear glass cup, coffee mug, or phone stand. Position the rear camera lens pointing downward toward the desk.',
    bgImage: guideStep1Image,
  },
  {
    step: 2,
    title: 'Position Paper Underneath',
    description: 'Place a sheet of blank sketching paper flat on the desk directly under the camera lens. Use the alignment grid to square up your paper.',
    bgImage: guideStep2Image,
  },
  {
    step: 3,
    title: 'Adjust Transparency & Size',
    description: 'Slide the transparency to around 50% so you can clearly see both your pencil and the sketch lines at the same time.',
    bgImage: guideStep3Image,
  },
  {
    step: 4,
    title: 'Lock Overlay & Trace',
    description: 'Tap the Lock button to freeze the overlay in place. Now look through the phone screen and guide your pencil on the real paper below!',
    bgImage: guideStep4Image,
  },
];

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-3 sm:p-7 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center z-10"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="space-y-1 pr-12">
          <div className="text-xs font-semibold text-indigo-400">Step-by-step Tutorial</div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">How to Setup AR Drawing on Paper</h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Follow these 4 simple steps to trace any image onto physical paper using your phone.
          </p>
        </div>

        {/* 4 Steps with Background Images */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-5">
          {STEPS.map((s) => (
            <div
              key={s.step}
              className="relative rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 flex flex-col justify-end min-h-[220px] shadow-lg group"
            >
              {/* Step Background Image with optimized opacity for clarity */}
              <img
                src={s.bgImage}
                alt={s.title}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 opacity-80"
                referrerPolicy="no-referrer"
              />
              
              {/* Balanced gradient scrim: dark at the bottom for text readability, clearer at the top/middle */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent pointer-events-none" />

              {/* Step Content */}
              <div className="relative p-4 z-10 space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-sm bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-md">
                    {s.step}
                  </span>
                  <h3 className="text-[10px] font-bold text-white drop-shadow-md">
                    {s.title}
                  </h3>
                </div>
                <p className="text-[8px] text-slate-200 leading-relaxed drop-shadow-md font-medium">
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Action CTA */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors min-h-[44px] shadow-lg shadow-indigo-600/30"
          >
            Start Drawing
          </button>
        </div>
      </div>
    </div>
  );
};