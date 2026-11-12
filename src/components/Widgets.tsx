import React from 'react';
import { GameApp, Friend } from '../types';
import { audioEngine } from '../utils/audio';

interface WidgetsProps {
  activeGame: GameApp;
  friends: Friend[];
  onOpenFriends: () => void;
  onOpenStore: () => void;
  onOpenVisionDemo: () => void;
}

export const Widgets: React.FC<WidgetsProps> = ({
  activeGame,
  friends,
  onOpenFriends,
  onOpenStore,
  onOpenVisionDemo
}) => {
  const isGame = activeGame.type === 'game' || activeGame.type === 'custom_wasm';
  const isExplore = activeGame.type === 'explore';

  return (
    <>
      {/* Title Area - Upper Left Quadrant */}
      <div
        id="title-area"
        className="absolute top-[10vh] md:top-[13vh] left-[4vw] md:left-[6vw] max-w-[90vw] md:max-w-[50vw] transition-all duration-300 pointer-events-auto z-10"
      >
        <p
          id="pub-name"
          className="text-[10px] sm:text-xs font-bold tracking-[0.3em] opacity-90 mb-1 text-[var(--ps-gold)] uppercase"
        >
          {activeGame.pub}
        </p>

        <h1
          id="game-title"
          className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-[1.05] drop-shadow-2xl font-orbitron text-white"
          dangerouslySetInnerHTML={{ __html: activeGame.title }}
        />

        {activeGame.description && (
          <p className="text-xs md:text-sm text-[var(--text-muted)] max-w-lg mt-2 line-clamp-2 leading-relaxed hidden sm:block">
            {activeGame.description}
          </p>
        )}
      </div>

      {/* Dynamic Widgets - Upper Right on Desktop, Floating Non-Overlapping on Mobile */}
      <div className="absolute top-auto bottom-[26vh] md:bottom-auto md:top-[13vh] right-[4vw] md:right-[6vw] pointer-events-auto z-10 flex flex-col items-end gap-2.5">
        {isGame && (
          <div
            id="widget-friends"
            className="glass-panel flex items-center gap-2.5 sm:gap-3.5 transition-all duration-300 px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer hover:scale-105 shadow-xl border border-white/10"
            onClick={() => {
              audioEngine.playHover();
              onOpenFriends();
            }}
          >
            <div className="flex -space-x-2">
              {friends.slice(0, 3).map((f) => (
                <div key={f.id} className="relative">
                  <img
                    src={f.avatarUrl}
                    alt={f.name}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-[var(--glass-border)] object-cover shadow"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-black ${
                      f.status === 'In Game' ? 'bg-emerald-400' : 'bg-blue-400'
                    }`}
                  ></span>
                </div>
              ))}
            </div>
            <div>
              <div className="text-[11px] sm:text-xs font-bold flex items-center gap-1.5 text-white">
                Friends Active <i className="fas fa-gamepad text-[9px] text-[var(--ps-blue)]"></i>
              </div>
              <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] truncate max-w-[140px] sm:max-w-[190px]">
                {friends[0] ? `${friends[0].name}` : 'Playing Spider-Man...'}
              </div>
            </div>
          </div>
        )}

        {isExplore && (
          <>
            <div
              id="widget-vision"
              className="glass-panel flex items-center gap-2.5 sm:gap-3 transition-all duration-300 px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer hover:scale-105 shadow-xl border border-white/10"
              onClick={() => {
                audioEngine.playHover();
                onOpenVisionDemo();
              }}
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_Vision_Pro_logo.svg"
                alt="Vision Pro"
                className="h-4 sm:h-5"
                style={{ filter: 'brightness(0) invert(var(--tw-invert, 1))' }}
              />
              <div className="w-px h-5 bg-[var(--text-muted)] opacity-50"></div>
              <div className="text-[11px] sm:text-xs font-light text-[var(--text-muted)]">
                3D Spatial Gaming
              </div>
            </div>

            <div
              id="widget-store"
              className="glass-panel flex items-center gap-2.5 sm:gap-3.5 transition-all duration-300 px-3 sm:px-4 py-2 sm:py-2.5 cursor-pointer hover:scale-105 shadow-xl border border-white/10"
              onClick={() => {
                audioEngine.playHover();
                onOpenStore();
              }}
            >
              <i className="fas fa-shopping-basket text-sm sm:text-base text-[var(--ps-gold)]"></i>
              <div>
                <div className="text-[11px] sm:text-xs font-bold text-[var(--ps-gold)]">PlayStation Store ✨</div>
                <div className="text-[9px] sm:text-[10px] text-[var(--text-muted)] hidden sm:block">
                  Latest Games on PS Store
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
