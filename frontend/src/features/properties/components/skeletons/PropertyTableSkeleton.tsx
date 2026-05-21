export function PropertyTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {/* Table header */}
      <div className="flex gap-4 px-4 py-3 border-b border-slate-100">
        <div className="h-4 bg-slate-200 rounded w-8" />
        <div className="h-4 bg-slate-200 rounded flex-1" />
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-4 bg-slate-200 rounded w-24" />
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-4 bg-slate-200 rounded w-28" />
        <div className="h-4 bg-slate-200 rounded w-24" />
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-slate-50">
          <div className="w-12 h-10 bg-slate-200 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 rounded w-3/4" />
            <div className="h-3 bg-slate-100 rounded w-1/2" />
          </div>
          <div className="h-5 bg-slate-200 rounded-full w-20" />
          <div className="h-5 bg-slate-200 rounded-full w-24" />
          <div className="h-4 bg-slate-200 rounded w-28" />
          <div className="h-4 bg-slate-200 rounded w-24" />
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
