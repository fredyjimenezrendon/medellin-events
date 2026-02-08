"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Event } from "@/types/event";
import Skeleton from "@/components/Skeleton";
import TableRowSkeleton from "@/components/TableRowSkeleton";
import Link from "next/link";

export default function AdminPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check");
      const data = await response.json();

      if (!data.isAdmin) {
        router.push("/login");
        return;
      }

      setAuthChecked(true);
      fetchEvents();
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/login");
    }
  };

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/events");
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) {
      return;
    }

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (!authChecked || loading) {
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700"
        >
          Logout
        </button>
      </div>

      <div className="mb-6">
        <Link
          href="/admin/events/new"
          className="inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Create New Event
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRowSkeleton key={index} />
              ))
            ) : (
              events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {event.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {event.location.address}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {!loading && events.length === 0 && (
          <p className="text-center text-gray-600 py-8">
            No events yet. Create your first event!
          </p>
        )}
      </div>
    </div>
  );
}
