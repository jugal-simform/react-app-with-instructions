/**
 * Header Component
 * Top navigation bar with search, project title, and action buttons
 * React 19: No manual memoization
 */

import React from 'react';
import { Menu, HelpCircle } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { Button } from './Button';

interface HeaderProps {
  projectName?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onCreateTask: () => void;
  onToggleAI: () => void;
  onToggleSidebar?: () => void;
  isAIPanelOpen?: boolean;
}

/**
 * Header component - top navigation with search and controls
 * React 19 Feature: Event handling with modern syntax
 */
export function Header({
  projectName,
  searchValue,
  onSearchChange,
  onCreateTask,
  onToggleAI,
  onToggleSidebar,
  isAIPanelOpen = false,
}: HeaderProps)  {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left section: Logo and project name */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu size={20} />
              </button>
            )}

            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
              <div className="min-w-0">
                <h1 className="text-xl font-bold text-gray-900 truncate">
                  AI Project Dashboard
                </h1>
                {projectName && (
                  <p className="text-sm text-gray-500 truncate">
                    {projectName}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Center section: Search */}
          <div className="hidden md:block flex-1 max-w-sm">
            <SearchInput value={searchValue} onChange={onSearchChange} />
          </div>

          {/* Right section: Actions */}
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant={isAIPanelOpen ? 'primary' : 'secondary'}
              size="sm"
              icon={<HelpCircle size={18} />}
              onClick={onToggleAI}
              title="Toggle AI Assistant Panel"
            >
              <span className="hidden sm:inline">AI</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={onCreateTask}
            >
              <span className="hidden sm:inline">+ Create</span>
              <span className="sm:hidden">+</span>
            </Button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="mt-4 md:hidden">
          <SearchInput value={searchValue} onChange={onSearchChange} />
        </div>
      </div>
    </header>
  );
}
