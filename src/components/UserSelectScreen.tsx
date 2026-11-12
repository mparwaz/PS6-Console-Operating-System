import React, { useState } from 'react';
import { UserProfile } from '../types';
import { audioEngine } from '../utils/audio';

interface UserSelectScreenProps {
  users: UserProfile[];
  activeUser: UserProfile;
  currentTime: string;
  onSelectUser: (user: UserProfile) => void;
  onCreateUser: (name: string, seed: string) => void;
  onDeleteUser?: (id: string) => void;
  onBackToBoot?: () => void;
}

export const UserSelectScreen: React.FC<UserSelectScreenProps> = ({
  users,
  activeUser,
  currentTime,
  onSelectUser,
  onCreateUser,
  onDeleteUser,
  onBackToBoot
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [selectedAvatarSeed, setSelectedAvatarSeed] = useState('Gamer1');

  const avatarPresets = ['Chri', 'Ares', 'Valkyrie', 'Shadow', 'Cyber', 'Ghost', 'Kratos', 'Titan'];

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim()) return;
    audioEngine.playConfirm();
    onCreateUser(newUserName.trim(), selectedAvatarSeed);
    setNewUserName('');
    setShowCreateModal(false);
  };

  return (
    <div
      id="user-select-screen"
      className="fixed inset-0 z-[150] bg-[#f0f4f8] text-[#111] flex flex-col items-center justify-center transition-all duration-700 select-none overflow-hidden"
    >
      <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex items-center gap-3 sm:gap-4 z-20">
        {onBackToBoot && (
          <button
            onClick={() => {
              audioEngine.playHover();
              onBackToBoot();
            }}
            className="px-3 py-1.5 rounded-full bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            title="Back to Boot Screen"
          >
            <i className="fas fa-arrow-left text-[10px]"></i> Back
          </button>
        )}
        <div className="text-2xl sm:text-3xl font-bold tracking-widest font-orbitron text-neutral-800">
          PS6
        </div>
      </div>
      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 text-2xl sm:text-3xl font-light text-neutral-700 tracking-wider z-20">
        {currentTime}
      </div>

      <div className="text-center mb-6 sm:mb-8 mt-12 sm:mt-0 px-4 animate-[slideDown_0.5s_ease-out]">
        <p className="font-bold text-xs sm:text-base md:text-lg mb-1.5 sm:mb-2 flex items-center justify-center gap-2 text-neutral-800">
          <i className="fas fa-gamepad text-blue-600"></i> DUALSENSE 2.0 connected
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-light text-neutral-900 tracking-tight">
          Who is using this controller?
        </h1>
      </div>

      {/* Single Horizontal Row with sleek custom scrollbar */}
      <div className="w-full max-w-7xl px-4 sm:px-8 relative z-10">
        <div className="flex flex-row flex-nowrap items-center justify-start gap-6 overflow-x-auto ps-scrollable-x pb-8 pt-4 px-4 w-full">
          {/* Create User Card */}
          <div
            className="user-card shrink-0 flex-shrink-0 hover:-translate-y-2 transition-transform duration-300 group cursor-pointer"
            onMouseEnter={() => audioEngine.playHover()}
            onClick={() => {
              audioEngine.playConfirm();
              setShowCreateModal(true);
            }}
          >
            <div className="text-5xl mb-4 font-light text-neutral-400 group-hover:text-blue-600 transition-colors">
              +
            </div>
            <h3 className="font-bold text-sm text-neutral-800">Create User</h3>
            <p className="text-[10px] text-neutral-500 text-center px-4 mt-2">
              Add a new user to this console
            </p>
          </div>

          {/* Existing Users in the Single Row */}
          {users.map((u) => {
            const isSelected = u.id === activeUser.id;
            return (
              <div
                key={u.id}
                className={`user-card shrink-0 flex-shrink-0 group relative cursor-pointer ${
                  isSelected ? 'selected' : ''
                }`}
                onMouseEnter={() => audioEngine.playHover()}
                onClick={() => {
                  audioEngine.playConfirm();
                  onSelectUser(u);
                }}
              >
                {/* Delete Account Button on Hover if multiple accounts exist */}
                {users.length > 1 && onDeleteUser && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playConfirm();
                      onDeleteUser(u.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition shadow z-20"
                    title={`Delete ${u.name}'s account`}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}

                <div
                  className={`w-20 h-20 ${
                    u.avatarBg || 'bg-purple-900'
                  } rounded-2xl flex items-center justify-center mb-4 border-2 border-white/20 shadow-lg relative overflow-hidden`}
                >
                  <img
                    src={
                      u.customAvatarUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.avatarSeed}`
                    }
                    alt={u.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <h3 className="font-bold text-sm flex items-center gap-1.5 text-center px-2">
                  <span className="truncate max-w-[120px]">{u.name}</span>
                  {isSelected && <i className="fas fa-check-circle text-[10px] text-white"></i>}
                </h3>

                <p
                  className={`text-[9px] mt-1 mb-4 ${
                    isSelected ? 'text-white/80' : 'text-neutral-500'
                  }`}
                >
                  {u.tier} • Level {u.level}
                </p>

                <div
                  className={`px-4 py-1.5 rounded-full text-[10px] font-bold flex items-center gap-2 shadow-md transition-all ${
                    isSelected
                      ? 'bg-white text-[#c5a059]'
                      : 'bg-neutral-100 text-neutral-700 group-hover:bg-blue-600 group-hover:text-white'
                  }`}
                >
                  <i className="fas fa-times text-[8px] bg-[#c5a059] text-white rounded-full w-3.5 h-3.5 flex items-center justify-center"></i>
                  Tap to sign in
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <p className="absolute bottom-8 text-neutral-400 text-xs tracking-widest uppercase font-bold text-center w-full">
        CHRI TV • PLAY HAS NO LIMITS
      </p>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white text-neutral-900 rounded-3xl p-8 max-w-md w-full shadow-2xl relative border border-neutral-200 animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => {
                audioEngine.playHover();
                setShowCreateModal(false);
              }}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 text-lg"
            >
              <i className="fas fa-times"></i>
            </button>

            <h3 className="text-2xl font-bold mb-2 text-neutral-900 font-orbitron">
              Create New Player
            </h3>
            <p className="text-xs text-neutral-500 mb-6">
              Create a personalized profile for local games and WASM runtime.
            </p>

            <form onSubmit={handleCreateSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Player Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. NeoGamerX"
                  className="w-full px-4 py-3 rounded-xl border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm font-semibold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {avatarPresets.map((seed) => (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => {
                        audioEngine.playHover();
                        setSelectedAvatarSeed(seed);
                      }}
                      className={`p-1.5 rounded-2xl border-2 transition-all ${
                        selectedAvatarSeed === seed
                          ? 'border-blue-600 scale-105 bg-blue-50 shadow-md'
                          : 'border-transparent hover:border-neutral-200'
                      }`}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                        alt={seed}
                        className="w-12 h-12 rounded-xl mx-auto bg-neutral-100"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border border-neutral-300 text-neutral-700 font-bold text-xs hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition"
                >
                  Create & Sign In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
