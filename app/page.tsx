'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Bio } from '@/components/layout/Bio';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">
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
            className="text-lg md:text-xl text-text-secondary font-sans max-w-xl mx-auto font-light mb-12"
          >
            Create your own word search puzzle in seconds. Play, export, and share with anyone.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
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
            WHY USE RITUAL WORD SEARCH?
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
                Create puzzles instantly on any device. Mobile or desktop, no account required.
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
              <h3 className="font-display text-lg mb-2">FUN AND CUSTOMIZABLE</h3>
              <p className="text-sm text-text-secondary">
                Create puzzles using your own words and options. The same seed always generates the same puzzle.
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
                Your puzzles stay on your device. Export as PNG and edit anytime in the My Puzzles section.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <Bio />
    </div>
  );
}
