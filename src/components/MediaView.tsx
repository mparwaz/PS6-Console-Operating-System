import React, { useState, useRef } from 'react';
import { MediaApp } from '../types';
import { audioEngine } from '../utils/audio';
import { getStoredMediaApps, saveStoredMediaApps } from '../utils/storage';
import { compressImage } from '../utils/imageCompressor';

interface MediaViewProps {
  onBackToHome?: () => void;
}

export const MediaView: React.FC<MediaViewProps> = ({ onBackToHome }) => {
  const [mediaApps, setMediaApps] = useState<MediaApp[]>(getStoredMediaApps);
  const [activeMedia, setActiveMedia] = useState<'youtube' | 'spotify' | 'twitch' | 'custom' | null>('youtube');
  const [activeCustomMedia, setActiveCustomMedia] = useState<MediaApp | null>(null);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeTrack, setActiveTrack] = useState('Cyberpunk 2077 - Rebel Path (Synthwave Mix)');

  // YouTube State
  const [youtubeInput, setYoutubeInput] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState('QdBZY2fkU-0'); // GTA VI Trailer
  const [currentVideoTitle, setCurrentVideoTitle] = useState('Grand Theft Auto VI Trailer 1 (Official 4K)');

  // Modal State for Add / Edit Media App
  const [editingMedia, setEditingMedia] = useState<MediaApp | null>(null);
  const [isAddMediaOpen, setIsAddMediaOpen] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('4K HDR Video');
  const [formIconClass, setFormIconClass] = useState('fas fa-play-circle');
  const [formIconColor, setFormIconColor] = useState('text-blue-400');
  const [formCoverImg, setFormCoverImg] = useState('');
  const [formStreamUrl, setFormStreamUrl] = useState('');
  const [formIframeCode, setFormIframeCode] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const curatedVideos = [
    {
      id: 'QdBZY2fkU-0',
      title: 'Grand Theft Auto VI Trailer 1 (Official 4K)',
      channel: 'Rockstar Games',
      duration: '1:31',
      thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400'
    },
    {
      id: 'r_WfvU8Zp3w',
      title: 'PlayStation 5 Pro & PS6 Architecture Technical Presentation',
      channel: 'PlayStation',
      duration: '9:05',
      thumb: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400'
    },
    {
      id: 'qC5KtatMcUw',
      title: 'Unreal Engine 5.5 State of Unreal Mega-Showcase',
      channel: 'Unreal Engine',
      duration: '14:20',
      thumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400'
    },
    {
      id: 'jfKfPfyJRdk',
      title: 'Lofi Girl - Relaxing Beats to Game / Chill to 24/7',
      channel: 'Lofi Girl',
      duration: 'LIVE',
      thumb: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400'
    },
    {
      id: 'LembwKDo1Dk',
      title: 'Cyberpunk 2077: Phantom Liberty 4K Ray Tracing Overdrive',
      channel: 'CD PROJEKT RED',
      duration: '3:45',
      thumb: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400'
    },
    {
      id: 'bgqGdIoa52s',
      title: "Marvel's Spider-Man 2 - Next-Gen Gameplay Reveal",
      channel: 'PlayStation',
      duration: '12:15',
      thumb: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=400'
    }
  ];

  // Helper to extract YouTube video ID from various URL formats
  const extractVideoId = (input: string): string => {
    const trimmed = input.trim();
    if (!trimmed) return 'QdBZY2fkU-0';
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
    const shortMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (shortMatch) return shortMatch[1];
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (watchMatch) return watchMatch[1];
    const embedMatch = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (embedMatch) return embedMatch[1];
    const liveMatch = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{11})/);
    if (liveMatch) return liveMatch[1];
    return trimmed;
  };

  const handleLoadCustomYoutube = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeInput.trim()) return;
    const vId = extractVideoId(youtubeInput);
    setCurrentVideoId(vId);
    setCurrentVideoTitle(`Custom Video (${vId})`);
    setActiveMedia('youtube');
    audioEngine.playConfirm();
    audioEngine.playTrophy();
  };

  const tracks = [
    'Cyberpunk 2077 - Rebel Path (Synthwave Mix)',
    'The Last of Us Part III - Acoustic Horizon',
    'Grand Theft Auto VI - Vice City Nights Radio',
    'PlayStation 6 - Ambient Chill Lounge'
  ];

  const handleLaunchMediaApp = (app: MediaApp) => {
    audioEngine.playConfirm();
    if (app.embedType === 'youtube' || app.name.toLowerCase().includes('youtube')) {
      setActiveMedia('youtube');
    } else if (app.embedType === 'spotify' || app.name.toLowerCase().includes('spotify')) {
      setActiveMedia('spotify');
    } else if (app.embedType === 'twitch' || app.name.toLowerCase().includes('twitch')) {
      setActiveMedia('twitch');
    } else {
      setActiveCustomMedia(app);
      setActiveMedia('custom');
    }
  };

  const handleOpenEditModal = (app: MediaApp) => {
    setEditingMedia(app);
    setFormName(app.name);
    setFormCategory(app.category);
    setFormIconClass(app.iconClass || 'fas fa-play-circle');
    setFormIconColor(app.iconColor || 'text-blue-400');
    setFormCoverImg(app.coverImg || '');
    setFormStreamUrl(app.streamUrl || '');
    setFormIframeCode(app.iframeCode || '');
    setFormDescription(app.description || '');
  };

  const handleOpenAddModal = () => {
    setEditingMedia(null);
    setFormName('');
    setFormCategory('Streaming');
    setFormIconClass('fas fa-film');
    setFormIconColor('text-blue-400');
    setFormCoverImg('');
    setFormStreamUrl('');
    setFormIframeCode('');
    setFormDescription('');
    setIsAddMediaOpen(true);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playConfirm();

    if (editingMedia) {
      // Edit existing
      const updated = mediaApps.map((a) =>
        a.id === editingMedia.id
          ? {
              ...a,
              name: formName.trim() || a.name,
              category: formCategory.trim() || a.category,
              iconClass: formIconClass,
              iconColor: formIconColor,
              coverImg: formCoverImg || undefined,
              streamUrl: formStreamUrl || undefined,
              iframeCode: formIframeCode || undefined,
              description: formDescription || undefined
            }
          : a
      );
      setMediaApps(updated);
      saveStoredMediaApps(updated);
      setEditingMedia(null);
    } else {
      // Add new
      const newApp: MediaApp = {
        id: `media-${Date.now()}`,
        name: formName.trim() || 'New Media App',
        category: formCategory.trim() || 'Entertainment',
        iconClass: formIconClass || 'fas fa-tv',
        iconColor: formIconColor || 'text-blue-400',
        coverImg: formCoverImg || undefined,
        streamUrl: formStreamUrl || undefined,
        iframeCode: formIframeCode || undefined,
        description: formDescription || 'Custom media stream app.',
        embedType: formIframeCode ? 'custom_iframe' : 'external',
        isCustom: true
      };
      const updated = [...mediaApps, newApp];
      setMediaApps(updated);
      saveStoredMediaApps(updated);
      setIsAddMediaOpen(false);
      audioEngine.playTrophy();
    }
  };

  const handleDeleteMedia = (id: string) => {
    audioEngine.playConfirm();
    const updated = mediaApps.filter((a) => a.id !== id);
    setMediaApps(updated);
    saveStoredMediaApps(updated);
    if (activeCustomMedia?.id === id) {
      setActiveMedia('youtube');
      setActiveCustomMedia(null);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImage(file, 256, 256, 0.85);
      setFormCoverImg(compressed);
      audioEngine.playConfirm();
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => setFormCoverImg(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleToggleAudio = () => {
    audioEngine.playConfirm();
    setIsPlayingAudio(!isPlayingAudio);
  };

  return (
    <div id="view-media" className="view-section active overflow-y-auto pt-28 pb-16 select-none">
      <div className="max-w-6xl mx-auto px-[4vw]">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
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
              <h2 className="text-3xl font-bold font-orbitron text-white">Media & Streaming</h2>
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Stream movies, music, and creator broadcasts while running games in the background.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isPlayingAudio && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Now Playing
              </div>
            )}

            <button
              onClick={() => {
                audioEngine.playConfirm();
                handleOpenAddModal();
              }}
              className="px-4 py-2 rounded-full bg-gradient-to-r from-[var(--ps-gold)] to-[var(--ps-gold-light)] text-black font-bold text-xs hover:opacity-90 transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <i className="fas fa-plus"></i> Add Media App
            </button>
          </div>
        </div>

        {/* Media Apps Grid - 3 cols on mobile, 4 on tablet, 6 on desktop */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-6 mb-8 md:mb-10">
          {mediaApps.map((app) => (
            <div
              key={app.id}
              className="glass-panel p-3.5 sm:p-6 flex flex-col items-center justify-center cursor-pointer hover:scale-105 hover:border-[var(--ps-blue)] transition relative group"
              onClick={() => handleLaunchMediaApp(app)}
            >
              {/* Edit / Delete Buttons - Visible on mobile touch, hover on desktop */}
              <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition z-20">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    audioEngine.playConfirm();
                    handleOpenEditModal(app);
                  }}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-black/80 hover:bg-[var(--ps-blue)] text-white flex items-center justify-center text-[8px] sm:text-[10px] border border-white/20 transition"
                  title="Edit Media App"
                >
                  <i className="fas fa-pen"></i>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteMedia(app.id);
                  }}
                  className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-red-600/80 hover:bg-red-600 text-white flex items-center justify-center text-[8px] sm:text-[10px] border border-white/20 transition"
                  title="Delete Media App"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              {/* App Icon or Custom Cover Image */}
              {app.coverImg ? (
                <img
                  src={app.coverImg}
                  alt={app.name}
                  className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl object-cover mb-2 sm:mb-4 border border-white/20 shadow-md group-hover:-translate-y-1 transition-transform"
                />
              ) : app.iconText ? (
                <div
                  className={`text-3xl sm:text-5xl font-black mb-2 sm:mb-4 font-serif ${app.iconColor || 'text-red-600'} transition-transform group-hover:-translate-y-1`}
                >
                  {app.iconText}
                </div>
              ) : (
                <i
                  className={`${app.iconClass || 'fas fa-play-circle'} text-3xl sm:text-6xl mb-2 sm:mb-4 transition-transform group-hover:-translate-y-1 ${
                    app.iconColor || 'text-blue-400'
                  }`}
                ></i>
              )}

              <span className="font-bold tracking-wide text-xs sm:text-sm text-white text-center truncate max-w-[90px] sm:max-w-[120px]">
                {app.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-[var(--text-muted)] mt-0.5 truncate max-w-[90px] sm:max-w-[120px]">
                {app.category}
              </span>
            </div>
          ))}
        </div>

        {/* 1. YouTube 4K Theater Player */}
        {activeMedia === 'youtube' && (
          <div className="glass-panel p-6 rounded-3xl animate-[fadeIn_0.3s_ease-out] border border-red-500/30">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                  <i className="fab fa-youtube text-red-500 text-xl"></i> YouTube 4K Theater & Live Streams
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Now Playing: <span className="text-white font-semibold">{currentVideoTitle}</span>
                </p>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <a
                  href={`https://www.youtube.com/watch?v=${currentVideoId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition flex items-center gap-1.5"
                >
                  <i className="fas fa-external-link-alt text-[10px]"></i> Open in YouTube
                </a>
                <button
                  onClick={() => setActiveMedia(null)}
                  className="px-3 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-semibold transition"
                >
                  Close Player
                </button>
              </div>
            </div>

            {/* Custom URL Input Bar */}
            <form onSubmit={handleLoadCustomYoutube} className="mb-4 flex gap-2">
              <div className="relative flex-1">
                <i className="fab fa-youtube absolute left-3.5 top-3 text-red-500 text-sm"></i>
                <input
                  type="text"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="Paste any YouTube video link or ID (e.g., https://youtu.be/... or watch?v=...)"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-red-500 font-mono"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-lg shadow-red-600/30 shrink-0"
              >
                <i className="fas fa-play text-[10px]"></i> Play Video
              </button>
            </form>

            {/* Active Video Player */}
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
              <iframe
                key={currentVideoId}
                src={`https://www.youtube-nocookie.com/embed/${currentVideoId}?autoplay=1&enablejsapi=1&rel=0`}
                title={currentVideoTitle}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Curated Video Carousel / Pills */}
            <div className="mt-5">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">
                Featured 4K & 8K PlayStation Gaming Videos
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {curatedVideos.map((vid) => {
                  const isCurrent = vid.id === currentVideoId;
                  return (
                    <div
                      key={vid.id}
                      onClick={() => {
                        audioEngine.playConfirm();
                        setCurrentVideoId(vid.id);
                        setCurrentVideoTitle(vid.title);
                      }}
                      className={`p-2 rounded-xl bg-black/40 border cursor-pointer transition hover:scale-105 group ${
                        isCurrent
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <div className="aspect-video rounded-lg overflow-hidden relative mb-2 bg-neutral-900">
                        <img
                          src={vid.thumb}
                          alt={vid.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-white">
                          {vid.duration}
                        </span>
                        {isCurrent && (
                          <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center text-white text-xs">
                            <i className="fas fa-play"></i>
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-white line-clamp-2 leading-tight">
                        {vid.title}
                      </p>
                      <span className="text-[9px] text-[var(--text-muted)] block mt-0.5 truncate">
                        {vid.channel}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 2. Custom Media Embed Player */}
        {activeMedia === 'custom' && activeCustomMedia && (
          <div className="glass-panel p-6 rounded-3xl animate-[fadeIn_0.3s_ease-out] border border-blue-500/30">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                  <i className="fas fa-film text-[var(--ps-blue)]"></i> {activeCustomMedia.name}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">{activeCustomMedia.description}</p>
              </div>
              <div className="flex items-center gap-2">
                {(activeCustomMedia.streamUrl || activeCustomMedia.iframeCode) && (
                  <a
                    href={
                      activeCustomMedia.streamUrl ||
                      activeCustomMedia.iframeCode?.match(/src=["'](.*?)["']/i)?.[1] ||
                      '#'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center gap-1.5 transition"
                  >
                    <i className="fas fa-external-link-alt text-[10px]"></i> Open in Tab
                  </a>
                )}
                <button
                  onClick={() => setActiveMedia(null)}
                  className="text-xs px-3 py-1.5 rounded-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white transition"
                >
                  Close Stream
                </button>
              </div>
            </div>

            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl relative">
              {activeCustomMedia.streamUrl ? (
                <iframe
                  src={activeCustomMedia.streamUrl}
                  title={activeCustomMedia.name}
                  className="w-full h-full border-0 absolute inset-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; cross-origin-isolated; fullscreen; gamepad; microphone"
                  allowFullScreen
                />
              ) : activeCustomMedia.iframeCode ? (
                <div
                  className="w-full h-full absolute inset-0 [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0"
                  dangerouslySetInnerHTML={{ __html: activeCustomMedia.iframeCode }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-white/50 p-6 text-center">
                  <i className="fas fa-exclamation-circle text-4xl mb-2 text-amber-400"></i>
                  <p className="text-sm font-bold text-white">No Stream URL Configured</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">
                    Click the edit icon on this app card to add a stream URL or iframe embed code.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Spotify Background Player */}
        {activeMedia === 'spotify' && (
          <div className="glass-panel p-6 rounded-3xl animate-[fadeIn_0.3s_ease-out] border border-emerald-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <i className="fab fa-spotify text-emerald-500"></i> PlayStation Background Audio Hub
              </h3>
              <button
                onClick={() => setActiveMedia(null)}
                className="text-xs text-[var(--text-muted)] hover:text-white"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-black/40 p-6 rounded-2xl border border-white/10">
              <div className="aspect-square w-32 h-32 mx-auto rounded-2xl overflow-hidden shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400"
                  alt="Track Cover"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="md:col-span-2 space-y-4">
                <div>
                  <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
                    Official PS6 Soundtrack
                  </div>
                  <h4 className="text-xl font-bold text-white mt-1">{activeTrack}</h4>
                  <p className="text-xs text-[var(--text-muted)]">3D Tempest Audio • 96kHz Lossless</p>
                </div>

                <div className="space-y-2">
                  <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-emerald-500 rounded-full ${
                        isPlayingAudio ? 'w-2/3 animate-pulse' : 'w-1/4'
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>{isPlayingAudio ? '02:45' : '00:00'}</span>
                    <span>04:12</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      audioEngine.playHover();
                      const prevIdx = (tracks.indexOf(activeTrack) - 1 + tracks.length) % tracks.length;
                      setActiveTrack(tracks[prevIdx]);
                    }}
                    className="text-white hover:text-emerald-400 text-lg transition"
                  >
                    <i className="fas fa-step-backward"></i>
                  </button>
                  <button
                    onClick={handleToggleAudio}
                    className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black flex items-center justify-center text-lg font-bold transition shadow-lg shadow-emerald-500/30"
                  >
                    <i className={`fas ${isPlayingAudio ? 'fa-pause' : 'fa-play ml-0.5'}`}></i>
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playHover();
                      const nextIdx = (tracks.indexOf(activeTrack) + 1) % tracks.length;
                      setActiveTrack(tracks[nextIdx]);
                    }}
                    className="text-white hover:text-emerald-400 text-lg transition"
                  >
                    <i className="fas fa-step-forward"></i>
                  </button>
                  <span className="text-xs text-white/70 font-semibold ml-2">
                    {isPlayingAudio ? 'Playing in background during gameplay' : 'Paused'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Twitch Live Stream Player */}
        {activeMedia === 'twitch' && (
          <div className="glass-panel p-6 rounded-3xl animate-[fadeIn_0.3s_ease-out] border border-purple-500/30">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <i className="fab fa-twitch text-purple-400"></i> Live PlayStation Esports & Broadcasts
              </h3>
              <button
                onClick={() => setActiveMedia(null)}
                className="text-xs text-[var(--text-muted)] hover:text-white"
              >
                Close Player
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
              <iframe
                src="https://player.twitch.tv/?channel=playstation&parent=localhost&muted=true"
                title="PlayStation Live Stream"
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        )}

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

        {/* Add / Edit Media App Modal */}
        {(isAddMediaOpen || editingMedia) && (
          <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-lg shadow-2xl relative border border-white/20 animate-[fadeIn_0.2s_ease-out]">
              <button
                onClick={() => {
                  audioEngine.playHover();
                  setIsAddMediaOpen(false);
                  setEditingMedia(null);
                }}
                className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-white transition text-lg p-2"
              >
                <i className="fas fa-times"></i>
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-[var(--ps-gold)]/20 border border-[var(--ps-gold)]/40 text-[var(--ps-gold)] flex items-center justify-center text-lg">
                  <i className={`fas ${editingMedia ? 'fa-pen' : 'fa-plus'}`}></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold font-orbitron text-white">
                    {editingMedia ? `Edit Media App: ${editingMedia.name}` : 'Add New Media App'}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)]">
                    Configure stream URLs, custom embed codes, or image artwork.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveMedia} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    App Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Disney+, Crunchyroll, Plex, Custom TV"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Category Tag
                    </label>
                    <input
                      type="text"
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      placeholder="e.g. 4K Cinema, Live Anime, Music"
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                      Icon Preset
                    </label>
                    <select
                      value={formIconClass}
                      onChange={(e) => setFormIconClass(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="fas fa-play-circle" className="bg-neutral-900">Play Circle (General)</option>
                      <option value="fas fa-film" className="bg-neutral-900">Film / Movies</option>
                      <option value="fas fa-tv" className="bg-neutral-900">TV / Live Stream</option>
                      <option value="fab fa-youtube" className="bg-neutral-900">YouTube</option>
                      <option value="fab fa-spotify" className="bg-neutral-900">Spotify / Audio</option>
                      <option value="fab fa-twitch" className="bg-neutral-900">Twitch / Gaming</option>
                      <option value="fas fa-dragon" className="bg-neutral-900">Anime / Manga</option>
                      <option value="fas fa-music" className="bg-neutral-900">Music Beats</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Stream / Embed URL
                  </label>
                  <input
                    type="text"
                    value={formStreamUrl}
                    onChange={(e) => setFormStreamUrl(e.target.value)}
                    placeholder="https://... (Website, Web Player, or Stream Link)"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Raw &lt;iframe&gt; Embed Code (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={formIframeCode}
                    onChange={(e) => setFormIframeCode(e.target.value)}
                    placeholder='<iframe src="..." allowfullscreen></iframe>'
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-mono text-[11px] resize-none"
                  />
                </div>

                {/* Upload Custom Cover (PNG/JPG) */}
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                    Custom App Icon / Cover (PNG/JPG)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp"
                    className="hidden"
                    onChange={handleCoverUpload}
                  />
                  <div className="flex items-center gap-3">
                    {formCoverImg ? (
                      <img
                        src={formCoverImg}
                        alt="Preview"
                        className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-white/10 flex items-center justify-center text-white/40 shrink-0">
                        <i className="fas fa-image"></i>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                    >
                      <i className="fas fa-upload text-[10px]"></i> Upload Image (PNG/JPG)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Short description of this media channel or app"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
                  />
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-white/10">
                  {editingMedia ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeleteMedia(editingMedia.id);
                        setEditingMedia(null);
                      }}
                      className="px-4 py-2 rounded-full bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white font-bold text-xs transition"
                    >
                      Delete App
                    </button>
                  ) : <div></div>}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddMediaOpen(false);
                        setEditingMedia(null);
                      }}
                      className="px-4 py-2 rounded-full border border-white/20 text-white font-bold text-xs hover:bg-white/10"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs shadow-lg shadow-blue-500/30"
                    >
                      {editingMedia ? 'Save Changes' : 'Add App'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
