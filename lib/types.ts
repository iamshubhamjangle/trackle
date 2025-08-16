export interface Question {
  id: string;
  name: string;
  url: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  completed: boolean;
  starred: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface UploadedData {
  title: string;
  url: string;
  difficulty: string;
  tags: string;
}

export interface StudyOptions {
  showDifficulty: boolean;
  randomize: boolean;
  categoryWise: boolean;
  allFolded: boolean;
}

export interface QuestionProgress {
  [questionId: string]: {
    completed: boolean;
    starred: boolean;
  };
}
