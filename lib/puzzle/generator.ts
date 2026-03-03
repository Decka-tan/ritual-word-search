/**
 * Core puzzle generator engine.
 * Generates collision-safe word search puzzles with deterministic seeded generation.
 */

import {
    PuzzleOptions,
    GeneratedPuzzle,
    WordPlacement,
    Direction,
    DIRECTION_VECTORS,
} from './types';
import { seededRandom, seededShuffle, seededRandomItem } from './seed';

// Default options
const DEFAULT_OPTIONS: PuzzleOptions = {
    size: 15,
    allowDiagonal: true,
    allowBackward: false,
};

// Constraints
const MIN_GRID_SIZE = 10;
const MAX_GRID_SIZE = 30;
const MIN_WORD_LENGTH = 2;
const MAX_WORD_LENGTH = 20;

/**
 * Get available placement directions based on options.
 */
function getAvailableDirections(options: PuzzleOptions): Direction[] {
    const directions: Direction[] = ['horizontal', 'vertical'];

    if (options.allowDiagonal) {
        directions.push('diagonal-down', 'diagonal-up');
    }

    if (options.allowBackward) {
        // Add backward variants
        const forwardDirs = [...directions];
        forwardDirs.forEach(dir => {
            const backwardDir = `${dir}-backward` as Direction;
            if (DIRECTION_VECTORS[backwardDir]) {
                directions.push(backwardDir);
            }
        });
    }

    return directions;
}

/**
 * Check if a word can be placed at the given position and direction.
 * Returns true if placement is valid (within bounds and collision-safe).
 */
function canPlaceWord(
    grid: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: Direction
): boolean {
    const [rowDelta, colDelta] = DIRECTION_VECTORS[direction];
    const size = grid.length;

    // Check if word fits within grid bounds
    const endRow = startRow + rowDelta * (word.length - 1);
    const endCol = startCol + colDelta * (word.length - 1);

    if (endRow < 0 || endRow >= size || endCol < 0 || endCol >= size) {
        return false;
    }

    // Check each position for collision
    for (let i = 0; i < word.length; i++) {
        const row = startRow + rowDelta * i;
        const col = startCol + colDelta * i;
        const cell = grid[row][col];

        // Cell must be empty or contain the same letter
        if (cell !== '' && cell !== word[i]) {
            return false;
        }
    }

    return true;
}

/**
 * Place a word on the grid at the specified position and direction.
 */
function placeWord(
    grid: string[][],
    word: string,
    startRow: number,
    startCol: number,
    direction: Direction
): WordPlacement {
    const [rowDelta, colDelta] = DIRECTION_VECTORS[direction];

    for (let i = 0; i < word.length; i++) {
        const row = startRow + rowDelta * i;
        const col = startCol + colDelta * i;
        grid[row][col] = word[i];
    }

    const endRow = startRow + rowDelta * (word.length - 1);
    const endCol = startCol + colDelta * (word.length - 1);

    return {
        word,
        startRow,
        startCol,
        direction,
        endRow,
        endCol,
    };
}

/**
 * Attempt to place a single word, trying all possible positions.
 * Returns the placement if successful, null otherwise.
 */
function placeSingleWord(
    grid: string[][],
    word: string,
    directions: Direction[],
    random: () => number,
    size: number,
    maxAttempts = 100
): WordPlacement | null {
    // Shuffle directions for randomness
    const shuffledDirs = seededShuffle(directions, random);

    for (const direction of shuffledDirs) {
        // Generate all possible starting positions for this direction
        const possiblePositions: Array<[number, number]> = [];

        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                if (canPlaceWord(grid, word, row, col, direction)) {
                    possiblePositions.push([row, col]);
                }
            }
        }

        if (possiblePositions.length === 0) continue;

        // Try random positions
        const shuffledPositions = seededShuffle(possiblePositions, random);

        for (const [startRow, startCol] of shuffledPositions.slice(0, maxAttempts)) {
            return placeWord(grid, word, startRow, startCol, direction);
        }
    }

    return null;
}

