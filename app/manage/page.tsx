"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, Download } from "lucide-react";
import { Question, Tag } from "@/lib/types";
import {
  getQuestions,
  saveQuestions,
  getTags,
  addTag,
  updateTag,
  deleteTag,
} from "@/lib/storage";
import { processExcelData, parseCSV } from "@/lib/excel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ManagePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("bg-blue-500");
  const [showAddTag, setShowAddTag] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    name: "",
    url: "",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    tags: [] as string[],
  });

  const colorOptions = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-gray-500",
  ];

  useEffect(() => {
    setQuestions(getQuestions());
    setTags(getTags());
  }, []);

  // Tag management
  const handleAddTag = () => {
    if (newTagName.trim()) {
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        name: newTagName.trim(),
        color: newTagColor,
      };
      addTag(newTag);
      setTags(getTags());
      setNewTagName("");
      setShowAddTag(false);
    }
  };

  const handleUpdateTag = () => {
    if (editingTag && newTagName.trim()) {
      updateTag(editingTag.id, { name: newTagName.trim(), color: newTagColor });
      setTags(getTags());
      setEditingTag(null);
      setNewTagName("");
    }
  };

  const handleDeleteTag = (tagId: string) => {
    if (confirm("Are you sure you want to delete this tag?")) {
      deleteTag(tagId);
      setTags(getTags());
      // Remove tag from questions
      const updatedQuestions = questions.map((q) => ({
        ...q,
        tags: q.tags.filter((t) => t !== tagId),
      }));
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
    }
  };

  // Question management
  const handleAddQuestion = () => {
    if (newQuestion.name && newQuestion.url) {
      // Store tag ids directly, fallback to 'default' if any tag is missing
      const validTags =
        newQuestion.tags.length > 0
          ? newQuestion.tags.map((tagId) =>
              tags.some((t) => t.id === tagId) ? tagId : "default"
            )
          : ["default"];
      const question: Question = {
        id: `question-${Date.now()}`,
        name: newQuestion.name,
        url: newQuestion.url,
        difficulty: newQuestion.difficulty,
        tags: validTags,
        completed: false,
        starred: false,
      };
      const updatedQuestions = [...questions, question];
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
      setNewQuestion({ name: "", url: "", difficulty: "Medium", tags: [] });
      setShowAddQuestion(false);
    }
  };

  const handleUpdateQuestion = () => {
    if (editingQuestion) {
      // Store tag ids directly for the updated question
      const updatedQuestion = {
        ...editingQuestion,
        tags: editingQuestion.tags,
      };
      const updatedQuestions = questions.map((q) =>
        q.id === editingQuestion.id ? updatedQuestion : q
      );
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
      setEditingQuestion(null);
    }
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm("Are you sure you want to delete this question?")) {
      const updatedQuestions = questions.filter((q) => q.id !== questionId);
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
    }
  };

  // File upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const data = parseCSV(text);
      let processedQuestions = processExcelData(data);
      // Ensure all uploaded questions use tag ids only
      processedQuestions = processedQuestions.map((q) => {
        let tagIds: string[] = Array.isArray(q.tags)
          ? q.tags
              .map((tag) => {
                // Try to find tag by name (case-insensitive)
                const found = tags.find(
                  (t) => t.name.toLowerCase() === String(tag).toLowerCase()
                );
                return found ? found.id : undefined;
              })
              .filter((id): id is string => Boolean(id))
          : [];
        if (tagIds.length === 0) tagIds = ["default"];
        return {
          ...q,
          tags: tagIds,
        };
      });

      const updatedQuestions = [...questions, ...processedQuestions];
      setQuestions(updatedQuestions);
      saveQuestions(updatedQuestions);
    };
    reader.readAsText(file);
  };

  const exportQuestions = () => {
    const csvContent = [
      "title,url,difficulty,tags",
      ...questions.map(
        (q) => `${q.name},${q.url},${q.difficulty},${q.tags.join(",")}`
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getDifficultyBadgeVariant = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "default";
      case "Medium":
        return "secondary";
      case "Hard":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Problems</h1>
        <div className="flex space-x-3">
          <Dialog open={showAddQuestion} onOpenChange={setShowAddQuestion}>
            <DialogTrigger asChild>
              <Button className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Add Question</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Question name"
                  value={newQuestion.name}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, name: e.target.value })
                  }
                />
                <Input
                  type="url"
                  placeholder="Question URL"
                  value={newQuestion.url}
                  onChange={(e) =>
                    setNewQuestion({ ...newQuestion, url: e.target.value })
                  }
                />
                <Select
                  value={newQuestion.difficulty}
                  onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                    setNewQuestion({ ...newQuestion, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <label
                        key={tag.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          checked={newQuestion.tags.includes(tag.id)}
                          onCheckedChange={(checked) => {
                            const newTags = checked
                              ? [...newQuestion.tags, tag.id]
                              : newQuestion.tags.filter((t) => t !== tag.id);
                            setNewQuestion({ ...newQuestion, tags: newTags });
                          }}
                        />
                        <span className="text-sm">{tag.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button onClick={handleAddQuestion} className="flex-1">
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddQuestion(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Button
            asChild
            variant="default"
            className="flex items-center space-x-2"
          >
            <label className="cursor-pointer">
              <Upload className="h-4 w-4" />
              <span>Upload CSV</span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </Button>
          <Button
            onClick={exportQuestions}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      </div>

      {/* Sample Questions Download Link */}
      <div>
        <a
          href="/sample_questions.csv"
          download
          className="text-muted-foreground text-xs hover:underline text-end inline-block"
        >
          Getting Started? Download Sample Questions .csv
        </a>
      </div>

      {/* Tags Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tags</CardTitle>
            <Dialog open={showAddTag} onOpenChange={setShowAddTag}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Tag</span>
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Tag</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Tag name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                  />
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Color
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          onClick={() => setNewTagColor(color)}
                          className={cn(
                            "w-8 h-8 rounded-full border-2",
                            color,
                            newTagColor === color
                              ? "border-foreground"
                              : "border-border"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleAddTag} className="flex-1">
                      Add
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddTag(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className={cn("w-3 h-3 rounded-full", tag.color)} />
                  <span className="text-sm font-medium">{tag.name}</span>
                </div>
                <div className="flex space-x-1">
                  <Button
                    onClick={() => {
                      setEditingTag(tag);
                      setNewTagName(tag.name);
                      setNewTagColor(tag.color);
                    }}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteTag(tag.id)}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Questions Section */}
      <Card>
        <CardHeader>
          <CardTitle>Questions ({questions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {questions.map((question) => (
                  <tr key={question.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">{question.name}</div>
                      <div className="text-sm text-muted-foreground">
                        <a
                          href={question.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary transition-colors"
                        >
                          {question.url}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={getDifficultyBadgeVariant(question.difficulty)}
                      >
                        {question.difficulty}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {question.tags.map((tagId) => {
                          const tag = tags.find((t) => t.id === tagId);
                          return tag ? (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className={cn("text-primary")}
                            >
                              {tag.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        onClick={() => setEditingQuestion(question)}
                        variant="ghost"
                        size="sm"
                        className="mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteQuestion(question.id)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Question Dialog */}
      {editingQuestion && (
        <Dialog
          open={!!editingQuestion}
          onOpenChange={() => setEditingQuestion(null)}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Question name"
                value={editingQuestion.name}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    name: e.target.value,
                  })
                }
              />
              <Input
                type="url"
                placeholder="Question URL"
                value={editingQuestion.url}
                onChange={(e) =>
                  setEditingQuestion({
                    ...editingQuestion,
                    url: e.target.value,
                  })
                }
              />
              <Select
                value={editingQuestion.difficulty}
                onValueChange={(value: "Easy" | "Medium" | "Hard") =>
                  setEditingQuestion({ ...editingQuestion, difficulty: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <div>
                <label className="block text-sm font-medium mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label key={tag.id} className="flex items-center space-x-2">
                      <Checkbox
                        checked={editingQuestion.tags.some(
                          (t) => t.toLowerCase() === tag.name.toLowerCase()
                        )}
                        onCheckedChange={(checked) => {
                          const tagNameLower = tag.name.toLowerCase();
                          let newTags;
                          if (checked) {
                            // Add only if not present (case-insensitive)
                            newTags = editingQuestion.tags.some(
                              (t) => t.toLowerCase() === tagNameLower
                            )
                              ? editingQuestion.tags
                              : [...editingQuestion.tags, tag.name];
                          } else {
                            newTags = editingQuestion.tags.filter(
                              (t) => t.toLowerCase() !== tagNameLower
                            );
                          }
                          setEditingQuestion({
                            ...editingQuestion,
                            tags: newTags,
                          });
                        }}
                      />
                      <span className="text-sm">{tag.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleUpdateQuestion} className="flex-1">
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingQuestion(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Tag Dialog */}
      {editingTag && (
        <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Tag name"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
              />
              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewTagColor(color)}
                      className={cn(
                        "w-8 h-8 rounded-full border-2",
                        color,
                        newTagColor === color
                          ? "border-foreground"
                          : "border-border"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="flex space-x-3">
                <Button onClick={handleUpdateTag} className="flex-1">
                  Update
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingTag(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
