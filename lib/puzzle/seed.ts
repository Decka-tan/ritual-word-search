/**
 * Seeded random number generator using Mulberry32 algorithm.
 * Provides deterministic random numbers for reproducible puzzle generation.
 */

export function seededRandom(seed: number): () => number {
    let state = seed >>> 0;

    return () => {
        state |= 0;
        state = (state + 0x6D2B79F5) | 0;
        let t = Math.imul(state ^ (state >>> 15), state | 1);
        t = (t + Math.imul(t ^ (t >>> 7), t | 61)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generate a random seed from the current time.
 */
export function generateRandomSeed(): number {
    return Date.now() ^ (Math.random() * 0xFFFFFFFF);
}

/**
 * Shuffle an array in place using a seeded random function.
 */
export function seededShuffle<T>(array: T[], random: () => number): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Get a random integer between min (inclusive) and max (exclusive) using seeded random.
 */
export function seededRandomInt(min: number, max: number, random: () => number): number {
    return Math.floor(random() * (max - min)) + min;
}

/**
 * Get a random item from an array using seeded random.
 */
export function seededRandomItem<T>(array: T[], random: () => number): T {
    return array[seededRandomInt(0, array.length, random)];
}
