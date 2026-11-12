import React from 'react';
import { UserProfile, NotificationItem } from '../types';
import { audioEngine } from '../utils/audio';

interface HeaderProps {
  activeTab: 'all' | 'media' | 'library' | 'settings';
  onTabChange: (tab: 'all' | 'media' | 'library' | 'settings') => void;
  user: UserProfile;
  currentTime: string;
  notifications: NotificationItem[];
  onOpenModal: (type: 'network' | 'controller' | 'notifications' | 'messages' | 'trophies' | 'profile' | 'addGame') => void;
  onSurpriseMe: () => void;
  showNotificationPill: boolean;
  onDismissPill: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  user,
  currentTime,
  notifications,
  onOpenModal,
  onSurpriseMe,
  showNotificationPill,
  onDismissPill
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleTabClick = (tab: 'all' | 'media' | 'library' | 'settings') => {
    audioEngine.playConfirm();
    onTabChange(tab);
  };

  const handleTriggerL1 = () => {
    const tabs: ('media' | 'library' | 'all' | 'settings')[] = ['media', 'library', 'all', 'settings'];
    const idx = tabs.indexOf(activeTab);
    const nextIdx = (idx - 1 + tabs.length) % tabs.length;
    handleTabClick(tabs[nextIdx]);
  };

  const handleTriggerR1 = () => {
    const tabs: ('media' | 'library' | 'all' | 'settings')[] = ['media', 'library', 'all', 'settings'];
    const idx = tabs.indexOf(activeTab);
    const nextIdx = (idx + 1) % tabs.length;
    handleTabClick(tabs[nextIdx]);
  };

