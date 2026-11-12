import React, { useState, useEffect } from 'react';
import { audioEngine } from '../../utils/audio';

interface ControllerModalProps {
  onClose: () => void;
}

export const ControllerModal: React.FC<ControllerModalProps> = ({ onClose }) => {
  const [hapticIntensity, setHapticIntensity] = useState<'Strong' | 'Medium' | 'Weak'>('Strong');
  const [triggerMode, setTriggerMode] = useState<'Dynamic Haptic' | 'Linear' | 'Disabled'>('Dynamic Haptic');
  const [vibrating, setVibrating] = useState(false);
  const [lastButtonPressed, setLastButtonPressed] = useState<string>('Touchpad');

  const testHaptics = () => {
    audioEngine.playConfirm();
    setVibrating(true);
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([100, 50, 150, 50, 200]);
      } catch {
        // Ignore
      }
    }
    setTimeout(() => {
      setVibrating(false);
    }, 600);
  };

  // Listen for gamepad events if available
  useEffect(() => {
    const handleGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      for (const gp of gamepads) {
        if (gp) {
          gp.buttons.forEach((b, idx) => {
            if (b.pressed) {
              const names = ['X', 'Circle', 'Square', 'Triangle', 'L1', 'R1', 'L2', 'R2', 'Share', 'Options', 'L3', 'R3', 'Up', 'Down', 'Left', 'Right', 'PS'];
              setLastButtonPressed(names[idx] || `Button ${idx}`);
            }
          });
        }
      }
    };
    const interval = setInterval(handleGamepad, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-[var(--ps-blue)] flex items-center justify-center text-xl">
            <i className="fas fa-gamepad"></i>
          </div>
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              DUALSENSE 2.0 Wireless Controller
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            </div>
            <div className="text-xs text-[var(--text-muted)]">Connected via Bluetooth 5.4 Ultra-Low Latency</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 justify-end">
            <i className="fas fa-battery-three-quarters"></i> 85%
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">Battery Healthy</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-black/30 border border-white/10 text-center relative overflow-hidden">
        <div className={`transition-transform duration-200 ${vibrating ? 'scale-105 animate-pulse text-blue-400' : 'text-neutral-300'}`}>
          <i className="fas fa-gamepad text-6xl my-2"></i>
        </div>
        <div className="text-xs font-semibold text-white/80 mt-1">
          Last Detected Input: <span className="text-[var(--ps-blue)] font-bold">{lastButtonPressed}</span>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-1">
          Supports real physical controllers (DualSense, DualShock, Xbox, Switch Pro) plugged into USB or paired with Bluetooth.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1.5">
            Haptic Feedback
          </label>
          <div className="flex gap-1">
            {(['Strong', 'Medium', 'Weak'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => {
                  audioEngine.playHover();
                  setHapticIntensity(lvl);
                }}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition ${
                  hapticIntensity === lvl
                    ? 'bg-[var(--ps-blue)] text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <label className="block text-[10px] uppercase font-bold text-[var(--text-muted)] mb-1.5">
            Adaptive Triggers
          </label>
          <div className="flex gap-1">
            {(['Dynamic Haptic', 'Linear'] as const).map((m) => (
              <button
                key={m}
                onClick={() => {
                  audioEngine.playHover();
                  setTriggerMode(m);
                }}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition ${
                  triggerMode === m
                    ? 'bg-[var(--ps-blue)] text-white'
                    : 'bg-white/5 hover:bg-white/10 text-white/70'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={testHaptics}
          className="flex-1 py-2.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          <i className="fas fa-wave-square"></i> Test Rumble & Haptics
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};
