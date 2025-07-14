/**
 * Placeholder data for BIT Track application
 */

import {
  User,
  Project,
  Milestone,
  Issue,
  TimeEntry,
  WalletAccount,
  TransactionCategory,
  Transaction,
  Settings,
  DashboardStats,
  Comment,
} from "./types";

/**
 * Calculate age from birthdate
 */
export function calculateAge(birthDate: Date): {
  years: number;
  months: number;
  days: number;
} {
  const now = new Date();
  const birth = new Date(birthDate);

  let years = now.getFullYear() - birth.getFullYear();
  let months = now.getMonth() - birth.getMonth();
  let days = now.getDate() - birth.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months, days };
}

// User data
export const currentUser: User = {
  name: "John Doe",
  birthDate: new Date("2002-03-15"),
  avatar: ``,
};

// Transaction categories
export const defaultIncomeCategories: TransactionCategory[] = [
  { id: "1", name: "Salary", type: "income", color: "#10b981" },
  { id: "2", name: "Freelance", type: "income", color: "#3b82f6" },
  { id: "3", name: "Pocket Money", type: "income", color: "#8b5cf6" },
  { id: "4", name: "Bonus", type: "income", color: "#f59e0b" },
  { id: "5", name: "Other", type: "income", color: "#6b7280" },
];

export const defaultExpenseCategories: TransactionCategory[] = [
  { id: "6", name: "Food", type: "expense", color: "#ef4444" },
  { id: "7", name: "Transport", type: "expense", color: "#f97316" },
  { id: "8", name: "Shopping", type: "expense", color: "#ec4899" },
  { id: "9", name: "Bills", type: "expense", color: "#dc2626" },
  { id: "10", name: "Personal", type: "expense", color: "#7c3aed" },
  { id: "11", name: "Other", type: "expense", color: "#6b7280" },
];

// Wallet accounts
export const walletAccounts: WalletAccount[] = [
  { id: "acc1", name: "Cash", type: "cash", balance: 25000, isDefault: true },
  { id: "acc2", name: "Easypaisa", type: "mobile-wallet", balance: 18500 },
  { id: "acc3", name: "with Father", type: "with-person", balance: 50000 },
];

// Comments
const sampleComments: Comment[] = [
  {
    id: "com1",
    issueId: "issue1",
    author: "John Doe",
    content: "Started working on this. Should be done by tomorrow.",
    createdAt: new Date("2025-01-08T10:30:00"),
  },
  {
    id: "com2",
    issueId: "issue1",
    author: "John Doe",
    content: "Need to revise the color scheme based on client feedback.",
    createdAt: new Date("2025-01-09T14:20:00"),
  },
];

// Issues
const sampleIssues: Issue[] = [
  {
    id: "issue1",
    projectId: "proj1",
    milestoneId: "mile1",
    title: "Design landing page mockup",
    description:
      "Create a modern, responsive landing page design with hero section, features, and CTA",
    tags: ["design", "ui", "priority"],
    priority: "high",
    status: "in-progress",
    dueDate: new Date("2025-01-15"),
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-09"),
    comments: sampleComments,
  },
  {
    id: "issue2",
    projectId: "proj1",
    milestoneId: "mile1",
    title: "Implement responsive navigation",
    description: "Build a mobile-friendly navigation menu with hamburger icon",
    tags: ["development", "frontend"],
    priority: "medium",
    status: "open",
    dueDate: new Date("2025-01-18"),
    createdAt: new Date("2025-01-06"),
    updatedAt: new Date("2025-01-06"),
    comments: [],
  },
  {
    id: "issue3",
    projectId: "proj1",
    milestoneId: "mile2",
    title: "Setup authentication system",
    description:
      "Implement JWT-based auth with login, register, and password reset",
    tags: ["backend", "security"],
    priority: "critical",
    status: "open",
    dueDate: new Date("2025-01-20"),
    createdAt: new Date("2025-01-07"),
    updatedAt: new Date("2025-01-07"),
    comments: [],
  },
  {
    id: "issue4",
    projectId: "proj2",
    milestoneId: "mile3",
    title: "Create product catalog",
    description: "Design and implement product listing with filters and search",
    tags: ["feature", "ui"],
    priority: "high",
    status: "closed",
    createdAt: new Date("2025-01-02"),
    updatedAt: new Date("2025-01-08"),
    comments: [],
  },
];

// Milestones
const sampleMilestones: Milestone[] = [
  {
    id: "mile1",
    projectId: "proj1",
    title: "MVP Launch",
    version: "1.0.0",
    budget: 150000,
    stage: "working",
    description: "Initial release with core features",
    createdAt: new Date("2025-01-01"),
    dueDate: new Date("2025-01-31"),
  },
  {
    id: "mile2",
    projectId: "proj1",
    title: "User Dashboard",
    version: "1.1.0",
    budget: 80000,
    stage: "planned",
    description: "Add user dashboard with analytics",
    createdAt: new Date("2025-01-05"),
    dueDate: new Date("2025-02-15"),
  },
  {
    id: "mile3",
    projectId: "proj2",
    title: "E-commerce Integration",
    version: "2.0.0",
    budget: 200000,
    stage: "payment-received",
    description: "Complete shopping cart and payment gateway",
    createdAt: new Date("2024-12-01"),
    dueDate: new Date("2025-01-05"),
  },
];

