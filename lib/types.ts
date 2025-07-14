/**
 * Type definitions for BIT Track application
 */

/**
 * User profile information
 */
export interface User {
  name: string;
  birthDate: Date;
  avatar: string;
}

/**
 * Project status types
 */
export type ProjectStatus = "active" | "completed" | "archived";

/**
 * Project interface
 */
export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  tags: string[];
  budget: number; // in PKR
  currentVersion: string;
  notes: string; // Markdown supported
  links: Link[];
  milestones: Milestone[];
  issues: Issue[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Link interface for project resources
 */
export interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
}

/**
 * Milestone stages
 */
export type MilestoneStage =
  | "planned"
  | "working"
  | "closed"
  | "payment-received";

/**
 * Milestone interface
 */
export interface Milestone {
  id: string;
  projectId: string;
  title: string;
  version: string;
  budget: number; // in PKR
  stage: MilestoneStage;
  description?: string;
  createdAt: Date;
  dueDate?: Date;
}

/**
 * Issue priority levels
 */
export type IssuePriority = "low" | "medium" | "high" | "critical";

/**
 * Issue status
 */
export type IssueStatus = "open" | "in-progress" | "closed";

/**
 * Issue interface
 */
export interface Issue {
  id: string;
  projectId: string;
  milestoneId?: string;
  title: string;
  description: string;
  tags: string[];
  priority: IssuePriority;
  status: IssueStatus;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  comments: Comment[];
}

/**
 * Comment interface for issues
 */
export interface Comment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  createdAt: Date;
}

/**
 * Time tracking entry
 */
export interface TimeEntry {
  id: string;
  projectId: string;
  issueId?: string;
  description: string;
  duration: number; // in minutes
  date: Date;
  createdAt: Date;
}

/**
 * Wallet account types
 */
export type AccountType = "cash" | "bank" | "mobile-wallet" | "with-person";

/**
 * Wallet account interface
 */
export interface WalletAccount {
  id: string;
  name: string;
  type: AccountType;
  balance: number; // in PKR
  isDefault?: boolean;
}

/**
 * Transaction types
 */
export type TransactionType = "income" | "expense";

/**
 * Transaction categories
 */
export interface TransactionCategory {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon?: string;
}

/**
 * Transaction interface
 */
export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // in PKR
  categoryId: string;
  accountId: string;
  description?: string;
  notes?: string;
  date: Date;
  projectId?: string; // For milestone payments
  milestoneId?: string;
  createdAt: Date;
}

/**
 * Analytics data point
 */
export interface AnalyticsDataPoint {
  date: Date;
  value: number;
  label?: string;
}

/**
 * Settings interface
 */
export interface Settings {
  theme: "light" | "dark" | "system";
  defaultPaymentAccount: string;
  incomeCategories: TransactionCategory[];
  expenseCategories: TransactionCategory[];
  discord: {
    enabled: boolean;
    webhookUrl?: string;
    notifications: {
      projectCreated: boolean;
      milestoneCompleted: boolean;
      paymentReceived: boolean;
      dailySummary: boolean;
    };
  };
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalBudget: number;
  receivedPayments: number;
  pendingPayments: number;
  thisMonthIncome: number;
  thisMonthExpenses: number;
  netWorth: number;
  todayFocusTime: number; // in minutes
  weeklyFocusTime: number; // in minutes
  openIssues: number;
  dueSoonIssues: number;
}

/**
 * Focus session interface
 */
export interface FocusSession {
  id: string;
  projectId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description?: string;
}
