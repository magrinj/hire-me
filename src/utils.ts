/**
 * Utility functions for commit generation
 */

import type { DayOfWeek, CommitConfig, DEFAULT_CONFIG } from './types';

/**
 * Professional commit messages to rotate through
 */
export const COMMIT_MESSAGES: readonly string[] = [
  'Improving code quality',
  'Refactoring architecture',
  'Optimizing performance',
  'Enhancing user experience',
  'Adding documentation',
  'Updating dependencies',
  'Implementing best practices',
  'Fixing edge cases',
  'Streamlining workflow',
  'Polishing features',
  'Improving accessibility',
  'Enhancing type safety',
  'Refining implementation',
  'Strengthening error handling',
  'Optimizing bundle size',
  'Improving test coverage',
  'Enhancing code maintainability',
  'Updating configurations',
  'Improving developer experience',
  'Refactoring for clarity',
] as const;

/**
 * Check if a date falls on a weekend
 */
export function isWeekend(date: Date): boolean {
  const day: DayOfWeek = date.getDay() as DayOfWeek;
  return day === 0 || day === 6; // Sunday or Saturday
}

/**
 * Check if a date falls on a weekday
 */
export function isWeekday(date: Date): boolean {
  return !isWeekend(date);
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random commit message from the predefined list
 */
export function getRandomCommitMessage(): string {
  const index = randomInt(0, COMMIT_MESSAGES.length - 1);
  return COMMIT_MESSAGES[index];
}

/**
 * Get random number of commits for a day based on configuration
 */
export function getRandomCommitCount(config: CommitConfig = DEFAULT_CONFIG): number {
  return randomInt(config.minCommitsPerDay, config.maxCommitsPerDay);
}

/**
 * Format date to ISO string for git commit
 */
export function formatDateForGit(date: Date): string {
  return date.toISOString();
}

/**
 * Get date N days ago from today
 */
export function getDaysAgo(days: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

/**
 * Add random hours/minutes to a date to make commits look natural
 */
export function addRandomTime(date: Date): Date {
  const newDate = new Date(date);
  const hour = randomInt(9, 18); // Working hours 9am - 6pm
  const minute = randomInt(0, 59);
  const second = randomInt(0, 59);

  newDate.setHours(hour, minute, second);
  return newDate;
}

/**
 * Get all dates in a range
 */
export function getDateRange(startDate: Date, endDate: Date): Date[] {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

/**
 * Filter dates to only include weekdays
 */
export function filterWeekdays(dates: Date[]): Date[] {
  return dates.filter(isWeekday);
}
