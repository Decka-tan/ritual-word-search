'use client';

import { useState, useRef, useCallback } from 'react';
import { WordPlacement } from '@/lib/puzzle/types';

interface PuzzleGridProps {
    grid: string[][];
    placements: WordPlacement[];
    showSolution?: boolean;
    onWordFound?: (word: string) => void;
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
    className,
}: PuzzleGridProps) {
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [foundWordColors, setFoundWordColors] = useState<Map<string, string>>(new Map());
    const [isDragging, setIsDragging] = useState(false);
    const [selectionLine, setSelectionLine] = useState<SelectionLine | null>(null);
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
    const gridRef = useRef<HTMLDivElement>(null);

    // Check if cells form a valid word
    const getWordFromCells = useCallback((startRow: number, startCol: number, endRow: number, endCol: number): string | null => {
        const rowDelta = Math.sign(endRow - startRow);
        const colDelta = Math.sign(endCol - startCol);

        // Must be horizontal, vertical, or diagonal
        const rowDist = Math.abs(endRow - startRow);
        const colDist = Math.abs(endCol - startCol);

        // Check if direction is valid (horizontal, vertical, or exactly diagonal)
        if (rowDist !== 0 && colDist !== 0 && rowDist !== colDist) {
            return null;
        }

        const length = Math.max(rowDist, colDist) + 1;
        const word: string[] = [];

        for (let i = 0; i < length; i++) {
            const row = startRow + rowDelta * i;
            const col = startCol + colDelta * i;
            if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
                return null;
            }
            word.push(grid[row][col]);
        }

        const forward = word.join('');
        const backward = word.reverse().join('');

        const allWords = placements.map((p) => p.word);
        if (allWords.includes(forward)) return forward;
        if (allWords.includes(backward)) return backward;

        return null;
    }, [grid, placements]);

    const getCellsInLine = useCallback((line: SelectionLine): Set<string> => {
        const cells = new Set<string>();
        const { startRow, startCol, endRow, endCol } = line;

        const rowDelta = Math.sign(endRow - startRow);
        const colDelta = Math.sign(endCol - startCol);
        const length = Math.max(Math.abs(endRow - startRow), Math.abs(endCol - startCol)) + 1;

        for (let i = 0; i < length; i++) {
            const row = startRow + rowDelta * i;
            const col = startCol + colDelta * i;
            cells.add(`${row}-${col}`);
        }

        return cells;
    }, []);

    const handleCellMouseDown = (row: number, col: number) => {
        setIsDragging(true);
        setSelectionLine({ startRow: row, startCol: row, endRow: col, endCol: col });
        setSelectedCells(new Set([`${row}-${col}`]));
    };

    const handleCellMouseEnter = (row: number, col: number) => {
        if (!isDragging || !selectionLine) return;

        const newLine = { ...selectionLine, endRow: row, endCol: col };
        setSelectionLine(newLine);
        setSelectedCells(getCellsInLine(newLine));
    };

    const handleMouseUp = () => {
        if (!isDragging || !selectionLine) return;

        const word = getWordFromCells(
            selectionLine.startRow,
            selectionLine.startCol,
            selectionLine.endRow,
            selectionLine.endCol
        );

        if (word && !foundWords.has(word)) {
            setFoundWords((prev) => new Set(prev).add(word));

            // Assign a color to this word
            const usedColors = Array.from(foundWordColors.values());
            const availableColor = WORD_COLORS[foundWordColors.size % WORD_COLORS.length];
            setFoundWordColors((prev) => new Map(prev).set(word, availableColor));

            onWordFound?.(word);
        }

        setIsDragging(false);
        setSelectionLine(null);
        setSelectedCells(new Set());
    };

    // Add global mouse up listener
    useState(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleMouseUp();
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    });

    // Get color for a cell
    const getCellColor = (row: number, col: number): string | null => {
        if (showSolution) {
            // Check if this cell is part of any word
            for (const placement of placements) {
                const { startRow, startCol, endRow, endCol, direction } = placement;
                const [rowDelta, colDelta] = getDirectionDelta(direction);

                let r = startRow;
                let c = startCol;
                let isPartOfWord = false;

                do {
                    if (r === row && c === col) {
                        isPartOfWord = true;
                        break;
                    }
                    if (r === endRow && c === endCol) break;
                    r += rowDelta;
                    c += colDelta;
                } while (true);

                if (isPartOfWord) {
                    const colorIndex = placements.indexOf(placement) % WORD_COLORS.length;
                    return WORD_COLORS[colorIndex];
                }
            }
        }

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

        return null;
    };

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

    const isCellSelected = (row: number, col: number): boolean => {
        return selectedCells.has(`${row}-${col}`);
    };

    const getCellStyle = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        const isSelected = isCellSelected(row, col);

        const base = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-100 cursor-pointer select-none';

        if (color) {
            return `${base} text-white`;
        }

        if (isSelected) {
            return `${base} bg-blue-200`;
        }

        return `${base} bg-white hover:bg-gray-100`;
    };

    const getCellBackground = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        if (color) return color;

        if (selectedCells.has(`${row}-${col}`)) {
            return 'rgba(59, 130, 246, 0.3)'; // semi-transparent blue
        }

        return 'white';
    };

    return (
        <div className={className}>
            <div
                ref={gridRef}
                className="inline-grid gap-0.5 border-2 border-gray-800 rounded-lg p-1 shadow-lg"
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

            {/* Instructions */}
            <p className="text-sm text-gray-600 mt-4 text-center">
                Click and drag to select words
            </p>
        </div>
    );
}
