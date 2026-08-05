"use client";

import { useRef, useState, useEffect } from "react";
import { Maximize, Minimize } from "lucide-react";

export default function VirtualTourWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        // Support Safari / iOS WebKit
        (containerRef.current as any).webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`w-full bg-black rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl relative group ${
        isFullscreen
          ? "h-screen w-screen rounded-none border-none"
          : "aspect-[4/3] sm:aspect-[16/9] h-[55vh] sm:h-auto"
      }`}
    >
      {/* Tombol Fullscreen Custom khusus Mobile & Desktop */}
      <button
        type="button"
        onClick={toggleFullscreen}
        className="absolute top-3 right-3 z-30 p-2.5 rounded-lg bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all flex items-center justify-center shadow-lg active:scale-95"
        aria-label="Toggle Fullscreen"
      >
        {isFullscreen ? (
          <Minimize className="w-5 h-5" />
        ) : (
          <Maximize className="w-5 h-5" />
        )}
      </button>

      {children}
    </div>
  );
}