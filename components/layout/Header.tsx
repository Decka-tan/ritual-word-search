'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between mix-blend-difference">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-8 h-8 relative flex items-center justify-center overflow-hidden">
                    <Image
                        src="/logo.jpg"
                        alt="Ritual"
                        width={32}
                        height={32}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                </div>
                <span className="font-display text-xl tracking-widest uppercase">Ritual</span>
            </Link>

            <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest">
                <Link href="/maker" className="hover:text-accent transition-colors">Create</Link>
                <Link href="/my-puzzles" className="hover:text-accent transition-colors">My Puzzles</Link>
                <a href="https://github.com/Decka-tan/ritual-word-search" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>
            </nav>

            {/* Mobile menu button could go here */}
        </header>
    );
}
