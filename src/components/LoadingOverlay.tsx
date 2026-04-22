import { useEffect, useState } from "react";
import diuLogo from "@/assets/diu-logo.png";

export function LoadingOverlay() {
  const [text, setText] = useState("");
  const full = "Crafting your cover page...";
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i++;
      setText(full.slice(0, i));
      if (i >= full.length) clearInterval(id);
    }, 50);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden px-6">
      <div className="absolute top-0 left-0 h-1.5 progress-bar bg-gradient-to-r from-[#A3E635] via-[#84CC16] to-[#65A30D]" />
      {Array.from({ length: 18 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            animationDuration: `${3 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.4 + Math.random() * 0.5,
          }}
        />
      ))}

      {/* Logo with multi-ring orbit */}
      <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#84CC16] border-r-[#65A30D] animate-spin" style={{ animationDuration: "1.4s" }} />
        <div className="absolute inset-3 rounded-full border-2 border-dashed border-[#A3E635] animate-spin" style={{ animationDuration: "3s", animationDirection: "reverse" }} />
        <div className="absolute inset-6 rounded-full bg-gradient-to-br from-[#F7FEE7] to-[#ECFCCB] shadow-[0_0_50px_rgba(132,204,22,0.45)] flex items-center justify-center">
          <img
            src={diuLogo}
            alt="DIU"
            className="w-28 h-28 sm:w-32 sm:h-32 object-contain animate-pulse"
            style={{ animationDuration: "2.2s" }}
          />
        </div>
        {/* Orbiting dots */}
        {[0, 120, 240].map((deg) => (
          <span
            key={deg}
            className="absolute w-3 h-3 rounded-full bg-[#84CC16] shadow-lg"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(110px)`,
              animation: "spin-ring 2s linear infinite",
              transformOrigin: "0 0",
            }}
          />
        ))}
      </div>

      <p className="mt-10 font-display text-xl sm:text-2xl text-[#166534] typewriter text-center">
        {text}
      </p>
      <p className="mt-2 text-xs sm:text-sm text-[#65A30D] tracking-widest uppercase font-semibold">
        Daffodil International University
      </p>
    </div>
  );
}
