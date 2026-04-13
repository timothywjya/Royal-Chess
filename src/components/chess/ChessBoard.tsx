'use client';

import { useMemo } from 'react';
import { Chess } from 'chess.js';
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

  const chess = useMemo(() => new Chess(fen), [fen]);
  const board = chess.board();

  const squares = useMemo(() => {
    const files = isFlipped ? [...FILES].reverse() : FILES;
    const ranks = isFlipped ? [...RANKS].reverse() : RANKS;
    const result = [];

    for (let ri = 0; ri < 8; ri++) {
      for (let fi = 0; fi < 8; fi++) {
        const file = files[fi];
        const rank = ranks[ri];
        const sq = file + rank;
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
          showRankLabel: fi === 0,
          showFileLabel: ri === 7,
          fileLabel: file,
          rankLabel: rank,
        });
      }
    }
    return result;
  }, [fen, isFlipped, selectedSquare, legalMovesFrom, lastMove, inCheck, kingSquare, board]);

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
