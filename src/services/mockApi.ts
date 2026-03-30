/**
 * Mock API Service
 * Simulates backend API calls with realistic delays
 * All functions are Suspense-compatible (throw promises)
 * 
 * React 19 Features:
 * - Suspense integration for async data loading
 * - Simulates concurrent rendering scenarios
 */

import type { Project, Task, TaskFormInput, TaskStatus } from '../types/index';

// Mock data storage
const projects: Project[] = [
  {
    id: 'proj-1',
    name: 'Website Redesign',
    description: 'Modernize company website with new design system',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'proj-2',
    name: 'Mobile App MVP',
    description: 'Build minimum viable product for iOS/Android',
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'proj-3',
    name: 'API Integration',
    description: 'Integrate third-party payment and shipping APIs',
    createdAt: new Date('2024-02-10'),
  },
  {
    id: 'proj-4',
    name: 'Performance Optimization',
    description: 'Improve app load times and database queries',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'proj-5',
    name: 'Security Audit',
    description: 'Complete security review and vulnerability fixes',
    createdAt: new Date('2024-03-01'),
  },
];

const tasks: Task[] = [
  // Project 1 tasks
  {
    id: 'task-1',
    projectId: 'proj-1',
    title: 'Create design system components',
    description: 'Button, input, card, badge components',
    status: 'done',
    priority: 'high',
    createdAt: new Date('2024-01-16'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'task-2',
    projectId: 'proj-1',
    title: 'Build homepage layout',
    description: 'Hero section, navigation, feature grid',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-03-10'),
  },
  {
    id: 'task-3',
    projectId: 'proj-1',
    title: 'Add dark mode support',
    description: 'Theme toggle and CSS variables',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
  {
    id: 'task-4',
    projectId: 'proj-1',
    title: 'Mobile responsiveness',
    description: 'Test and fix mobile layouts',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2024-02-05'),
    updatedAt: new Date('2024-02-05'),
  },
  {
    id: 'task-5',
    projectId: 'proj-1',
    title: 'Performance audit',
    description: 'Lighthouse score improvements',
    status: 'todo',
    priority: 'low',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
  },

  // Project 2 tasks
  {
    id: 'task-6',
    projectId: 'proj-2',
    title: 'Setup React Native project',
    description: 'Initialize Expo project and dependencies',
    status: 'done',
    priority: 'high',
    createdAt: new Date('2024-02-02'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'task-7',
    projectId: 'proj-2',
    title: 'Create navigation structure',
    description: 'Tab navigation, stack navigation setup',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 'task-8',
    projectId: 'proj-2',
    title: 'Build authentication flow',
    description: 'Login, signup, password reset screens',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-18'),
  },
  {
    id: 'task-9',
    projectId: 'proj-2',
    title: 'Implement user profile',
    description: 'Profile edit, settings, preferences',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'task-10',
    projectId: 'proj-2',
    title: 'Beta testing setup',
    description: 'TestFlight and Play Store beta configuration',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-10'),
  },

  // Project 3 tasks
  {
    id: 'task-11',
    projectId: 'proj-3',
    title: 'Stripe integration',
    description: 'Payment processing setup and webhooks',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-03-20'),
  },
  {
    id: 'task-12',
    projectId: 'proj-3',
    title: 'Shippo API integration',
    description: 'Shipping rate calculation and label generation',
    status: 'todo',
    priority: 'high',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
  },
  {
    id: 'task-13',
    projectId: 'proj-3',
    title: 'Write API documentation',
    description: 'OpenAPI/Swagger docs for payment endpoints',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-05'),
  },

  // Project 4 tasks
  {
    id: 'task-14',
    projectId: 'proj-4',
    title: 'Database query analysis',
    description: 'Profile slow queries with monitoring tools',
    status: 'done',
    priority: 'high',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-03-01'),
  },
  {
    id: 'task-15',
    projectId: 'proj-4',
    title: 'Add caching layer',
    description: 'Implement Redis for session and data caching',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2024-03-22'),
  },

  // Project 5 tasks
  {
    id: 'task-16',
    projectId: 'proj-5',
    title: 'Vulnerability scanning',
    description: 'Run OWASP and npm audit tools',
    status: 'done',
    priority: 'high',
    createdAt: new Date('2024-03-02'),
    updatedAt: new Date('2024-03-15'),
  },
  {
    id: 'task-17',
    projectId: 'proj-5',
    title: 'Fix SQL injection issues',
    description: 'Update queries with parameterized statements',
    status: 'in-progress',
    priority: 'high',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-03-25'),
  },
];

// Simulate network delay with setTimeout
const NETWORK_DELAY = 300; // ms

/**
 * Fetch all projects
 * React 19 Feature: Suspense boundary compatible
 */
export async function fetchProjects(): Promise<Project[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return sorted by creation date, newest first
      resolve([...projects].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }, NETWORK_DELAY);
  });
}

