-- Create leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    puzzle_id TEXT NOT NULL,
    player_name TEXT NOT NULL,
    time_seconds INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    CONSTRAINT player_name_length CHECK (char_length(player_name) <= 30),
    CONSTRAINT time_positive CHECK (time_seconds >= 0)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS leaderboard_puzzle_id_idx ON public.leaderboard(puzzle_id);
CREATE INDEX IF NOT EXISTS leaderboard_time_seconds_idx ON public.leaderboard(time_seconds);
CREATE INDEX IF NOT EXISTS leaderboard_created_at_idx ON public.leaderboard(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read leaderboard
CREATE POLICY "Allow public read access" ON public.leaderboard
    FOR SELECT USING (true);

-- Allow everyone to insert scores
CREATE POLICY "Allow public insert access" ON public.leaderboard
    FOR INSERT WITH CHECK (true);

-- Add comment
COMMENT ON TABLE public.leaderboard IS 'Leaderboard scores for word search puzzles';
