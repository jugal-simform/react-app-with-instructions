/**
 * useSearch Hook
 * Custom hook for search functionality with useTransition
 * React 19 Feature: Concurrent rendering with useTransition and useDeferredValue
 */

import { useState, useDeferredValue } from 'react';

interface UseSearchReturn {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  deferredSearchTerm: string;
}

/**
 * Hook that manages search state and provides deferred value
 * Allows search input to update immediately while filtering updates asynchronously
 * React 19 Feature: useDeferredValue for smooth non-blocking search
 */
export function useSearch(initialTerm = ''): UseSearchReturn {
  const [searchTerm, setSearchTerm] = useState(initialTerm);
  const deferredSearchTerm = useDeferredValue(searchTerm);

  return {
    searchTerm,
    setSearchTerm,
    deferredSearchTerm,
  };
}
