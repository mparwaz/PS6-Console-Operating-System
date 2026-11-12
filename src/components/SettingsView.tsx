import React, { useState, useEffect, useRef } from 'react';
import { SystemSettings, GameApp, UserProfile } from '../types';
import { audioEngine } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';
import {
  getPS6StorageEstimate,
  runIndexedDBBenchmark,
  saveConsoleSnapshot,
  getConsoleSnapshots,
  idbClear,
  STORES,
  StorageStats,
  BenchmarkResult
} from '../utils/indexedDb';

interface SettingsViewProps {
  settings: SystemSettings;
  onUpdateSettings: (newSettings: Partial<SystemSettings>) => void;
  games: GameApp[];
  onClearCustomGames: () => void;
  onBackToHome?: () => void;
  onRestoreSnapshot?: (snapshotData: any) => void;
  // Accounts management
  users?: UserProfile[];
  activeUser?: UserProfile;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  onDeleteUser?: (userId: string) => void;
  onCreateUser?: (name: string, seed: string) => void;
  onSwitchUser?: (user: UserProfile) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  games,
  onClearCustomGames,
  onBackToHome,
  onRestoreSnapshot,
  users = [],
  activeUser,
  onUpdateUser,
  onDeleteUser,
  onCreateUser,
  onSwitchUser
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'theme' | 'network' | 'storage' | 'audio' | 'accounts'
  >('theme');
  const [speedTesting, setSpeedTesting] = useState(false);
  const [speedResult, setSpeedResult] = useState<string | null>(null);

