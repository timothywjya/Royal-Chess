'use client';

import { useMemo } from 'react';
import { Chess, Square } from 'chess.js';
import ChessSquareComponent from './ChessSquare';
import { useGameStore } from '@/hooks/useGameStore';
import { FILES, RANKS } from '@/lib/constants';
import type { PieceColor, PieceType } from '@/types/chess';

const SQUARE_SIZE = 72;

export default function ChessBoard() {
  const {
    fen, isFlipped, selectedSquare, legalMovesFrom,
    lastMove, inCheck, kingSquare, selectSquare,
  } = useGameStore();

  // 1. Memoize instance chess berdasarkan FEN
  const chess = useMemo(() => new Chess(fen), [fen]);
  
  // 2. Memoize board agar tidak berubah-ubah referensinya jika FEN tetap
  const board = useMemo(() => chess.board(), [chess]);

  const squares = useMemo(() => {
    const files = isFlipped ? [...FILES].reverse() : FILES;
    const ranks = isFlipped ? [...RANKS].reverse() : RANKS;
    const result = [];

    for (let ri = 0; ri < 8; ri++) {
      for (let fi = 0; fi < 8; fi++) {
        const file = files[fi];
        const rank = ranks[ri];
        const sq = (file + rank) as Square; // Cast ke Square agar type-safe
        const boardRank = 8 - parseInt(rank);
        const boardFile = file.charCodeAt(0) - 97;
        const rawPiece = board[boardRank][boardFile];

        result.push({
          square: sq,
          piece: rawPiece as { type: PieceType; color: PieceColor } | null,
          isLight: (boardRank + boardFile) % 2 === 0,
          isSelected: selectedSquare === sq,
          isLastMove: !!(lastMove && (lastMove.from === sq || lastMove.to === sq)),
          isLegalTarget: legalMovesFrom.includes(sq),
          isInCheck: inCheck && kingSquare === sq,
          showRankLabel: fi === (isFlipped ? 7 : 0), // Label menyesuaikan flip
          showFileLabel: ri === (isFlipped ? 0 : 7),
          fileLabel: file,
          rankLabel: rank,
        });
      }
    }
    return result;
    // Hapus 'fen' dari sini karena fungsinya sudah diwakili oleh 'board'
  }, [isFlipped, selectedSquare, legalMovesFrom, lastMove, inCheck, kingSquare, board]);

  return (
    <div
      className="chess-board rounded-sm overflow-hidden"
      style={{
        width: SQUARE_SIZE * 8,
        height: SQUARE_SIZE * 8,
        boxShadow: '0 24px 80px rgba(0,0,0,0.6), 0 8px 24px rgba(0,0,0,0.4)',
      }}
    >
      {squares.map(sq => (
        <ChessSquareComponent
          key={sq.square}
          {...sq}
          squareSize={SQUARE_SIZE}
          onClick={selectSquare}
        />
      ))}
    </div>
  );
}
