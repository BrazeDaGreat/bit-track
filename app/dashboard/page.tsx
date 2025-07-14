"use client";

import React from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  FolderOpen,
  Wallet,
  AlertCircle,
  CheckCircle2,
  Circle,
  Calendar
} from "lucide-react";
import { dashboardStats, projects, currentUser } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Stat card component
 */
function StatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  color
}: {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="h-5 w-5" />
        </div>
        {change && trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm",
            trend === "up" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}

/**
 * Todo item component
 */
function TodoItem({
  title,
  project,
  dueDate,
  priority,
  completed
}: {
  title: string;
  project: string;
  dueDate?: Date;
  priority: "low" | "medium" | "high" | "critical";
  completed: boolean;
}) {
  const priorityColors = {
    low: "text-blue-600 dark:text-blue-400",
    medium: "text-yellow-600 dark:text-yellow-400",
    high: "text-orange-600 dark:text-orange-400",
    critical: "text-red-600 dark:text-red-400"
  };

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg hover:bg-muted/50 transition-colors">
      <button className="mt-0.5">
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-primary" />
        ) : (
          <Circle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
        )}
      </button>
      <div className="flex-1">
        <p className={cn("font-medium", completed && "line-through text-muted-foreground")}>
          {title}
        </p>
        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
          <span>{project}</span>
          {dueDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{dueDate.toLocaleDateString()}</span>
            </div>
          )}
          <span className={priorityColors[priority]}>{priority}</span>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get todo items from issues
  const todoItems = projects
    .flatMap(p => p.issues.map(i => ({ ...i, projectTitle: p.title })))
    .filter(i => i.status !== 'closed' && i.dueDate)
    .sort((a, b) => (a.dueDate?.getTime() || 0) - (b.dueDate?.getTime() || 0))
    .slice(0, 5);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {currentUser.name}!</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Active Projects"
          value={dashboardStats.activeProjects.toString()}
          icon={FolderOpen}
          color="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Net Worth"
          value={formatCurrency(dashboardStats.netWorth)}
          change="+12%"
          trend="up"
          icon={Wallet}
          color="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="This Month"
          value={formatCurrency(dashboardStats.thisMonthIncome - dashboardStats.thisMonthExpenses)}
          change="+8%"
          trend="up"
          icon={TrendingUp}
          color="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Today's Focus"
          value={formatTime(dashboardStats.todayFocusTime)}
          icon={Clock}
          color="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Todo List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Upcoming Tasks</h2>
            <span className="text-sm text-muted-foreground">
              {dashboardStats.openIssues} open issues
            </span>
          </div>
          <div className="space-y-1">
            {todoItems.map((item) => (
              <TodoItem
                key={item.id}
                title={item.title}
                project={item.projectTitle}
                dueDate={item.dueDate}
                priority={item.priority}
                completed={item.status === 'closed'}
              />
            ))}
            {todoItems.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">
                No upcoming tasks. Great job staying on top of things!
              </p>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-4">
          {/* Payments Overview */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Payments Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Received</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(dashboardStats.receivedPayments)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Pending</span>
                <span className="font-medium text-yellow-600 dark:text-yellow-400">
                  {formatCurrency(dashboardStats.pendingPayments)}
                </span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Budget</span>
                  <span className="font-bold">{formatCurrency(dashboardStats.totalBudget)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Weekly Focus */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="font-semibold mb-4">Weekly Focus Time</h3>
            <div className="space-y-3">
              <div className="text-3xl font-bold text-primary">
                {formatTime(dashboardStats.weeklyFocusTime)}
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((dashboardStats.weeklyFocusTime / 2400) * 100, 100)}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {Math.round((dashboardStats.weeklyFocusTime / 2400) * 100)}% of 40h goal
              </p>
            </div>
          </div>

          {/* Due Soon Alert */}
          {dashboardStats.dueSoonIssues > 0 && (
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
                <div>
                  <p className="font-medium text-sm">
                    {dashboardStats.dueSoonIssues} tasks due soon
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Review your upcoming deadlines
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}