// Projects
export const projects: Project[] = [
  {
    id: "proj1",
    title: "TechStartup Website",
    description: "Modern SaaS landing page with dashboard",
    status: "active",
    tags: ["web", "saas", "nextjs"],
    budget: 350000,
    currentVersion: "0.8.0",
    notes:
      "## Project Overview\n\nBuilding a modern SaaS platform with Next.js and Tailwind CSS.\n\n### Key Features\n- Responsive design\n- User authentication\n- Dashboard with analytics\n- Payment integration\n\n### Tech Stack\n- Next.js 14\n- TypeScript\n- Tailwind CSS\n- Prisma + PostgreSQL",
    links: [
      {
        id: "link1",
        title: "Figma Design",
        url: "https://figma.com/example",
        description: "UI/UX designs",
      },
      {
        id: "link2",
        title: "GitHub Repo",
        url: "https://github.com/example",
        description: "Source code",
      },
    ],
    milestones: sampleMilestones.filter((m) => m.projectId === "proj1"),
    issues: sampleIssues.filter((i) => i.projectId === "proj1"),
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-10"),
  },
  {
    id: "proj2",
    title: "E-commerce Mobile App",
    description: "React Native shopping app for local business",
    status: "completed",
    tags: ["mobile", "react-native", "ecommerce"],
    budget: 500000,
    currentVersion: "2.0.0",
    notes:
      "## Completed Project\n\nSuccessfully delivered e-commerce mobile app.\n\n### Features Implemented\n- Product catalog\n- Shopping cart\n- Payment gateway\n- Order tracking",
    links: [
      {
        id: "link3",
        title: "App Store",
        url: "https://apps.apple.com/example",
      },
      {
        id: "link4",
        title: "Play Store",
        url: "https://play.google.com/example",
      },
    ],
    milestones: sampleMilestones.filter((m) => m.projectId === "proj2"),
    issues: sampleIssues.filter((i) => i.projectId === "proj2"),
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2025-01-05"),
  },
];

// Time entries
export const timeEntries: TimeEntry[] = [
  {
    id: "time1",
    projectId: "proj1",
    issueId: "issue1",
    description: "Worked on landing page design",
    duration: 180,
    date: new Date("2025-01-10"),
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "time2",
    projectId: "proj1",
    description: "Client meeting and requirement gathering",
    duration: 90,
    date: new Date("2025-01-09"),
    createdAt: new Date("2025-01-09"),
  },
  {
    id: "time3",
    projectId: "proj2",
    description: "Bug fixes and testing",
    duration: 120,
    date: new Date("2025-01-08"),
    createdAt: new Date("2025-01-08"),
  },
];

// Transactions
export const transactions: Transaction[] = [
  {
    id: "trans1",
    type: "income",
    amount: 200000,
    categoryId: "2",
    accountId: "acc3",
    description: "E-commerce app milestone payment",
    projectId: "proj2",
    milestoneId: "mile3",
    date: new Date("2025-01-05"),
    createdAt: new Date("2025-01-05"),
  },
  {
    id: "trans2",
    type: "expense",
    amount: 3500,
    categoryId: "6",
    accountId: "acc1",
    description: "Lunch with team",
    date: new Date("2025-01-10"),
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "trans3",
    type: "income",
    amount: 5000,
    categoryId: "3",
    accountId: "acc1",
    description: "Weekly allowance",
    date: new Date("2025-01-07"),
    createdAt: new Date("2025-01-07"),
  },
  {
    id: "trans4",
    type: "expense",
    amount: 1200,
    categoryId: "7",
    accountId: "acc2",
    description: "Uber rides",
    date: new Date("2025-01-09"),
    createdAt: new Date("2025-01-09"),
  },
];

// Settings
export const defaultSettings: Settings = {
  theme: "dark",
  defaultPaymentAccount: "acc3",
  incomeCategories: defaultIncomeCategories,
  expenseCategories: defaultExpenseCategories,
  discord: {
    enabled: false,
    notifications: {
      projectCreated: true,
      milestoneCompleted: true,
      paymentReceived: true,
      dailySummary: false,
    },
  },
};

// Dashboard stats
export const dashboardStats: DashboardStats = {
  totalProjects: 2,
  activeProjects: 1,
  totalBudget: 850000,
  receivedPayments: 200000,
  pendingPayments: 230000,
  thisMonthIncome: 205000,
  thisMonthExpenses: 4700,
  netWorth: walletAccounts.reduce((sum, acc) => sum + acc.balance, 0),
  todayFocusTime: 180,
  weeklyFocusTime: 870,
  openIssues: 2,
  dueSoonIssues: 1,
};
