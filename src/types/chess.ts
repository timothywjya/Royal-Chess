export type PieceColor = 'w' | 'b';
export type PieceType = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme' | 'insane';
export type GameStatus = 'playing' | 'check' | 'checkmate' | 'stalemate' | 'draw';
export type GameMode = 'pvai' | 'pvp';

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  depth: number;
  description: string;
  stars: number;
  color: string;
}

export interface MoveHistory {
  san: string;
  from: string;
  to: string;
  color: PieceColor;
  piece: string;
  captured?: string;
}

export interface GameState {
  fen: string;
  turn: PieceColor;
  status: GameStatus;
  moveHistory: MoveHistory[];
  capturedByWhite: string[];
  capturedByBlack: string[];
  isFlipped: boolean;
  difficulty: Difficulty;
  gameMode: GameMode;
  isThinking: boolean;
  evaluation: number;
  selectedSquare: string | null;
  legalMovesFrom: string[];
  lastMove: { from: string; to: string } | null;
  inCheck: boolean;
  kingSquare: string | null;
}

export interface ChessSquare {
  square: string;
  piece: { type: PieceType; color: PieceColor } | null;
  isLight: boolean;
  rank: number;
  file: number;
}
