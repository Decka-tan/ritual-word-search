'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PuzzleForm } from '@/components/puzzle/PuzzleForm';
import { Puzzle, CreatePuzzleInput } from '@/lib/puzzle/types';
import { Button } from '@/components/ui/Button';

export default function EditPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchPuzzle = async () => {
      try {
        const response = await fetch(`/api/puzzles/${params.id}`);
        if (!response.ok) {
          throw new Error('Puzzle not found');
        }
        const data = await response.json();
        setPuzzle(data.puzzle);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load puzzle');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPuzzle();
    }
  }, [params.id]);

  const handleUpdate = async (data: CreatePuzzleInput) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/puzzles/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          editKey: searchParams.get('key'),
          regenerate: true,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update puzzle');
      }

      router.push(`/p/${params.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${puzzle?.title || 'this puzzle'}"? This action cannot be undone.`)) return;

    try {
      const response = await fetch(`/api/puzzles/${params.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editKey: searchParams.get('key') }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete puzzle');
      }

      // Remove from localStorage
      const recent = JSON.parse(localStorage.getItem('recent_puzzles') || '[]');
      localStorage.setItem(
        'recent_puzzles',
        JSON.stringify(recent.filter((p: any) => p.id !== params.id))
      );

      router.push('/my-puzzles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-zinc-300">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="text-center p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-xl max-w-md">
          <p className="text-lg mb-4 text-red-600 dark:text-red-400">{error || 'Puzzle not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-zinc-100">EDIT PUZZLE</h1>
            <p className="text-gray-600 dark:text-zinc-400">{puzzle.title}</p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border-2 border-red-600 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-semibold transition-all"
          >
            Delete
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-500 bg-red-50 dark:bg-red-900/20 text-red-900 dark:text-red-400 rounded-xl">
            {error}
          </div>
        )}

        <PuzzleForm
          onSubmit={handleUpdate}
          isLoading={isSubmitting}
          defaultValues={{
            title: puzzle.title,
            description: puzzle.description || undefined,
            words: puzzle.words,
            options: {
              size: puzzle.size,
              allowDiagonal: puzzle.allowDiagonal,
              allowBackward: puzzle.allowBackward,
            },
          }}
          submitLabel="Update Puzzle"
        />
      </div>
    </div>
  );
}
