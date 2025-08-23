"use client";

import { Button } from "@/components/ui/button";
import { Plus, Upload, Download } from "lucide-react";

interface HeaderProps {
  onAddQuestion: () => void;
  onAddTag: () => void;
  onExport: () => void;
  onUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Header({
  onAddQuestion,
  onAddTag,
  onExport,
  onUpload,
}: HeaderProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onAddQuestion}
        className="w-full sm:w-auto"
      >
        <Plus size={16} />
        <span className="ml-2">Add Question</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onAddTag}
        className="w-full sm:w-auto"
      >
        <Plus size={16} />
        <span className="ml-2">Add Tag</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onExport}
        className="w-full sm:w-auto"
      >
        <Download size={16} />
        <span className="ml-2">Export</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        onClick={() => document.getElementById("file-upload")?.click()}
      >
        <Upload size={16} />
        <span className="ml-2">Import</span>
      </Button>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx"
        className="hidden"
        onChange={onUpload}
      />
    </div>
  );
}
