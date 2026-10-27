import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { LiveAIPanel } from './LiveAIPanel';
import { DynamicTimelineChart } from './DynamicTimelineChart';
import { TraumaQuestioningBadge } from './TraumaQuestioningBadge';
import { 
  Mic, 
  MicOff, 
  Send, 
  ShieldAlert, 
  Volume2, 
  ArrowLeft, 
  Lock, 
  MessageSquare 
} from 'lucide-react';

export const VictimComplaintPage: React.FC<{ onBackToLanding: () => void }> = ({ onBackToLanding }) => {
  const { selectedCase, submitVictimMessage, language, setUserRole } = useApp();
  const [inputText, setInputText] = useState('');
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [mode, setMode] = useState<'text' | 'voice'>('voice');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedCase?.messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    submitVictimMessage(inputText);
    setInputText('');
  };

  const toggleVoice = () => {
    setIsVoiceActive(!isVoiceActive);
  };

  if (!selectedCase) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4 space-y-4 animate-fadeIn">
      {/* Top Banner Header */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={onBackToLanding}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            title="Back to Landing"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base font-bold text-white">NHAA 14566 — Support Assistant</h2>
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Connected</span>
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Reference: <strong className="text-sky-300 font-mono">{selectedCase.id}</strong> | Language: <span className="uppercase text-slate-300 font-semibold">{language}</span>
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex items-center space-x-4">
          <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Session</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setMode('voice')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                mode === 'voice' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>Voice</span>
            </button>
            <button
              onClick={() => setMode('text')}
              className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition ${
                mode === 'text' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Text</span>
            </button>
          </div>

          {/* Escalate button */}
          <button
            onClick={() => setUserRole('officer')}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-xs font-bold transition shadow-sm"
          >
            <ShieldAlert className="w-4 h-4 text-rose-400" />
            <span>🛑 Request Human Officer</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Chat Conversation on Left, Real-Time AI Panel on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: Conversation Body (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col h-[650px] glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          
          {/* Audio Wave Visualizer (When Voice is Active) */}
          {mode === 'voice' && (
            <div className="bg-slate-900/90 border-b border-slate-800 p-3 flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-xl ${isVoiceActive ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">
                    {isVoiceActive ? 'Voice Analysis Active (Real-Time Audio Stream)' : 'Voice Input Standby'}
                  </span>
                  <p className="text-[10px] text-slate-400">Speech pitch, tremor, and stress indicators evaluated live</p>
                </div>
              </div>

              {/* Animated Waveform simulated bars */}
              {isVoiceActive && (
                <div className="flex items-center space-x-1 h-6">
                  <span className="w-1 bg-sky-400 rounded-full h-3 animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-1 bg-sky-400 rounded-full h-6 animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <span className="w-1 bg-sky-400 rounded-full h-4 animate-bounce" style={{ animationDelay: '0.3s' }} />
                  <span className="w-1 bg-sky-400 rounded-full h-5 animate-bounce" style={{ animationDelay: '0.15s' }} />
                  <span className="w-1 bg-sky-400 rounded-full h-2 animate-bounce" style={{ animationDelay: '0.25s' }} />
                </div>
              )}
            </div>
          )}

          {/* Chat Messages Log */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
            {selectedCase.messages.map((msg) => {
              const isVictim = msg.sender === 'victim';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isVictim ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                    <span>{isVictim ? 'Victim / Complainant' : 'SAHAY AI Assistant'}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                    {msg.sviAfter && (
                      <span className="font-mono text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                        SVI → {msg.sviAfter}
                      </span>
                    )}
                  </div>

                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed ${
                      isVictim
                        ? 'bg-sky-600 text-white rounded-tr-none shadow-md shadow-sky-600/20'
                        : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {/* Highlight triggers if detected */}
                    {msg.highlightedTriggers && msg.highlightedTriggers.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-sky-400/30 flex flex-wrap gap-1">
                        <span className="text-[10px] text-sky-200 font-semibold">Detected Triggers:</span>
                        {msg.highlightedTriggers.map((trig, idx) => (
                          <span key={idx} className="text-[10px] bg-rose-500/30 text-rose-200 px-1.5 py-0.5 rounded border border-rose-400/40 font-mono">
                            "{trig}"
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Bottom Controls */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 space-y-2">
            <form onSubmit={handleSend} className="flex items-center space-x-2">
              <button
                type="button"
                onClick={toggleVoice}
                className={`p-3 rounded-xl border transition flex items-center justify-center ${
                  isVoiceActive
                    ? 'bg-rose-500 text-white border-rose-400 animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
                }`}
                title={isVoiceActive ? 'Stop Voice Recording' : 'Start Voice Recording'}
              >
                {isVoiceActive ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message safely here..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition"
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white transition flex items-center justify-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>Press Enter to send message</span>
              <span className="text-amber-400">All data automatically logged to NHAA Audit System</span>
            </div>
          </div>

        </div>

        {/* RIGHT: Live AI Assessment Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <LiveAIPanel />
          <TraumaQuestioningBadge />
          <DynamicTimelineChart />
        </div>

      </div>
    </div>
  );
};
