'use client';

import { useState } from 'react';

interface GameSettingsProps {
    onShowSolutionChange: (show: boolean) => void;
    showSolution: boolean;
    onReset: () => void;
    isComplete: boolean;
}

export function GameSettings({ onShowSolutionChange, showSolution, onReset, isComplete }: GameSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [highlightEnabled, setHighlightEnabled] = useState(true);
    const [timerEnabled, setTimerEnabled] = useState(true);
    const [autoSave, setAutoSave] = useState(true);

    return (
        <div className="relative">
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-300 font-semibold transition-all"
            >
                <span className="text-lg">⚙️</span>
                <span>Settings</span>
            </button>

            {/* Settings Dropdown */}
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

                        <div className="space-y-4">
                            {/* Show Solution Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">👁️</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Show Solution</span>
                                </div>
                                <button
                                    onClick={() => onShowSolutionChange(!showSolution)}
                                    disabled={!isComplete}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                                        !isComplete ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${showSolution ? 'bg-purple-600' : 'bg-gray-300 dark:bg-zinc-700'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                            showSolution ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Sound Effects Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">🔊</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Sound Effects</span>
                                </div>
                                <button
                                    onClick={() => setSoundEnabled(!soundEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                                        soundEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-zinc-700'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                            soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Highlight Found Words Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">✨</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Highlight Words</span>
                                </div>
                                <button
                                    onClick={() => setHighlightEnabled(!highlightEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                                        highlightEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-zinc-700'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                            highlightEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Timer Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">⏱️</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Show Timer</span>
                                </div>
                                <button
                                    onClick={() => setTimerEnabled(!timerEnabled)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                                        timerEnabled ? 'bg-purple-600' : 'bg-gray-300 dark:bg-zinc-700'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                            timerEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            {/* Auto-Save Progress Toggle */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">💾</span>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300">Auto-Save Progress</span>
                                </div>
                                <button
                                    onClick={() => setAutoSave(!autoSave)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                                        autoSave ? 'bg-purple-600' : 'bg-gray-300 dark:bg-zinc-700'
                                    }`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                            autoSave ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                    />
                                </button>
                            </div>

                            <hr className="border-gray-200 dark:border-zinc-700" />

                            {/* Reset Game */}
                            <button
                                onClick={() => {
                                    onReset();
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <span>🔄</span>
                                <span>Reset Game</span>
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
