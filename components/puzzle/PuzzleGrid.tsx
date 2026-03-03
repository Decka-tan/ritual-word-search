'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { WordPlacement } from '@/lib/puzzle/types';

interface PuzzleGridProps {
    grid: string[][];
    placements: WordPlacement[];
    showSolution?: boolean;
    onWordFound?: (word: string) => void;
    onPuzzleComplete?: () => void;
    className?: string;
}

// Colors for different words
const WORD_COLORS = [
    '#ef4444', // red
    '#f97316', // orange
    '#eab308', // yellow
    '#22c55e', // green
    '#06b6d4', // cyan
    '#3b82f6', // blue
    '#8b5cf6', // violet
    '#ec4899', // pink
];

interface SelectionLine {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}

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
    const [isDragging, setIsDragging] = useState(false);
    const [selectionLine, setSelectionLine] = useState<SelectionLine | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Calculate which cells should be highlighted based on selection line
    const getHighlightedCells = useCallback((line: SelectionLine): Set<string> => {
        const cells = new Set<string>();
        const { startRow, startCol, endRow, endCol } = line;

        const rowDist = endRow - startRow;
        const colDist = endCol - startCol;
        const dist = Math.max(Math.abs(rowDist), Math.abs(colDist));

        if (dist === 0) {
            cells.add(`${startRow}-${startCol}`);
            return cells;
        }

        // Calculate direction (normalized)
        const rowStep = rowDist / dist;
        const colStep = colDist / dist;

        // Only add cells that are exactly on the line
        for (let i = 0; i <= dist; i++) {
            const row = Math.round(startRow + rowStep * i);
            const col = Math.round(startCol + colStep * i);
            cells.add(`${row}-${col}`);
        }

        return cells;
    }, []);

    // Check if selection forms a valid word
    const getWordFromSelection = useCallback((line: SelectionLine): string | null => {
        const { startRow, startCol, endRow, endCol } = line;

        const rowDist = endRow - startRow;
        const colDist = endCol - startCol;
        const dist = Math.max(Math.abs(rowDist), Math.abs(colDist));

        if (dist === 0) return null;

        const rowStep = rowDist / dist;
        const colStep = colDist / dist;

        // Verify it's a valid 8-direction (horizontal, vertical, or perfect diagonal)
        const validSteps = [
            [0, 1],   // right
            [0, -1],  // left
            [1, 0],   // down
            [-1, 0],  // up
            [1, 1],   // down-right
            [-1, -1], // up-left
            [1, -1],  // down-left
            [-1, 1],  // up-right
        ];

        const isValid = validSteps.some(
            ([r, c]) => Math.abs(r - rowStep) < 0.01 && Math.abs(c - colStep) < 0.01
        );

        if (!isValid) return null;

        // Build the word
        const word: string[] = [];
        for (let i = 0; i <= dist; i++) {
            const row = Math.round(startRow + rowStep * i);
            const col = Math.round(startCol + colStep * i);

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

    const handleCellMouseDown = (row: number, col: number) => {
        setIsDragging(true);
        setSelectionLine({
            startRow: row,
            startCol: col,
            endRow: row,
            endCol: col,
        });
    };

    const handleCellMouseEnter = (row: number, col: number) => {
        if (!isDragging || !selectionLine) return;

        setSelectionLine({
            ...selectionLine,
            endRow: row,
            endCol: col,
        });
    };

    const handleMouseUp = () => {
        if (!isDragging || !selectionLine) return;

        const word = getWordFromSelection(selectionLine);

        if (word && !foundWords.has(word)) {
            setFoundWords((prev) => {
                const newSet = new Set(prev).add(word);

                // Assign color
                const availableColor = WORD_COLORS[foundWordColors.size % WORD_COLORS.length];
                setFoundWordColors((prev) => new Map(prev).set(word, availableColor));

                // Check if complete
                const allWords = placements.map((p) => p.word);
                if (newSet.size === allWords.length) {
                    onPuzzleComplete?.();
                }

                onWordFound?.(word);
                return newSet;
            });
        }

        setIsDragging(false);
        setSelectionLine(null);
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
    }, [isDragging, selectionLine]);

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
                if (r === row && c === col) {
                    return color;
                }
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

    const getCellStyle = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        const isHighlighted = selectionLine && getHighlightedCells(selectionLine).has(`${row}-${col}`);

        const base = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-75 cursor-pointer select-none touch-none';

        if (color) {
            return `${base} text-white shadow-md`;
        }

        if (isHighlighted) {
            return `${base} bg-blue-400 scale-105 shadow-md`;
        }

        return `${base} bg-white hover:bg-gray-100`;
    };

    const getCellBackground = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        if (color) return color;

        if (selectionLine && getHighlightedCells(selectionLine).has(`${row}-${col}`)) {
            return 'rgba(59, 130, 246, 0.6)';
        }

        return 'white';
    };

    return (
        <div className={className}>
            <div
                ref={gridRef}
                className="inline-grid gap-0 border-2 border-gray-800 rounded-lg p-1 shadow-lg bg-white select-none"
                style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                            style={{
                                backgroundColor: getCellBackground(rowIndex, colIndex),
                            }}
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
