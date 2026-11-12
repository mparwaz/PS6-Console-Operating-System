import React, { useState } from 'react';
import { audioEngine } from '../utils/audio';

interface ExploreAppViewProps {
  onBackToHome: () => void;
  onOpenStore?: () => void;
}

interface NewsItem {
  id: string;
  category: string;
  date: string;
  title: string;
  summary: string;
  image: string;
  readTime: string;
  videoId?: string;
}

export const ExploreAppView: React.FC<ExploreAppViewProps> = ({
  onBackToHome,
  onOpenStore
}) => {
  const [activeTab, setActiveTab] = useState<
    'feed' | 'hardware' | 'trailers' | 'releases' | 'vision'
  >('feed');
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const newsFeed: NewsItem[] = [
    {
      id: 'news-1',
      category: 'PlayStation Architecture',
      date: 'November 2026',
      title: 'PlayStation 6 System Deep Dive: Liquid Metal Cooling & 64-bit WebAssembly Sandbox',
      summary:
        'Sony Interactive Entertainment engineering reveals the custom 3.2 GHz APU architecture paired with an instant-on WebAssembly virtualization engine allowing sub-millisecond game loading.',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800',
      readTime: '4 min read',
      videoId: 'r_WfvU8Zp3w'
    },
    {
      id: 'news-2',
      category: 'State of Play',
      date: 'November 2026',
      title: 'Grand Theft Auto VI: Revolutionary 8K HDR Ray-Traced Audio & DualSense 2.0 Haptics',
      summary:
        'Rockstar Games showcases live Vice City gameplay utilizing piezoelectric actuators inside the PS6 controller for realistic road surface simulation and rain impact textures.',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800',
      readTime: '6 min read',
      videoId: 'QdBZY2fkU-0'
    },
    {
      id: 'news-3',
      category: 'Community & WebAssembly',
      date: 'November 2026',
      title: 'Scratch & Browser Gaming on PS6: Why WebAssembly is the Future of Indie Preservation',
      summary:
        'From legendary MIT Scratch titles to standalone WebGPU native ports, PS6 enables community developers to run their creations on 120 FPS high refresh-rate living room displays.',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800',
      readTime: '5 min read'
    },
    {
      id: 'news-4',
      category: 'Next-Gen VR',
      date: 'November 2026',
      title: 'Apple Vision Pro & PSVR 3 Spatial Immersion: Wireless 8K Micro-OLED Streaming',
      summary:
        'Seamlessly beam your PlayStation 6 titles to Apple Vision Pro with zero perceptible latency using Wi-Fi 7 ultra-wideband direct socket streaming.',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800',
      readTime: '3 min read'
    }
  ];

  const upcomingReleases = [
    {
      title: 'Grand Theft Auto VI',
      studio: 'Rockstar Games',
      date: 'Fall 2026',
      daysLeft: 42,
      cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=400'
    },
    {
      title: 'Death Stranding 2: On The Beach',
      studio: 'Kojima Productions',
      date: 'Holiday 2026',
      daysLeft: 68,
      cover: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400'
    },
    {
      title: "Marvel's Wolverine",
      studio: 'Insomniac Games',
      date: 'Early 2027',
      daysLeft: 120,
      cover: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400'
    },
    {
      title: 'The Witcher 4: Polaris',
      studio: 'CD PROJEKT RED',
      date: 'Mid 2027',
      daysLeft: 195,
      cover: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400'
    }
  ];

  return (
    <div
      id="view-explore-app"
      className="view-section active overflow-y-auto pt-28 pb-16 select-none bg-gradient-to-b from-[#0a1118] via-[#05070a] to-black"
    >
      <div className="max-w-6xl mx-auto px-[4vw]">
        {/* Top Explore Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-black border border-white/20 flex items-center justify-center text-[var(--ps-gold)] shadow">
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <i className="fas fa-times"></i>
                  <i className="far fa-circle"></i>
                  <i className="far fa-square"></i>
                  <i className="fas fa-caret-up"></i>
                </div>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black font-orbitron text-white">
                  Explore
                </h1>
                <p className="text-[11px] text-[var(--text-muted)]">
                  PlayStation Official News, Hardware Engineering & Community Highlights
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onOpenStore && (
              <button
                onClick={() => {
                  audioEngine.playConfirm();
                  onOpenStore();
                }}
                className="px-4 py-2 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <i className="fas fa-shopping-bag"></i> Open PlayStation Store
              </button>
            )}
          </div>
        </div>

        {/* Tab Navigation - Smooth horizontal touch scrolling on mobile */}
        <div className="flex flex-nowrap overflow-x-auto ps-scrollable-x items-center gap-2 mb-6 sm:mb-8 border-b border-white/10 pb-3 sm:pb-4">
          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveTab('feed');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'feed'
                ? 'bg-white/20 text-white border border-white/30 shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fas fa-newspaper text-blue-400"></i> Official Feed
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveTab('hardware');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'hardware'
                ? 'bg-white/20 text-white border border-white/30 shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fas fa-microchip text-amber-400"></i> PS6 Hardware Specs
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveTab('trailers');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'trailers'
                ? 'bg-white/20 text-white border border-white/30 shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fas fa-play text-red-500"></i> 4K Showcase
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveTab('releases');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'releases'
                ? 'bg-white/20 text-white border border-white/30 shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fas fa-calendar-alt text-emerald-400"></i> Release Radar
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveTab('vision');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 sm:gap-2 ${
              activeTab === 'vision'
                ? 'bg-white/20 text-white border border-white/30 shadow'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <i className="fas fa-vr-cardboard text-purple-400"></i> Vision Pro Spatial
          </button>
        </div>

        {/* Tab 1: Official Feed */}
        {activeTab === 'feed' && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            {/* Featured Hero Article */}
            <div className="relative rounded-3xl overflow-hidden border border-white/20 shadow-2xl group cursor-pointer">
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920)'
                }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent"></div>

              <div className="relative z-10 p-8 md:p-12 min-h-[380px] flex flex-col justify-end">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[var(--ps-gold)] text-black w-fit mb-3">
                  FEATURED STORY • HARDWARE BRIEFING
                </span>
                <h2 className="text-2xl md:text-4xl font-black font-orbitron text-white leading-tight">
                  PlayStation 6 Architecture: Next-Gen Compute & Instant-On WebAssembly
                </h2>
                <p className="text-xs md:text-sm text-white/80 mt-2.5 max-w-2xl leading-relaxed">
                  Engineered with a liquid metal thermal interface, custom 14.5 GB/s Gen 5 NVMe controller, and an isolated browser runtime enabling zero-install AAA game execution.
                </p>
                <div className="flex items-center gap-4 mt-4 text-xs text-white/60">
                  <span>Mark Cerny & SIE R&D</span>
                  <span>•</span>
                  <span>5 min read</span>
                  <span>•</span>
                  <span className="text-[var(--ps-gold)] font-bold">120 FPS Native</span>
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newsFeed.map((news) => (
                <div
                  key={news.id}
                  className="glass-panel p-5 rounded-2xl flex flex-col justify-between hover:scale-[1.02] hover:border-[var(--ps-blue)] transition duration-300 group cursor-pointer"
                  onClick={() => {
                    if (news.videoId) {
                      audioEngine.playConfirm();
                      setActiveVideoId(news.videoId);
                      setActiveTab('trailers');
                    }
                  }}
                >
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden relative mb-4 bg-neutral-900">
                      <img
                        src={news.image}
                        alt={news.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {news.videoId && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform">
                          <i className="fas fa-play-circle text-red-500"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-[var(--ps-gold)] font-bold uppercase tracking-wider mb-1.5">
                      <span>{news.category}</span>
                      <span className="text-white/40">{news.readTime}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors leading-snug">
                      {news.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-3 leading-relaxed">
                      {news.summary}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-[11px] text-white/60">
                    <span>{news.date}</span>
                    <span className="text-[var(--ps-blue)] font-bold group-hover:underline">
                      {news.videoId ? 'Watch Trailer ↗' : 'Read Deep Dive ↗'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Hardware Architecture Deep Dive */}
        {activeTab === 'hardware' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="glass-panel p-8 rounded-3xl border border-white/15">
              <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
                PlayStation 6 Technical Specifications
              </h2>
              <p className="text-xs text-[var(--text-muted)] mb-8 max-w-3xl leading-relaxed">
                A generation built from the silicon up for zero load times, real-time machine learning reconstruction, and native WebAssembly binary sandbox capabilities.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-microchip"></i>
                  </div>
                  <h3 className="text-sm font-bold text-white">Custom AMD Zen 6 APU</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    16-core, 32-thread CPU operating at up to 4.2 GHz with dedicated hardware neural accelerators for real-time AI upscaling.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold pt-2">
                    42.8 TFLOPS RDNA 4 Compute
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <h3 className="text-sm font-bold text-white">Gen 5 NVMe SSD</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    2.0 TB customized PCIe 5.0 solid state drive achieving raw read speeds up to 14.5 GB/s with hardware decompression engine.
                  </p>
                  <div className="text-[10px] font-mono text-amber-400 font-bold pt-2">
                    14.5 GB/s Direct-Storage Bandwidth
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-gamepad"></i>
                  </div>
                  <h3 className="text-sm font-bold text-white">DualSense 2.0 Haptics</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Piezoelectric actuators delivering high-bandwidth acoustic vibrations and dynamic magnetic adaptive resistance triggers.
                  </p>
                  <div className="text-[10px] font-mono text-purple-400 font-bold pt-2">
                    Sub-millisecond tactile response
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-globe"></i>
                  </div>
                  <h3 className="text-sm font-bold text-white">WebAssembly Virtualization</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Direct browser-to-silicon execution runtime supporting SIMD, multithreading, and WebGPU 2.0 without local installation overhead.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 font-bold pt-2">
                    Cross-Origin Isolated Sandboxing
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-eye"></i>
                  </div>
                  <h3 className="text-sm font-bold text-white">8K HDR 120Hz Output</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    HDMI 2.2 port supporting uncompressed 8K 60Hz and 4K 240Hz with variable refresh rate and auto low-latency mode.
                  </p>
                  <div className="text-[10px] font-mono text-cyan-400 font-bold pt-2">
                    PlayStation Spectral Super Resolution (PSSR 2)
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center text-lg mb-3">
                    <i className="fas fa-temperature-low"></i>
                  </div>
                  <h3 className="text-sm font-bold text-white">Liquid Metal Cooling</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Custom alloy thermal compound ensuring whisper-quiet acoustic signature below 22 dBA under peak ray-tracing loads.
                  </p>
                  <div className="text-[10px] font-mono text-red-400 font-bold pt-2">
                    &lt; 22 dBA Whisper Acoustics
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Trailers & 4K Video Showcase */}
        {activeTab === 'trailers' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="glass-panel p-6 rounded-3xl border border-red-500/30">
              <h3 className="text-lg font-bold font-orbitron text-white mb-2 flex items-center gap-2">
                <i className="fab fa-youtube text-red-500 text-xl"></i> Official 4K PlayStation Video Showcase
              </h3>
              <p className="text-xs text-[var(--text-muted)] mb-4">
                Watch official PlayStation showcases, game reveals, and architectural teardowns in high-definition 4K.
              </p>

              {/* Active Trailer Player */}
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl relative mb-6">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeVideoId || 'r_WfvU8Zp3w'}?autoplay=1&enablejsapi=1`}
                  title="PlayStation Showcase"
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Trailer Selector Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    id: 'r_WfvU8Zp3w',
                    title: 'PS5 Pro & PS6 Technical Presentation',
                    thumb: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400',
                    length: '9:05'
                  },
                  {
                    id: 'QdBZY2fkU-0',
                    title: 'Grand Theft Auto VI Trailer 1 (Official 4K)',
                    thumb: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400',
                    length: '1:31'
                  },
                  {
                    id: 'qC5KtatMcUw',
                    title: 'Unreal Engine 5.5 State of Unreal',
                    thumb: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400',
                    length: '14:20'
                  },
                  {
                    id: 'bgqGdIoa52s',
                    title: "Marvel's Spider-Man Next-Gen Reveal",
                    thumb: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=400',
                    length: '12:15'
                  }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      audioEngine.playConfirm();
                      setActiveVideoId(item.id);
                    }}
                    className={`p-2.5 rounded-xl bg-black/40 border cursor-pointer transition hover:scale-105 ${
                      activeVideoId === item.id
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden relative mb-2">
                      <img src={item.thumb} alt={item.title} className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[8px] font-mono text-white">
                        {item.length}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white line-clamp-1">{item.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Release Radar Countdown */}
        {activeTab === 'releases' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="glass-panel p-8 rounded-3xl border border-white/15">
              <h2 className="text-2xl font-bold font-orbitron text-white mb-2">
                PlayStation 6 Release Radar (2026 - 2027)
              </h2>
              <p className="text-xs text-[var(--text-muted)] mb-8">
                Official countdown calendar for the next wave of PlayStation 6 titles and expansions.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {upcomingReleases.map((game, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col justify-between hover:border-[var(--ps-gold)] transition group"
                  >
                    <div>
                      <div className="aspect-[3/4] rounded-xl overflow-hidden mb-4 relative bg-neutral-900">
                        <img
                          src={game.cover}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-[var(--ps-gold)] border border-white/10">
                          {game.daysLeft} DAYS
                        </div>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--ps-gold)] block">
                        {game.studio}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                        {game.title}
                      </h3>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                      <span className="text-white/60">{game.date}</span>
                      <span className="text-[var(--ps-blue)] font-bold text-[10px]">
                        Wishlist ✓
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Apple Vision Pro Spatial PS6 */}
        {activeTab === 'vision' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="glass-panel p-8 md:p-12 rounded-3xl border border-purple-500/30 text-center">
              <div className="w-20 h-20 rounded-3xl bg-purple-600/20 border border-purple-500/40 text-purple-400 mx-auto flex items-center justify-center text-4xl mb-6 shadow-2xl">
                <i className="fas fa-vr-cardboard"></i>
              </div>

              <h2 className="text-3xl font-black font-orbitron text-white mb-3">
                Spatial Gaming on Apple Vision Pro
              </h2>
              <p className="text-sm text-white/80 max-w-2xl mx-auto leading-relaxed mb-8">
                Immerse yourself in your entire PlayStation 6 library on a floating 120-inch 8K HDR micro-OLED virtual display with ultra-low latency direct stream and 3D spatial audio.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-4xl mx-auto mb-8">
                <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-[var(--ps-blue)] font-bold text-xs uppercase tracking-wider mb-1">
                    Direct Stream
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">Wi-Fi 7 Direct Socket</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Sub-8ms latency beaming directly from the PS6 APU to VisionOS microdisplays.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-[var(--ps-gold)] font-bold text-xs uppercase tracking-wider mb-1">
                    Spatial Audio
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">3D Tempest Soundstage</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Dynamic head-tracking acoustics that match the physical geometry of your living room.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-black/40 border border-white/10">
                  <div className="text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
                    DualSense 2.0
                  </div>
                  <h4 className="text-sm font-bold text-white mb-2">Native Bluetooth 6.0</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Direct controller pairing with full tactile haptic waveforms preserved.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  audioEngine.playConfirm();
                  audioEngine.playTrophy();
                }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white font-bold text-xs transition shadow-xl shadow-purple-600/30"
              >
                Launch Spatial PS6 Stream Protocol
              </button>
            </div>
          </div>
        )}

        {/* Bottom Back Button & Controller Guide */}
        <div className="mt-12 flex justify-between items-center pt-6 border-t border-white/10 text-xs text-[var(--text-muted)]">
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
      </div>
    </div>
  );
};
