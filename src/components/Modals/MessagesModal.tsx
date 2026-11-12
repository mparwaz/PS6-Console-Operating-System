import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { audioEngine } from '../../utils/audio';

interface MessagesModalProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  onClose: () => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  messages,
  onSendMessage,
  onClose
}) => {
  const [inputText, setInputText] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    audioEngine.playConfirm();
    onSendMessage(inputText.trim());
    setInputText('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          <span className="font-bold text-sm">Chri-TV Raid Team</span>
          <span className="text-[10px] text-[var(--text-muted)] bg-white/10 px-2 py-0.5 rounded-full">
            4 Online
          </span>
        </div>
        <div className="flex -space-x-2">
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=A"
            alt="A"
            className="w-6 h-6 rounded-full border border-black bg-yellow-600"
          />
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=B"
            alt="B"
            className="w-6 h-6 rounded-full border border-black bg-red-600"
          />
          <img
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=C"
            alt="C"
            className="w-6 h-6 rounded-full border border-black bg-blue-600"
          />
        </div>
      </div>

      <div className="h-[250px] overflow-y-auto space-y-3 pr-1 hide-scroll flex flex-col justify-end">
        {messages.map((m) => {
          const isMine = m.isMe;
          return (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${isMine ? 'flex-row-reverse' : ''}`}
            >
              {!isMine && (
                <div
                  className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center overflow-hidden border border-white/20 ${
                    m.senderColor || 'bg-blue-600'
                  }`}
                >
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${m.senderAvatar}`}
                    alt={m.sender}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  isMine
                    ? 'bg-[var(--ps-blue)] text-white rounded-br-none'
                    : 'bg-white/10 text-white rounded-bl-none border border-white/10'
                }`}
              >
                {!isMine && (
                  <div className="text-[10px] font-bold text-blue-300 mb-0.5">{m.sender}</div>
                )}
                <div>{m.text}</div>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    isMine ? 'text-white/70' : 'text-white/40'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 pt-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Message Raid Team..."
          className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2.5 text-xs text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--ps-blue)]"
        />
        <button
          type="submit"
          className="px-4 py-2.5 bg-[var(--ps-blue)] hover:bg-blue-600 text-white rounded-full font-bold text-xs transition flex items-center justify-center"
        >
          <i className="fas fa-paper-plane text-xs"></i>
        </button>
      </form>
    </div>
  );
};
