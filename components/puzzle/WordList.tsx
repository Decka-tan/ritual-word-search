'use client';

import { WordPlacement } from '@/lib/puzzle/types';

interface WordListProps {
    placements: WordPlacement[];
    foundWords?: Set<string>;
    className?: string;
}

export function WordList({ placements, foundWords = new Set(), className }: WordListProps) {
    const words = placements.map((p) => p.word).sort();

    return (
        <div className={className}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 pb-2 border-b-2 border-zinc-700 text-zinc-300">
                Words to Find ({foundWords.size}/{words.length})
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                {words.map((word) => {
                    const found = foundWords.has(word);
                    return (
                        <li
                            key={word}
                            className={`font-mono text-sm py-2 px-3 rounded-lg border-2 transition-all ${
                                found
                                    ? 'border-green-500 bg-green-500/20 text-green-400 line-through'
                                    : 'border-zinc-700 bg-zinc-800 text-zinc-300'
                            }`}
                        >
                            {word}
                        </li>
                    );
                })}
            </ul>

            {/* Completion message */}
            {foundWords.size === words.length && words.length > 0 && (
                <div className="mt-6 text-center p-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-white">
                    <p className="font-bold text-lg">🎉 All words found!</p>
                </div>
            )}
        </div>
    );
}
