import React, { useState, useEffect, useRef } from 'react';
import { GameApp } from '../types';
import { audioEngine } from '../utils/audio';
import { PTHallwayGame } from './PTHallwayGame';

interface GameRuntimeModalProps {
  game: GameApp | null;
  onClose: () => void;
  onTrophyUnlock?: (gameTitle: string, trophyTitle: string) => void;
}

export const GameRuntimeModal: React.FC<GameRuntimeModalProps> = ({
  game,
  onClose,
  onTrophyUnlock
}) => {
  const [fps, setFps] = useState(120);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHud, setShowHud] = useState(true);
  const [interactiveScore, setInteractiveScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [actionMessage, setActionMessage] = useState('Press QTE buttons to trigger DualSense 2.0 haptics!');
  const [iframeKey, setIframeKey] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // For P.T. and WASM games that have a native 3D engine vs embed
  const isPT = game
    ? game.id === 'pt-wasm' ||
      game.title.toLowerCase().includes('p.t.') ||
      game.title.toLowerCase().includes('silent hills')
    : false;
  const [engineMode, setEngineMode] = useState<'native_3d' | 'iframe'>(isPT ? 'native_3d' : 'iframe');

  useEffect(() => {
    if (!game) return;
    const interval = setInterval(() => {
      setFps(Math.floor(118 + Math.random() * 4));
    }, 1500);
    return () => clearInterval(interval);
  }, [game]);

  if (!game) return null;

  // Helper to extract or format embed URLs
  const getCleanEmbedUrl = (): string => {
    let raw = game.embedUrl || '';
    if (!raw && game.iframeCode) {
      const match = game.iframeCode.match(/src=["'](.*?)["']/i);
      if (match) raw = match[1];
    }
    raw = raw.trim();
    if (!raw) return '';

    // Scratch conversion: ensure /embed is present
    const scratchMatch = raw.match(/scratch\.mit\.edu\/projects\/(\d+)/i);
    if (scratchMatch && !raw.includes('/embed')) {
      return `https://scratch.mit.edu/projects/${scratchMatch[1]}/embed`;
    }

    // YouTube conversion: ensure /embed/ is present
    const ytMatch = raw.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/i
    );
    if (ytMatch) {
      return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&enablejsapi=1`;
    }

    return raw;
  };

  const embedSrc = getCleanEmbedUrl();

  const handleFullscreenToggle = () => {
    audioEngine.playHover();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleReloadFrame = () => {
    audioEngine.playConfirm();
    setIframeKey((prev) => prev + 1);
  };

  const handleQteAction = (actionName: string) => {
    audioEngine.playConfirm();
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(80);
      } catch {
        // Ignore
      }
    }
    const newScore = interactiveScore + 100;
    const newCombo = combo + 1;
    setInteractiveScore(newScore);
    setCombo(newCombo);
    setActionMessage(`DualSense 2.0 Haptic Pulse: [${actionName}] Hit! Combo x${newCombo}`);

    if (newCombo === 5 && onTrophyUnlock) {
      onTrophyUnlock(game.title.replace('<br>', ' '), 'Gold - Perfect Combo Master');
    }
  };

  const handleExit = () => {
    audioEngine.playConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col justify-between overflow-hidden select-none animate-[fadeIn_0.3s_ease-out]">
      {/* Top PS6 Game HUD Bar */}
      <div
        className={`absolute top-0 inset-x-0 z-50 p-4 transition-all duration-300 flex justify-between items-center ${
          showHud ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full hover:opacity-100 hover:translate-y-0'
        } bg-gradient-to-b from-black/95 via-black/70 to-transparent`}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={handleExit}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            title="Return to PlayStation Dashboard (◯)"
          >
            <i className="fab fa-playstation text-sm"></i>
          </button>
          <div>
            <div className="text-xs font-bold text-[var(--ps-gold)] uppercase tracking-wider flex items-center gap-2">
              <span>{game.pub}</span>
              <span>•</span>
              <span>{game.category || 'WASM Engine'}</span>
            </div>
            <h2 className="text-sm md:text-base font-bold font-orbitron text-white leading-tight">
              {game.title.replace('<br>', ' ')}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-semibold">
          {/* Mode toggle if P.T. is active */}
          {isPT && (
            <div className="flex bg-white/10 p-1 rounded-full border border-white/15">
              <button
                onClick={() => {
                  audioEngine.playHover();
                  setEngineMode('native_3d');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  engineMode === 'native_3d'
                    ? 'bg-[var(--ps-blue)] text-white shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <i className="fas fa-vr-cardboard"></i> Playable 3D Corridor
              </button>
              <button
                onClick={() => {
                  audioEngine.playHover();
                  setEngineMode('iframe');
                }}
                className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
                  engineMode === 'iframe'
                    ? 'bg-[var(--ps-blue)] text-white shadow'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <i className="fas fa-globe"></i> Web Embed
              </button>
            </div>
          )}

          {/* Reload Frame Button */}
          {embedSrc && (
            <button
              onClick={handleReloadFrame}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs transition"
              title="Reload Embed"
            >
              <i className="fas fa-redo-alt text-[10px]"></i> Reload
            </button>
          )}

          {/* Open in Dedicated Isolated Tab Button */}
          {embedSrc && (
            <a
              href={embedSrc}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => audioEngine.playConfirm()}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs transition"
              title="Launch in Dedicated Cross-Origin Isolated Window"
            >
              <i className="fas fa-external-link-alt text-[10px]"></i> Isolated Window ↗
            </a>
          )}

          <div className="hidden sm:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-emerald-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {fps} FPS • 8K HDR
          </div>

          <div className="hidden md:flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-white/80">
            <i className="fas fa-gamepad text-blue-400"></i> DualSense 2.0
          </div>

          <button
            onClick={handleFullscreenToggle}
            className="w-9 h-9 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 flex items-center justify-center transition"
            title="Toggle Fullscreen"
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'}`}></i>
          </button>

          <button
            onClick={() => setShowHud(!showHud)}
            className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 text-xs transition"
          >
            {showHud ? 'Hide HUD' : 'Show HUD'}
          </button>

          <button
            onClick={handleExit}
            className="px-4 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/30"
            title="Exit game and return to PlayStation dashboard (◯ or Esc)"
          >
            <i className="far fa-circle text-white text-xs"></i> Exit / Back (◯)
          </button>
        </div>
      </div>

      {/* Main Game Screen Content */}
      <div className="flex-1 w-full h-full relative flex items-center justify-center bg-black">
        {/* If P.T. is in native_3d mode: Play the built-in 3D WebGL corridor with zero cross-origin issues! */}
        {isPT && engineMode === 'native_3d' ? (
          <PTHallwayGame onUnlockTrophy={onTrophyUnlock} />
        ) : embedSrc ? (
          <div className="w-full h-full relative">
            <iframe
              ref={iframeRef}
              key={iframeKey}
              src={embedSrc}
              title={game.title.replace('<br>', ' ')}
              className="w-full h-full border-0 absolute inset-0 bg-neutral-950"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cross-origin-isolated; fullscreen; gamepad; microphone; xr-spatial-tracking"
              allowFullScreen
            />

            {/* Bottom Helper Bar for WebAssembly Titles */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-black/85 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[11px] text-white/90 flex items-center gap-3 shadow-2xl">
              <span>WebAssembly / Scratch Runtime Active</span>
              <button
                onClick={handleReloadFrame}
                className="px-2.5 py-0.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition"
              >
                Reload Frame
              </button>
              <a
                href={embedSrc}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-0.5 rounded-full bg-[var(--ps-blue)] text-white font-bold hover:bg-blue-500 transition"
              >
                Open in Isolated Window ↗
              </a>
              {isPT && (
                <button
                  onClick={() => setEngineMode('native_3d')}
                  className="px-3 py-0.5 rounded-full bg-red-600 text-white font-bold hover:bg-red-500 transition"
                >
                  Play Native 3D Hallway
                </button>
              )}
            </div>
          </div>
        ) : (
          /* High-Fidelity PS6 Interactive Game Hub for Concept Games */
          <div className="w-full h-full relative flex flex-col justify-between p-8 md:p-16">
            <div
              className="absolute inset-0 bg-cover bg-center filter brightness-40 blur-sm scale-105"
              style={{ backgroundImage: `url(${game.bg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

            <div className="relative z-10 max-w-2xl mt-12">
              <span className="text-xs font-bold tracking-[0.3em] text-[var(--ps-gold)] uppercase">
                {game.pub} • PS6 NEXT-GEN EXCLUSIVE
              </span>
              <h1 className="text-4xl md:text-6xl font-black font-orbitron uppercase text-white drop-shadow-2xl mt-2 leading-none">
                {game.title.replace('<br>', ' ')}
              </h1>
              <p className="text-sm md:text-base text-white/80 mt-4 leading-relaxed font-light">
                {game.description ||
                  'Running on the ultra-low latency PS6 WebAssembly runtime with dynamic 8K rendering and DualSense 2.0 haptic feedback.'}
              </p>

              {/* Interactive Mini-Challenge / QTE for Non-Embed Games */}
              <div className="mt-8 p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                    <i className="fas fa-gamepad text-blue-400"></i> Interactive DualSense 2.0 Combat Test
                  </span>
                  <span className="text-xs font-mono font-bold text-amber-300">
                    Score: {interactiveScore} | Combo: x{combo}
                  </span>
                </div>

                <div className="text-xs text-white/80 mb-4 bg-black/40 p-2.5 rounded-xl font-mono">
                  {actionMessage}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <button
                    onClick={() => handleQteAction('Square - Light Attack')}
                    className="py-3 px-2 rounded-xl bg-blue-600/60 hover:bg-blue-600 active:bg-blue-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 border border-blue-400/30 transition active:scale-95 min-h-[52px]"
                  >
                    <i className="far fa-square text-base text-pink-400"></i>
                    <span>Square (Attack)</span>
                  </button>
                  <button
                    onClick={() => handleQteAction('Triangle - Heavy Strike')}
                    className="py-3 px-2 rounded-xl bg-emerald-600/60 hover:bg-emerald-600 active:bg-emerald-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 border border-emerald-400/30 transition active:scale-95 min-h-[52px]"
                  >
                    <i className="fas fa-caret-up text-base text-emerald-400"></i>
                    <span>Triangle (Strike)</span>
                  </button>
                  <button
                    onClick={() => handleQteAction('Circle - Evade & Dodge')}
                    className="py-3 px-2 rounded-xl bg-red-600/60 hover:bg-red-600 active:bg-red-500 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 border border-red-400/30 transition active:scale-95 min-h-[52px]"
                  >
                    <i className="far fa-circle text-base text-red-400"></i>
                    <span>Circle (Dodge)</span>
                  </button>
                  <button
                    onClick={() => handleQteAction('X - Symbiote Surge')}
                    className="py-3 px-2 rounded-xl bg-blue-800/80 hover:bg-blue-700 active:bg-blue-600 text-white font-bold text-xs flex flex-col items-center justify-center gap-1 border border-blue-400/30 transition active:scale-95 min-h-[52px]"
                  >
                    <i className="fas fa-times text-base text-cyan-400"></i>
                    <span>X (Surge)</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs text-white/60 pt-6">
              <div>Size: {game.sizeGb || '92'} GB • Ray Tracing Ultra • 120 FPS Target</div>
              <div className="flex gap-4">
                <span>Hold PS Button for Home</span>
                <span>Press ESC or ◯ to Close</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
