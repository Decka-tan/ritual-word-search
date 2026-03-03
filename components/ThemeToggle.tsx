'use client';

import { useTheme } from './ThemeContext';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-300 font-semibold">
                <span className="text-lg">...</span>
            </div>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-300 font-semibold transition-all"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <>
                    <span className="text-lg">🌙</span>
                    <span className="hidden sm:inline">Dark</span>
                </>
            ) : (
                <>
                    <span className="text-lg">☀️</span>
                    <span className="hidden sm:inline">Light</span>
                </>
            )}
        </button>
    );
}
