export function PropertyCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 animate-pulse">
      <div className="h-52 bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-200 rounded-full w-3/4" />
        <div className="h-4 bg-slate-200 rounded-full w-1/2" />
        <div className="flex items-center gap-4 border-t border-slate-100 pt-3">
          <div className="h-4 bg-slate-200 rounded-full w-14" />
          <div className="h-4 bg-slate-200 rounded-full w-14" />
          <div className="h-4 bg-slate-200 rounded-full w-20 ml-auto" />
        </div>
      </div>
    </div>
  );
}
