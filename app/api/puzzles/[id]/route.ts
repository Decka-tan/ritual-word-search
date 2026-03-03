/**
 * API route for individual puzzle operations.
 * GET /api/puzzles/[id] - Get a puzzle (public)
 * PUT /api/puzzles/[id] - Update a puzzle (requires editKey)
 * DELETE /api/puzzles/[id] - Delete a puzzle (requires editKey)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPuzzleById, updatePuzzle, deletePuzzle } from '@/lib/supabase/queries';
import { validateUpdateInput, validateDeleteInput } from '@/lib/puzzle/validator';
import { generatePuzzle } from '@/lib/puzzle/generator';
import type { Puzzle } from '@/lib/puzzle/types';

// GET /api/puzzles/[id] - Public read access
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const puzzle = await getPuzzleById(id);

        if (!puzzle) {
            return NextResponse.json(
                { error: 'Puzzle not found' },
                { status: 404 }
            );
        }

        // Strip editKey from public response
        const { editKey, ...publicPuzzle } = puzzle;

        return NextResponse.json({ puzzle: publicPuzzle });
    } catch (error) {
        console.error('Error fetching puzzle:', error);
        return NextResponse.json(
            { error: 'Failed to fetch puzzle' },
            { status: 500 }
        );
    }
}

// PUT /api/puzzles/[id] - Update puzzle (requires editKey)
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validate input
        const input = validateUpdateInput(body);

        // Get existing puzzle
        const existing = await getPuzzleById(id);

        if (!existing) {
            return NextResponse.json(
                { error: 'Puzzle not found' },
                { status: 404 }
            );
        }

        // Verify editKey
        if (existing.editKey !== input.editKey) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Prepare updates
        const updates: {
            title?: string;
            description?: string | null;
            words?: string[];
            size?: number;
            allowDiagonal?: boolean;
            allowBackward?: boolean;
            seed?: number | null;
            grid?: string[][];
            placements?: unknown[];
        } = {};

        if (input.title !== undefined) updates.title = input.title;
        if (input.description !== undefined) updates.description = input.description;
        if (input.words !== undefined) updates.words = input.words;
        if (input.options !== undefined) {
            updates.size = input.options.size;
            updates.allowDiagonal = input.options.allowDiagonal;
            updates.allowBackward = input.options.allowBackward;
        }

        // Regenerate puzzle if requested or if words/options changed
        const shouldRegenerate = input.regenerate ||
            input.words !== undefined ||
            input.options !== undefined;

        if (shouldRegenerate) {
            const words = input.words ?? existing.words;
            const options = input.options ?? {
                size: existing.size,
                allowDiagonal: existing.allowDiagonal,
                allowBackward: existing.allowBackward,
            };
            const seed = input.regenerate ? undefined : existing.seed;

            try {
                const generated = generatePuzzle(words, options, seed);
                updates.grid = generated.grid;
                updates.placements = generated.placements;
                updates.seed = seed ?? null;
                updates.words = words;
                updates.size = options.size;
                updates.allowDiagonal = options.allowDiagonal;
                updates.allowBackward = options.allowBackward;
            } catch (genError) {
                if (genError instanceof Error) {
                    return NextResponse.json(
                        { error: genError.message },
                        { status: 400 }
                    );
                }
                throw genError;
            }
        }

        // Update puzzle
        const updated = await updatePuzzle(id, input.editKey, updates);

        if (!updated) {
            return NextResponse.json(
                { error: 'Failed to update puzzle' },
                { status: 500 }
            );
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Error updating puzzle:', error);

        if (error instanceof Error) {
            // Handle validation errors
            if (error.message.includes('Invalid edit key')) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

// DELETE /api/puzzles/[id] - Delete puzzle (requires editKey)
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();

        // Validate input
        const input = validateDeleteInput(body);

        // Delete puzzle (validates editKey internally)
        const deleted = await deletePuzzle(id, input.editKey);

        if (!deleted) {
            return NextResponse.json(
                { error: 'Puzzle not found' },
                { status: 404 }
            );
        }

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Error deleting puzzle:', error);

        if (error instanceof Error) {
            if (error.message.includes('Invalid edit key')) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
