"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Event, CreateEventInput } from "@/types/event";
import EventForm from "@/components/EventForm";
import Skeleton from "@/components/Skeleton";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      fetchEvent();
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/login");
    }
  };

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        setError("Event not found");
      }
    } catch (error) {
      setError("Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateEventInput) => {
    const response = await fetch(`/api/events/${eventId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push("/admin");
    } else {
      throw new Error("Failed to update event");
    }
  };

  const handleCancel = () => {
    router.push("/admin");
  };

  if (!authChecked || loading) {
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

  if (error || !event) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{error || "Event not found"}</p>
          <button
            onClick={() => router.push("/admin")}
            className="mt-4 text-blue-600 hover:text-blue-800 underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <EventForm
          initialData={event}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Update Event"
        />
      </div>
    </div>
  );
}
