'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Initialize theme from localStorage or default to 'dark'
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme') as Theme | null;
            return savedTheme || 'dark';
        }
        return 'dark';
    });

    useEffect(() => {
        const html = document.documentElement;
        const body = document.body;

        // Remove both classes first
        html.classList.remove('dark', 'light');
        body.classList.remove('dark', 'light');

        // Add current theme class
        html.classList.add(theme);
        body.classList.add(theme);

        // Apply styles to body
        if (theme === 'dark') {
            body.style.backgroundColor = '#000000';
            body.style.color = '#ffffff';
        } else {
            body.style.backgroundColor = '#ffffff';
            body.style.color = '#1e293b';
        }

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
