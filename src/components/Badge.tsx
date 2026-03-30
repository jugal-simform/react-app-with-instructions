/**
 * Badge Component
 * Status badge for task status display
 * React 19: No manual memoization
 */

import React from "react";
import type { TaskStatus, TaskPriority } from "../types/index";

interface BadgeProps {
  label: string;
  variant?: "status" | "priority" | "default";
  value?: TaskStatus | TaskPriority | string;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Badge component - small labeled indicator with color coding
 */
export function Badge({
  label,
  variant = "default",
  value,
  size = "sm",
  className = "",
}: BadgeProps) {
  let colorClass = "bg-gray-100 text-gray-800";

  if (variant === "status") {
    switch (value) {
      case "done":
        colorClass = "bg-green-100 text-green-800";
        break;
      case "in-progress":
        colorClass = "bg-yellow-100 text-yellow-800";
        break;
      case "todo":
        colorClass = "bg-blue-100 text-blue-800";
        break;
    }
  } else if (variant === "priority") {
    switch (value) {
      case "high":
        colorClass = "bg-red-100 text-red-800";
        break;
      case "medium":
        colorClass = "bg-orange-100 text-orange-800";
        break;
      case "low":
        colorClass = "bg-green-100 text-green-800";
        break;
    }
  }

  const sizeClass = size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm";

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${colorClass} ${sizeClass} ${className}`}
    >
      {label}
    </span>
  );
}
