import React, { useState, useRef } from 'react';
import { GameApp } from '../types';
import { WASM_GAME_PRESETS } from '../data/defaultGames';
import { audioEngine } from '../utils/audio';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGame: (game: GameApp, launchImmediately?: boolean) => void;
}

export const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onAddGame }) => {
  const [inputMode, setInputMode] = useState<'url' | 'iframe'>('url');
  const [title, setTitle] = useState('');
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');
  const [iframeCode, setIframeCode] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [bgUrl, setBgUrl] = useState('');
  const [coverMode, setCoverMode] = useState<'upload' | 'url'>('upload');
  const [bgMode, setBgMode] = useState<'upload' | 'url'>('upload');
  const [category, setCategory] = useState<'WASM Emulation' | 'Scratch / Educational' | 'Game' | 'Cloud Stream' | 'Media App'>('Scratch / Educational');
  const [description, setDescription] = useState('');
  const [previewTest, setPreviewTest] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local image file upload (PNG, JPG, WEBP, GIF, SVG)
  const handleImageUpload = (file: File, type: 'cover' | 'bg') => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (type === 'cover') {
        setCoverUrl(dataUrl);
      } else {
        setBgUrl(dataUrl);
      }
      audioEngine.playConfirm();
    };
    reader.readAsDataURL(file);
  };

  // Smart parser for iframe code
  const handleIframeCodeChange = (code: string) => {
    setIframeCode(code);
    const srcMatch = code.match(/src=["'](.*?)["']/i);
    if (srcMatch && srcMatch[1]) {
      const extractedUrl = srcMatch[1];
      setUrl(extractedUrl);

      if (extractedUrl.includes('scratch.mit.edu')) {
        setCategory('Scratch / Educational');
        if (!publisher) setPublisher('MIT SCRATCH EDU');
        if (!title) setTitle('SCRATCH ARCADE GAME');
      }
    }
  };

  const handleUrlChange = (newUrl: string) => {
    if (newUrl.trim().startsWith('<iframe') || newUrl.includes('iframe')) {
      setInputMode('iframe');
      handleIframeCodeChange(newUrl);
      return;
    }

    setUrl(newUrl);
    if (newUrl.includes('scratch.mit.edu')) {
      setCategory('Scratch / Educational');
      if (!publisher) setPublisher('MIT SCRATCH EDU');
      if (!title) setTitle('SCRATCH GAME EMBED');
    }
  };

  const handleSelectPreset = (preset: typeof WASM_GAME_PRESETS[0]) => {
    audioEngine.playHover();
    setTitle(preset.title);
    setPublisher(preset.pub);
    setUrl(preset.embedUrl);
    setIframeCode(preset.iframeCode || `<iframe src="${preset.embedUrl}" allowfullscreen></iframe>`);
    setCoverUrl(preset.cardImg);
    setBgUrl(preset.bg);
    setCategory(preset.category);
    setDescription(preset.description);
    if (preset.iframeCode) {
      setInputMode('iframe');
    }
  };

  const handleSubmit = (e: React.FormEvent, launchNow = false) => {
    e.preventDefault();
    const finalUrl = url.trim();
    if (!title.trim() || (!finalUrl && !iframeCode.trim())) return;

    audioEngine.playConfirm();
    audioEngine.playTrophy();

    const formattedTitle = title.includes('<br>') ? title : title.replace(/\s*-\s*|\s*:\s*/, '<br>');

    const newGame: GameApp = {
      id: `custom-${Date.now()}`,
      type: 'custom_wasm',
      title: formattedTitle,
      pub: publisher.trim() || (category === 'Scratch / Educational' ? 'SCRATCH EDU' : 'CUSTOM DEV'),
      embedUrl: finalUrl || (iframeCode.match(/src=["'](.*?)["']/i)?.[1] ?? ''),
      iframeCode: iframeCode.trim() || undefined,
      embedType: inputMode,
      cardImg: coverUrl.trim() || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400',
      bg: bgUrl.trim() || coverUrl.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920',
      category,
      description: description.trim() || `${category} embedded app running seamlessly on PS6.`,
      isCustom: true,
      sizeGb: Number((Math.random() * 20 + 2).toFixed(1)),
      releaseYear: '2026'
    };

    onAddGame(newGame, launchNow);
    onClose();
  };

  const effectivePreviewSrc = url || (iframeCode.match(/src=["'](.*?)["']/i)?.[1] ?? '');

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-3xl shadow-2xl relative border border-white/15 my-8">
        <button
          onClick={() => {
            audioEngine.playHover();
            onClose();
          }}
          className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-white transition text-xl p-2"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-[var(--ps-gold)]/20 border border-[var(--ps-gold)]/40 text-[var(--ps-gold)] flex items-center justify-center text-xl">
            <i className="fas fa-plus"></i>
          </div>
          <div>
            <h2 className="text-2xl font-bold font-orbitron text-white">
              Install Custom Game / App
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Embed WebAssembly, Scratch EDU games, HTML5 &lt;iframe&gt; code, and upload custom PNG / JPG art.
            </p>
          </div>
        </div>

        {/* Quick Presets */}
        <div className="my-3 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-[11px] font-bold text-[var(--ps-gold)] uppercase tracking-wider mb-2 flex items-center gap-2">
            <i className="fas fa-bolt text-xs"></i> 1-Click Popular Presets
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {WASM_GAME_PRESETS.slice(0, 8).map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className="p-2 rounded-xl bg-white/5 hover:bg-[var(--ps-blue)]/20 hover:border-[var(--ps-blue)] border border-white/10 text-left transition group flex items-center gap-2"
              >
                <img
                  src={preset.cardImg}
                  alt={preset.title}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-bold text-white group-hover:text-[var(--ps-blue)] truncate">
                    {preset.title.replace('<br>', ' ')}
                  </div>
                  <div className="text-[9px] text-[var(--text-muted)] truncate">{preset.category}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Mode Toggle: URL vs <iframe> */}
        <div className="flex gap-2 p-1 bg-white/10 rounded-xl mb-3 w-fit">
          <button
            type="button"
            onClick={() => {
              audioEngine.playHover();
              setInputMode('url');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              inputMode === 'url' ? 'bg-[var(--ps-blue)] text-white shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <i className="fas fa-link"></i> Direct Game URL
          </button>
          <button
            type="button"
            onClick={() => {
              audioEngine.playHover();
              setInputMode('iframe');
            }}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              inputMode === 'iframe' ? 'bg-[var(--ps-blue)] text-white shadow' : 'text-white/70 hover:text-white'
            }`}
          >
            <i className="fas fa-code"></i> &lt;iframe&gt; Embed Code (Scratch, etc.)
          </button>
        </div>

        <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-4">
          {inputMode === 'iframe' ? (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Paste &lt;iframe&gt; Embed Code <span className="text-red-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    handleIframeCodeChange(
                      '<iframe src="https://scratch.mit.edu/projects/105500895/embed" allowtransparency="true" width="485" height="402" frameborder="0" scrolling="no" allowfullscreen></iframe>'
                    )
                  }
                  className="text-[10px] text-blue-400 hover:text-blue-300 font-bold"
                >
                  Insert Sample Scratch &lt;iframe&gt;
                </button>
              </div>
              <textarea
                rows={3}
                required
                value={iframeCode}
                onChange={(e) => handleIframeCodeChange(e.target.value)}
                placeholder='<iframe src="https://scratch.mit.edu/projects/105500895/embed" allowfullscreen></iframe>'
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-mono resize-none"
              />
              {effectivePreviewSrc && (
                <div className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1.5">
                  <i className="fas fa-check-circle"></i> Extracted URL: {effectivePreviewSrc}
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Game or Embed URL <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://scratch.mit.edu/projects/.../embed or WASM URL"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Game / App Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. GEOMETRY DASH SCRATCH"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Developer / Studio
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                placeholder="e.g. MIT SCRATCH, ROCKSTAR, INDIE"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as unknown as typeof category)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              >
                <option value="Scratch / Educational" className="bg-neutral-900 text-white">
                  Scratch / Educational
                </option>
                <option value="WASM Emulation" className="bg-neutral-900 text-white">
                  WASM Emulation
                </option>
                <option value="Game" className="bg-neutral-900 text-white">
                  Full Game
                </option>
                <option value="Cloud Stream" className="bg-neutral-900 text-white">
                  Cloud Stream
                </option>
                <option value="Media App" className="bg-neutral-900 text-white">
                  Media App
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Next-gen game running on PS6"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              />
            </div>
          </div>

          {/* Image Upload / URL Controls for Cover Art and Background */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* 1. Cover Art Poster */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Cover Art Poster
                </label>
                <div className="flex gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setCoverMode('upload')}
                    className={`px-2 py-0.5 rounded font-bold transition ${
                      coverMode === 'upload' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverMode('url')}
                    className={`px-2 py-0.5 rounded font-bold transition ${
                      coverMode === 'url' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {coverMode === 'upload' ? (
                <div>
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f, 'cover');
                    }}
                  />
                  <div
                    onClick={() => coverFileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-[var(--ps-blue)] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition hover:bg-white/5"
                  >
                    {coverUrl ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={coverUrl}
                          alt="Cover Thumbnail"
                          className="w-12 h-16 rounded-lg object-cover border border-white/20 shadow shrink-0"
                        />
                        <div className="flex-1 overflow-hidden">
                          <span className="text-xs font-bold text-emerald-400 block truncate">
                            Cover Image Loaded
                          </span>
                          <span className="text-[10px] text-white/60">Click to replace file</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCoverUrl('');
                          }}
                          className="text-white/40 hover:text-red-400 text-xs p-1"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <i className="fas fa-cloud-upload-alt text-xl text-blue-400 mb-1"></i>
                        <span className="text-xs font-bold text-white">Upload PNG, JPG, or WEBP</span>
                        <span className="text-[10px] text-[var(--text-muted)]">Click or browse file</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://... (Cover image URL)"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
                />
              )}
            </div>

            {/* 2. Backdrop Wallpaper */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Backdrop Wallpaper
                </label>
                <div className="flex gap-1 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setBgMode('upload')}
                    className={`px-2 py-0.5 rounded font-bold transition ${
                      bgMode === 'upload' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Upload File
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgMode('url')}
                    className={`px-2 py-0.5 rounded font-bold transition ${
                      bgMode === 'url' ? 'bg-[var(--ps-blue)] text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {bgMode === 'upload' ? (
                <div>
                  <input
                    ref={bgFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, image/svg+xml"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f, 'bg');
                    }}
                  />
                  <div
                    onClick={() => bgFileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/20 hover:border-[var(--ps-blue)] rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition hover:bg-white/5"
                  >
                    {bgUrl ? (
                      <div className="flex items-center gap-3 w-full">
                        <img
                          src={bgUrl}
                          alt="Backdrop Thumbnail"
                          className="w-16 h-10 rounded-lg object-cover border border-white/20 shadow shrink-0"
                        />
                        <div className="flex-1 overflow-hidden">
                          <span className="text-xs font-bold text-emerald-400 block truncate">
                            Backdrop Loaded
                          </span>
                          <span className="text-[10px] text-white/60">Click to replace file</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBgUrl('');
                          }}
                          className="text-white/40 hover:text-red-400 text-xs p-1"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ) : (
                      <>
                        <i className="fas fa-image text-xl text-[var(--ps-gold)] mb-1"></i>
                        <span className="text-xs font-bold text-white">Upload Wallpaper (PNG / JPG)</span>
                        <span className="text-[10px] text-[var(--text-muted)]">Click or browse file</span>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <input
                  type="url"
                  value={bgUrl}
                  onChange={(e) => setBgUrl(e.target.value)}
                  placeholder="https://... (1920x1080 background image URL)"
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setPreviewTest(!previewTest)}
              className="text-xs text-blue-400 hover:text-blue-300 font-bold flex items-center gap-1.5"
            >
              <i className={`fas ${previewTest ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              {previewTest ? 'Hide Live Sandbox Preview' : 'Test Live Embed Preview'}
            </button>
          </div>

          {/* Test Embed Box */}
          {previewTest && effectivePreviewSrc && (
            <div className="p-3 rounded-2xl bg-black/80 border border-white/20 animate-[fadeIn_0.3s]">
              <div className="text-xs font-bold text-white mb-2 flex items-center justify-between">
                <span>Interactive Embed Sandbox:</span>
                <span className="text-[10px] text-green-400">Allow Scripts & Gamepad</span>
              </div>
              <div className="w-full h-52 bg-black rounded-xl overflow-hidden relative border border-white/10">
                <iframe
                  src={effectivePreviewSrc}
                  title="Game Preview"
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock"
                  allow="cross-origin-isolated; autoplay; fullscreen; gamepad; accelerometer; gyroscope"
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-full border border-white/20 text-white font-bold text-xs hover:bg-white/10 transition flex items-center gap-1.5"
            >
              <i className="far fa-circle text-[var(--ps-gold)]"></i> Back / Cancel (◯)
            </button>
            <button
              type="submit"
              className="flex-1 py-3 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <i className="fas fa-save"></i> Save & Install to Shelf
            </button>
            <button
              type="button"
              onClick={(e) => handleSubmit(e, true)}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-[var(--ps-gold)] to-[var(--ps-gold-light)] hover:opacity-90 text-black font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <i className="fas fa-play"></i> Install & Launch Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
