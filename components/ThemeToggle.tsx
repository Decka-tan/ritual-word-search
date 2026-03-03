'use client';

import { useTheme } from './ThemeContext';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 dark:bg-zinc-800 light:bg-gray-100 hover:bg-zinc-700 dark:hover:bg-zinc-700 light:hover:bg-gray-200 border border-zinc-700 dark:border-zinc-700 light:border-gray-300 rounded-xl text-zinc-300 dark:text-zinc-300 light:text-gray-700 font-semibold transition-all"
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
