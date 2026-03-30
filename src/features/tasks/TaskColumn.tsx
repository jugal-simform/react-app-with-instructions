/**
 * TaskColumn Component
 * Column in Kanban board for specific task status
 * React 19: No manual memoization, dnd-kit SortableContext
 */

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Task, TaskStatus } from "../../types/index";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  isPreviewTarget?: boolean;
  previewTaskTitle?: string | null;
}

// Status configuration
const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; count: string }
> = {
  todo: { label: "To Do", color: "blue", count: "" },
  "in-progress": { label: "In Progress", color: "amber", count: "" },
  done: { label: "Done", color: "green", count: "" },
};

/**
 * TaskColumn component - droppable area for tasks of specific status
 * React 19 Feature: dnd-kit integration for drop zones
 */
export function TaskColumn({
  status,
  tasks,
  onTaskClick,
  isPreviewTarget = false,
  previewTaskTitle = null,
}: TaskColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });
  const config = STATUS_CONFIG[status];

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200",
    amber: "bg-amber-50 border-amber-200",
    green: "bg-green-50 border-green-200",
  };

  return (
    <div className="flex flex-col h-full min-w-0">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm flex items-center gap-2">
          {config.label}
          <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </h3>
      </div>

      <SortableContext
        id={status}
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex-1 p-3 space-y-3 overflow-y-auto border-t-4 transition-all ${colorClasses[config.color as keyof typeof colorClasses]} ${
            isPreviewTarget ? "ring-2 ring-blue-400 ring-inset" : ""
          } min-h-[18rem]`}
        >
          {isPreviewTarget && previewTaskTitle ? (
            <div className="rounded-lg border-2 border-dashed border-blue-400 bg-blue-100/70 p-3">
              <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
                Drop preview
              </p>
              <p className="text-sm text-blue-900 mt-1 line-clamp-1">
                Drop to move: {previewTaskTitle}
              </p>
            </div>
          ) : null}

          {tasks.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No tasks yet</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => onTaskClick(task)}
              />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
}
