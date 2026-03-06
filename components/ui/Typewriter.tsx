'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export function Typewriter({ text, delay = 40 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const ref = useRef<HTMLSpanElement>(null);

  // Hapus margin, gunakan amount: 0.1 agar trigger saat 10% elemen terlihat
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= text.length) {
        setDisplayedText(text.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [isInView, text, delay]);

  return (
    <span ref={ref} className="inline-block min-h-[1.5em] relative">
      {/* Trik: Render text asli tapi disembunyikan agar observer tahu ukuran aslinya */}
      <span className="invisible absolute inset-0 pointer-events-none" aria-hidden="true">
        {text}
      </span>

      {/* Text yang diketik */}
      <span>{displayedText}</span>
      <span className="animate-pulse opacity-70">_</span>
    </span>
  );
}
