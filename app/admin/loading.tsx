import Skeleton from "@/components/Skeleton";

export default function AdminLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <Skeleton height="2.25rem" width="15rem" />
        <Skeleton height="2.5rem" width="5rem" />
      </div>
      <Skeleton className="mb-6" height="2.5rem" width="10rem" />
      <div className="bg-white rounded-lg shadow-md p-6">
        <Skeleton height="1.5rem" width="30%" className="mb-4" />
        <div className="space-y-3">
          <Skeleton height="3rem" width="100%" />
          <Skeleton height="3rem" width="100%" />
          <Skeleton height="3rem" width="100%" />
        </div>
      </div>
    </div>
  );
}
