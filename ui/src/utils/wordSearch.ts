export type Position = { r: number; c: number };

export interface Word {
  word: string;
  found: boolean;
  positions: Position[];
}

export function generateWordSearch(words: string[], size: number = 12) {
  const grid = Array(size).fill(null).map(() => Array(size).fill(''));
  const placedWords: Word[] = [];

  const dirs = [
    [0, 1], [1, 0], [1, 1], [-1, 1],
    [0, -1], [-1, 0], [-1, -1], [1, -1]
  ];

  for (const word of words) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      attempts++;
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);

      let canPlace = true;
      const positions: Position[] = [];
      for (let i = 0; i < word.length; i++) {
        const nr = r + dir[0] * i;
        const nc = c + dir[1] * i;
        if (nr < 0 || nr >= size || nc < 0 || nc >= size) {
          canPlace = false;
          break;
        }
        if (grid[nr][nc] !== '' && grid[nr][nc] !== word[i]) {
          canPlace = false;
          break;
        }
        positions.push({ r: nr, c: nc });
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          grid[positions[i].r][positions[i].c] = word[i];
        }
        placedWords.push({ word, found: false, positions });
        placed = true;
      }
    }
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (grid[r][c] === '') {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return { grid, placedWords };
}

export function getCellsInLine(start: Position, end: Position): Position[] {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  
  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  if (steps === 0) return [start];
  
  if (Math.abs(dr) !== 0 && Math.abs(dc) !== 0 && Math.abs(dr) !== Math.abs(dc)) {
    return []; 
  }
  
  const rStep = dr / steps;
  const cStep = dc / steps;
  
  const cells: Position[] = [];
  for (let i = 0; i <= steps; i++) {
    cells.push({
      r: start.r + rStep * i,
      c: start.c + cStep * i
    });
  }
  return cells;
}
