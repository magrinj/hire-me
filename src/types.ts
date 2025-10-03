/**
 * Type definitions for the GitHub activity generator
 */

export interface ActivityRecord {
  timestamp: string;
  count: number;
  message: string;
}

export interface CommitOptions {
  date: Date;
  message: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface CommitConfig {
  minCommitsPerDay: number;
  maxCommitsPerDay: number;
  skipWeekends: boolean;
}

export const DEFAULT_CONFIG: CommitConfig = {
  minCommitsPerDay: 1,
  maxCommitsPerDay: 8,
  skipWeekends: true,
};
