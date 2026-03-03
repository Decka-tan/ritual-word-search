'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PuzzleGrid } from '@/components/puzzle/PuzzleGrid';
import { WordList } from '@/components/puzzle/WordList';
import { NameInputModal } from '@/components/puzzle/NameInputModal';
import { Leaderboard } from '@/components/puzzle/Leaderboard';
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
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const puzzleRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer effect
  useEffect(() => {
    if (isRunning && !isComplete) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isComplete]);

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

  const handleExportPNG = () => {
    alert('Export feature - html2canvas integration coming soon!');
  };

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => {
      const newSet = new Set(prev).add(word);

      // Start timer on first word found
      if (prev.size === 0 && newSet.size === 1) {
        setIsRunning(true);
      }

      // Check if complete
      const allWords = puzzle?.placements.map((p) => p.word) || [];
      if (newSet.size === allWords.length) {
        setIsRunning(false);
        setIsComplete(true);
        // Show name input modal
        setTimeout(() => setShowNameInput(true), 500);
      }

      return newSet;
    });
  };

  const handlePuzzleComplete = () => {
    setIsComplete(true);
  };

  const handleSubmitScore = async (playerName: string) => {
    try {
      const response = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          puzzleId: params.id,
          playerName,
          timeSeconds: timer,
        }),
      });

      if (response.ok) {
        setScoreSubmitted(true);
      }
    } catch (err) {
      console.error('Failed to submit score:', err);
    }

    setShowNameInput(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalWords = puzzle?.placements.length || 0;
  const progress = (foundWords.size / totalWords) * 100;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-gray-700">Loading puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !puzzle) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md">
          <p className="text-lg mb-4 text-red-600">{error || 'Puzzle not found'}</p>
          <Button onClick={() => router.push('/')}>Back Home</Button>
        </div>
      </div>
    );
  }

  const placements: WordPlacement[] = puzzle.placements as any;

  return (
    <div className="min-h-screen">
      <div ref={puzzleRef} className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with gradient */}
        <div className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-6 shadow-xl text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{puzzle.title}</h1>
          {puzzle.description && (
            <p className="text-purple-100 mb-4">{puzzle.description}</p>
          )}

          {/* Stats */}
          <div className="flex flex-wrap items-center gap-6">
            {/* Timer */}
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2">
              <span className="text-sm font-medium">Time: </span>
              <span className="text-2xl font-bold font-mono">{formatTime(timer)}</span>
            </div>

            {/* Progress */}
            <div className="bg-white/20 backdrop-blur rounded-xl px-4 py-2 flex-1 min-w-[200px]">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span className="font-bold">{foundWords.size}/{totalWords}</span>
              </div>
              <div className="bg-white/30 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-white h-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Completion Badge */}
            {isComplete && (
              <div className="bg-green-500 rounded-xl px-4 py-2 animate-pulse">
                <span className="font-bold">🎉 Complete!</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-4">
            <Button
              variant="ghost"
              onClick={() => setShowSolution(!showSolution)}
              disabled={!isComplete}
              className={!isComplete ? 'opacity-50 cursor-not-allowed' : 'bg-white/20 hover:bg-white/30 text-white border-none'}
            >
              {showSolution ? 'Hide Solution' : 'Show Solution'}
            </Button>
            <Button variant="ghost" onClick={handleExportPNG} className="bg-white/20 hover:bg-white/30 text-white border-none">
              Export PNG
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/maker')}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              Create Your Own
            </Button>
          </div>
        </div>

        {/* Puzzle + Leaderboard */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Grid + Word List */}
          <div className="lg:col-span-3 space-y-6">
            {/* Grid */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <PuzzleGrid
                grid={puzzle.grid}
                placements={placements}
                showSolution={showSolution}
                onWordFound={handleWordFound}
                onPuzzleComplete={handlePuzzleComplete}
              />
            </div>

            {/* Word List */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <WordList
                placements={placements}
                foundWords={foundWords}
              />
            </div>
          </div>

          {/* Leaderboard Sidebar */}
          <div className="lg:col-span-1">
            <Leaderboard puzzleId={params.id as string} />
          </div>
        </div>
      </div>

      {/* Name Input Modal */}
      <NameInputModal
        isOpen={showNameInput}
        timeSeconds={timer}
        onSubmit={handleSubmitScore}
        onClose={() => setShowNameInput(false)}
      />
    </div>
  );
}
