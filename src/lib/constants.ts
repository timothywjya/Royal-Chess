import type { DifficultyConfig } from '@/types/chess';

export const DIFFICULTY_CONFIGS: DifficultyConfig[] = [
  {
    id: 'easy',
    label: 'Easy',
    depth: 1,
    description: 'Cocok untuk pemula',
    stars: 1,
    color: 'from-emerald-500 to-green-400',
  },
  {
    id: 'medium',
    label: 'Medium',
    depth: 2,
    description: 'Tantangan moderat',
    stars: 2,
    color: 'from-blue-500 to-cyan-400',
  },
  {
    id: 'hard',
    label: 'Hard',
    depth: 3,
    description: 'Butuh strategi matang',
    stars: 3,
    color: 'from-amber-500 to-yellow-400',
  },
  {
    id: 'extreme',
    label: 'Extreme',
    depth: 4,
    description: 'Untuk pemain berpengalaman',
    stars: 4,
    color: 'from-orange-500 to-red-400',
  },
  {
    id: 'insane',
    label: 'Insane',
    depth: 5,
    description: 'Tingkat grandmaster',
    stars: 5,
    color: 'from-purple-600 to-pink-500',
  },
];

export const PIECE_UNICODE: Record<string, string> = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
};

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
