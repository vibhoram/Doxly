import React from 'react';

export default function Logo({ className = "w-14 h-14" }: { className?: string }) {
  return (
    <div className={`${className} relative group transition-all duration-700`}>
      {/* Outer Halo Glow */}
      <div className="absolute inset-[-8px] bg-primary/20 blur-2xl rounded-full group-hover:bg-primary/40 transition-all duration-700 opacity-0 group-hover:opacity-100" />
      
      {/* Prime Insignia Container */}
      <div className="relative w-full h-full bg-slate-900 rounded-[1.25rem] flex items-center justify-center shadow-2xl overflow-hidden group-hover:scale-110 group-hover:rotate-[2deg] transition-all duration-700 border border-white/10">
        
        {/* Kinetic Grid Pattern (Subtle) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Abstract "D" Prism / Shield Style */}
        <svg 
          viewBox="0 0 24 24" 
          className="w-3/5 h-3/5 text-white fill-none stroke-current"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Outer Protective Curve */}
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="opacity-100" />
          
          {/* Internal D-Core */}
          <path d="M9 8h2c2 0 3 1.5 3 4s-1 4-3 4H9V8z" className="opacity-90" strokeWidth="2" />
        </svg>

        {/* Scan Line Animation */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/40 shadow-[0_0_8px_rgba(99,102,241,0.8)] animate-beam pointer-events-none" />
        
        {/* Reflection Shine */}
        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] group-hover:left-[200%] transition-all duration-1000 ease-in-out" />
      </div>
    </div>
  );
}
