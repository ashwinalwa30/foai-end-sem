import React from 'react';

export const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded ${className}`} />
);

export const NewsSkeleton = () => (
  <div className="space-y-4 p-4 glass dark:glass-dark rounded-2xl">
    <Skeleton className="h-48 w-full rounded-xl" />
    <div className="space-y-2">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-20 rounded-lg" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="h-64 flex items-end gap-2 p-4">
    {[...Array(12)].map((_, i) => (
      <Skeleton key={i} className="flex-1" style={{ height: `${Math.random() * 80 + 20}%` }} />
    ))}
  </div>
);
