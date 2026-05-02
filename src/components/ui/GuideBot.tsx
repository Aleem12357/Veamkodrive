import { useState, useEffect } from "react";
import { Bot, X, Sparkles, ChevronRight, RotateCcw, Check, ArrowRight } from "lucide-react";
import { TiltCard } from "./TiltCard";
import { useNavigate } from "react-router-dom";

export interface GuideChoice {
  label: string;
  emoji?: string;
  navigateTo?: string;
  scrollToId?: string;
}

export interface GuideMessage {
  text: string;
  emoji?: string;
  scrollToId?: string;
  type?: "text" | "confirm" | "choice";
  navigateTo?: string;   // for "confirm" type — only navigates when user clicks Yes
  confirmLabel?: string; // e.g. "Take me to Repairs!"
  choices?: GuideChoice[];
}

interface GuideBotProps {
  messages: GuideMessage[];
  title?: string;
  autoOpenOnceId?: string;
  backdrop?: boolean;
}

export const GuideBot = ({ messages, title = "Veamko Guide", autoOpenOnceId, backdrop }: GuideBotProps) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [pendingNav, setPendingNav] = useState<{ to: string; label: string } | null>(null);

  const currentMsg = messages[idx];
  const progress = ((idx + 1) / messages.length) * 100;

  useEffect(() => {
    if (autoOpenOnceId) {
      const key = `guidebot_opened_${autoOpenOnceId}`;
      if (!sessionStorage.getItem(key)) {
        const timer = setTimeout(() => {
          setIsOpen(true);
          sessionStorage.setItem(key, "true");
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [autoOpenOnceId]);

  useEffect(() => {
    if (!isOpen) { setDisplayedText(""); setIsTyping(false); return; }
    setHasUnread(false);
    const text = currentMsg.text;

    if (currentMsg.scrollToId) {
      const el = document.getElementById(currentMsg.scrollToId);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 400);
    }

    let i = 0;
    setIsTyping(true);
    setDisplayedText("");
    const t = setInterval(() => {
      if (i < text.length) { setDisplayedText(text.substring(0, i + 1)); i++; }
      else { setIsTyping(false); clearInterval(t); }
    }, 16);
    return () => clearInterval(t);
  }, [isOpen, idx]);

  const closeBot = () => {
    setIsOpen(false);
    setPendingNav(null);
    setTimeout(() => setIdx(0), 300); // always reset to start
  };

  const goNext = () => {
    if (idx < messages.length - 1) setIdx(i => i + 1);
    else closeBot();
  };

  const handleChoiceClick = (c: GuideChoice) => {
    if (c.scrollToId) {
      const el = document.getElementById(c.scrollToId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    if (c.navigateTo) {
      setPendingNav({ to: c.navigateTo, label: c.label });
    } else {
      goNext();
    }
  };

  const confirmNav = () => {
    if (pendingNav) { navigate(pendingNav.to); window.scrollTo({ top: 0, behavior: "smooth" }); setPendingNav(null); setIsOpen(false); setTimeout(() => setIdx(0), 300); }
  };

  const cancelNav = () => { setPendingNav(null); };

  return (
    <>
      {backdrop && isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-[1px] transition-opacity duration-500 animate-in fade-in pointer-events-none"
        />
      )}
      <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end pointer-events-none">
      {/* Bubble */}
      <div className={`mb-4 transition-all duration-500 origin-bottom-right ${isOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-75 pointer-events-none"}`}>
        <TiltCard intensity={3} className="bg-card/98 backdrop-blur-xl border border-primary/40 rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.15)] w-[320px] md:w-[400px] overflow-hidden">

          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-border/50 bg-gradient-navy/50">
            <div className="flex items-center gap-2 text-primary font-display text-sm">
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span>{title}</span>
              <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">● Live</span>
            </div>
            <div className="flex gap-2">
              {idx > 0 && <button onClick={() => { setIdx(0); setPendingNav(null); }} className="text-muted-foreground hover:text-primary transition-colors"><RotateCcw className="h-3.5 w-3.5" /></button>}
              <button onClick={closeBot} className="text-muted-foreground hover:text-foreground transition-colors"><X className="h-4 w-4" /></button>
            </div>
          </div>

          {/* Progress */}
          <div className="h-0.5 bg-border/30">
            <div className="h-full bg-gradient-to-r from-primary/60 to-primary transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            {currentMsg.emoji && <div className="text-3xl mb-3">{currentMsg.emoji}</div>}

            <div className="min-h-[70px] text-sm text-foreground/90 leading-relaxed mb-4">
              {displayedText}
              {isTyping && (
                <span className="inline-flex gap-0.5 ml-1 align-middle">
                  {[0, 150, 300].map(d => <span key={d} className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </span>
              )}
            </div>

            {/* Pending nav confirm */}
            {!isTyping && pendingNav && (
              <div className="space-y-3 animate-fade-up">
                <p className="text-xs text-muted-foreground">Take you to <span className="text-primary font-semibold">{pendingNav.label}</span>?</p>
                <div className="flex gap-2">
                  <button onClick={confirmNav} className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs px-4 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                    <Check className="h-3.5 w-3.5" /> Yes, let's go!
                  </button>
                  <button onClick={cancelNav} className="flex-1 text-xs border border-border px-4 py-2.5 rounded-full text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                    Maybe later
                  </button>
                </div>
              </div>
            )}

            {/* Choices */}
            {!isTyping && !pendingNav && currentMsg.type === "choice" && currentMsg.choices && (
              <div className="grid grid-cols-2 gap-2 animate-fade-up">
                {currentMsg.choices.map(c => (
                  <button key={c.label} onClick={() => handleChoiceClick(c)}
                    className="flex items-center gap-2 text-left text-xs bg-secondary/50 hover:bg-primary/10 border border-border hover:border-primary/50 px-3 py-2.5 rounded-lg transition-all duration-200 text-foreground/80 hover:text-primary">
                    {c.emoji && <span className="text-base">{c.emoji}</span>}
                    <span className="font-medium">{c.label}</span>
                    <ArrowRight className="h-3 w-3 ml-auto opacity-50" />
                  </button>
                ))}
              </div>
            )}

            {/* Confirm type */}
            {!isTyping && !pendingNav && currentMsg.type === "confirm" && currentMsg.navigateTo && (
              <div className="flex gap-2 animate-fade-up">
                <button onClick={() => { navigate(currentMsg.navigateTo!); window.scrollTo({ top: 0, behavior: "smooth" }); setIsOpen(false); setTimeout(() => setIdx(0), 300); }}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-primary-foreground text-xs px-4 py-2.5 rounded-full font-semibold hover:bg-primary/90 transition-colors">
                  <Check className="h-3.5 w-3.5" /> {currentMsg.confirmLabel ?? "Yes, take me there!"}
                </button>
                <button onClick={goNext} className="flex-1 text-xs border border-border px-4 py-2.5 rounded-full text-muted-foreground hover:border-primary/40 transition-colors">
                  Maybe later
                </button>
              </div>
            )}

            {/* Default next/close */}
            {!isTyping && !pendingNav && currentMsg.type !== "choice" && currentMsg.type !== "confirm" && (
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{idx + 1} / {messages.length}</span>
                <button onClick={goNext} className="flex items-center gap-1.5 text-xs bg-primary/10 hover:bg-primary/20 text-primary px-5 py-2.5 rounded-full font-medium border border-primary/30 hover:border-primary/60 transition-all">
                  {idx < messages.length - 1 ? <><span>Next</span><ChevronRight className="h-3 w-3" /></> : "Close ✓"}
                </button>
              </div>
            )}
          </div>
        </TiltCard>
      </div>

      {/* Bot button */}
      <div className="pointer-events-auto" style={{ animation: "botFloat 3s ease-in-out infinite" }}>
        <button onClick={() => { setIsOpen(o => !o); if (isOpen) { setPendingNav(null); setTimeout(() => setIdx(0), 300); } setHasUnread(false); }} className="relative group focus:outline-none">
          <div className="absolute inset-0 rounded-full blur-xl bg-primary/15 group-hover:bg-primary/35 transition-colors duration-500 animate-pulse" />
          <div className={`relative w-16 h-16 rounded-full bg-gradient-navy border-2 flex items-center justify-center transition-all duration-500 ${isOpen ? "border-primary scale-90 shadow-[0_0_25px_rgba(212,175,55,0.5)]" : "border-primary/50 shadow-[0_0_15px_rgba(212,175,55,0.3)] group-hover:scale-110 group-hover:border-primary"}`}>
            <Bot className={`h-8 w-8 text-primary transition-all duration-500 ${isOpen ? "rotate-12" : "group-hover:rotate-12"}`} />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </div>
            {hasUnread && !isOpen && (
              <div className="absolute -top-2 -left-2 bg-primary text-primary-foreground text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-bounce shadow-lg">!</div>
            )}
          </div>
        </button>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 text-center w-16 pointer-events-auto">{isOpen ? "Close" : "Guide"}</p>

      <style>{`@keyframes botFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }`}</style>
      </div>
    </>
  );
};
