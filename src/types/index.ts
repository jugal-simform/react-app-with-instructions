/**
 * Core Data Types for AI Project Dashboard
 * React 19 + TypeScript strict mode - all types properly defined
 */

// Task status enumeration
export type TaskStatus = 'todo' | 'in-progress' | 'done';

// Priority levels
export type TaskPriority = 'low' | 'medium' | 'high';

/**
 * Project interface - groups related tasks
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

/**
 * Task interface - individual work unit
 * Implements secure-by-default principles with validation-ready structure
 */
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Form input for creating a new task
 * Stripped of IDs and timestamps (server generates those)
 */
export interface TaskFormInput {
  title: string;
  description: string;
  priority: TaskPriority;
}

/**
 * Action state for form submission (useActionState return type)
 */
export interface ActionState {
  success: boolean;
  data?: Task;
  errors?: Record<string, string>;
  message?: string;
}

/**
 * Context-provided methods
 */
export interface TaskContextType {
  projects: Project[];
  tasks: Task[];
  selectedProjectId: string | null;
  searchTerm: string;
  isLoading: boolean;

  // Actions
  selectProject: (projectId: string) => void;
  setSearchTerm: (term: string) => void;
  createTask: (input: TaskFormInput, projectId: string) => Promise<Task>;
  addTask: (task: Task) => void;
  applyTaskDrop: (
    activeTaskId: string,
    overId: string,
    destinationStatus: TaskStatus,
  ) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  loadProjects: () => Promise<void>;
  loadTasks: (projectId: string) => Promise<void>;
}

/**
 * AI Panel generation request/response
 */
export interface AISuggestion {
  prompt: string;
  result: string;
  loading: boolean;
}
