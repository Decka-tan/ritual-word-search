/**
 * API route for leaderboard scores.
 * POST /api/leaderboard - Submit a score
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { puzzleId, playerName, timeSeconds } = body;

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
