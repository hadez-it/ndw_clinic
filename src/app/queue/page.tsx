'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Activity,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Clock,
  Calendar,
  AlertCircle,
  Stethoscope,
  RefreshCw,
  Home,
  CheckCircle2,
} from 'lucide-react';
import { LiveQueueItem } from '@/lib/types';

export default function QueueDisplayPage() {
  const [queue, setQueue] = useState<LiveQueueItem[]>([]);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Play audio chime for new call
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      // Synthesized gentle dual-tone hospital chime using Web Audio API
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      // Tone 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.frequency.setValueAtTime(587.33, now); // D5
      gain1.gain.setValueAtTime(0.15, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.6);

      // Tone 2
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.frequency.setValueAtTime(880, now + 0.2); // A5
      gain2.gain.setValueAtTime(0.15, now + 0.2);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.2);
      osc2.stop(now + 0.9);
    } catch {
      // Audio not permitted without user gesture or unsupported
    }
  }, [soundEnabled]);

  // Fetch queue data
  const fetchQueue = useCallback(async () => {
    try {
      const res = await fetch('/api/queue');
      if (res.ok) {
        const data = await res.json();
        if (data.queue) {
          setQueue(data.queue);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      }
    } catch (e) {
      console.error('Queue poll error:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll queue every 5 seconds
  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 font-sans">
      {/* Top Header Bar for TV Display */}
      <header className="px-6 py-4 bg-slate-900/90 backdrop-blur border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 shadow-lg shadow-teal-500/20 font-bold">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                <span>NAN DA WUN</span>
                <span className="text-teal-400 font-normal">HEALTHCARE</span>
              </div>
              <div className="text-[10px] tracking-widest text-teal-300 uppercase font-semibold">
                Waiting Room Live Queue Display • လူနာတိုကင်ခေါ်ယူမှုစခရင်
              </div>
            </div>
          </Link>
        </div>

        {/* Live Clock & Date */}
        <div className="flex items-center gap-6">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400 font-medium flex items-center justify-end gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-teal-400" />
              <span>{currentDate}</span>
            </div>
            <div className="text-2xl font-mono font-bold text-teal-300 tracking-wider">
              {currentTime}
            </div>
          </div>

          {/* TV Control Buttons */}
          <div className="flex items-center gap-2 bg-slate-800/80 p-1.5 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
              className={`p-2 rounded-lg transition ${
                soundEnabled ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen TV"
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                fetchQueue();
                playChime();
              }}
              title="Refresh Now"
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/admin"
              title="Return to Staff Admin"
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Waiting Room Queue Grid */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">
            Connecting to clinic queue server...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {queue.map((item) => {
              const isConsulting = item.status === 'consulting';
              return (
                <div
                  key={item.roomNumber}
                  className={`rounded-3xl border transition-all duration-500 overflow-hidden flex flex-col justify-between ${
                    isConsulting
                      ? 'bg-slate-900/90 border-teal-500/60 shadow-2xl shadow-teal-500/10 ring-2 ring-teal-500/20'
                      : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  {/* Card Header: Room & Doctor */}
                  <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
                        {item.roomNumber}
                      </div>
                      <div className="text-base font-extrabold text-white mt-0.5 truncate">
                        {item.doctorName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {item.specialty}
                      </div>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1.5 ${
                        isConsulting
                          ? 'bg-teal-950 text-teal-300 border border-teal-500/40 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isConsulting ? 'bg-teal-400' : 'bg-slate-500'
                        }`}
                      />
                      <span>{isConsulting ? 'IN SESSION' : 'READY'}</span>
                    </div>
                  </div>

                  {/* Main Focus: Big Current Token Number */}
                  <div className="p-6 text-center space-y-2 my-auto">
                    <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                      NOW CALLING • ယခုခေါ်ယူနေသော တိုကင်
                    </div>
                    <div
                      className={`text-6xl sm:text-7xl font-mono font-black tracking-tight ${
                        isConsulting ? 'text-teal-300 animate-fade-in' : 'text-slate-500'
                      }`}
                    >
                      {item.currentToken}
                    </div>
                    <div className="text-sm font-medium text-slate-300 pt-1">
                      Patient: <span className="font-semibold text-white">{item.patientNameMasked}</span>
                    </div>
                  </div>

                  {/* Card Footer: Upcoming Next Tokens */}
                  <div className="p-4 bg-slate-950/70 border-t border-slate-800/70">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>NEXT IN LINE • နောက်လူနာများ</span>
                      <Clock className="w-3 h-3 text-slate-500" />
                    </div>

                    {item.nextTokens && item.nextTokens.length > 0 ? (
                      <div className="flex items-center gap-2">
                        {item.nextTokens.map((tok, idx) => (
                          <div
                            key={idx}
                            className="flex-1 py-1.5 text-center font-mono font-bold text-xs rounded-lg bg-slate-800/90 text-slate-200 border border-slate-700"
                          >
                            {tok}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 text-center py-1">
                        No pending patients in queue
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Bottom Clinic News & Instructions Ticker */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span className="font-medium text-slate-300">
            📢 Notice: Please proceed to the indicated consultation room when your token is called. Have your clinic booklet or National ID ready.
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <span>Auto-syncing (5s) • Last update: {lastUpdated || 'Live'}</span>
          <span className="text-teal-400 font-semibold">Emergency Desk: Room 100</span>
        </div>
      </footer>
    </div>
  );
}
