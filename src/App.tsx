import React, { useState, useEffect, useCallback } from 'react';
import {
  GameApp,
  UserProfile,
  NotificationItem,
  ChatMessage,
  Trophy,
  SystemSettings,
  Friend
} from './types';
import {
  getStoredGames,
  saveStoredGames,
  getStoredUsers,
  saveStoredUsers,
  getStoredActiveUser,
  saveStoredActiveUser,
  getStoredSettings,
  saveStoredSettings,
  getStoredNotifications,
  saveStoredNotifications,
  getStoredMessages,
  saveStoredMessages,
  getStoredTrophies,
  saveStoredTrophies,
  getStoredFriends,
  saveStoredFriends
} from './utils/storage';
import { audioEngine } from './utils/audio';

import { BootScreen } from './components/BootScreen';
import { UserSelectScreen } from './components/UserSelectScreen';
import { Header } from './components/Header';
import { Shelf } from './components/Shelf';
import { Widgets } from './components/Widgets';
import { MediaView } from './components/MediaView';
import { LibraryView } from './components/LibraryView';
import { SettingsView } from './components/SettingsView';
import { AddGameModal } from './components/AddGameModal';
import { EditAppModal } from './components/EditAppModal';
import { GameRuntimeModal } from './components/GameRuntimeModal';
import { PlayStationStoreView } from './components/PlayStationStoreView';
import { ExploreAppView } from './components/ExploreAppView';

import { NetworkModal } from './components/Modals/NetworkModal';
import { ControllerModal } from './components/Modals/ControllerModal';
import { NotificationsModal } from './components/Modals/NotificationsModal';
import { MessagesModal } from './components/Modals/MessagesModal';
import { TrophiesModal } from './components/Modals/TrophiesModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { FriendsModal } from './components/Modals/FriendsModal';

