export interface MoodEntry {
  id?: string;
  date: string; // YYYY-MM-DD
  score: number;
  anxiety: number;
  energy: number;
  irritability: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
