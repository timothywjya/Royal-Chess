'use client';

import { create } from 'zustand';
import { Chess } from 'chess.js';
import type { GameState, Difficulty, GameMode, PieceColor } from '@/types/chess';
import { getBestMove, getEvaluation } from '@/lib/chessEngine';
import { playSound } from '@/lib/soundEngine';

const INITIAL_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

interface GameStore extends GameState {
  initGame: () => void;
  selectSquare: (square: string) => void;
  setDifficulty: (d: Difficulty) => void;
  setGameMode: (m: GameMode) => void;
  flipBoard: () => void;
  undoMove: () => void;
  triggerAiMove: () => Promise<void>;
}

function getGameStatus(chess: Chess): GameState['status'] {
  if (chess.isCheckmate()) return 'checkmate';
  if (chess.isStalemate()) return 'stalemate';
  if (chess.isDraw()) return 'draw';
  if (chess.inCheck()) return 'check';
  return 'playing';
}

function findKingSquare(chess: Chess, color: PieceColor): string | null {
  const board = chess.board();
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const p = board[r][c];
      if (p && p.type === 'k' && p.color === color) {
        const files = 'abcdefgh';
        return files[c] + (8 - r);
      }
    }
  }
  return null;
}

export const useGameStore = create<GameStore>((set, get) => ({
  fen: INITIAL_FEN,
  turn: 'w',
  status: 'playing',
  moveHistory: [],
  capturedByWhite: [],
  capturedByBlack: [],
  isFlipped: false,
  difficulty: 'medium',
  gameMode: 'pvai',
  isThinking: false,
  evaluation: 0,
  selectedSquare: null,
  legalMovesFrom: [],
  lastMove: null,
  inCheck: false,
  kingSquare: null,

  initGame: () => {
    set({
      fen: INITIAL_FEN,
      turn: 'w',
      status: 'playing',
      moveHistory: [],
      capturedByWhite: [],
      capturedByBlack: [],
      selectedSquare: null,
      legalMovesFrom: [],
      lastMove: null,
      inCheck: false,
      kingSquare: null,
      evaluation: 0,
      isThinking: false,
    });
  },

  selectSquare: (square: string) => {
    const state = get();
    if (state.isThinking) return;

    const chess = new Chess(state.fen);
    const status = getGameStatus(chess);
    if (status === 'checkmate' || status === 'stalemate' || status === 'draw') return;

    const piece = chess.get(square as Parameters<typeof chess.get>[0]);
    const isPlayerTurn = state.gameMode === 'pvp' || chess.turn() === 'w';

    // If a square is already selected, try to move
    if (state.selectedSquare && state.legalMovesFrom.includes(square)) {
      try {
        const moveResult = chess.move({
          from: state.selectedSquare,
          to: square,
          promotion: 'q',
        });

        const captured = moveResult.captured;
        const newCapturedByWhite = [...state.capturedByWhite];
        const newCapturedByBlack = [...state.capturedByBlack];

        if (captured) {
          if (moveResult.color === 'w') newCapturedByWhite.push(captured);
          else newCapturedByBlack.push(captured);
        }

        const newFen = chess.fen();
        const newTurn = chess.turn();
        const newStatus = getGameStatus(chess);
        const inCheck = chess.inCheck();
        const kingSquare = inCheck ? findKingSquare(chess, newTurn) : null;

        // Sound effects
        if (newStatus === 'checkmate' || newStatus === 'stalemate' || newStatus === 'draw') {
          // Game over sounds handled by modal
        } else if (inCheck) {
          playSound('check');
        } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
          playSound('castle');
        } else if (captured) {
          playSound('capture');
        } else {
          playSound('move');
        }

        set({
          fen: newFen,
          turn: newTurn,
          status: newStatus,
          capturedByWhite: newCapturedByWhite,
          capturedByBlack: newCapturedByBlack,
          selectedSquare: null,
          legalMovesFrom: [],
          lastMove: { from: state.selectedSquare, to: square },
          inCheck,
          kingSquare,
          evaluation: getEvaluation(newFen),
          moveHistory: [
            ...state.moveHistory,
            {
              san: moveResult.san,
              from: moveResult.from,
              to: moveResult.to,
              color: moveResult.color,
              piece: moveResult.piece,
              captured: moveResult.captured,
            },
          ],
        });

        // Trigger AI move if PvAI and it's black's turn
        if (state.gameMode === 'pvai' && newTurn === 'b' && newStatus === 'playing') {
          setTimeout(() => get().triggerAiMove(), 100);
        }
        return;
      } catch {
        // Invalid move, fall through to select
      }
    }

    // Select a new piece
    if (piece && piece.color === chess.turn() && isPlayerTurn) {
      const legalMoves = chess.moves({ square: square as Parameters<typeof chess.moves>[0]['square'], verbose: true });
      playSound('select');
      set({
        selectedSquare: square,
        legalMovesFrom: legalMoves.map(m => m.to),
      });
    } else {
      set({ selectedSquare: null, legalMovesFrom: [] });
    }
  },

  setDifficulty: (difficulty) => set({ difficulty }),
  setGameMode: (gameMode) => set({ gameMode }),
  flipBoard: () => set(s => ({ isFlipped: !s.isFlipped })),

  undoMove: () => {
    const state = get();
    if (state.isThinking || !state.moveHistory.length) return;

    const chess = new Chess(state.fen);
    // Undo AI move too in PvAI mode
    chess.undo();
    if (state.gameMode === 'pvai' && chess.turn() === 'b') chess.undo();

    const newFen = chess.fen();
    const newHistory = state.moveHistory.slice(0, state.gameMode === 'pvai' ? -2 : -1);

    set({
      fen: newFen,
      turn: chess.turn(),
      status: getGameStatus(chess),
      moveHistory: newHistory,
      selectedSquare: null,
      legalMovesFrom: [],
      lastMove: null,
      inCheck: chess.inCheck(),
      kingSquare: chess.inCheck() ? findKingSquare(chess, chess.turn()) : null,
      evaluation: getEvaluation(newFen),
      capturedByWhite: [],
      capturedByBlack: [],
    });
  },

  triggerAiMove: async () => {
    const state = get();
    if (state.isThinking) return;

    set({ isThinking: true });

    await new Promise(resolve => setTimeout(resolve, 50));

    const bestMove = getBestMove(state.fen, state.difficulty);
    if (!bestMove) {
      set({ isThinking: false });
      return;
    }

    const chess = new Chess(state.fen);
    const moveResult = chess.move(bestMove);
    if (!moveResult) {
      set({ isThinking: false });
      return;
    }

    const captured = moveResult.captured;
    const newCapturedByBlack = [...state.capturedByBlack];
    if (captured) newCapturedByBlack.push(captured);

    const newFen = chess.fen();
    const newTurn = chess.turn();
    const newStatus = getGameStatus(chess);
    const inCheck = chess.inCheck();

    // Sound effects for AI move
    if (newStatus !== 'checkmate' && newStatus !== 'stalemate' && newStatus !== 'draw') {
      if (inCheck) {
        playSound('check');
      } else if (moveResult.flags.includes('k') || moveResult.flags.includes('q')) {
        playSound('castle');
      } else if (captured) {
        playSound('capture');
      } else {
        playSound('move');
      }
    }

    set({
      fen: newFen,
      turn: newTurn,
      status: newStatus,
      capturedByBlack: newCapturedByBlack,
      lastMove: { from: moveResult.from, to: moveResult.to },
      inCheck,
      kingSquare: inCheck ? findKingSquare(chess, newTurn) : null,
      evaluation: getEvaluation(newFen),
      isThinking: false,
      moveHistory: [
        ...state.moveHistory,
        {
          san: moveResult.san,
          from: moveResult.from,
          to: moveResult.to,
          color: moveResult.color,
          piece: moveResult.piece,
          captured: moveResult.captured,
        },
      ],
    });
  },
}));
