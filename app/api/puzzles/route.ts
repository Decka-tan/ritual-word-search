/**
 * API route for creating puzzles.
 * POST /api/puzzles
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePuzzle } from '@/lib/puzzle/generator';
import { validateCreateInput } from '@/lib/puzzle/validator';
import { createPuzzle } from '@/lib/supabase/queries';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Validate input
        const input = validateCreateInput(body);

        // Generate puzzle
        const generated = generatePuzzle(
            input.words,
            input.options,
            input.seed
        );

        // Save to database
        const puzzle = await createPuzzle({
            title: input.title,
            description: input.description ?? null,
            words: input.words,
            size: input.options.size,
            allowDiagonal: input.options.allowDiagonal,
            allowBackward: input.options.allowBackward,
            seed: input.seed ?? null,
            grid: generated.grid,
            placements: generated.placements,
        });

        return NextResponse.json(puzzle, { status: 201 });
    } catch (error) {
        console.error('Error creating puzzle:', error);

        if (error instanceof Error) {
            // Handle validation errors
            if (error.message.includes('No valid words')) {
                return NextResponse.json(
                    { error: 'Invalid words. Each word must be 2-20 letters.' },
                    { status: 400 }
                );
            }
            if (error.message.includes('Failed to place')) {
                return NextResponse.json(
                    { error: 'Could not fit all words in the grid. Try a larger grid or fewer words.' },
                    { status: 400 }
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

// GET /api/puzzles - List recent puzzles (optional, for future use)
export async function GET() {
    return NextResponse.json(
        { error: 'Not implemented' },
        { status: 501 }
    );
}
