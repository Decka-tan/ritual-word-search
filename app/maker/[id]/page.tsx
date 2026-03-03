'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PuzzleForm } from '@/components/puzzle/PuzzleForm';
import { Puzzle, CreatePuzzleInput } from '@/lib/puzzle/types';

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
    if (!confirm('Are you sure you want to delete this puzzle?')) return;

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
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">{error || 'Puzzle not found'}</p>
          <button onClick={() => router.back()}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">EDIT PUZZLE</h1>
            <p className="text-gray-600">{puzzle.title}</p>
          </div>
          <button
            onClick={handleDelete}
            className="px-4 py-2 border-2 border-red-600 text-red-600 hover:bg-red-50"
          >
            Delete
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 border-2 border-red-600 bg-red-50 text-red-900">
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
