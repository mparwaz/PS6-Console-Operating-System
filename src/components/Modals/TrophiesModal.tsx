import React from 'react';
import { Trophy } from '../../types';
import { audioEngine } from '../../utils/audio';

interface TrophiesModalProps {
  trophies: Trophy[];
  onUnlockTestTrophy: () => void;
  onClose: () => void;
}

export const TrophiesModal: React.FC<TrophiesModalProps> = ({
  trophies,
  onUnlockTestTrophy,
  onClose
}) => {
  const platinum = trophies.filter((t) => t.type === 'platinum' && t.earned).length;
  const gold = trophies.filter((t) => t.type === 'gold' && t.earned).length;
  const silver = trophies.filter((t) => t.type === 'silver' && t.earned).length;
  const bronze = trophies.filter((t) => t.type === 'bronze' && t.earned).length;

  return (
    <div className="space-y-4">
      {/* Overview Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#c5a059]/20 border border-[#c5a059]/40 flex items-center justify-center text-[#c5a059] text-2xl">
            <i className="fas fa-trophy"></i>
          </div>
          <div>
            <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-bold">
              Trophy Level
            </div>
            <div className="text-2xl font-bold font-orbitron text-white">Level 42</div>
          </div>
        </div>

        <div className="flex gap-3 text-center">
          <div>
            <div className="text-sm font-bold text-cyan-300 font-orbitron">{platinum}</div>
            <div className="text-[9px] text-cyan-300/80 font-bold uppercase">Plat</div>
          </div>
          <div>
            <div className="text-sm font-bold text-amber-400 font-orbitron">{gold}</div>
            <div className="text-[9px] text-amber-400/80 font-bold uppercase">Gold</div>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-300 font-orbitron">{silver}</div>
            <div className="text-[9px] text-slate-300/80 font-bold uppercase">Silv</div>
          </div>
          <div>
            <div className="text-sm font-bold text-amber-600 font-orbitron">{bronze}</div>
            <div className="text-[9px] text-amber-600/80 font-bold uppercase">Bron</div>
          </div>
        </div>
      </div>

      {/* Trophy List */}
      <div className="max-h-[260px] overflow-y-auto space-y-2 pr-1 hide-scroll">
        {trophies.map((t) => (
          <div
            key={t.id}
            className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition ${
              t.earned
                ? 'bg-white/10 border-white/15'
                : 'bg-white/5 border-white/5 opacity-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                  t.type === 'platinum'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : t.type === 'gold'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : t.type === 'silver'
                    ? 'bg-slate-400/20 text-slate-300 border border-slate-400/40'
                    : 'bg-amber-700/20 text-amber-600 border border-amber-700/40'
                }`}
              >
                <i className={`fas ${t.icon}`}></i>
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  {t.title}
                  {t.earned && (
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Earned
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-[var(--text-muted)] leading-tight mt-0.5">
                  {t.description}
                </div>
                <div className="text-[9px] text-blue-400 mt-1">{t.gameTitle}</div>
              </div>
            </div>
            {t.earnedDate && (
              <span className="text-[9px] text-white/40 shrink-0">{t.earnedDate}</span>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <button
          onClick={() => {
            audioEngine.playHover();
            onUnlockTestTrophy();
          }}
          className="flex-1 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <i className="fas fa-sparkles"></i> Unlock Secret Trophy (Test)
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
