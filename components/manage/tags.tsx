"use client";

import { useState } from "react";
import { Tag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TagsProps {
  tags: Tag[];
  onUpdateTag: (tag: Tag) => void;
  onDeleteTag: (tagId: string) => void;
  onReorderTags: (tags: Tag[]) => void;
  colorOptions: string[];
}

export function Tags({
  tags,
  onUpdateTag,
  onDeleteTag,
  onReorderTags,
  colorOptions,
}: TagsProps) {
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tags.findIndex((tag) => tag.id === active.id);
      const newIndex = tags.findIndex((tag) => tag.id === over.id);
      onReorderTags(arrayMove(tags, oldIndex, newIndex));
    }
  };

  const SortableTag = ({ tag }: { tag: Tag }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: tag.id });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : undefined,
      zIndex: isDragging ? 1 : undefined,
    };

    if (editingTag?.id === tag.id) {
      return (
        <div className="flex items-center justify-between gap-4 p-2 rounded bg-muted">
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
            <Button variant="outline" size="sm" onClick={handleSaveEdit}>
              Save
            </Button>
            <Button variant="outline" size="sm" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex items-center justify-between gap-4 p-2 rounded hover:bg-muted/50",
          isDragging && "opacity-50"
        )}
      >
        <div className="flex items-center gap-2">
          <button
            className="touch-none cursor-grab text-muted-foreground hover:text-foreground"
            {...attributes}
            {...listeners}
          >
            <GripVertical size={16} />
          </button>
          <Badge
            className={cn(
              tag.color,
              tag.color.includes("yellow") || tag.color.includes("green")
                ? "text-primary"
                : "text-white"
            )}
          >
            {tag.name}
          </Badge>
        </div>
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
      </div>
    );
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Tags</CardTitle>
      </CardHeader>
      <CardContent>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tags} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {tags.map((tag) => (
                <SortableTag key={tag.id} tag={tag} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
