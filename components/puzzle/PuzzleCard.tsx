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
        <div className="border border-border bg-surface p-4 rounded-xl hover:border-accent/50 transition-all group">
            <h3 className="font-semibold text-base mb-1 text-text-primary">{puzzle.title}</h3>
            <p className="text-sm text-text-secondary mb-4 font-mono uppercase tracking-wider">{date}</p>

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