/**
 * Fill remaining empty cells with random letters.
 */
function fillEmptyCells(grid: string[][], random: () => number): void {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === '') {
                grid[row][col] = seededRandomItem(letters.split(''), random);
            }
        }
    }
}

/**
 * Validate and normalize input words.
 * Filters out invalid words and converts to uppercase.
 */
function normalizeWords(words: string[]): string[] {
    return words
        .map(w => w.toUpperCase().trim().replace(/[^A-Z]/g, ''))
        .filter(w => w.length >= MIN_WORD_LENGTH && w.length <= MAX_WORD_LENGTH)
        .filter((w, i, arr) => arr.indexOf(w) === i); // Remove duplicates
}

/**
 * Auto-calculate grid size based on word count and longest word length.
 */
function calculateOptimalSize(wordCount: number, longestWord: number): number {
    // Base size on longest word + padding
    const minSize = longestWord + 4;

    // Adjust for word count (more words = larger grid)
    const densityFactor = Math.ceil(Math.sqrt(wordCount * 10));

    const size = Math.max(minSize, densityFactor);

    // Clamp to valid range
    return Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, size));
}

/**
 * Main puzzle generator function.
 *
 * @param words - Array of words to place in the puzzle
 * @param options - Puzzle generation options
 * @param seed - Optional seed for deterministic generation
 * @returns Generated puzzle with grid and placements
 * @throws Error if generation fails
 */
export function generatePuzzle(
    words: string[],
    options: Partial<PuzzleOptions> = {},
    seed?: number
): GeneratedPuzzle {
    // Merge with defaults
    const opts: PuzzleOptions = {
        size: options.size ?? DEFAULT_OPTIONS.size,
        allowDiagonal: options.allowDiagonal ?? DEFAULT_OPTIONS.allowDiagonal,
        allowBackward: options.allowBackward ?? DEFAULT_OPTIONS.allowBackward,
    };

    // Normalize words
    const normalizedWords = normalizeWords(words);

    if (normalizedWords.length === 0) {
        throw new Error('No valid words provided. Words must be 2-20 letters.');
    }

    // Auto-calculate size if needed
    let size = opts.size;
    const longestWord = Math.max(...normalizedWords.map(w => w.length));

    if (size < longestWord) {
        size = longestWord;
    }

    // Clamp size to valid range
    size = Math.max(MIN_GRID_SIZE, Math.min(MAX_GRID_SIZE, size));

    // Initialize RNG
    const actualSeed = seed ?? Date.now();
    const random = seededRandom(actualSeed);

    // Initialize empty grid
    const grid: string[][] = Array.from({ length: size }, () =>
        Array.from({ length: size }, () => '')
    );

    // Sort words by length (longest first) for better placement success
    const sortedWords = [...normalizedWords].sort((a, b) => b.length - a.length);

    // Get available directions
    const directions = getAvailableDirections(opts);

    // Place each word
    const placements: WordPlacement[] = [];
    const failedWords: string[] = [];

    for (const word of sortedWords) {
        const placement = placeSingleWord(grid, word, directions, random, size);

        if (placement) {
            placements.push(placement);
        } else {
            failedWords.push(word);
        }
    }

    // Check if we placed at least some words
    if (placements.length === 0) {
        throw new Error('Failed to place any words. Try a larger grid size or fewer words.');
    }

    // Fill remaining cells
    fillEmptyCells(grid, random);

    return {
        grid,
        placements,
    };
}

/**
 * Regenerate a puzzle with the same words and options but a new seed.
 */
export function regeneratePuzzle(
    words: string[],
    options: PuzzleOptions,
    previousSeed: number
): GeneratedPuzzle {
    // Generate a new seed based on the previous one
    const newSeed = previousSeed ^ 0x5DEECE66D;
    return generatePuzzle(words, options, newSeed);
}
