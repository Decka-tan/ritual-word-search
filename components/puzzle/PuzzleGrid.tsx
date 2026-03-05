'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WordPlacement } from '@/lib/puzzle/types';

interface PuzzleGridProps {
    grid: string[][];
    placements: WordPlacement[];
    showSolution?: boolean;
    onWordFound?: (word: string) => void;
    onPuzzleComplete?: () => void;
    className?: string;
    fullscreen?: boolean; // New prop for fullscreen mode
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
    fullscreen = false,
}: PuzzleGridProps) {
    const [foundWords, setFoundWords] = useState<Set<string>>(new Set());
    const [foundWordColors, setFoundWordColors] = useState<Map<string, string>>(new Map());
    const [selectState, setSelectState] = useState<SelectState>({ firstCell: null, secondCell: null });

    // Drag state
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{row: number; col: number} | null>(null);
    const dragCellsRef = useRef<string[]>([]);
    const hasMovedRef = useRef(false);

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

    // MOUSE HANDLERS
    const handleMouseDown = (row: number, col: number) => {
        setIsDragging(true);
        hasMovedRef.current = false;
        dragStartRef.current = { row, col };
        const cells = getCellsBetween({ row, col }, { row, col });
        dragCellsRef.current = cells;
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!isDragging || !dragStartRef.current) return;

        // Mark as moved if we're entering a different cell
        if (dragStartRef.current.row !== row || dragStartRef.current.col !== col) {
            hasMovedRef.current = true;
        }

        const cells = getCellsBetween(dragStartRef.current, { row, col });
        dragCellsRef.current = cells;
        // Only set selectState if we're actually dragging (moved)
        if (hasMovedRef.current) {
            setSelectState({
                firstCell: dragStartRef.current,
                secondCell: { row, col }
            });
        }
    };

    const handleMouseUp = () => {
        if (!isDragging || !dragStartRef.current) {
            setIsDragging(false);
            return;
        }

        // Only process as drag if mouse actually moved
        if (hasMovedRef.current) {
            const cells = dragCellsRef.current;
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

            setIsDragging(false);
            dragStartRef.current = null;
            dragCellsRef.current = [];
            hasMovedRef.current = false;
            setSelectState({ firstCell: null, secondCell: null });
        } else {
            // No movement - reset drag state
            setIsDragging(false);
            dragStartRef.current = null;
            dragCellsRef.current = [];
            hasMovedRef.current = false;
        }
    };

    // TOUCH HANDLERS
    const handleTouchStart = (row: number, col: number) => {
        setIsDragging(true);
        hasMovedRef.current = false;
        dragStartRef.current = { row, col };
        const cells = getCellsBetween({ row, col }, { row, col });
        dragCellsRef.current = cells;
        setSelectState({
            firstCell: { row, col },
            secondCell: { row, col }
        });
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging || !dragStartRef.current) return;

        // Get touch position
        const touch = e.touches[0];
        const element = document.elementFromPoint(touch.clientX, touch.clientY);

        if (!element) return;

        // Find cell from button element
        const button = element.closest('button');
        if (!button) return;

        // Get cell position from button's aria-label or key
        const ariaLabel = button.getAttribute('aria-label');
        if (!ariaLabel) return;

        const match = ariaLabel.match(/Cell (\d+),(\d+)/);
        if (!match) return;

        const row = parseInt(match[1]);
        const col = parseInt(match[2]);

        // Mark as moved if we're on a different cell
        if (dragStartRef.current.row !== row || dragStartRef.current.col !== col) {
            hasMovedRef.current = true;
        }

        const cells = getCellsBetween(dragStartRef.current, { row, col });
        dragCellsRef.current = cells;

        setSelectState({
            firstCell: dragStartRef.current,
            secondCell: { row, col }
        });
    };

    const handleTouchEnd = () => {
        if (!isDragging || !dragStartRef.current) {
            setIsDragging(false);
            return;
        }

        // Only process as drag if actually moved
        if (hasMovedRef.current) {
            const cells = dragCellsRef.current;
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
        }

        // Reset all drag state
        setIsDragging(false);
        dragStartRef.current = null;
        dragCellsRef.current = [];
        hasMovedRef.current = false;
        setSelectState({ firstCell: null, secondCell: null });
    };

    // Global mouse up listener
    useEffect(() => {
        const handleGlobalMouseUp = () => {
            if (isDragging) {
                handleMouseUp();
            }
        };

        document.addEventListener('mouseup', handleGlobalMouseUp);
        return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
    }, [isDragging]);

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

    // Dynamic font size based on grid size and fullscreen mode
    const getFontSizeClass = (): string => {
        const size = grid.length;
        // Fullscreen mode - much larger text
        if (fullscreen) {
            if (size <= 10) return 'text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl';
            if (size <= 12) return 'text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl';
            if (size <= 15) return 'text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl';
            return 'text-sm sm:text-base md:text-lg lg:text-xl';
        }
        // Normal mode
        if (size <= 10) return 'text-base sm:text-lg md:text-xl lg:text-2xl';
        if (size <= 12) return 'text-sm sm:text-base md:text-lg lg:text-xl';
        if (size <= 15) return 'text-xs sm:text-sm md:text-base lg:text-lg';
        return 'text-xs';
    };

    const getCellStyle = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        const isSelected = isInSelection(row, col);
        const isFirst = selectState.firstCell?.row === row && selectState.firstCell?.col === col;
        const isWordCell = color !== '';

        const base = `w-full h-full border flex items-center justify-center font-mono font-bold ${getFontSizeClass()} cursor-pointer aspect-square touch-none transition-all duration-200`;

        if (isWordCell) return `${base} border-white/10`;
        if (isSelected) return `${base} border-[#00FF94]/50`;
        if (isFirst) return `${base} border-[#00FF94]`;
        return `${base} border-[#262626] bg-[#050505] hover:bg-[#121212] hover:border-[#A3A3A3]/50`;
    };

    const getCellBackground = (row: number, col: number): string => {
        const color = getCellColor(row, col);
        if (color) return color;
        if (isInSelection(row, col)) return 'rgba(59, 130, 246, 0.5)';
        if (selectState.firstCell?.row === row && selectState.firstCell?.col === col) return 'rgba(250, 204, 21, 0.5)';
        return '';
    };

    // Calculate max width based on grid size for optimal display
    const getMaxWidth = (): string => {
        const size = grid.length;
        if (size <= 12) return '100%';
        if (size <= 15) return '95%';
        return '90%';
    };

    return (
        <div className={className}>
            <div className="w-full flex items-center justify-center">
                <div
                    className={`grid gap-px bg-white dark:bg-zinc-900 ${
                        fullscreen
                            ? 'border-0 rounded-none p-0 shadow-none'
                            : 'border-2 border-gray-300 dark:border-zinc-700 rounded-lg p-2 shadow-xl w-full'
                    }`}
                    style={{
                        gridTemplateColumns: `repeat(${grid.length}, 1fr)`,
                        ...(fullscreen ? {
                            width: 'min(90vw, 75vh)',
                            height: 'min(90vw, 75vh)',
                        } : {
                            maxWidth: getMaxWidth(),
                        }),
                    }}
                >
                    {grid.map((row, rowIndex) =>
                        row.map((cell, colIndex) => {
                            const cellKey = `${rowIndex}-${colIndex}`;
                            const color = getCellColor(rowIndex, colIndex);
                            const isSelected = isInSelection(rowIndex, colIndex);
                            const isFirst = selectState.firstCell?.row === rowIndex && selectState.firstCell?.col === colIndex;

                            return (
                                <motion.button
                                    key={cellKey}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                                    onTouchStart={() => handleTouchStart(rowIndex, colIndex)}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    style={{
                                        backgroundColor: getCellBackground(rowIndex, colIndex),
                                    }}
                                    className={getCellStyle(rowIndex, colIndex)}
                                    aria-label={`Cell ${rowIndex},${colIndex}: ${cell}`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        scale: isSelected ? 1.1 : isFirst ? 1.15 : 1,
                                        transition: { duration: 0.15, ease: "easeOut" }
                                    }}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{
                                        opacity: 1,
                                        scale: isSelected ? 1.1 : isFirst ? 1.15 : 1
                                    }}
                                >
                                    <span className={color ? 'text-white' : isSelected || isFirst ? 'text-[#00FF94]' : 'text-[#FAFAFA]'}>
                                        {cell}
                                    </span>
                                </motion.button>
                            );
                        })
                    )}
                </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-zinc-400 mt-4 text-center font-medium">
                👆 Tap first & last letter OR 🖱️ DRAG to select words
            </p>
        </div>
    );
}
