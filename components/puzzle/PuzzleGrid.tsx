'use client';

import { useState, useCallback, useEffect } from 'react';
import { WordPlacement } from '@/lib/puzzle/types';

interface PuzzleGridProps {
    grid: string[][];
    placements: WordPlacement[];
    showSolution?: boolean;
    onWordFound?: (word: string) => void;
    onPuzzleComplete?: () => void;
    className?: string;
}

const WORD_COLORS = [
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

export function PuzzleGrid({
    grid,
    placements,
    showSolution = false,
    onWordFound,
    onPuzzleComplete,
    className,
}: PuzzleGridProps) {
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [foundWordColors, setFoundWordColors] = useState<Map<string, string>>(new Map());

    const [dragStart, setDragStart] = useState<{row: number; col: number} | null>(null);
    const [dragEnd, setDragEnd] = useState<{row: number; col: number} | null>(null);
    const [isDragging, setIsDragging] = useState(false);

    // Get cells between two points (simple line interpolation)
    const getCellsBetween = useCallback((start: {row: number; col: number}, end: {row: number; col: number}): string[] => {
        const cells: string[] = [];
        const rowDiff = end.row - start.row;
        const colDiff = end.col - start.col;
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

        if (steps === 0) {
            return [`${start.row}-${start.col}`];
        }

        // Calculate step for each axis
        const rowStep = rowDiff / steps;
        const colStep = colDiff / steps;

        // Add all cells along the line
        for (let i = 0; i <= steps; i++) {
            const row = Math.round(start.row + rowStep * i);
            const col = Math.round(start.col + colStep * i);
            cells.push(`${row}-${col}`);
        }

        return cells;
    }, []);

    // Check if line forms a valid word
    const getWordFromLine = useCallback((start: {row: number; col: number}, end: {row: number; col: number}): string | null => {
        const rowDiff = end.row - start.row;
        const colDiff = end.col - start.col;
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

        if (steps === 0) return null;

        const rowStep = rowDiff / steps;
        const colStep = colDiff / steps;

        const word: string[] = [];

        for (let i = 0; i <= steps; i++) {
            const row = Math.round(start.row + rowStep * i);
            const col = Math.round(start.col + colStep * i);

            if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
                return null;
            }

            word.push(grid[row][col]);
        }

        const forward = word.join('');
        const backward = word.slice().reverse().join('');

        const allWords = placements.map((p) => p.word);
        if (allWords.includes(forward)) return forward;
        if (allWords.includes(backward)) return backward;

        return null;
    }, [grid, placements]);

    const handleMouseDown = (row: number, col: number) => {
        setIsDragging(true);
        setDragStart({ row, col });
        setDragEnd({ row, col });
    };

    const handleMouseMove = (row: number, col: number) => {
        if (!isDragging || !dragStart) return;
        setDragEnd({ row, col });
    };

    const handleMouseUp = () => {
        if (!isDragging || !dragStart || !dragEnd) return;

        const word = getWordFromLine(dragStart, dragEnd);

        if (word && !foundWords.has(word)) {
            setFoundWords((prev) => {
                const newSet = new Set(prev).add(word);
                const color = WORD_COLORS[foundWordColors.size % WORD_COLORS.length];
                setFoundWordColors((prev) => new Map(prev).set(word, color));

                const allWords = placements.map((p) => p.word);
                if (newSet.size === allWords.length) {
                    onPuzzleComplete?.();
                }

                onWordFound?.(word);
                return newSet;
            });
        }

        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
    };

    // Global mouse events
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleMouseUp();
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging, dragStart, dragEnd]);

    // Get highlighted cells during drag
    const getHighlightedCells = useCallback((): Set<string> => {
        if (!isDragging || !dragStart || !dragEnd) return new Set();
        return new Set(getCellsBetween(dragStart, dragEnd));
    }, [isDragging, dragStart, dragEnd, getCellsBetween]);

    // Get color for a cell
    const getCellColor = useCallback((row: number, col: number): string | null => {
        // Check found words
        for (const [word, color] of foundWordColors) {
            const placement = placements.find((p) => p.word === word);
            if (!placement) continue;

            const { startRow, startCol, endRow, endCol, direction } = placement;
            const [rowDelta, colDelta] = getDirectionDelta(direction);

            let r = startRow;
            let c = startCol;

            do {
                if (r === row && c === col) return color;
                if (r === endRow && c === endCol) break;
                r += rowDelta;
                c += colDelta;
            } while (true);
        }

        // Show solution
        if (showSolution) {
            for (const placement of placements) {
                const { startRow, startCol, endRow, endCol, direction } = placement;
                const [rowDelta, colDelta] = getDirectionDelta(direction);

                let r = startRow;
                let c = startCol;

                do {
                    if (r === row && c === col) {
                        const colorIndex = placements.indexOf(placement) % WORD_COLORS.length;
                        return WORD_COLORS[colorIndex];
                    }
                    if (r === endRow && c === endCol) break;
                    r += rowDelta;
                    c += colDelta;
                } while (true);
            }
        }

        return null;
    }, [placements, foundWordColors, showSolution]);

    const getDirectionDelta = (direction: string): [number, number] => {
        const deltas: Record<string, [number, number]> = {
            horizontal: [0, 1],
            vertical: [1, 0],
            'diagonal-down': [1, 1],
            'diagonal-up': [-1, 1],
            'horizontal-backward': [0, -1],
            'vertical-backward': [-1, 0],
            'diagonal-down-backward': [-1, -1],
            'diagonal-up-backward': [1, -1],
        };
        return deltas[direction] || [0, 1];
    };

    const isCellHighlighted = (row: number, col: number): boolean => {
        return getHighlightedCells().has(`${row}-${col}`);
    };

    const getCellStyle = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        const isHighlighted = isCellHighlighted(row, col);

        const base = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-75 cursor-pointer select-none';

        if (color) return `${base} text-white shadow-md`;
        if (isHighlighted) return `${base} bg-blue-400 scale-105 shadow-md`;
        return `${base} bg-white hover:bg-gray-100`;
    };

    const getCellBackground = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        if (color) return color;
        if (isCellHighlighted(row, col)) return 'rgba(59, 130, 246, 0.5)';
        return 'white';
    };

    return (
        <div className={className}>
            <div
                className="inline-grid gap-0 border-2 border-gray-800 rounded-lg p-1 shadow-lg bg-white select-none"
                style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseMove(rowIndex, colIndex)}
                            style={{ backgroundColor: getCellBackground(rowIndex, colIndex) }}
                            className={getCellStyle(rowIndex, colIndex)}
                            aria-label={`Cell ${rowIndex},${colIndex}: ${cell}`}
                        >
                            {cell}
                        </button>
                    ))
                )}
            </div>

            <p className="text-sm text-gray-600 mt-4 text-center font-medium">
                Click and drag to select words
            </p>
        </div>
    );
}
