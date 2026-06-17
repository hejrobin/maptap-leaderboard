export interface Score {
  date: string;
  score: number;
}

export interface Player {
  name: string;
  avatarUrl: string;
  scores: Score[];
}
