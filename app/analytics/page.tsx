"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  Target,
  Activity,
  PieChart,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Mock analytics data
 */
const focusTimeData = [
  { date: 'Mon', hours: 6.5 },
  { date: 'Tue', hours: 7.2 },
  { date: 'Wed', hours: 5.8 },
  { date: 'Thu', hours: 8.1 },
  { date: 'Fri', hours: 7.5 },
  { date: 'Sat', hours: 3.2 },
  { date: 'Sun', hours: 2.5 }
];

const issuesData = [
  { date: 'Mon', solved: 3 },
  { date: 'Tue', solved: 5 },
  { date: 'Wed', solved: 2 },
  { date: 'Thu', solved: 4 },
  { date: 'Fri', solved: 6 },
  { date: 'Sat', solved: 1 },
  { date: 'Sun', solved: 0 }
];

const monthlyFinanceData = [
  { month: 'Jan', income: 180000, expenses: 45000 },
  { month: 'Feb', income: 220000, expenses: 52000 },
  { month: 'Mar', income: 195000, expenses: 48000 },
  { month: 'Apr', income: 250000, expenses: 61000 },
  { month: 'May', income: 230000, expenses: 55000 },
  { month: 'Jun', income: 205000, expenses: 49000 }
];

const projectDistribution = [
  { name: 'Web Development', value: 45, color: '#3b82f6' },
  { name: 'Mobile Apps', value: 30, color: '#8b5cf6' },
  { name: 'Design', value: 15, color: '#f59e0b' },
  { name: 'Consulting', value: 10, color: '#10b981' }
];

/**
 * Chart bar component
 */
function ChartBar({ value, maxValue, label }: { value: number; maxValue: number; label: string }) {
  const percentage = (value / maxValue) * 100;
  
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-32 w-12 bg-muted rounded-t-lg relative">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all"
          style={{ height: `${percentage}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}

/**
 * Progress ring component
 */
function ProgressRing({ value, total, color }: { value: number; total: number; color: string }) {
  const percentage = (value / total) * 100;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24">
      <svg className="transform -rotate-90 w-24 h-24">
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-muted"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          stroke={color}
          strokeWidth="8"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

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
  trend?: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="h-5 w-5" />
        </div>
        {change && trend && (
          <div className={cn(
            "flex items-center gap-1 text-sm",
            trend === 'up' ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          )}>
            {trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{change}</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground mt-1">{title}</p>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      notation: 'compact',
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1
    }).format(amount);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-2">
          Track your productivity and financial insights
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center gap-2 mb-8">
        <button
          onClick={() => setTimeRange('week')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            timeRange === 'week' 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          )}
        >
          This Week
        </button>
        <button
          onClick={() => setTimeRange('month')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            timeRange === 'month' 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          )}
        >
          This Month
        </button>
        <button
          onClick={() => setTimeRange('year')}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            timeRange === 'year' 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted hover:bg-muted/80"
          )}
        >
          This Year
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Avg Daily Focus"
          value="6.8 hours"
          change="+12%"
          trend="up"
          icon={Clock}
          color="bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          title="Issues Resolved"
          value="21"
          change="+8%"
          trend="up"
          icon={Target}
          color="bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
        />
        <StatCard
          title="Monthly Revenue"
          value={formatCurrency(205000)}
          change="-5%"
          trend="down"
          icon={DollarSign}
          color="bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          title="Productivity Score"
          value="87%"
          change="+3%"
          trend="up"
          icon={Activity}
          color="bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Focus Time Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Daily Focus Time</h3>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {focusTimeData.map((day) => (
              <ChartBar 
                key={day.date} 
                value={day.hours} 
                maxValue={10} 
                label={day.date} 
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total this week</span>
              <span className="font-medium">40.8 hours</span>
            </div>
          </div>
        </div>

        {/* Issues Solved Chart */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Issues Resolved</h3>
            <Target className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {issuesData.map((day) => (
              <ChartBar 
                key={day.date} 
                value={day.solved} 
                maxValue={8} 
                label={day.date} 
              />
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total this week</span>
              <span className="font-medium">21 issues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Financial Overview</h3>
          <DollarSign className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {monthlyFinanceData.map((month, index) => (
            <div key={month.month} className="flex items-center gap-4">
              <span className="text-sm font-medium w-12">{month.month}</span>
              <div className="flex-1">
                <div className="flex gap-2">
                  <div className="flex-1 bg-green-100 dark:bg-green-900/20 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-green-600 dark:bg-green-400 rounded-full"
                      style={{ width: `${(month.income / 300000) * 100}%` }}
                    />
                  </div>
                  <div className="flex-1 bg-red-100 dark:bg-red-900/20 rounded-full h-6 relative overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 bottom-0 bg-red-600 dark:bg-red-400 rounded-full"
                      style={{ width: `${(month.expenses / 100000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  +{formatCurrency(month.income)}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  -{formatCurrency(month.expenses)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Project Distribution</h3>
            <PieChart className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="flex justify-center mb-6">
            <ProgressRing value={45} total={100} color="#3b82f6" />
          </div>
          <div className="space-y-3">
            {projectDistribution.map((project) => (
              <div key={project.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm">{project.name}</span>
                </div>
                <span className="text-sm font-medium">{project.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Monthly Goals</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Focus Time</span>
                <span className="text-sm font-medium">160/200h</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '80%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Revenue Target</span>
                <span className="text-sm font-medium">205k/250k</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Issues Closed</span>
                <span className="text-sm font-medium">45/50</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '90%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Productivity Insights */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-6">Insights</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                Most Productive Day
              </p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Thursday - 8.1 hours focused
              </p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
              <p className="text-sm font-medium text-green-700 dark:text-green-300">
                Best Performing Project
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                TechStartup Website - 85% complete
              </p>
            </div>
            <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                Revenue Growth
              </p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                +15% compared to last month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}