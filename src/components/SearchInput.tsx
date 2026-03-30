/**
 * SearchInput Component
 * Search input with useTransition for non-blocking updates
 * React 19 Feature: Concurrent rendering demonstration
 */

import React, { useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from './Input';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch?: (query: string) => void;
}

/**
 * SearchInput component - demonstrates useTransition for non-blocking search
 * React 19 Feature: Concurrent rendering - search input updates immediately,
 * filtering in parent component updates after with useDeferredValue
 */
export function SearchInput({
  value,
  onChange,
  placeholder = 'Search tasks...',
  onSearch,
}: SearchInputProps)  {
  const [isTransitioning, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Update input immediately for responsiveness
    onChange(newValue);

    // Start transition for expensive filtering operations
    if (onSearch) {
      startTransition(() => {
        onSearch(newValue);
      });
    }
  };

  const handleClear = () => {
    onChange('');
    if (onSearch) {
      startTransition(() => {
        onSearch('');
      });
    }
  };

  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label="Search tasks"
        aria-busy={isTransitioning}
        icon={<Search size={18} />}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
      {isTransitioning && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}
