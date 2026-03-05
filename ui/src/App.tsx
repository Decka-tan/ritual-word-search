import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import WordSearchGame from './components/WordSearchGame';
import Bio from './components/Bio';

export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text-primary selection:bg-accent selection:text-black">
      <Header />
      
      <main>
        <Hero />
        
        <section className="py-24 px-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="relative z-10">
            <WordSearchGame />
          </div>
        </section>
        
        <Bio />
      </main>
      
      <footer className="py-8 text-center border-t border-border font-mono text-xs text-text-secondary uppercase tracking-widest">
        © {new Date().getFullYear()} Ritual Word Search. Designed by Decka-tan.
      </footer>
    </div>
  );
}
