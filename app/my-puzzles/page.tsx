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
    const updated = puzzles.filter((p) => p.id !== id);
    setPuzzles(updated);
    localStorage.setItem('recent_puzzles', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-zinc-300">Loading puzzles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-zinc-100">MY PUZZLES</h1>
            <p className="text-gray-600 dark:text-zinc-400">
              {puzzles.length} {puzzles.length === 1 ? 'puzzle' : 'puzzles'} stored on this device
            </p>
          </div>
          <Button onClick={() => router.push('/maker')}>
            Create New
          </Button>
        </div>

        {puzzles.length === 0 ? (
          <div className="text-center py-16 border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-2xl">
            <p className="text-lg mb-6 text-gray-800 dark:text-zinc-100">No puzzles yet.</p>
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
