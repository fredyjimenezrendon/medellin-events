import Skeleton from "@/components/Skeleton";

export default function EditEventLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Skeleton height="2.25rem" width="15rem" className="mb-8" />
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <Skeleton height="5rem" />
        <Skeleton height="8rem" />
        <Skeleton height="3rem" />
        <Skeleton height="3rem" />
        <Skeleton height="400px" />
      </div>
    </div>
  );
}
