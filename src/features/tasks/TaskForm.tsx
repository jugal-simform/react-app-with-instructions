/**
 * TaskForm Component
 * Form for creating new tasks
 * React 19 Features:
 * - useOptimistic for immediate task list update
 * - Real-time validation
 */

import React, { useActionState } from 'react';
import { createTaskAction, validateTaskForm } from '../../actions/taskActions';
import { Input, Select, Button } from '../../components';
import type { TaskFormInput, Task, ActionState } from '../../types/index';

interface TaskFormProps {
  projectId: string;
  onSuccess?: () => void;
  onTaskCreate?: (task: Task) => void;
}

// Default form state for useActionState
const initialState = {
  success: false,
  errors: undefined,
  message: '',
};

/**
 * TaskForm component - demonstrates useActionState for form handling
 * React 19 Features:
 * - useActionState: Handles form submission lifecycle
 * - Real-time validation
 */
export function TaskForm({
  projectId,
  onSuccess,
  onTaskCreate,
}: TaskFormProps)  {
  const [formData, setFormData] = React.useState<Partial<TaskFormInput>>({
    title: '',
    description: '',
    priority: 'medium',
  });

  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});

  // React 19: useActionState hook for form submission
  // Integrates with server actions for seamless form handling
  const actionWithProjectId = async (
    previousState: ActionState,
    formDataArg: FormData
  ) => {
    return createTaskAction(projectId, previousState, formDataArg);
  };

  const [state, formAction, isPending] = useActionState(
    actionWithProjectId,
    initialState
  );

  // Handle form input changes with real-time validation
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newValue = { ...formData, [name]: value };
    setFormData(newValue);

    // Real-time validation (client-side UX improvement)
    const errors = validateTaskForm(newValue);
    setValidationErrors(errors);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate before submission
    const errors = validateTaskForm(formData);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Create FormData for action
    const fd = new FormData();
    fd.append('title', formData.title || '');
    fd.append('description', formData.description || '');
    fd.append('priority', formData.priority || 'medium');

    // Submit via useActionState action
    await formAction(fd);
  };

  // Handle successful creation
  React.useEffect(() => {
    if (state.success && state.data) {
      // Call callback if provided
      onTaskCreate?.(state.data);
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
      });
      setValidationErrors({});
      // Call success callback
      onSuccess?.();
    }
  }, [state.success, state.data, onSuccess, onTaskCreate]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error message alert */}
      {state.message && !state.success && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {state.message}
        </div>
      )}

      {/* Success message alert */}
      {state.message && state.success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {state.message}
        </div>
      )}

      {/* Title field */}
      <Input
        label="Task Title"
        name="title"
        type="text"
        placeholder="Enter task title..."
        value={formData.title || ''}
        onChange={handleChange}
        error={validationErrors.title}
        helperText="5-100 characters, letters and numbers"
        required
        disabled={isPending}
      />

      {/* Description field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          name="description"
          placeholder="Enter task description..."
          value={formData.description || ''}
          onChange={(e) => {
            handleChange(e);
          }}
          disabled={isPending}
          className={`input-field resize-none h-24 ${
            validationErrors.description ? 'border-red-500 focus:ring-red-500' : ''
          }`}
          aria-invalid={!!validationErrors.description}
          aria-describedby={validationErrors.description ? 'description-error' : undefined}
        />
        {validationErrors.description && (
          <p id="description-error" className="text-sm text-red-600 mt-1" role="alert">
            {validationErrors.description}
          </p>
        )}
      </div>

      {/* Priority field */}
      <Select
        label="Priority"
        name="priority"
        value={formData.priority || 'medium'}
        onChange={handleChange}
        options={[
          { value: 'low', label: 'Low' },
          { value: 'medium', label: 'Medium' },
          { value: 'high', label: 'High' },
        ]}
        disabled={isPending}
        error={validationErrors.priority}
      />

      {/* Submit button */}
      <div className="flex gap-2 pt-4">
        <Button
          type="submit"
          variant="primary"
          isLoading={isPending}
          disabled={isPending}
          className="flex-1"
        >
          {isPending ? 'Creating...' : 'Create Task'}
        </Button>
      </div>

      {/* React 19 note: useActionState integrates form submission with server actions */}
      {/* Provides isPending state for loading UI and automatic error handling */}
    </form>
  );
}
