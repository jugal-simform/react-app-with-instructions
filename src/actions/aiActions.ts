/**
 * AI Actions - Mock AI API calls
 * Demonstrates concurrent rendering with useTransition
 * React 19 Feature: Non-blocking async operations
 */

import * as mockApi from '../services/mockApi';

/**
 * Generate AI title from description
 * Simulates LLM API call without blocking UI
 * React 19: Works with useTransition for smooth pending states
 */
export async function generateTitleAction(description: string): Promise<string> {
  // Validate input
  if (!description || description.trim().length === 0) {
    throw new Error('Description cannot be empty');
  }

  if (description.length > 500) {
    throw new Error('Description too long');
  }

  // Call mock AI service
  return mockApi.generateAITitle(description);
}

/**
 * Generate AI description from title
 * Simulates LLM API call without blocking UI
 * React 19: Works with useTransition for smooth pending states
 */
export async function generateDescriptionAction(title: string): Promise<string> {
  // Validate input
  if (!title || title.trim().length === 0) {
    throw new Error('Title cannot be empty');
  }

  if (title.length > 100) {
    throw new Error('Title too long');
  }

  // Call mock AI service
  return mockApi.generateAIDescription(title);
}
