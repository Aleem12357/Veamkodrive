import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Car } from "lucide-react";
import logo from "@/assets/logo/logo.png";
import { cn } from "@/lib/utils";

export const Preloader = () => {
  const [loading, setLoading] = useState(true);
  const [shouldRender, setShouldRender] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const location = useLocation();
  const firstLoadDone = useRef(false);

  useEffect(() => {
    const isFirst = !firstLoadDone.current;
    setIsFirstLoad(isFirst);
    
    setLoading(true);
    setShouldRender(true);

    const handleLoad = () => {
      const delay = isFirst ? 1800 : 1000;
      
      setTimeout(() => {
        setLoading(false);
        setTimeout(() => {
          setShouldRender(false);
          if (isFirst) firstLoadDone.current = true;
        }, 800);
      }, delay); 
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, [location.pathname]);

  if (!shouldRender) return null;

  // INITIAL LOADER (Full Screen, Detailed Logo)
  if (isFirstLoad) {
    return (
      <div
        className={cn(
          "fixed inset-0 z-[9999] flex items-center justify-center bg-background transition-all duration-1000 ease-in-out",
          !loading ? "opacity-0 pointer-events-none scale-110" : "opacity-100"
        )}
      >
        <div className="relative flex flex-col items-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[400px] md:h-[400px] pointer-events-none">
            <div className="absolute inset-0 rounded-full border border-primary/10 animate-spin-slow" />
            <div className="absolute inset-4 rounded-full border-2 border-primary/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
            <div className="absolute inset-0 rounded-full border-t-2 border-primary shadow-[0_0_15px_rgba(212,175,55,0.4)] animate-spin" />
            <div className="absolute inset-20 rounded-full bg-primary/5 blur-3xl animate-pulse" />
          </div>
          <div className="relative z-10 w-32 md:w-48 animate-fade-in flex items-center justify-center">
            <img src={logo} alt="Veamkodrive" className="w-full h-auto drop-shadow-[0_0_25px_rgba(212,175,55,0.4)]" />
          </div>
          <div className="mt-20 text-center animate-slide-up">
            <p className="text-primary text-xs md:text-sm uppercase tracking-[0.6em] font-light">Veamkodrive</p>
            <div className="gold-divider w-40 mt-4 mx-auto opacity-50" />
          </div>
        </div>
      </div>
    );
  }

  // TRANSITION LOADER (The "Racing Car" Animation)
  return (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex items-center justify-center bg-background/90 backdrop-blur-xl transition-all duration-500 ease-in-out",
        !loading ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div className="relative flex flex-col items-center">
        {/* Track Line */}
        <div className="w-64 h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent absolute top-1/2 mt-10" />
        
        {/* Racing Car Container */}
        <div className="relative flex items-center justify-center animate-drive-loop">
          {/* Car Icon */}
          <Car className="w-16 h-16 text-primary drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]" />
          
          {/* Speed Lines */}
          <div className="absolute right-full mr-4 flex flex-col gap-2 opacity-60">
            <div className="w-8 h-[2px] bg-primary animate-speed-line-1" />
            <div className="w-12 h-[2px] bg-primary animate-speed-line-2" />
            <div className="w-6 h-[2px] bg-primary animate-speed-line-3" />
          </div>
          
          {/* Ground Glow */}
          <div className="absolute bottom-0 w-12 h-2 bg-primary/20 blur-md rounded-full -mb-2" />
        </div>
        
        <p className="mt-16 text-[10px] uppercase tracking-[0.6em] text-primary font-display italic animate-pulse">
          Accelerating...
        </p>
      </div>
    </div>
  );
};
