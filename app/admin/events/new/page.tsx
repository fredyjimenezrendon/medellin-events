"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateEventInput } from "@/types/event";
import EventForm from "@/components/EventForm";
import Skeleton from "@/components/Skeleton";

export default function NewEventPage() {
  const router = useRouter();
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
    } catch (error) {
      console.error("Error checking auth:", error);
      router.push("/login");
    }
  };

  const handleSubmit = async (data: CreateEventInput) => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      router.push("/admin");
    } else {
      throw new Error("Failed to create event");
    }
  };

  const handleCancel = () => {
    router.push("/admin");
  };

  if (!authChecked) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton height="2.25rem" width="15rem" className="mb-8" />
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <Skeleton height="5rem" />
          <Skeleton height="8rem" />
          <Skeleton height="3rem" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Event</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <EventForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          submitLabel="Create Event"
        />
      </div>
    </div>
  );
}
