'use client';

import { useGameStore } from '@/hooks/useGameStore';
import clsx from 'clsx';

const STATUS_MESSAGES: Record<string, { text: string; color: string }> = {
  playing_w: { text: 'Giliran Putih', color: 'text-white/80' },
  playing_b: { text: 'Giliran Hitam', color: 'text-white/50' },
  check_w: { text: '⚠ Putih Dalam Skak!', color: 'text-red-400' },
  check_b: { text: '⚠ Hitam Dalam Skak!', color: 'text-red-400' },
  checkmate_w: { text: '♚ Hitam Menang! Skakmat!', color: 'text-amber-400' },
  checkmate_b: { text: '♔ Putih Menang! Skakmat!', color: 'text-amber-400' },
  stalemate: { text: '½ Seri — Patt!', color: 'text-blue-400' },
  draw: { text: '½ Seri — Remis!', color: 'text-blue-400' },
};

export default function GameStatus() {
  const { status, turn, isThinking, evaluation } = useGameStore();

  const key = status === 'playing' || status === 'check'
    ? `${status}_${turn}`
    : status;

  const msg = STATUS_MESSAGES[key] || { text: 'Bermain...', color: 'text-white/70' };
  const isGameOver = status === 'checkmate' || status === 'stalemate' || status === 'draw';

  // Eval bar: 0 = black wins, 50 = equal, 100 = white wins
  const evalClamped = Math.max(-600, Math.min(600, evaluation));
  const evalPct = ((evalClamped + 600) / 1200) * 100;
  const evalLabel = evaluation === 0 ? '0.0' : (evaluation > 0 ? '+' : '') + (evaluation / 100).toFixed(1);

  return (
    <div className="glass-panel rounded-xl p-4 space-y-3">
      <h3 className="font-cinzel text-[11px] tracking-widest text-amber-400/70 uppercase">
        Status Permainan
      </h3>

      {/* Status text */}
      <div className={clsx('font-cinzel text-sm font-semibold', msg.color, isGameOver && 'animate-pulse')}>
        {msg.text}
      </div>

      {/* AI Thinking indicator */}
      {isThinking && (
        <div className="flex items-center gap-2 text-amber-400/60">
          <div className="flex gap-1">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
          <span className="text-xs font-crimson italic">AI sedang berpikir...</span>
        </div>
      )}

      {/* Turn indicator */}
      {!isGameOver && !isThinking && (
        <div className="flex items-center gap-2">
          <div className={clsx(
            'w-4 h-4 rounded-full border-2',
            turn === 'w'
              ? 'bg-white border-white/50 shadow-[0_0_8px_rgba(255,255,255,0.5)]'
              : 'bg-gray-900 border-gray-600 shadow-[0_0_8px_rgba(0,0,0,0.5)]'
          )} />
          <span className="text-xs text-white/40 font-crimson italic">
            {turn === 'w' ? 'Bidak Putih' : 'Bidak Hitam'}
          </span>
        </div>
      )}

      {/* Evaluation bar */}
      <div>
        <div className="flex justify-between text-[10px] text-white/30 mb-1 font-cinzel">
          <span>Hitam</span>
          <span>{evalLabel}</span>
          <span>Putih</span>
        </div>
        <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
          <div
            className="eval-bar h-full bg-gradient-to-r from-gray-300 to-white rounded-full"
            style={{ width: `${evalPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
