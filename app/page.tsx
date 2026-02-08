"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/event";
import EventFilter from "@/components/EventFilter";
import EventGrid from "@/components/EventGrid";

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
    fetchTags();
  }, [selectedTag]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const url = selectedTag ? `/api/events?tag=${selectedTag}` : "/api/events";
      const response = await fetch(url);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      const response = await fetch("/api/tags");
      const data = await response.json();
      setTags(data);
    } catch (error) {
      console.error("Error fetching tags:", error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>

      <EventFilter
        tags={tags}
        selectedTag={selectedTag}
        onTagChange={setSelectedTag}
      />

      <EventGrid events={events} loading={loading} />
    </div>
  );
}
