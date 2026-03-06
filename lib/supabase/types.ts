/**
 * Supabase database types.
 * These types match the database schema.
 */

import { Puzzle, WordPlacement } from '../puzzle/types';

export interface Database {
    public: {
        Tables: {
            puzzles: {
                Row: PuzzleRow;
                Insert: PuzzleInsert;
                Update: PuzzleUpdate;
            };
        };
    };
}

export interface PuzzleRow {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    author_name: string | null;
    words: string[];
    size: number;
    allow_diagonal: boolean;
    allow_backward: boolean;
    seed: number | null;
    grid: string[][];
    placements: Placement[];
    edit_key: string;
    created_at: string;
}

export interface PuzzleInsert {
    id?: string;
    slug?: string;
    title: string;
    description?: string | null;
    author_name?: string | null;
    words: string[];
    size: number;
    allow_diagonal: boolean;
    allow_backward: boolean;
    seed?: number | null;
    grid: string[][];
    placements: Placement[];
    edit_key: string;
    created_at?: string;
}

export interface PuzzleUpdate {
    id?: string;
    title?: string;
    description?: string | null;
    words?: string[];
    size?: number;
    allow_diagonal?: boolean;
    allow_backward?: boolean;
    seed?: number | null;
    grid?: string[][];
    placements?: Placement[];
    edit_key?: string;
    created_at?: string;
}

export interface Placement {
    word: string;
    startRow: number;
    startCol: number;
    direction: string;
    endRow: number;
    endCol: number;
}

// Helper to convert DB row to app types
export function rowToPuzzle(row: PuzzleRow): Puzzle {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        description: row.description,
        authorName: row.author_name,
        words: row.words,
        size: row.size,
        allowDiagonal: row.allow_diagonal,
        allowBackward: row.allow_backward,
        seed: row.seed,
        grid: row.grid,
        placements: row.placements as WordPlacement[],
        editKey: row.edit_key,
        createdAt: row.created_at,
    };
}

// Helper to convert app types to DB insert
export function puzzleToInsert(data: {
    id?: string;
    slug?: string;
    title: string;
    description: string | null | undefined;
    authorName: string | null | undefined;
    words: string[];
    size: number;
    allowDiagonal: boolean;
    allowBackward: boolean;
    seed: number | null;
    grid: string[][];
    placements: unknown[];
    editKey: string;
}): PuzzleInsert {
    return {
        id: data.id,
        slug: data.slug,
        title: data.title,
        description: data.description ?? null,
        author_name: data.authorName ?? null,
        words: data.words,
        size: data.size,
        allow_diagonal: data.allowDiagonal,
        allow_backward: data.allowBackward,
        seed: data.seed,
        grid: data.grid,
        placements: data.placements as Placement[],
        edit_key: data.editKey,
    };
}
