'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Bio } from '@/components/layout/Bio';
import { HeroBackground } from '@/components/HeroBackground';
import { ChevronDown, Play } from 'lucide-react';
import { Typewriter } from '@/components/ui/Typewriter';

const FEATURED_PUZZLES = [
  {
    id: 'ritual-tech-1',
    title: 'Ritual Tech #1',
    author: 'Decka-tan',
    desc: 'Sharpen your knowledge about Ritual tech in this Word Search Puzzle.',
  },
  {
    id: 'ritual-tech-2',
    title: 'Ritual Tech #2',
    author: 'Decka-tan',
    desc: 'Sharpen your knowledge about Ritual tech in this Word Search Puzzle.',
  },
  {
    id: 'ritual-discord-1',
    title: 'Ritual Discord #1',
    author: 'Decka-tan',
    desc: 'Always vibing on the Ritual Discord? This Word Search Puzzle is for you.',
  },
  {
    id: 'ritualist-name-1',
    title: 'Ritualist Name #1',
    author: 'Decka-tan',
    desc: 'A Word Search Puzzle dedicated to Ritualist names in the Ritual community.',
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      {/* Hero Section */}
      <section className="h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">

        {/* Hero Background Component */}
        <HeroBackground />

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

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1, ease: "easeOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-text-secondary z-10"
        >
          <span className="text-xs uppercase tracking-[0.2em] mb-2 font-mono">Scroll for more</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="w-5 h-5 opacity-50" />
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Puzzles Section */}
      <section className="py-24 px-6 border-t border-border bg-bg relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-display tracking-wide uppercase mb-4"
            >
              MAKE YOUR OWN PUZZLE!
            </motion.h2>
            <div className="text-accent font-mono text-lg md:text-xl h-8">
              <Typewriter text="Or try these hand-crafted templates..." delay={40} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {FEATURED_PUZZLES.map((puzzle, i) => (
              <motion.div
                key={puzzle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={`/p/${puzzle.id}`}
                  className="group block border border-border bg-surface rounded-2xl overflow-hidden hover:border-accent transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,255,148,0.1)]"
                >
                  {/* Thumbnail Area */}
                  <div className="aspect-[2/1] bg-bg relative overflow-hidden border-b border-border flex items-center justify-center">
                    {/* Placeholder Logo */}
                    <div className="text-5xl font-display text-border group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-100 group-hover:text-accent">
                      RITUAL
                    </div>

                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-accent/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-3 text-black transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <Play className="w-8 h-8 fill-black" />
                        <span className="font-display text-3xl uppercase tracking-wider mt-1">Play Now</span>
                      </div>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                      <h3 className="font-display text-2xl md:text-3xl uppercase group-hover:text-accent transition-colors">
                        {puzzle.title}
                      </h3>
                      <span className="text-xs font-mono text-text-secondary border border-border px-3 py-1.5 rounded-full whitespace-nowrap">
                        By: {puzzle.author}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                      {puzzle.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
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
