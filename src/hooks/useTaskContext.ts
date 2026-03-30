import { useContext } from "react";
import { TaskContextType } from "../types";
import { TaskContext } from "../context/TaskContext";

/**
 * Hook to use task context
 * Must be called from within TaskProvider
 * Throws error if used outside provider
 */
export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTaskContext must be used within TaskProvider");
  }
  return context;
}
