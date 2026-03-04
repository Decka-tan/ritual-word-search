'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to apply theme
function applyTheme(theme: Theme) {
    if (typeof window === 'undefined') return;

    const html = document.documentElement;
    const body = document.body;

    // For Tailwind dark mode: only add 'dark' class for dark mode
    if (theme === 'dark') {
        html.classList.add('dark');
        body.classList.add('dark');
    } else {
        html.classList.remove('dark');
        body.classList.remove('dark');
    }

    // Note: CSS variables in globals.css handle the actual colors
    // No need for inline styles here
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize theme from localStorage or default to 'dark'
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme | null;
            const initialTheme = savedTheme || 'dark';
            // Apply immediately on mount
            applyTheme(initialTheme);
            return initialTheme;
        }
        return 'dark';
    });

    useEffect(() => {
        // Apply theme whenever it changes
        applyTheme(theme);
        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
