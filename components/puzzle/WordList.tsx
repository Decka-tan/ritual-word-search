'use client';

import { useState } from 'react';
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
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 border-b-2 border-black pb-2">
                Words to Find ({foundWords.size}/{words.length})
            </h3>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {words.map((word) => {
                    const found = foundWords.has(word);
                    return (
                        <li
                            key={word}
                            className={`font-mono text-sm py-1 px-2 border-2 ${
                                found
                                    ? 'border-black bg-black text-white line-through'
                                    : 'border-gray-300 bg-white'
                            }`}
                        >
                            {word}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
