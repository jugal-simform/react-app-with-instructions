import { StrictMode } from "react";
import { TaskProvider } from "./context/TaskContext";
import { Dashboard } from "./pages/Dashboard";

/**
 * App Component - Root wrapper with providers
 * React 19 Features:
 * - StrictMode: Detects potential issues in components
 * - TaskProvider: Global task state management via Context API
 * - Dashboard: Main application page
 */
export default function App() {
  return (
    <StrictMode>
      <TaskProvider>
        <Dashboard />
      </TaskProvider>
    </StrictMode>
  );
}
