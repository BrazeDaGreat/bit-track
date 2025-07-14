"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  FolderOpen,
  Tag,
  DollarSign,
  GitBranch,
  Calendar,
  MoreVertical
} from "lucide-react";
import { projects } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Project card component
 */
function ProjectCard({ project }: { project: typeof projects[0] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const openIssues = project.issues.filter(i => i.status !== 'closed').length;
  const totalIssues = project.issues.length;
  const progress = totalIssues > 0 ? ((totalIssues - openIssues) / totalIssues) * 100 : 0;

  const statusColors = {
    active: "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    completed: "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    archived: "bg-gray-100 dark:bg-gray-800/20 text-gray-700 dark:text-gray-300"
  };

  return (
    <Link href={`/projects/${project.id}`}>
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:border-primary/50 group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <FolderOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{project.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">
                {project.description}
              </p>
            </div>
          </div>
          <button 
            className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
            onClick={(e) => {
              e.preventDefault();
              // Handle menu actions
            }}
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-md text-xs"
            >
              <Tag className="h-3 w-3" />
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="text-xs text-muted-foreground">
              +{project.tags.length - 3} more
            </span>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Budget</p>
            <p className="font-medium">{formatCurrency(project.budget)}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Version</p>
            <p className="font-medium flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {project.currentVersion}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Status</p>
            <span className={cn("px-2 py-0.5 rounded text-xs font-medium", statusColors[project.status])}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {openIssues} open issues · {project.milestones.length} milestones
          </p>
        </div>

        {/* Updated date */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-4">
          <Calendar className="h-3 w-3" />
          Updated {project.updatedAt.toLocaleDateString()}
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage your projects and track progress
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors",
            showFilters 
              ? "bg-primary/10 border-primary text-primary" 
              : "border-border hover:bg-muted"
          )}
        >
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="bg-card border border-border rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterStatus("all")}
              className={cn(
                "px-3 py-1 rounded-md text-sm transition-colors",
                filterStatus === "all" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus("active")}
              className={cn(
                "px-3 py-1 rounded-md text-sm transition-colors",
                filterStatus === "active" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              Active
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={cn(
                "px-3 py-1 rounded-md text-sm transition-colors",
                filterStatus === "completed" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              Completed
            </button>
            <button
              onClick={() => setFilterStatus("archived")}
              className={cn(
                "px-3 py-1 rounded-md text-sm transition-colors",
                filterStatus === "archived" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              Archived
            </button>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Projects</p>
          <p className="text-2xl font-bold">{projects.length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Active Projects</p>
          <p className="text-2xl font-bold">{projects.filter(p => p.status === 'active').length}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-1">Total Budget</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat('en-PK', {
              style: 'currency',
              currency: 'PKR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            }).format(totalBudget)}
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            No projects found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}