  return (
    <header className="w-full px-[4vw] py-3 md:py-[3vh] flex flex-col md:flex-row justify-between items-center gap-3 md:gap-0 z-50 select-none">
      {/* Top Bar for Desktop, or Top Row for Mobile */}
      <div className="w-full md:w-auto flex justify-between md:justify-start items-center gap-3 sm:gap-4 header-line pb-1.5 md:pb-2 text-xs sm:text-sm text-[var(--text-color)]">
        <span className="font-semibold tracking-wide font-mono text-sm sm:text-base mr-1">{currentTime}</span>

        <button
          className="hover:text-[var(--ps-blue)] transition cursor-pointer p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center"
          onClick={() => {
            audioEngine.playHover();
            onOpenModal('network');
          }}
          title="Network Status"
        >
          <i className="fas fa-wifi text-xs sm:text-sm"></i>
        </button>

        <button
          className="hover:text-[var(--ps-blue)] transition cursor-pointer p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center"
          onClick={() => {
            audioEngine.playHover();
            onOpenModal('controller');
          }}
          title="DualSense 2.0 Controller"
        >
          <i className="fas fa-gamepad text-xs sm:text-sm"></i>
        </button>

        <div
          className="relative flex items-center cursor-pointer group p-1.5 min-w-[32px] min-h-[32px] justify-center"
          onClick={() => {
            audioEngine.playHover();
            onOpenModal('notifications');
          }}
          title="Notifications"
        >
          <i className="fas fa-bell text-xs sm:text-sm group-hover:text-[var(--ps-blue)] transition"></i>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 text-[9px] bg-red-500 text-white px-1.5 py-0.2 rounded-full font-bold shadow">
              {unreadCount}
            </span>
          )}
        </div>

        <button
          className="hover:text-[var(--ps-blue)] transition cursor-pointer p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center"
          onClick={() => {
            audioEngine.playHover();
            onOpenModal('messages');
          }}
          title="Messages & Groups"
        >
          <i className="fas fa-comment text-xs sm:text-sm"></i>
        </button>

        <button
          className="hover:text-[var(--ps-gold)] transition cursor-pointer p-1.5 min-w-[32px] min-h-[32px] flex items-center justify-center"
          onClick={() => {
            audioEngine.playHover();
            onOpenModal('trophies');
          }}
          title="Trophies"
        >
          <i className="fas fa-trophy text-xs sm:text-sm text-[var(--ps-gold)]"></i>
        </button>

        {/* On Mobile only: Profile & Actions in Top Row */}
        <div className="flex md:hidden items-center gap-2 ml-auto">
          <button
            onClick={() => {
              audioEngine.playConfirm();
              onSurpriseMe();
            }}
            className="p-1.5 text-white/80 hover:text-[var(--ps-blue)] transition"
            title="Surprise Me"
          >
            <i className="fas fa-dice text-base"></i>
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              onOpenModal('addGame');
            }}
            className="p-1.5 text-[var(--ps-gold)] hover:scale-110 transition"
            title="Add WASM / Scratch Game"
          >
            <i className="fas fa-plus text-base"></i>
          </button>

          <div
            className="w-7 h-7 rounded-full border border-white/20 bg-purple-900 overflow-hidden shrink-0 cursor-pointer"
            onClick={() => {
              audioEngine.playHover();
              onOpenModal('profile');
            }}
          >
            <img
              src={user.customAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Center Navigation - Desktop centered, Mobile touch-friendly pill bar */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-8 text-xs sm:text-[13px] font-bold tracking-wide w-full md:w-auto overflow-x-auto ps-scrollable-x py-1">
        <button
          onClick={handleTriggerL1}
          className="hidden sm:inline-block border border-[var(--text-muted)] hover:border-white rounded px-2 py-0.5 text-[10px] text-[var(--text-muted)] hover:text-white transition cursor-pointer"
        >
          L1
        </button>

        <span
          className={`cursor-pointer transition px-3 sm:px-4 py-1.5 rounded-full text-center whitespace-nowrap ${
            activeTab === 'media' ? 'tab-active text-white' : 'opacity-70 hover:opacity-100'
          }`}
          onClick={() => handleTabClick('media')}
        >
          Media
        </span>

        <span
          className={`cursor-pointer transition px-3 sm:px-4 py-1.5 rounded-full text-center whitespace-nowrap ${
            activeTab === 'library' ? 'tab-active text-white' : 'opacity-70 hover:opacity-100'
          }`}
          onClick={() => handleTabClick('library')}
        >
          Library
        </span>

        <span
          className={`cursor-pointer transition px-3 sm:px-4 py-1.5 rounded-full text-center whitespace-nowrap ${
            activeTab === 'all' ? 'tab-active text-white' : 'opacity-70 hover:opacity-100'
          }`}
          onClick={() => handleTabClick('all')}
        >
          All
        </span>

        <span
          className={`cursor-pointer transition px-3 sm:px-4 py-1.5 rounded-full text-center whitespace-nowrap ${
            activeTab === 'settings' ? 'tab-active text-white' : 'opacity-70 hover:opacity-100'
          }`}
          onClick={() => handleTabClick('settings')}
        >
          Settings
        </span>

        <button
          onClick={handleTriggerR1}
          className="hidden sm:inline-block border border-[var(--text-muted)] hover:border-white rounded px-2 py-0.5 text-[10px] text-[var(--text-muted)] hover:text-white transition cursor-pointer"
        >
          R1
        </button>
      </div>

      {/* Right Profile & Actions (Visible on Desktop) */}
      <div className="hidden md:flex gap-4 items-center relative shrink-0">
        <button
          onClick={() => {
            audioEngine.playConfirm();
            onSurpriseMe();
          }}
          className="hover:text-[var(--ps-blue)] transition cursor-pointer p-1"
          title="Surprise Me (Random Game)"
        >
          <i className="fas fa-dice text-lg opacity-80 hover:opacity-100"></i>
        </button>

        <button
          onClick={() => handleTabClick('all')}
          className="hover:scale-110 transition cursor-pointer p-1"
          title="Home"
        >
          <i className="fab fa-playstation text-[var(--ps-blue)] text-lg"></i>
        </button>

        {/* Gold Plus button to Add URL / WASM Game */}
        <button
          onClick={() => {
            audioEngine.playHover();
            onOpenModal('addGame');
          }}
          className="hover:scale-125 transition cursor-pointer p-1 text-[var(--ps-gold)] hover:text-[var(--ps-gold-light)]"
          title="Add WebAssembly / Scratch Game via URL or <iframe>"
        >
          <i className="fas fa-plus text-lg"></i>
        </button>

        {/* User Profile */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:scale-105 transition pl-1"
          onClick={() => {
            audioEngine.playHover();
            onOpenModal('profile');
          }}
        >
          <div className="w-8 h-8 rounded-full border border-white/20 bg-purple-900 overflow-hidden shrink-0">
            <img
              src={user.customAvatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatarSeed}`}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-sm font-semibold tracking-wide hidden lg:block">{user.name}</span>
        </div>
      </div>

      {/* Notification Pill (Positioned cleanly for both mobile and desktop) */}
      {showNotificationPill && (
        <div
          className="fixed md:absolute top-16 md:top-full right-4 md:right-[4vw] mt-2 bg-white text-black px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 cursor-pointer hover:bg-neutral-50 transition animate-[slideDown_0.4s_ease-out] z-[100] max-w-[calc(100vw-32px)] sm:min-w-[270px] border border-neutral-200"
          onClick={() => {
            audioEngine.playConfirm();
            onOpenModal('messages');
            onDismissPill();
          }}
        >
          <div className="w-7 h-7 bg-[var(--ps-blue)] rounded-full flex items-center justify-center text-white shrink-0">
            <i className="fas fa-comment text-xs"></i>
          </div>
          <span className="font-semibold text-xs flex-1 truncate">You have +3 new messages</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismissPill();
            }}
            className="text-neutral-400 hover:text-neutral-700 text-xs p-1"
            title="Dismiss"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </header>
  );
};
