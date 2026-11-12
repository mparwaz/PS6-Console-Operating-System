import { GameApp, UserProfile, NotificationItem, ChatMessage, Trophy, SystemSettings, Friend, MediaApp } from '../types';
import { INITIAL_DEFAULT_APPS } from '../data/defaultGames';

const STORAGE_KEYS = {
  GAMES: 'ps6_games_v3',
  USERS: 'ps6_users_v3',
  ACTIVE_USER: 'ps6_active_user_v3',
  NOTIFICATIONS: 'ps6_notifications_v3',
  MESSAGES: 'ps6_messages_v3',
  SETTINGS: 'ps6_settings_v3',
  TROPHIES: 'ps6_trophies_v3',
  FRIENDS: 'ps6_friends_v3',
  MEDIA_APPS: 'ps6_media_apps_v3'
};

export const DEFAULT_USERS: UserProfile[] = [
  {
    id: 'chri-tv',
    name: 'CHRI-TV',
    avatarSeed: 'Chri',
    avatarBg: 'bg-purple-900',
    level: 42,
    trophiesCount: 68,
    tier: 'PS Plus Premium',
    status: 'Online',
    lastSeen: '2 hours ago'
  },
  {
    id: 'more-chri',
    name: 'moreCHRI-TV',
    avatarSeed: 'more',
    avatarBg: 'bg-blue-600',
    level: 18,
    trophiesCount: 24,
    tier: 'PS Plus Extra',
    status: 'Away',
    lastSeen: 'Yesterday'
  },
  {
    id: 'guest',
    name: 'Play as Guest',
    avatarSeed: 'Guest',
    avatarBg: 'bg-gray-700',
    level: 1,
    trophiesCount: 0,
    tier: 'Free',
    status: 'Online',
    lastSeen: 'Now'
  }
];

export const DEFAULT_FRIENDS: Friend[] = [
  {
    id: 'f-ghost',
    name: 'GhostRider99',
    avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    status: 'In Game',
    currentGame: "Marvel's Spider-Man 3",
    level: 58,
    tier: 'PS Plus Premium'
  },
  {
    id: 'f-valkyrie',
    name: 'Valkyrie_Nova',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    status: 'In Game',
    currentGame: 'Red Dead Redemption III',
    level: 44,
    tier: 'PS Plus Extra'
  },
  {
    id: 'f-neon',
    name: 'NeonSpectre',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    status: 'In Game',
    currentGame: 'Cyberpunk 2077 Night City WASM',
    level: 71,
    tier: 'PS Plus Premium'
  },
  {
    id: 'f-pixel',
    name: 'PixelKnight',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    status: 'In Game',
    currentGame: 'Geometry Dash Scratch Edition',
    level: 33,
    tier: 'PS Plus Essential'
  },
  {
    id: 'f-shadow',
    name: 'ShadowSniper',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
    status: 'In Game',
    currentGame: 'Call of Duty Arena WASM',
    level: 62,
    tier: 'PS Plus Extra'
  },
  {
    id: 'f-aeroblade',
    name: 'AeroBlade',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200',
    status: 'Online',
    currentGame: 'Grand Theft Auto VI',
    level: 89,
    tier: 'PS Plus Premium'
  }
];

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'System Software 1.0.01 Installed',
    description: 'Ultra-low latency WASM compiler and DualSense 2.0 haptics firmware updated.',
    time: '10m ago',
    read: false,
    type: 'system'
  },
  {
    id: 'notif-2',
    title: 'Geometry Dash Scratch Ready',
    description: 'Scratch educational embed loaded successfully. Tap to launch.',
    time: '20m ago',
    read: false,
    type: 'download'
  },
  {
    id: 'notif-3',
    title: 'Gran Turismo 8 Download Complete',
    description: '4K 120 FPS high dynamic range pack downloaded.',
    time: '1h ago',
    read: true,
    type: 'download'
  }
];

export const DEFAULT_MESSAGES: ChatMessage[] = [
  {
    id: 'm1',
    sender: 'GhostRider99',
    senderAvatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    senderColor: 'bg-yellow-600',
    text: "Let's raid tonight! Got the new WASM and Scratch builds loaded on PS6.",
    time: '16:02'
  },
  {
    id: 'm2',
    sender: 'Valkyrie_Nova',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    senderColor: 'bg-red-600',
    text: 'Ready when you are. The DualSense haptics on this are wild.',
    time: '16:04'
  },
  {
    id: 'm3',
    sender: 'NeonSpectre',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    senderColor: 'bg-blue-600',
    text: 'Inv sent to your party!',
    time: '16:06'
  }
];

