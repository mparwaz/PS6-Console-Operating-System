import React, { useRef, useEffect } from 'react';
import { GameApp } from '../types';
import { audioEngine } from '../utils/audio';

interface ShelfProps {
  games: GameApp[];
  activeIdx: number;
  onSelectGame: (index: number) => void;
  onLaunchGame: (game: GameApp) => void;
  onOpenAddModal: () => void;
  onEditApp: (app: GameApp) => void;
  onMoveApp?: (appId: string, direction: 'left' | 'right') => void;
  onHoverGame?: (index: number | null) => void;
}

export const Shelf: React.FC<ShelfProps> = ({
  games,
  activeIdx,
  onSelectGame,
  onLaunchGame,
  onOpenAddModal,
  onEditApp,
  onMoveApp,
  onHoverGame
}) => {
  const shelfRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  // Smoothly center or align active card across mobile, tablet, and desktop
  useEffect(() => {
    if (!shelfRef.current) return;
    const activeCard = shelfRef.current.children[activeIdx] as HTMLElement;
    if (activeCard) {
      const cardLeft = activeCard.offsetLeft;
      const containerWidth = window.innerWidth;
      const cardWidth = activeCard.offsetWidth;
      const isMobile = containerWidth < 768;

      // On mobile, center the active card directly; on desktop, position with aesthetic left offset
      const targetTranslate = isMobile
        ? Math.max(0, cardLeft - (containerWidth - cardWidth) / 2)
        : Math.max(0, cardLeft - containerWidth / 3.2);

      shelfRef.current.style.transform = `translateX(-${targetTranslate}px)`;
    }
  }, [activeIdx, games.length]);

  // Touch Swipe Gesture for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - (touchStartY.current || 0);

    // If swipe is primarily horizontal and exceeds 35px threshold
    if (Math.abs(deltaX) > 35 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left -> Advance to next game
        audioEngine.playHover();
        onSelectGame((activeIdx + 1) % games.length);
      } else {
        // Swiped Right -> Go to previous game
        audioEngine.playHover();
        onSelectGame((activeIdx - 1 + games.length) % games.length);
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleNavPrev = () => {
    audioEngine.playHover();
    onSelectGame((activeIdx - 1 + games.length) % games.length);
  };

  const handleNavNext = () => {
    audioEngine.playHover();
    onSelectGame((activeIdx + 1) % games.length);
  };

  return (
    <div
      id="shelf-container"
      className="select-none relative"
      onMouseLeave={() => onHoverGame?.(null)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Mobile Touch Navigation Chevrons */}
      <div className="absolute -top-10 inset-x-4 flex md:hidden justify-between items-center z-30 pointer-events-none px-2">
        <button
          type="button"
          onClick={handleNavPrev}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs pointer-events-auto shadow-lg active:scale-95 transition"
          title="Previous Game"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <div className="text-[10px] font-mono text-white/60 bg-black/50 px-2 py-0.5 rounded-full border border-white/10">
          {activeIdx + 1} / {games.length}
        </div>
        <button
          type="button"
          onClick={handleNavNext}
          className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center text-xs pointer-events-auto shadow-lg active:scale-95 transition"
          title="Next Game"
        >
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>

      <div
        id="shelf"
        ref={shelfRef}
        className="flex gap-3 sm:gap-[1.5vw] items-end transition-transform duration-400 ease-out"
      >
        {games.map((app, idx) => {
          const isActive = idx === activeIdx;
          const btnText =
            app.type === 'explore'
              ? 'Enter Explore'
              : app.type === 'system'
              ? 'Open Store'
              : 'Play Game';

          return (
            <div
              key={app.id}
              className={`card ${isActive ? 'active' : ''} ${app.cardStyle || ''} group/card relative`}
              onMouseEnter={() => {
                if (activeIdx !== idx) {
                  audioEngine.playHover();
                  onSelectGame(idx);
                }
                onHoverGame?.(idx);
              }}
              onMouseLeave={() => {
                onHoverGame?.(null);
              }}
              onClick={() => {
                if (!isActive) {
                  audioEngine.playHover();
                  onSelectGame(idx);
                } else {
                  audioEngine.playConfirm();
                  onLaunchGame(app);
                }
              }}
            >
              {app.innerHTML ? (
                <div
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ __html: app.innerHTML }}
                />
              ) : (
                <img
                  src={app.cardImg}
                  alt={app.title.replace(/<[^>]*>?/gm, '')}
                  className="card-bg-img"
                  loading="lazy"
                />
              )}

              {/* PS6 Custom Badge for WASM / Scratch apps */}
              {app.category === 'Scratch / Educational' ? (
                <span className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold bg-purple-600 text-white shadow-md z-10">
                  SCRATCH
                </span>
              ) : (app.isCustom || app.type === 'custom_wasm') ? (
                <span className="absolute top-2 left-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[7px] sm:text-[8px] font-bold bg-[var(--ps-gold)] text-black shadow-md z-10">
                  WASM
                </span>
              ) : null}

              {/* Edit App Button - Top Right */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  audioEngine.playConfirm();
                  onEditApp(app);
                }}
                className={`absolute top-2 right-2 w-6 h-6 rounded-full bg-black/70 hover:bg-[var(--ps-blue)] border border-white/20 text-white flex items-center justify-center text-[10px] transition-all z-20 ${
                  isActive ? 'opacity-100 scale-100' : 'opacity-0 group-hover/card:opacity-100 scale-90 hover:scale-100'
                }`}
                title={`Edit ${app.title.replace('<br>', ' ')} & Layout`}
              >
                <i className="fas fa-pen"></i>
              </button>

              <div className="card-inner-ui">
                <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
                  {/* Reorder Arrows on Shelf */}
                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.playHover();
                        onMoveApp?.(app.id, 'left');
                      }}
                      className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-[9px] transition"
                      title="Move Left on Shelf"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                  )}
                  <div className="bg-white/20 backdrop-blur-md text-white text-[7px] sm:text-[8px] font-bold px-2 py-0.5 rounded-full shadow">
                    PS6
                  </div>
                  {idx < games.length - 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.playHover();
                        onMoveApp?.(app.id, 'right');
                      }}
                      className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-[9px] transition"
                      title="Move Right on Shelf"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  )}
                </div>

                <button
                  className="w-[90%] sm:w-[85%] py-1.5 sm:py-2 rounded-full border border-[var(--ps-blue)] bg-black/80 text-white text-[9px] sm:text-[10px] font-bold hover:bg-[var(--ps-blue)] hover:shadow-[0_0_15px_rgba(0,112,204,0.8)] transition cursor-pointer active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEngine.playConfirm();
                    onLaunchGame(app);
                  }}
                >
                  {btnText}
                </button>
              </div>
            </div>
          );
        })}

        {/* Extra Card: Add WASM Game shortcut */}
        <div
          className="card bg-white/5 border border-dashed border-white/20 hover:border-[var(--ps-gold)] hover:bg-white/10 flex flex-col items-center justify-center group cursor-pointer"
          onMouseEnter={() => audioEngine.playHover()}
          onClick={() => {
            audioEngine.playHover();
            onOpenAddModal();
          }}
          title="Add Custom WebAssembly Game"
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[var(--ps-gold)]/20 text-[var(--ps-gold)] flex items-center justify-center text-lg sm:text-xl group-hover:scale-110 transition-transform">
            <i className="fas fa-plus"></i>
          </div>
          <span className="text-[9px] sm:text-[10px] font-bold text-white/80 group-hover:text-[var(--ps-gold)] mt-2 sm:mt-3 text-center px-2">
            + Add WASM
          </span>
        </div>
      </div>
    </div>
  );
};
