#!/usr/bin/env node

/**
 * Daily commit script - Creates random commits for the current day
 * This script is designed to be run daily via GitHub Actions
 */

import { simpleGit, SimpleGit } from 'simple-git';
import * as fs from 'fs/promises';
import * as path from 'path';
import {
  isWeekend,
  getRandomCommitCount,
  getRandomCommitMessage,
  addRandomTime,
} from './utils';
import type { ActivityRecord } from './types';

const ACTIVITY_FILE = path.join(__dirname, '..', 'activity.json');
const git: SimpleGit = simpleGit();

// Parse command line arguments
const args = process.argv.slice(2);
const DEBUG_MODE = args.includes('-d') || args.includes('--debug');

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
 * Create a commit for today
 */
async function createCommit(message: string, debugMode: boolean = false): Promise<void> {
  const records = await readActivityData();
  const now = new Date();

  // Add new activity record
  const newRecord: ActivityRecord = {
    timestamp: now.toISOString(),
    count: records.length + 1,
    message,
  };

  records.push(newRecord);
  await writeActivityData(records);

  if (debugMode) {
    console.log(`✓ Activity record added (debug mode - no commit): ${message}`);
    return;
  }

  // Git add and commit
  await git.add(ACTIVITY_FILE);
  await git.commit(message);

  console.log(`✓ Commit created: ${message}`);
}

/**
 * Configure git user if needed (for CI environments)
 */
async function configureGit(): Promise<void> {
  try {
    const name = await git.raw(['config', 'user.name']);
    if (!name.trim()) {
      await git.addConfig('user.name', 'Jérémy Magrin');
      await git.addConfig('user.email', 'jeremymagrin@gmail.com');
      console.log('✓ Git user configured');
    }
  } catch {
    await git.addConfig('user.name', 'Jérémy Magrin');
    await git.addConfig('user.email', 'jeremymagrin@gmail.com');
    console.log('✓ Git user configured');
  }
}

/**
 * Push commits to remote
 */
async function pushToRemote(): Promise<void> {
  try {
    await git.push();
    console.log('✓ Pushed to remote');
  } catch (error) {
    console.warn('⚠️  Could not push to remote:', (error as Error).message);
    console.log('   This is expected if running locally without remote configured');
  }
}

/**
 * Main daily commit function
 */
async function dailyCommit(debugMode: boolean = false): Promise<void> {
  console.log('🚀 Starting daily commit process...\n');

  if (debugMode) {
    console.log('🐛 DEBUG MODE: Only updating activity.json, no git commits will be created\n');
  }

  const today = new Date();
  console.log(`📅 Today: ${today.toDateString()}\n`);

  // Check if it's a weekend
  if (isWeekend(today)) {
    console.log('🏖️  It\'s the weekend! Skipping commits.');
    console.log('   Enjoy your time off! 😊');
    return;
  }

  // Configure git for CI environments (skip in debug mode)
  if (!debugMode) {
    await configureGit();
  }

  // Get random number of commits for today
  const commitsToday = getRandomCommitCount();
  console.log(`📊 Creating ${commitsToday} ${debugMode ? 'activity record(s)' : 'commit(s)'} today\n`);

  // Create commits
  for (let i = 0; i < commitsToday; i++) {
    const message = getRandomCommitMessage();
    await createCommit(message, debugMode);

    // Small delay between commits
    if (i < commitsToday - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // Push to remote (skip in debug mode)
  if (!debugMode) {
    console.log('');
    await pushToRemote();
  }

  console.log(`\n✅ Daily ${debugMode ? 'debug run' : 'commit'} complete!`);
  console.log(`📈 Total ${debugMode ? 'records' : 'commits'} today: ${commitsToday}`);
}

// Run the daily commit
dailyCommit(DEBUG_MODE).catch((error: Error) => {
  console.error('❌ Error during daily commit:', error.message);
  process.exit(1);
});
