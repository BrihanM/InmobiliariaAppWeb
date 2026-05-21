interface SearchResultSkeletonProps {
  view: 'grid' | 'list';
  count?: number;
}

export function SearchResultSkeleton({ view, count = 12 }: SearchResultSkeletonProps) {
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {Array.from({ length: Math.min(count, 8) }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 bg-white rounded-2xl p-4 border border-slate-100 animate-pulse"
          >
            <div className="w-40 h-28 bg-slate-200 rounded-xl shrink-0" />
            <div className="flex-1 space-y-3 py-1">
              <div className="flex gap-2">
                <div className="h-5 bg-slate-200 rounded-full w-20" />
                <div className="h-5 bg-slate-200 rounded-full w-16" />
              </div>
              <div className="h-5 bg-slate-200 rounded w-2/3" />
              <div className="h-7 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="flex gap-4">
                <div className="h-4 bg-slate-200 rounded w-10" />
                <div className="h-4 bg-slate-200 rounded w-10" />
                <div className="h-4 bg-slate-200 rounded w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse"
        >
          <div className="h-48 bg-slate-200" />
          <div className="p-4 space-y-3">
            <div className="flex gap-2">
              <div className="h-5 bg-slate-200 rounded-full w-20" />
              <div className="h-5 bg-slate-200 rounded-full w-16" />
            </div>
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-6 bg-slate-200 rounded w-1/2" />
            <div className="h-3 bg-slate-200 rounded w-2/3" />
            <div className="flex gap-3 pt-2 border-t border-slate-100">
              <div className="h-3 bg-slate-200 rounded w-12" />
              <div className="h-3 bg-slate-200 rounded w-12" />
              <div className="h-3 bg-slate-200 rounded w-16 ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
