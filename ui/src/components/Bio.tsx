import React from 'react';
import { motion } from 'motion/react';
import { Github, Twitter } from 'lucide-react';

export default function Bio() {
  return (
    <section className="py-24 px-6 border-t border-border mt-24">
      <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="w-48 h-48 shrink-0 rounded-2xl overflow-hidden border border-border relative group"
        >
          <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 mix-blend-overlay" />
          <img 
            src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=400&auto=format&fit=crop" 
            alt="Decka-tan" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-display tracking-wide uppercase mb-2"
          >
            Decka-tan
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-accent font-mono text-sm mb-4 tracking-widest uppercase"
          >
            Creator & Designer
          </motion.p>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-text-secondary leading-relaxed mb-6 max-w-md"
          >
            Cute anime girl on Ritual. Ritty on Ritual Discord. Passionate about graphic design, lettering, and vibe coding.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <a href="https://github.com/Decka-tan" target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border border-border hover:border-accent hover:text-accent transition-colors duration-300">
              <Github size={20} />
            </a>
            <a href="#" className="p-3 rounded-full border border-border hover:border-accent hover:text-accent transition-colors duration-300">
              <Twitter size={20} />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
