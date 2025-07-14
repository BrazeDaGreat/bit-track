"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Clock,
  FolderOpen,
  Wallet,
  BarChart3,
  Settings,
  Menu,
  X,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { currentUser, calculateAge } from "@/lib/data";
import Image from "next/image";

/**
 * Navigation items configuration
 */
const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Time Tracker",
    href: "/time-tracker",
    icon: Clock,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Wallet",
    href: "/wallet",
    icon: Wallet,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

/**
 * Sidebar component with responsive design
 */
export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const age = calculateAge(currentUser.birthDate);
  const ageString = `${age.years}Y ${age.months}M ${age.days}D old`;

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-sm lg:hidden"
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header with user info */}
          <div className="p-4 border-b border-sidebar-border">
            <div className={cn("flex items-center gap-3", isCollapsed && "justify-center")}>
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-sidebar-accent shrink-0">
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
              {!isCollapsed && (
                <div className="overflow-hidden">
                  <h3 className="font-semibold text-sm truncate">{currentUser.name}</h3>
                  <p className="text-xs text-sidebar-foreground/60">{ageString}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-2">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href === "/dashboard" && pathname === "/");
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        isActive && "bg-sidebar-primary text-sidebar-primary-foreground",
                        isCollapsed && "justify-center"
                      )}
                      onClick={() => setIsMobileOpen(false)}
                    >
                      <item.icon className="h-5 w-5 shrink-0" />
                      {!isCollapsed && (
                        <span className="text-sm font-medium">{item.title}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Collapse toggle (desktop only) */}
          <div className="p-2 border-t border-sidebar-border hidden lg:block">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-lg",
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
                isCollapsed && "justify-center"
              )}
            >
              <ChevronLeft className={cn(
                "h-5 w-5 shrink-0 transition-transform",
                isCollapsed && "rotate-180"
              )} />
              {!isCollapsed && (
                <span className="text-sm font-medium">Collapse</span>
              )}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}