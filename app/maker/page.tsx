'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PuzzleForm } from '@/components/puzzle/PuzzleForm';
import { CreatePuzzleInput, Puzzle } from '@/lib/puzzle/types';

export default function MakerPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: CreatePuzzleInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/puzzles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create puzzle');
      }

      const puzzle: Puzzle = await response.json();

      // Save to localStorage
      const recent = JSON.parse(localStorage.getItem('recent_puzzles') || '[]');
      const entry = {
        id: puzzle.id,
        title: puzzle.title,
        playUrl: `/p/${puzzle.id}`,
        editUrl: `/maker/${puzzle.id}?key=${puzzle.editKey}`,
        createdAt: puzzle.createdAt,
      };
      localStorage.setItem(
        'recent_puzzles',
        JSON.stringify([entry, ...recent.filter((p: any) => p.id !== puzzle.id)].slice(0, 20))
      );

      // Redirect to play page
      router.push(`/p/${puzzle.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">CREATE PUZZLE</h1>
          <p className="text-gray-600">Build your custom word search puzzle.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-600 bg-red-50 text-red-900">
            {error}
          </div>
        )}

        <PuzzleForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
