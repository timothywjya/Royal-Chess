'use client';

import { useGameStore } from '@/hooks/useGameStore';
import { PIECE_UNICODE } from '@/lib/constants';
import type { PieceType } from '@/types/chess';

const PIECE_VALUE: Record<PieceType, number> = { q: 9, r: 5, b: 3, n: 3, p: 1, k: 0 };

function sortPieces(pieces: string[]) {
  return [...pieces].sort((a, b) => PIECE_VALUE[b as PieceType] - PIECE_VALUE[a as PieceType]);
}

function calcMaterial(pieces: string[]) {
  return pieces.reduce((s, p) => s + (PIECE_VALUE[p as PieceType] || 0), 0);
}

export default function CapturedPieces() {
  const { capturedByWhite, capturedByBlack } = useGameStore();

  const whiteMat = calcMaterial(capturedByWhite);
  const blackMat = calcMaterial(capturedByBlack);
  const whiteAdv = whiteMat - blackMat;

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="font-cinzel text-[11px] tracking-widest text-amber-400/70 uppercase mb-3">
        Bidak Tertangkap
      </h3>

      {/* White captured (black pieces) */}
      <div className="mb-2">
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 rounded-full bg-white border border-white/30" />
          <span className="text-[10px] text-white/30 font-crimson">Putih menangkap</span>
          {whiteAdv > 0 && <span className="text-[10px] text-amber-400 ml-auto font-cinzel">+{whiteAdv}</span>}
        </div>
        <div className="flex flex-wrap gap-0.5 min-h-[24px]">
          {sortPieces(capturedByWhite).map((p, i) => (
            <span key={i} className="text-lg leading-none" title={p}>
              {PIECE_UNICODE['b' + p]}
            </span>
          ))}
        </div>
      </div>

      {/* Black captured (white pieces) */}
      <div>
        <div className="flex items-center gap-1 mb-1">
          <div className="w-3 h-3 rounded-full bg-gray-800 border border-gray-600" />
          <span className="text-[10px] text-white/30 font-crimson">Hitam menangkap</span>
          {whiteAdv < 0 && <span className="text-[10px] text-amber-400 ml-auto font-cinzel">+{Math.abs(whiteAdv)}</span>}
        </div>
        <div className="flex flex-wrap gap-0.5 min-h-[24px]">
          {sortPieces(capturedByBlack).map((p, i) => (
            <span key={i} className="text-lg leading-none" title={p}>
              {PIECE_UNICODE['w' + p]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