export default function App() {
  // Screen Flow: 'boot' -> 'user-select' -> 'home'
  const [screen, setScreen] = useState<'boot' | 'user-select' | 'home'>('boot');
  const [activeTab, setActiveTab] = useState<'all' | 'media' | 'library' | 'settings'>('all');
  const [activeIdx, setActiveIdx] = useState<number>(2); // Default to TLOU Part III
  const [currentTime, setCurrentTime] = useState<string>('16:07');

  // Persistent State
  const [games, setGames] = useState<GameApp[]>(getStoredGames);
  const [users, setUsers] = useState<UserProfile[]>(getStoredUsers);
  const [activeUser, setActiveUser] = useState<UserProfile>(getStoredActiveUser);
  const [settings, setSettings] = useState<SystemSettings>(getStoredSettings);
  const [notifications, setNotifications] = useState<NotificationItem[]>(getStoredNotifications);
  const [messages, setMessages] = useState<ChatMessage[]>(getStoredMessages);
  const [trophies, setTrophies] = useState<Trophy[]>(getStoredTrophies);
  const [friends, setFriends] = useState<Friend[]>(getStoredFriends);

  // Dedicated Views for PlayStation Store & Explore
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [isExploreOpen, setIsExploreOpen] = useState(false);

  // Modals, Edit State & Active Game
  const [activeModal, setActiveModal] = useState<
    'network' | 'controller' | 'notifications' | 'messages' | 'trophies' | 'profile' | 'friends' | 'vision' | null
  >(null);
  const [isAddGameOpen, setIsAddGameOpen] = useState(false);
  const [editingApp, setEditingApp] = useState<GameApp | null>(null);
  const [runningGame, setRunningGame] = useState<GameApp | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [showNotificationPill, setShowNotificationPill] = useState(true);
  const [trophyToast, setTrophyToast] = useState<{ gameTitle: string; title: string } | null>(null);

  // Synchronize Theme class on body
  useEffect(() => {
    if (settings.theme === 'light') {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
      document.body.classList.add('theme-dark');
    }
  }, [settings.theme]);

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const hh = d.getHours().toString().padStart(2, '0');
      const mm = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hh}:${mm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update Settings
  const handleUpdateSettings = (newSettings: Partial<SystemSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveStoredSettings(updated);
      return updated;
    });
  };

  // Add Game / WASM App
  const handleAddGame = (newGame: GameApp, launchImmediately = false) => {
    const updatedGames = [newGame, ...games];
    setGames(updatedGames);
    saveStoredGames(updatedGames);
    setActiveIdx(0);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${newGame.title.replace('<br>', ' ')} Installed`,
      description: 'WebAssembly game embedded and saved to console shelf.',
      time: 'Just now',
      read: false,
      type: 'download'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);

    // Unlock WASM Architect Trophy if not yet unlocked
    handleUnlockTrophy(newGame.title.replace('<br>', ' '), 'Gold - Code Architect');

    if (launchImmediately) {
      setRunningGame(newGame);
    }
  };

  // Update Existing App (Title, Publisher, Cover, URL, iframe, etc.)
  const handleUpdateApp = (updatedApp: GameApp) => {
    const updated = games.map((g) => (g.id === updatedApp.id ? updatedApp : g));
    setGames(updated);
    saveStoredGames(updated);

    // Notify user
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `${updatedApp.title.replace('<br>', ' ')} Updated`,
      description: 'App configuration and layout saved successfully.',
      time: 'Just now',
      read: false,
      type: 'system'
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    saveStoredNotifications(updatedNotifs);
  };

  // Delete App (custom or system/explore/games)
  const handleDeleteApp = (id: string) => {
    const deletedApp = games.find((g) => g.id === id);
    const updated = games.filter((g) => g.id !== id);
    setGames(updated);
    saveStoredGames(updated);
    if (activeIdx >= updated.length) {
      setActiveIdx(Math.max(0, updated.length - 1));
    }

    if (deletedApp) {
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: `${deletedApp.title.replace('<br>', ' ')} Deleted`,
        description: 'App removed from PlayStation console shelf.',
        time: 'Just now',
        read: false,
        type: 'system'
      };
      const updatedNotifs = [newNotif, ...notifications];
      setNotifications(updatedNotifs);
      saveStoredNotifications(updatedNotifs);
    }
  };

  // Move App Left or Right on Shelf
  const handleMoveApp = (appId: string, direction: 'left' | 'right') => {
    const idx = games.findIndex((g) => g.id === appId);
    if (idx === -1) return;
    const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= games.length) return;

    const copy = [...games];
    const [removed] = copy.splice(idx, 1);
    copy.splice(targetIdx, 0, removed);
    setGames(copy);
    saveStoredGames(copy);
    setActiveIdx(targetIdx);
  };

  // Add Friend
  const handleAddFriend = (newFriend: Friend) => {
    const updated = [newFriend, ...friends];
    setFriends(updated);
    saveStoredFriends(updated);
  };

  // Clear all custom games
  const handleClearCustomGames = () => {
    const updated = games.filter((g) => !g.isCustom);
    setGames(updated);
    saveStoredGames(updated);
    setActiveIdx(0);
  };

  // Trophy Unlock
  const handleUnlockTrophy = useCallback((gameTitle: string, trophyTitle: string) => {
    audioEngine.playTrophy();
    setTrophyToast({ gameTitle, title: trophyTitle });

    setTrophies((prev) => {
      const updated = prev.map((t) => {
        if (t.title.toLowerCase().includes(trophyTitle.toLowerCase()) || t.gameTitle.includes(gameTitle)) {
          return { ...t, earned: true, earnedDate: 'Just Now' };
        }
        return t;
      });
      saveStoredTrophies(updated);
      return updated;
    });

    setTimeout(() => {
      setTrophyToast(null);
    }, 4500);
  }, []);

  // Send Message in Chat
  const handleSendMessage = (text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: activeUser.name,
      senderAvatar: activeUser.avatarSeed,
      senderColor: 'bg-blue-600',
      text,
      time: currentTime,
      isMe: true
    };
    const updated = [...messages, newMsg];
    setMessages(updated);
    saveStoredMessages(updated);

    // Simulated reply after 1.5 seconds
    setTimeout(() => {
      const replies = [
        "That's hype! Let's jump into the raid.",
        'Nice! Loaded in 8K 120 FPS on my side.',
        'WASM runtime is running buttery smooth.',
        'Ready! Sending party invite now.'
      ];
      const botReply: ChatMessage = {
        id: `msg-bot-${Date.now()}`,
        sender: 'Player 1',
        senderAvatar: 'A',
        senderColor: 'bg-yellow-600',
        text: replies[Math.floor(Math.random() * replies.length)],
        time: currentTime
      };
      setMessages((curr) => {
        const next = [...curr, botReply];
        saveStoredMessages(next);
        return next;
      });
      audioEngine.playConfirm();
    }, 1500);
  };

  // Create User
  const handleCreateUser = (name: string, avatarSeed: string) => {
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name,
      avatarSeed,
      avatarBg: 'bg-indigo-900',
      level: 1,
      trophiesCount: 0,
      tier: 'PS Plus Essential',
      status: 'Online',
      lastSeen: 'Now'
    };
    const updated = [...users, newUser];
    setUsers(updated);
    saveStoredUsers(updated);
    setActiveUser(newUser);
    saveStoredActiveUser(newUser);
    handleLoginToHome(newUser);
  };

  // Update User Profile (Settings)
  const handleUpdateUser = (updatedUser: UserProfile) => {
    const updated = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(updated);
    saveStoredUsers(updated);
    if (activeUser.id === updatedUser.id) {
      setActiveUser(updatedUser);
      saveStoredActiveUser(updatedUser);
    }
  };

  // Delete User Profile (Settings or UserSelectScreen)
  const handleDeleteUser = (userId: string) => {
    if (users.length <= 1) return;
    const updated = users.filter((u) => u.id !== userId);
    setUsers(updated);
    saveStoredUsers(updated);
    if (activeUser.id === userId) {
      const nextUser = updated[0];
      setActiveUser(nextUser);
      saveStoredActiveUser(nextUser);
    }
  };

  // Login to Home
  const handleLoginToHome = (user: UserProfile) => {
    setActiveUser(user);
    saveStoredActiveUser(user);
    if (settings.ambientDrone) {
      audioEngine.startDrone();
    }
    setScreen('home');
  };

  // Central Launch Handler for Games & Apps
  const handleLaunchGame = (game: GameApp) => {
    audioEngine.playConfirm();
    if (game.id === 'store' || game.type === 'system') {
      setIsStoreOpen(true);
    } else if (game.id === 'explore' || game.type === 'explore') {
      setIsExploreOpen(true);
    } else {
      setRunningGame(game);
    }
  };

  // Surprise Me (Dice Icon)
  const handleSurpriseMe = () => {
    const gameIndices = games
      .map((g, idx) => (g.type === 'game' || g.type === 'custom_wasm' ? idx : -1))
      .filter((i) => i !== -1);
    if (gameIndices.length === 0) return;
    const randomIdx = gameIndices[Math.floor(Math.random() * gameIndices.length)];
    setActiveIdx(randomIdx);
    setActiveTab('all');
  };

  // Keyboard navigation
  useEffect(() => {
    if (screen !== 'home' || runningGame !== null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if (e.key === 'ArrowRight') {
        setActiveIdx((prev) => {
          const next = (prev + 1) % games.length;
          audioEngine.playHover();
          return next;
        });
      } else if (e.key === 'ArrowLeft') {
        setActiveIdx((prev) => {
          const next = (prev - 1 + games.length) % games.length;
          audioEngine.playHover();
          return next;
        });
      } else if (e.key === 'Enter') {
        if (!activeModal && !isAddGameOpen && !isStoreOpen && !isExploreOpen) {
          handleLaunchGame(games[activeIdx]);
        }
      } else if (e.key === 'Escape') {
        audioEngine.playHover();
        if (isStoreOpen) {
          setIsStoreOpen(false);
        } else if (isExploreOpen) {
          setIsExploreOpen(false);
        } else if (activeModal) {
          setActiveModal(null);
        } else if (isAddGameOpen) {
          setIsAddGameOpen(false);
        } else if (editingApp) {
          setEditingApp(null);
        } else if (activeTab !== 'all') {
          setActiveTab('all');
        }
      } else if (e.key === 'q' || e.key === 'Q') {
        const tabs: ('media' | 'library' | 'all' | 'settings')[] = ['media', 'library', 'all', 'settings'];
        const currentIdx = tabs.indexOf(activeTab);
        const prevTab = tabs[(currentIdx - 1 + tabs.length) % tabs.length];
        audioEngine.playConfirm();
        setActiveTab(prevTab);
      } else if (e.key === 'e' || e.key === 'E') {
        const tabs: ('media' | 'library' | 'all' | 'settings')[] = ['media', 'library', 'all', 'settings'];
        const currentIdx = tabs.indexOf(activeTab);
        const nextTab = tabs[(currentIdx + 1) % tabs.length];
        audioEngine.playConfirm();
        setActiveTab(nextTab);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    screen,
    runningGame,
    games,
    activeIdx,
    activeModal,
    isAddGameOpen,
    isStoreOpen,
    isExploreOpen,
    activeTab
  ]);

  const activeGame = games[activeIdx] || games[0];
  const displayedGame = (hoveredIdx !== null && games[hoveredIdx]) ? games[hoveredIdx] : activeGame;
  const currentBgImage = displayedGame?.bg || displayedGame?.cardImg || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920';

  return (
    <div className="w-screen h-screen overflow-hidden select-none bg-[var(--bg-color)] text-[var(--text-color)] relative">
      {/* 1. Boot Screen */}
      {screen === 'boot' && (
        <BootScreen onBootComplete={() => setScreen('user-select')} />
      )}

      {/* 2. User Select Screen (Single Horizontal Row with custom scrollbar) */}
      {screen === 'user-select' && (
        <UserSelectScreen
          users={users}
          activeUser={activeUser}
          currentTime={currentTime}
          onSelectUser={(u) => handleLoginToHome(u)}
          onCreateUser={handleCreateUser}
          onDeleteUser={handleDeleteUser}
          onBackToBoot={() => setScreen('boot')}
        />
      )}

      {/* 3. Main Dashboard */}
      {screen === 'home' && (
        <div id="app-container" className="opacity-100 transition-opacity duration-1000 flex flex-col h-full w-full relative">
          {/* Dynamic Background with hover support */}
          <div
            id="dynamic-bg"
            style={{
              backgroundImage: `url('${currentBgImage}')`
            }}
          ></div>
          <div className="bg-overlay"></div>

          <div id="ui-layer">
            {/* Header */}
            <Header
              activeTab={activeTab}
              onTabChange={setActiveTab}
              user={activeUser}
              currentTime={currentTime}
              notifications={notifications}
              onOpenModal={(type) => {
                if (type === 'addGame') {
                  setIsAddGameOpen(true);
                } else {
                  setActiveModal(type);
                }
              }}
              onSurpriseMe={handleSurpriseMe}
              showNotificationPill={showNotificationPill}
              onDismissPill={() => setShowNotificationPill(false)}
            />

            {/* Main Tab Content */}
            {activeTab === 'all' && (
              <>
                <main className="flex-1 relative w-full pointer-events-none">
                  <Widgets
                    activeGame={displayedGame}
                    friends={friends}
                    onOpenFriends={() => setActiveModal('friends')}
                    onOpenStore={() => setIsStoreOpen(true)}
                    onOpenVisionDemo={() => setActiveModal('vision')}
                  />
                </main>

                {/* Horizontal 3D Shelf */}
                <Shelf
                  games={games}
                  activeIdx={activeIdx}
                  onSelectGame={setActiveIdx}
                  onHoverGame={setHoveredIdx}
                  onLaunchGame={handleLaunchGame}
                  onOpenAddModal={() => setIsAddGameOpen(true)}
                  onEditApp={(app) => setEditingApp(app)}
                  onMoveApp={handleMoveApp}
                />

                {/* Footer Logo */}
                <div className="absolute bottom-4 w-full flex justify-center z-0 opacity-40 pointer-events-none">
                  <i className="fab fa-playstation text-3xl drop-shadow-lg"></i>
                </div>
              </>
            )}

            {activeTab === 'media' && (
              <MediaView onBackToHome={() => setActiveTab('all')} />
            )}

            {activeTab === 'library' && (
              <LibraryView
                games={games}
                onLaunchGame={handleLaunchGame}
                onOpenAddModal={() => setIsAddGameOpen(true)}
                onEditApp={(app) => setEditingApp(app)}
                onDeleteGame={handleDeleteApp}
                onBackToHome={() => setActiveTab('all')}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                games={games}
                onClearCustomGames={handleClearCustomGames}
                onBackToHome={() => setActiveTab('all')}
                users={users}
                activeUser={activeUser}
                onUpdateUser={handleUpdateUser}
                onDeleteUser={handleDeleteUser}
                onCreateUser={(name, seed) => {
                  const newUser: UserProfile = {
                    id: `user-${Date.now()}`,
                    name,
                    avatarSeed: seed,
                    avatarBg: 'bg-indigo-900',
                    level: 1,
                    trophiesCount: 0,
                    tier: 'PS Plus Essential',
                    status: 'Online',
                    lastSeen: 'Now'
                  };
                  const updated = [...users, newUser];
                  setUsers(updated);
                  saveStoredUsers(updated);
                }}
                onSwitchUser={(user) => {
                  setActiveUser(user);
                  saveStoredActiveUser(user);
                }}
                onRestoreSnapshot={(data) => {
                  if (data.games) {
                    setGames(data.games);
                    saveStoredGames(data.games);
                  }
                  if (data.settings) {
                    setSettings(data.settings);
                    saveStoredSettings(data.settings);
                  }
                  if (data.users) {
                    setUsers(data.users);
                    saveStoredUsers(data.users);
                  }
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* PlayStation Store Full Interface */}
      {isStoreOpen && (
        <PlayStationStoreView
          installedGames={games}
          onInstallGame={(game) => {
            handleAddGame(game, false);
            handleUnlockTrophy(game.title, 'Silver - Store Collector');
          }}
          onLaunchGame={(game) => {
            setIsStoreOpen(false);
            handleLaunchGame(game);
          }}
          onBackToHome={() => setIsStoreOpen(false)}
        />
      )}

      {/* Explore App Full Interface */}
      {isExploreOpen && (
        <ExploreAppView
          onBackToHome={() => setIsExploreOpen(false)}
          onOpenStore={() => {
            setIsExploreOpen(false);
            setIsStoreOpen(true);
          }}
        />
      )}

      {/* Trophy Notification Toast (Top Right Banner with Sound) */}
      {trophyToast && (
        <div className="fixed top-6 right-6 z-[10001] bg-black/85 backdrop-blur-md text-white border border-[#c5a059] p-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-[slideDown_0.4s_ease-out]">
          <div className="w-10 h-10 rounded-xl bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40 flex items-center justify-center text-xl shrink-0">
            <i className="fas fa-trophy"></i>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[#c5a059] tracking-wider">
              Trophy Unlocked!
            </div>
            <div className="text-xs font-bold text-white font-orbitron">{trophyToast.title}</div>
            <div className="text-[10px] text-white/70">{trophyToast.gameTitle}</div>
          </div>
        </div>
      )}

      {/* Universal Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
          <div className={`glass-panel p-5 sm:p-6 md:p-8 rounded-3xl w-full ${activeModal === 'friends' ? 'max-w-lg' : 'max-w-md'} max-h-[88vh] overflow-y-auto shadow-2xl relative border border-white/10 animate-[fadeIn_0.2s_ease-out]`}>
            <button
              onClick={() => {
                audioEngine.playHover();
                setActiveModal(null);
              }}
              className="absolute top-4 right-4 text-[var(--text-muted)] hover:text-white transition text-lg p-1"
            >
              <i className="fas fa-times"></i>
            </button>

            <h3 className="text-xl font-bold mb-4 flex items-center gap-2.5 text-[var(--ps-blue)] font-orbitron">
              {activeModal === 'network' && (
                <>
                  <i className="fas fa-wifi text-base"></i> Network Status
                </>
              )}
              {activeModal === 'controller' && (
                <>
                  <i className="fas fa-gamepad text-base"></i> DualSense 2.0
                </>
              )}
              {activeModal === 'notifications' && (
                <>
                  <i className="fas fa-bell text-base"></i> Notifications
                </>
              )}
              {activeModal === 'messages' && (
                <>
                  <i className="fas fa-comment text-base"></i> Messages & Raid Party
                </>
              )}
              {activeModal === 'trophies' && (
                <>
                  <i className="fas fa-trophy text-base text-[var(--ps-gold)]"></i> Trophy Cabinet
                </>
              )}
              {activeModal === 'profile' && (
                <>
                  <i className="fas fa-user text-base"></i> Profile Management
                </>
              )}
              {activeModal === 'friends' && (
                <>
                  <i className="fas fa-users text-base"></i> Friends Active Now
                </>
              )}
              {activeModal === 'vision' && (
                <>
                  <i className="fas fa-vr-cardboard text-base"></i> Apple Vision Pro 3D Gaming
                </>
              )}
            </h3>

            {activeModal === 'network' && <NetworkModal onClose={() => setActiveModal(null)} />}
            {activeModal === 'controller' && <ControllerModal onClose={() => setActiveModal(null)} />}
            {activeModal === 'notifications' && (
              <NotificationsModal
                notifications={notifications}
                onClearAll={() => {
                  setNotifications([]);
                  saveStoredNotifications([]);
                }}
                onDismiss={(id) => {
                  const updated = notifications.filter((n) => n.id !== id);
                  setNotifications(updated);
                  saveStoredNotifications(updated);
                }}
                onClose={() => setActiveModal(null)}
              />
            )}
            {activeModal === 'messages' && (
              <MessagesModal
                messages={messages}
                onSendMessage={handleSendMessage}
                onClose={() => setActiveModal(null)}
              />
            )}
            {activeModal === 'trophies' && (
              <TrophiesModal
                trophies={trophies}
                onUnlockTestTrophy={() =>
                  handleUnlockTrophy('PS6 System Secret', 'Platinum - Master Explorer')
                }
                onClose={() => setActiveModal(null)}
              />
            )}
            {activeModal === 'profile' && (
              <ProfileModal
                user={activeUser}
                onChangeStatus={(status) => {
                  const updated = { ...activeUser, status };
                  setActiveUser(updated);
                  saveStoredActiveUser(updated);
                }}
                onUpdateAvatar={(customAvatarUrl) => {
                  const updated = { ...activeUser, customAvatarUrl };
                  setActiveUser(updated);
                  saveStoredActiveUser(updated);
                  const updatedUsers = users.map((u) => (u.id === activeUser.id ? updated : u));
                  setUsers(updatedUsers);
                  saveStoredUsers(updatedUsers);
                }}
                onSwitchUser={() => {
                  setActiveModal(null);
                  setScreen('user-select');
                }}
                onClose={() => setActiveModal(null)}
              />
            )}
            {activeModal === 'friends' && (
              <FriendsModal
                friends={friends}
                games={games}
                onJoinGame={(gameTitle) => {
                  const match = games.find(
                    (g) =>
                      g.title.toLowerCase().includes(gameTitle.toLowerCase()) ||
                      gameTitle.toLowerCase().includes(g.title.toLowerCase())
                  );
                  setActiveModal(null);
                  if (match) {
                    handleLaunchGame(match);
                  } else {
                    setActiveTab('library');
                  }
                }}
                onOpenChatWithFriend={(_friendName) => {
                  setActiveModal('messages');
                }}
                onAddFriend={handleAddFriend}
                onClose={() => setActiveModal(null)}
              />
            )}
            {activeModal === 'vision' && (
              <div className="space-y-4 text-center">
                <div className="p-6 rounded-2xl bg-black/40 border border-white/10">
                  <i className="fas fa-vr-cardboard text-5xl text-blue-400 mb-3"></i>
                  <h4 className="font-bold text-base text-white">Apple Vision Pro Spatial Gaming</h4>
                  <p className="text-xs text-[var(--text-muted)] mt-2 leading-relaxed">
                    Stream your PS6 games in virtual 120-inch 8K HDR floating screens with micro-OLED spatial immersion and ultra-low latency WebAssembly game rendering.
                  </p>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="w-full py-2.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Game / WASM App via URL Modal */}
      <AddGameModal
        isOpen={isAddGameOpen}
        onClose={() => setIsAddGameOpen(false)}
        onAddGame={handleAddGame}
      />

      {/* Edit App & Layout Modal */}
      <EditAppModal
        app={editingApp}
        isOpen={!!editingApp}
        onClose={() => setEditingApp(null)}
        onSave={handleUpdateApp}
        onDelete={handleDeleteApp}
        onMoveLeft={(id) => handleMoveApp(id, 'left')}
        onMoveRight={(id) => handleMoveApp(id, 'right')}
        canMoveLeft={!!editingApp && games.findIndex((g) => g.id === editingApp.id) > 0}
        canMoveRight={!!editingApp && games.findIndex((g) => g.id === editingApp.id) < games.length - 1}
      />

      {/* Full Game Runtime Player */}
      {runningGame && (
        <GameRuntimeModal
          game={runningGame}
          onClose={() => setRunningGame(null)}
          onTrophyUnlock={handleUnlockTrophy}
        />
      )}
    </div>
  );
}
