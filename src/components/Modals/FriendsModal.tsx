import React, { useState } from 'react';
import { Friend, GameApp } from '../../types';
import { audioEngine } from '../../utils/audio';

interface FriendsModalProps {
  friends: Friend[];
  games: GameApp[];
  onJoinGame: (gameTitle: string) => void;
  onOpenChatWithFriend: (friendName: string) => void;
  onAddFriend: (newFriend: Friend) => void;
  onClose: () => void;
}

export const FriendsModal: React.FC<FriendsModalProps> = ({
  friends,
  games,
  onJoinGame,
  onOpenChatWithFriend,
  onAddFriend,
  onClose
}) => {
  const [tab, setTab] = useState<'all' | 'in_game' | 'add'>('all');
  const [newGamerTag, setNewGamerTag] = useState('');
  const [newGame, setNewGame] = useState('Marvel\'s Spider-Man 3');
  const [newAvatarUrl, setNewAvatarUrl] = useState('https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200');

  const avatarOptions = [
    'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=200',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=200',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200'
  ];

  const filteredFriends = friends.filter((f) => {
    if (tab === 'in_game') return f.status === 'In Game';
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGamerTag.trim()) return;
    audioEngine.playConfirm();
    audioEngine.playTrophy();

    const created: Friend = {
      id: `f-${Date.now()}`,
      name: newGamerTag.trim(),
      avatarUrl: newAvatarUrl,
      status: 'In Game',
      currentGame: newGame,
      level: Math.floor(Math.random() * 50) + 15,
      tier: 'PS Plus Premium'
    };

    onAddFriend(created);
    setNewGamerTag('');
    setTab('all');
  };

  return (
    <div className="space-y-4">
      {/* Header Tabs */}
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <div className="flex gap-2">
          <button
            onClick={() => {
              audioEngine.playHover();
              setTab('all');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition ${
              tab === 'all' ? 'bg-[var(--ps-blue)] text-white shadow' : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            All Friends ({friends.length})
          </button>
          <button
            onClick={() => {
              audioEngine.playHover();
              setTab('in_game');
            }}
            className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
              tab === 'in_game' ? 'bg-[var(--ps-blue)] text-white shadow' : 'bg-white/5 hover:bg-white/10 text-white/70'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Playing Now ({friends.filter((f) => f.status === 'In Game').length})
          </button>
        </div>

        <button
          onClick={() => {
            audioEngine.playHover();
            setTab('add');
          }}
          className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${
            tab === 'add' ? 'bg-[var(--ps-gold)] text-black' : 'bg-white/5 hover:bg-white/10 text-[var(--ps-gold)]'
          }`}
        >
          <i className="fas fa-user-plus text-[10px]"></i> Add Friend
        </button>
      </div>

      {/* Add Friend Form */}
      {tab === 'add' ? (
        <form onSubmit={handleAddSubmit} className="space-y-3 p-2 bg-white/5 rounded-2xl border border-white/10">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <i className="fas fa-user-plus text-[var(--ps-gold)]"></i> Send Friend Request
          </h4>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
              PlayStation Network GamerTag
            </label>
            <input
              type="text"
              required
              value={newGamerTag}
              onChange={(e) => setNewGamerTag(e.target.value)}
              placeholder="e.g. ApexTitan_X"
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1">
              Currently Playing
            </label>
            <input
              type="text"
              value={newGame}
              onChange={(e) => setNewGame(e.target.value)}
              placeholder="e.g. Marvel's Spider-Man 3"
              className="w-full bg-black/40 border border-white/20 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[var(--text-muted)] mb-1.5">
              Choose Profile Picture
            </label>
            <div className="flex gap-2">
              {avatarOptions.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`Avatar ${i}`}
                  onClick={() => {
                    audioEngine.playHover();
                    setNewAvatarUrl(url);
                  }}
                  className={`w-9 h-9 rounded-full object-cover cursor-pointer border-2 transition ${
                    newAvatarUrl === url ? 'border-[var(--ps-blue)] scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setTab('all')}
              className="flex-1 py-2 rounded-full border border-white/20 text-xs font-bold text-white hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 rounded-full bg-[var(--ps-blue)] text-white text-xs font-bold hover:bg-blue-600 transition"
            >
              Add to Network
            </button>
          </div>
        </form>
      ) : (
        /* Friends List with Custom Profile Pictures */
        <div className="max-h-[340px] overflow-y-auto space-y-2.5 pr-1 ps-scrollable">
          {filteredFriends.map((f) => (
            <div
              key={f.id}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-between gap-3 group"
            >
              <div className="flex items-center gap-3">
                {/* Real Profile Picture */}
                <div className="relative">
                  <img
                    src={f.avatarUrl}
                    alt={f.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-[var(--ps-blue)] shadow-md"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${
                      f.status === 'In Game' ? 'bg-emerald-400' : 'bg-blue-400'
                    }`}
                  ></span>
                </div>

                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {f.name}
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 text-white/80 font-normal">
                      Lv. {f.level}
                    </span>
                  </div>
                  {f.currentGame && (
                    <div className="text-[11px] text-blue-400 font-semibold flex items-center gap-1.5 mt-0.5">
                      <i className="fas fa-gamepad text-[10px]"></i>
                      <span className="truncate max-w-[170px]">{f.currentGame}</span>
                    </div>
                  )}
                  <span className="text-[9px] text-[var(--text-muted)] block mt-0.5">
                    {f.tier || 'PS Plus Premium'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {f.currentGame && (
                  <button
                    onClick={() => {
                      audioEngine.playConfirm();
                      onJoinGame(f.currentGame || '');
                    }}
                    className="px-3 py-1 rounded-full bg-[var(--ps-blue)] hover:bg-blue-500 text-white text-[11px] font-bold transition shadow"
                    title="Launch / Play this game"
                  >
                    Join
                  </button>
                )}
                <button
                  onClick={() => {
                    audioEngine.playConfirm();
                    onOpenChatWithFriend(f.name);
                  }}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition"
                  title="Send Message"
                >
                  <i className="fas fa-comment"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="pt-2">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full border border-white/20 hover:bg-white/10 text-white font-bold text-xs transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
