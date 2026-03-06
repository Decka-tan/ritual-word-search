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
    if (!puzzle) return;

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
        JSON.stringify(recent.filter((p: any) => p.id !== puzzle.id))
      );

      router.push('/my-puzzles');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-accent border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-mono text-text-secondary uppercase tracking-wider">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center p-8 bg-surface border border-border rounded-2xl shadow-xl max-w-md">
          <p className="text-lg mb-4 text-red-400">{error || 'Puzzle not found'}</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg px-6 py-12 flex flex-col">
      <div className="max-w-2xl mx-auto w-full pt-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display tracking-tight uppercase mb-2">EDIT PUZZLE</h1>
            <p className="text-text-secondary font-mono text-sm uppercase tracking-wider">{puzzle.title}</p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border-2 border-red-500 text-red-400 hover:bg-red-500/20 rounded-xl font-mono text-sm uppercase tracking-wider transition-all"
          >
            Delete
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 border border-red-500/50 bg-red-500/10 text-red-400 rounded-xl font-mono text-sm">
            ⚠️ {error}
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
