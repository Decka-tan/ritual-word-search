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

// Generate UUID for puzzle ID
export function generateUUID(): string {
    return crypto.randomUUID();
}

// Generate slug from title and author name
export function generateSlug(title: string, authorName?: string | null, counter?: number): string {
    const titleSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

    const authorSlug = authorName
        ? authorName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')
        : 'anonymous';

    let slug = `${titleSlug}-${authorSlug}`;

    if (counter && counter > 0) {
        slug = `${slug}-${counter}`;
    }

    return slug;
}

/**
 * Create a new puzzle in the database.
 */
export async function createPuzzle(data: {
    title: string;
    description: string | null;
    authorName: string | null;
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
    const id = generateUUID();

    let counter = 0;
    let lastError: any = null;

    while (counter < 100) { // Max 100 retries
        const slug = generateSlug(data.title, data.authorName, counter);
        const insert = puzzleToInsert({ ...data, id, slug, editKey });

        const { data: puzzle, error } = await supabase
            .from('puzzles')
            .insert(insert)
            .select()
            .single();

        if (!error) {
            return rowToPuzzle(puzzle as PuzzleRow);
        }

        // Check if it's a duplicate key error for slug
        // Postgres unique violation code is 23505
        const isDuplicateError = error.code === '23505' &&
            (error.message.includes('slug') || error.message.includes('puzzles_slug_key'));

        if (isDuplicateError) {
            console.log(`Duplicate slug detected: ${slug}, retrying with counter ${counter + 1}`);
            counter++;
            lastError = error;
            continue; // Try with next counter
        }

        // If it's not a duplicate error, throw immediately
        throw new Error(`Failed to create puzzle: ${error.message}`);
    }

    throw new Error(`Failed to create puzzle: ${lastError?.message || 'Could not generate unique slug'}`);
}

/**
 * Get a puzzle by slug (used for public URLs).
 */
export async function getPuzzleBySlug(slug: string): Promise<Puzzle | null> {
    const supabase = getServiceRoleClient();

    const { data, error } = await supabase
        .from('puzzles')
        .select()
        .eq('slug', slug)
        .single();

    if (error || !data) {
        return null;
    }

    return rowToPuzzle(data as PuzzleRow);
}

/**
 * Get a puzzle by ID (includes editKey for validation) - internal use only.
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
 * Update a puzzle by slug (validates editKey).
 */
export async function updatePuzzle(
    slug: string,
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

    // First verify the edit key by looking up by slug
    const existing = await getPuzzleBySlug(slug);

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
        .eq('id', existing.id)
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
export async function deletePuzzle(slug: string, editKey: string): Promise<boolean> {
    const supabase = getServiceRoleClient();

    // First verify the edit key by looking up by slug
    const existing = await getPuzzleBySlug(slug);

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
        .eq('id', existing.id);

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
