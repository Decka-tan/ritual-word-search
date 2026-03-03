'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PuzzleGrid } from '@/components/puzzle/PuzzleGrid';
import { WordList } from '@/components/puzzle/WordList';
import { Button } from '@/components/ui/Button';
import { PublicPuzzle, WordPlacement } from '@/lib/puzzle/types';

export default function PlayPage() {
  const params = useParams();
  const router = useRouter();
  const [puzzle, setPuzzle] = useState<PublicPuzzle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
  const puzzleRef = useRef<HTMLDivElement>(null);

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

  const handleExportPNG = async () => {
    if (!puzzleRef.current) return;

    const element = puzzleRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Simple canvas export (fallback)
    const dataUrl = element.innerHTML;
    alert('Export feature - html2canvas integration needed');
  };

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => new Set(prev).add(word));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading puzzle...</p>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg mb-4">{error || 'Puzzle not found'}</p>
          <Button onClick={() => router.push('/')}>Back Home</Button>
        </div>
      </div>
    );
  }

  const placements: WordPlacement[] = puzzle.placements as any;

  return (
    <div className="min-h-screen">
      <div ref={puzzleRef} className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8 border-b-2 border-black pb-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{puzzle.title}</h1>
          {puzzle.description && (
            <p className="text-gray-700 mb-4">{puzzle.description}</p>
          )}
          <div className="flex flex-wrap gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowSolution(!showSolution)}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
            <Button variant="ghost" onClick={handleExportPNG}>
              Export PNG
            </Button>
            <Button variant="secondary" onClick={() => router.push('/maker')}>
              Create Your Own
            </Button>
          </div>
        </div>

        {/* Puzzle */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Grid */}
          <div className="lg:col-span-2">
            <PuzzleGrid
              grid={puzzle.grid}
              placements={placements}
              showSolution={showSolution}
              onWordFound={handleWordFound}
            />
          </div>

          {/* Word List */}
          <div className="lg:col-span-1">
            <WordList
              placements={placements}
              foundWords={foundWords}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
