'use client';

import { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';

interface GameSettingsProps {
    onShowSolutionChange: (show: boolean) => void;
    showSolution: boolean;
    onReset: () => void;
    isComplete: boolean;
}

export function GameSettings({ onShowSolutionChange, showSolution, onReset, isComplete }: GameSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-300 font-semibold transition-all"
            >
                <span>⚙️</span>
                <span>Settings</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Settings Panel */}
                    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 p-5">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100">Game Settings</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 dark:text-zinc-400 hover:text-gray-200 dark:hover:text-zinc-200 text-2xl leading-none transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-2">
                            {/* Show Solution Toggle */}
                            <Toggle
                                checked={showSolution}
                                onChange={onShowSolutionChange}
                                disabled={!isComplete}
                                label="Show Solution"
                            />

                            {/* Sound Effects - Cosmetic (Disabled) */}
                            <Toggle
                                checked={false}
                                onChange={() => {}}
                                disabled
                                label="Sound Effects"
                            />

                            {/* Highlight Words - Cosmetic (Always On) */}
                            <Toggle
                                checked
                                onChange={() => {}}
                                disabled
                                label="Highlight Words"
                            />
                        </div>

                        <hr className="border-gray-200 dark:border-zinc-700 my-4" />

                        {/* Reset Game - FUNCTIONAL */}
                        <button
                            onClick={() => {
                                onReset();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            <span>Reset Game</span>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