export const DEFAULT_TROPHIES: Trophy[] = [
  {
    id: 't-survivor',
    gameTitle: 'The Last of Us Part III',
    title: 'Platinum - Master Survivor',
    description: 'Complete the journey on Grounded difficulty with zero alerts.',
    type: 'platinum',
    earned: true,
    earnedDate: 'Nov 8, 2026',
    icon: 'fa-trophy'
  },
  {
    id: 't-web',
    gameTitle: 'Spider-Man 3 The Final Chapter',
    title: 'Gold - Web of Destiny',
    description: 'Execute a 150-hit venom symbiote combo without taking damage.',
    type: 'gold',
    earned: true,
    earnedDate: 'Nov 5, 2026',
    icon: 'fa-award'
  },
  {
    id: 't-scratch',
    gameTitle: 'Scratch EDU Runtime',
    title: 'Gold - Scratch Engineer',
    description: 'Run and play your first Scratch educational game on PS6.',
    type: 'gold',
    earned: false,
    icon: 'fa-code'
  },
  {
    id: 't-wasm',
    gameTitle: 'WebAssembly Runtime',
    title: 'Gold - Code Architect',
    description: 'Create and launch your first custom WASM game via URL embed.',
    type: 'gold',
    earned: false,
    icon: 'fa-microchip'
  },
  {
    id: 't-pt',
    gameTitle: 'P.T. Silent Hills WASM',
    title: 'Silver - Don’t Look Behind You',
    description: 'Survive the 10th corridor loop in the dark.',
    type: 'silver',
    earned: false,
    icon: 'fa-ghost'
  },
  {
    id: 't-nightcity',
    gameTitle: 'Cyberpunk 2077 Night City WASM',
    title: 'Silver - Neon Overdrive',
    description: 'Drive across Night City at 120 FPS in 8K mode.',
    type: 'silver',
    earned: true,
    earnedDate: 'Yesterday',
    icon: 'fa-bolt'
  },
  {
    id: 't-speed',
    gameTitle: 'Grand Theft Auto VI',
    title: 'Bronze - Vice Vice Baby',
    description: 'Evade a 5-star police pursuit across the Vice City expressway.',
    type: 'bronze',
    earned: true,
    earnedDate: 'Nov 2, 2026',
    icon: 'fa-car'
  }
];

export const DEFAULT_SETTINGS: SystemSettings = {
  theme: 'dark',
  resolution: '8k_60',
  ambientDrone: true,
  masterVolume: 0.8,
  sfxVolume: 0.9,
  vibrationEnabled: true,
  hdrEnabled: true,
  graphicsMode: 'fidelity'
};

export function getStoredGames(): GameApp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GAMES);
    if (!raw) return INITIAL_DEFAULT_APPS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_DEFAULT_APPS;
  } catch {
    return INITIAL_DEFAULT_APPS;
  }
}

export function saveStoredGames(games: GameApp[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.GAMES, JSON.stringify(games));
  } catch (e) {
    console.warn('Storage save games warning:', e);
  }
}

export function getStoredUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!raw) return DEFAULT_USERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: UserProfile[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  } catch (e) {
    console.warn('Storage save users warning:', e);
  }
}

export function getStoredActiveUser(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER);
    if (!raw) return DEFAULT_USERS[0];
    const parsed = JSON.parse(raw);
    return parsed && parsed.id ? parsed : DEFAULT_USERS[0];
  } catch {
    return DEFAULT_USERS[0];
  }
}

export function saveStoredActiveUser(user: UserProfile) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  } catch (e) {
    console.warn('Storage save active user warning:', e);
  }
}

export function getStoredFriends(): Friend[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FRIENDS);
    if (!raw) return DEFAULT_FRIENDS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_FRIENDS;
  } catch {
    return DEFAULT_FRIENDS;
  }
}

export function saveStoredFriends(friends: Friend[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.FRIENDS, JSON.stringify(friends));
  } catch (e) {
    console.warn('Storage save friends warning:', e);
  }
}

