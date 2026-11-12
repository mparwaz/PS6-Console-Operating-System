import React, { useState } from 'react';
import { GameApp } from '../types';
import { audioEngine } from '../utils/audio';

interface LibraryViewProps {
  games: GameApp[];
  onLaunchGame: (game: GameApp) => void;
  onOpenAddModal: () => void;
  onEditApp: (app: GameApp) => void;
  onDeleteGame: (id: string) => void;
  onBackToHome?: () => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  games,
  onLaunchGame,
  onOpenAddModal,
  onEditApp,
  onDeleteGame,
  onBackToHome
}) => {
  const [filter, setFilter] = useState<'all' | 'installed' | 'wasm' | 'scratch' | 'system'>('all');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'size' | 'recent'>('name');

  const filteredGames = games
    .filter((g) => {
      if (filter === 'system') return g.type === 'explore' || g.type === 'system';
      if (filter === 'wasm') return g.type === 'custom_wasm' && g.category !== 'Scratch / Educational';
      if (filter === 'scratch') return g.category === 'Scratch / Educational';
      if (filter === 'installed') return g.type === 'game' || g.type === 'custom_wasm';
      return true; // 'all' shows all games, WASM, Scratch, Store, and Explore!
    })
    .filter((g) => {
      if (!search.trim()) return true;
      const cleanTitle = g.title.replace(/<[^>]*>?/gm, '').toLowerCase();
      const cleanPub = g.pub.toLowerCase();
      return cleanTitle.includes(search.toLowerCase()) || cleanPub.includes(search.toLowerCase());
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === 'size') {
        return (b.sizeGb || 0) - (a.sizeGb || 0);
      }
      return 0;
    });

  return (
    <div id="view-library" className="view-section active overflow-y-auto pt-28 pb-16 select-none">
      <div className="max-w-7xl mx-auto px-[4vw]">
        {/* Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              {onBackToHome && (
                <button
                  onClick={() => {
                    audioEngine.playHover();
                    onBackToHome();
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 shadow"
                  title="Back to PlayStation Dashboard (◯)"
                >
                  <i className="far fa-circle text-[var(--ps-gold)] text-xs"></i> Back
                </button>
              )}
              <h2 className="text-3xl font-bold font-orbitron">Game & WASM Library</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Browse, launch, and manage your installed PlayStation, Scratch EDU, and WebAssembly games.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <i className="fas fa-search absolute left-3.5 top-3 text-xs text-[var(--text-muted)]"></i>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search library..."
                className="pl-9 pr-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              />
            </div>

            {/* Filter buttons - Smooth touch horizontal scrolling on mobile */}
            <div className="flex flex-nowrap overflow-x-auto ps-scrollable-x gap-1 bg-white/5 p-1 rounded-full border border-white/10 shrink-0 max-w-full">
              <button
                onClick={() => {
                  audioEngine.playHover();
                  setFilter('all');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                  filter === 'all' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                All ({games.length})
              </button>
              <button
                onClick={() => {
                  audioEngine.playHover();
                  setFilter('scratch');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                  filter === 'scratch' ? 'bg-purple-600 text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                Scratch EDU
              </button>
              <button
                onClick={() => {
                  audioEngine.playHover();
                  setFilter('wasm');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                  filter === 'wasm' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                WASM Emulation
              </button>
              <button
                onClick={() => {
                  audioEngine.playHover();
                  setFilter('system');
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition ${
                  filter === 'system' ? 'bg-[var(--ps-gold)] text-black font-bold' : 'text-white/70 hover:text-white'
                }`}
              >
                Store & Explore
              </button>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as unknown as typeof sortBy)}
              className="px-3 py-2 rounded-full bg-white/10 border border-white/20 text-xs text-white focus:outline-none"
            >
              <option value="name" className="bg-neutral-900 text-white">
                Sort: Name (A-Z)
              </option>
              <option value="size" className="bg-neutral-900 text-white">
                Sort: Size (GB)
              </option>
            </select>

            {/* + Add Game Button */}
            <button
              onClick={() => {
                audioEngine.playConfirm();
                onOpenAddModal();
              }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--ps-gold)] to-[var(--ps-gold-light)] text-black font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <i className="fas fa-plus"></i> Add App / Embed
            </button>
          </div>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {filteredGames.map((app, i) => (
            <div
              key={app.id}
              className="group cursor-pointer relative"
              style={{ animation: `fadeIn 0.5s ease-out ${(i * 0.04).toFixed(2)}s both` }}
              onClick={() => {
                audioEngine.playConfirm();
                onLaunchGame(app);
              }}
            >
              <div className="aspect-[3/4] rounded-2xl bg-neutral-900 border-2 border-transparent group-hover:border-[var(--ps-blue)] transition-all duration-300 shadow-xl relative overflow-hidden group-hover:-translate-y-2">
                <img
                  src={app.cardImg || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400'}
                  alt={app.title.replace(/<[^>]*>?/gm, '')}
                  className="w-full h-full object-cover absolute inset-0 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badge */}
                {app.category === 'Scratch / Educational' ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-purple-600 text-white shadow-md z-10">
                    SCRATCH
                  </span>
                ) : (app.type === 'custom_wasm' || app.isCustom) ? (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[8px] font-bold bg-[var(--ps-gold)] text-black shadow-md z-10">
                    WASM
                  </span>
                ) : null}

                {/* Edit & Delete Action Buttons */}
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition z-20">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playConfirm();
                      onEditApp(app);
                    }}
                    className="w-6 h-6 rounded-full bg-black/80 hover:bg-[var(--ps-blue)] text-white flex items-center justify-center text-[10px] shadow border border-white/20 transition"
                    title="Edit App & Layout"
                  >
                    <i className="fas fa-pen"></i>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playConfirm();
                      onDeleteGame(app.id);
                    }}
                    className="w-6 h-6 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center text-[10px] shadow border border-white/20 transition"
                    title="Delete / Uninstall App"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center backdrop-blur-xs p-4 text-center">
                  <div className="w-12 h-12 rounded-full bg-[var(--ps-blue)] text-white flex items-center justify-center text-xl shadow-lg shadow-blue-500/50 mb-2 transform scale-75 group-hover:scale-100 transition">
                    <i className="fas fa-play ml-0.5"></i>
                  </div>
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                    Play Now
                  </span>
                  <span className="text-[9px] text-white/70 mt-1 font-mono">
                    {app.sizeGb ? `${app.sizeGb} GB` : 'WASM Native'}
                  </span>
                </div>
              </div>

              <div className="mt-2.5">
                <p className="text-xs font-semibold truncate opacity-90 group-hover:opacity-100 group-hover:text-[var(--ps-blue)] transition">
                  {app.title.replace(/<br>/g, ' ')}
                </p>
                <div className="flex justify-between items-center text-[10px] text-[var(--text-muted)] mt-0.5">
                  <span>{app.pub}</span>
                  <span>{app.releaseYear || '2026'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Back Button & Controller Guide */}
        {onBackToHome && (
          <div className="mt-12 flex justify-between items-center pt-6 border-t border-white/10 text-xs text-[var(--text-muted)]">
            <button
              onClick={() => {
                audioEngine.playHover();
                onBackToHome();
              }}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-2"
            >
              <i className="far fa-circle text-[var(--ps-gold)]"></i> Back to Dashboard
            </button>
            <div className="flex items-center gap-4 text-[11px]">
              <span><kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">Esc</kbd> / <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">◯</kbd> Back</span>
              <span><kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">Q</kbd> / <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">E</kbd> Switch View</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
