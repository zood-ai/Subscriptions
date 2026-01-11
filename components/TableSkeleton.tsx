import type * as React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface TableSkeletonProps {
  title?: string;
  className?: string;
  titleClassName?: string;
  columnCount?: number;
  rowCount?: number;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  title,
  className = '',
  titleClassName = '',
  columnCount = 4,
  rowCount = 5,
}) => {
  return (
    <div className={className}>
      {title && (
        <h2
          className={cn(
            'py-6.25 text-gray-500 text-xl font-medium',
            titleClassName
          )}
        >
          {title}
        </h2>
      )}
      <div className="w-full rounded-2xl border border-border bg-card">
        {/* Filter Tabs Skeleton */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>

        {/* Selection Info Skeleton */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-20 rounded-md" />
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-12 px-4 py-3 text-left">
                  <div className="flex items-center justify-center">
                    <Checkbox disabled className="h-4 w-4" />
                  </div>
                </th>
                {[...Array(columnCount)].map((_, i) => (
                  <th key={i} className="px-4 py-3 text-left">
                    <Skeleton className="h-5 w-24" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...Array(rowCount)].map((_, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-b border-border last:border-b-0"
                >
                  <td className="w-12 px-4 py-4">
                    <div className="flex items-center justify-center">
                      <Checkbox disabled className="h-4 w-4" />
                    </div>
                  </td>
                  {[...Array(columnCount)].map((_, colIdx) => (
                    <td key={colIdx} className="px-4 py-4">
                      <Skeleton className="h-5 w-32" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableSkeleton;
