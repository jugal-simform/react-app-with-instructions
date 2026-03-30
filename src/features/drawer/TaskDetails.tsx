/**
 * TaskDetails Component
 * Displays full task details (loaded asynchronously)
 * React 19: Suspense-compatible component
 */

import React from "react";
import * as mockApi from "../../services/mockApi";
import type { Task, TaskStatus } from "../../types/index";
import { Badge } from "../../components/Badge";
import { Select, Button } from "../../components";
import { Calendar, MapPin } from "lucide-react";
import { useTaskContext } from "../../hooks/useTaskContext";

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
}

/**
 * TaskDetails component - shows full task details
 * React 19 Feature: Works inside Suspense boundary
 * Throws promise for async data loading
 */
export function TaskDetails({ taskId, onClose }: TaskDetailsProps) {
  const { updateTaskStatus } = useTaskContext();
  const [task, setTask] = React.useState<Task | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [statusValue, setStatusValue] = React.useState<TaskStatus>("todo");
  const [isUpdating, setIsUpdating] = React.useState(false);

  // Load task details on mount
  React.useEffect(() => {
    const loadTask = async () => {
      try {
        const loadedTask = await mockApi.fetchTaskDetails(taskId);
        setTask(loadedTask);
        if (loadedTask) {
          setStatusValue(loadedTask.status);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadTask();
  }, [taskId]);

  if (isLoading) {
    return <div className="text-center py-8 text-gray-500">Loading...</div>;
  }

  if (!task) {
    return <div className="text-center py-8 text-red-600">Task not found</div>;
  }

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const newStatus = e.target.value as TaskStatus;
    setStatusValue(newStatus);
    setIsUpdating(true);

    try {
      await updateTaskStatus(task.id, newStatus);
      setTask({ ...task, status: newStatus });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
        <p className="text-gray-600">{task.description}</p>
      </div>

      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            Status
          </p>
          <Select
            value={statusValue}
            onChange={handleStatusChange}
            disabled={isUpdating}
            options={[
              { value: "todo", label: "To Do" },
              { value: "in-progress", label: "In Progress" },
              { value: "done", label: "Done" },
            ]}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Priority
          </p>
          <Badge
            label={
              task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
            }
            variant="priority"
            value={task.priority}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Created
          </p>
          <div className="flex items-center gap-1 text-gray-700">
            <Calendar size={16} />
            {task.createdAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Updated
          </p>
          <div className="flex items-center gap-1 text-gray-700">
            <MapPin size={16} />
            {task.updatedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Close button */}
      <Button variant="secondary" onClick={onClose} className="w-full">
        Close
      </Button>
    </div>
  );
}
