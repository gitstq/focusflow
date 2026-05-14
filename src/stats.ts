/**
 * FocusFlow Statistics Manager
 */

import { randomUUID } from 'crypto';
import Conf from 'conf';
import { format, startOfWeek, endOfWeek, subDays, differenceInDays } from 'date-fns';
import { PomodoroSession, DailyStats } from './index.js';

interface StatsStore {
  sessions: PomodoroSession[];
  dailyStats: Record<string, DailyStats>;
}

const store = new Conf<StatsStore>({
  projectName: 'focusflow',
  configName: 'stats',
  defaults: {
    sessions: [],
    dailyStats: {},
  },
});

export function saveSession(session: PomodoroSession): void {
  const data = store.get('sessions');
  data.push(session);
  store.set('sessions', data);
}

export function getSessions(options: {
  startDate?: Date;
  endDate?: Date;
  project?: string;
  type?: 'work' | 'short-break' | 'long-break';
} = {}): PomodoroSession[] {
  let sessions = store.get('sessions');

  if (options.startDate) {
    sessions = sessions.filter(s => new Date(s.startTime) >= options.startDate!);
  }

  if (options.endDate) {
    sessions = sessions.filter(s => new Date(s.startTime) <= options.endDate!);
  }

  if (options.project) {
    sessions = sessions.filter(s => s.project === options.project);
  }

  if (options.type) {
    sessions = sessions.filter(s => s.type === options.type);
  }

  return sessions.sort((a, b) => 
    new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
  );
}

export function getTodayStats(): DailyStats {
  const today = format(new Date(), 'yyyy-MM-dd');
  const dailyStats = store.get('dailyStats');
  
  return dailyStats[today] || {
    date: today,
    totalPomodoros: 0,
    totalMinutes: 0,
    tasksCompleted: 0,
    focusScore: 0,
    projects: {},
  };
}

export function updateTodayStats(session: PomodoroSession): void {
  if (session.type !== 'work') return;

  const today = format(new Date(), 'yyyy-MM-dd');
  const dailyStats = store.get('dailyStats');
  const current = dailyStats[today] || {
    date: today,
    totalPomodoros: 0,
    totalMinutes: 0,
    tasksCompleted: 0,
    focusScore: 100,
    projects: {},
  };

  current.totalPomodoros += 1;
  current.totalMinutes += session.duration;

  if (session.project) {
    current.projects[session.project] = (current.projects[session.project] || 0) + 1;
  }

  // Calculate focus score based on completed vs interrupted sessions
  const todaySessions = getSessions({
    startDate: new Date(today),
    type: 'work',
  });
  
  const completed = todaySessions.filter(s => s.status === 'completed').length;
  const total = todaySessions.length;
  current.focusScore = total > 0 ? Math.round((completed / total) * 100) : 100;

  dailyStats[today] = current;
  store.set('dailyStats', dailyStats);
}

export function getWeekStats(): DailyStats[] {
  const start = startOfWeek(new Date());
  const end = endOfWeek(new Date());
  const dailyStats = store.get('dailyStats');
  
  const stats: DailyStats[] = [];
  let current = start;

  while (current <= end) {
    const dateStr = format(current, 'yyyy-MM-dd');
    stats.push(dailyStats[dateStr] || {
      date: dateStr,
      totalPomodoros: 0,
      totalMinutes: 0,
      tasksCompleted: 0,
      focusScore: 0,
      projects: {},
    });
    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }

  return stats;
}

export function getMonthlyStats(): DailyStats[] {
  const dailyStats = store.get('dailyStats');
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  return Object.values(dailyStats)
    .filter(s => {
      const date = new Date(s.date);
      return date >= thirtyDaysAgo && date <= today;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export function getProductivityInsights(): {
  bestDay: string;
  averagePomodoros: number;
  totalPomodoros: number;
  totalHours: number;
  streak: number;
  mostProductiveProject: string | null;
} {
  const dailyStats = store.get('dailyStats');
  const stats = Object.values(dailyStats);

  // Find best day
  const bestDay = stats.reduce((best, current) => 
    current.totalPomodoros > (best?.totalPomodoros || 0) ? current : best
  , stats[0]);

  // Calculate averages
  const totalPomodoros = stats.reduce((sum, s) => sum + s.totalPomodoros, 0);
  const totalMinutes = stats.reduce((sum, s) => sum + s.totalMinutes, 0);
  const averagePomodoros = stats.length > 0 ? totalPomodoros / stats.length : 0;

  // Calculate streak
  let streak = 0;
  const today = new Date();
  let checkDate = today;

  while (true) {
    const dateStr = format(checkDate, 'yyyy-MM-dd');
    const dayStats = dailyStats[dateStr];
    
    if (dayStats && dayStats.totalPomodoros > 0) {
      streak++;
      checkDate = subDays(checkDate, 1);
    } else {
      break;
    }
  }

  // Find most productive project
  const projectTotals: Record<string, number> = {};
  stats.forEach(s => {
    Object.entries(s.projects).forEach(([project, count]) => {
      projectTotals[project] = (projectTotals[project] || 0) + count;
    });
  });

  const mostProductiveProject = Object.entries(projectTotals)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    bestDay: bestDay?.date || 'N/A',
    averagePomodoros: Math.round(averagePomodoros * 10) / 10,
    totalPomodoros,
    totalHours: Math.round(totalMinutes / 60 * 10) / 10,
    streak,
    mostProductiveProject,
  };
}

export function displayTodayStats(): void {
  const stats = getTodayStats();
  
  console.log('\n📊 Today\'s Stats:');
  console.log(`  🍅 Pomodoros: ${stats.totalPomodoros}`);
  console.log(`  ⏱️  Focus Time: ${stats.totalMinutes} minutes`);
  console.log(`  🎯 Focus Score: ${stats.focusScore}%`);
  
  if (Object.keys(stats.projects).length > 0) {
    console.log('  📁 Projects:');
    Object.entries(stats.projects).forEach(([project, count]) => {
      console.log(`     - ${project}: ${count} pomodoros`);
    });
  }
}

export function displayWeekStats(): void {
  const stats = getWeekStats();
  const totalPomodoros = stats.reduce((sum, s) => sum + s.totalPomodoros, 0);
  const totalMinutes = stats.reduce((sum, s) => sum + s.totalMinutes, 0);

  console.log('\n📊 This Week:');
  console.log(`  🍅 Total Pomodoros: ${totalPomodoros}`);
  console.log(`  ⏱️  Total Focus Time: ${Math.round(totalMinutes / 60 * 10) / 10} hours`);
  
  console.log('\n  Daily Breakdown:');
  stats.forEach(s => {
    const day = format(new Date(s.date), 'EEE');
    const bar = '█'.repeat(s.totalPomodoros) + '░'.repeat(Math.max(0, 8 - s.totalPomodoros));
    console.log(`    ${day} ${bar} ${s.totalPomodoros}`);
  });
}

export function displayInsights(): void {
  const insights = getProductivityInsights();
  
  console.log('\n💡 Productivity Insights:');
  console.log(`  🔥 Current Streak: ${insights.streak} days`);
  console.log(`  📅 Best Day: ${insights.bestDay}`);
  console.log(`  📈 Average Pomodoros: ${insights.averagePomodoros}/day`);
  console.log(`  ⏱️  Total Focus Time: ${insights.totalHours} hours`);
  console.log(`  🍅 Total Pomodoros: ${insights.totalPomodoros}`);
  
  if (insights.mostProductiveProject) {
    console.log(`  🏆 Top Project: ${insights.mostProductiveProject}`);
  }
}
