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
            <div className="bg-surface border border-border rounded-2xl shadow-2xl max-w-md w-full p-8">
                {/* Celebration */}
                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">🎉</div>
                    <h2 className="text-2xl font-bold text-text-primary font-display tracking-wide mb-2">PUZZLE COMPLETE!</h2>
                    <p className="text-text-secondary">
                        Your time: <span className="font-mono font-bold text-2xl text-accent">{formatTime(timeSeconds)}</span>
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="playerName" className="block text-sm font-bold text-text-primary font-mono uppercase tracking-wider mb-2">
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
                            className="w-full px-4 py-3 bg-bg border border-border text-text-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent font-sans text-sm placeholder:text-text-secondary"
                        />
                        <p className="text-xs text-text-secondary mt-1 font-mono">Max 30 characters</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={!name.trim() || isSubmitting}
                            className="flex-1 px-6 py-3 bg-accent text-black font-mono text-sm uppercase tracking-wider font-semibold rounded-xl hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Score'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 bg-border text-text-primary font-mono text-sm uppercase tracking-wider font-semibold rounded-xl hover:bg-border/80 transition-all border border-border"
                        >
                            Skip
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
