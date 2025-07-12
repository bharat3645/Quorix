export interface Question {
  id: number;
  title: string;
  body?: string;
  author: string;
  createdAt: Date;
  votes: number;
  answers: number;
  views: number;
  tags: string[];
  answersList?: Answer[];
}

export interface Answer {
  id: number;
  questionId: number;
  body: string;
  author: string;
  authorId: number;
  createdAt: Date;
  votes: number;
  accepted: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  reputation: number;
  joinedAt: Date;
  location?: string;
  bio?: string;
  website?: string;
  questionsAsked?: number;
  answersGiven?: number;
  badges?: number;
  topTags?: string[];
}

export interface Tag {
  id: number;
  name: string;
  description: string;
  count: number;
  todayCount: number;
  createdAt: Date;
  trending?: boolean;
}