/**
 * FocusFlow - A developer-focused Pomodoro CLI
 * 
 * Features:
 * - Task-driven pomodoro sessions
 * - Git integration for tracking code output
 * - Productivity analytics and reports
 * - Multi-project support
 * - Flexible notifications
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  project?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'completed';
  estimatedPomodoros?: number;
  completedPomodoros: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface PomodoroSession {
  id: string;
  taskId?: string;
  project?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  type: 'work' | 'short-break' | 'long-break';
  status: 'running' | 'paused' | 'completed' | 'interrupted';
  gitCommits?: string[];
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  path?: string;
  color?: string;
  totalPomodoros: number;
  totalMinutes: number;
}

export interface DailyStats {
  date: string;
  totalPomodoros: number;
  totalMinutes: number;
  tasksCompleted: number;
  focusScore: number;
  projects: Record<string, number>;
}

export interface Config {
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  longBreakInterval: number;
  dailyGoal: number;
  notifications: boolean;
  soundEnabled: boolean;
  autoStartBreak: boolean;
  autoStartWork: boolean;
}

export const DEFAULT_CONFIG: Config = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  dailyGoal: 8,
  notifications: true,
  soundEnabled: true,
  autoStartBreak: false,
  autoStartWork: false,
};

export * from './timer.js';
export * from './task-manager.js';
export * from './stats.js';
export * from './config.js';
