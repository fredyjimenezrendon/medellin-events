import Skeleton from "./Skeleton";

export default function TableRowSkeleton() {
  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton height="1rem" width="70%" />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Skeleton height="1rem" width="60%" />
      </td>
      <td className="px-6 py-4">
        <Skeleton height="1rem" width="80%" />
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1">
          <Skeleton height="1.5rem" width="3rem" borderRadius="9999px" />
          <Skeleton height="1.5rem" width="3.5rem" borderRadius="9999px" />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-4">
          <Skeleton height="1rem" width="2.5rem" />
          <Skeleton height="1rem" width="3rem" />
        </div>
      </td>
    </tr>
  );
}