export function getStoredSettings(): SystemSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: SystemSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Storage save settings warning:', e);
  }
}

export function getStoredNotifications(): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) return DEFAULT_NOTIFICATIONS;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: NotificationItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
  } catch {
    // Ignore
  }
}

export function getStoredMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!raw) return DEFAULT_MESSAGES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MESSAGES;
  }
}

export function saveStoredMessages(msgs: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(msgs));
  } catch {
    // Ignore
  }
}

export function getStoredTrophies(): Trophy[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TROPHIES);
    if (!raw) return DEFAULT_TROPHIES;
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TROPHIES;
  }
}

export function saveStoredTrophies(trophies: Trophy[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TROPHIES, JSON.stringify(trophies));
  } catch {
    // Ignore
  }
}

export const DEFAULT_MEDIA_APPS: MediaApp[] = [
  {
    id: 'media-youtube',
    name: 'YouTube',
    category: '4K HDR Video',
    iconClass: 'fab fa-youtube',
    iconColor: 'text-red-500',
    embedType: 'youtube',
    streamUrl: 'https://www.youtube.com',
    description: 'Watch gaming broadcasts, game trailers, and 4K 120 FPS captures.',
    isCustom: false
  },
  {
    id: 'media-spotify',
    name: 'Spotify',
    category: 'Background Audio',
    iconClass: 'fab fa-spotify',
    iconColor: 'text-emerald-500',
    embedType: 'spotify',
    streamUrl: 'https://open.spotify.com',
    description: 'Stream game soundtracks and your personal playlists while gaming.',
    isCustom: false
  },
  {
    id: 'media-twitch',
    name: 'Twitch',
    category: 'Live Esports',
    iconClass: 'fab fa-twitch',
    iconColor: 'text-purple-500',
    embedType: 'twitch',
    streamUrl: 'https://www.twitch.tv/playstation',
    description: 'Watch live broadcasts and PlayStation championships with interactive chat.',
    isCustom: false
  },
  {
    id: 'media-netflix',
    name: 'Netflix',
    category: 'Dolby Atmos',
    iconText: 'N',
    iconColor: 'text-red-600',
    embedType: 'youtube',
    streamUrl: 'https://www.netflix.com',
    description: 'Cinema-grade series, movies, and animated originals in 4K HDR.',
    isCustom: false
  },
  {
    id: 'media-prime',
    name: 'Prime Video',
    category: 'Originals',
    iconClass: 'fas fa-play-circle',
    iconColor: 'text-blue-400',
    embedType: 'youtube',
    streamUrl: 'https://www.primevideo.com',
    description: 'Watch blockbuster originals and award-winning series.',
    isCustom: false
  },
  {
    id: 'media-apple',
    name: 'Apple TV+',
    category: 'Spatial Audio',
    iconClass: 'fab fa-apple',
    iconColor: 'text-white',
    embedType: 'youtube',
    streamUrl: 'https://tv.apple.com',
    description: 'Apple Original productions with Spatial Audio immersion.',
    isCustom: false
  },
  {
    id: 'media-crunchyroll',
    name: 'Crunchyroll',
    category: 'Anime Simulcasts',
    iconClass: 'fas fa-dragon',
    iconColor: 'text-orange-500',
    embedType: 'custom_iframe',
    streamUrl: 'https://www.crunchyroll.com',
    description: 'Stream the latest anime releases with Japanese and English dubs.',
    isCustom: false
  },
  {
    id: 'media-soundcloud',
    name: 'SoundCloud',
    category: 'Indie OSTs',
    iconClass: 'fab fa-soundcloud',
    iconColor: 'text-amber-500',
    embedType: 'spotify',
    streamUrl: 'https://soundcloud.com',
    description: 'Community remix tracks, synthwave beats, and indie game tracks.',
    isCustom: false
  }
];

export function getStoredMediaApps(): MediaApp[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MEDIA_APPS);
    if (!raw) return DEFAULT_MEDIA_APPS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MEDIA_APPS;
  } catch {
    return DEFAULT_MEDIA_APPS;
  }
}

export function saveStoredMediaApps(apps: MediaApp[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEDIA_APPS, JSON.stringify(apps));
  } catch (e) {
    console.warn('Storage save media apps warning:', e);
  }
}

