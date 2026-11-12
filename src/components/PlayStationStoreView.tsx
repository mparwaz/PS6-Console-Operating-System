import React, { useState } from 'react';
import { GameApp } from '../types';
import { WASM_GAME_PRESETS } from '../data/defaultGames';
import { audioEngine } from '../utils/audio';

interface PlayStationStoreViewProps {
  installedGames: GameApp[];
  onInstallGame: (game: GameApp) => void;
  onLaunchGame: (game: GameApp) => void;
  onBackToHome: () => void;
}

interface StoreItem {
  id: string;
  title: string;
  pub: string;
  category: 'Game' | 'WASM Emulation' | 'Scratch / Educational' | 'Cloud Stream' | 'Media App';
  bg: string;
  cardImg: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  psPlusFree?: boolean;
  rating: number;
  sizeGb: number;
  description: string;
  embedUrl?: string;
  iframeCode?: string;
  isWasm?: boolean;
  badge?: string;
}

export const PlayStationStoreView: React.FC<PlayStationStoreViewProps> = ({
  installedGames,
  onInstallGame,
  onLaunchGame,
  onBackToHome
}) => {
  const [activeCategory, setActiveCategory] = useState<
    'all' | 'deals' | 'ps6_exclusives' | 'ps_plus' | 'wasm_arcade' | 'scratch_edu'
  >('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [installingIds, setInstallingIds] = useState<string[]>([]);
  const [walletBalance] = useState('$150.00');

  // Hero Featured Carousel Item
  const heroFeatured: StoreItem = {
    id: 'store-gta6',
    title: 'GRAND THEFT AUTO VI',
    pub: 'ROCKSTAR GAMES',
    category: 'Game',
    bg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920',
    cardImg: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600',
    price: '$69.99',
    rating: 5.0,
    sizeGb: 145.0,
    badge: 'PS6 PRO ENHANCED • 8K 60FPS',
    description:
      'Leonida beckons. Enter the most expansive, visually breathtaking open world ever created, running natively on PS6 architecture with ray tracing overdrive and DualSense 2.0 haptics.'
  };

  // Curated Store Catalog
  const storeCatalog: StoreItem[] = [
    {
      id: 'store-ds2',
      title: 'DEATH STRANDING 2: ON THE BEACH',
      pub: 'KOJIMA PRODUCTIONS',
      category: 'Game',
      bg: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=400',
      price: '$69.99',
      originalPrice: '$79.99',
      discount: '-12%',
      rating: 4.9,
      sizeGb: 110.5,
      badge: 'PS6 EXCLUSIVE',
      description: 'Sam Porter Bridges embarks on a journey beyond the UCA to save humanity from extinction.'
    },
    {
      id: 'store-wolverine',
      title: "MARVEL'S WOLVERINE",
      pub: 'INSOMNIAC GAMES',
      category: 'Game',
      bg: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=400',
      price: '$69.99',
      rating: 4.8,
      sizeGb: 95.0,
      badge: 'PS6 EXCLUSIVE',
      description: 'A visceral, mature action-adventure delving deep into the fierce lore of Logan.'
    },
    {
      id: 'scratch-geo',
      title: 'GEOMETRY DASH: SCRATCH EDITION',
      pub: 'GRIFFPATCH • SCRATCH EDU',
      category: 'Scratch / Educational',
      bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
      price: 'Free',
      psPlusFree: true,
      rating: 4.9,
      sizeGb: 2.4,
      isWasm: true,
      badge: 'SCRATCH EDU HIT',
      embedUrl: 'https://scratch.mit.edu/projects/105500895/embed',
      iframeCode: '<iframe src="https://scratch.mit.edu/projects/105500895/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>',
      description: 'The iconic rhythm-based platformer recreated entirely in Scratch visual blocks.'
    },
    {
      id: 'scratch-minecraft',
      title: 'PAPER MINECRAFT 2D',
      pub: 'GRIFFPATCH • SCRATCH EDU',
      category: 'Scratch / Educational',
      bg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=400',
      price: 'Free',
      psPlusFree: true,
      rating: 4.8,
      sizeGb: 3.1,
      isWasm: true,
      badge: 'SCRATCH EDU HIT',
      embedUrl: 'https://scratch.mit.edu/projects/10128407/embed',
      iframeCode: '<iframe src="https://scratch.mit.edu/projects/10128407/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>',
      description: '2D sandbox survival, crafting, and building game compiled with Scratch educational runtime.'
    },
    {
      id: 'pt-wasm',
      title: 'P.T. SILENT HILLS WASM DEMAKE',
      pub: '7780S STUDIO',
      category: 'WASM Emulation',
      bg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=400',
      price: 'Free',
      psPlusFree: true,
      rating: 5.0,
      sizeGb: 12.5,
      isWasm: true,
      badge: 'WASM EMULATION',
      embedUrl: 'https://pt-hallway-demo.glitch.me/',
      description: 'The infamous never-ending hallway psychological horror demo compiled to WebGL / WASM.'
    },
    {
      id: 'gta5-wasm',
      title: 'GRAND THEFT AUTO V: LOS SANTOS WASM',
      pub: 'ROCKSTAR GAMES',
      category: 'WASM Emulation',
      bg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=400',
      price: '$19.99',
      originalPrice: '$39.99',
      discount: '-50%',
      rating: 4.9,
      sizeGb: 88.0,
      isWasm: true,
      badge: 'WASM HIGH-FPS',
      embedUrl: 'https://dos.zone/player/?bundleUrl=https%3A%2F%2Fcdn.dos.zone%2Fcustom%2Fdos%2Fgta.jsdos',
      description: 'Explore Los Santos running via high-speed WebAssembly binary virtualization.'
    },
    {
      id: 'cyberpunk-wasm',
      title: 'CYBERPUNK 2077 NIGHT CITY 3D',
      pub: 'CD PROJEKT RED',
      category: 'WASM Emulation',
      bg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400',
      price: '$29.99',
      originalPrice: '$59.99',
      discount: '-50%',
      rating: 4.8,
      sizeGb: 64.2,
      isWasm: true,
      badge: 'WASM RAY TRACING',
      embedUrl: 'https://threejs.org/examples/webgl_materials_cubemap_dynamic.html',
      description: 'Dynamic reflections and neon-soaked streets in high-performance WebAssembly.'
    },
    {
      id: 'cod-wasm',
      title: 'CALL OF DUTY: ARENA FPS WASM',
      pub: 'ACTIVISION',
      category: 'WASM Emulation',
      bg: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1542751110-97427bbecf20?q=80&w=400',
      price: 'Free',
      psPlusFree: true,
      rating: 4.7,
      sizeGb: 45.1,
      isWasm: true,
      badge: '120 FPS MULTIPLAYER',
      embedUrl: 'https://playcanv.as/p/2OuwCzgy/',
      description: 'Competitive tactical first-person combat running at a lock-solid 120 frames per second.'
    },
    {
      id: 'store-horizon3',
      title: 'HORIZON III: NEMESIS RISING',
      pub: 'GUERRILLA GAMES',
      category: 'Game',
      bg: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=400',
      price: '$69.99',
      rating: 4.9,
      sizeGb: 122.0,
      badge: 'PS6 EXCLUSIVE',
      description: 'Aloy faces the ultimate extraterrestrial threat with cutting-edge machine ecosystems.'
    },
    {
      id: 'doom-wasm',
      title: 'DOOM: CLASSIC 3D WASM',
      pub: 'ID SOFTWARE',
      category: 'WASM Emulation',
      bg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920',
      cardImg: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
      price: 'Free',
      psPlusFree: true,
      rating: 4.9,
      sizeGb: 1.8,
      isWasm: true,
      badge: 'RETRO WASM',
      embedUrl: 'https://silentspacemarine.com/',
      description: 'The foundational fast-paced 3D shooter compiled directly to browser WebAssembly.'
    }
  ];

  // Check if an item is already installed on shelf
  const isInstalled = (item: StoreItem): boolean => {
    return installedGames.some(
      (g) =>
        g.id === item.id ||
        g.title.toLowerCase().replace(/<[^>]*>?/gm, '') === item.title.toLowerCase()
    );
  };

  // Find installed game object
  const getInstalledGameObject = (item: StoreItem): GameApp | undefined => {
    return installedGames.find(
      (g) =>
        g.id === item.id ||
        g.title.toLowerCase().replace(/<[^>]*>?/gm, '') === item.title.toLowerCase()
    );
  };

  // Filter items
  const filteredCatalog = storeCatalog.filter((item) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchPub = item.pub.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchPub && !matchCat) return false;
    }

    // Category tab filter
    if (activeCategory === 'deals') {
      return !!item.discount;
    }
    if (activeCategory === 'ps6_exclusives') {
      return item.badge?.includes('EXCLUSIVE') || item.category === 'Game';
    }
    if (activeCategory === 'ps_plus') {
      return item.psPlusFree || item.price === 'Free';
    }
    if (activeCategory === 'wasm_arcade') {
      return item.isWasm || item.category === 'WASM Emulation';
    }
    if (activeCategory === 'scratch_edu') {
      return item.category === 'Scratch / Educational';
    }

    return true;
  });

  const handleInstallClick = (item: StoreItem) => {
    audioEngine.playConfirm();
    setInstallingIds((prev) => [...prev, item.id]);

    setTimeout(() => {
      const newGame: GameApp = {
        id: item.id,
        type: item.isWasm ? 'custom_wasm' : 'game',
        title: item.title,
        pub: item.pub,
        bg: item.bg,
        cardImg: item.cardImg,
        category: item.category,
        description: item.description,
        embedUrl: item.embedUrl,
        iframeCode: item.iframeCode,
        embedType: item.iframeCode ? 'iframe' : 'url',
        sizeGb: item.sizeGb,
        isCustom: item.isWasm
      };

      onInstallGame(newGame);
      setInstallingIds((prev) => prev.filter((id) => id !== item.id));
      audioEngine.playTrophy();
    }, 1200);
  };

  return (
    <div
      id="view-playstation-store"
      className="view-section active overflow-y-auto pt-28 pb-16 select-none bg-gradient-to-b from-[#001428] via-[#050b14] to-black"
    >
      <div className="max-w-6xl mx-auto px-[4vw]">
        {/* Top Store Header Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
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
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-[var(--ps-blue)] flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                <i className="fas fa-shopping-bag text-base"></i>
              </div>
              <h1 className="text-2xl md:text-3xl font-black font-orbitron text-white tracking-wide">
                PlayStation<span className="text-[var(--ps-blue)]">®</span> Store
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 md:w-64">
              <i className="fas fa-search absolute left-3.5 top-3 text-white/40 text-xs"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search PS Store, WASM, Scratch..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white/10 border border-white/20 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-white/50 hover:text-white text-xs"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Wallet Pill */}
            <div className="px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white font-mono flex items-center gap-1.5 shrink-0">
              <i className="fas fa-wallet text-[var(--ps-gold)]"></i>
              <span>{walletBalance}</span>
            </div>
          </div>
        </div>

        {/* Categories Tab Bar - Smooth horizontal touch scrolling on mobile */}
        <div className="flex flex-nowrap overflow-x-auto ps-scrollable-x items-center gap-2 mb-6 sm:mb-8 border-b border-white/10 pb-3 sm:pb-4">
          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveCategory('all');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition ${
              activeCategory === 'all'
                ? 'bg-[var(--ps-blue)] text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            All Products
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveCategory('deals');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === 'deals'
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className="fas fa-fire text-amber-300"></i> Deals & Offers
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveCategory('ps6_exclusives');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === 'ps6_exclusives'
                ? 'bg-[var(--ps-blue)] text-white shadow-lg shadow-blue-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className="fab fa-playstation text-xs"></i> PS6 Exclusives
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveCategory('ps_plus');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === 'ps_plus'
                ? 'bg-[var(--ps-gold)] text-black shadow-lg shadow-amber-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className="fas fa-plus text-xs"></i> PS Plus Games
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveCategory('wasm_arcade');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === 'wasm_arcade'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className="fas fa-microchip text-xs"></i> WASM Arcade
          </button>

          <button
            onClick={() => {
              audioEngine.playHover();
              setActiveCategory('scratch_edu');
            }}
            className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold shrink-0 whitespace-nowrap transition flex items-center gap-1.5 ${
              activeCategory === 'scratch_edu'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            <i className="fas fa-cube text-xs"></i> Scratch EDU
          </button>
        </div>

        {/* Featured Hero Billboard (shown when in 'all' or 'deals') */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="relative rounded-3xl overflow-hidden mb-10 border border-white/20 shadow-2xl group">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${heroFeatured.bg})` }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>

            <div className="relative z-10 p-8 md:p-12 max-w-2xl flex flex-col justify-between min-h-[360px]">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[var(--ps-gold)] text-black mb-3 shadow">
                  {heroFeatured.badge}
                </span>
                <h2 className="text-3xl md:text-5xl font-black font-orbitron text-white leading-tight">
                  {heroFeatured.title}
                </h2>
                <p className="text-xs md:text-sm text-white/80 mt-3 leading-relaxed line-clamp-3">
                  {heroFeatured.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10">
                <div className="text-2xl font-bold font-mono text-white">
                  {heroFeatured.price}
                </div>
                <div className="text-xs text-amber-400 font-bold flex items-center gap-1">
                  <i className="fas fa-star"></i> {heroFeatured.rating} ★★★★★
                </div>
                <div className="text-xs text-white/60">
                  Size: {heroFeatured.sizeGb} GB
                </div>

                {isInstalled(heroFeatured) ? (
                  <button
                    onClick={() => {
                      const existing = getInstalledGameObject(heroFeatured);
                      if (existing) onLaunchGame(existing);
                    }}
                    className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-emerald-600/30 ml-auto"
                  >
                    <i className="fas fa-check"></i> Installed • Play Now
                  </button>
                ) : (
                  <button
                    onClick={() => handleInstallClick(heroFeatured)}
                    disabled={installingIds.includes(heroFeatured.id)}
                    className="px-6 py-2.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center gap-2 shadow-lg shadow-blue-500/30 ml-auto"
                  >
                    {installingIds.includes(heroFeatured.id) ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i> Installing to Shelf...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-download"></i> Install to Console Shelf
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Store Catalog Grid */}
        <div className="mb-6 flex justify-between items-center">
          <h3 className="text-lg font-bold font-orbitron text-white flex items-center gap-2">
            <span>Store Titles</span>
            <span className="text-xs font-normal text-[var(--text-muted)]">
              ({filteredCatalog.length} available)
            </span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredCatalog.map((item) => {
            const installed = isInstalled(item);
            const isInstalling = installingIds.includes(item.id);
            const existingGame = getInstalledGameObject(item);

            return (
              <div
                key={item.id}
                className="glass-panel p-3.5 rounded-2xl flex flex-col justify-between hover:scale-[1.02] hover:border-[var(--ps-blue)] transition duration-300 group relative"
              >
                {/* Badge */}
                {item.discount && (
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-red-600 text-white font-bold text-[9px] shadow">
                    {item.discount}
                  </span>
                )}
                {item.psPlusFree && !item.discount && (
                  <span className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full bg-[var(--ps-gold)] text-black font-bold text-[9px] shadow">
                    PS PLUS FREE
                  </span>
                )}

                {/* Card Image */}
                <div className="aspect-[3/4] w-full rounded-xl overflow-hidden relative mb-3 bg-neutral-900">
                  <img
                    src={item.cardImg}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2.5">
                    <p className="text-[10px] text-white/90 line-clamp-3 leading-snug">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[var(--ps-gold)] block truncate">
                      {item.pub}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-0.5 line-clamp-2 leading-tight">
                      {item.title}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-white/10">
                    <div className="flex justify-between items-center mb-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold font-mono text-white">
                          {item.price}
                        </span>
                        {item.originalPrice && (
                          <span className="text-[10px] line-through text-white/40">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-white/60">
                        {item.sizeGb} GB
                      </span>
                    </div>

                    {installed ? (
                      <button
                        onClick={() => {
                          audioEngine.playConfirm();
                          if (existingGame) onLaunchGame(existingGame);
                        }}
                        className="w-full py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 hover:text-white font-bold text-[10px] transition flex items-center justify-center gap-1.5"
                      >
                        <i className="fas fa-check"></i> Installed • Launch
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInstallClick(item)}
                        disabled={isInstalling}
                        className="w-full py-1.5 rounded-xl bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-[10px] transition flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/20"
                      >
                        {isInstalling ? (
                          <>
                            <i className="fas fa-spinner fa-spin"></i> Installing...
                          </>
                        ) : (
                          <>
                            <i className="fas fa-download"></i> Install to Shelf
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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
