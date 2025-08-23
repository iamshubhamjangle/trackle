"use client";

import { StudyOptions } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  Shuffle,
  GalleryVertical,
  FoldVertical,
  UnfoldVertical,
  RotateCcw,
  Star,
} from "lucide-react";

interface HeaderProps {
  studyOptions: StudyOptions;
  toggleDifficulty: () => void;
  toggleRandomize: () => void;
  toggleCategoryWise: () => void;
  toggleAllFolded: () => void;
  toggleStarred: () => void;
  resetProgress: () => void;
}

export function Header({
  studyOptions,
  toggleDifficulty,
  toggleRandomize,
  toggleCategoryWise,
  toggleAllFolded,
  toggleStarred,
  resetProgress,
}: HeaderProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDifficulty}
        className="w-full sm:w-auto"
      >
        {studyOptions.showDifficulty ? <Eye size={16} /> : <EyeOff size={16} />}
        <span className="ml-2">
          {studyOptions.showDifficulty ? "Hide" : "Show"} Difficulty
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleRandomize}
        className="w-full sm:w-auto"
      >
        <Shuffle size={16} />
        <span className="ml-2">
          {studyOptions.randomize ? "Sequential" : "Random"} Order
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={toggleCategoryWise}
        className="w-full sm:w-auto"
      >
        <GalleryVertical size={16} />
        <span className="ml-2">
          {studyOptions.categoryWise ? "List" : "Category"} View
        </span>
      </Button>

      {studyOptions.categoryWise && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAllFolded}
          className="w-full sm:w-auto"
        >
          {studyOptions.allFolded ? (
            <UnfoldVertical size={16} />
          ) : (
            <FoldVertical size={16} />
          )}
          <span className="ml-2">
            {studyOptions.allFolded ? "Expand All" : "Collapse All"}
          </span>
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={toggleStarred}
        className="w-full sm:w-auto"
      >
        <Star size={16} />
        <span className="ml-2">
          {studyOptions.starred ? "All Questions" : "Starred"}
        </span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={resetProgress}
        className="w-full sm:w-auto"
      >
        <RotateCcw size={16} />
        <span className="ml-2">Reset Progress</span>
      </Button>
    </div>
  );
}
