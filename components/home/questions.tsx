"use client";

import { Question as QuestionType, Tag } from "@/lib/types";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Circle,
  Star,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionsProps {
  questions: QuestionType[];
  tags: Tag[];
  progress: Record<string, { completed: boolean; starred: boolean }>;
  studyOptions: {
    showDifficulty: boolean;
    randomize: boolean;
    categoryWise: boolean;
    allFolded: boolean;
    starred: boolean;
  };
  expandedTags: Set<string>;
  toggleTagExpansion: (tagId: string) => void;
  toggleQuestionCompleted: (questionId: string) => void;
  toggleQuestionStarred: (questionId: string) => void;
  randomOrder: string[] | null;
}

export function Questions({
  questions,
  tags,
  progress,
  studyOptions,
  expandedTags,
  toggleTagExpansion,
  toggleQuestionCompleted,
  toggleQuestionStarred,
  randomOrder,
}: QuestionsProps) {
  const getQuestionProgress = (questionId: string) => {
    return progress[questionId] || { completed: false, starred: false };
  };

  const getQuestionsForTag = (tagId: string) => {
    let tagQuestions = questions.filter((q) => q.tags.includes(tagId));

    if (studyOptions.starred) {
      tagQuestions = tagQuestions.filter((q) => progress[q.id]?.starred);
    }

    if (studyOptions.randomize && randomOrder) {
      tagQuestions.sort(
        (a, b) => randomOrder.indexOf(a.id) - randomOrder.indexOf(b.id)
      );
    }

    return tagQuestions;
  };

  const renderQuestion = (question: QuestionType) => {
    const questionProgress = progress[question.id] || {
      completed: false,
      starred: false,
    };

    return (
      <div key={question.id} className="py-3 first:pt-0 last:pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            <Button
              onClick={() => toggleQuestionCompleted(question.id)}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-green-600"
            >
              {questionProgress.completed ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <Circle className="h-5 w-5" />
              )}
            </Button>

            <Button
              onClick={() => toggleQuestionStarred(question.id)}
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 transition-colors",
                questionProgress.starred
                  ? "text-yellow-500"
                  : "text-muted-foreground hover:text-yellow-500"
              )}
            >
              <Star
                className={cn(
                  "h-4 w-4",
                  questionProgress.starred && "fill-current"
                )}
              />
            </Button>

            <div className="flex-1">
              <a
                href={question.url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "text-sm font-medium hover:text-primary transition-colors",
                  questionProgress.completed &&
                    "line-through text-muted-foreground"
                )}
              >
                {question.name}
              </a>
            </div>
          </div>

          {studyOptions.showDifficulty && (
            <Badge
              variant="outline"
              className={cn({
                "border-green-500 text-green-500":
                  question.difficulty === "Easy",
                "border-yellow-500 text-yellow-500":
                  question.difficulty === "Medium",
                "border-red-500 text-red-500": question.difficulty === "Hard",
              })}
            >
              {question.difficulty}
            </Badge>
          )}
        </div>
      </div>
    );
  };

  if (!studyOptions.categoryWise) {
    return (
      <Card className="hover:bg-muted/50 transition-colors py-2">
        <CardContent className="pt-0">
          <div className="divide-y">
            {questions
              .filter((q) => !studyOptions.starred || progress[q.id]?.starred)
              .sort((a, b) => {
                if (studyOptions.randomize && randomOrder) {
                  return randomOrder.indexOf(a.id) - randomOrder.indexOf(b.id);
                }
                return 0;
              })
              .map(renderQuestion)}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tags.map((tag) => {
        const tagQuestions = getQuestionsForTag(tag.id);
        if (tagQuestions.length === 0) return null;

        return (
          <Card
            key={tag.id}
            className="hover:bg-muted/50 transition-colors py-2"
          >
            <CardHeader
              className="cursor-pointer"
              onClick={() => {
                // don't fold if in all questions mode
                if (!studyOptions.categoryWise) return;
                toggleTagExpansion(tag.id);
              }}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-4 h-4 rounded-full", tag.color)} />
                  <CardTitle className="text-lg">
                    {tag.name} (
                    {
                      tagQuestions.filter(
                        (q) => getQuestionProgress(q.id).completed
                      ).length
                    }
                    /{tagQuestions.length})
                  </CardTitle>
                </div>
                <div className="flex flex-1 items-center space-x-2 ml-10">
                  <Progress
                    value={
                      tagQuestions.length === 0
                        ? 0
                        : (tagQuestions.filter(
                            (q) => getQuestionProgress(q.id).completed
                          ).length /
                            tagQuestions.length) *
                          100
                    }
                  />
                  {expandedTags.has(tag.id) ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground mt-1" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground mt-1" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedTags.has(tag.id) && (
              <CardContent className="pt-0">
                <div className="divide-y">
                  {tagQuestions.map(renderQuestion)}
                </div>
              </CardContent>
            )}
          </Card>
        );
      })}

      {questions.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground text-lg">
              No questions added yet.
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Go to the Manage page to add questions and tags.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
