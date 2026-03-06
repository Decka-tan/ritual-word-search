/**
 * API route for leaderboard scores.
 * POST /api/leaderboard - Submit a score
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { puzzleId, playerName, timeSeconds, completedAt, timeChecksum } = body;

        // Validate
        if (!puzzleId || !playerName || typeof timeSeconds !== 'number') {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (playerName.length > 30) {
            return NextResponse.json(
                { error: 'Player name too long (max 30 characters)' },
                { status: 400 }
            );
        }

        if (timeSeconds < 0) {
            return NextResponse.json(
                { error: 'Time must be positive' },
                { status: 400 }
            );
        }

        // Server-side validation: check if time is reasonable
        // 1. Check if completedAt is provided and recent (within 1 hour)
        if (completedAt) {
            const timeDiff = Date.now() - completedAt;
            const oneHour = 60 * 60 * 1000;

            if (timeDiff > oneHour) {
                return NextResponse.json(
                    { error: 'Invalid submission time. Please complete the puzzle again.' },
                    { status: 400 }
                );
            }

            // 2. Validate checksum matches
            const expectedChecksum = `${timeSeconds}-${completedAt}`;
            if (timeChecksum !== expectedChecksum) {
                return NextResponse.json(
                    { error: 'Invalid time data. Please complete the puzzle honestly.' },
                    { status: 400 }
                );
            }
        }

        // 3. Check for impossibly fast times (less than 1 second per word minimum)
        // This is a basic heuristic - can be improved
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/puzzles/${puzzleId}`);
        if (response.ok) {
            const puzzleData = await response.json();
            const puzzle = puzzleData.puzzle;
            const wordCount = puzzle.words.length;

            // Reasonable minimum: 1 second per word + 5 seconds buffer
            const minReasonableTime = (wordCount * 1) + 5;

            if (timeSeconds < minReasonableTime && timeSeconds < wordCount) {
                return NextResponse.json(
                    { error: `Suspicious time: ${timeSeconds}s for ${wordCount} words. Minimum: ${minReasonableTime}s` },
                    { status: 400 }
                );
            }
        }

        const supabase = getServiceRoleClient();

        const { data, error } = await supabase
            .from('leaderboard')
            .insert({
                puzzle_id: puzzleId,
                player_name: playerName.trim(),
                time_seconds: timeSeconds,
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to submit score: ${error.message}`);
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Error submitting score:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to submit score' },
            { status: 500 }
        );
    }
}
