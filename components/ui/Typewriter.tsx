'use client';

import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export function Typewriter({ text, delay = 50 }: { text: string; delay?: number }) {
  const [displayedText, setDisplayedText] = useState('');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, delay);

    return () => clearInterval(interval);
  }, [isInView, text, delay]);

  return (
    <span ref={ref}>
      {displayedText}
      <span className="animate-pulse opacity-70">_</span>
    </span>
  );
}
