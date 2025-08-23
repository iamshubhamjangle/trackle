"use client";

import { Question } from "@/lib/types";
import { Progress as ProgressUI } from "@/components/ui/progress";

interface ProgressProps {
  questions: Question[];
  progress: Record<string, { completed: boolean; starred: boolean }>;
}

export function Progress({ questions, progress }: ProgressProps) {
  const completedCount = questions.filter(
    (q) => progress[q.id]?.completed
  ).length;
  const totalCount = questions.length;
  const progressPercentage =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-2 mb-4">
      <div className="flex justify-between text-sm">
        <span>
          Progress: {completedCount}/{totalCount} completed
        </span>
        <span>{Math.round(progressPercentage)}%</span>
      </div>
      <ProgressUI value={progressPercentage} className="h-2" />
    </div>
  );
}
