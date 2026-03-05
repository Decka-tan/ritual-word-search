import React from 'react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between mix-blend-difference">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 relative flex items-center justify-center">
          <div className="absolute w-full h-full border-2 border-white rotate-45" />
          <div className="absolute w-full h-full border-2 border-white" />
        </div>
        <span className="font-display text-xl tracking-widest uppercase">Ritual</span>
      </div>
      
      <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
        <a href="#" className="hover:text-accent transition-colors">Play</a>
        <a href="#" className="hover:text-accent transition-colors">About</a>
        <a href="https://github.com/Decka-tan/ritual-word-search" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
      </nav>
    </header>
  );
}
