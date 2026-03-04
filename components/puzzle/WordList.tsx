'use client';

import { WordPlacement } from '@/lib/puzzle/types';

interface WordListProps {
    placements: WordPlacement[];
    foundWords?: Set<string>;
    highlightWords?: boolean;
    className?: string;
    compact?: boolean; // New prop for compact mode
}

export function WordList({ placements, foundWords = new Set(), highlightWords = true, className, compact = false }: WordListProps) {
    const words = placements.map((p) => p.word).sort();
    const useDoubleColumn = words.length > 15 && !compact;

    return (
        <div className={className}>
            {!compact && (
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-zinc-300">
                    Words ({foundWords.size}/{words.length})
                </h3>
            )}
            <ul className={useDoubleColumn ? "grid grid-cols-2 gap-x-2 gap-y-2" : "space-y-2"}>
                {words.map((word) => {
                    const found = foundWords.has(word);
                    return (
                        <li
                            key={word}
                            className={`font-mono text-xs py-2 px-3 rounded-lg border-2 transition-all ${
                                found
                                    ? 'border-green-500 bg-green-500/20 text-green-400 line-through'
                                    : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-300'
                            } ${compact ? 'py-1 px-2 text-[11px]' : ''}`}
                        >
                            {word}
                        </li>
                    );
                })}
            </ul>

            {/* Completion message */}
            {foundWords.size === words.length && words.length > 0 && !compact && (
                <div className="mt-4 text-center p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-white">
                    <p className="font-bold text-sm">🎉 All words found!</p>
                </div>
            )}
        </div>
    );
}
