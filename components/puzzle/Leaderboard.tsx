'use client';

import { useEffect, useState } from 'react';

interface LeaderboardEntry {
    rank: number;
    playerName: string;
    timeSeconds: number;
    createdAt?: string;
}

interface LeaderboardProps {
    puzzleId: string;
    refreshKey?: number;
}

export function Leaderboard({ puzzleId, refreshKey }: LeaderboardProps) {
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
    }, [puzzleId, refreshKey]);

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimestamp = (timestamp?: string): string => {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${diffDays}d ago`;
    };

    const getRankStyle = (rank: number): string => {
        switch (rank) {
            case 1:
                return 'bg-orange-500 text-white';
            case 2:
                return 'bg-yellow-500 text-gray-900';
            case 3:
                return 'bg-blue-500 text-white';
            default:
                return 'bg-border text-text-primary';
        }
    };

    if (loading) {
        return (
            <div className="p-4">
                <h3 className="text-base font-bold mb-3 text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
                    <span>🏆</span>
                    <span>LEADERBOARD</span>
                </h3>
                <p className="text-text-secondary text-sm">Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h3 className="text-base font-bold mb-3 text-text-primary font-mono uppercase tracking-wider flex items-center gap-2">
                <span>🏆</span>
                <span>LEADERBOARD</span>
            </h3>

            {entries.length === 0 ? (
                <p className="text-text-secondary text-xs text-center py-3 font-mono uppercase tracking-wider">
                    No scores yet. Be the first!
                </p>
            ) : (
                <ul className="space-y-2">
                    {entries.map((entry) => (
                        <li
                            key={entry.rank}
                            className={`flex items-center gap-2 p-2 rounded-lg ${getRankStyle(entry.rank)}`}
                        >
                            <span className="text-base w-7 text-center font-bold flex-shrink-0">
                                #{entry.rank}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold truncate text-xs">
                                    {entry.playerName}
                                </div>
                                {entry.createdAt && (
                                    <div className="text-[10px] opacity-75 font-mono">
                                        {formatTimestamp(entry.createdAt)}
                                    </div>
                                )}
                            </div>
                            <span className="font-mono font-bold text-xs flex-shrink-0">
                                {formatTime(entry.timeSeconds)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
