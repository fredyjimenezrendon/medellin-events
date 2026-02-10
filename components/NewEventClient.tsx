"use client";

import { useRouter } from "next/navigation";
import { CreateEventInput } from "@/types/event";
import EventForm from "@/components/EventForm";
import { invalidateEvents } from "@/hooks/useEvents";

export default function NewEventClient() {
  const router = useRouter();

  const handleSubmit = async (data: CreateEventInput) => {
    const response = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      await invalidateEvents();
      router.push("/admin");
    } else {
      throw new Error("Failed to create event");
    }
  };

  return (
    <EventForm
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admin")}
      submitLabel="Create Event"
    />
  );
}
