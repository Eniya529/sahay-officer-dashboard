import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Mic, 
  Send, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  MessageSquare,
  Globe,
  Lock,
  Edit3
} from 'lucide-react';
import type { LanguageCode } from '../../types';

export const LiveAssessmentModule: React.FC = () => {
  const {
    activeVictimCaseId,
    sessionMessages,
    currentSvi,
    latestAnalysis,
    isAnalyzing,
    statusText,
    submitVictimMessage,
    clearSession,
    setCurrentRoute,
    setSelectedCaseId,
    language,
    setLanguage,
    userRole
  } = useApp();

  const [inputMsg, setInputMsg] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [inputMode, setInputMode] = useState<'type' | 'speak'>('type');
  const [speechSupported, setSpeechSupported] = useState(true);
  const [speechWarning, setSpeechWarning] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const isOfficer = userRole === 'officer';

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessionMessages, isAnalyzing]);

  // Web Speech Recognition setup
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = language === 'hi' ? 'hi-IN' : language === 'ta' ? 'ta-IN' : language === 'te' ? 'te-IN' : language === 'kn' ? 'kn-IN' : language === 'ml' ? 'ml-IN' : 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setSpeechWarning(null);
      };

      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputMsg(transcript);
      };

      rec.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechWarning('Microphone permission denied. Please check browser settings.');
        } else {
          setSpeechWarning('Voice input unavailable for this text. Please type below.');
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      setSpeechSupported(false);
    }
  }, [language]);

  const handleToggleVoice = () => {
    setInputMode('speak');
    if (!speechSupported) {
      setSpeechWarning('Voice recognition is unavailable in this browser. Please use text input.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setInputMsg('');
      setSpeechWarning(null);
      try {
        recognitionRef.current?.start();
      } catch (err) {
        console.warn('Speech start error:', err);
        setIsListening(false);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMsg.trim() || isAnalyzing) return;
    const textToSend = inputMsg.trim();
    setInputMsg('');
    await submitVictimMessage(textToSend);
  };

  const handleQuickOptionClick = async (optionText: string) => {
    if (isAnalyzing) return;
    await submitVictimMessage(optionText);
  };

  const getSviLevelColor = (level?: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40 glow-rose animate-pulse';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MODERATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    }
  };

  const languagesList: { code: LanguageCode; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी (Hindi)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-fadeIn">
      {/* Title Header */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-950 via-slate-900 to-teal-950/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 text-[11px] font-semibold">
              PROTECTIVE INTAKE CHANNEL
            </span>
            <span className="text-xs text-slate-400 font-mono font-bold">
              Case Ref: <strong className="text-teal-300">{activeVictimCaseId}</strong>
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Tell us what happened
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-normal">
            You can describe your situation in your own words. You can type or speak.
          </p>
        </div>

        {/* Right Controls: Multilingual Selector */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center">
            <Globe className="w-4 h-4 text-teal-400 absolute left-3 pointer-events-none" />
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as LanguageCode)}
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-semibold text-white focus:outline-none focus:border-teal-500 cursor-pointer appearance-none shadow-md"
            >
              {languagesList.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* INPUT AREA SECTION */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setInputMode('speak')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center space-x-2 border ${
                inputMode === 'speak'
                  ? 'bg-teal-600 text-white border-teal-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Mic className="w-4 h-4" />
              <span>🎙 Speak</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('type')}
              className={`px-4 py-2 rounded-xl font-bold text-xs transition flex items-center space-x-2 border ${
                inputMode === 'type'
                  ? 'bg-teal-600 text-white border-teal-500 shadow-md'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>✍ Type</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-teal-400" />
            <span>🔒 Confidential & Secure Intake</span>
          </div>
        </div>

        {/* Voice Warning Notice if unsupported */}
        {speechWarning && (
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{speechWarning}</span>
            </div>
            <button onClick={() => setSpeechWarning(null)} className="text-xs text-amber-400 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* Input Text Form */}
        <form onSubmit={handleSendMessage} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type your message... (Example: Some people near my home are threatening me.)"
              className="w-full rounded-xl bg-slate-900/90 border border-slate-700/80 p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition resize-none shadow-inner"
            />
            {isListening && (
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold animate-pulse flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>🔴 Listening... Speak now</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              {inputMode === 'speak' ? (
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition flex items-center space-x-2 shadow-md ${
                    isListening
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-teal-600 hover:bg-teal-500 text-white'
                  }`}
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
                  <span>{isListening ? 'Stop Recording' : 'Start Voice Input'}</span>
                </button>
              ) : null}

              <button
                type="submit"
                disabled={!inputMsg.trim() || isAnalyzing}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-white font-extrabold text-xs shadow-lg shadow-teal-600/25 transition transform active:scale-95 flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </button>

              <button
                type="button"
                onClick={clearSession}
                className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 text-xs transition border border-slate-800"
              >
                New Complaint
              </button>
            </div>

            <p className="text-xs text-slate-400 italic">
              Every message is automatically evaluated for safety indicators.
            </p>

            {/* Real-time Status Loader */}
            {isAnalyzing && (
              <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold animate-pulse">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>{statusText}</span>
              </div>
            )}
          </div>
        </form>
      </div>

      {/* SPLIT LAYOUT: CONVERSATION STREAM ON LEFT, REASSURING STATUS ON RIGHT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT SIDE: Conversation History (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col h-[460px]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-400" />
                Conversation Log
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {sessionMessages.filter(m => m.sender === 'victim').length} turns
              </span>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
              {sessionMessages.map((msg) => {
                const isVictim = msg.sender === 'victim';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isVictim ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center space-x-1.5 text-[10px] text-slate-400">
                      <span className="font-bold">{isVictim ? 'You' : 'SAHAY Assistant'}</span>
                      <span>•</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[85%] text-xs leading-relaxed shadow-md ${
                        isVictim
                          ? 'bg-teal-600 text-white rounded-tr-none font-medium'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })}

              {isAnalyzing && (
                <div className="flex items-center space-x-2 text-slate-400 text-xs p-3 rounded-2xl bg-slate-900/60 border border-slate-800 w-fit">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-ping" />
                  <span>Understanding your message...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Calm Status for Victim (Or Technical Panel if Officer) (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  {!isOfficer ? 'Complaint Progress' : 'Understanding Your Situation'}
                </h3>
              </div>
            </div>

            {/* Calm Victim Status Display */}
            {!isOfficer ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Complaint Reference:</span>
                    <span className="text-xs font-mono font-bold text-teal-300">{activeVictimCaseId}</span>
                  </div>

                  <div className="flex items-center space-x-2 text-sm font-bold text-teal-300 pt-1">
                    <CheckCircle2 className="w-4 h-4 text-teal-400" />
                    <span>Your information has been received safely.</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We are evaluating your report to connect you with appropriate response support.
                  </p>
                </div>

                {/* ADAPTIVE QUESTIONING UI WITH QUICK OPTION BUTTONS (Requirement 10) */}
                {latestAnalysis?.adaptiveQuestion && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">To better understand your situation:</span>
                    <p className="text-xs font-semibold text-white">
                      "{latestAnalysis.adaptiveQuestion}"
                    </p>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleQuickOptionClick("Yes, I am currently in a safe place.")}
                        className="px-3 py-1.5 rounded-lg bg-teal-600/20 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/30 text-xs font-bold transition"
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickOptionClick("No, I am not in a safe place.")}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickOptionClick("I prefer not to say right now.")}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                      >
                        Prefer not to say
                      </button>
                    </div>
                  </div>
                )}

                {/* Complaint Status Pipeline */}
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Complaint Status Pipeline:</span>
                  <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-semibold">
                    <div className="p-1.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                      Received
                    </div>
                    <div className="p-1.5 rounded bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      Under Review
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 text-slate-500 border border-slate-900">
                      Assigned
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 text-slate-500 border border-slate-900">
                      Follow-up
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* OFFICER VIEW: Technical Assessment Details */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">SVI Score:</span>
                    <div className="text-2xl font-black text-white">{currentSvi} / 100</div>
                  </div>
                  <div className={`px-3 py-1 rounded-lg border text-xs font-black uppercase ${getSviLevelColor(latestAnalysis?.level)}`}>
                    {latestAnalysis?.level || 'LOW'}
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <span className="font-bold text-slate-300 uppercase">Key Evidence Excerpts:</span>
                  <div className="space-y-1.5">
                    {latestAnalysis?.keyEvidence?.map((ev, i) => (
                      <div key={i} className="p-2.5 rounded bg-slate-900 border border-slate-800 text-sky-300 italic">
                        "{ev}"
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* OFFICER BRIDGE ACTION BUTTON */}
      {isOfficer && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => {
              setSelectedCaseId(activeVictimCaseId);
              setCurrentRoute('officer-cases');
            }}
            className="py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs transition flex items-center justify-center space-x-2 shadow-lg"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Open Case Details in Officer View →</span>
          </button>
        </div>
      )}
    </div>
  );
};
