'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PuzzleCard } from '@/components/puzzle/PuzzleCard';
import { Button } from '@/components/ui/Button';
import { RecentPuzzle } from '@/lib/puzzle/types';

export default function MyPuzzlesPage() {
  const router = useRouter();
  const [puzzles, setPuzzles] = useState<RecentPuzzle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage
    try {
      const recent = JSON.parse(localStorage.getItem('recent_puzzles') || '[]');
      setPuzzles(recent);
    } catch (err) {
      console.error('Failed to load recent puzzles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = (id: string) => {
    const puzzle = puzzles.find((p) => p.id === id);
    const puzzleTitle = puzzle?.title || 'this puzzle';

    if (confirm(`Are you sure you want to delete "${puzzleTitle}"? This action cannot be undone.`)) {
      const updated = puzzles.filter((p) => p.id !== id);
      setPuzzles(updated);
      localStorage.setItem('recent_puzzles', JSON.stringify(updated));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-mono text-text-secondary uppercase tracking-wider">Loading puzzles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-12 flex flex-col">
      <div className="max-w-4xl mx-auto w-full pt-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl sm:text-5xl font-display tracking-tight uppercase mb-2">MY PUZZLES</h1>
            <p className="text-text-secondary font-mono text-sm uppercase tracking-wider">
              {puzzles.length} {puzzles.length === 1 ? 'puzzle' : 'puzzles'} stored on this device
            </p>
          </div>
          <Button onClick={() => router.push('/maker')} size="sm">
            Create New
          </Button>
        </div>

        {puzzles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 border border-border bg-surface rounded-2xl">
            <p className="text-lg mb-6 text-text-primary font-display tracking-wide text-center">No puzzles yet.</p>
            <Button onClick={() => router.push('/maker')}>
              Create Your First Puzzle
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {puzzles.map((puzzle) => (
              <PuzzleCard
                key={puzzle.id}
                puzzle={puzzle}
                onPlay={() => router.push(puzzle.playUrl)}
                onEdit={() => router.push(puzzle.editUrl)}
                onDelete={() => handleDelete(puzzle.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
