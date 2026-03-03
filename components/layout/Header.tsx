'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ThemeToggle } from '@/components/ThemeToggle';

export function Header() {
    return (
        <header className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            Ritual Word Search
                        </h1>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex gap-3 items-center">
                        <ThemeToggle />
                        <Link href="/maker">
                            <Button variant="primary" size="sm">
                                Create
                            </Button>
                        </Link>
                        <Link href="/my-puzzles">
                            <Button variant="secondary" size="sm">
                                My Puzzles
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    );
}
