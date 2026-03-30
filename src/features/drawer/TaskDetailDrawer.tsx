/**
 * TaskDetailDrawer Component
 * Side panel for viewing/editing task details
 * React 19 Features:
 * - Lazy loaded (React.lazy)
 * - Suspense fallback
 * - No manual memoization
 */

import React, { JSX } from 'react';
import { X } from 'lucide-react';
import { TaskDetails } from './TaskDetails';

interface TaskDetailDrawerProps {
  isOpen: boolean;
  taskId: string | null;
  onClose: () => void;
}

/**
 * TaskDetailDrawer component - side panel for task details
 * React 19 Feature: Can be lazily loaded to reduce initial bundle
 */
export function TaskDetailDrawer({
  isOpen,
  taskId,
  onClose,
}: TaskDetailDrawerProps): JSX.Element | null {
  // Handle Escape key
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !taskId) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-30 transition-opacity"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close drawer"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <TaskDetails taskId={taskId} onClose={onClose} />
        </div>
      </div>
    </>
  );
}
