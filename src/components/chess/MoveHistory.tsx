'use client';

import { useGameStore } from '@/hooks/useGameStore';
import { useEffect, useRef } from 'react';

export default function MoveHistory() {
  const { moveHistory } = useGameStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [moveHistory]);

  const pairs: Array<[string, string?]> = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    pairs.push([moveHistory[i].san, moveHistory[i + 1]?.san]);
  }

  return (
    <div className="glass-panel rounded-xl p-4 flex-1 min-h-0">
      <h3 className="font-cinzel text-[11px] tracking-widest text-amber-400/70 uppercase mb-3">
        Riwayat Langkah
      </h3>
      <div className="overflow-y-auto max-h-[200px] space-y-0.5 pr-1">
        {pairs.length === 0 ? (
          <p className="text-white/20 text-xs font-crimson italic">Belum ada langkah...</p>
        ) : (
          pairs.map((pair, i) => (
            <div
              key={i}
              className="move-item flex gap-2 text-sm py-1 px-2 rounded"
            >
              <span className="text-white/25 font-cinzel text-xs w-6 shrink-0 pt-0.5">{i + 1}.</span>
              <span className="text-white/75 font-mono w-16 shrink-0">{pair[0]}</span>
              <span className="text-white/45 font-mono">{pair[1] || ''}</span>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