/**
 * Fetch tasks for a specific project
 * React 19 Feature: Suspense boundary compatible
 */
export async function fetchTasks(projectId: string): Promise<Task[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const projectTasks = tasks.filter((task) => task.projectId === projectId);
      // Return sorted by creation date, newest first
      resolve([...projectTasks].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()));
    }, NETWORK_DELAY);
  });
}

/**
 * Fetch single task details
 * React 19 Feature: Lazy loading with Suspense for task drawer
 */
export async function fetchTaskDetails(taskId: string): Promise<Task | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = tasks.find((t) => t.id === taskId);
      resolve(task || null);
    }, NETWORK_DELAY);
  });
}

/**
 * Create a new task (useActionState compatible)
 * Validates input and returns success/error state
 * React 19 Feature: Works with Server Actions pattern
 */
export async function createTask(input: TaskFormInput, projectId: string): Promise<Task> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        title: input.title,
        description: input.description,
        priority: input.priority,
        status: 'todo',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      tasks.push(newTask);
      resolve(newTask);
    }, NETWORK_DELAY + 200); // Slightly longer for "creation"
  });
}

/**
 * Update task status (optimistic updates compatible)
 * React 19 Feature: useOptimistic hook friendly
 */
export async function updateTaskStatus(taskId: string, status: TaskStatus): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.status = status;
        task.updatedAt = new Date();
      }
      resolve();
    }, NETWORK_DELAY);
  });
}

/**
 * Move task (reorder within column or between columns)
 * Used for drag-and-drop operations
 */
export async function moveTask(taskId: string, newStatus: TaskStatus): Promise<void> {
  return updateTaskStatus(taskId, newStatus);
}

/**
 * Generate AI title suggestion
 * React 19 Feature: Concurrent rendering with useTransition
 */
export async function generateAITitle(description: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock AI generation - in reality would call an LLM API
      const titles = [
        `Auto-generated: ${description.substring(0, 30)}...`,
        'Smart Feature: ' + description.split(' ')[0] + ' Implementation',
        'System Task: ' + description.substring(0, 25).trim() + '...',
        'Review: ' + description.substring(0, 20).trim(),
      ];
      resolve(titles[Math.floor(Math.random() * titles.length)]);
    }, 1000); // Longer delay to simulate AI processing
  });
}

/**
 * Generate AI description suggestion
 * React 19 Feature: Concurrent rendering with useTransition
 */
export async function generateAIDescription(title: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock AI generation
      const descriptions = [
        `This task is about implementing "${title}" to improve the system. Ensure all edge cases are covered and tests are written.`,
        `Complete implementation of "${title}" according to specifications. Include proper error handling and user feedback.`,
        `Work on "${title}" with focus on code quality, performance, and maintainability. Document all changes clearly.`,
      ];
      resolve(descriptions[Math.floor(Math.random() * descriptions.length)]);
    }, 1200); // Slightly longer delay
  });
}

/**
 * Search tasks by query string
 * React 19 Feature: Works with useDeferredValue for smooth filtering
 */
export async function searchTasks(query: string, projectId: string): Promise<Task[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const projectTasks = tasks.filter((task) => task.projectId === projectId);
      const filtered = projectTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description.toLowerCase().includes(query.toLowerCase())
      );
      resolve(
        [...filtered].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      );
    }, 200); // Faster for search to feel responsive
  });
}
