'use client';
import { useState, useEffect } from 'react';

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // normal, large, extra-large
  const [contrastLevel, setContrastLevel] = useState('100'); // 100 to 150
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [guideY, setGuideY] = useState(0);

  // Handle Font Scaling on root body/html
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-base', 'text-lg', 'text-xl');
    if (fontSize === 'normal') root.style.fontSize = '100%';
    if (fontSize === 'large') root.style.fontSize = '115%';
    if (fontSize === 'extra-large') root.style.fontSize = '130%';
  }, [fontSize]);

  // Handle Dynamic Contrast Level via CSS filter
  useEffect(() => {
    document.documentElement.style.filter = `contrast(${contrastLevel}%)`;
  }, [contrastLevel]);

  // Handle Dyslexia Font Mode
  useEffect(() => {
    if (dyslexiaFont) {
      document.body.style.letterSpacing = '0.08em';
      document.body.style.lineHeight = '1.8';
    } else {
      document.body.style.letterSpacing = 'normal';
      document.body.style.lineHeight = 'normal';
    }
  }, [dyslexiaFont]);

  // Handle Reduced Motion Mode
  useEffect(() => {
    if (reducedMotion) {
      document.body.classList.add('reduce-motion');
    } else {
      document.body.classList.remove('reduce-motion');
    }
  }, [reducedMotion]);

  // Handle Reading Guide Mouse Tracker
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (readingGuide) {
        setGuideY(e.clientY);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [readingGuide]);

  // Screen Reader / Text-to-Speech helper for blind users
  const handleReadPage = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const mainContent = document.querySelector('main')?.innerText || document.body.innerText;
    const pageTitle = document.title || 'GovTracker AI Platform';
    
    const textToRead = `Page Title: ${pageTitle}. Content summary: ${mainContent.substring(0, 800)}...`;
    const utterance = new SpeechSynthesisUtterance(textToRead);

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Combined Voice Navigation & Universal Typing Assistant
  const handleVoiceCommand = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      const lowerText = speechToText.toLowerCase().trim();

      // 1. Check for Module Navigation Commands
      if (lowerText.includes('home') || lowerText.includes('dashboard') || lowerText.includes('go to home')) {
        window.location.href = '/';
        return;
      } 
      if (lowerText.includes('report') || lowerText.includes('go to report')) {
        window.location.href = '/report';
        return;
      } 
      if (lowerText.includes('budget') || lowerText.includes('go to budget') || lowerText.includes('spending')) {
        window.location.href = '/budgets';
        return;
      } 
      if (lowerText.includes('decision') || lowerText.includes('go to decision')) {
        window.location.href = '/decisions';
        return;
      } 
      if (lowerText.includes('policy') || lowerText.includes('go to policy')) {
        window.location.href = '/policies';
        return;
      } 
      if (lowerText.includes('service') || lowerText.includes('go to service')) {
        window.location.href = '/services';
        return;
      } 
      if (lowerText.includes('read page') || lowerText.includes('read aloud')) {
        handleReadPage();
        return;
      }

      // 2. Universal Field Typing / Dictation (Active input or textarea anywhere in the app)
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        let formattedText = speechToText;
        
        // Smart formatting for email fields (e.g. spelling "ineke onubi at gmail dot com")
        if (activeElement.type === 'email' || activeElement.name?.includes('email') || activeElement.id?.includes('email')) {
          formattedText = speechToText
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/at/g, '@')
            .replace(/dot/g, '.');
        }
        
        activeElement.value = activeElement.value ? activeElement.value + ' ' + formattedText : formattedText;
        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        alert(`Heard: "${speechToText}". Say "Go to report", "Budgets", "Policies", or click inside any input field to type automatically!`);
      }
    };

    recognition.start();
  };

  return (
    <>
      {/* Reading Guide Ruler for Dyslexia / Low Vision */}
      {readingGuide && (
        <div 
          className="fixed left-0 right-0 h-10 bg-amber-400/20 border-y-2 border-amber-400 pointer-events-none z-40 transition-all duration-75"
          style={{ top: `${guideY - 20}px` }}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        {/* Trigger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Accessibility Menu"
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 transition transform hover:scale-105 border-2 border-slate-950"
        >
          <span className="text-lg">♿</span>
          <span className="text-xs uppercase tracking-wider font-extrabold">Accessibility</span>
        </button>

        {/* Accessibility Control Panel */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-84 bg-slate-900 border border-slate-700 rounded-2xl p-5 shadow-2xl text-white space-y-4 animate-in fade-in slide-in-from-bottom-4 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm flex items-center gap-2"><span>♿</span> Universal Accessibility Suite</h3>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>

            {/* 1. Blind Support: Screen Reader */}
            <div className="space-y-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700">
              <label className="text-xs text-amber-400 font-bold flex items-center gap-1.5">
                <span>🔊</span> Screen Reader (For Blind Users)
              </label>
              <div className="flex gap-2 pt-1">
                <button 
                  onClick={handleReadPage}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 py-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5"
                >
                  <span>▶️</span> {isSpeaking ? 'Reading...' : 'Read Page Aloud'}
                </button>
                {isSpeaking && (
                  <button onClick={handleStopSpeaking} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-xs font-bold">
                    ⏹️ Stop
                  </button>
                )}
              </div>
            </div>

            {/* 2. Text Scaling */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-300 font-medium">Text Scaling (Low Vision)</label>
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => setFontSize('normal')} className={`py-1.5 text-xs rounded-lg border ${fontSize === 'normal' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>Normal</button>
                <button onClick={() => setFontSize('large')} className={`py-1.5 text-xs rounded-lg border ${fontSize === 'large' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>A+ Large</button>
                <button onClick={() => setFontSize('extra-large')} className={`py-1.5 text-xs rounded-lg border ${fontSize === 'extra-large' ? 'bg-amber-500 text-slate-950 font-bold border-amber-400' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>A++ Max</button>
              </div>
            </div>

            {/* 3. Contrast Adjustment */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 font-medium">
                <span>Contrast Slider</span>
                <span className="text-amber-400 font-bold">{contrastLevel}%</span>
              </div>
              <input 
                type="range" min="90" max="160" step="10" value={contrastLevel}
                onChange={(e) => setContrastLevel(e.target.value)}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>

            {/* 4. Reading Aids & Neurodiversity (Dyslexia & Guide) */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
              <button 
                onClick={() => setDyslexiaFont(!dyslexiaFont)}
                className={`py-2 px-2 rounded-lg text-xs font-semibold border text-center transition ${dyslexiaFont ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
              >
                🔤 Dyslexia Friendly
              </button>
              <button 
                onClick={() => setReadingGuide(!readingGuide)}
                className={`py-2 px-2 rounded-lg text-xs font-semibold border text-center transition ${readingGuide ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold' : 'bg-slate-800 border-slate-700 text-slate-300'}`}
              >
                📏 Reading Guide
              </button>
            </div>

            {/* 5. Motion Reduction Toggle */}
            <div className="flex justify-between items-center pt-2 border-t border-slate-800">
              <span className="text-xs text-slate-300 font-medium">Reduce Motion (Vestibular)</span>
              <button 
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${reducedMotion ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}
              >
                {reducedMotion ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {/* 6. Voice Navigation & Dictation */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <label className="text-xs text-slate-300 font-medium">Voice Navigation & Dictation</label>
              <button 
                onClick={handleVoiceCommand}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition ${isListening ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
              >
                <span>🎙️</span> {isListening ? 'Listening... Speak command' : 'Activate Voice Assistant'}
              </button>
              <p className="text-[10px] text-slate-400 text-center leading-relaxed">
                Say <strong>"Go to report"</strong>, <strong>"Budgets"</strong>, or click any input box to dictate text!
              </p>
            </div>

          </div>
        )}
      </div>
    </>
  );
}