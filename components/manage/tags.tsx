"use client";

import { useState } from "react";
import { Tag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface TagsProps {
  tags: Tag[];
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  colorOptions: string[];
}

export function Tags({
  tags,
  onUpdateTag,
  onDeleteTag,
  colorOptions,
}: TagsProps) {
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("");

  const handleStartEdit = (tag: Tag) => {
    setEditingTag(tag);
    setNewTagName(tag.name);
    setNewTagColor(tag.color);
  };

  const handleSaveEdit = () => {
    if (editingTag && newTagName.trim()) {
      onUpdateTag({
        ...editingTag,
        name: newTagName.trim(),
        color: newTagColor,
      });
      setEditingTag(null);
      setNewTagName("");
      setNewTagColor("");
    }
  };

  const handleCancelEdit = () => {
    setEditingTag(null);
    setNewTagName("");
    setNewTagColor("");
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tags.map((tag) => (
            <div
              key={tag.id}
              className="flex items-center justify-between gap-4 p-2 rounded hover:bg-slate-800"
            >
              {editingTag?.id === tag.id ? (
                <>
                  <div className="flex-grow space-y-2">
                    <Input
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      placeholder="Tag name"
                    />
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          className={cn(
                            "w-6 h-6 rounded",
                            color,
                            newTagColor === color ? "ring-2 ring-white" : ""
                          )}
                          onClick={() => setNewTagColor(color)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSaveEdit}
                    >
                      Save
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Badge className={cn("text-white", tag.color)}>
                    {tag.name}
                  </Badge>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(tag)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteTag(tag.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
