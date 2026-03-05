import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center relative px-6 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.03, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-display leading-none text-accent pointer-events-none select-none"
      >
        W
      </motion.div>

      <div className="relative z-10 text-center max-w-4xl mx-auto mt-16">
        <motion.h1 
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-6xl md:text-8xl lg:text-9xl font-display tracking-tight uppercase mb-6"
        >
          Ritual <br/>
          <span className="text-text-secondary">Word Search</span>
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-text-secondary font-sans max-w-xl mx-auto font-light"
        >
          A minimal, immersive puzzle experience. Find the hidden words. Maintain your focus.
        </motion.p>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-text-secondary uppercase tracking-widest">Scroll to begin</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-text-secondary to-transparent" />
      </motion.div>
    </section>
  );
}
