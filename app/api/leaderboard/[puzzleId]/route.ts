/**
 * API route for puzzle-specific leaderboard.
 * GET /api/leaderboard/[puzzleId] - Get top scores for a puzzle
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/client';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ puzzleId: string }> }
) {
    try {
        const { puzzleId } = await params;
        const supabase = getServiceRoleClient();

        const { data, error } = await supabase
            .from('leaderboard')
            .select('id, player_name, time_seconds, created_at')
            .eq('puzzle_id', puzzleId)
            .order('time_seconds', { ascending: true })
            .limit(10);

        if (error) {
            throw new Error(`Failed to fetch leaderboard: ${error.message}`);
        }

        const entries = data || [];

        // Format response
        const formatted = entries.map((entry, index) => ({
            rank: index + 1,
            id: entry.id,
            playerName: entry.player_name,
            timeSeconds: entry.time_seconds,
            createdAt: entry.created_at,
        }));

        return NextResponse.json({ entries: formatted });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch leaderboard' },
            { status: 500 }
        );
    }
}
