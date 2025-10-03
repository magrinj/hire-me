#!/usr/bin/env node

/**
 * Backfill script - Generates commits for the past year
 * This should be run once to populate historical GitHub activity
 */

import { simpleGit, SimpleGit } from 'simple-git';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  getDaysAgo,
  getDateRange,
  filterWeekdays,
  getRandomCommitCount,
  getRandomCommitMessage,
  addRandomTime,
} from './utils';
import type { ActivityRecord } from './types';

const ACTIVITY_FILE = path.join(__dirname, '..', 'activity.json');
const git: SimpleGit = simpleGit();

/**
 * Read current activity data
 */
async function readActivityData(): Promise<ActivityRecord[]> {
  try {
    const data = await fs.readFile(ACTIVITY_FILE, 'utf-8');
    return JSON.parse(data) as ActivityRecord[];
  } catch {
    return [];
  }
}

/**
 * Write activity data to file
 */
async function writeActivityData(records: ActivityRecord[]): Promise<void> {
  await fs.writeFile(ACTIVITY_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

/**
 * Create a commit with a specific date
 */
async function createCommit(date: Date, message: string): Promise<void> {
  const records = await readActivityData();

  // Add new activity record
  const newRecord: ActivityRecord = {
    timestamp: date.toISOString(),
    count: records.length + 1,
    message,
  };

  records.push(newRecord);
  await writeActivityData(records);

  // Git add and commit with specific date
  await git.add(ACTIVITY_FILE);

  const dateString = date.toISOString();
  await git.commit(message, {
    '--date': dateString,
  });

  console.log(`✓ Commit created: ${message} (${dateString})`);
}

/**
 * Main backfill function
 */
async function backfill(): Promise<void> {
  console.log('🚀 Starting backfill process...\n');

  // Get date range for the past year
  const endDate = new Date();
  const startDate = getDaysAgo(365);

  console.log(`📅 Date range: ${startDate.toDateString()} to ${endDate.toDateString()}\n`);

  // Get all dates in range
  const allDates = getDateRange(startDate, endDate);

  // Filter to weekdays only
  const weekdayDates = filterWeekdays(allDates);

  console.log(`📊 Total days: ${allDates.length}`);
  console.log(`📊 Weekdays: ${weekdayDates.length}\n`);

  let totalCommits = 0;

  // Generate commits for each weekday
  for (const date of weekdayDates) {
    const commitsForDay = getRandomCommitCount();

    for (let i = 0; i < commitsForDay; i++) {
      const commitDate = addRandomTime(new Date(date));
      const message = getRandomCommitMessage();

      await createCommit(commitDate, message);
      totalCommits++;

      // Small delay to avoid overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  console.log(`\n✅ Backfill complete!`);
  console.log(`📈 Total commits created: ${totalCommits}`);
  console.log(`📊 Average commits per day: ${(totalCommits / weekdayDates.length).toFixed(2)}`);
  console.log(`\n💡 Next steps:`);
  console.log(`   1. Review the commits: git log`);
  console.log(`   2. Create a new GitHub repository named "hire-me"`);
  console.log(`   3. Push to GitHub: git push -u origin main`);
}

// Run the backfill
backfill().catch((error: Error) => {
  console.error('❌ Error during backfill:', error.message);
  process.exit(1);
});
