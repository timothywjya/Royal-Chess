'use client';

import ChessBoard from '@/components/chess/ChessBoard';
import DifficultySelector from '@/components/chess/DifficultySelector';
import GameStatus from '@/components/chess/GameStatus';
import MoveHistory from '@/components/chess/MoveHistory';
import CapturedPieces from '@/components/chess/CapturedPieces';
import GameControls from '@/components/chess/GameControls';
import GameOverModal from '@/components/chess/GameOverModal';
import { useGameStore } from '@/hooks/useGameStore';

export default function ChessGame() {
  const { isFlipped } = useGameStore();

  return (
    <main className="min-h-screen flex flex-col items-center justify-start py-8 px-4">
      <GameOverModal />
      {/* Header */}
      <header className="mb-8 text-center animate-fade-up">
        <h1 className="font-cinzel text-4xl md:text-5xl font-bold gold-text tracking-widest mb-2">
          ROYAL CHESS
        </h1>
        <p className="font-crimson italic text-white/30 text-lg tracking-wide">
          The Game of Kings &amp; Strategy
        </p>
        <div className="mt-3 flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/40" />
          <span className="text-amber-500/50 text-xs font-cinzel tracking-widest">♔ ♛ ♜ ♝ ♞ ♟</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/40" />
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-[1100px]">

        {/* Left panel */}
        <div className="flex flex-col gap-4 w-full lg:w-[220px] order-2 lg:order-1">
          <DifficultySelector />
          <GameControls />
        </div>

        {/* Board */}
        <div className="order-1 lg:order-2 flex flex-col items-center gap-3">
          {/* Player label top */}
          <div className="flex items-center gap-2 self-start pl-1">
            <div className={`w-4 h-4 rounded-full border-2 ${isFlipped ? 'bg-white border-white/50' : 'bg-gray-900 border-gray-600'}`} />
            <span className="font-cinzel text-xs text-white/40 tracking-wider">
              {isFlipped ? 'Putih' : 'Hitam'}
            </span>
          </div>

          {/* Board with border */}
          <div
            className="relative"
            style={{
              padding: '3px',
              background: 'linear-gradient(135deg, #7a5230, #c49a5a, #7a5230)',
              borderRadius: '6px',
              boxShadow: '0 24px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.2)',
            }}
          >
            <ChessBoard />
          </div>

          {/* Player label bottom */}
          <div className="flex items-center gap-2 self-start pl-1">
            <div className={`w-4 h-4 rounded-full border-2 ${isFlipped ? 'bg-gray-900 border-gray-600' : 'bg-white border-white/50'}`} />
            <span className="font-cinzel text-xs text-white/60 tracking-wider">
              {isFlipped ? 'Hitam' : 'Putih'} (Anda)
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4 w-full lg:w-[220px] order-3 lg:h-auto">
          <GameStatus />
          <CapturedPieces />
          <MoveHistory />
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-10 text-center text-white/15 text-xs font-crimson italic">
        Built with Next.js · chess.js · Zustand · Tailwind CSS
      </footer>
    </main>
  );
}
