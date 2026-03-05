import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { generateWordSearch, getCellsInLine, Word, Position } from '../utils/wordSearch';

const WORDS_TO_FIND = ['RITUAL', 'DECKA', 'VIBE', 'CODING', 'DESIGN', 'ANIME'];
const GRID_SIZE = 12;

export default function WordSearchGame() {
  const [grid, setGrid] = useState<string[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startPos, setStartPos] = useState<Position | null>(null);
  const [currentPos, setCurrentPos] = useState<Position | null>(null);
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());

  useEffect(() => {
    const { grid: newGrid, placedWords } = generateWordSearch(WORDS_TO_FIND, GRID_SIZE);
    setGrid(newGrid);
    setWords(placedWords);
  }, []);

  const handlePointerDown = (r: number, c: number) => {
    setIsSelecting(true);
    setStartPos({ r, c });
    setCurrentPos({ r, c });
  };

  const handlePointerEnter = (r: number, c: number) => {
    if (isSelecting) {
      setCurrentPos({ r, c });
    }
  };

  const handlePointerUp = () => {
    if (!isSelecting || !startPos || !currentPos) {
      setIsSelecting(false);
      setStartPos(null);
      setCurrentPos(null);
      return;
    }

    const selectedCells = getCellsInLine(startPos, currentPos);
    const selectedWord = selectedCells.map(pos => grid[pos.r][pos.c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');

    let foundMatch = false;
    const newWords = words.map(w => {
      if (!w.found && (w.word === selectedWord || w.word === reversedWord)) {
        const matchForward = w.positions.every((p, i) => p.r === selectedCells[i]?.r && p.c === selectedCells[i]?.c);
        const matchReverse = w.positions.every((p, i) => p.r === selectedCells[selectedCells.length - 1 - i]?.r && p.c === selectedCells[selectedCells.length - 1 - i]?.c);
        
        if (matchForward || matchReverse) {
          foundMatch = true;
          return { ...w, found: true };
        }
      }
      return w;
    });

    if (foundMatch) {
      setWords(newWords);
      const newFoundCells = new Set(foundCells);
      selectedCells.forEach(pos => newFoundCells.add(`${pos.r},${pos.c}`));
      setFoundCells(newFoundCells);
    }

    setIsSelecting(false);
    setStartPos(null);
    setCurrentPos(null);
  };

  const selectedCellsSet = new Set(
    isSelecting && startPos && currentPos 
      ? getCellsInLine(startPos, currentPos).map(p => `${p.r},${p.c}`)
      : []
  );

  const isGameComplete = words.length > 0 && words.every(w => w.found);

  return (
    <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center w-full max-w-5xl mx-auto">
      <div 
        className="relative bg-surface p-4 sm:p-6 rounded-2xl border border-border shadow-2xl touch-none"
        onPointerLeave={handlePointerUp}
        onPointerUp={handlePointerUp}
      >
        <div 
          className="grid gap-1" 
          style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
        >
          {grid.map((row, r) => (
            row.map((letter, c) => {
              const posKey = `${r},${c}`;
              const isSelected = selectedCellsSet.has(posKey);
              const isFound = foundCells.has(posKey);

              return (
                <motion.div
                  key={posKey}
                  onPointerDown={() => handlePointerDown(r, c)}
                  onPointerEnter={() => handlePointerEnter(r, c)}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center 
                    text-base sm:text-lg md:text-xl font-mono font-medium rounded-md cursor-pointer select-none
                    transition-colors duration-150
                    ${isSelected ? 'bg-accent/20 text-accent border border-accent/50' : 
                      isFound ? 'bg-white/10 text-white border border-white/20' : 
                      'bg-transparent text-text-secondary hover:bg-white/5 hover:text-white'}
                  `}
                  whileHover={{ scale: 1.05, transition: { duration: 0.15, ease: "easeOut" } }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isSelected ? 1.1 : isFound ? [1, 1.1, 1] : 1,
                    transition: { duration: isFound && !isSelected ? 0.4 : 0.15 }
                  }}
                >
                  {letter}
                </motion.div>
              );
            })
          ))}
        </div>
        
        {isGameComplete && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-bg/60 rounded-2xl"
          >
            <div className="text-center">
              <motion.h3 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-4xl font-display text-accent mb-4 tracking-wider uppercase"
              >
                Ritual Complete
              </motion.h3>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-accent transition-colors duration-300"
              >
                Play Again
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>

      <div className="flex flex-col gap-6 min-w-[200px] w-full lg:w-auto px-4 lg:px-0">
        <h3 className="text-sm font-mono text-text-secondary uppercase tracking-widest">Targets</h3>
        <div className="flex flex-row lg:flex-col flex-wrap gap-4 lg:gap-3">
          {words.map((w) => (
            <motion.div 
              key={w.word}
              className={`flex items-center gap-3 ${w.found ? 'opacity-50' : 'opacity-100'}`}
              animate={{ x: w.found ? 10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${w.found ? 'bg-accent' : 'bg-border'}`} />
              <span className={`font-mono text-lg tracking-wider ${w.found ? 'text-accent line-through decoration-accent/50' : 'text-white'}`}>
                {w.word}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
