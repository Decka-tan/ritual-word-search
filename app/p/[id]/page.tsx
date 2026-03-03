'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PuzzleGrid } from '@/components/puzzle/PuzzleGrid';
import { WordList } from '@/components/puzzle/WordList';
import { NameInputModal } from '@/components/puzzle/NameInputModal';
import { Leaderboard } from '@/components/puzzle/Leaderboard';
import { GameSettings } from '@/components/puzzle/GameSettings';
import { ShareButtons } from '@/components/puzzle/ShareButtons';
import { Footer } from '@/components/puzzle/Footer';
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

  const handleReset = () => {
    setFoundWords(new Set());
    setTimer(0);
    setIsRunning(false);
    setIsComplete(false);
    setShowSolution(false);
    setScoreSubmitted(false);
  };

  const handleSubmitScore = async (playerName: string) => {
    console.log('🎯 Submitting score:', { puzzleId: params.id, playerName, timeSeconds: timer });

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

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Score submitted successfully:', data);
        setScoreSubmitted(true);
        alert(`Score submitted! Time: ${formatTime(timer)}`);
      } else {
        const error = await response.json();
        console.error('❌ Submit failed:', error);
        alert(`Failed to submit score: ${error.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('❌ Network error:', err);
      alert(`Error submitting score: ${err instanceof Error ? err.message : 'Network error'}`);
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
          <Button onClick={() => router.push('/')}>Back Home</Button>
        </div>
      </div>
    );
  }

  const placements: WordPlacement[] = puzzle.placements as any;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div ref={puzzleRef} className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Header with gradient */}
        <div className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 shadow-xl text-white">
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
          <div className="flex flex-wrap gap-3 mt-4 items-center">
            <GameSettings
              onShowSolutionChange={setShowSolution}
              showSolution={showSolution}
              onReset={handleReset}
              isComplete={isComplete}
            />
            <ShareButtons
              puzzleId={params.id as string}
              puzzleTitle={puzzle.title}
              timeSeconds={timer}
              isComplete={isComplete}
            />
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

        {/* Puzzle + Leaderboard - 3 Column Layout - SEAMLESS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden">
          {/* Word List - 2 columns */}
          <div className="order-2 lg:order-1 lg:col-span-2 border-r border-gray-200 dark:border-zinc-800">
            <div className="p-4">
              <WordList
                placements={placements}
                foundWords={foundWords}
              />
            </div>
          </div>

          {/* Grid - Center Column - 8 columns */}
          <div className="order-1 lg:order-2 lg:col-span-8 border-r border-gray-200 dark:border-zinc-800">
            <div className="p-6">
              <PuzzleGrid
                grid={puzzle.grid}
                placements={placements}
                showSolution={showSolution}
                onWordFound={handleWordFound}
                onPuzzleComplete={handlePuzzleComplete}
              />
            </div>
          </div>

          {/* Leaderboard Sidebar - 2 columns */}
          <div className="order-3 lg:col-span-2">
            <div className="p-4">
              <Leaderboard puzzleId={params.id as string} />
            </div>
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

      {/* Footer */}
      <Footer />
    </div>
  );
}
