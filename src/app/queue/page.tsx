'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
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
  Search,
  User,
  Sparkles,
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
  const [patientSearchToken, setPatientSearchToken] = useState('');

  // Synthesized gentle dual-tone hospital chime using Web Audio API
  const playChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
          setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
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
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Poll queue every 8 seconds, only when tab/screen is visible
  useEffect(() => {
    fetchQueue();
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && !document.hidden) {
        fetchQueue();
      }
    }, 8000);
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

  const searchedMatch = useMemo(() => {
    if (!patientSearchToken.trim()) return null;
    const clean = patientSearchToken.trim().toUpperCase();
    for (const item of queue) {
      if (item.currentToken.toUpperCase() === clean) {
        return { item, type: 'now' as const };
      }
      if (item.nextTokens.some((t) => t.toUpperCase() === clean)) {
        return { item, type: 'next' as const };
      }
    }
    return null;
  }, [patientSearchToken, queue]);

  return (
    <div className="w-full bg-slate-950 text-slate-100 min-h-[calc(100dvh-68px)] flex flex-col justify-between selection:bg-teal-500 font-sans">
      {/* Top Header Bar for Waiting Room & Mobile Tracker */}
      <header className="px-4 sm:px-6 py-3.5 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-sm shadow-teal-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5">
                <span>Waiting Room Queue</span>
                <span className="text-teal-400 font-normal text-xs uppercase px-2 py-0.5 rounded-md bg-teal-950 border border-teal-800/80">
                  Live TV
                </span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium">
                Nan Da Wun Healthcare • Real-time Triage
              </div>
            </div>
          </div>

          {/* Controls on small screen */}
          <div className="flex sm:hidden items-center gap-1.5">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              title={soundEnabled ? 'Mute' : 'Unmute'}
              className={`p-2 rounded-lg text-xs transition ${
                soundEnabled ? 'bg-teal-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => {
                fetchQueue();
                playChime();
              }}
              title="Refresh"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 active:scale-95 transition"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search token field for mobile patients */}
        <div className="w-full sm:w-auto flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Find my token (e.g. T-102)..."
              value={patientSearchToken}
              onChange={(e) => setPatientSearchToken(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-slate-800/90 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Live Clock and TV Controls on Desktop */}
        <div className="hidden sm:flex items-center gap-5">
          <div className="text-right">
            <div className="text-[11px] text-slate-400 font-medium flex items-center justify-end gap-1">
              <Calendar className="w-3 h-3 text-teal-400" />
              <span>{currentDate}</span>
            </div>
            <div className="text-xl font-mono font-bold text-teal-300 tracking-wider">
              {currentTime}
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-800/90 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playChime();
              }}
              title={soundEnabled ? 'Mute Chime' : 'Enable Chime'}
              className={`p-2 rounded-lg transition cursor-pointer ${
                soundEnabled ? 'bg-teal-600 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleFullscreen}
              title="Toggle Fullscreen TV"
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                fetchQueue();
                playChime();
              }}
              title="Refresh Now"
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              href="/admin"
              title="Staff ERP Portal"
              className="p-2 rounded-lg bg-slate-700 text-slate-300 hover:text-white hover:bg-slate-600 transition cursor-pointer"
            >
              <Home className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Patient Token Search Banner if searched */}
      {searchedMatch && (
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 pt-4">
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            searchedMatch.type === 'now'
              ? 'bg-teal-950/80 border-teal-500 text-teal-100 shadow-md shadow-teal-500/20'
              : 'bg-slate-900 border-amber-500/60 text-amber-200'
          }`}>
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
              <div>
                <p className="text-sm font-bold">
                  {searchedMatch.type === 'now'
                    ? `Token ${patientSearchToken.toUpperCase()} is currently being called in ${searchedMatch.item.roomNumber}!`
                    : `Token ${patientSearchToken.toUpperCase()} is queued next in ${searchedMatch.item.roomNumber}.`}
                </p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Consulting with {searchedMatch.item.doctorName} ({searchedMatch.item.specialty})
                </p>
              </div>
            </div>
            <button
              onClick={() => setPatientSearchToken('')}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Main Waiting Room Queue Grid */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse space-y-2">
            <Activity className="w-8 h-8 text-teal-400 mx-auto animate-spin" />
            <p className="text-sm font-medium">Connecting to clinic queue server...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {queue.map((item) => {
              const isConsulting = item.status === 'consulting';
              return (
                <div
                  key={item.roomNumber}
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                    isConsulting
                      ? 'bg-slate-900/90 border-teal-500/60 shadow-lg shadow-teal-500/10 ring-1 ring-teal-500/30'
                      : 'bg-slate-900/40 border-slate-800'
                  }`}
                >
                  {/* Card Header: Room & Doctor */}
                  <div className="p-4 sm:p-5 border-b border-slate-800/80 bg-slate-900/70 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
                        {item.roomNumber}
                      </div>
                      <div className="text-sm sm:text-base font-extrabold text-white mt-0.5 truncate max-w-[180px]">
                        {item.doctorName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-medium">
                        {item.specialty}
                      </div>
                    </div>

                    <div
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 ${
                        isConsulting
                          ? 'bg-teal-950 text-teal-300 border border-teal-500/50'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <span
                        className={`w-2 h-2 rounded-full ${
                          isConsulting ? 'bg-teal-400 animate-pulse' : 'bg-slate-500'
                        }`}
                      />
                      <span>{isConsulting ? 'IN SESSION' : 'READY'}</span>
                    </div>
                  </div>

                  {/* Main Focus: Big Current Token Number */}
                  <div className="p-6 text-center space-y-2 my-auto">
                    <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400">
                      Now Calling / ယခုခေါ်ယူနေသော
                    </div>
                    <div
                      className={`text-5xl sm:text-6xl font-mono font-black tracking-tight ${
                        isConsulting ? 'text-teal-300 animate-fade-in' : 'text-slate-500'
                      }`}
                    >
                      {item.currentToken}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-300 pt-1">
                      Patient: <span className="font-semibold text-white">{item.patientNameMasked}</span>
                    </div>
                  </div>

                  {/* Card Footer: Upcoming Next Tokens */}
                  <div className="p-3.5 sm:p-4 bg-slate-950/80 border-t border-slate-800/80">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>Next In Line</span>
                      <Clock className="w-3 h-3 text-slate-500" />
                    </div>

                    {item.nextTokens && item.nextTokens.length > 0 ? (
                      <div className="flex items-center gap-1.5">
                        {item.nextTokens.map((tok, idx) => (
                          <div
                            key={idx}
                            className="flex-1 py-1.5 text-center font-mono font-bold text-xs rounded-lg bg-slate-800 text-slate-200 border border-slate-700/80"
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
      <footer className="bg-slate-900/90 border-t border-slate-800 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
          <span className="font-medium text-slate-300 text-[11px] sm:text-xs">
            Notice: Please proceed to the indicated consultation room when your token is displayed.
          </span>
        </div>

        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <span>Sync: {lastUpdated || 'Live'}</span>
          <span className="text-teal-400 font-semibold">Triage Desk: Room 100</span>
        </div>
      </footer>
    </div>
  );
}
