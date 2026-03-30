/**
 * ProjectList Component
 * Sidebar with list of projects
 * React 19: No manual memoization, works with Suspense
 */

import { FolderOpen } from 'lucide-react';
import type { Project } from '../types/index';
import { Skeleton } from './Skeleton';

interface ProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (projectId: string) => void;
  isLoading?: boolean;
}

/**
 * ProjectList component - sidebar with projects
 * React 19 Feature: Works with Suspense boundaries
 */
export function ProjectList({
  projects,
  selectedProjectId,
  onSelectProject,
  isLoading = false,
}: ProjectListProps)  {
  return (
    <aside className="w-full lg:w-64 bg-gray-50 border-l lg:border-r lg:border-l-0 border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 px-2 uppercase tracking-wide">
          Projects
        </h2>

        {isLoading ? (
          <div className="space-y-2">
            <Skeleton height="2.5rem" />
            <Skeleton height="2.5rem" />
            <Skeleton height="2.5rem" />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-8">
            <FolderOpen size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No projects found</p>
          </div>
        ) : (
          <ul className="space-y-1">
            {projects.map((project) => (
              <li key={project.id}>
                <button
                  onClick={() => onSelectProject(project.id)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                    selectedProjectId === project.id
                      ? 'bg-blue-100 text-blue-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-current={selectedProjectId === project.id ? 'page' : undefined}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-current mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{project.name}</p>
                      <p className="text-xs opacity-75 line-clamp-1">{project.description}</p>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
