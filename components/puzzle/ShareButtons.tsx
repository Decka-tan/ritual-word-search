'use client';

import { useState } from 'react';

interface ShareButtonsProps {
    puzzleId: string;
    puzzleTitle: string;
    timeSeconds?: number;
    isComplete?: boolean;
}

export function ShareButtons({ puzzleId, puzzleTitle, timeSeconds, isComplete }: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const puzzleUrl = typeof window !== 'undefined' ? window.location.href : '';

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const shareText = isComplete
        ? `🎉 I just completed "${puzzleTitle}" in ${formatTime(timeSeconds || 0)}! Can you beat my time?`
        : `🔍 Try "${puzzleTitle}" - a word search puzzle!`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(puzzleUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleShareToTwitter = () => {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(puzzleUrl)}`;
        window.open(twitterUrl, '_blank', 'width=550,height=420');
    };

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: puzzleTitle,
                    text: shareText,
                    url: puzzleUrl,
                });
            } catch (err) {
                console.error('Error sharing:', err);
            }
        }
    };

    const supportsNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-xl text-gray-700 dark:text-zinc-300 font-semibold transition-all"
            >
                <span className="text-lg">📤</span>
                <span>Share</span>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Share Panel */}
                    <div className="fixed left-4 right-4 top-28 sm:fixed sm:left-1/2 sm:-translate-x-1/2 sm:top-auto sm:mt-2 sm:w-80 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-2xl shadow-2xl z-50 p-5">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-zinc-100">Share Puzzle</h3>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 dark:text-zinc-400 hover:text-gray-200 dark:hover:text-zinc-200 text-2xl leading-none transition-colors"
                            >
                                ×
                            </button>
                        </div>

                        <div className="space-y-3">
                            {/* Twitter Share */}
                            <button
                                onClick={handleShareToTwitter}
                                className="w-full px-4 py-3 bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                <span>Share on X / Twitter</span>
                            </button>

                            {/* Copy Link */}
                            <button
                                onClick={handleCopyLink}
                                className="w-full px-4 py-3 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 text-gray-800 dark:text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
                            >
                                <span className="text-lg">🔗</span>
                                <span>{copied ? '✓ Copied!' : 'Copy Link'}</span>
                            </button>

                            {/* Native Share (mobile) */}
                            {supportsNativeShare && (
                                <button
                                    onClick={handleNativeShare}
                                    className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-3"
                                >
                                    <span className="text-lg">📱</span>
                                    <span>Share...</span>
                                </button>
                            )}

                            {/* Preview */}
                            <div className="mt-4 p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700">
                                <p className="text-xs text-gray-500 dark:text-zinc-400 mb-2 font-semibold">Preview:</p>
                                <p className="text-sm text-gray-800 dark:text-zinc-300 line-clamp-2">{shareText}</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-500 mt-2 truncate">{puzzleUrl}</p>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
