"use client";

import { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  Star,
  CheckCircle,
  Circle,
  RotateCcw,
  Eye,
  EyeOff,
  Shuffle,
  List,
} from "lucide-react";
import { Question, Tag, StudyOptions } from "@/lib/types";
import {
  getQuestions,
  getTags,
  getProgress,
  saveProgress,
  getStudyOptions,
  saveStudyOptions,
} from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

export default function StudyPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [progress, setProgress] = useState<
    Record<string, { completed: boolean; starred: boolean }>
  >({});
  const [studyOptions, setStudyOptions] = useState<StudyOptions>({
    showDifficulty: true,
    randomize: false,
    categoryWise: true,
    allFolded: false,
  });
  const [expandedTags, setExpandedTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    const storedQuestions = getQuestions();
    const storedTags = getTags();
    const storedProgress = getProgress();
    const storedOptions = getStudyOptions();

    setQuestions(storedQuestions);
    setTags(storedTags);
    setProgress(storedProgress);
    setStudyOptions(storedOptions);

    // Initialize expanded tags
    if (storedOptions.allFolded) {
      setExpandedTags(new Set());
    } else {
      setExpandedTags(new Set(storedTags.map((tag) => tag.id)));
    }
  }, []);

  const toggleTagExpansion = (tagId: string) => {
    const newExpanded = new Set(expandedTags);
    if (newExpanded.has(tagId)) {
      newExpanded.delete(tagId);
    } else {
      newExpanded.add(tagId);
    }
    setExpandedTags(newExpanded);
  };

  const toggleAllFolded = () => {
    const newAllFolded = !studyOptions.allFolded;
    const newOptions = { ...studyOptions, allFolded: newAllFolded };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);

    if (newAllFolded) {
      setExpandedTags(new Set());
    } else {
      setExpandedTags(new Set(tags.map((tag) => tag.id)));
    }
  };

  const toggleDifficulty = () => {
    const newOptions = {
      ...studyOptions,
      showDifficulty: !studyOptions.showDifficulty,
    };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);
  };

  const toggleRandomize = () => {
    const newOptions = { ...studyOptions, randomize: !studyOptions.randomize };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);
  };

  const toggleCategoryWise = () => {
    const newOptions = {
      ...studyOptions,
      categoryWise: !studyOptions.categoryWise,
    };
    setStudyOptions(newOptions);
    saveStudyOptions(newOptions);
  };

  const resetProgress = () => {
    if (
      confirm(
        "Are you sure you want to reset all progress? This will uncheck all completed questions."
      )
    ) {
      setProgress({});
      saveProgress({});
    }
  };

  const toggleQuestionCompleted = (questionId: string) => {
    const currentProgress = progress[questionId] || {
      completed: false,
      starred: false,
    };
    const newProgress = {
      ...currentProgress,
      completed: !currentProgress.completed,
    };

    const updatedProgress = { ...progress, [questionId]: newProgress };
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const toggleQuestionStarred = (questionId: string) => {
    const currentProgress = progress[questionId] || {
      completed: false,
      starred: false,
    };
    const newProgress = {
      ...currentProgress,
      starred: !currentProgress.starred,
    };

    const updatedProgress = { ...progress, [questionId]: newProgress };
    setProgress(updatedProgress);
    saveProgress(updatedProgress);
  };

  const getQuestionsForTag = (tagId: string) => {
    let tagQuestions = questions.filter((q) =>
      q.tags.includes(tagId.toLowerCase())
    );

    if (studyOptions.randomize) {
      tagQuestions = [...tagQuestions].sort(() => Math.random() - 0.5);
    }

    return tagQuestions;
  };

  const getFilteredQuestions = () => {
    if (studyOptions.categoryWise) {
      return tags
        .map((tagDetails) => ({
          tag: tagDetails,
          questions: getQuestionsForTag(tagDetails.name),
        }))
        .filter((group) => group.questions.length > 0);
    } else {
      // Show all questions in a single list
      let allQuestions = [...questions];
      if (studyOptions.randomize) {
        allQuestions = allQuestions.sort(() => Math.random() - 0.5);
      }
      return [
        {
          tag: { id: "all", name: "All Questions", color: "bg-gray-500" },
          questions: allQuestions,
        },
      ];
    }
  };

  const getQuestionProgress = (questionId: string) => {
    return progress[questionId] || { completed: false, starred: false };
  };

  const getCompletedCount = () => {
    return Object.values(progress).filter((p) => p.completed).length;
  };

  const getTotalCount = () => questions.length;

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
      {/* Header */}
      <div className="flex items-center justify-between">
        {/* <h1 className="text-3xl font-bold">Problems</h1> */}
        <div className="text-sm text-muted-foreground">
          Progress: {getCompletedCount()}/{getTotalCount()} completed
        </div>
      </div>

      {/* Study Options */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Button
          onClick={toggleDifficulty}
          // variant={studyOptions.showDifficulty ? "default" : "outline"}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          {studyOptions.showDifficulty ? (
            <>
              <Eye className="h-4 w-4" />
              <span>Hide Difficulty</span>
            </>
          ) : (
            <>
              <EyeOff className="h-4 w-4" />
              <span>Show Difficulty</span>
            </>
          )}
        </Button>

        <Button
          onClick={toggleRandomize}
          variant={studyOptions.randomize ? "default" : "outline"}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Shuffle className="h-4 w-4" />
          <span>Randomize</span>
        </Button>

        <Button
          onClick={toggleCategoryWise}
          variant={studyOptions.categoryWise ? "default" : "outline"}
          size="sm"
          className="flex items-center space-x-2"
        >
          <List className="h-4 w-4" />
          <span>Category Wise</span>
        </Button>

        <Button
          onClick={toggleAllFolded}
          // variant={studyOptions.allFolded ? "default" : "outline"}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <span>
            {studyOptions.allFolded ? "Unfold Questions" : "Fold Questions"}
          </span>
        </Button>

        <Button
          onClick={resetProgress}
          variant="outline"
          size="sm"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Reset Progress</span>
        </Button>
      </div>

      {/* Questions by Tags */}
      <div>
        {getFilteredQuestions().map(({ tag, questions: tagQuestions }) => (
          <Card
            key={tag.id}
            className="hover:bg-muted/50 transition-colors py-2"
          >
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleTagExpansion(tag.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={cn("w-4 h-4 rounded-full", tag.color)} />
                  <CardTitle className="text-lg">
                    {tag.name} ({tagQuestions.length})
                  </CardTitle>
                </div>
                {expandedTags.has(tag.id) ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
            </CardHeader>

            {expandedTags.has(tag.id) && (
              <CardContent className="pt-0">
                <div className="divide-y">
                  {tagQuestions.map((question) => {
                    const questionProgress = getQuestionProgress(question.id);
                    return (
                      <div
                        key={question.id}
                        className="py-3 first:pt-0 last:pb-0"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <Button
                              onClick={() =>
                                toggleQuestionCompleted(question.id)
                              }
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
                                className="text-sm font-medium hover:text-primary transition-colors"
                              >
                                {question.name}
                              </a>
                            </div>
                          </div>

                          {studyOptions.showDifficulty && (
                            <Badge
                              variant={getDifficultyBadgeVariant(
                                question.difficulty
                              )}
                            >
                              {question.difficulty}
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

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