  // IndexedDB Storage State
  const [storageStats, setStorageStats] = useState<StorageStats | null>(null);
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchResult, setBenchResult] = useState<BenchmarkResult | null>(null);
  const [snapshots, setSnapshots] = useState<any[]>([]);
  const [snapshotStatus, setSnapshotStatus] = useState<string | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  // Account Edit & Create State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserTier, setEditUserTier] = useState<UserProfile['tier']>('PS Plus Premium');
  const [editUserLevel, setEditUserLevel] = useState<number>(1);
  const [editUserAvatarUrl, setEditUserAvatarUrl] = useState<string>('');
  const [editUserAvatarSeed, setEditUserAvatarSeed] = useState<string>('Chri');

  const [showCreateAccountModal, setShowCreateAccountModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccSeed, setNewAccSeed] = useState('Gamer1');
  const avatarUploadRef = useRef<HTMLInputElement>(null);

  const avatarPresets = ['Chri', 'Ares', 'Valkyrie', 'Shadow', 'Cyber', 'Ghost', 'Kratos', 'Titan'];

  // Storage breakdown calculations
  const totalStorageGb = 2048.0; // 2.0 TB Gen 5 NVMe SSD
  const gamesSizeSum = games.reduce((acc, curr) => acc + (curr.sizeGb || 25), 0);
  const customGamesCount = games.filter((g) => g.isCustom).length;
  const customGamesSize = games
    .filter((g) => g.isCustom)
    .reduce((acc, curr) => acc + (curr.sizeGb || 10), 0);
  const systemOsAllocatedGb = 160.0;
  const mediaAndAppsGb = 32.4;
  const usedStorageGb = parseFloat((systemOsAllocatedGb + gamesSizeSum + mediaAndAppsGb).toFixed(1));
  const availableStorageGb = parseFloat((Math.max(0, totalStorageGb - usedStorageGb)).toFixed(1));
  const usedPercent = Math.min(100, (usedStorageGb / totalStorageGb) * 100);

  // Load storage stats & snapshots when storage category is active
  useEffect(() => {
    if (activeCategory === 'storage') {
      loadStorageData();
    }
  }, [activeCategory]);

  const loadStorageData = async () => {
    try {
      const stats = await getPS6StorageEstimate();
      setStorageStats(stats);
      const snaps = await getConsoleSnapshots();
      setSnapshots(snaps);
    } catch (e) {
      console.warn('Failed to load storage data:', e);
    }
  };

  const toggleTheme = () => {
    audioEngine.playHover();
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    onUpdateSettings({ theme: nextTheme });
  };

  const handleRunSpeedTest = () => {
    audioEngine.playConfirm();
    setSpeedTesting(true);
    setTimeout(() => {
      setSpeedTesting(false);
      setSpeedResult('Download: 912 Mbps | Upload: 58 Mbps | Ping: 7ms');
      audioEngine.playTrophy();
    }, 1200);
  };

  // Run IndexedDB Benchmark
  const handleRunBenchmark = async () => {
    audioEngine.playConfirm();
    setBenchmarking(true);
    setBenchResult(null);
    try {
      const res = await runIndexedDBBenchmark();
      setBenchResult(res);
      audioEngine.playTrophy();
    } catch (e) {
      console.error('Benchmark failed:', e);
    } finally {
      setBenchmarking(false);
      loadStorageData();
    }
  };

  // Create Snapshot in IndexedDB
  const handleCreateSnapshot = async () => {
    audioEngine.playConfirm();
    setSnapshotStatus('Creating full console snapshot in IndexedDB...');
    try {
      const snapshotId = await saveConsoleSnapshot({
        games,
        settings,
        users,
        timestamp: Date.now()
      });
      setSnapshotStatus(`Snapshot created (${snapshotId}) successfully in IndexedDB.`);
      audioEngine.playTrophy();
      loadStorageData();
      setTimeout(() => setSnapshotStatus(null), 4000);
    } catch {
      setSnapshotStatus('Failed to write snapshot to IndexedDB.');
    }
  };

  // Export to JSON file
  const handleExportJson = () => {
    audioEngine.playConfirm();
    const backupData = {
      os: 'PS6 Concept OS v3.0',
      timestamp: new Date().toISOString(),
      games,
      settings,
      users
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ps6-os-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    audioEngine.playTrophy();
  };

  // Import from JSON file
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed.games && onRestoreSnapshot) {
          onRestoreSnapshot(parsed);
          audioEngine.playConfirm();
          audioEngine.playTrophy();
          setSnapshotStatus('Backup restored successfully into console storage!');
          setTimeout(() => setSnapshotStatus(null), 4000);
        }
      } catch {
        setSnapshotStatus('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  // Clear IndexedDB Cache
  const handleClearCache = async () => {
    audioEngine.playConfirm();
    await idbClear(STORES.BLOBS);
    await idbClear(STORES.SNAPSHOTS);
    setSnapshotStatus('IndexedDB temporary cache and snapshots cleared.');
    loadStorageData();
    setTimeout(() => setSnapshotStatus(null), 3000);
  };

  // Open Edit User Modal
  const handleStartEditUser = (user: UserProfile) => {
    audioEngine.playConfirm();
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserTier(user.tier);
    setEditUserLevel(user.level || 1);
    setEditUserAvatarUrl(user.customAvatarUrl || '');
    setEditUserAvatarSeed(user.avatarSeed || 'Chri');
  };

  // Save User Edits
  const handleSaveUserEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    audioEngine.playConfirm();

    const updated: UserProfile = {
      ...editingUser,
      name: editUserName.trim() || editingUser.name,
      tier: editUserTier,
      level: Math.max(1, editUserLevel),
      customAvatarUrl: editUserAvatarUrl || undefined,
      avatarSeed: editUserAvatarSeed
    };

    onUpdateUser?.(updated);
    setEditingUser(null);
    audioEngine.playTrophy();
  };

  // Handle Avatar Image Upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 256, 256, 0.85);
      setEditUserAvatarUrl(compressed);
      audioEngine.playConfirm();
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => setEditUserAvatarUrl(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Delete User
  const handleDeleteUserClick = (userId: string, userName: string) => {
    if (users.length <= 1) {
      alert('You cannot delete the only remaining profile on this console.');
      return;
    }
    const confirmed = window.confirm(
      `Are you sure you want to delete profile "${userName}"? Saved game progress for this user will be removed.`
    );
    if (!confirmed) return;

    audioEngine.playConfirm();
    onDeleteUser?.(userId);
    if (editingUser?.id === userId) {
      setEditingUser(null);
    }
  };

  // Create User Submit
  const handleCreateAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;
    audioEngine.playConfirm();
    onCreateUser?.(newAccName.trim(), newAccSeed);
    setNewAccName('');
    setShowCreateAccountModal(false);
  };

  return (
    <div id="view-settings" className="view-section active overflow-y-auto pt-28 pb-16 select-none">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 h-full px-[4vw]">
        {/* Left Navigation: Horizontal scroll on mobile, Vertical on desktop */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[var(--glass-border)] pr-0 md:pr-6 flex flex-col shrink-0">
          <div className="flex items-center gap-3 mb-3 md:mb-4 pl-1 md:pl-2">
            {onBackToHome && (
              <button
                onClick={() => {
                  audioEngine.playHover();
                  onBackToHome();
                }}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition flex items-center gap-1.5 shadow"
                title="Back to PlayStation Dashboard (◯)"
              >
                <i className="far fa-circle text-[var(--ps-gold)] text-xs"></i> Back
              </button>
            )}
            <h2 className="text-2xl md:text-3xl font-bold font-orbitron text-white">Settings</h2>
          </div>

          <div className="flex flex-row md:flex-col overflow-x-auto ps-scrollable-x md:overflow-visible gap-2 pb-3 md:pb-0">
            <button
              onClick={() => {
                audioEngine.playHover();
                setActiveCategory('theme');
              }}
              className={`text-left shrink-0 whitespace-nowrap px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                activeCategory === 'theme' ? 'glass-panel text-white border border-[var(--ps-blue)]' : 'opacity-70 hover:opacity-100 bg-white/5 md:bg-transparent'
              }`}
            >
              <i className="fas fa-paint-brush w-4 text-center text-blue-400"></i> Theme & Display
            </button>

            <button
              onClick={() => {
                audioEngine.playHover();
                setActiveCategory('accounts');
              }}
              className={`text-left shrink-0 whitespace-nowrap px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                activeCategory === 'accounts' ? 'glass-panel text-white border border-[var(--ps-blue)]' : 'opacity-70 hover:opacity-100 bg-white/5 md:bg-transparent'
              }`}
            >
              <i className="fas fa-users-cog w-4 text-center text-cyan-400"></i> Accounts & Users
            </button>

            <button
              onClick={() => {
                audioEngine.playHover();
                setActiveCategory('network');
              }}
              className={`text-left shrink-0 whitespace-nowrap px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                activeCategory === 'network' ? 'glass-panel text-white border border-[var(--ps-blue)]' : 'opacity-70 hover:opacity-100 bg-white/5 md:bg-transparent'
              }`}
            >
              <i className="fas fa-network-wired w-4 text-center text-emerald-400"></i> Network & Wi-Fi
            </button>

            <button
              onClick={() => {
                audioEngine.playHover();
                setActiveCategory('storage');
              }}
              className={`text-left shrink-0 whitespace-nowrap px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                activeCategory === 'storage' ? 'glass-panel text-white border border-[var(--ps-blue)]' : 'opacity-70 hover:opacity-100 bg-white/5 md:bg-transparent'
              }`}
            >
              <i className="fas fa-database w-4 text-center text-amber-400"></i> Storage & NVMe
            </button>

            <button
              onClick={() => {
                audioEngine.playHover();
                setActiveCategory('audio');
              }}
              className={`text-left shrink-0 whitespace-nowrap px-3.5 md:px-4 py-2.5 md:py-3 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2.5 sm:gap-3 cursor-pointer ${
                activeCategory === 'audio' ? 'glass-panel text-white border border-[var(--ps-blue)]' : 'opacity-70 hover:opacity-100 bg-white/5 md:bg-transparent'
              }`}
            >
              <i className="fas fa-volume-up w-4 text-center text-purple-400"></i> Sound & Drone
            </button>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-2/3 flex flex-col gap-4">
          {/* THEME & DISPLAY */}
          {activeCategory === 'theme' && (
            <div className="glass-panel flex flex-col p-6 gap-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex justify-between items-center pb-4 border-b border-[var(--glass-border)]">
                <div>
                  <h3 className="font-bold text-lg text-white">System Theme</h3>
                  <p className="text-xs text-[var(--text-muted)]">Switch between Light and Dark mode.</p>
                </div>

                {/* Theme Toggle Switch */}
                <div
                  className={`w-14 h-7 rounded-full relative cursor-pointer transition-colors duration-300 ${
                    settings.theme === 'light' ? 'bg-[var(--ps-blue)]' : 'bg-gray-600'
                  }`}
                  onClick={toggleTheme}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform duration-300 shadow-md ${
                      settings.theme === 'light' ? 'translate-x-8' : 'translate-x-1'
                    }`}
                  ></div>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[var(--glass-border)]">
                <div>
                  <span className="font-semibold text-sm text-white">Display Resolution</span>
                  <p className="text-xs text-[var(--text-muted)]">Adaptive ultra high-resolution rendering.</p>
                </div>
                <select
                  value={settings.resolution}
                  onChange={(e) => {
                    audioEngine.playHover();
                    onUpdateSettings({ resolution: e.target.value as unknown as SystemSettings['resolution'] });
                  }}
                  className="bg-black/30 text-white border border-white/20 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none"
                >
                  <option value="8k_60" className="bg-neutral-900">Automatic (8K HDR 60Hz)</option>
                  <option value="4k_120" className="bg-neutral-900">High-Frame (4K 120Hz)</option>
                  <option value="1440p_240" className="bg-neutral-900">Ultra-Speed (1440p 240Hz)</option>
                </select>
              </div>

              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="font-semibold text-sm text-white">Graphics Preset</span>
                  <p className="text-xs text-[var(--text-muted)]">Prioritize hardware ray tracing or maximum frames.</p>
                </div>
                <div className="flex gap-1 bg-white/10 p-1 rounded-xl">
                  <button
                    onClick={() => {
                      audioEngine.playHover();
                      onUpdateSettings({ graphicsMode: 'fidelity' });
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      settings.graphicsMode === 'fidelity' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/70'
                    }`}
                  >
                    Fidelity (Ray Tracing)
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playHover();
                      onUpdateSettings({ graphicsMode: 'performance' });
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      settings.graphicsMode === 'performance' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/70'
                    }`}
                  >
                    Performance (120 FPS)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNTS & USERS MANAGEMENT */}
          {activeCategory === 'accounts' && (
            <div className="glass-panel flex flex-col p-6 gap-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-[var(--glass-border)]">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <i className="fas fa-users text-cyan-400"></i> Accounts & Users Management
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Edit gamer tags, upload custom profile pictures, manage tiers, and delete accounts.
                  </p>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playConfirm();
                    setShowCreateAccountModal(true);
                  }}
                  className="px-4 py-1.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-1.5 shadow"
                >
                  <i className="fas fa-plus"></i> Add Account
                </button>
              </div>

              {/* Accounts List */}
              <div className="space-y-3">
                {users.map((u) => {
                  const isActive = activeUser?.id === u.id;
                  return (
                    <div
                      key={u.id}
                      className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-blue-500/10 border-[var(--ps-blue)] shadow-md'
                          : 'bg-black/30 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-purple-900 border border-white/20 overflow-hidden shrink-0 shadow relative">
                          <img
                            src={
                              u.customAvatarUrl ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.avatarSeed}`
                            }
                            alt={u.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-white">{u.name}</h4>
                            {isActive && (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Active Now
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[var(--text-muted)] mt-0.5">
                            {u.tier} • Level {u.level}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isActive && onSwitchUser && (
                          <button
                            onClick={() => {
                              audioEngine.playConfirm();
                              onSwitchUser(u);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
                            title="Switch to this account"
                          >
                            Switch
                          </button>
                        )}

                        <button
                          onClick={() => handleStartEditUser(u)}
                          className="px-3 py-1.5 rounded-xl bg-[var(--ps-blue)]/20 hover:bg-[var(--ps-blue)] text-blue-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                          title="Edit Account Details"
                        >
                          <i className="fas fa-pen text-[10px]"></i> Edit
                        </button>

                        {users.length > 1 && (
                          <button
                            onClick={() => handleDeleteUserClick(u.id, u.name)}
                            className="px-3 py-1.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
                            title="Delete Account"
                          >
                            <i className="fas fa-trash text-[10px]"></i> Delete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NETWORK & WI-FI */}
          {activeCategory === 'network' && (
            <div className="glass-panel flex flex-col p-6 gap-5 animate-[fadeIn_0.2s_ease-out]">
              <div>
                <h3 className="font-bold text-lg text-white">Network & Connection</h3>
                <p className="text-xs text-[var(--text-muted)]">Check your PlayStation Network status and internet latency.</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/30 border border-white/10 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Connection Method:</span>
                  <span className="font-bold text-white">Wi-Fi 7 (802.11be, 6 GHz Band)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Signal Strength:</span>
                  <span className="font-bold text-emerald-400">100% (Ultra Strong)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">NAT Type:</span>
                  <span className="font-bold text-emerald-400">Type 1 (Open)</span>
                </div>
                {speedResult && (
                  <div className="mt-3 pt-3 border-t border-white/10 text-emerald-300 font-mono text-center">
                    {speedResult}
                  </div>
                )}
              </div>

              <button
                onClick={handleRunSpeedTest}
                disabled={speedTesting}
                className="py-3 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center justify-center gap-2"
              >
                {speedTesting ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Running Diagnostics...
                  </>
                ) : (
                  <>
                    <i className="fas fa-tachometer-alt"></i> Run Full Network Test
                  </>
                )}
              </button>
            </div>
          )}

          {/* STORAGE & SUBSYSTEM WITH TOTAL, USED & AVAILABLE STORAGE */}
          {activeCategory === 'storage' && (
            <div className="glass-panel flex flex-col p-6 gap-5 animate-[fadeIn_0.2s_ease-out]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    <i className="fas fa-database text-amber-400"></i> Console Storage & Subsystem
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Gen 5 NVMe High-Speed Solid State Drive and persistent IndexedDB storage engine.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[11px] font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  NVMe Connected
                </div>
              </div>

              {/* Status Toast */}
              {snapshotStatus && (
                <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold animate-[fadeIn_0.2s_ease-out]">
                  {snapshotStatus}
                </div>
              )}

              {/* EXPLICIT STORAGE METRIC CARDS: TOTAL, USED & AVAILABLE STORAGE */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Total Storage */}
                <div className="p-4 rounded-2xl bg-black/50 border border-white/15 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-white/60 tracking-wider">
                      Total Storage
                    </span>
                    <i className="fas fa-hdd text-[var(--ps-gold)] text-sm"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-orbitron text-white">
                      {totalStorageGb.toLocaleString()} GB
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1">
                      2.0 TB Gen 5 NVMe SSD
                    </div>
                  </div>
                </div>

                {/* 2. Used Storage */}
                <div className="p-4 rounded-2xl bg-black/50 border border-blue-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                      Used Storage
                    </span>
                    <i className="fas fa-pie-chart text-blue-400 text-sm"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-orbitron text-blue-400">
                      {usedStorageGb.toLocaleString()} GB
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1">
                      {usedPercent.toFixed(1)}% Capacity Occupied
                    </div>
                  </div>
                </div>

                {/* 3. Available Storage */}
                <div className="p-4 rounded-2xl bg-black/50 border border-emerald-500/30 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                      Available Storage
                    </span>
                    <i className="fas fa-check-circle text-emerald-400 text-sm"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-black font-orbitron text-emerald-400">
                      {availableStorageGb.toLocaleString()} GB
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1">
                      {(100 - usedPercent).toFixed(1)}% Free Space Ready
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Capacity Breakdown */}
              <div className="space-y-2 p-4 rounded-2xl bg-black/30 border border-white/10">
                <div className="flex justify-between text-xs font-semibold text-white mb-1">
                  <span>Storage Allocation Breakdown</span>
                  <span className="font-mono text-[var(--ps-gold)]">
                    {usedStorageGb} GB / {totalStorageGb} GB
                  </span>
                </div>

                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${Math.min(70, (gamesSizeSum / totalStorageGb) * 100)}%` }}
                    className="bg-blue-500 h-full"
                    title={`Games: ${gamesSizeSum.toFixed(1)} GB`}
                  ></div>
                  <div
                    style={{ width: `${Math.min(15, (customGamesSize / totalStorageGb) * 100)}%` }}
                    className="bg-amber-500 h-full"
                    title={`Custom WASM: ${customGamesSize} GB`}
                  ></div>
                  <div
                    style={{ width: `${(systemOsAllocatedGb / totalStorageGb) * 100}%` }}
                    className="bg-purple-500 h-full"
                    title={`System OS & Cache: ${systemOsAllocatedGb} GB`}
                  ></div>
                  <div className="bg-emerald-500/30 h-full flex-1" title="Available Free Space"></div>
                </div>

                <div className="flex flex-wrap justify-between text-xs text-[var(--text-muted)] gap-2 pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Games ({gamesSizeSum.toFixed(1)} GB)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Custom WASM ({customGamesSize} GB)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> System OS & Cache (160 GB)
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Available ({availableStorageGb} GB)
                  </span>
                </div>
              </div>

              {/* Real IndexedDB System Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Database</span>
                  <span className="text-xs font-mono font-bold text-amber-400">PS6_NVME_V1</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">DB Quota</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {storageStats?.totalMb ? `${storageStats.totalMb} MB` : '2,048,000 MB'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">DB Used</span>
                  <span className="text-xs font-mono font-bold text-blue-400">
                    {storageStats?.usedMb || 1.8} MB
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-center">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">Indexed Items</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {storageStats?.itemCount || games.length + 12} Objects
                  </span>
                </div>
              </div>

              {/* NVMe Read/Write Benchmark */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <i className="fas fa-bolt text-yellow-400"></i> IndexedDB Virtual NVMe Benchmark
                    </h4>
                    <p className="text-[11px] text-[var(--text-muted)]">Test sequential read/write speed of client IndexedDB.</p>
                  </div>
                  <button
                    onClick={handleRunBenchmark}
                    disabled={benchmarking}
                    className="px-3.5 py-1.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-1.5"
                  >
                    {benchmarking ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Testing NVMe...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-tachometer-alt"></i> Run Benchmark
                      </>
                    )}
                  </button>
                </div>

                {benchResult && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center font-mono">
                    <div className="p-2 rounded-lg bg-white/5">
                      <span className="text-[9px] text-[var(--text-muted)] block">Write Throughput</span>
                      <span className="text-xs font-bold text-emerald-400">{benchResult.writeSpeedMbps} MB/s</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <span className="text-[9px] text-[var(--text-muted)] block">Read Throughput</span>
                      <span className="text-xs font-bold text-blue-400">{benchResult.readSpeedMbps} MB/s</span>
                    </div>
                    <div className="p-2 rounded-lg bg-white/5">
                      <span className="text-[9px] text-[var(--text-muted)] block">Access Latency</span>
                      <span className="text-xs font-bold text-amber-400">{benchResult.latencyMs} ms</span>
                    </div>
                  </div>
                )}
              </div>

              {/* IndexedDB Backup, Snapshot & Restore Actions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  IndexedDB Backup & Restore Controls
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleCreateSnapshot}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center text-sm shrink-0">
                      <i className="fas fa-save"></i>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Save Snapshot to IndexedDB</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Store current console state in DB</div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportJson}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm shrink-0">
                      <i className="fas fa-file-export"></i>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Export Backup (JSON)</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Download whole OS configuration file</div>
                    </div>
                  </button>

                  <button
                    onClick={() => importFileRef.current?.click()}
                    className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm shrink-0">
                      <i className="fas fa-file-import"></i>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Import Backup File</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Restore state from JSON backup</div>
                    </div>
                  </button>
                  <input
                    ref={importFileRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleImportJson}
                  />

                  <button
                    onClick={handleClearCache}
                    className="p-3 rounded-xl bg-white/5 hover:bg-red-600/20 border border-white/10 text-left transition flex items-center gap-3"
                  >
                    <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center text-sm shrink-0">
                      <i className="fas fa-trash-alt"></i>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Clear IndexedDB Cache</div>
                      <div className="text-[10px] text-[var(--text-muted)]">Purge temporary test blobs & snapshots</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom Games Purge */}
              {customGamesCount > 0 && (
                <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-white">Installed Custom WASM Games ({customGamesCount})</h4>
                    <p className="text-xs text-[var(--text-muted)]">Saved URL WebAssembly applications in local cache.</p>
                  </div>
                  <button
                    onClick={() => {
                      audioEngine.playConfirm();
                      onClearCustomGames();
                    }}
                    className="px-4 py-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white font-bold text-xs transition"
                  >
                    Clear Custom Games
                  </button>
                </div>
              )}
            </div>
          )}

          {/* AUDIO & DRONE */}
          {activeCategory === 'audio' && (
            <div className="glass-panel flex flex-col p-6 gap-5 animate-[fadeIn_0.2s_ease-out]">
              <div>
                <h3 className="font-bold text-lg text-white">Audio & Ambient Acoustics</h3>
                <p className="text-xs text-[var(--text-muted)]">Configure 3D audio, system drone, and volume levels.</p>
              </div>

              <div className="flex justify-between items-center py-2 border-b border-[var(--glass-border)]">
                <div>
                  <span className="font-semibold text-sm text-white">Ambient 55Hz System Drone</span>
                  <p className="text-xs text-[var(--text-muted)]">Play the iconic PlayStation low-frequency room presence.</p>
                </div>
                <button
                  onClick={() => {
                    audioEngine.playHover();
                    const nextVal = !settings.ambientDrone;
                    onUpdateSettings({ ambientDrone: nextVal });
                    audioEngine.toggleDrone(nextVal);
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    settings.ambientDrone ? 'bg-[var(--ps-blue)] text-white' : 'bg-white/10 text-white/60'
                  }`}
                >
                  {settings.ambientDrone ? 'Enabled' : 'Muted'}
                </button>
              </div>

              <div className="space-y-3 py-2">
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Master Volume</span>
                  <span>{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.masterVolume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onUpdateSettings({ masterVolume: val });
                    audioEngine.setMasterVolume(val);
                  }}
                  className="w-full accent-[var(--ps-blue)] cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Back Button Bar */}
      {onBackToHome && (
        <div className="max-w-5xl mx-auto px-[4vw] mt-12 flex justify-between items-center pt-6 border-t border-white/10 text-xs text-[var(--text-muted)]">
          <button
            onClick={() => {
              audioEngine.playHover();
              onBackToHome();
            }}
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold transition flex items-center gap-2"
          >
            <i className="far fa-circle text-[var(--ps-gold)]"></i> Back to Dashboard (◯)
          </button>
          <div className="flex items-center gap-4 text-[11px]">
            <span><kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">Esc</kbd> / <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">◯</kbd> Back</span>
            <span><kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">Q</kbd> / <kbd className="px-2 py-0.5 rounded bg-white/10 text-white font-mono">E</kbd> Switch View</span>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl relative border border-white/20 animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => {
                audioEngine.playHover();
                setEditingUser(null);
              }}
              className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-white text-lg p-1"
            >
              <i className="fas fa-times"></i>
            </button>

            <h3 className="text-xl font-bold font-orbitron text-white mb-1 flex items-center gap-2">
              <i className="fas fa-user-edit text-[var(--ps-blue)]"></i> Edit Profile: {editingUser.name}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-5">
              Modify gamer tag, subscription tier, level, or upload custom avatar image.
            </p>

            <form onSubmit={handleSaveUserEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Gamer Tag / Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={24}
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Subscription Tier
                  </label>
                  <select
                    value={editUserTier}
                    onChange={(e) => setEditUserTier(e.target.value as UserProfile['tier'])}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="PS Plus Premium" className="bg-neutral-900">PS Plus Premium</option>
                    <option value="PS Plus Extra" className="bg-neutral-900">PS Plus Extra</option>
                    <option value="PS Plus Essential" className="bg-neutral-900">PS Plus Essential</option>
                    <option value="Free" className="bg-neutral-900">Free Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Player Level
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={editUserLevel}
                    onChange={(e) => setEditUserLevel(parseInt(e.target.value) || 1)}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
                  />
                </div>
              </div>

              {/* Custom Image Upload for Profile Picture */}
              <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Profile Picture (PNG / JPG / WebP)
                </label>
                <input
                  ref={avatarUploadRef}
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-purple-900 border border-white/20 overflow-hidden shrink-0 shadow">
                    <img
                      src={
                        editUserAvatarUrl ||
                        `https://api.dicebear.com/7.x/avataaars/svg?seed=${editUserAvatarSeed}`
                      }
                      alt="Avatar Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <button
                      type="button"
                      onClick={() => avatarUploadRef.current?.click()}
                      className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <i className="fas fa-upload text-[10px]"></i> Upload Custom Image
                    </button>
                    {editUserAvatarUrl && (
                      <button
                        type="button"
                        onClick={() => setEditUserAvatarUrl('')}
                        className="text-[10px] text-red-400 hover:text-red-300 block text-center w-full"
                      >
                        Reset to default avatar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Avatar Preset Seeds */}
              {!editUserAvatarUrl && (
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                    Or Choose Avatar Style
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {avatarPresets.map((seed) => (
                      <button
                        key={seed}
                        type="button"
                        onClick={() => {
                          audioEngine.playHover();
                          setEditUserAvatarSeed(seed);
                        }}
                        className={`p-1 rounded-xl border transition ${
                          editUserAvatarSeed === seed
                            ? 'border-[var(--ps-blue)] bg-blue-500/20'
                            : 'border-white/10 hover:border-white/30'
                        }`}
                      >
                        <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                          alt={seed}
                          className="w-8 h-8 rounded-lg mx-auto"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-3 border-t border-white/10">
                {users.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDeleteUserClick(editingUser.id, editingUser.name)}
                    className="px-3.5 py-2 rounded-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold transition"
                  >
                    Delete Account
                  </button>
                )}
                <div className="flex gap-2 ml-auto">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/30"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateAccountModal && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-md shadow-2xl relative border border-white/20 animate-[fadeIn_0.2s_ease-out]">
            <button
              onClick={() => {
                audioEngine.playHover();
                setShowCreateAccountModal(false);
              }}
              className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-white text-lg p-1"
            >
              <i className="fas fa-times"></i>
            </button>

            <h3 className="text-xl font-bold font-orbitron text-white mb-1 flex items-center gap-2">
              <i className="fas fa-user-plus text-[var(--ps-gold)]"></i> Create Console Profile
            </h3>
            <p className="text-xs text-[var(--text-muted)] mb-5">
              Add a new local player to this PlayStation 6.
            </p>

            <form onSubmit={handleCreateAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                  Player Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={20}
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  placeholder="e.g. ShadowRider"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-semibold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                  Choose Avatar
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {avatarPresets.map((seed) => (
                    <button
                      key={seed}
                      type="button"
                      onClick={() => {
                        audioEngine.playHover();
                        setNewAccSeed(seed);
                      }}
                      className={`p-1.5 rounded-xl border transition ${
                        newAccSeed === seed
                          ? 'border-[var(--ps-blue)] bg-blue-500/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
                        alt={seed}
                        className="w-10 h-10 rounded-lg mx-auto"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowCreateAccountModal(false)}
                  className="px-4 py-2 rounded-full border border-white/20 text-white text-xs font-bold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/30"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
