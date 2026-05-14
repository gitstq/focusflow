#!/usr/bin/env node

/**
 * FocusFlow CLI - A developer-focused Pomodoro timer
 */

import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import figlet from 'figlet';
import {
  createTask,
  getAllTasks,
  getPendingTasks,
  startTask,
  completeTask,
  deleteTask,
  displayTasks,
} from './task-manager.js';
import {
  getConfig,
  updateConfig,
  displayConfig,
} from './config.js';
import {
  runPomodoro,
} from './timer.js';
import {
  displayTodayStats,
  displayWeekStats,
  displayInsights,
} from './stats.js';

const program = new Command();

// Display banner
function showBanner(): void {
  console.log(
    chalk.cyan(
      figlet.textSync('FocusFlow', { horizontalLayout: 'full' })
    )
  );
  console.log(chalk.gray('A developer-focused Pomodoro CLI\n'));
}

program
  .name('focusflow')
  .alias('ff')
  .description('🍅 A developer-focused Pomodoro CLI with task management and productivity analytics')
  .version('1.0.0');

// Start command
program
  .command('start')
  .alias('s')
  .description('Start a pomodoro session')
  .option('-d, --duration <minutes>', 'Custom work duration in minutes')
  .option('-t, --task <taskId>', 'Associate with a task')
  .option('-p, --project <name>', 'Project name')
  .action(async (options) => {
    showBanner();
    
    const duration = options.duration ? parseInt(options.duration) : undefined;
    
    console.log(chalk.cyan('\n🍅 Starting work session...\n'));
    console.log(chalk.gray('Press SPACE to pause/resume, Q to quit\n'));
    
    await runPomodoro('work', {
      customDuration: duration,
      taskId: options.task,
      project: options.project,
    });
  });

// Break command
program
  .command('break')
  .alias('b')
  .description('Start a break session')
  .option('-l, --long', 'Start a long break')
  .action(async (options) => {
    const type = options.long ? 'long-break' : 'short-break';
    const config = getConfig();
    
    console.log(chalk.green(`\n☕ Starting ${type === 'long-break' ? 'long' : 'short'} break...\n`));
    console.log(chalk.gray('Press SPACE to pause/resume, Q to quit\n'));
    
    await runPomodoro(type);
  });

// Task commands
const taskCommand = program
  .command('task')
  .alias('t')
  .description('Manage tasks');

taskCommand
  .command('add')
  .description('Create a new task')
  .argument('<title>', 'Task title')
  .option('-d, --description <text>', 'Task description')
  .option('-p, --project <name>', 'Project name')
  .option('-e, --estimated <number>', 'Estimated pomodoros')
  .option('--priority <level>', 'Priority (low, medium, high)')
  .action((title, options) => {
    const task = createTask(title, {
      description: options.description,
      project: options.project,
      estimatedPomodoros: options.estimated ? parseInt(options.estimated) : undefined,
      priority: options.priority,
    });
    
    console.log(chalk.green(`\n✅ Task created: ${task.title}`));
    console.log(chalk.gray(`   ID: ${task.id}\n`));
  });

taskCommand
  .command('list')
  .alias('ls')
  .description('List all tasks')
  .option('-a, --all', 'Show completed tasks too')
  .action((options) => {
    const tasks = options.all ? getAllTasks() : getPendingTasks();
    displayTasks(tasks);
  });

taskCommand
  .command('complete <taskId>')
  .alias('done')
  .description('Mark a task as complete')
  .action((taskId) => {
    const task = completeTask(taskId);
    if (task) {
      console.log(chalk.green(`\n✅ Task completed: ${task.title}\n`));
    } else {
      console.log(chalk.red('\n❌ Task not found\n'));
    }
  });

taskCommand
  .command('delete <taskId>')
  .alias('rm')
  .description('Delete a task')
  .action((taskId) => {
    if (deleteTask(taskId)) {
      console.log(chalk.green('\n✅ Task deleted\n'));
    } else {
      console.log(chalk.red('\n❌ Task not found\n'));
    }
  });

// Stats commands
const statsCommand = program
  .command('stats')
  .description('View productivity statistics');

statsCommand
  .command('today')
  .description("Show today's statistics")
  .action(() => {
    showBanner();
    displayTodayStats();
  });

statsCommand
  .command('week')
  .description("Show this week's statistics")
  .action(() => {
    showBanner();
    displayWeekStats();
  });

statsCommand
  .command('insights')
  .description('Show productivity insights')
  .action(() => {
    showBanner();
    displayInsights();
  });

// Config commands
const configCommand = program
  .command('config')
  .description('Manage configuration');

configCommand
  .command('show')
  .description('Show current configuration')
  .action(() => {
    displayConfig();
  });

configCommand
  .command('set <key> <value>')
  .description('Set a configuration value')
  .action((key, value) => {
    const numValue = parseInt(value);
    const boolValue = value === 'true';
    
    switch (key) {
      case 'workDuration':
        updateConfig({ workDuration: numValue });
        break;
      case 'shortBreak':
        updateConfig({ shortBreakDuration: numValue });
        break;
      case 'longBreak':
        updateConfig({ longBreakDuration: numValue });
        break;
      case 'dailyGoal':
        updateConfig({ dailyGoal: numValue });
        break;
      case 'notifications':
        updateConfig({ notifications: boolValue });
        break;
      case 'sound':
        updateConfig({ soundEnabled: boolValue });
        break;
      default:
        console.log(chalk.red(`\n❌ Unknown config key: ${key}\n`));
        return;
    }
    
    console.log(chalk.green(`\n✅ Updated ${key} to ${value}\n`));
  });

configCommand
  .command('reset')
  .description('Reset configuration to defaults')
  .action(() => {
    const { resetConfig } = require('./config.js');
    resetConfig();
    console.log(chalk.green('\n✅ Configuration reset to defaults\n'));
  });

// Interactive mode
program
  .command('interactive')
  .alias('i')
  .description('Start interactive mode')
  .action(async () => {
    showBanner();
    
    while (true) {
      const { action } = await inquirer.prompt([
        {
          type: 'list',
          name: 'action',
          message: 'What would you like to do?',
          choices: [
            { name: '🍅 Start Pomodoro', value: 'start' },
            { name: '☕ Take a Break', value: 'break' },
            { name: '📝 Manage Tasks', value: 'tasks' },
            { name: '📊 View Statistics', value: 'stats' },
            { name: '⚙️  Configure Settings', value: 'config' },
            { name: '❌ Exit', value: 'exit' },
          ],
        },
      ]);

      switch (action) {
        case 'start':
          await runPomodoro('work');
          break;
        case 'break':
          const { breakType } = await inquirer.prompt([
            {
              type: 'list',
              name: 'breakType',
              message: 'Which type of break?',
              choices: [
                { name: 'Short Break (5 min)', value: 'short' },
                { name: 'Long Break (15 min)', value: 'long' },
              ],
            },
          ]);
          await runPomodoro(breakType === 'long' ? 'long-break' : 'short-break');
          break;
        case 'tasks':
          const tasks = getPendingTasks();
          displayTasks(tasks);
          break;
        case 'stats':
          displayTodayStats();
          break;
        case 'config':
          displayConfig();
          break;
        case 'exit':
          console.log(chalk.cyan('\n👋 Goodbye! Stay focused!\n'));
          process.exit(0);
      }
    }
  });

// Parse arguments
program.parse();
