require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3001;

// ==================== CONFIG ====================

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000'];

// ==================== RATE LIMITERS ====================

// For /start-game - prevent session spam
const startGameLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 10, // max 10 game starts per minute per IP
  message: { error: 'Too many game starts. Please wait.' },
  standardHeaders: true,
  keyGenerator: (req) => req.ip || req.connection.remoteAddress
});

// For /submit-score - prevent score spam
const submitScoreLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 5, // max 5 submits per minute per IP
  message: { error: 'Too many submissions. Please try again later.' },
  standardHeaders: true,
  keyGenerator: (req) => req.ip || req.connection.remoteAddress
});

// ==================== MIDDLEWARE ====================

app.use(express.json({ limit: '1kb' }));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: false
}));

app.use('/api/start-game', startGameLimiter);
app.use('/api/submit-score', submitScoreLimiter);

// ==================== GAME SESSIONS ====================

const gameSessions = new Map();

setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [sessionId, session] of gameSessions.entries()) {
    if (now - session.createdAt > 3600000) {
      gameSessions.delete(sessionId);
      cleaned++;
    }
  }
  if (cleaned > 0) console.log(`Cleaned ${cleaned} expired sessions`);
}, 300000);

// ==================== VALIDATION ====================

function validatePlayerName(name) {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Player name is required' };
  }
  const trimmed = name.trim();
  if (trimmed.length < 1 || trimmed.length > 30) {
    return { valid: false, error: 'Player name must be 1-30 characters' };
  }
  // XSS sanitize
  const sanitized = trimmed
    .replace(/<[^>]*>/g, '')
    .replace(/[<>\"'']/g, '')
    .replace(/[\x00-\x1f\x7f-\x9f]/g, '');
  if (sanitized.length === 0) {
    return { valid: false, error: 'Invalid characters in name' };
  }
  return { valid: true, sanitized };
}

// ==================== SUPABASE HELPERS ====================

async function verifyPuzzleExists(puzzleId) {
  const response = await fetch(
    `${process.env.SUPABASE_URL}/rest/v1/puzzles?id=eq.${puzzleId}&select=id`,
    {
      headers: {
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      }
    }
  );
  if (!response.ok) return { valid: false, error: 'Puzzle not found' };
  const data = await response.json();
  if (!data || data.length === 0) return { valid: false, error: 'Puzzle not found' };
  return { valid: true };
}

async function submitToSupabase(puzzleId, playerName, timeSeconds) {
  const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/leaderboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
    },
    body: JSON.stringify({
      puzzle_id: puzzleId,  // ← Fix: use snake_case for Supabase
      player_name: playerName,
      time_seconds: timeSeconds
    })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to submit');
  }
  return await response.json();
}

// ==================== ROUTES ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    activeSessions: gameSessions.size
  });
});

// START GAME
app.post('/api/start-game', (req, res) => {
  try {
    const { puzzle_id } = req.body;

    if (!puzzle_id || !validator.isUUID(puzzle_id)) {
      return res.status(400).json({ error: 'Invalid puzzle_id' });
    }

    const sessionId = crypto.randomBytes(16).toString('hex');
    const startTime = Date.now();

    gameSessions.set(sessionId, {
      puzzleId,  // ← Store for submit
      startTime,
      createdAt: Date.now(),
      submitted: false
    });

    res.json({ session_id: sessionId, start_time: startTime });

  } catch (error) {
    console.error('Error starting game:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// SUBMIT SCORE
app.post('/api/submit-score', async (req, res) => {
  try {
    const { session_id, player_name } = req.body;

    // Validate session
    if (!session_id) {
      return res.status(400).json({ error: 'session_id required' });
    }

    const session = gameSessions.get(session_id);
    if (!session) {
      return res.status(400).json({ error: 'Invalid session' });
    }

    if (session.submitted) {
      return res.status(400).json({ error: 'Already submitted' });
    }

    // Validate player name
    const nameValidation = validatePlayerName(player_name);
    if (!nameValidation.valid) {
      return res.status(400).json({ error: nameValidation.error });
    }

    // Calculate time on SERVER
    const timeSeconds = Math.floor((Date.now() - session.startTime) / 1000);

    if (timeSeconds < 10) {
      return res.status(400).json({ error: 'Too fast (min 10s)' });
    }

    if (timeSeconds > 3600) {
      return res.status(400).json({ error: 'Too long (max 1h)' });
    }

    // Verify puzzle exists
    const puzzleCheck = await verifyPuzzleExists(session.puzzleId);
    if (!puzzleCheck.valid) {
      return res.status(404).json({ error: 'Puzzle not found' });
    }

    // Mark submitted BEFORE DB call (replay prevention)
    session.submitted = true;
    gameSessions.set(session_id, session);

    // Submit to Supabase
    await submitToSupabase(session.puzzleId, nameValidation.sanitized, timeSeconds);

    // Cleanup after 1 second
    setTimeout(() => gameSessions.delete(session_id), 1000);

    res.json({ success: true, time_seconds: timeSeconds });

  } catch (error) {
    console.error('Error submitting:', error);
    res.status(500).json({ error: 'Failed to submit' });
  }
});

// GET LEADERBOARD (public read - uses ANON key)
app.get('/api/leaderboard/:puzzleId', async (req, res) => {
  try {
    const { puzzleId } = req.params;
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    if (!validator.isUUID(puzzleId)) {
      return res.status(400).json({ error: 'Invalid puzzle_id' });
    }

    // Use ANON key for public read (not service_role)
    const response = await fetch(
      `${process.env.SUPABASE_URL}/rest/v1/leaderboard` +
      `?puzzle_id=eq.${puzzleId}` +
      `&order=time_seconds.asc` +
      `&limit=${limit}&offset=${offset}`,
      {
        headers: {
          'apikey': process.env.SUPABASE_ANON_KEY,  // ← FIX: Use ANON key
          'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    const data = await response.json();

    res.json({
      puzzle_id: puzzleId,
      entries: data || [],
      limit,
      offset
    });

  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Error handlers
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: process.env.NODE_ENV === 'production' ? 'Server error' : err.message });
});

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
  console.log(`Origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
