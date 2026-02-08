import Skeleton from "./Skeleton";

export default function EventCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Title skeleton */}
      <Skeleton className="mb-4" height="2rem" width="70%" />

      {/* Description skeleton - multiple lines */}
      <div className="mb-4 space-y-2">
        <Skeleton height="1rem" width="100%" />
        <Skeleton height="1rem" width="90%" />
        <Skeleton height="1rem" width="80%" />
      </div>

      {/* Map skeleton */}
      <Skeleton className="mb-4" height="200px" width="100%" />

      {/* Location skeleton */}
      <div className="flex items-start text-gray-600 mb-3">
        <Skeleton className="mr-2" height="1.25rem" width="1.25rem" />
        <Skeleton height="1rem" width="60%" />
      </div>

      {/* Date skeleton */}
      <div className="flex items-center text-gray-600 mb-4">
        <Skeleton className="mr-2" height="1.25rem" width="1.25rem" />
        <Skeleton height="1rem" width="40%" />
      </div>

      {/* Tags skeleton */}
      <div className="flex flex-wrap gap-2">
        <Skeleton height="1.5rem" width="4rem" borderRadius="9999px" />
        <Skeleton height="1.5rem" width="5rem" borderRadius="9999px" />
        <Skeleton height="1.5rem" width="4.5rem" borderRadius="9999px" />
      </div>
    </div>
  );
}
