/**
 * Card Component
 * Reusable card container with optional header and footer
 * React 19: No manual memoization
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  hoverable?: boolean;
  onClick?: () => void;
}

/**
 * Card component - semantic container with Tailwind styling
 */
export function Card({
  children,
  className = '',
  header,
  footer,
  hoverable = false,
  onClick,
}: CardProps)  {
  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg shadow-sm ${hoverable ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : ''} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onClick();
              }
            }
          : undefined
      }
    >
      {header && <div className="px-6 py-4 border-b border-gray-200">{header}</div>}
      <div className="px-6 py-4">{children}</div>
      {footer && <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">{footer}</div>}
    </div>
  );
}
