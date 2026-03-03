'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
    rank: number;
    playerName: string;
    timeSeconds: number;
}

interface LeaderboardProps {
    puzzleId: string;
}

export function Leaderboard({ puzzleId }: LeaderboardProps) {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch(`/api/leaderboard/${puzzleId}`);
                if (response.ok) {
                    const data = await response.json();
                    setEntries(data.entries || []);
                }
            } catch (err) {
                console.error('Failed to load leaderboard:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, [puzzleId]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getRankIcon = (rank: number): string => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    const getRankStyle = (rank: number): string => {
        switch (rank) {
            case 1:
                return 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white';
            case 2:
                return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
            case 3:
                return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold mb-4 text-gray-800">🏆 Leaderboard</h3>
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span>🏆</span>
                <span>Leaderboard</span>
            </h3>

            {entries.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">
                    No scores yet. Be the first!
                </p>
            ) : (
                <ul className="space-y-2">
                    {entries.map((entry) => (
                        <li
                            key={entry.id}
                            className={`flex items-center gap-4 p-3 rounded-xl ${getRankStyle(entry.rank)}`}
                        >
                            <span className="text-xl w-10 text-center font-bold">
                                {getRankIcon(entry.rank)}
                            </span>
                            <span className="flex-1 font-semibold truncate">
                                {entry.playerName}
                            </span>
                            <span className="font-mono font-bold">
                                {formatTime(entry.timeSeconds)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
