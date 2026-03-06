'use client';

import { useEffect, useState } from 'react';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function HeroBackground() {
  const [grid, setGrid] = useState<{char: string, isGreen: boolean, size: number}[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const updateGrid = () => {
      // Mobile: 24px (denser), Desktop: 36px (less dense for better performance)
      const isMobile = window.innerWidth < 768;
      const charWidth = isMobile ? 24 : 36;
      const charHeight = isMobile ? 24 : 36;

      const c = Math.ceil(window.innerWidth / charWidth);
      const r = Math.ceil(window.innerHeight / charHeight);

      const newGrid = Array.from({ length: c * r }).map(() => ({
        char: LETTERS[Math.floor(Math.random() * LETTERS.length)],
        isGreen: Math.random() > 0.95, // 5% chance to be green
        size: charWidth
      }));

      setGrid(newGrid);
    };

    updateGrid();

    // Debounce resize
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(updateGrid, 200);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeout);
    };
  }, []);

  if (!mounted || grid.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none font-mono text-lg leading-none z-0">
      {/* Base layer (dim) */}
      <div className="absolute inset-0 text-text-secondary opacity-10 flex flex-wrap content-start">
        {grid.map((item, i) => (
          <span key={`base-${i}`} style={{ width: item.size, height: item.size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            {item.char}
          </span>
        ))}
      </div>

      {/* Top layer (bright + green) with animated mask */}
      <div className="absolute inset-0 flex flex-wrap content-start animate-mask-run">
        {grid.map((item, i) => (
          <span
            key={`top-${i}`}
            className={item.isGreen ? 'text-accent font-bold drop-shadow-[0_0_8px_rgba(0,255,148,0.8)]' : 'text-text-primary opacity-80'}
            style={{ width: item.size, height: item.size, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {item.char}
          </span>
        ))}
      </div>

      {/* Gradient overlays for text readability and edge fading */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-bg)_100%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--color-bg)_0%,transparent_60%)] opacity-90"></div>
      <div className="absolute inset-0 bg-bg/60"></div>
    </div>
  );
}
