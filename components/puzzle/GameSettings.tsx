'use client';

import { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';

interface GameSettingsProps {
    onShowSolutionChange: (show: boolean) => void;
    showSolution: boolean;
    onReset: () => void;
    isComplete: boolean;
    hasSolvedBefore?: boolean; // New prop
    soundEnabled: boolean;
    onSoundEnabledChange: (enabled: boolean) => void;
    highlightWords: boolean;
    onHighlightWordsChange: (highlight: boolean) => void;
}

export function GameSettings({
    onShowSolutionChange,
    showSolution,
    onReset,
    isComplete,
    hasSolvedBefore = false,
    soundEnabled,
    onSoundEnabledChange,
    highlightWords,
    onHighlightWordsChange,
}: GameSettingsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const canShowSolution = isComplete || hasSolvedBefore;

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-300 font-semibold transition-all"
            >
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
                    <div className="fixed left-4 right-4 top-28 sm:absolute sm:left-auto sm:right-0 sm:w-80 sm:top-full mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 p-5 max-h-[60vh] sm:max-h-[80vh] overflow-y-auto">
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
                            <div>
                                <Toggle
                                    checked={showSolution}
                                    onChange={(checked) => {
                                        if (canShowSolution) {
                                            onShowSolutionChange(checked);
                                        } else {
                                            alert('⚠️ You need to complete this puzzle first before viewing the solution!');
                                        }
                                    }}
                                    disabled={!canShowSolution}
                                    label="Show Solution"
                                />
                                {!canShowSolution && (
                                    <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                                        Complete this puzzle to unlock the solution
                                    </p>
                                )}
                            </div>

                            {/* Sound Effects */}
                            <Toggle
                                checked={soundEnabled}
                                onChange={onSoundEnabledChange}
                                label="Sound Effects"
                            />

                            {/* Highlight Words */}
                            <Toggle
                                checked={highlightWords}
                                onChange={onHighlightWordsChange}
                                label="Highlight Words"
                            />
                        </div>

                        <hr className="border-gray-200 dark:border-zinc-700 my-4" />

                        {/* Reset Game */}
                        <button
                            onClick={() => {
                                onReset();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all"
                        >
                            Reset Game
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
