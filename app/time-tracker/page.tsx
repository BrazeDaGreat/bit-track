"use client";

import React, { useState } from "react";
import {
  Play,
  Pause,
  Square,
  Clock,
  Calendar,
  ChevronDown,
  FolderOpen
} from "lucide-react";
import { timeEntries, projects } from "@/lib/data";
import { cn } from "@/lib/utils";

/**
 * Time entry row component
 */
function TimeEntryRow({
  entry,
  project
}: {
  entry: typeof timeEntries[0];
  project?: typeof projects[0];
}) {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div>
          <p className="font-medium">{entry.description}</p>
          {project && (
            <p className="text-sm text-muted-foreground">{project.title}</p>
          )}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        {entry.date.toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        <span className="font-mono text-sm">{formatTime(entry.duration)}</span>
      </td>
    </tr>
  );
}

export default function TimeTrackerPage() {
  const [isTracking, setIsTracking] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showProjectDropdown, setShowProjectDropdown] = useState(false);

  // Group entries by date
  const entriesByDate = timeEntries.reduce((acc, entry) => {
    const dateKey = entry.date.toDateString();
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, typeof timeEntries>);

  // Calculate total time
  const totalTime = timeEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const todayTime = timeEntries
    .filter(e => e.date.toDateString() === new Date().toDateString())
    .reduce((sum, entry) => sum + entry.duration, 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const activeProjects = projects.filter(p => p.status === 'active');

  return (
    <div className="p-4 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Time Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Track your time and stay productive
        </p>
      </div>

      {/* Timer Card */}
      <div className="bg-card border border-border rounded-xl p-8 mb-8">
        <div className="text-center">
          <div className="text-6xl font-mono font-bold mb-6">
            {formatTime(elapsedTime)}
          </div>

          {/* Project Selector */}
          <div className="relative inline-block mb-6">
            <button
              onClick={() => setShowProjectDropdown(!showProjectDropdown)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors",
                selectedProject 
                  ? "bg-primary/10 border-primary text-primary" 
                  : "border-border hover:bg-muted"
              )}
            >
              <FolderOpen className="h-4 w-4" />
              <span>
                {selectedProject 
                  ? projects.find(p => p.id === selectedProject)?.title 
                  : "Select Project"}
              </span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {showProjectDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                {activeProjects.map(project => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setSelectedProject(project.id);
                      setShowProjectDropdown(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-muted transition-colors"
                  >
                    {project.title}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-center gap-4">
            {!isTracking ? (
              <button
                onClick={() => setIsTracking(true)}
                disabled={!selectedProject}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all",
                  selectedProject
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                )}
              >
                <Play className="h-5 w-5" />
                Start Timer
              </button>
            ) : (
              <>
                <button
                  onClick={() => setIsTracking(false)}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                >
                  <Pause className="h-5 w-5" />
                  Pause
                </button>
                <button
                  onClick={() => {
                    setIsTracking(false);
                    setElapsedTime(0);
                  }}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  <Square className="h-5 w-5" />
                  Stop
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Today</h3>
          </div>
          <p className="text-2xl font-bold">{formatTime(todayTime)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">This Week</h3>
          </div>
          <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Active Projects</h3>
          </div>
          <p className="text-2xl font-bold">{activeProjects.length}</p>
        </div>
      </div>

      {/* Time Entries Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold">Recent Time Entries</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Duration</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(entriesByDate)
                .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                .map(([date, entries]) => (
                  <React.Fragment key={date}>
                    <tr className="bg-muted/30">
                      <td colSpan={3} className="px-4 py-2 font-medium text-sm">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </td>
                    </tr>
                    {entries.map(entry => (
                      <TimeEntryRow
                        key={entry.id}
                        entry={entry}
                        project={projects.find(p => p.id === entry.projectId)}
                      />
                    ))}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}