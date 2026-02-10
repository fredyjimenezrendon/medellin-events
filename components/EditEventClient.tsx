"use client";

import { useRouter } from "next/navigation";
import { Event, CreateEventInput } from "@/types/event";
import EventForm from "@/components/EventForm";
import { invalidateEvents } from "@/hooks/useEvents";

interface EditEventClientProps {
  event: Event;
}

export default function EditEventClient({ event }: EditEventClientProps) {
  const router = useRouter();

  const handleSubmit = async (data: CreateEventInput) => {
    const response = await fetch(`/api/events/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      await invalidateEvents();
      router.push("/admin");
    } else {
      throw new Error("Failed to update event");
    }
  };

  return (
    <EventForm
      initialData={event}
      onSubmit={handleSubmit}
      onCancel={() => router.push("/admin")}
      submitLabel="Update Event"
    />
  );
}
