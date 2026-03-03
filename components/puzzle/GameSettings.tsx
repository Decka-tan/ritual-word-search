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

    return (
        <div className="relative">
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-zinc-300 font-semibold transition-all"
            >
                <span className="text-lg">⚙️</span>
                <span>Settings</span>
            </button>

            {/* Settings Dropdown */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl z-50 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-zinc-100">Game Settings</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-zinc-400 hover:text-zinc-200 text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Show Solution Toggle */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-zinc-300">Show Solution</span>
                            <button
                                onClick={() => onShowSolutionChange(!showSolution)}
                                disabled={!isComplete}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-200 ${
                                    !isComplete ? 'opacity-50 cursor-not-allowed' : ''
                                } ${showSolution ? 'bg-purple-600' : 'bg-zinc-700'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                        showSolution ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
                        </div>

                        {/* Sound Toggle (placeholder) */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-zinc-300">Sound Effects</span>
                            <button
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 transition-all duration-200"
                            >
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 translate-x-1" />
                            </button>
                        </div>

                        {/* Highlight Words Toggle (placeholder) */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-zinc-300">Highlight Words</span>
                            <button
                                className="relative inline-flex h-6 w-11 items-center rounded-full bg-purple-600 transition-all duration-200"
                            >
                                <span className="inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 translate-x-6" />
                            </button>
                        </div>

                        <hr className="border-zinc-700" />

                        {/* Reset Game */}
                        <button
                            onClick={() => {
                                onReset();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
                        >
                            🔄 Reset Game
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
