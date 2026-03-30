/**
 * Dashboard Page
 * Main page component that brings together all features
 * React 19 Features:
 * - Suspense boundaries for async data
 * - useSearch hook for concurrent filtering
 * - useOptimistic updates via context
 * - Lazy loading of panels
 */

import React, { Suspense, lazy, useState } from 'react';
import { useSearch } from '../hooks/useSearch';
import { Header } from '../components/Header';
import { ProjectList } from '../components/ProjectList';
import { TaskBoard, TaskBoardLoader } from '../features/tasks/TaskBoard';
import { TaskFormModal } from '../features/tasks/TaskFormModal';
import { TaskDetailDrawer } from '../features/drawer/TaskDetailDrawer';
import type { Task } from '../types/index';
import { useTaskContext } from '../hooks/useTaskContext';

// Lazy load AI panel to reduce initial bundle
const AIPanel = lazy(() => import('../features/ai/AIPanel').then(m => ({ default: m.AIPanel })));

/**
 * Dashboard page - main application page
 * React 19 Features:
 * - Suspense for lazy-loaded async components
 * - Context-based state management
 * - Concurrent rendering with useSearch/useDeferredValue
 * - useOptimistic updates through context methods
 */
export function Dashboard()  {
  // Get task context
  const {
    projects,
    tasks,
    selectedProjectId,
    isLoading,
    addTask,
  } = useTaskContext();

  // Search state with useTransition support
  const { searchTerm, setSearchTerm, deferredSearchTerm } = useSearch();

  // Modal/drawer states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Mobile sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Current project name for header
  const currentProject = projects.find((p) => p.id === selectedProjectId);

  const handleTaskSelect = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsDrawerOpen(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header - fixed at top */}
      <Header
        projectName={currentProject?.name}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateTask={() => setIsFormModalOpen(true)}
        onToggleAI={() => setIsAIPanelOpen(!isAIPanelOpen)}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isAIPanelOpen={isAIPanelOpen}
      />

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - projects list */}
        <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block lg:w-64 border-r border-gray-200 overflow-y-auto`}>
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={() => {
              setIsSidebarOpen(false);
            }}
            isLoading={isLoading}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Content area with task board and AI panel */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-4 p-4">
            {/* Task board - main area */}
            <div className="flex-1 min-w-0 flex flex-col">
              {selectedProjectId ? (
                <Suspense fallback={<TaskBoardLoader />}>
                  <TaskBoard
                    tasks={tasks}
                    selectedProjectId={selectedProjectId}
                    deferredSearchTerm={deferredSearchTerm}
                    onTaskSelect={handleTaskSelect}
                  />
                </Suspense>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p>Select a project to get started</p>
                </div>
              )}
            </div>

            {/* AI Panel - right side (collapsible) */}
            {isAIPanelOpen && (
              <div className="w-full lg:w-96 overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-200">
                <Suspense fallback={<div className="p-6 text-center text-gray-500">Loading AI Assistant...</div>}>
                  <div className="p-4">
                    <AIPanel />
                  </div>
                </Suspense>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals and Drawers */}
      {selectedProjectId && (
        <>
          {/* Task creation modal */}
          <TaskFormModal
            isOpen={isFormModalOpen}
            onClose={() => setIsFormModalOpen(false)}
            projectId={selectedProjectId}
            onTaskCreate={(task) => {
              // Sync newly created task with TaskContext to display on board
              addTask(task);
            }}
          />

          {/* Task detail drawer */}
          <TaskDetailDrawer
            isOpen={isDrawerOpen}
            taskId={selectedTaskId}
            onClose={() => {
              setIsDrawerOpen(false);
              setSelectedTaskId(null);
            }}
          />
        </>
      )}

      {/* Keyboard shortcuts help */}
      <div className="hidden">
        <p>
          React 19 Features Demonstrated:
          - Suspense: Task board loading with skeleton fallback
          - useTransition: Search input with concurrent rendering
          - useDeferredValue: Deferred search filtering for smooth UI
          - useOptimistic: Immediate task drag-and-drop updates
          - useActionState: Task form submission
          - Lazy loading: AI Panel and Task Details with React.lazy
          - Context API: Global state without prop drilling
          - Strict Mode: Safe effects with idempotent operations
        </p>
      </div>
    </div>
  );
}
