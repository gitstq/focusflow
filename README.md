<div align="center">

# 🍅 FocusFlow

**A Developer-Focused Pomodoro CLI**

*Boost your productivity with intelligent time tracking, task management, and Git integration*

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)

[English](#english) | [简体中文](#简体中文) | [繁體中文](#繁體中文)

</div>

---

<a name="english"></a>
## 🇺🇸 English

### 🎉 Project Introduction

FocusFlow is a powerful command-line Pomodoro timer designed specifically for developers. It combines the proven Pomodoro Technique with modern development workflows, offering seamless Git integration, intelligent task management, and comprehensive productivity analytics.

Whether you're debugging complex code, writing documentation, or learning new technologies, FocusFlow helps you maintain deep focus while tracking your productive hours.

### ✨ Core Features

- **🍅 Smart Pomodoro Timer** - Customizable work/break durations with visual countdown
- **📝 Task Management** - Create, prioritize, and track tasks with Pomodoro estimates
- **🔗 Git Integration** - Automatically tracks commits made during focus sessions
- **📊 Productivity Analytics** - Daily, weekly, and monthly statistics with insights
- **🔔 Desktop Notifications** - Get notified when sessions complete (optional)
- **⚙️ Flexible Configuration** - Customize every aspect of your workflow
- **🎯 Interactive Mode** - User-friendly menu-driven interface
- **📈 Streak Tracking** - Build and maintain your productivity streak

### 🚀 Quick Start

#### Prerequisites

- Node.js >= 18.0.0
- npm or yarn

#### Installation

```bash
# Install globally
npm install -g focusflow

# Or use with npx (no installation required)
npx focusflow --help
```

#### Basic Usage

```bash
# Start a 25-minute work session
ff start

# Start with custom duration
ff start --duration 50

# Take a break
ff break          # Short break (5 min)
ff break --long   # Long break (15 min)

# Interactive mode
ff interactive
```

### 📖 Detailed Usage Guide

#### Task Management

```bash
# Create a new task
ff task add "Implement user authentication" \
  --description "Add JWT-based auth" \
  --project "backend" \
  --priority high \
  --estimated 4

# List pending tasks
ff task list

# List all tasks (including completed)
ff task list --all

# Complete a task
ff task complete <task-id>

# Delete a task
ff task delete <task-id>
```

#### Statistics & Insights

```bash
# View today's statistics
ff stats today

# View weekly summary
ff stats week

# Get productivity insights
ff stats insights
```

#### Configuration

```bash
# Show current configuration
ff config show

# Set work duration (in minutes)
ff config set workDuration 30

# Set break durations
ff config set shortBreak 5
ff config set longBreak 20

# Set daily goal (number of pomodoros)
ff config set dailyGoal 10

# Toggle notifications
ff config set notifications true
ff config set sound true

# Reset to defaults
ff config reset
```

#### Keyboard Shortcuts During Sessions

| Key | Action |
|-----|--------|
| `Space` | Pause/Resume |
| `Q` | Stop session |

### 💡 Design Philosophy

FocusFlow was built with three core principles:

1. **Developer-First**: Integrates naturally with your existing development workflow, tracking Git commits and project context.

2. **Minimal Distraction**: Clean CLI interface that stays out of your way. No bloated UIs, just pure productivity.

3. **Data-Driven**: Comprehensive analytics help you understand your productivity patterns and optimize your work habits.

### 📦 Packaging & Deployment

#### Build from Source

```bash
# Clone the repository
git clone https://github.com/gitstq/focusflow.git
cd focusflow

# Install dependencies
npm install

# Build the project
npm run build

# Run locally
node dist/cli.mjs --help

# Link for global usage
npm link
```

#### Project Structure

```
focusflow/
├── src/
│   ├── cli.ts          # CLI entry point
│   ├── timer.ts        # Pomodoro timer logic
│   ├── task-manager.ts # Task management
│   ├── stats.ts        # Statistics & analytics
│   ├── config.ts       # Configuration management
│   └── index.ts        # Main exports
├── dist/               # Compiled output
├── package.json
└── tsup.config.ts      # Build configuration
```

### 🤝 Contributing Guide

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes following [Angular Commit Convention](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

#### Development Commands

```bash
# Run in development mode with watch
npm run dev

# Run tests
npm test

# Type check
npm run typecheck

# Lint code
npm run lint
```

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<a name="简体中文"></a>
## 🇨🇳 简体中文

### 🎉 项目介绍

FocusFlow 是一款专为开发者设计的强大命令行番茄钟工具。它将经过验证的番茄工作法与现代开发工作流相结合，提供无缝的 Git 集成、智能任务管理和全面的生产力分析。

无论您是在调试复杂代码、编写文档还是学习新技术，FocusFlow 都能帮助您保持深度专注，同时追踪您的有效工作时间。

### ✨ 核心功能

- **🍅 智能番茄钟** - 可自定义工作/休息时长，带可视化倒计时
- **📝 任务管理** - 创建、优先排序和追踪任务，支持番茄钟预估
- **🔗 Git 集成** - 自动追踪专注期间提交的代码
- **📊 生产力分析** - 日、周、月统计数据与洞察
- **🔔 桌面通知** - 会话完成时获取通知（可选）
- **⚙️ 灵活配置** - 自定义工作流程的各个方面
- **🎯 交互模式** - 用户友好的菜单驱动界面
- **📈 连续记录** - 建立并保持您的生产力连续天数

### 🚀 快速开始

#### 环境要求

- Node.js >= 18.0.0
- npm 或 yarn

#### 安装

```bash
# 全局安装
npm install -g focusflow

# 或使用 npx（无需安装）
npx focusflow --help
```

#### 基本使用

```bash
# 开始一个25分钟的工作会话
ff start

# 使用自定义时长
ff start --duration 50

# 休息一下
ff break          # 短休息（5分钟）
ff break --long   # 长休息（15分钟）

# 交互模式
ff interactive
```

### 📖 详细使用指南

#### 任务管理

```bash
# 创建新任务
ff task add "实现用户认证" \
  --description "添加基于JWT的认证" \
  --project "后端" \
  --priority high \
  --estimated 4

# 列出待办任务
ff task list

# 列出所有任务（包括已完成）
ff task list --all

# 完成任务
ff task complete <任务ID>

# 删除任务
ff task delete <任务ID>
```

#### 统计与洞察

```bash
# 查看今日统计
ff stats today

# 查看本周摘要
ff stats week

# 获取生产力洞察
ff stats insights
```

#### 配置

```bash
# 显示当前配置
ff config show

# 设置工作时长（分钟）
ff config set workDuration 30

# 设置休息时长
ff config set shortBreak 5
ff config set longBreak 20

# 设置每日目标（番茄钟数量）
ff config set dailyGoal 10

# 切换通知
ff config set notifications true
ff config set sound true

# 重置为默认值
ff config reset
```

#### 会话期间的键盘快捷键

| 按键 | 操作 |
|-----|------|
| `空格` | 暂停/继续 |
| `Q` | 停止会话 |

### 💡 设计理念

FocusFlow 基于三个核心原则构建：

1. **开发者优先**：与您现有的开发工作流自然集成，追踪 Git 提交和项目上下文。

2. **最小干扰**：简洁的 CLI 界面，不会打扰您。没有臃肿的 UI，只有纯粹的生产力。

3. **数据驱动**：全面的分析帮助您了解生产力模式并优化工作习惯。

### 📦 打包与部署

#### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/gitstq/focusflow.git
cd focusflow

# 安装依赖
npm install

# 构建项目
npm run build

# 本地运行
node dist/cli.mjs --help

# 链接以全局使用
npm link
```

#### 项目结构

```
focusflow/
├── src/
│   ├── cli.ts          # CLI 入口
│   ├── timer.ts        # 番茄钟逻辑
│   ├── task-manager.ts # 任务管理
│   ├── stats.ts        # 统计与分析
│   ├── config.ts       # 配置管理
│   └── index.ts        # 主导出
├── dist/               # 编译输出
├── package.json
└── tsup.config.ts      # 构建配置
```

### 🤝 贡献指南

欢迎贡献！以下是您可以提供帮助的方式：

1. **Fork** 本仓库
2. **创建** 功能分支 (`git checkout -b feature/amazing-feature`)
3. **提交** 您的更改，遵循 [Angular 提交规范](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
4. **推送** 到分支 (`git push origin feature/amazing-feature`)
5. **开启** Pull Request

#### 开发命令

```bash
# 以监视模式运行开发环境
npm run dev

# 运行测试
npm test

# 类型检查
npm run typecheck

# 代码检查
npm run lint
```

### 📄 许可证

本项目采用 MIT 许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

---

<a name="繁體中文"></a>
## 🇹🇼 繁體中文

### 🎉 專案介紹

FocusFlow 是一款專為開發者設計的強大命令列番茄鐘工具。它將經過驗證的番茄工作法與現代開發工作流程相結合，提供無縫的 Git 整合、智慧任務管理和全面的生產力分析。

無論您是在除錯複雜程式碼、撰寫文件還是學習新技術，FocusFlow 都能幫助您保持深度專注，同時追蹤您的有效工作時間。

### ✨ 核心功能

- **🍅 智慧番茄鐘** - 可自訂工作/休息時長，帶視覺化倒數計時
- **📝 任務管理** - 建立、優先排序和追蹤任務，支援番茄鐘預估
- **🔗 Git 整合** - 自動追蹤專注期間提交的程式碼
- **📊 生產力分析** - 日、週、月統計數據與洞察
- **🔔 桌面通知** - 工作階段完成時獲取通知（可選）
- **⚙️ 彈性設定** - 自訂工作流程的各個方面
- **🎯 互動模式** - 使用者友善的選單驅動介面
- **📈 連續記錄** - 建立並保持您的生產力連續天數

### 🚀 快速開始

#### 環境需求

- Node.js >= 18.0.0
- npm 或 yarn

#### 安裝

```bash
# 全域安裝
npm install -g focusflow

# 或使用 npx（無需安裝）
npx focusflow --help
```

#### 基本使用

```bash
# 開始一個25分鐘的工作階段
ff start

# 使用自訂時長
ff start --duration 50

# 休息一下
ff break          # 短休息（5分鐘）
ff break --long   # 長休息（15分鐘）

# 互動模式
ff interactive
```

### 📖 詳細使用指南

#### 任務管理

```bash
# 建立新任務
ff task add "實作使用者認證" \
  --description "新增基於JWT的認證" \
  --project "後端" \
  --priority high \
  --estimated 4

# 列出待辦任務
ff task list

# 列出所有任務（包括已完成）
ff task list --all

# 完成任務
ff task complete <任務ID>

# 刪除任務
ff task delete <任務ID>
```

#### 統計與洞察

```bash
# 查看今日統計
ff stats today

# 查看本週摘要
ff stats week

# 獲取生產力洞察
ff stats insights
```

#### 設定

```bash
# 顯示目前設定
ff config show

# 設定工作時長（分鐘）
ff config set workDuration 30

# 設定休息時長
ff config set shortBreak 5
ff config set longBreak 20

# 設定每日目標（番茄鐘數量）
ff config set dailyGoal 10

# 切換通知
ff config set notifications true
ff config set sound true

# 重設為預設值
ff config reset
```

#### 工作階段期間的鍵盤快速鍵

| 按鍵 | 操作 |
|-----|------|
| `空白鍵` | 暫停/繼續 |
| `Q` | 停止工作階段 |

### 💡 設計理念

FocusFlow 基於三個核心原則建構：

1. **開發者優先**：與您現有的開發工作流程自然整合，追蹤 Git 提交和專案情境。

2. **最小干擾**：簡潔的 CLI 介面，不會打擾您。沒有臃腫的 UI，只有純粹的生產力。

3. **資料驅動**：全面的分析幫助您了解生產力模式並最佳化工作習慣。

### 📦 打包與部署

#### 從原始碼建構

```bash
# 複製儲存庫
git clone https://github.com/gitstq/focusflow.git
cd focusflow

# 安裝相依套件
npm install

# 建構專案
npm run build

# 本地執行
node dist/cli.mjs --help

# 連結以全域使用
npm link
```

#### 專案結構

```
focusflow/
├── src/
│   ├── cli.ts          # CLI 進入點
│   ├── timer.ts        # 番茄鐘邏輯
│   ├── task-manager.ts # 任務管理
│   ├── stats.ts        # 統計與分析
│   ├── config.ts       # 設定管理
│   └── index.ts        # 主要匯出
├── dist/               # 編譯輸出
├── package.json
└── tsup.config.ts      # 建構設定
```

### 🤝 貢獻指南

歡迎貢獻！以下是您可以提供協助的方式：

1. **Fork** 本儲存庫
2. **建立** 功能分支 (`git checkout -b feature/amazing-feature`)
3. **提交** 您的變更，遵循 [Angular 提交規範](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#commit)
4. **推送** 到分支 (`git push origin feature/amazing-feature`)
5. **開啟** Pull Request

#### 開發命令

```bash
# 以監視模式執行開發環境
npm run dev

# 執行測試
npm test

# 類型檢查
npm run typecheck

# 程式碼檢查
npm run lint
```

### 📄 授權條款

本專案採用 MIT 授權條款 - 詳情請參閱 [LICENSE](LICENSE) 檔案。

---

<div align="center">

**Made with ❤️ for developers who love productivity**

</div>
