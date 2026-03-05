'use client';

import { useState } from 'react';
import { Toggle } from '@/components/ui/Toggle';

interface GameSettingsProps {
    onShowSolutionChange: (show: boolean) => void;
    showSolution: boolean;
    onReset: () => void;
    isComplete: boolean;
    hasSolvedBefore?: boolean;
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
                className="flex items-center gap-2 px-4 py-2 bg-surface hover:bg-border border border-border rounded-xl text-text-primary font-mono text-sm uppercase tracking-wider transition-all"
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
                    <div className="fixed left-4 right-4 top-28 sm:fixed sm:left-1/2 sm:-translate-x-1/2 sm:top-auto sm:mt-2 sm:w-80 bg-bg border border-border rounded-2xl shadow-2xl z-50 p-5 max-h-[60vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-text-primary font-display tracking-wide">GAME SETTINGS</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-text-secondary hover:text-text-primary text-2xl leading-none transition-colors"
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
                                    <p className="mt-1 text-xs text-accent">
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

                        <hr className="border-border my-4" />

                        {/* Reset Game */}
                        <button
                            onClick={() => {
                                onReset();
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white font-mono text-sm uppercase tracking-wider rounded-xl transition-all"
                        >
                            Reset Game
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
