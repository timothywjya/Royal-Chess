'use client';

import { useEffect, useRef } from 'react';
import { useGameStore } from '@/hooks/useGameStore';
import { playSound } from '@/lib/soundEngine';
import clsx from 'clsx';

interface ModalConfig {
  type: 'win' | 'lose' | 'draw';
  title: string;
  subtitle: string;
  emoji: string;
  bgClass: string;
  glowColor: string;
  borderColor: string;
  particles: string[];
}

function getModalConfig(status: string, turn: string, gameMode: string): ModalConfig | null {
  if (status === 'stalemate' || status === 'draw') {
    return {
      type: 'draw',
      title: 'Seri!',
      subtitle: status === 'stalemate' ? 'Patt — Tidak ada langkah legal' : 'Remis — Permainan seimbang',
      emoji: '🤝',
      bgClass: 'from-slate-900 via-blue-950 to-slate-900',
      glowColor: 'rgba(59,130,246,0.4)',
      borderColor: 'border-blue-500/40',
      particles: ['⚖', '♟', '♙', '½'],
    };
  }

  if (status === 'checkmate') {
    // In PvAI: white = player, black = AI
    // Winner is opposite of turn (turn = loser's turn after checkmate)
    if (gameMode === 'pvai') {
      const playerWon = turn === 'b'; // black is AI, so if black is checkmated, player wins
      return playerWon
        ? {
            type: 'win',
            title: 'Anda Menang!',
            subtitle: 'Skakmat! Selamat, Raja dijatuhkan! 🎉',
            emoji: '♔',
            bgClass: 'from-amber-950 via-yellow-900 to-amber-950',
            glowColor: 'rgba(212,175,55,0.5)',
            borderColor: 'border-amber-400/60',
            particles: ['👑', '⭐', '✨', '♔', '🏆', '🌟'],
          }
        : {
            type: 'lose',
            title: 'Anda Kalah!',
            subtitle: 'AI memenangkan permainan ini. Coba lagi!',
            emoji: '♚',
            bgClass: 'from-red-950 via-rose-900 to-red-950',
            glowColor: 'rgba(220,38,38,0.4)',
            borderColor: 'border-red-500/40',
            particles: ['💀', '♟', '🩸', '⚔', '😤'],
          };
    } else {
      // PvP
      const winner = turn === 'w' ? 'Hitam' : 'Putih';
      return {
        type: 'win',
        title: `${winner} Menang!`,
        subtitle: `Skakmat! Raja ${turn === 'w' ? 'Putih' : 'Hitam'} telah jatuh.`,
        emoji: turn === 'w' ? '♚' : '♔',
        bgClass: 'from-amber-950 via-yellow-900 to-amber-950',
        glowColor: 'rgba(212,175,55,0.5)',
        borderColor: 'border-amber-400/60',
        particles: ['👑', '⭐', '✨', '♔', '🏆'],
      };
    }
  }

  return null;
}

function FloatingParticles({ particles }: { particles: string[] }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {Array.from({ length: 20 }).map((_, i) => (
        <span
          key={i}
          className="absolute text-2xl animate-float-particle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${3 + Math.random() * 4}s`,
            opacity: 0.6 + Math.random() * 0.4,
            fontSize: `${16 + Math.random() * 20}px`,
          }}
        >
          {particles[Math.floor(Math.random() * particles.length)]}
        </span>
      ))}
    </div>
  );
}

function WinConfetti() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      {Array.from({ length: 40 }).map((_, i) => {
        const colors = ['bg-amber-400', 'bg-yellow-300', 'bg-orange-400', 'bg-amber-200', 'bg-white'];
        const color = colors[i % colors.length];
        return (
          <div
            key={i}
            className={clsx('absolute w-2 h-2 rounded-sm animate-confetti', color)}
            style={{
              left: `${Math.random() * 100}%`,
              top: '-10px',
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        );
      })}
    </div>
  );
}

