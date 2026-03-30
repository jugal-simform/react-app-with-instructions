/**
 * TaskFormModal Component
 * Modal wrapper for task creation form
 * React 19: No manual memoization
 */

import React, { JSX } from 'react';
import { Modal } from '../../components/Modal';
import { TaskForm } from './TaskForm';
import type { Task } from '../../types/index';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onTaskCreate?: (task: Task) => void;
}

/**
 * TaskFormModal component - modal dialog containing task creation form
 */
export function TaskFormModal({
  isOpen,
  onClose,
  projectId,
  onTaskCreate,
}: TaskFormModalProps): JSX.Element | null {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      size="md"
      footer={
        <div className="text-sm text-gray-500">
          All tasks are added to the To-Do column by default
        </div>
      }
    >
      <TaskForm
        projectId={projectId}
        onSuccess={onClose}
        onTaskCreate={onTaskCreate}
      />
    </Modal>
  );
}
