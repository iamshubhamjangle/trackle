"use client";

import { Question, Tag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionsProps {
  questions: Question[];
  tags: Tag[];
  onUpdateQuestion: (question: Question) => void;
  onDeleteQuestion: (questionId: string) => void;
}

export function Questions({
  questions,
  tags,
  onUpdateQuestion,
  onDeleteQuestion,
}: QuestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Questions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question.id}
              className="flex items-center justify-between gap-4 p-2 rounded hover:bg-slate-800"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <a
                    href={question.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {question.name}
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {question.tags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId);
                    if (!tag) return null;
                    return (
                      <Badge
                        key={tag.id}
                        className={cn("text-white", tag.color)}
                      >
                        {tag.name}
                      </Badge>
                    );
                  })}
                  <Badge
                    variant="outline"
                    className={cn({
                      "border-green-500 text-green-500":
                        question.difficulty === "Easy",
                      "border-yellow-500 text-yellow-500":
                        question.difficulty === "Medium",
                      "border-red-500 text-red-500":
                        question.difficulty === "Hard",
                    })}
                  >
                    {question.difficulty}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    // Implement edit functionality
                    onUpdateQuestion(question);
                  }}
                >
                  <Edit size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteQuestion(question.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
