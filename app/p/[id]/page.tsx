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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [highlightWords, setHighlightWords] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hasSolvedBefore, setHasSolvedBefore] = useState(false);
  const [leaderboardRefreshKey, setLeaderboardRefreshKey] = useState(0);
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

  // Check solved status separately
  useEffect(() => {
    if (!params.id) return;

    const solvedPuzzles = JSON.parse(localStorage.getItem('solved_puzzles') || '[]');
    setHasSolvedBefore(solvedPuzzles.includes(params.id));
  }, [params.id]);

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
    if (!puzzle) return;

    try {
      // Create canvas with proper dimensions
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Settings
      const cellSize = 40;
      const padding = 40;
      const titleHeight = 80;
      const footerHeight = 60;
      const wordListWidth = 220;
      const gridSize = puzzle.grid.length; // Use actual grid size, not slider value
      const wordSpacing = 22;
      const extraBottomPadding = 40; // Extra space at bottom
      const borderSize = 2; // Outer border size

      // Calculate dimensions (include border in calculation)
      const gridWidth = gridSize * cellSize;
      const gridHeight = gridSize * cellSize;

      // Word list height (dynamic based on word count)
      const words = puzzle.placements.map((p: any) => p.word).sort();
      const wordListHeaderHeight = 25; // Space for "WORDS TO FIND:" title
      const wordListItemsHeight = words.length * wordSpacing;
      const wordListHeight = wordListHeaderHeight + wordListItemsHeight + extraBottomPadding;

      // Total dimensions (use max of grid height and word list height)
      const contentHeight = Math.max(gridHeight, wordListHeight);
      const totalWidth = padding * 3 + gridWidth + wordListWidth + borderSize * 2;
      const totalHeight = padding * 3 + titleHeight + contentHeight + footerHeight + borderSize * 2;

      // Set canvas size (high DPI)
      const scale = 2;
      canvas.width = totalWidth * scale;
      canvas.height = totalHeight * scale;
      ctx.scale(scale, scale);

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, totalWidth, totalHeight);

      // Title
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(puzzle.title, totalWidth / 2, padding + 35);

      // Subtitle (author + description)
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial, sans-serif';
      let subtitle = '';
      if (puzzle.authorName) subtitle = `By ${puzzle.authorName}`;
      if (puzzle.authorName && puzzle.description) subtitle += ' • ';
      if (puzzle.description) subtitle += puzzle.description;
      if (subtitle) {
        ctx.fillText(subtitle, totalWidth / 2, padding + 60);
      }

      // Grid starting position (leave space for borders)
      const gridStartX = padding + borderSize;
      const gridStartY = padding + titleHeight + borderSize;

      // Draw grid background
      ctx.fillStyle = '#f9fafb';
      ctx.fillRect(gridStartX - 5, gridStartY - 5, gridWidth + 10, gridHeight + 10);

      // Draw grid cells
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let row = 0; row < gridSize; row++) {
        for (let col = 0; col < gridSize; col++) {
          const x = gridStartX + col * cellSize + cellSize / 2;
          const y = gridStartY + row * cellSize + cellSize / 2;

          // Cell border
          ctx.strokeStyle = '#d1d5db';
          ctx.lineWidth = 1;
          ctx.strokeRect(
            gridStartX + col * cellSize,
            gridStartY + row * cellSize,
            cellSize,
            cellSize
          );

          // Letter
          ctx.fillStyle = '#111827';
          ctx.font = 'bold 20px Arial, sans-serif';
          ctx.fillText(puzzle.grid[row][col], x, y);
        }
      }

      // Draw outer grid border
      ctx.strokeStyle = '#9ca3af';
      ctx.lineWidth = 2;
      ctx.strokeRect(gridStartX, gridStartY, gridWidth, gridHeight);

      // Word list
      const wordListX = gridStartX + gridWidth + padding * 2;
      const wordListY = gridStartY;

      // Reset text baseline for word list (was 'middle' for grid)
      ctx.textBaseline = 'alphabetic';

      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText('WORDS TO FIND:', wordListX, wordListY);

      ctx.fillStyle = '#374151';
      ctx.font = '13px Arial, sans-serif';

      words.forEach((word, index) => {
        const y = wordListY + wordListHeaderHeight + index * wordSpacing;
        ctx.fillText(`${index + 1}. ${word}`, wordListX, y);
      });

      // Footer with URL
      const footerY = gridStartY + contentHeight + padding;
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'alphabetic';
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
      ctx.fillText(
        `Play this puzzle online at: ${baseUrl}/p/${params.id}`,
        totalWidth / 2,
        footerY + 20
      );

      // Download
      const link = document.createElement('a');
      const safeTitle = puzzle?.title?.replace(/[^a-z0-9]/gi, '_') || 'puzzle';
      link.download = `${safeTitle}_word_search.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export image. Please try again.');
    }
  };

  const handleWordFound = (word: string) => {
    setFoundWords((prev) => {
      const newSet = new Set(prev).add(word);

      // Play sound if enabled
      if (soundEnabled) {
        // Could add sound effect here
        console.log('🔊 Sound played for:', word);
      }

      // Start timer on first word found
      if (prev.size === 0 && newSet.size === 1) {
        setIsRunning(true);
      }

      // Check if complete
      const allWords = puzzle?.placements.map((p) => p.word) || [];
      if (newSet.size === allWords.length) {
        setIsRunning(false);
        setIsComplete(true);

        // Save to localStorage as solved puzzle
        if (params.id) {
          const solvedPuzzles = JSON.parse(localStorage.getItem('solved_puzzles') || '[]');
          if (!solvedPuzzles.includes(params.id)) {
            solvedPuzzles.push(params.id);
            localStorage.setItem('solved_puzzles', JSON.stringify(solvedPuzzles));
            setHasSolvedBefore(true);
          }
        }

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
        setLeaderboardRefreshKey(prev => prev + 1); // Refresh leaderboard
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

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Exit fullscreen on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

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

  // Fullscreen mode - only grid + word list
  if (isFullscreen) {
    const words = puzzle.placements.map((p: any) => p.word).sort();

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col">
        {/* Fullscreen header bar */}
        <div className="shrink-0 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3">
          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <h2 className="text-sm sm:text-base font-bold text-gray-800 dark:text-zinc-100 truncate flex-1">{puzzle.title}</h2>
            <div className="bg-purple-100 dark:bg-purple-900/30 px-2 sm:px-3 py-1 rounded-lg shrink-0">
              <span className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300">{foundWords.size}/{totalWords}</span>
            </div>
          </div>
          <div className="flex gap-1 sm:gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => {
                if (hasSolvedBefore) {
                  setShowSolution(!showSolution);
                } else {
                  alert('⚠️ You need to complete this puzzle first before viewing the solution!');
                }
              }}
              className={`px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm rounded-lg font-medium whitespace-nowrap ${
                hasSolvedBefore
                  ? 'bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300'
                  : 'bg-gray-50 dark:bg-zinc-900 text-gray-400 dark:text-zinc-600 cursor-not-allowed opacity-60'
              }`}
              disabled={!hasSolvedBefore}
            >
              {showSolution ? 'Hide' : 'Show'} Sol
            </button>
            <button
              onClick={handleReset}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-lg font-medium text-gray-700 dark:text-zinc-300 whitespace-nowrap"
            >
              Reset
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg font-medium text-red-700 dark:text-red-300 whitespace-nowrap"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Fullscreen content - grid fills remaining space */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Grid container - fills available space */}
          <div className="flex-1 flex items-center justify-center p-1 sm:p-2 min-h-0">
            <div className="w-full h-full flex items-center justify-center">
              <PuzzleGrid
                grid={puzzle.grid}
                placements={placements}
                showSolution={showSolution}
                onWordFound={handleWordFound}
                onPuzzleComplete={handlePuzzleComplete}
                fullscreen={true}
              />
            </div>
          </div>

          {/* Word list - compact at bottom */}
          <div className="shrink-0 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 p-2 sm:p-3">
            <div className="flex flex-wrap gap-x-2 sm:gap-x-3 gap-y-0.5 sm:gap-y-1 text-[10px] sm:text-xs">
              {words.map((word) => {
                const found = foundWords.has(word);
                return (
                  <span
                    key={word}
                    className={`font-mono ${found
                        ? 'text-green-600 dark:text-green-400 line-through font-semibold'
                        : 'text-gray-700 dark:text-zinc-300'
                    }`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <div ref={puzzleRef} className="max-w-[1400px] mx-auto px-6 lg:px-16 xl:px-20 py-6">
        {/* Header with gradient */}
        <div className="mb-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-5 shadow-xl text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{puzzle.title}</h1>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {puzzle.authorName && (
              <p className="text-purple-100 text-sm">Puzzle made by <span className="font-semibold text-white">{puzzle.authorName}</span></p>
            )}
            {puzzle.authorName && puzzle.description && <span className="text-purple-200">•</span>}
            {puzzle.description && (
              <p className="text-purple-100 text-sm">{puzzle.description}</p>
            )}
          </div>

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
              hasSolvedBefore={hasSolvedBefore}
              soundEnabled={soundEnabled}
              onSoundEnabledChange={setSoundEnabled}
              highlightWords={highlightWords}
              onHighlightWordsChange={setHighlightWords}
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
              onClick={toggleFullscreen}
              className="bg-white/20 hover:bg-white/30 text-white border-none"
            >
              {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
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
          {/* Word List - 3 columns */}
          <div className="order-2 lg:order-1 lg:col-span-3 border-r border-gray-200 dark:border-zinc-800">
            <div className="p-4">
              <WordList
                placements={placements}
                foundWords={foundWords}
                highlightWords={highlightWords}
              />
            </div>
          </div>

          {/* Grid - Center Column - 6 columns */}
          <div className="order-1 lg:order-2 lg:col-span-6 border-r border-gray-200 dark:border-zinc-800">
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

          {/* Leaderboard Sidebar - 3 columns */}
          <div className="order-3 lg:col-span-3">
            <div className="p-4">
              <Leaderboard puzzleId={params.id as string} refreshKey={leaderboardRefreshKey} />
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
