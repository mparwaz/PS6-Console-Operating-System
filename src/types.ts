export interface GameApp {
  id: string;
  type: 'system' | 'explore' | 'game' | 'custom_wasm';
  title: string;
  pub: string;
  bg: string;
  cardImg?: string;
  cardStyle?: string;
  innerHTML?: string;
  embedUrl?: string;
  iframeCode?: string;
  embedType?: 'url' | 'iframe';
  isCustom?: boolean;
  category?: 'Game' | 'WASM Emulation' | 'Scratch / Educational' | 'Cloud Stream' | 'Media App';
  description?: string;
  sizeGb?: number;
  playCount?: number;
  releaseYear?: string;
  order?: number;
}

export interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  status: 'Online' | 'In Game' | 'Away' | 'Offline';
  currentGame?: string;
  level: number;
  tier?: string;
  lastSeen?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarSeed: string;
  avatarBg: string;
  customAvatarUrl?: string;
  level: number;
  trophiesCount: number;
  tier: 'PS Plus Premium' | 'PS Plus Extra' | 'PS Plus Essential' | 'Free';
  status: 'Online' | 'In Game' | 'Away' | 'Do Not Disturb';
  lastSeen?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'system' | 'download' | 'trophy' | 'friend';
}

export interface ChatMessage {
  id: string;
  sender: string;
  senderAvatar: string;
  senderColor: string;
  text: string;
  time: string;
  isMe?: boolean;
}

export interface Trophy {
  id: string;
  gameTitle: string;
  title: string;
  description: string;
  type: 'platinum' | 'gold' | 'silver' | 'bronze';
  earned: boolean;
  earnedDate?: string;
  icon: string;
}

export interface SystemSettings {
  theme: 'dark' | 'light';
  resolution: '8k_60' | '4k_120' | '1440p_240';
  ambientDrone: boolean;
  masterVolume: number;
  sfxVolume: number;
  vibrationEnabled: boolean;
  hdrEnabled: boolean;
  graphicsMode: 'performance' | 'fidelity';
}

export interface MediaApp {
  id: string;
  name: string;
  category: string;
  iconClass?: string;
  iconText?: string;
  iconColor?: string;
  coverImg?: string;
  streamUrl?: string;
  iframeCode?: string;
  embedType?: 'youtube' | 'spotify' | 'twitch' | 'custom_iframe' | 'external';
  description?: string;
  isCustom?: boolean;
}

