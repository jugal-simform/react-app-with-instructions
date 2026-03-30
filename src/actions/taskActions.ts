/**
 * Task Actions - Server-like async functions
 * Compatible with React 19's useActionState hook
 * Includes secure-by-default input validation per copilot-instructions.md
 * 
 * React 19 Feature: Server Actions pattern for form handling
 */

import type { TaskFormInput, ActionState, TaskPriority } from '../types/index';
import * as mockApi from '../services/mockApi';

/**
 * Validation rules (from copilot-instructions.md)
 */
const VALIDATION = {
  title: {
    minLength: 5,
    maxLength: 100,
    allowedChars: /^[a-zA-Z0-9\s-_.()]+$/, // Alphanumeric, space, dash, underscore, dot, parens
    description: 'Title must be 5-100 characters, alphanumeric with basic punctuation',
  },
  description: {
    minLength: 10,
    maxLength: 500,
    allowedChars: /^[a-zA-Z0-9\s\-_.(),'!?:;@#/\n]+$/, // More lenient for description
    description: 'Description must be 10-500 characters with allowed characters',
  },
  priority: {
    allowed: ['low', 'medium', 'high'] as const,
    description: 'Priority must be low, medium, or high',
  },
};

/**
 * Sanitizes input string
 * - Trims whitespace
 * - Removes leading/trailing special chars
 */
function sanitize(input: string): string {
  return input.trim().replace(/^[\s\-_.]+|[\s\-_.]+$/g, '');
}

/**
 * Validates title field
 * Allowlist approach: only allow specific characters
 */
function validateTitle(title: string): string | null {
  const sanitized = sanitize(title);

  if (!sanitized) {
    return 'Title cannot be empty';
  }

  if (sanitized.length < VALIDATION.title.minLength) {
    return `Title must be at least ${VALIDATION.title.minLength} characters`;
  }

  if (sanitized.length > VALIDATION.title.maxLength) {
    return `Title must not exceed ${VALIDATION.title.maxLength} characters`;
  }

  if (!VALIDATION.title.allowedChars.test(sanitized)) {
    return 'Title contains invalid characters. Only letters, numbers, spaces, and basic punctuation allowed.';
  }

  return null;
}

/**
 * Validates description field
 * Allowlist approach: only allow specific characters
 */
function validateDescription(description: string): string | null {
  const sanitized = sanitize(description);

  if (!sanitized) {
    return 'Description cannot be empty';
  }

  if (sanitized.length < VALIDATION.description.minLength) {
    return `Description must be at least ${VALIDATION.description.minLength} characters`;
  }

  if (sanitized.length > VALIDATION.description.maxLength) {
    return `Description must not exceed ${VALIDATION.description.maxLength} characters`;
  }

  if (!VALIDATION.description.allowedChars.test(sanitized)) {
    return 'Description contains invalid characters. HTML, scripts, and special symbols not allowed.';
  }

  return null;
}

/**
 * Validates priority field
 */
function validatePriority(priority: TaskPriority): string | null {
  if (!VALIDATION.priority.allowed.includes(priority)) {
    return `Priority must be one of: ${VALIDATION.priority.allowed.join(', ')}`;
  }
  return null;
}

/**
 * Main action: Create task with validation
 * React 19: This function signature works with useActionState
 * 
 * @param previousState - Previous action state (passed by useActionState)
 * @param formData - FormData from submitted form or object with fields
 * @returns ActionState with success flag and task data or errors
 * 
 * Usage in component:
 * ```tsx
 * const [state, formAction, isPending] = useActionState(createTaskAction, initialState);
 * ```
 */
export async function createTaskAction(
  projectId: string,
  previousState: ActionState,
  formData: FormData | TaskFormInput
): Promise<ActionState> {
  try {
    // Parse form data (handles both FormData and object input)
    let input: Partial<TaskFormInput> = {};
    
    if (formData instanceof FormData) {
      input = {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        priority: formData.get('priority') as TaskPriority,
      };
    } else {
      input = formData;
    }

    // Initialize errors object
    const errors: Record<string, string> = {};

    // Server-side validation (security critical)
    const titleError = validateTitle(input.title || '');
    if (titleError) errors.title = titleError;

    const descriptionError = validateDescription(input.description || '');
    if (descriptionError) errors.description = descriptionError;

    const priorityError = validatePriority(input?.priority || 'low'); // Default to 'low' if not provided
    if (priorityError) errors.priority = priorityError;

    // If validation failed, return errors to client
    if (Object.keys(errors).length > 0) {
      return {
        success: false,
        errors,
        message: 'Validation failed. Please check fields and try again.',
      };
    }

    // All validation passed - safe to proceed
    const validInput: TaskFormInput = {
      title: sanitize(input.title!),
      description: sanitize(input.description!),
      priority: input.priority as 'low' | 'medium' | 'high',
    };

    // Simulate server creation (would call API in real app)
    const newTask = await mockApi.createTask(validInput, projectId);

    return {
      success: true,
      data: newTask,
      message: `Task "${newTask.title}" created successfully`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    return {
      success: false,
      message,
    };
  }
}

/**
 * Helper: Validate all fields at once
 * Useful for client-side real-time validation
 */
export function validateTaskForm(input: Partial<TaskFormInput>): Record<string, string> {
  const errors: Record<string, string> = {};

  if (input.title !== undefined) {
    const titleError = validateTitle(input.title);
    if (titleError) errors.title = titleError;
  }

  if (input.description !== undefined) {
    const descriptionError = validateDescription(input.description);
    if (descriptionError) errors.description = descriptionError;
  }

  if (input.priority !== undefined) {
    const priorityError = validatePriority(input.priority);
    if (priorityError) errors.priority = priorityError;
  }

  return errors;
}
