import { Chess } from 'chess.js';
import type { Difficulty } from '@/types/chess';
import { DIFFICULTY_CONFIGS } from './constants';

// Piece-Square Tables (from white's perspective)
const PST: Record<string, number[][]> = {
  p: [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [ 5,  5, 10, 25, 25, 10,  5,  5],
    [ 0,  0,  0, 20, 20,  0,  0,  0],
    [ 5, -5,-10,  0,  0,-10, -5,  5],
    [ 5, 10, 10,-20,-20, 10, 10,  5],
    [ 0,  0,  0,  0,  0,  0,  0,  0],
  ],
  n: [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50],
  ],
  b: [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20],
  ],
  r: [
    [ 0,  0,  0,  0,  0,  0,  0,  0],
    [ 5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [ 0,  0,  0,  5,  5,  0,  0,  0],
  ],
  q: [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [ -5,  0,  5,  5,  5,  5,  0, -5],
    [  0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20],
  ],
  k: [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [ 20, 20,  0,  0,  0,  0, 20, 20],
    [ 20, 30, 10,  0,  0, 10, 30, 20],
  ],
};

const PIECE_VALUES: Record<string, number> = {
  p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000,
};

function squareToIndex(square: string): [number, number] {
  const file = square.charCodeAt(0) - 97;
  const rank = 8 - parseInt(square[1]);
  return [rank, file];
}

function evaluateBoard(chess: Chess): number {
  if (chess.isCheckmate()) return chess.turn() === 'w' ? -99999 : 99999;
  if (chess.isDraw() || chess.isStalemate()) return 0;

  let score = 0;
  const board = chess.board();

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) continue;
      const val = PIECE_VALUES[piece.type] || 0;
      const pstRow = piece.color === 'w' ? r : 7 - r;
      const pst = PST[piece.type]?.[pstRow]?.[c] || 0;
      score += piece.color === 'w' ? val + pst : -(val + pst);
    }
  }
  return score;
}

function orderMoves(chess: Chess, moves: ReturnType<Chess['moves']>) {
  return moves.sort((a, b) => {
    const scoreMove = (m: string) => {
      let s = 0;
      if (m.includes('x')) s += 200;
      if (m.includes('=')) s += 150;
      if (m.includes('+')) s += 100;
      if (m.includes('#')) s += 500;
      return s;
    };
    return scoreMove(b) - scoreMove(a);
  });
}

function minimax(
  chess: Chess,
  depth: number,
  alpha: number,
  beta: number,
  maximizing: boolean
): number {
  if (depth === 0 || chess.isGameOver()) return evaluateBoard(chess);

  const moves = orderMoves(chess, chess.moves());

  if (maximizing) {
    let maxVal = -Infinity;
    for (const move of moves) {
      chess.move(move);
      const val = minimax(chess, depth - 1, alpha, beta, false);
      chess.undo();
      maxVal = Math.max(maxVal, val);
      alpha = Math.max(alpha, val);
      if (beta <= alpha) break;
    }
    return maxVal;
  } else {
    let minVal = Infinity;
    for (const move of moves) {
      chess.move(move);
      const val = minimax(chess, depth - 1, alpha, beta, true);
      chess.undo();
      minVal = Math.min(minVal, val);
      beta = Math.min(beta, val);
      if (beta <= alpha) break;
    }
    return minVal;
  }
}

export function getBestMove(fen: string, difficulty: Difficulty): string | null {
  const chess = new Chess(fen);
  if (chess.isGameOver()) return null;

  const config = DIFFICULTY_CONFIGS.find(d => d.id === difficulty);
  const depth = config?.depth ?? 2;
  const moves = chess.moves();
  if (!moves.length) return null;

  // Easy: add randomness
  if (difficulty === 'easy') {
    const rand = Math.random();
    if (rand < 0.4) return moves[Math.floor(Math.random() * moves.length)];
  }
  if (difficulty === 'medium') {
    const rand = Math.random();
    if (rand < 0.15) return moves[Math.floor(Math.random() * moves.length)];
  }

  const isMaximizing = chess.turn() === 'w';
  let bestMove = moves[0];
  let bestVal = isMaximizing ? -Infinity : Infinity;

  const shuffled = [...moves].sort(() => Math.random() * 0.3 - 0.15);

  for (const move of shuffled) {
    chess.move(move);
    const val = minimax(chess, depth - 1, -Infinity, Infinity, !isMaximizing);
    chess.undo();
    if (isMaximizing ? val > bestVal : val < bestVal) {
      bestVal = val;
      bestMove = move;
    }
  }

  return bestMove;
}

export function getEvaluation(fen: string): number {
  const chess = new Chess(fen);
  return evaluateBoard(chess);
}
