'use client';

import { useState } from 'react';

interface NameInputModalProps {
    isOpen: boolean;
    timeSeconds: number;
    onSubmit: (name: string) => void;
    onClose: () => void;
}

export function NameInputModal({ isOpen, timeSeconds, onSubmit, onClose }: NameInputModalProps) {
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!isOpen) return null;

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        onSubmit(name.trim());
        setName('');
        setIsSubmitting(false);
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Celebration */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-zinc-100 mb-2">Puzzle Complete!</h2>
                    <p className="text-zinc-400">
                        Your time: <span className="font-mono font-bold text-2xl text-purple-400">{formatTime(timeSeconds)}</span>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="playerName" className="block text-sm font-bold text-zinc-300 mb-2">
                            Enter your name for the leaderboard:
                        </label>
                        <input
                            id="playerName"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your name..."
                            maxLength={30}
                            required
                            autoFocus
                            className="w-full px-4 py-3 bg-zinc-800 border-2 border-zinc-700 text-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-sans text-sm placeholder:text-zinc-500"
                        />
                        <p className="text-xs text-zinc-500 mt-1">Max 30 characters</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={!name.trim() || isSubmitting}
                            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Score'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-zinc-800 text-zinc-300 font-semibold rounded-xl hover:bg-zinc-700 transition-all border border-zinc-700"
                        >
                            Skip
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
