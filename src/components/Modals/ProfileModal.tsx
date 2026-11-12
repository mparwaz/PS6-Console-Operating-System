import React from 'react';
import { UserProfile } from '../../types';
import { audioEngine } from '../../utils/audio';

import { compressImage } from '../../utils/imageCompressor';

interface ProfileModalProps {
  user: UserProfile;
  onChangeStatus: (status: UserProfile['status']) => void;
  onUpdateAvatar?: (avatarDataUrl: string) => void;
  onSwitchUser: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onChangeStatus,
  onUpdateAvatar,
  onSwitchUser,
  onClose
}) => {
  const statuses: UserProfile['status'][] = ['Online', 'In Game', 'Away', 'Do Not Disturb'];
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      // Compress to 256x256 (~15-30KB) so localStorage never hits quota limits
      const compressedDataUrl = await compressImage(file, 256, 256, 0.85);
      if (onUpdateAvatar) {
        onUpdateAvatar(compressedDataUrl);
      }
      audioEngine.playConfirm();
      audioEngine.playTrophy();
    } catch {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (onUpdateAvatar) {
          onUpdateAvatar(dataUrl);
        }
        audioEngine.playConfirm();
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarSrc = user.customAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`w-16 h-16 ${user.avatarBg || 'bg-purple-900'} rounded-2xl flex items-center justify-center border-2 border-white/20 shadow-lg relative overflow-hidden group cursor-pointer`}
          title="Click to Upload Custom Avatar Image (PNG/JPG)"
        >
          <img
            src={avatarSrc}
            alt={user.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs">
            <i className="fas fa-camera"></i>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp"
          className="hidden"
          onChange={handleAvatarFile}
        />
        <div>
          <h4 className="text-lg font-bold text-white flex items-center gap-2">
            {user.name}
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-normal">
              {user.tier}
            </span>
          </h4>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Level {user.level} • {user.trophiesCount} Trophies
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] text-blue-400 hover:text-blue-300 font-bold mt-1.5 flex items-center gap-1"
          >
            <i className="fas fa-upload text-[9px]"></i> Upload Custom Avatar (PNG/JPG)
          </button>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-2">
          Change Status
        </label>
        <div className="grid grid-cols-2 gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => {
                audioEngine.playHover();
                onChangeStatus(s);
              }}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-left transition flex items-center gap-2 ${
                user.status === s
                  ? 'bg-[var(--ps-blue)] text-white shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  s === 'Online'
                    ? 'bg-emerald-400'
                    : s === 'In Game'
                    ? 'bg-blue-400'
                    : s === 'Away'
                    ? 'bg-amber-400'
                    : 'bg-red-400'
                }`}
              ></span>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => {
            audioEngine.playConfirm();
            onSwitchUser();
          }}
          className="flex-1 py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-xs transition flex items-center justify-center gap-2"
        >
          <i className="fas fa-users"></i> Switch User / Log Out
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};
