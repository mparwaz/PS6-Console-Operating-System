import React, { useState } from 'react';
import { audioEngine } from '../utils/audio';

interface BootScreenProps {
  onBootComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onBootComplete }) => {
  const [fading, setFading] = useState(false);

  const handleStart = async () => {
    if (fading) return;
    await audioEngine.init();
    audioEngine.playBoot();
    setFading(true);
    setTimeout(() => {
      onBootComplete();
    }, 900);
  };

  return (
    <div
      id="boot-screen"
      onClick={handleStart}
      className={`fixed inset-0 z-[200] bg-white text-black flex flex-col justify-between items-center transition-all duration-1000 cursor-pointer select-none overflow-hidden ${
        fading ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Top Left Gold Corner Curve */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="gold-curve curve-tl pointer-events-none"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <path d="M0,0 L100,0 C100,0 60,30 0,40 Z" fill="url(#goldGrad)" />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8c77b" />
            <stop offset="100%" stopColor="#c5a059" />
          </linearGradient>
        </defs>
      </svg>

      {/* Bottom Right Gold Corner Curve */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="gold-curve curve-br pointer-events-none"
        style={{ position: 'absolute', bottom: 0, right: 0 }}
      >
        <path d="M0,0 L100,0 C100,0 60,30 0,40 Z" fill="url(#goldGrad)" />
      </svg>

      {/* Empty Top Anchor for Perfect Centering */}
      <div className="w-full pt-10"></div>

      {/* Center Main PlayStation Content */}
      <div className="flex flex-col items-center justify-center text-center z-10 px-4 my-auto max-w-lg">
        <div className="flex items-center text-[#c5a059] text-5xl sm:text-6xl md:text-8xl font-bold mb-3 md:mb-4 font-orbitron drop-shadow-md">
          <i className="fab fa-playstation mr-3 md:mr-4"></i> PS6<span className="text-base sm:text-xl mb-6 md:mb-10 ml-1">TM</span>
        </div>

        <p className="text-xl sm:text-2xl md:text-3xl font-light mb-4 md:mb-6 tracking-tight text-neutral-800">
          Welcome back to playstation®
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-sm sm:text-lg md:text-xl font-light text-neutral-700">
          <span>Press the</span>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-[#c5a059] flex items-center justify-center text-[#c5a059] shadow-[0_0_15px_rgba(197,160,89,0.5)] animate-pulse hover:scale-110 transition-transform">
            <i className="fab fa-playstation text-xs sm:text-sm"></i>
          </div>
          <span>button or tap screen.</span>
        </div>

        <button
          onClick={handleStart}
          className="mt-6 px-6 py-2.5 rounded-full bg-[#c5a059] hover:bg-[#b08d48] text-white font-bold text-xs tracking-wider uppercase shadow-lg shadow-amber-500/30 sm:hidden flex items-center gap-2 transition active:scale-95"
        >
          <i className="fab fa-playstation"></i> Tap to Enter PS6
        </button>
      </div>

      {/* Bottom Tagline with Dedicated Spacing to avoid overlap */}
      <div className="w-full pb-6 md:pb-8 text-center z-10">
        <p className="text-neutral-400 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-semibold">
          CHRI-TV
        </p>
      </div>
    </div>
  );
};
