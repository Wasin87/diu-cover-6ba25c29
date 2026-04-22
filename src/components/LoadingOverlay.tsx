import { useEffect, useState } from "react";
import diuLogo from "@/assets/diu-logo.png";

export function LoadingOverlay() {
  const [text, setText] = useState("");
  const full = "Generating your cover page...";
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
    <div className="fixed inset-0 z-[10000] bg-white/95 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden">
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
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div className="absolute inset-0 spin-ring" />
        <img src={diuLogo} alt="DIU" className="w-24 h-24 object-contain" />
      </div>
      <p className="mt-8 font-display text-2xl text-[#166534] typewriter">
        {text}
      </p>
    </div>
  );
}
