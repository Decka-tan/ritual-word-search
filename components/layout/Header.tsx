'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex items-center justify-between bg-gradient-to-b from-bg via-bg/80 to-transparent backdrop-blur-md">
            <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Image
                        src="/ritual-logo.png"
                        alt="Ritual Word Search"
                        width={40}
                        height={40}
                        className="object-contain"
                    />
                </div>
                <span className="font-display text-xl tracking-widest uppercase text-text-primary">Ritual</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-text-primary">
                <Link href="/maker" className="hover:text-accent transition-colors">Create</Link>
                <Link href="/my-puzzles" className="hover:text-accent transition-colors">My Puzzles</Link>
                <a href="https://github.com/Decka-tan/ritual-word-search" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">GitHub</a>

                {mounted && (
                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="hover:text-accent transition-colors font-semibold"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? 'DARK MODE' : 'LIGHT MODE'}
                    </button>
                )}
            </nav>

            {/* Mobile Menu Button */}
            <button
                className="md:hidden text-text-primary p-2"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    {mobileMenuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                </svg>
            </button>

            {/* Mobile Menu Sidebar */}
            {mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />

                    {/* Sidebar */}
                    <div className="absolute right-6 top-20 w-64 bg-surface border border-border rounded-2xl z-50 md:hidden shadow-2xl">
                        {/* Navigation Links */}
                        <nav className="p-4 space-y-2">
                            <Link
                                href="/maker"
                                className="block font-mono text-xs uppercase tracking-wider text-text-primary hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-surface"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Create
                            </Link>
                            <Link
                                href="/my-puzzles"
                                className="block font-mono text-xs uppercase tracking-wider text-text-primary hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-surface"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                My Puzzles
                            </Link>
                            <a
                                href="https://github.com/Decka-tan/ritual-word-search"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block font-mono text-xs uppercase tracking-wider text-text-primary hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-surface"
                            >
                                GitHub
                            </a>

                            {/* Theme Toggle */}
                            {mounted && (
                                <div className="pt-2 border-t border-border">
                                    <button
                                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                        className="w-full font-mono text-xs uppercase tracking-wider text-text-primary hover:text-accent transition-colors py-2 px-3 rounded-lg hover:bg-surface text-left"
                                    >
                                        {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
                                    </button>
                                </div>
                            )}
                        </nav>
                    </div>
                </>
            )}
        </header>
    );
}
