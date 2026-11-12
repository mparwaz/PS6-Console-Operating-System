import React, { useRef, useEffect, useState, useCallback } from 'react';
import { audioEngine } from '../utils/audio';

interface PTHallwayGameProps {
  onUnlockTrophy?: (gameTitle: string, trophyTitle: string) => void;
}

export const PTHallwayGame: React.FC<PTHallwayGameProps> = ({ onUnlockTrophy }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [flashlight, setFlashlight] = useState(true);
  const [loopCount, setLoopCount] = useState(1);
  const [eventMessage, setEventMessage] = useState('Look around the hallway. Find the exit door.');
  const [insanity, setInsanity] = useState(10);
  const [zoomed, setZoomed] = useState(false);

  // Player state
  const player = useRef({
    x: 0,
    y: 0,
    z: 2, // distance along hallway (0 to 100)
    angle: 0, // pitch/yaw
    headBob: 0,
    keys: { w: false, s: false, a: false, d: false }
  });

  const triggerNextLoop = useCallback(() => {
    audioEngine.playConfirm();
    setLoopCount((prev) => {
      const next = prev + 1;
      setInsanity((ins) => Math.min(100, ins + 25));
      if (next === 2) {
        setEventMessage('Loop 2: The radio turned on... "Look behind you. I said, look behind you."');
        audioEngine.playHover();
      } else if (next === 3) {
        setEventMessage('Loop 3: The digital clock stopped at 23:59. Crying heard from the bathroom.');
        audioEngine.playConfirm();
      } else if (next >= 4) {
        setEventMessage('Loop 4: The hallway is bathed in blood-red light! Lisa is watching from above.');
        audioEngine.playTrophy();
        if (onUnlockTrophy) {
          onUnlockTrophy('P.T. Silent Hills WASM', 'Silver - Don’t Look Behind You');
        }
      }
      return next;
    });
    player.current.z = 5;
  }, [onUnlockTrophy]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const p = player.current;

      // Update movement
      let speed = 0.4;
      if (p.keys.w) {
        p.z += speed;
        p.headBob += 0.15;
      }
      if (p.keys.s) {
        p.z -= speed * 0.7;
        p.headBob += 0.1;
      }
      if (p.keys.a) p.x -= speed * 0.3;
      if (p.keys.d) p.x += speed * 0.3;

      // Clamp X
      p.x = Math.max(-1.5, Math.min(1.5, p.x));

      // Loop condition (door at end of corridor)
      if (p.z > 92) {
        triggerNextLoop();
      }
      if (p.z < 2) p.z = 2;

      // Clear Screen
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      const bobY = Math.sin(p.headBob) * 6;
      const eyeY = h * 0.5 + bobY;
      const eyeX = w * 0.5 + p.x * 40;

      // Draw corridor walls, floor, and ceiling in 3D perspective
      const isRed = loopCount >= 4;
      const wallColor = isRed ? '#2b0b0b' : '#141412';
      const wallDetail = isRed ? '#401010' : '#22221e';
      const floorColor = isRed ? '#180505' : '#0c0c0b';
      const ceilingColor = '#060606';

      // Vanishing point
      const vpX = eyeX;
      const vpY = eyeY;

      // Distance depth slices
      for (let d = 80; d >= 5; d -= 3) {
        const dist = d - (p.z % 3);
        const scale = 180 / (dist + 5);

        const x1 = vpX - (w * 0.45) * scale;
        const x2 = vpX + (w * 0.45) * scale;
        const yTop = vpY - (h * 0.45) * scale;
        const yBottom = vpY + (h * 0.45) * scale;

        // Draw floor lines
        ctx.fillStyle = floorColor;
        ctx.beginPath();
        ctx.moveTo(x1, yBottom);
        ctx.lineTo(x2, yBottom);
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Draw ceiling lines
        ctx.fillStyle = ceilingColor;
        ctx.beginPath();
        ctx.moveTo(x1, yTop);
        ctx.lineTo(x2, yTop);
        ctx.lineTo(w, 0);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();

        // Draw side walls with dirty peeling floral wallpaper pattern
        ctx.fillStyle = wallColor;
        // Left wall
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x1, yTop);
        ctx.lineTo(x1, yBottom);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();

        // Right wall
        ctx.beginPath();
        ctx.moveTo(w, 0);
        ctx.lineTo(x2, yTop);
        ctx.lineTo(x2, yBottom);
        ctx.lineTo(w, h);
        ctx.closePath();
        ctx.fill();

        // Wall frames & skirting board
        ctx.strokeStyle = wallDetail;
        ctx.lineWidth = 1;
        ctx.strokeRect(x1, yTop, x2 - x1, yBottom - yTop);

        // Doorway at end of corridor (exit door)
        if (d <= 15) {
          const doorW = (x2 - x1) * 0.35;
          const doorH = (yBottom - yTop) * 0.75;
          const doorX = vpX - doorW * 0.5;
          const doorY = yBottom - doorH;

          ctx.fillStyle = isRed ? '#1f0000' : '#1a1815';
          ctx.fillRect(doorX, doorY, doorW, doorH);

          ctx.strokeStyle = isRed ? '#ff3333' : '#4a3d2e';
          ctx.lineWidth = 2;
          ctx.strokeRect(doorX, doorY, doorW, doorH);

          // Door handle
          ctx.fillStyle = '#c5a059';
          ctx.beginPath();
          ctx.arc(doorX + doorW * 0.85, doorY + doorH * 0.55, 3, 0, Math.PI * 2);
          ctx.fill();

          // Door light slit
          ctx.fillStyle = isRed ? 'rgba(255, 50, 50, 0.4)' : 'rgba(255, 230, 180, 0.2)';
          ctx.fillRect(doorX + 2, doorY + doorH - 4, doorW - 4, 3);
        }
      }

      // Draw iconic corridor elements:
      // 1. Digital Clock on small table (at z ~ 30)
      const clockDist = 35 - p.z;
      if (clockDist > 1 && clockDist < 60) {
        const cScale = 160 / clockDist;
        const clockX = vpX + 80 * cScale;
        const clockY = vpY + 20 * cScale;

        // Table
        ctx.fillStyle = '#241b12';
        ctx.fillRect(clockX - 15 * cScale, clockY, 30 * cScale, 40 * cScale);

        // Digital Clock readout (23:59)
        ctx.fillStyle = '#0a0a0a';
        ctx.fillRect(clockX - 10 * cScale, clockY - 10 * cScale, 20 * cScale, 10 * cScale);
        ctx.fillStyle = isRed ? '#ff0000' : '#ffffff';
        ctx.font = `${Math.max(8, Math.floor(7 * cScale))}px Orbitron, monospace`;
        ctx.fillText('23:59', clockX - 8 * cScale, clockY - 3 * cScale);
      }

      // 2. Bathroom Door with crack on left (at z ~ 50)
      const bathDist = 55 - p.z;
      if (bathDist > 1 && bathDist < 65) {
        const bScale = 160 / bathDist;
        const bx = vpX - 120 * bScale;
        const by = vpY - 20 * bScale;

        ctx.strokeStyle = '#332920';
        ctx.lineWidth = 2;
        ctx.strokeRect(bx, by, 35 * bScale, 80 * bScale);

        // Crack in the door with eye peering through if insanity > 30!
        if (insanity > 30) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(bx + 30 * bScale, by + 10 * bScale, 4 * bScale, 60 * bScale);
          ctx.fillStyle = isRed ? '#ff3333' : '#ffffff';
          ctx.beginPath();
          ctx.arc(bx + 32 * bScale, by + 35 * bScale, 2 * bScale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 3. Swinging Chandelier / Hanging light bulb
      const swingAngle = Math.sin(Date.now() * 0.002) * 0.15;
      const bulbX = vpX + Math.sin(swingAngle) * 20;
      const bulbY = vpY - h * 0.3;

      ctx.strokeStyle = '#444';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(vpX, 0);
      ctx.lineTo(bulbX, bulbY);
      ctx.stroke();

      // Bulb glow
      const bulbGrad = ctx.createRadialGradient(bulbX, bulbY, 2, bulbX, bulbY, isRed ? 240 : 180);
      bulbGrad.addColorStop(0, isRed ? 'rgba(255, 60, 60, 0.9)' : 'rgba(255, 240, 180, 0.8)');
      bulbGrad.addColorStop(0.3, isRed ? 'rgba(180, 20, 20, 0.3)' : 'rgba(255, 200, 100, 0.2)');
      bulbGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = bulbGrad;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, isRed ? 240 : 180, 0, Math.PI * 2);
      ctx.fill();

      // Flashlight Vignette Overlay
      if (flashlight) {
        const flashGrad = ctx.createRadialGradient(w * 0.5, eyeY, 50, w * 0.5, eyeY, w * 0.55);
        flashGrad.addColorStop(0, 'rgba(255, 250, 220, 0.05)');
        flashGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
        flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');

        ctx.fillStyle = flashGrad;
        ctx.fillRect(0, 0, w, h);
      } else {
        // Complete pitch black
        ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
        ctx.fillRect(0, 0, w, h);
      }

      // Film Grain & Static noise
      const imgData = ctx.getImageData(0, 0, w, h);
      const data = imgData.data;
      const noiseIntensity = isRed ? 18 : 10;
      for (let i = 0; i < data.length; i += 16) {
        const noise = (Math.random() - 0.5) * noiseIntensity;
        data[i] += noise;
        data[i + 1] += noise;
        data[i + 2] += noise;
      }
      ctx.putImageData(imgData, 0, 0);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [flashlight, loopCount, triggerNextLoop, insanity]);

  // Keyboard controls
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') player.current.keys.w = true;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') player.current.keys.s = true;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') player.current.keys.a = true;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') player.current.keys.d = true;
      if (e.key === 'f' || e.key === 'F') {
        audioEngine.playHover();
        setFlashlight((f) => !f);
      }
      if (e.key === 'r' || e.key === 'R') {
        setZoomed((z) => !z);
      }
    };
    const handleUp = (e: KeyboardEvent) => {
      if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') player.current.keys.w = false;
      if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') player.current.keys.s = false;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') player.current.keys.a = false;
      if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') player.current.keys.d = false;
    };
    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  return (
    <div className="w-full h-full relative flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        width={960}
        height={540}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          zoomed ? 'scale-125' : 'scale-100'
        }`}
      />

      {/* On-Screen HUD & Status */}
      <div className="absolute top-16 left-8 z-20 pointer-events-none">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-white bg-black/60 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          Loop #{loopCount} • Insanity: {insanity}%
        </div>
      </div>

      {/* Subtitles & Radio Broadcast Box */}
      <div className="absolute bottom-16 inset-x-0 mx-auto max-w-xl z-20 text-center px-4 pointer-events-none">
        <div className="bg-black/75 backdrop-blur-md border border-white/20 px-5 py-3 rounded-2xl shadow-2xl">
          <p className="text-xs md:text-sm font-semibold text-white/90 leading-snug">
            {eventMessage}
          </p>
        </div>
      </div>

      {/* Interactive Controls Overlay for Touch / Controller */}
      <div className="absolute bottom-4 right-8 z-20 flex gap-3">
        <button
          onClick={() => {
            audioEngine.playHover();
            setFlashlight(!flashlight);
          }}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1.5 ${
            flashlight
              ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/40'
              : 'bg-white/10 text-white/70 hover:bg-white/20'
          }`}
        >
          <i className="fas fa-lightbulb"></i> {flashlight ? 'Flashlight ON' : 'Flashlight OFF'}
        </button>

        <button
          onClick={() => {
            audioEngine.playHover();
            setZoomed(!zoomed);
          }}
          className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition"
        >
          <i className="fas fa-search-plus"></i> Inspect
        </button>

        <button
          onClick={triggerNextLoop}
          className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-lg shadow-red-600/30"
        >
          Enter Door (Loop)
        </button>
      </div>

      {/* WASD Virtual Direction Pad */}
      <div className="absolute bottom-4 left-8 z-20 flex gap-1.5 text-xs text-white/60 font-mono">
        <span className="bg-white/10 px-2 py-1 rounded border border-white/10">W: Forward</span>
        <span className="bg-white/10 px-2 py-1 rounded border border-white/10">S: Back</span>
        <span className="bg-white/10 px-2 py-1 rounded border border-white/10">A / D: Strafe</span>
      </div>
    </div>
  );
};
