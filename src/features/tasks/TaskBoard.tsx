/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * TaskBoard Component
 * Main Kanban board with three columns (Todo, In Progress, Done)
 * React 19 Features:
 * - Suspense for async task loading
 * - useOptimistic for instant drag-and-drop feedback
 * - DnD-kit for drag-and-drop functionality
 */

import React, { Suspense, useOptimistic } from "react";
import {
  type CollisionDetection,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragOverEvent,
  closestCorners,
  PointerSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { Task, TaskStatus } from "../../types/index";
import { arrayMove } from "@dnd-kit/sortable";
import { TaskColumn } from "./TaskColumn";
import { SkeletonCard } from "../../components/Skeleton";
import { useTaskContext } from "../../hooks/useTaskContext";

function isTaskStatus(value: string): value is TaskStatus {
  return value === "todo" || value === "in-progress" || value === "done";
}

interface TaskBoardProps {
  tasks: Task[];
  selectedProjectId: string | null;
  deferredSearchTerm: string;
  onTaskSelect: (task: Task) => void;
}

/**
 * TaskBoard component - Kanban board with drag-and-drop
 * React 19 Features:
 * - useOptimistic: Updates UI immediately before server response
 * - Suspense: Loads tasks with skeleton fallback
 * - DnD-kit: Modern, accessible drag-and-drop
 */
export function TaskBoard({
  tasks,
  deferredSearchTerm,
  onTaskSelect,
}: TaskBoardProps) {
  const { applyTaskDrop, updateTaskStatus } = useTaskContext();
  const [draggedTaskId, setDraggedTaskId] = React.useState<string | null>(null);
  const [previewStatus, setPreviewStatus] = React.useState<TaskStatus | null>(
    null,
  );

  // Get the dragged task
  const draggedTask = tasks.find((t) => t.id === draggedTaskId);

  // dnd-kit sensors for detecting drag start
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  );

  // React 19 Feature: useOptimistic for immediate visual feedback
  const [optimisticTasks, updateOptimisticTask] = useOptimistic(
    tasks,
    (
      state: Task[],
      {
        activeTaskId,
        overId,
        destinationStatus,
      }: {
        activeTaskId: string;
        overId: string;
        destinationStatus: TaskStatus;
      },
    ) => {
      const activeIndex = state.findIndex((task) => task.id === activeTaskId);
      if (activeIndex === -1) {
        return state;
      }

      const statusUpdated = state.map((task) =>
        task.id === activeTaskId
          ? { ...task, status: destinationStatus }
          : task,
      );

      const activeTaskNextIndex = statusUpdated.findIndex(
        (task) => task.id === activeTaskId,
      );

      if (overId === activeTaskId || isTaskStatus(overId)) {
        return statusUpdated;
      }

      const overIndex = statusUpdated.findIndex((task) => task.id === overId);
      if (overIndex === -1) {
        return statusUpdated;
      }

      return arrayMove(statusUpdated, activeTaskNextIndex, overIndex);
    },
  );

  const collisionDetectionStrategy: CollisionDetection = (args) => {
    const pointerCollisions = pointerWithin(args);

    if (pointerCollisions.length > 0) {
      return pointerCollisions;
    }

    const intersectingCollisions = rectIntersection(args);
    if (intersectingCollisions.length > 0) {
      return intersectingCollisions;
    }

    return closestCorners(args);
  };

  const resolveDropStatus = (
    over: DragOverEvent["over"] | DragEndEvent["over"],
    sourceTasks: Task[],
  ): TaskStatus | null => {
    if (!over) {
      return null;
    }

    const sortableContainerId = over.data.current?.sortable?.containerId;
    if (
      typeof sortableContainerId === "string" &&
      isTaskStatus(sortableContainerId)
    ) {
      return sortableContainerId;
    }

    const overId = String(over.id);

    if (isTaskStatus(overId)) {
      return overId;
    }

    const hoveredTask = sourceTasks.find((task) => task.id === overId);
    return hoveredTask ? hoveredTask.status : null;
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;

    if (!over) {
      setPreviewStatus(null);
      return;
    }

    const resolvedStatus = resolveDropStatus(over, optimisticTasks);
    setPreviewStatus(resolvedStatus);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedTaskId(null);
    setPreviewStatus(null);
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = resolveDropStatus(over, optimisticTasks);
    const overId = String(over.id);

    if (!newStatus) return;

    const taskToMove = optimisticTasks.find((t) => t.id === taskId);

    if (!taskToMove) return;

    // React 19: Optimistic update - supports both reorder and status change
    updateOptimisticTask({
      activeTaskId: taskId,
      overId,
      destinationStatus: newStatus,
    });

    applyTaskDrop(taskId, overId, newStatus);

    const statusChanged = taskToMove.status !== newStatus;
    if (!statusChanged) {
      return;
    }

    // Then sync with "server" (actual API call)
    updateTaskStatus(taskId, newStatus).catch(() => {
      // Revert on error (handled by context)
    });
  };

  // Regroup tasks by status (using optimistic tasks which reflect pending changes)
  const filteredOptimisticTasks = optimisticTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(deferredSearchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(deferredSearchTerm.toLowerCase()),
  );

  const todoOptimistic = filteredOptimisticTasks.filter(
    (t) => t.status === "todo",
  );
  const inProgressOptimistic = filteredOptimisticTasks.filter(
    (t) => t.status === "in-progress",
  );
  const doneOptimistic = filteredOptimisticTasks.filter(
    (t) => t.status === "done",
  );

  console.log({ filteredOptimisticTasks });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragCancel={() => {
        setDraggedTaskId(null);
        setPreviewStatus(null);
      }}
      onDragStart={(event) => setDraggedTaskId(event.active.id as string)}
    >
      <div className="flex items-stretch gap-4 h-full overflow-x-auto pb-4">
        <TaskColumn
          status="todo"
          tasks={todoOptimistic}
          onTaskClick={onTaskSelect}
          isPreviewTarget={previewStatus === "todo"}
          previewTaskTitle={draggedTask?.title ?? null}
        />
        <TaskColumn
          status="in-progress"
          tasks={inProgressOptimistic}
          onTaskClick={onTaskSelect}
          isPreviewTarget={previewStatus === "in-progress"}
          previewTaskTitle={draggedTask?.title ?? null}
        />
        <TaskColumn
          status="done"
          tasks={doneOptimistic}
          onTaskClick={onTaskSelect}
          isPreviewTarget={previewStatus === "done"}
          previewTaskTitle={draggedTask?.title ?? null}
        />

        {/* React 19: DragOverlay for visual feedback during drag */}
        <DragOverlay>
          {draggedTask ? (
            <div className="bg-white border-2 border-blue-500 rounded-lg p-3 shadow-lg min-w-72 opacity-90">
              <p className="font-medium text-gray-900">{draggedTask.title}</p>
              <p className="text-sm text-gray-600 line-clamp-2">
                {draggedTask.description}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </div>
    </DndContext>
  );
}

/**
 * TaskBoardLoader - Handles Suspense fallback with skeleton cards
 */
export function TaskBoardLoader() {
  return (
    <div className="flex items-stretch gap-4 h-full overflow-x-auto pb-4">
      {["todo", "in-progress", "done"].map((status) => (
        <div key={status} className="flex-1 min-w-72 space-y-3 p-3">
          <div className="h-10 bg-gray-200 rounded animate-pulse" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
}
