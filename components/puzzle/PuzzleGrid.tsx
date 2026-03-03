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
    const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());

    const handleMouseDown = (row: number, col: number) => {
        setSelectedCells(new Set([`${row}-${col}`]));
    };

    const handleMouseMove = (row: number, col: number) => {
        if (selectedCells.size === 0) return;

        const startCell = Array.from(selectedCells)[0];
        const [startRow, startCol] = startCell.split('-').map(Number);

        // Try all 8 directions to see which one forms a valid line
        const directions = [
            [0, 1],   // right
            [0, -1],  // left
            [1, 0],   // down
            [-1, 0],  // up
            [1, 1],   // down-right
            [-1, -1], // up-left
            [1, -1],  // down-left
            [-1, 1],  // up-right
        ];

        const cells = new Set<string>([startCell]);
        let bestLength = 0;
        let bestCells: Set<string> = new Set([startCell]);

        for (const [rowDir, colDir] of directions) {
            const lineCells = new Set<string>([startCell]);
            let r = startRow;
            let c = startCol;

            // Trace line until we hit the target cell
            let distance = 0;
            const maxDist = Math.max(Math.abs(row - startRow), Math.abs(col - startCol)) + 1;

            for (let i = 0; i < maxDist; i++) {
                r += rowDir;
                c += colDir;

                if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) break;

                lineCells.add(`${r}-${c}`);
                distance++;

                if (r === row && c === col) {
                    // We reached the target cell
                    if (distance > bestLength) {
                        bestLength = distance;
                        bestCells = lineCells;
                    }
                    break;
                }
            }

            // Also try backward
            const backCells = new Set([startCell]);
            r = startRow;
            c = startCol;

            for (let i = 0; i < maxDist; i++) {
                r -= rowDir;
                c -= colDir;

                if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) break;

                backCells.add(`${r}-${c}`);

                if (r === row && c === col) {
                    if (distance > bestLength) {
                        bestLength = distance;
                        bestCells = backCells;
                    }
                    break;
                }
            }
        }

        setSelectedCells(bestCells);
    };

    const handleMouseUp = () => {
        if (selectedCells.size === 0) return;

        // Build word from selected cells
        const sortedCells = Array.from(selectedCells).map(key => {
            const [row, col] = key.split('-').map(Number);
            return { row, col };
        }).sort((a, b) => {
            const distA = Math.abs(a.row - sortedCells[0]?.row) + Math.abs(a.col - sortedCells[0]?.col);
            const distB = Math.abs(b.row - sortedCells[0]?.row) + Math.abs(b.col - sortedCells[0]?.col);
            return distA - distB;
        });

        const word = sortedCells.map(({ row, col }) => grid[row][col]).join('');
        const reversed = word.slice().reverse().join('');

        const allWords = placements.map((p) => p.word);
        const foundWord = allWords.includes(word) ? word : (allWords.includes(reversed) ? reversed : null);

        if (foundWord && !foundWords.has(foundWord)) {
            setFoundWords((prev) => {
                const newSet = new Set(prev).add(foundWord);
                const color = WORD_COLORS[foundWordColors.size % WORD_COLORS.length];
                setFoundWordColors((prev) => new Map(prev).set(foundWord, color));

                const allWords = placements.map((p) => p.word);
                if (newSet.size === allWords.length) {
                    onPuzzleComplete?.();
                }

                onWordFound?.(foundWord);
                return newSet;
            });
        }

        setSelectedCells(new Set());
    };

    useEffect(() => {
        const handleGlobalMouseUp = () => {
            handleMouseUp();
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [selectedCells]);

    // Get color for a cell
    const getCellColor = useCallback((row: number, col: number): string | null => {
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

    const isCellSelected = (row: number, col: number): boolean => {
        return selectedCells.has(`${row}-${col}`);
    };

    const getCellStyle = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        const isSelected = isCellSelected(row, col);

        const base = 'w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 border border-gray-300 flex items-center justify-center font-mono font-bold text-lg sm:text-xl transition-all duration-75 cursor-pointer select-none';

        if (color) return `${base} text-white shadow-md`;
        if (isSelected) return `${base} bg-blue-400 scale-105 shadow-md`;
        return `${base} bg-white hover:bg-gray-100`;
    };

    const getCellBackground = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        if (color) return color;
        if (isCellSelected(row, col)) return 'rgba(59, 130, 246, 0.5)';
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
