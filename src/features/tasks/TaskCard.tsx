/**
 * TaskCard Component
 * Individual task card for Kanban board
 * Draggable and clickable
 * React 19: No manual memoization, uses dnd-kit for drag-and-drop
 */

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, AlertCircle, ChevronRight } from 'lucide-react';
import type { Task } from '../../types/index';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

/**
 * TaskCard component - displays task with drag-and-drop support
 * React 19 Feature: dnd-kit integration for modern drag-and-drop
 */
export function TaskCard({ task, onClick }: TaskCardProps)  {
  // dnd-kit hook for sortable items
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab active:cursor-grabbing ${isDragging ? 'opacity-50' : ''}`}
    >
      <Card
        className="p-3 space-y-2 hover:shadow-md transition-all active:shadow-lg"
        hoverable
        onClick={onClick}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 line-clamp-2 text-sm">
              {task.title}
            </h3>
          </div>
          {task.priority === 'high' && (
            <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
          )}
        </div>

        {task.description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex gap-1">
            <Badge
              label={task.priority}
              variant="priority"
              value={task.priority}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Calendar size={12} />
            {task.createdAt.toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
          className="w-full mt-2 flex items-center justify-center gap-1 py-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium rounded hover:bg-blue-50 transition-colors"
        >
          View Details
          <ChevronRight size={14} />
        </button>
      </Card>
    </div>
  );
}
