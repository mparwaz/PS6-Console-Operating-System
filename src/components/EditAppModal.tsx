import React, { useState, useRef } from 'react';
import { GameApp } from '../types';
import { audioEngine } from '../utils/audio';
import { compressImage } from '../utils/imageCompressor';

interface EditAppModalProps {
  app: GameApp | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedApp: GameApp) => void;
  onDelete: (appId: string) => void;
  onMoveLeft?: (appId: string) => void;
  onMoveRight?: (appId: string) => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
}

export const EditAppModal: React.FC<EditAppModalProps> = ({
  app,
  isOpen,
  onClose,
  onSave,
  onDelete,
  onMoveLeft,
  onMoveRight,
  canMoveLeft,
  canMoveRight
}) => {
  const [title, setTitle] = useState(app?.title || '');
  const [publisher, setPublisher] = useState(app?.pub || '');
  const [embedUrl, setEmbedUrl] = useState(app?.embedUrl || '');
  const [iframeCode, setIframeCode] = useState(app?.iframeCode || '');
  const [category, setCategory] = useState<GameApp['category']>(app?.category || 'Game');
  const [coverUrl, setCoverUrl] = useState(app?.cardImg || '');
  const [bgUrl, setBgUrl] = useState(app?.bg || '');
  const [description, setDescription] = useState(app?.description || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const bgFileInputRef = useRef<HTMLInputElement>(null);

  // Sync when app changes
  React.useEffect(() => {
    if (app) {
      setTitle(app.title);
      setPublisher(app.pub);
      setEmbedUrl(app.embedUrl || '');
      setIframeCode(app.iframeCode || '');
      setCategory(app.category || 'Game');
      setCoverUrl(app.cardImg || '');
      setBgUrl(app.bg || '');
      setDescription(app.description || '');
      setShowDeleteConfirm(false);
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'bg') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedDataUrl = await compressImage(file, target === 'cover' ? 400 : 1280, target === 'cover' ? 600 : 720);
      if (target === 'cover') {
        setCoverUrl(compressedDataUrl);
      } else {
        setBgUrl(compressedDataUrl);
      }
      audioEngine.playConfirm();
    } catch {
      // Fallback to FileReader
      const reader = new FileReader();
      reader.onload = (ev) => {
        const val = ev.target?.result as string;
        if (target === 'cover') setCoverUrl(val);
        else setBgUrl(val);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playConfirm();
    audioEngine.playTrophy();

    const updated: GameApp = {
      ...app,
      title: title.trim() || app.title,
      pub: publisher.trim() || app.pub,
      embedUrl: embedUrl.trim() || undefined,
      iframeCode: iframeCode.trim() || undefined,
      category,
      cardImg: coverUrl.trim() || app.cardImg,
      bg: bgUrl.trim() || app.bg,
      description: description.trim() || app.description
    };

    onSave(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel p-6 md:p-8 rounded-3xl w-full max-w-2xl shadow-2xl relative border border-white/20 my-8">
        <button
          onClick={() => {
            audioEngine.playHover();
            onClose();
          }}
          className="absolute top-5 right-5 text-[var(--text-muted)] hover:text-white transition text-xl p-2"
        >
          <i className="fas fa-times"></i>
        </button>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 border border-blue-500/40 text-[var(--ps-blue)] flex items-center justify-center text-lg">
              <i className="fas fa-edit"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold font-orbitron text-white">
                Edit App & Layout: {app.title.replace('<br>', ' ')}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Customize title, artwork, URLs, and shelf order, or delete this app.
              </p>
            </div>
          </div>

          {/* Layout Reordering Buttons */}
          <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-xl">
            <button
              type="button"
              disabled={!canMoveLeft}
              onClick={() => {
                audioEngine.playHover();
                onMoveLeft?.(app.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                canMoveLeft ? 'bg-white/10 hover:bg-white/20 text-white' : 'opacity-30 cursor-not-allowed text-white/50'
              }`}
              title="Move App Left on Shelf"
            >
              <i className="fas fa-chevron-left text-[10px]"></i> Move Left
            </button>
            <button
              type="button"
              disabled={!canMoveRight}
              onClick={() => {
                audioEngine.playHover();
                onMoveRight?.(app.id);
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                canMoveRight ? 'bg-white/10 hover:bg-white/20 text-white' : 'opacity-30 cursor-not-allowed text-white/50'
              }`}
              title="Move App Right on Shelf"
            >
              Move Right <i className="fas fa-chevron-right text-[10px]"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                App Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Publisher / Studio
              </label>
              <input
                type="text"
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as unknown as GameApp['category'])}
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              >
                <option value="Game" className="bg-neutral-900 text-white">Full Game</option>
                <option value="WASM Emulation" className="bg-neutral-900 text-white">WASM Emulation</option>
                <option value="Scratch / Educational" className="bg-neutral-900 text-white">Scratch / Educational</option>
                <option value="Media App" className="bg-neutral-900 text-white">Media App</option>
                <option value="Cloud Stream" className="bg-neutral-900 text-white">Cloud Stream</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
                Game / Embed URL
              </label>
              <input
                type="text"
                value={embedUrl}
                onChange={(e) => setEmbedUrl(e.target.value)}
                placeholder="https://... (WASM/Scratch/Web URL)"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-mono text-[11px]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              &lt;iframe&gt; Embed Code (Optional)
            </label>
            <textarea
              rows={2}
              value={iframeCode}
              onChange={(e) => setIframeCode(e.target.value)}
              placeholder='<iframe src="..." allowfullscreen></iframe>'
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] font-mono text-[11px] resize-none"
            />
          </div>

          {/* Artwork Upload / URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {/* Cover Poster */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Cover Poster Art
              </label>
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'cover')}
              />
              <div className="flex items-center gap-3">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt="Cover"
                    className="w-12 h-16 rounded-lg object-cover border border-white/20 shadow shrink-0"
                  />
                ) : (
                  <div className="w-12 h-16 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center text-white/40 shrink-0">
                    <i className="fas fa-image"></i>
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-upload text-[10px]"></i> Upload Image (PNG/JPG)
                  </button>
                  <input
                    type="url"
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    placeholder="Or paste cover URL"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Backdrop Wallpaper */}
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Backdrop Wallpaper (1080p)
              </label>
              <input
                ref={bgFileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp"
                className="hidden"
                onChange={(e) => handleFileUpload(e, 'bg')}
              />
              <div className="flex items-center gap-3">
                {bgUrl ? (
                  <img
                    src={bgUrl}
                    alt="Backdrop"
                    className="w-16 h-10 rounded-lg object-cover border border-white/20 shadow shrink-0"
                  />
                ) : (
                  <div className="w-16 h-10 rounded-lg bg-neutral-800 border border-white/10 flex items-center justify-center text-white/40 shrink-0">
                    <i className="fas fa-image"></i>
                  </div>
                )}
                <div className="flex-1 space-y-1.5">
                  <button
                    type="button"
                    onClick={() => bgFileInputRef.current?.click()}
                    className="w-full py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                  >
                    <i className="fas fa-upload text-[10px]"></i> Upload Wallpaper (PNG/JPG)
                  </button>
                  <input
                    type="url"
                    value={bgUrl}
                    onChange={(e) => setBgUrl(e.target.value)}
                    placeholder="Or paste wallpaper URL"
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-2.5 py-1 text-[10px] text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)] resize-none"
            />
          </div>

          {/* Action Bar with Delete Button */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <div>
              {showDeleteConfirm ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-400">Confirm Delete?</span>
                  <button
                    type="button"
                    onClick={() => {
                      audioEngine.playConfirm();
                      onDelete(app.id);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition"
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-4 py-2 rounded-full bg-red-600/20 hover:bg-red-600 border border-red-500/40 text-red-300 hover:text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <i className="fas fa-trash"></i> Delete App
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-full border border-white/20 text-white font-bold text-xs hover:bg-white/10 transition flex items-center gap-1.5"
              >
                <i className="far fa-circle text-[var(--ps-gold)]"></i> Back / Cancel (◯)
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition shadow-lg shadow-blue-500/30 flex items-center gap-1.5"
              >
                <i className="fas fa-check"></i> Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
