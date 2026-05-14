/**
 * FocusFlow Pomodoro Timer
 */

import { randomUUID } from 'crypto';
import { createSpinner } from 'nanospinner';
import chalk from 'chalk';
import notifier from 'node-notifier';
import { getConfig } from './config.js';
import { incrementTaskPomodoro } from './task-manager.js';
import { saveSession, getTodayStats, updateTodayStats } from './stats.js';
import { PomodoroSession } from './index.js';
import simpleGit from 'simple-git';

export class PomodoroTimer {
  private session: PomodoroSession;
  private remainingSeconds: number;
  private intervalId: NodeJS.Timeout | null = null;
  private isPaused: boolean = false;
  private onTick?: (remaining: number) => void;
  private onComplete?: (session: PomodoroSession) => void;

  constructor(
    type: 'work' | 'short-break' | 'long-break' = 'work',
    options: {
      taskId?: string;
      project?: string;
      customDuration?: number;
      onTick?: (remaining: number) => void;
      onComplete?: (session: PomodoroSession) => void;
    } = {}
  ) {
    const config = getConfig();
    let duration: number;

    switch (type) {
      case 'work':
        duration = options.customDuration || config.workDuration;
        break;
      case 'short-break':
        duration = config.shortBreakDuration;
        break;
      case 'long-break':
        duration = config.longBreakDuration;
        break;
    }

    this.session = {
      id: randomUUID(),
      taskId: options.taskId,
      project: options.project,
      startTime: new Date(),
      duration,
      type,
      status: 'running',
    };

    this.remainingSeconds = duration * 60;
    this.onTick = options.onTick;
    this.onComplete = options.onComplete;
  }

  start(): void {
    if (this.intervalId) return;

    this.session.status = 'running';
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.remainingSeconds--;
        this.onTick?.(this.remainingSeconds);

        if (this.remainingSeconds <= 0) {
          this.complete();
        }
      }
    }, 1000);
  }

  pause(): void {
    this.isPaused = true;
    this.session.status = 'paused';
  }

  resume(): void {
    this.isPaused = false;
    this.session.status = 'running';
  }

  toggle(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  stop(): PomodoroSession {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.session.status = 'interrupted';
    this.session.endTime = new Date();
    
    return this.session;
  }

  private async complete(): Promise<void> {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    this.session.status = 'completed';
    this.session.endTime = new Date();

    // Update task if associated
    if (this.session.taskId) {
      incrementTaskPomodoro(this.session.taskId);
    }

    // Get git commits if in a git repo
    if (this.session.type === 'work') {
      try {
        const git = simpleGit();
        const isRepo = await git.checkIsRepo();
        if (isRepo) {
          const log = await git.log(['--since', this.session.startTime.toISOString()]);
          this.session.gitCommits = log.all.map(c => c.hash);
        }
      } catch {
        // Not in a git repo or git not available
      }
    }

    // Save session
    saveSession(this.session);

    // Update daily stats
    updateTodayStats(this.session);

    // Send notification
    const config = getConfig();
    if (config.notifications) {
      const message = this.session.type === 'work' 
        ? '🍅 Work session complete! Time for a break.'
        : '☕ Break is over! Ready to focus?';
      
      notifier.notify({
        title: 'FocusFlow',
        message,
        sound: config.soundEnabled,
      });
    }

    this.onComplete?.(this.session);
  }

  getRemainingTime(): { minutes: number; seconds: number } {
    const minutes = Math.floor(this.remainingSeconds / 60);
    const seconds = this.remainingSeconds % 60;
    return { minutes, seconds };
  }

  getSession(): PomodoroSession {
    return this.session;
  }

  isRunning(): boolean {
    return this.session.status === 'running';
  }

  isPausedState(): boolean {
    return this.isPaused;
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function displayTimer(remaining: number, type: string): void {
  const time = formatTime(remaining);
  const icon = type === 'work' ? '🍅' : '☕';
  const color = type === 'work' ? chalk.red : chalk.green;
  
  process.stdout.write(`\r${icon} ${color(time)} ${type === 'work' ? 'Focus!' : 'Relax...'}`);
}

export async function runPomodoro(
  type: 'work' | 'short-break' | 'long-break' = 'work',
  options: {
    taskId?: string;
    project?: string;
    customDuration?: number;
  } = {}
): Promise<PomodoroSession> {
  return new Promise((resolve) => {
    const spinner = createSpinner().start();
    
    const timer = new PomodoroTimer(type, {
      ...options,
      onTick: (remaining) => {
        displayTimer(remaining, type);
      },
      onComplete: (session) => {
        spinner.success({ text: 'Session complete!' });
        resolve(session);
      },
    });

    timer.start();

    // Handle keyboard input
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on('data', (key) => {
      const keyPressed = key.toString('utf8');
      
      if (keyPressed === ' ') {
        timer.toggle();
        const status = timer.isPausedState() ? 'Paused' : 'Running';
        console.log(`\n${status}`);
      } else if (keyPressed === 'q' || keyPressed === '\u0003') {
        const session = timer.stop();
        console.log('\nSession stopped.');
        resolve(session);
      }
    });
  });
}
