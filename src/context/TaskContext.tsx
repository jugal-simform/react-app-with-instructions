/**
 * Task Context - Global State Management
 * Manages projects, tasks, and filters
 * React 19 Feature: Context API for avoiding prop drilling
 */

import React, { createContext, useReducer, useCallback, ReactNode } from 'react';
import type { Project, Task, TaskFormInput, TaskStatus, TaskContextType } from '../types/index';
import { arrayMove } from '@dnd-kit/sortable';
import * as mockApi from '../services/mockApi';

// Create context with undefined initial value
// eslint-disable-next-line react-refresh/only-export-components
export const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Action types for reducer
type TaskAction =
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'SET_TASKS'; payload: Task[] }
  | { type: 'ADD_TASK'; payload: Task }
  | { type: 'UPDATE_TASK_STATUS'; payload: { taskId: string; status: TaskStatus } }
  | {
      type: 'APPLY_TASK_DROP';
      payload: { activeTaskId: string; overId: string; destinationStatus: TaskStatus };
    }
  | { type: 'SELECT_PROJECT'; payload: string | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

function isTaskStatus(value: string): value is TaskStatus {
  return value === 'todo' || value === 'in-progress' || value === 'done';
}

interface TaskState {
  projects: Project[];
  tasks: Task[];
  selectedProjectId: string | null;
  searchTerm: string;
  isLoading: boolean;
}

const initialState: TaskState = {
  projects: [],
  tasks: [],
  selectedProjectId: null,
  searchTerm: '',
  isLoading: false,
};

/**
 * Reducer function for task state management
 * Pure function that handles all state transitions
 */
function taskReducer(state: TaskState, action: TaskAction): TaskState {
  switch (action.type) {
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };

    case 'SET_TASKS':
      return { ...state, tasks: action.payload };

    case 'ADD_TASK': {
      // Only add if it belongs to selected project (optimistic UI)
      if (action.payload.projectId === state.selectedProjectId) {
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
        };
      }
      return state;
    }

    case 'UPDATE_TASK_STATUS': {
      const updatedTasks = state.tasks.map((task) =>
        task.id === action.payload.taskId
          ? { ...task, status: action.payload.status, updatedAt: new Date() }
          : task
      );
      return { ...state, tasks: updatedTasks };
    }

    case 'APPLY_TASK_DROP': {
      const { activeTaskId, overId, destinationStatus } = action.payload;

      const activeIndex = state.tasks.findIndex((task) => task.id === activeTaskId);
      if (activeIndex === -1) {
        return state;
      }

      const statusUpdated = state.tasks.map((task) =>
        task.id === activeTaskId
          ? { ...task, status: destinationStatus, updatedAt: new Date() }
          : task,
      );

      if (overId === activeTaskId || isTaskStatus(overId)) {
        return { ...state, tasks: statusUpdated };
      }

      const activeTaskNextIndex = statusUpdated.findIndex((task) => task.id === activeTaskId);
      const overIndex = statusUpdated.findIndex((task) => task.id === overId);

      if (overIndex === -1) {
        return { ...state, tasks: statusUpdated };
      }

      return {
        ...state,
        tasks: arrayMove(statusUpdated, activeTaskNextIndex, overIndex),
      };
    }

    case 'SELECT_PROJECT':
      return {
        ...state,
        selectedProjectId: action.payload,
        tasks: [], // Clear tasks when switching projects
        searchTerm: '', // Reset search
      };

    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    default:
      return state;
  }
}

/**
 * TaskProvider component - wraps app with task context
 * Must be placed at root level (in App.tsx)
 */
export function TaskProvider({ children }: { children: ReactNode })  {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  // Load projects on component mount
  React.useEffect(() => {
    const loadProjects = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const projects = await mockApi.fetchProjects();
        dispatch({ type: 'SET_PROJECTS', payload: projects });
        // Auto-select first project
        if (projects.length > 0) {
          dispatch({ type: 'SELECT_PROJECT', payload: projects[0].id });
        }
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadProjects();
  }, []);

  // Load tasks when selected project changes
  React.useEffect(() => {
    if (!state.selectedProjectId) return;

    const loadTasks = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const tasks = await mockApi.fetchTasks(state.selectedProjectId!);
        dispatch({ type: 'SET_TASKS', payload: tasks });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadTasks();
  }, [state.selectedProjectId]);

  /**
   * Select a project and trigger task loading
   * React 19: Callback is stable (memoized by dependency array)
   */
  const selectProject = useCallback((projectId: string) => {
    dispatch({ type: 'SELECT_PROJECT', payload: projectId });
  }, []);

  /**
   * Update search term for filtering
   */
  const setSearchTerm = useCallback((term: string) => {
    dispatch({ type: 'SET_SEARCH_TERM', payload: term });
  }, []);

  /**
   * Create a new task
   * React 19 Feature: useActionState in TaskForm will call this
   */
  const createTask = useCallback(
    async (input: TaskFormInput, projectId: string): Promise<Task> => {
      const newTask = await mockApi.createTask(input, projectId);
      // Optimistic update: add to state immediately
      dispatch({ type: 'ADD_TASK', payload: newTask });
      return newTask;
    },
    []
  );

  /**
   * Update task status (used by Kanban drag-and-drop)
   * React 19 Feature: useOptimistic in TaskBoard will call this
   */
  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus): Promise<void> => {
      // Optimistic update: update state immediately
      dispatch({ type: 'UPDATE_TASK_STATUS', payload: { taskId, status } });
      // Then sync with "server"
      await mockApi.updateTaskStatus(taskId, status);
    },
    []
  );

  const addTask = useCallback((task: Task): void => {
    dispatch({ type: 'ADD_TASK', payload: task });
  }, []);

  const applyTaskDrop = useCallback(
    (activeTaskId: string, overId: string, destinationStatus: TaskStatus): void => {
      dispatch({
        type: 'APPLY_TASK_DROP',
        payload: { activeTaskId, overId, destinationStatus },
      });
    },
    []
  );

  /**
   * Load projects (can be called manually to refresh)
   */
  const loadProjects = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const projects = await mockApi.fetchProjects();
      dispatch({ type: 'SET_PROJECTS', payload: projects });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  /**
   * Load tasks for a project (can be called manually to refresh)
   */
  const loadTasks = useCallback(async (projectId: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const tasks = await mockApi.fetchTasks(projectId);
      dispatch({ type: 'SET_TASKS', payload: tasks });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const value: TaskContextType = {
    projects: state.projects,
    tasks: state.tasks,
    selectedProjectId: state.selectedProjectId,
    searchTerm: state.searchTerm,
    isLoading: state.isLoading,
    selectProject,
    setSearchTerm,
    createTask,
    addTask,
    applyTaskDrop,
    updateTaskStatus,
    loadProjects,
    loadTasks,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

