"use client";

interface ScoreDotsProps {
  score: number;
  color: string;
  label?: string;
}

export function ScoreDots({ score, color }: ScoreDotsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-2.5 h-2 rounded-sm transition-colors duration-200"
            style={{ background: i <= score ? color : "#E5E7EB" }}
          />
        ))}
      </div>
      <span className="text-xs tabular-nums font-medium" style={{ color }}>
        {score}
      </span>
    </div>
  );
}
