'use client';

import { Button } from '@/components/ui/Button';
import { RecentPuzzle } from '@/lib/puzzle/types';

interface PuzzleCardProps {
    puzzle: RecentPuzzle;
    onPlay: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function PuzzleCard({ puzzle, onPlay, onEdit, onDelete }: PuzzleCardProps) {
    const date = new Date(puzzle.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-4">
            <h3 className="font-bold text-lg mb-1 text-gray-800 dark:text-zinc-100">{puzzle.title}</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400 mb-4 font-mono">{date}</p>

            <div className="flex gap-2">
                <Button
                    variant="primary"
                    size="sm"
                    onClick={onPlay}
                    className="flex-1"
                >
                    Play
                </Button>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={onEdit}
                    className="flex-1"
                >
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onDelete}
                    className="px-3"
                >
                    ×
                </Button>
            </div>
        </div>
    );
}
