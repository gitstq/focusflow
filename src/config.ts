/**
 * FocusFlow Configuration Manager
 */

import Conf from 'conf';
import { Config, DEFAULT_CONFIG } from './index.js';

interface ConfigSchema {
  config: Config;
  projects: Record<string, { id: string; name: string; path?: string; color?: string }>;
  tasks: Record<string, unknown>;
}

const store = new Conf<ConfigSchema>({
  projectName: 'focusflow',
  defaults: {
    config: DEFAULT_CONFIG,
    projects: {},
    tasks: {},
  },
});

export function getConfig(): Config {
  return store.get('config') || DEFAULT_CONFIG;
}

export function updateConfig(updates: Partial<Config>): Config {
  const current = getConfig();
  const updated = { ...current, ...updates };
  store.set('config', updated);
  return updated;
}

export function resetConfig(): void {
  store.set('config', DEFAULT_CONFIG);
}

export function setWorkDuration(minutes: number): void {
  if (minutes < 1 || minutes > 120) {
    throw new Error('Work duration must be between 1 and 120 minutes');
  }
  updateConfig({ workDuration: minutes });
}

export function setBreakDuration(shortBreak: number, longBreak: number): void {
  if (shortBreak < 1 || shortBreak > 60) {
    throw new Error('Short break must be between 1 and 60 minutes');
  }
  if (longBreak < 1 || longBreak > 120) {
    throw new Error('Long break must be between 1 and 120 minutes');
  }
  updateConfig({ shortBreakDuration: shortBreak, longBreakDuration: longBreak });
}

export function setDailyGoal(pomodoros: number): void {
  if (pomodoros < 1 || pomodoros > 20) {
    throw new Error('Daily goal must be between 1 and 20 pomodoros');
  }
  updateConfig({ dailyGoal: pomodoros });
}

export function toggleNotifications(enabled: boolean): void {
  updateConfig({ notifications: enabled });
}

export function toggleSound(enabled: boolean): void {
  updateConfig({ soundEnabled: enabled });
}

export function displayConfig(): void {
  const config = getConfig();
  console.log('\n📋 Current Configuration:');
  console.log(`  Work Duration: ${config.workDuration} minutes`);
  console.log(`  Short Break: ${config.shortBreakDuration} minutes`);
  console.log(`  Long Break: ${config.longBreakDuration} minutes`);
  console.log(`  Long Break Interval: ${config.longBreakInterval} pomodoros`);
  console.log(`  Daily Goal: ${config.dailyGoal} pomodoros`);
  console.log(`  Notifications: ${config.notifications ? '✅' : '❌'}`);
  console.log(`  Sound: ${config.soundEnabled ? '✅' : '❌'}`);
  console.log(`  Auto-start Break: ${config.autoStartBreak ? '✅' : '❌'}`);
  console.log(`  Auto-start Work: ${config.autoStartWork ? '✅' : '❌'}`);
}
