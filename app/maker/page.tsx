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
    <div className="min-h-screen bg-bg px-6 py-12 flex flex-col">
      <div className="max-w-2xl mx-auto w-full pt-12">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-display tracking-tight uppercase mb-4">CREATE PUZZLE</h1>
          <p className="text-text-secondary font-light">Make your own word search game on any topic you like, simply by providing between 10 and 30 words.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 rounded-xl font-mono text-sm">
            ⚠️ {error}
          </div>
        )}

        <PuzzleForm onSubmit={handleSubmit} isLoading={isLoading} />

        {/* Instructions */}
        <div className="mt-12 bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-xl font-display tracking-wide uppercase mb-4 text-text-primary">
            📋 INSTRUCTIONS
          </h2>
          <ul className="space-y-3 text-text-secondary text-sm">
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>To create a word search puzzle you must supply a word list of at least 10 words.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>The word list should be based on a single theme or topic. For example a television show or a movie you enjoy.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>Words can only contain the letters a-z and a maximum of two spaces or dashes. Spaces and dashes will be removed when words are added to the word search grid.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>Words can have a maximum length of 14 letters.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold flex-shrink-0">•</span>
              <span>All puzzles created will be playable on the site, will be deleted automatically after 60 days of inactivity.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
