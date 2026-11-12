import React, { useState } from 'react';
import { audioEngine } from '../../utils/audio';

interface NetworkModalProps {
  onClose: () => void;
}

export const NetworkModal: React.FC<NetworkModalProps> = ({ onClose }) => {
  const [testing, setTesting] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(845);
  const [uploadSpeed, setUploadSpeed] = useState(48);
  const [ping, setPing] = useState(9);

  const runTest = () => {
    audioEngine.playConfirm();
    setTesting(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setDownloadSpeed(Math.floor(750 + Math.random() * 200));
      setUploadSpeed(Math.floor(40 + Math.random() * 20));
      setPing(Math.floor(7 + Math.random() * 5));
      if (step >= 8) {
        clearInterval(interval);
        setTesting(false);
        setDownloadSpeed(892);
        setUploadSpeed(54);
        setPing(8);
        audioEngine.playTrophy();
      }
    }, 200);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
            <i className="fas fa-wifi"></i>
          </div>
          <div>
            <div className="text-sm font-bold">PlayStation Network</div>
            <div className="text-xs text-[var(--text-muted)]">Connected via Wi-Fi 7 (6 GHz)</div>
          </div>
        </div>
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-500/20 text-green-400 border border-green-500/30">
          NAT Type 1 (Open)
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Download
          </div>
          <div className="text-lg font-bold text-blue-400 font-orbitron">
            {downloadSpeed} <span className="text-[10px] font-normal text-white">Mbps</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Upload
          </div>
          <div className="text-lg font-bold text-blue-400 font-orbitron">
            {uploadSpeed} <span className="text-[10px] font-normal text-white">Mbps</span>
          </div>
        </div>
        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Latency
          </div>
          <div className="text-lg font-bold text-emerald-400 font-orbitron">
            {ping} <span className="text-[10px] font-normal text-white">ms</span>
          </div>
        </div>
      </div>

      <div className="text-xs text-[var(--text-muted)] space-y-1 bg-black/20 p-3 rounded-xl">
        <div className="flex justify-between">
          <span>SSID:</span>
          <span className="font-semibold text-white">CyberHQ_Fiber_6G</span>
        </div>
        <div className="flex justify-between">
          <span>IP Address:</span>
          <span className="font-semibold text-white">192.168.1.188</span>
        </div>
        <div className="flex justify-between">
          <span>PSN Server Region:</span>
          <span className="font-semibold text-white">US-East (Low Latency)</span>
        </div>
      </div>

      <div className="pt-2 flex gap-3">
        <button
          onClick={runTest}
          disabled={testing}
          className="flex-1 py-2.5 rounded-full bg-[var(--ps-blue)] hover:bg-blue-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          {testing ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Testing Speed...
            </>
          ) : (
            <>
              <i className="fas fa-tachometer-alt"></i> Test Internet Speed
            </>
          )}
        </button>
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-bold hover:bg-white/10 transition"
        >
          Done
        </button>
      </div>
    </div>
  );
};
