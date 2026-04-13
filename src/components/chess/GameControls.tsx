'use client';

import { useGameStore } from '@/hooks/useGameStore';
import clsx from 'clsx';

export default function GameControls() {
  const { initGame, undoMove, flipBoard, isThinking, gameMode, setGameMode } = useGameStore();

  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <h3 className="font-cinzel text-[11px] tracking-widest text-amber-400/70 uppercase">
        Kontrol
      </h3>

      {/* Game mode toggle */}
      <div className="flex gap-1 p-1 rounded-lg bg-black/30">
        {(['pvai', 'pvp'] as const).map(mode => (
          <button
            key={mode}
            onClick={() => { setGameMode(mode); initGame(); }}
            className={clsx(
              'flex-1 py-1.5 rounded-md text-xs font-cinzel transition-all duration-200',
              gameMode === mode
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-white/30 hover:text-white/60'
            )}
          >
            {mode === 'pvai' ? 'vs AI' : '2 Pemain'}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button
          onClick={initGame}
          disabled={isThinking}
          className={clsx(
            'flex-1 py-2.5 rounded-lg border font-cinzel text-sm font-semibold',
            'transition-all duration-200 active:scale-95',
            'bg-amber-500/15 border-amber-500/40 text-amber-300',
            'hover:bg-amber-500/25 hover:border-amber-400/60',
            'disabled:opacity-40 disabled:cursor-not-allowed'
          )}
        >
          ♟ Mulai Baru
        </button>
        <button
          onClick={undoMove}
          disabled={isThinking}
          className={clsx(
            'py-2.5 px-3 rounded-lg border font-cinzel text-sm',
            'transition-all duration-200 active:scale-95',
            'border-white/10 text-white/50',
            'hover:border-white/20 hover:text-white/70',
            'disabled:opacity-30 disabled:cursor-not-allowed'
          )}
          title="Undur Langkah"
        >
          ↩
        </button>
        <button
          onClick={flipBoard}
          className={clsx(
            'py-2.5 px-3 rounded-lg border font-cinzel text-sm',
            'transition-all duration-200 active:scale-95',
            'border-white/10 text-white/50',
            'hover:border-white/20 hover:text-white/70'
          )}
          title="Putar Papan"
        >
          ⇅
        </button>
      </div>
    </div>
  );
}
