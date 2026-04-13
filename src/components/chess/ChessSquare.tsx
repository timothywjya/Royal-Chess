'use client';

import { PIECE_UNICODE } from '@/lib/constants';
import type { PieceColor, PieceType } from '@/types/chess';
import clsx from 'clsx';

interface Props {
  square: string;
  piece: { type: PieceType; color: PieceColor } | null;
  isLight: boolean;
  isSelected: boolean;
  isLastMove: boolean;
  isLegalTarget: boolean;
  isInCheck: boolean;
  showFileLabel: boolean;
  showRankLabel: boolean;
  fileLabel: string;
  rankLabel: string;
  onClick: (square: string) => void;
  squareSize: number;
}

export default function ChessSquareComponent({
  square, piece, isLight, isSelected, isLastMove,
  isLegalTarget, isInCheck, showFileLabel, showRankLabel,
  fileLabel, rankLabel, onClick, squareSize,
}: Props) {
  const hasCapture = isLegalTarget && piece !== null;

  return (
    <div
      className={clsx('chess-square', isLight ? 'light' : 'dark', {
        'selected': isSelected,
        'last-move': isLastMove && !isSelected,
        'in-check': isInCheck,
        'move-dot': isLegalTarget && !hasCapture,
        'capture-ring': hasCapture,
      })}
      style={{ width: squareSize, height: squareSize }}
      onClick={() => onClick(square)}
    >
      {/* Coordinate labels */}
      {showRankLabel && (
        <span className="board-coord" style={{ top: 2, left: 3, color: isLight ? '#B58863' : '#F0D9B5' }}>
          {rankLabel}
        </span>
      )}
      {showFileLabel && (
        <span className="board-coord" style={{ bottom: 2, right: 3, color: isLight ? '#B58863' : '#F0D9B5' }}>
          {fileLabel}
        </span>
      )}

      {/* Chess piece */}
      {piece && (
        <span
          className="chess-piece select-none"
          style={{ fontSize: squareSize * 0.76 }}
        >
          {PIECE_UNICODE[piece.color + piece.type]}
        </span>
      )}
    </div>
  );
}
