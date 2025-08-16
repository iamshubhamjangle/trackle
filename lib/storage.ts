import { Question, Tag, QuestionProgress, StudyOptions } from "./types";

const STORAGE_KEYS = {
  QUESTIONS: "problem-list-questions",
  TAGS: "problem-list-tags",
  PROGRESS: "problem-list-progress",
  STUDY_OPTIONS: "problem-list-study-options",
} as const;

// Default tags
export const DEFAULT_TAGS: Tag[] = [
  { id: "array", name: "Array", color: "bg-blue-500" },
  { id: "heap", name: "Heap", color: "bg-green-500" },
  { id: "dp", name: "DP", color: "bg-purple-500" },
  { id: "dp-advance", name: "DP Advanced", color: "bg-indigo-500" },
  { id: "graph", name: "Graph", color: "bg-red-500" },
  { id: "default", name: "Default", color: "bg-gray-500" },
  { id: "starred", name: "Starred", color: "bg-yellow-500" },
];

// Questions storage
export const getQuestions = (): Question[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
  return stored ? JSON.parse(stored) : [];
};

export const saveQuestions = (questions: Question[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

export const addQuestion = (question: Question): void => {
  const questions = getQuestions();
  questions.push(question);
  saveQuestions(questions);
};

export const updateQuestion = (
  id: string,
  updates: Partial<Question>
): void => {
  const questions = getQuestions();
  const index = questions.findIndex((q) => q.id === id);
  if (index !== -1) {
    questions[index] = { ...questions[index], ...updates };
    saveQuestions(questions);
  }
};

export const deleteQuestion = (id: string): void => {
  const questions = getQuestions();
  const filtered = questions.filter((q) => q.id !== id);
  saveQuestions(filtered);
};

// Tags storage
export const getTags = (): Tag[] => {
  if (typeof window === "undefined") return DEFAULT_TAGS;
  const stored = localStorage.getItem(STORAGE_KEYS.TAGS);
  return stored ? JSON.parse(stored) : DEFAULT_TAGS;
};

export const saveTags = (tags: Tag[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
};

export const addTag = (tag: Tag): void => {
  const tags = getTags();
  tags.push(tag);
  saveTags(tags);
};

export const updateTag = (id: string, updates: Partial<Tag>): void => {
  const tags = getTags();
  const index = tags.findIndex((t) => t.id === id);
  if (index !== -1) {
    tags[index] = { ...tags[index], ...updates };
    saveTags(tags);
  }
};

export const deleteTag = (id: string): void => {
  const tags = getTags();
  const filtered = tags.filter((t) => t.id !== id);
  saveTags(filtered);
};

// Progress storage
export const getProgress = (): QuestionProgress => {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEYS.PROGRESS);
  return stored ? JSON.parse(stored) : {};
};

export const saveProgress = (progress: QuestionProgress): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
};

export const updateQuestionProgress = (
  questionId: string,
  updates: Partial<QuestionProgress[string]>
): void => {
  const progress = getProgress();
  progress[questionId] = { ...progress[questionId], ...updates };
  saveProgress(progress);
};

export const resetProgress = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
};

// Study options storage
export const getStudyOptions = () => {
  if (typeof window === "undefined")
    return {
      showDifficulty: true,
      randomize: false,
      categoryWise: true,
      allFolded: false,
    };
  const stored = localStorage.getItem(STORAGE_KEYS.STUDY_OPTIONS);
  return stored
    ? JSON.parse(stored)
    : {
        showDifficulty: true,
        randomize: false,
        categoryWise: true,
        allFolded: false,
      };
};

export const saveStudyOptions = (options: StudyOptions): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.STUDY_OPTIONS, JSON.stringify(options));
};
