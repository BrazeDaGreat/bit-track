"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  GitBranch,
  Calendar,
  DollarSign,
  Tag,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  Plus,
  MessageSquare,
  ChevronRight
} from "lucide-react";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";
import { MilestoneStage, IssueStatus } from "@/lib/types";

/**
 * Tab component
 */
function Tabs({
  activeTab,
  onTabChange
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'milestones', label: 'Milestones' },
    { id: 'issues', label: 'Issues' },
    { id: 'notes', label: 'Notes' }
  ];

  return (
    <div className="border-b border-border">
      <div className="flex space-x-8">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "pb-4 text-sm font-medium transition-colors relative",
              activeTab === tab.id
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Milestone card component
 */
function MilestoneCard({ milestone }: { milestone: typeof projects[0]['milestones'][0] }) {
  const stageColors: Record<MilestoneStage, string> = {
    'planned': 'bg-gray-100 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300',
    'working': 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
    'closed': 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300',
    'payment-received': 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calculate progress (mock data)
  const totalIssues = 8;
  const completedIssues = milestone.stage === 'closed' || milestone.stage === 'payment-received' ? totalIssues : 3;
  const progress = (completedIssues / totalIssues) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-lg">{milestone.title}</h4>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              v{milestone.version}
            </span>
            {milestone.dueDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {milestone.dueDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
        <span className={cn("px-3 py-1 rounded-full text-xs font-medium", stageColors[milestone.stage])}>
          {milestone.stage.replace('-', ' ')}
        </span>
      </div>

      {milestone.description && (
        <p className="text-sm text-muted-foreground mb-4">{milestone.description}</p>
      )}

      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">{formatCurrency(milestone.budget)}</span>
        <span className="text-sm text-muted-foreground">{completedIssues}/{totalIssues} issues</span>
      </div>

      <div className="w-full bg-muted rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/**
 * Issue row component
 */
function IssueRow({ issue }: { issue: typeof projects[0]['issues'][0] }) {
  const statusIcons: Record<IssueStatus, React.ElementType> = {
    'open': Circle,
    'in-progress': Clock,
    'closed': CheckCircle2
  };

  const priorityColors = {
    low: 'text-blue-600 dark:text-blue-400',
    medium: 'text-yellow-600 dark:text-yellow-400',
    high: 'text-orange-600 dark:text-orange-400',
    critical: 'text-red-600 dark:text-red-400'
  };

  const StatusIcon = statusIcons[issue.status];

  return (
    <div className="flex items-start gap-3 p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <StatusIcon className={cn(
        "h-5 w-5 mt-0.5 shrink-0",
        issue.status === 'closed' ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
      )} />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h5 className="font-medium">{issue.title}</h5>
            <p className="text-sm text-muted-foreground mt-1">{issue.description}</p>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex gap-2">
                {issue.tags.map(tag => (
                  <span key={tag} className="text-xs bg-muted px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <span className={cn("text-xs font-medium", priorityColors[issue.priority])}>
                {issue.priority}
              </span>
              {issue.dueDate && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {issue.dueDate.toLocaleDateString()}
                </span>
              )}
              {issue.comments.length > 0 && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {issue.comments.length}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetailPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  
  const project = projects.find(p => p.id === params.id);

  if (!project) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const statusColors = {
    active: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    completed: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    archived: "bg-gray-100 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300"
  };

  const openIssues = project.issues.filter(i => i.status !== 'closed');
  const receivedPayments = project.milestones
    .filter(m => m.stage === 'payment-received')
    .reduce((sum, m) => sum + m.budget, 0);
  const pendingPayments = project.milestones
    .filter(m => m.stage !== 'payment-received')
    .reduce((sum, m) => sum + m.budget, 0);

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Projects
        </Link>
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
            <p className="text-muted-foreground">{project.description}</p>
            <div className="flex flex-wrap items-center gap-4 mt-4">
              <span className={cn("px-3 py-1 rounded-full text-sm font-medium", statusColors[project.status])}>
                {project.status}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <GitBranch className="h-4 w-4" />
                v{project.currentVersion}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Updated {project.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors">
            <Edit className="h-4 w-4" />
            Edit
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
          <p className="text-xl font-bold">{formatCurrency(project.budget)}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Received</p>
          <p className="text-xl font-bold text-green-600 dark:text-green-400">
            {formatCurrency(receivedPayments)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
            {formatCurrency(pendingPayments)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Open Issues</p>
          <p className="text-xl font-bold">{openIssues.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Tags */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                Important Links
              </h3>
              <div className="space-y-3">
                {project.links.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors group"
                  >
                    <div>
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {link.title}
                      </p>
                      {link.description && (
                        <p className="text-sm text-muted-foreground">{link.description}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </a>
                ))}
                {project.links.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No links added yet
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'milestones' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Milestones</h3>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                <Plus className="h-4 w-4" />
                New Milestone
              </button>
            </div>
            <div className="grid gap-4">
              {project.milestones.map(milestone => (
                <MilestoneCard key={milestone.id} milestone={milestone} />
              ))}
              {project.milestones.length === 0 && (
                <div className="text-center py-12 bg-card border border-border rounded-lg">
                  <p className="text-muted-foreground">No milestones yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'issues' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Issues</h3>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm">
                <Plus className="h-4 w-4" />
                New Issue
              </button>
            </div>
            <div className="bg-card border border-border rounded-lg">
              {project.issues.map((issue, index) => (
                <div key={issue.id}>
                  <IssueRow issue={issue} />
                  {index < project.issues.length - 1 && (
                    <div className="border-b border-border mx-4" />
                  )}
                </div>
              ))}
              {project.issues.length === 0 && (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No issues yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: project.notes.replace(/\n/g, '<br />') }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}