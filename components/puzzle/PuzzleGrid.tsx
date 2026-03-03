'use client';

import { useState, useCallback } from 'react';
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

interface SelectState {
    firstCell: { row: number; col: number } | null;
    secondCell: { row: number; col: number } | null;
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
    const [selectState, setSelectState] = useState<SelectState>({ firstCell: null, secondCell: null });

    const handleCellClick = (row: number, col: number) => {
        // No first cell selected
        if (!selectState.firstCell) {
            setSelectState({
                firstCell: { row, col },
                secondCell: null
            });
            return;
        }

        // Clicked same cell - deselect
        if (selectState.firstCell.row === row && selectState.firstCell.col === col) {
            setSelectState({ firstCell: null, secondCell: null });
            return;
        }

        // Select second cell - try to form a word
        const first = selectState.firstCell;
        const second = { row, col };

        // Get cells between first and second cell
        const cells = getCellsBetween(first, second);

        // Build word
        const word = cells
            .map(key => {
                const [r, c] = key.split('-').map(Number);
                return grid[r][c];
            })
            .join('');

        const reversed = word.split('').reverse().join('');

        const allWords = placements.map((p) => p.word);
        const foundWord = allWords.includes(word) ? word : (allWords.includes(reversed) ? reversed : null);

        if (foundWord && !foundWords.has(foundWord)) {
            setFoundWords((prev) => {
                const newSet = new Set(prev).add(foundWord);
                const color = WORD_COLORS[foundWordColors.size % WORD_COLORS.length];
                setFoundWordColors((prev) => new Map(prev).set(foundWord, color));

                const allWordsList = placements.map((p) => p.word);
                if (newSet.size === allWordsList.length) {
                    onPuzzleComplete?.();
                }

                onWordFound?.(foundWord);
                return newSet;
            });
        }

        // Reset selection
        setSelectState({ firstCell: null, secondCell: null });
    };

    // Get cells between two points
    const getCellsBetween = (start: {row: number; col: number}, end: {row: number; col: number}): string[] => {
        const cells: string[] = [];
        const rowDiff = end.row - start.row;
        const colDiff = end.col - start.col;
        const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

        if (steps === 0) {
            return [`${start.row}-${start.col}`];
        }

        const rowStep = rowDiff / steps;
        const colStep = colDiff / steps;

        for (let i = 0; i <= steps; i++) {
            const row = Math.round(start.row + rowStep * i);
            const col = Math.round(start.col + colStep * i);

            if (row >= 0 && row < grid.length && col >= 0 && col < grid[0].length) {
                cells.push(`${row}-${col}`);
            }
        }

        return cells;
    };

    // Check if a cell is currently in selection
    const isInSelection = (row: number, col: number): boolean => {
        if (!selectState.firstCell) return false;

        const cells = getCellsBetween(selectState.firstCell, selectState.secondCell || selectState.firstCell);
        return cells.includes(`${row}-${col}`);
    };

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

    const getCellStyle = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        const isSelected = isInSelection(row, col);
        const isFirst = selectState.firstCell?.row === row && selectState.firstCell?.col === col;

        const base = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-150 cursor-pointer';

        if (color) return `${base} text-white shadow-md scale-105`;
        if (isSelected) return `${base} bg-blue-400 scale-105 shadow-md`;
        if (isFirst) return `${base} bg-yellow-400 scale-110 shadow-md`;
        return `${base} bg-white hover:bg-gray-100 hover:scale-105`;
    };

    const getCellBackground = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        if (color) return color;
        if (isInSelection(row, col)) return 'rgba(59, 130, 246, 0.5)';
        if (selectState.firstCell?.row === row && selectState.firstCell?.col === col) return 'rgba(250, 204, 21, 0.5)';
        return 'white';
    };

    return (
        <div className={className}>
            <div
                className="inline-grid gap-0 border-2 border-gray-800 rounded-lg p-1 shadow-lg bg-white"
                style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
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
                Click first letter, then click last letter to select word
            </p>
        </div>
    );
}
