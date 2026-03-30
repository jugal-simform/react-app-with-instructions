/**
 * Skeleton Loading Component
 * Animated placeholder for loading states
 * React 19 Feature: Works with Suspense boundaries
 */

import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  count?: number;
  circle?: boolean;
  className?: string;
}

/**
 * Skeleton component - animated loading placeholder
 * Matches height/width of content it replaces
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  count = 1,
  circle = false,
  className = '',
}: SkeletonProps)  {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;
  const heightStyle = typeof height === 'number' ? `${height}px` : height;

  const skeletonItems = Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-skeleton-loading bg-[length:200%_100%] ${circle ? 'rounded-full' : 'rounded-lg'} ${className}`}
      style={{
        width: widthStyle,
        height: heightStyle,
      }}
    />
  ));

  return (
    <div className={count > 1 ? 'space-y-2' : ''}>
      {skeletonItems}
    </div>
  );
}

/**
 * SkeletonCard component - skeleton block for cards
 */
export function SkeletonCard()  {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      <Skeleton height="1.5rem" />
      <Skeleton height="1rem" width="80%" />
      <Skeleton height="1rem" width="60%" />
      <div className="flex gap-2 pt-2">
        <Skeleton width="30%" height="2rem" />
        <Skeleton width="30%" height="2rem" />
      </div>
    </div>
  );
}
