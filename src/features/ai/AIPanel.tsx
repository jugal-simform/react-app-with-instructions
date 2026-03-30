/**
 * AIPanel Component
 * Mock AI assistant for generating task titles and descriptions
 * React 19 Features:
 * - useTransition for non-blocking async operations
 * - Concurrent rendering
 * - Lazy loadable for code splitting
 */

import React, { useTransition } from 'react';
import { Wand2 } from 'lucide-react';
import { Button, Input } from '../../components';
import { generateTitleAction, generateDescriptionAction } from '../../actions/aiActions';

interface AIPanelProps {
  onTitleGenerated?: (title: string) => void;
  onDescriptionGenerated?: (description: string) => void;
}

/**
 * AIPanel component - mock AI features for task generation
 * React 19 Feature: useTransition for smooth pending states without UI blocking
 */
export function AIPanel({
  onTitleGenerated,
  onDescriptionGenerated,
}: AIPanelProps)  {
  const [description, setDescription] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [generatedTitle, setGeneratedTitle] = React.useState('');
  const [generatedDescription, setGeneratedDescription] = React.useState('');
  const [error, setError] = React.useState('');

  // React 19 Feature: useTransition - marks updates as non-urgent
  // UI remains responsive, expensive rendering deferred
  const [isPendingTitle, startGeneratingTitle] = useTransition();
  const [isPendingDescription, startGeneratingDescription] = useTransition();

  const handleGenerateTitle = () => {
    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setError('');
    // React 19: Start transition for non-blocking generation
    startGeneratingTitle(async () => {
      try {
        const result = await generateTitleAction(description);
        setGeneratedTitle(result);
        onTitleGenerated?.(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate title');
      }
    });
  };

  const handleGenerateDescription = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    setError('');
    // React 19: Start transition for non-blocking generation
    startGeneratingDescription(async () => {
      try {
        const result = await generateDescriptionAction(title);
        setGeneratedDescription(result);
        onDescriptionGenerated?.(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate description');
      }
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
      {/* Header */}
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-1">
          <Wand2 size={20} className="text-blue-600" />
          AI Assistant
        </h3>
        <p className="text-sm text-gray-600">
          Generate tasks with AI assistance
        </p>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Generate title section */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Generate Title From Description</h4>
        <Input
          placeholder="Describe what you want to accomplish..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isPendingTitle}
        />
        <Button
          onClick={handleGenerateTitle}
          isLoading={isPendingTitle}
          disabled={isPendingTitle}
          variant="primary"
          icon={<Wand2 size={18} />}
          className="w-full"
        >
          {isPendingTitle ? 'Generating...' : 'Generate Title'}
        </Button>

        {generatedTitle && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-gray-600 mb-1">Generated Title:</p>
            <p className="font-medium text-gray-900 line-clamp-2">{generatedTitle}</p>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Generate description section */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Generate Description From Title</h4>
        <Input
          placeholder="Enter a task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isPendingDescription}
        />
        <Button
          onClick={handleGenerateDescription}
          isLoading={isPendingDescription}
          disabled={isPendingDescription}
          variant="primary"
          icon={<Wand2 size={18} />}
          className="w-full"
        >
          {isPendingDescription ? 'Generating...' : 'Generate Description'}
        </Button>

        {generatedDescription && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-gray-600 mb-1">Generated Description:</p>
            <p className="text-sm text-gray-900 line-clamp-3">{generatedDescription}</p>
          </div>
        )}
      </div>

      {/* React 19 Note */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
        <p className="font-medium mb-1">React 19 Feature: useTransition</p>
        <p>
          Generating AI suggestions doesnt block the UI. The input remains responsive
          while the generation is in progress.
        </p>
      </div>
    </div>
  );
}
