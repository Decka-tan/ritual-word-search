/**
 * Database query functions for puzzles.
 */

import { getServiceRoleClient } from './client';
import { PuzzleRow, rowToPuzzle, puzzleToInsert } from './types';
import { Puzzle } from '../puzzle/types';

// Generate a secure random edit key
export function generateEditKey(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a new puzzle in the database.
 */
export async function createPuzzle(data: {
    title: string;
    description: string | null;
    words: string[];
    size: number;
    allowDiagonal: boolean;
    allowBackward: boolean;
    seed: number | null;
    grid: string[][];
    placements: unknown[];
}): Promise<Puzzle> {
    const supabase = getServiceRoleClient();
    const editKey = generateEditKey();

    const insert = puzzleToInsert({ ...data, editKey });

    const { data: puzzle, error } = await supabase
        .from('puzzles')
        .insert(insert)
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create puzzle: ${error.message}`);
    }

    return rowToPuzzle(puzzle as PuzzleRow);
}

/**
 * Get a puzzle by ID (includes editKey for validation).
 */
export async function getPuzzleById(id: string): Promise<Puzzle | null> {
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
        .from('puzzles')
        .select()
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }

    return rowToPuzzle(data as PuzzleRow);
}

/**
 * Update a puzzle (validates editKey).
 */
export async function updatePuzzle(
    id: string,
    editKey: string,
    updates: {
        title?: string;
        description?: string | null;
        words?: string[];
        size?: number;
        allowDiagonal?: boolean;
        allowBackward?: boolean;
        seed?: number | null;
        grid?: string[][];
        placements?: unknown[];
    }
): Promise<Puzzle | null> {
    const supabase = getServiceRoleClient();

    // First verify the edit key
    const existing = await getPuzzleById(id);

    if (!existing) {
        return null;
    }

    // Constant-time comparison to prevent timing attacks
    if (!constantTimeEqual(existing.editKey, editKey)) {
        throw new Error('Invalid edit key');
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.description !== undefined) updateData.description = updates.description;
    if (updates.words !== undefined) updateData.words = updates.words;
    if (updates.size !== undefined) updateData.size = updates.size;
    if (updates.allowDiagonal !== undefined) updateData.allow_diagonal = updates.allowDiagonal;
    if (updates.allowBackward !== undefined) updateData.allow_backward = updates.allowBackward;
    if (updates.seed !== undefined) updateData.seed = updates.seed;
    if (updates.grid !== undefined) updateData.grid = updates.grid;
    if (updates.placements !== undefined) updateData.placements = updates.placements;

    const { data, error } = await supabase
        .from('puzzles')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

    if (error || !data) {
        throw new Error(`Failed to update puzzle: ${error?.message}`);
    }

    return rowToPuzzle(data as PuzzleRow);
}

/**
 * Delete a puzzle (validates editKey).
 */
export async function deletePuzzle(id: string, editKey: string): Promise<boolean> {
    const supabase = getServiceRoleClient();

    // First verify the edit key
    const existing = await getPuzzleById(id);

    if (!existing) {
        return false;
    }

    // Constant-time comparison to prevent timing attacks
    if (!constantTimeEqual(existing.editKey, editKey)) {
        throw new Error('Invalid edit key');
    }

    const { error } = await supabase
        .from('puzzles')
        .delete()
        .eq('id', id);

    if (error) {
        throw new Error(`Failed to delete puzzle: ${error.message}`);
    }

    return true;
}

/**
 * Constant-time string comparison to prevent timing attacks.
 */
function constantTimeEqual(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false;
    }

    const encoder = new TextEncoder();
    const bufferA = encoder.encode(a);
    const bufferB = encoder.encode(b);

    let result = 0;
    for (let i = 0; i < bufferA.length; i++) {
        result |= bufferA[i] ^ bufferB[i];
    }

    return result === 0;
}