export default function GameOverModal() {
  const { status, turn, gameMode, initGame } = useGameStore();
  const soundPlayed = useRef(false);

  const config = getModalConfig(status, turn, gameMode);
  const isVisible = !!config;

  useEffect(() => {
    if (isVisible && !soundPlayed.current) {
      soundPlayed.current = true;
      setTimeout(() => {
        if (config?.type === 'win') playSound('win');
        else if (config?.type === 'lose') playSound('lose');
        else playSound('draw');
      }, 200);
    }
    if (!isVisible) soundPlayed.current = false;
  }, [isVisible, config?.type]);

  if (!isVisible || !config) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
      >
        {/* Modal */}
        <div
          className={clsx(
            'relative w-full max-w-md rounded-2xl border-2 overflow-hidden',
            'animate-modal-in shadow-2xl',
            config.borderColor
          )}
          style={{
            background: `radial-gradient(ellipse at top, ${config.glowColor} 0%, transparent 60%), linear-gradient(135deg, #0d0600, #1a0a00)`,
            boxShadow: `0 0 80px ${config.glowColor}, 0 40px 100px rgba(0,0,0,0.8)`,
          }}
        >
          {/* Particles / Confetti */}
          {config.type === 'win' && <WinConfetti />}
          <FloatingParticles particles={config.particles} />

          {/* Content */}
          <div className="relative z-10 p-8 text-center">
            {/* Big emoji / icon */}
            <div
              className="text-7xl mb-4 inline-block animate-bounce-in"
              style={{ filter: `drop-shadow(0 0 24px ${config.glowColor})` }}
            >
              {config.emoji}
            </div>

            {/* Result label */}
            <div className={clsx(
              'inline-block px-4 py-1 rounded-full text-xs font-cinzel tracking-widest mb-4 border',
              config.type === 'win' && 'bg-amber-500/20 text-amber-300 border-amber-500/40',
              config.type === 'lose' && 'bg-red-500/20 text-red-300 border-red-500/40',
              config.type === 'draw' && 'bg-blue-500/20 text-blue-300 border-blue-500/40',
            )}>
              {config.type === 'win' ? 'KEMENANGAN' : config.type === 'lose' ? 'KEKALAHAN' : 'SERI'}
            </div>

            {/* Title */}
            <h2
              className={clsx(
                'font-cinzel text-4xl font-bold mb-3',
                config.type === 'win' && 'gold-text',
                config.type === 'lose' && 'text-red-300',
                config.type === 'draw' && 'text-blue-300',
              )}
            >
              {config.title}
            </h2>

            {/* Subtitle */}
            <p className="font-crimson italic text-white/60 text-lg mb-8 leading-relaxed">
              {config.subtitle}
            </p>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <span className="text-white/20 text-xs font-cinzel">♔</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={initGame}
                className={clsx(
                  'flex-1 max-w-[180px] py-3.5 rounded-xl font-cinzel font-semibold text-sm',
                  'transition-all duration-200 active:scale-95',
                  'border-2 tracking-wider',
                  config.type === 'win'
                    ? 'bg-amber-500/20 border-amber-400/60 text-amber-300 hover:bg-amber-500/30 hover:border-amber-400'
                    : config.type === 'lose'
                    ? 'bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25'
                    : 'bg-blue-500/15 border-blue-500/40 text-blue-300 hover:bg-blue-500/25',
                )}
              >
                ♟ Main Lagi
              </button>

              <button
                onClick={initGame}
                className="flex-1 max-w-[140px] py-3.5 rounded-xl font-cinzel text-sm border border-white/10 text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-200 active:scale-95"
              >
                ↩ Menu
              </button>
            </div>
          </div>

          {/* Bottom glow line */}
          <div
            className="absolute bottom-0 left-0 right-0 h-0.5"
            style={{
              background: `linear-gradient(90deg, transparent, ${config.glowColor}, transparent)`,
            }}
          />
        </div>
      </div>
    </>
  );
}
