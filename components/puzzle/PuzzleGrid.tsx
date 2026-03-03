'use client';

import { useState } from 'react';
import { WordPlacement, GridCell } from '@/lib/puzzle/types';

interface PuzzleGridProps {
    grid: string[][];
    placements: WordPlacement[];
    showSolution?: boolean;
    onWordFound?: (word: string) => void;
    className?: string;
}

/**
 * Convert grid and placements to cell data for rendering.
 */
function buildGridCells(
    grid: string[][],
    placements: WordPlacement[],
    showSolution: boolean
): GridCell[][] {
    const size = grid.length;
    const cells: GridCell[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({
            letter: '',
            isWordStart: false,
            isWordEnd: false,
            isPartOfWord: false,
        }))
    );

    // Fill in letters
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            cells[row][col].letter = grid[row][col];
        }
    }

    // Mark word placements if showing solution
    if (showSolution) {
        placements.forEach((placement, index) => {
            const { startRow, startCol, endRow, endCol, direction } = placement;
            const [rowDelta, colDelta] = getDirectionDelta(direction);

            let row = startRow;
            let col = startCol;
            let isFirst = true;
            let isLast = false;

            do {
                cells[row][col].isPartOfWord = true;
                cells[row][col].wordIndex = index;
                if (isFirst) {
                    cells[row][col].isWordStart = true;
                    isFirst = false;
                }

                if (row === endRow && col === endCol) {
                    cells[row][col].isWordEnd = true;
                    isLast = true;
                }

                row += rowDelta;
                col += colDelta;
            } while (!isLast);
        });
    }

    return cells;
}

function getDirectionDelta(direction: string): [number, number] {
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
}

export function PuzzleGrid({
    grid,
    placements,
    showSolution = false,
    onWordFound,
    className,
}: PuzzleGridProps) {
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

    const cells = buildGridCells(grid, placements, showSolution || foundWords.size > 0);

    const handleCellClick = (row: number, col: number) => {
        const key = `${row}-${col}`;
        const newSelected = new Set(selectedCells);

        if (newSelected.has(key)) {
            newSelected.delete(key);
        } else {
            newSelected.add(key);
        }

        setSelectedCells(newSelected);

        // Check if selected cells form a word
        if (newSelected.size >= 2) {
            const selectedWord = getSelectedWord(newSelected);
            if (selectedWord && !foundWords.has(selectedWord)) {
                setFoundWords((prev) => new Set(prev).add(selectedWord));
                onWordFound?.(selectedWord);
            }
        }
    };

    const getSelectedWord = (selected: Set<string>): string | null => {
        const cells = Array.from(selected).map((key) => {
            const [row, col] = key.split('-').map(Number);
            return grid[row][col];
        });
        const word = cells.join('');
        const reversed = cells.reverse().join('');

        // Check if this matches any word in placements
        const allWords = placements.map((p) => p.word);
        if (allWords.includes(word)) return word;
        if (allWords.includes(reversed)) return reversed;
        return null;
    };

    const isCellSelected = (row: number, col: number): boolean => {
        return selectedCells.has(`${row}-${col}`);
    };

    const isCellHighlighted = (row: number, col: number): boolean => {
        return cells[row][col].isPartOfWord && showSolution;
    };

    const getCellStyle = (row: number, col: number): string => {
        const cell = cells[row][col];
        const isSelected = isCellSelected(row, col);
        const isHighlighted = isCellHighlighted(row, col);

        const base = 'w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 border border-black flex items-center justify-center font-mono font-bold text-sm sm:text-base transition-colors';

        if (isHighlighted) {
            return `${base} bg-black text-white`;
        }

        if (isSelected) {
            return `${base} bg-gray-300`;
        }

        return `${base} bg-white hover:bg-gray-100`;
    };

    return (
        <div className={className}>
            <div
                className="inline-grid gap-0 border-2 border-black"
                style={{ gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))` }}
            >
                {cells.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            className={getCellStyle(rowIndex, colIndex)}
                            aria-label={`Cell ${rowIndex},${colIndex}: ${cell.letter}`}
                        >
                            {cell.letter}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
