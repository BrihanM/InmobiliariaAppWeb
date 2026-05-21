export function UsersTableSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div className="h-4 w-24 bg-gray-200 rounded" />
        <div className="h-4 w-16 bg-gray-200 rounded" />
      </div>

      {/* Rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-gray-50 last:border-0">
          {/* Avatar */}
          <div className="h-9 w-9 rounded-full bg-gray-200 shrink-0" />
          {/* Name + email */}
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-48 bg-gray-100 rounded" />
          </div>
          {/* Role badge */}
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          {/* Status badge */}
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
          {/* Date */}
          <div className="h-3 w-24 bg-gray-100 rounded hidden md:block" />
          {/* Actions */}
          <div className="flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
            <div className="h-8 w-8 bg-gray-200 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
