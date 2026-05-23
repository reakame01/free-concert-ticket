export const ConcertListSkeleton = () => (
  <div className="mt-6 space-y-4" aria-busy="true" aria-label="Loading concerts">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="animate-pulse rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div className="h-6 w-48 rounded bg-gray-200" />
        <div className="mt-4 h-px bg-gray-100" />
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full rounded bg-gray-100" />
          <div className="h-3 w-4/5 rounded bg-gray-100" />
        </div>
        <div className="mt-6 flex justify-between">
          <div className="h-5 w-16 rounded bg-gray-200" />
          <div className="h-10 w-24 rounded-lg bg-gray-200" />
        </div>
      </div>
    ))}
  </div>
);
