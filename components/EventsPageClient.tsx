"use client";

import { useState } from "react";
import { Event } from "@/types/event";
import { useEvents, useTags } from "@/hooks/useEvents";
import EventFilter from "@/components/EventFilter";
import EventGrid from "@/components/EventGrid";

interface EventsPageClientProps {
  initialEvents: Event[];
  initialTags: string[];
}

export default function EventsPageClient({
  initialEvents,
  initialTags,
}: EventsPageClientProps) {
  const [selectedTag, setSelectedTag] = useState("");

  const { data: events, isLoading } = useEvents(
    selectedTag || undefined,
    selectedTag ? undefined : initialEvents
  );
  const { data: tags } = useTags(initialTags);

  return (
    <>
      <EventFilter
        tags={tags || initialTags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />
      <EventGrid events={events || []} loading={isLoading} />
    </>
  );
}
