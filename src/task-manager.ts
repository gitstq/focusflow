/**
 * FocusFlow Task Manager
 */

import { randomUUID } from 'crypto';
import Conf from 'conf';
import { Task } from './index.js';

interface TaskStore {
  tasks: Record<string, Task>;
}

const store = new Conf<TaskStore>({
  projectName: 'focusflow',
  configName: 'tasks',
  defaults: {
    tasks: {},
  },
});

export function createTask(
  title: string,
  options: {
    description?: string;
    project?: string;
    priority?: 'low' | 'medium' | 'high';
    estimatedPomodoros?: number;
  } = {}
): Task {
  const task: Task = {
    id: randomUUID(),
    title,
    description: options.description,
    project: options.project,
    priority: options.priority || 'medium',
    status: 'pending',
    estimatedPomodoros: options.estimatedPomodoros,
    completedPomodoros: 0,
    createdAt: new Date(),
  };

  const tasks = store.get('tasks');
  tasks[task.id] = task;
  store.set('tasks', tasks);

  return task;
}

export function getTask(id: string): Task | undefined {
  const tasks = store.get('tasks');
  return tasks[id];
}

export function getAllTasks(): Task[] {
  const tasks = store.get('tasks');
  return Object.values(tasks).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPendingTasks(): Task[] {
  return getAllTasks().filter(t => t.status === 'pending' || t.status === 'in-progress');
}

export function getCompletedTasks(): Task[] {
  return getAllTasks().filter(t => t.status === 'completed');
}

export function updateTask(id: string, updates: Partial<Task>): Task | undefined {
  const tasks = store.get('tasks');
  const task = tasks[id];
  
  if (!task) return undefined;

  const updated = { ...task, ...updates };
  tasks[id] = updated;
  store.set('tasks', tasks);

  return updated;
}

export function startTask(id: string): Task | undefined {
  return updateTask(id, { status: 'in-progress' });
}

export function completeTask(id: string): Task | undefined {
  return updateTask(id, { 
    status: 'completed', 
    completedAt: new Date() 
  });
}

export function incrementTaskPomodoro(id: string): Task | undefined {
  const task = getTask(id);
  if (!task) return undefined;
  
  return updateTask(id, { 
    completedPomodoros: task.completedPomodoros + 1 
  });
}

export function deleteTask(id: string): boolean {
  const tasks = store.get('tasks');
  
  if (!tasks[id]) return false;
  
  delete tasks[id];
  store.set('tasks', tasks);
  
  return true;
}

export function clearCompletedTasks(): number {
  const tasks = store.get('tasks');
  const completedIds = Object.keys(tasks).filter(id => tasks[id].status === 'completed');
  
  completedIds.forEach(id => delete tasks[id]);
  store.set('tasks', tasks);

  return completedIds.length;
}

export function getTasksByProject(project: string): Task[] {
  return getAllTasks().filter(t => t.project === project);
}

export function displayTasks(tasks: Task[]): void {
  if (tasks.length === 0) {
    console.log('No tasks found.');
    return;
  }

  console.log('\n📝 Tasks:\n');
  
  tasks.forEach((task, index) => {
    const statusIcon = task.status === 'completed' ? '✅' : 
                       task.status === 'in-progress' ? '🔄' : '⏳';
    const priorityIcon = task.priority === 'high' ? '🔴' : 
                         task.priority === 'medium' ? '🟡' : '🟢';
    
    console.log(`${index + 1}. ${statusIcon} ${priorityIcon} ${task.title}`);
    if (task.description) {
      console.log(`   ${task.description}`);
    }
    if (task.project) {
      console.log(`   📁 Project: ${task.project}`);
    }
    console.log(`   🍅 ${task.completedPomodoros}${task.estimatedPomodoros ? `/${task.estimatedPomodoros}` : ''} pomodoros`);
    console.log('');
  });
}
