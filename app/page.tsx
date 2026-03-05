'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Hero Section */}
      <section className="min-h-[70vh] flex flex-col items-center justify-center relative px-6 overflow-hidden">
        {/* Animated W Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.03, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[40vw] font-display leading-none text-accent pointer-events-none select-none"
        >
          W
        </motion.div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
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

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link href="/maker">
              <Button className="w-full sm:w-auto !bg-accent !text-black hover:!bg-accent/90 font-mono text-sm uppercase tracking-wider px-8 py-4">
                Create Puzzle
              </Button>
            </Link>
            <Link href="/my-puzzles">
              <Button
                variant="secondary"
                className="w-full sm:w-auto !bg-transparent !border-border !text-text-primary hover:!border-accent hover:!text-accent font-mono text-sm uppercase tracking-wider px-8 py-4"
              >
                My Puzzles
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
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

      {/* Features */}
      <section className="py-24 px-6 bg-surface border-t border-border">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl sm:text-3xl font-display tracking-wide uppercase text-center mb-12"
          >
            WHY RITUAL?
          </motion.h2>

          <div className="grid gap-6 sm:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 rounded-2xl border border-border hover:border-accent/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-accent">
                🔓
              </div>
              <h3 className="font-display text-lg mb-2">NO LOGIN</h3>
              <p className="text-sm text-text-secondary">
                Create puzzles instantly with secret edit links. No account required.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 rounded-2xl border border-border hover:border-accent/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-accent">
                🎲
              </div>
              <h3 className="font-display text-lg mb-2">DETERMINISTIC</h3>
              <p className="text-sm text-text-secondary">
                Same words + options + seed = same puzzle. Always reproducible.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl border border-border hover:border-accent/50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-accent">
                💾
              </div>
              <h3 className="font-display text-lg mb-2">YOUR DATA</h3>
              <p className="text-sm text-text-secondary">
                Full ownership. Export as PNG. Edit anytime with secret link.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-border font-mono text-xs text-text-secondary uppercase tracking-widest">
        © {new Date().getFullYear()} Ritual Word Search. Designed by Decka-tan.
      </footer>
    </div>
  );
}
