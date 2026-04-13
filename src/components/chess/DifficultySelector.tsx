'use client';

import { useGameStore } from '@/hooks/useGameStore';
import { DIFFICULTY_CONFIGS } from '@/lib/constants';
import clsx from 'clsx';

export default function DifficultySelector() {
  const { difficulty, setDifficulty, initGame } = useGameStore();

  const handleSelect = (id: typeof difficulty) => {
    setDifficulty(id);
    initGame();
  };

  return (
    <div className="glass-panel rounded-xl p-4">
      <h3 className="font-cinzel text-[11px] tracking-widest text-amber-400/70 uppercase mb-3">
        Tingkat Kesulitan
      </h3>
      <div className="flex flex-col gap-2">
        {DIFFICULTY_CONFIGS.map(d => (
          <button
            key={d.id}
            onClick={() => handleSelect(d.id)}
            className={clsx(
              'flex items-center justify-between px-3 py-2.5 rounded-lg border transition-all duration-200',
              'text-left group hover:border-amber-500/40',
              difficulty === d.id
                ? 'border-amber-500/60 bg-amber-500/10'
                : 'border-white/8 bg-white/2 hover:bg-white/5'
            )}
          >
            <div>
              <span className={clsx(
                'font-cinzel text-sm font-semibold block',
                difficulty === d.id ? 'text-amber-300' : 'text-white/80 group-hover:text-white'
              )}>
                {d.label}
              </span>
              <span className="text-[11px] text-white/35 font-crimson italic">
                {d.description}
              </span>
            </div>
            <div className="flex gap-0.5 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={clsx(
                    'text-[10px]',
                    i < d.stars ? 'text-amber-400' : 'text-white/15'
                  )}
                >
                  ★
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
