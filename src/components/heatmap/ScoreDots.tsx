"use client";

import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ScoreDotsProps {
  score: number;
  color: string;
  label?: string;
}

export function ScoreDots({ score, color, label }: ScoreDotsProps) {
  const dots = (
    <div className="flex gap-[2px] items-center">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="w-[5px] h-[5px] rounded-full transition-colors duration-200"
          style={{ background: i <= score ? color : "#E5E7EB" }}
        />
      ))}
    </div>
  );

  if (!label) return dots;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{dots}</TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        {label}: {score} / 5
      </TooltipContent>
    </Tooltip>
  );
}
