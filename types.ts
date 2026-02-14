
export type UserRole = 'teen' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Sermon {
  id: string;
  title: string;
  content: string;
  videoUrl: string;
  author: string;
  date: string;
}

export interface Music {
  id: string;
  title: string;
  url: string;
  thumbnailUrl: string;
  artist: string;
  category: 'Worship' | 'Hip-Hop' | 'Pop' | 'Acoustic';
}

export interface Story {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  type: 'movie' | 'story';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: {
    a: string;
    b: string;
    c: string;
    d: string;
  };
  correctOption: 'a' | 'b' | 'c' | 'd';
}

export interface Quiz {
  id: string;
  title: string;
  questions: QuizQuestion[];
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  score: number;
  totalQuestions: number;
  date: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface Devotional {
  id: string;
  title: string;
  verse: string;
  content: string;
  prayer: string;
}

export interface BibleVerse {
  reference: string;
  text: string;
}

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
}

export interface IntercessoryScripture {
  id: string;
  theme: string;
  reference: string;
  text: string;
}

export interface PrayerPoint {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  isAnswered: boolean;
}

export interface Testimony {
  id: string;
  userId: string;
  userName: string;
  title: string;
  type: 'video' | 'audio';
  url: string;
  content: string;
  date: string;
}

export interface BibleStudyPlan {
  id: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  title: string;
  description: string;
  days: {
    day: number;
    title: string;
    scripture: string;
    focus: string;
  }[];
}

export interface AppSettings {
  prayerInstrumentalUrl: string;
}
