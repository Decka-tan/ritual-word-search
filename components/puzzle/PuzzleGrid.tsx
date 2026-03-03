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
    '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899',
];

interface DragState {
    isDragging: boolean;
    startRow: number;
    startCol: number;
    currentRow: number;
    currentCol: number;
}

interface CellLine {
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
    const [drag, setDrag] = useState<DragState>({
        isDragging: false,
        startRow: 0,
        startCol: 0,
        currentRow: 0,
        currentCol: 0,
    });
    const gridRef = useRef<HTMLDivElement>(null);

    // Get all cells that should be highlighted based on drag state
    const getHighlightedCells = useCallback((): Set<string> => {
        if (!drag.isDragging) return new Set();

        const { startRow, startCol, currentRow, currentCol } = drag;
        const cells = new Set<string>();

        const rowDiff = currentRow - startRow;
        const colDiff = currentCol - startCol;

        // Determine the primary direction
        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);

        // Find the line direction (snap to 8 directions)
        let rowStep = 0;
        let colStep = 0;

        if (absRowDiff > absColDiff * 2) {
            // Vertical dominant
            rowStep = rowDiff > 0 ? 1 : -1;
        } else if (absColDiff > absRowDiff * 2) {
            // Horizontal dominant
            colStep = colDiff > 0 ? 1 : -1;
        } else if (absRowDiff < 5 && absColDiff < 5) {
            // Close to start, just highlight start
            cells.add(`${startRow}-${startCol}`);
            return cells;
        } else {
            // Diagonal
            rowStep = rowDiff > 0 ? 1 : -1;
            colStep = colDiff > 0 ? 1 : -1;
        }

        // Calculate length
        const length = Math.max(absRowDiff, absColDiff);

        // Add all cells along the line
        for (let i = 0; i <= length; i++) {
            const row = startRow + rowStep * i;
            const col = startCol + colStep * i;

            // Bounds check
            if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
                cells.add(`${row}-${col}`);
            }
        }

        return cells;
    }, [drag, grid]);

    // Check if current drag forms a valid word
    const getDraggedWord = useCallback((): string | null => {
        if (!drag.isDragging) return null;

        const { startRow, startCol, currentRow, currentCol } = drag;
        const rowDiff = currentRow - startRow;
        const colDiff = currentCol - startCol;

        const absRowDiff = Math.abs(rowDiff);
        const absColDiff = Math.abs(colDiff);
        const length = Math.max(absRowDiff, absColDiff);

        if (length === 0) return null;

        // Determine direction
        let rowStep = 0;
        let colStep = 0;

        if (absRowDiff > absColDiff * 2) {
            rowStep = rowDiff > 0 ? 1 : -1;
        } else if (absColDiff > absRowDiff * 2) {
            colStep = colDiff > 0 ? 1 : -1;
        } else {
            // Diagonal (must be ~45 degrees)
            if (Math.abs(absRowDiff - absColDiff) > Math.max(absRowDiff, absColDiff) * 0.5) {
                return null; // Not close enough to diagonal
            }
            rowStep = rowDiff > 0 ? 1 : -1;
            colStep = colDiff > 0 ? 1 : -1;
        }

        // Build word
        const word: string[] = [];
        for (let i = 0; i <= length; i++) {
            const row = startRow + rowStep * i;
            const col = startCol + colStep * i;

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
    }, [drag, grid, placements]);

    const handleMouseDown = (row: number, col: number) => {
        setDrag({
            isDragging: true,
            startRow: row,
            startCol: col,
            currentRow: row,
            currentCol: col,
        });
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!drag.isDragging) return;

        setDrag({
            ...drag,
            currentRow: row,
            currentCol: col,
        });
    };

    const handleMouseUp = () => {
        if (!drag.isDragging) return;

        const word = getDraggedWord();

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

        setDrag({ ...drag, isDragging: false });
    };

    // Global mouse events
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (drag.isDragging) {
                handleMouseUp();
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [drag]);

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

    const isCellHighlighted = (row: number, col: number): boolean => {
        return getHighlightedCells().has(`${row}-${col}`);
    };

    const getCellStyle = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        const isHighlighted = isCellHighlighted(row, col);

        const base = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-100 cursor-pointer select-none touch-none';

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

        if (isCellHighlighted(row, col)) {
            return 'rgba(59, 130, 246, 0.5)';
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
                            onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
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
