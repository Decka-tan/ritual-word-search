/**
 * API route for leaderboard scores.
 * POST /api/leaderboard - Submit a score
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServiceRoleClient } from '@/lib/supabase/client';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { puzzleId, playerName, timeSeconds, completedAt, timeChecksum } = body;

        // Get client IP for rate limiting
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
                   request.headers.get('x-real-ip') ||
                   'unknown';

        // Rate limiting: per puzzle + per IP (3 submissions per minute per puzzle)
        const puzzleRateLimit = rateLimit(`${puzzleId}:${ip}`, 3, 60 * 1000);
        if (!puzzleRateLimit.success) {
            return NextResponse.json(
                {
                    error: 'Too many submissions for this puzzle. Please wait a minute.',
                    retryAfter: Math.ceil((puzzleRateLimit.resetTime! - Date.now()) / 1000),
                },
                { status: 429 }
            );
        }

        // Rate limiting: global (max 10 submissions per minute per IP)
        const globalRateLimit = rateLimit(`global:${ip}`, 10, 60 * 1000);
        if (!globalRateLimit.success) {
            return NextResponse.json(
                {
                    error: 'Too many submissions. Please wait a minute.',
                    retryAfter: Math.ceil((globalRateLimit.resetTime! - Date.now()) / 1000),
                },
                { status: 429 }
            );
        }

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
