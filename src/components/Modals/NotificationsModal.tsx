import React from 'react';
import { NotificationItem } from '../../types';
import { audioEngine } from '../../utils/audio';

interface NotificationsModalProps {
  notifications: NotificationItem[];
  onClearAll: () => void;
  onDismiss: (id: string) => void;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  onClearAll,
  onDismiss,
  onClose
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-white/10">
        <span className="text-xs text-[var(--text-muted)] font-semibold">
          {notifications.length} System Notification{notifications.length === 1 ? '' : 's'}
        </span>
        {notifications.length > 0 && (
          <button
            onClick={() => {
              audioEngine.playHover();
              onClearAll();
            }}
            className="text-xs text-red-400 hover:text-red-300 font-bold transition"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="max-h-[320px] overflow-y-auto space-y-2.5 pr-1 hide-scroll">
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-muted)] text-sm">
            <i className="fas fa-bell-slash text-3xl mb-2 opacity-50 block"></i>
            No unread notifications
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                item.read ? 'bg-white/5 border-white/5 opacity-70' : 'bg-white/10 border-white/20'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    item.type === 'system'
                      ? 'bg-blue-500/20 text-blue-400'
                      : item.type === 'download'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  <i
                    className={`fas ${
                      item.type === 'system'
                        ? 'fa-microchip text-xs'
                        : item.type === 'download'
                        ? 'fa-download text-xs'
                        : 'fa-trophy text-xs'
                    }`}
                  ></i>
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    {item.title}
                    <span className="text-[10px] font-normal text-[var(--text-muted)]">
                      {item.time}
                    </span>
                  </div>
                  <div className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug">
                    {item.description}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  audioEngine.playHover();
                  onDismiss(item.id);
                }}
                className="text-white/40 hover:text-white text-xs p-1"
                title="Dismiss"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))
        )}
      </div>

      <div className="pt-2">
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
