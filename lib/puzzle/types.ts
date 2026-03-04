// Core puzzle types for the word search generator

export interface PuzzleOptions {
    size: number;
    allowDiagonal: boolean;
    allowBackward: boolean;
}

export interface WordPlacement {
    word: string;
    startRow: number;
    startCol: number;
    direction: Direction;
    endRow: number;
    endCol: number;
}

export type Direction =
    | 'horizontal'
    | 'vertical'
    | 'diagonal-down'
    | 'diagonal-up'
    | 'horizontal-backward'
    | 'vertical-backward'
    | 'diagonal-down-backward'
    | 'diagonal-up-backward';

export interface GeneratedPuzzle {
    grid: string[][]; // 2D array of characters
    placements: WordPlacement[]; // Location of each word
}

export interface Puzzle {
    id: string;
    title: string;
    description: string | null;
    authorName: string | null;
    words: string[];
    size: number;
    allowDiagonal: boolean;
    allowBackward: boolean;
    seed: number | null;
    grid: string[][];
    placements: WordPlacement[];
    editKey: string;
    createdAt: string;
}

export interface CreatePuzzleInput {
    title: string;
    description?: string;
    authorName?: string;
    words: string[];
    options: PuzzleOptions;
    seed?: number;
}

export interface UpdatePuzzleInput {
    title?: string;
    description?: string;
    words?: string[];
    options?: PuzzleOptions;
    regenerate?: boolean;
}

export interface PublicPuzzle {
    id: string;
    title: string;
    description: string | null;
    authorName: string | null;
    words: string[];
    size: number;
    allowDiagonal: boolean;
    allowBackward: boolean;
    seed: number | null;
    grid: string[][];
    placements: WordPlacement[];
    createdAt: string;
}

export interface RecentPuzzle {
    id: string;
    title: string;
    playUrl: string;
    editUrl: string;
    createdAt: string;
}

// Grid cell state for UI
export interface GridCell {
    letter: string;
    isWordStart: boolean;
    isWordEnd: boolean;
    isPartOfWord: boolean;
    wordIndex?: number; // Index in placements array
}

// Direction vectors for placement
export const DIRECTION_VECTORS: Record<Direction, [rowDelta: number, colDelta: number]> = {
    horizontal: [0, 1],
    vertical: [1, 0],
    'diagonal-down': [1, 1],
    'diagonal-up': [-1, 1],
    'horizontal-backward': [0, -1],
    'vertical-backward': [-1, 0],
    'diagonal-down-backward': [-1, -1],
    'diagonal-up-backward': [1, -1],
};

// Leaderboard types
export interface LeaderboardEntry {
    id: string;
    puzzleId: string;
    playerName: string;
    timeSeconds: number;
    createdAt: string;
}

export interface SubmitScoreInput {
    puzzleId: string;
    playerName: string;
    timeSeconds: number;
}
