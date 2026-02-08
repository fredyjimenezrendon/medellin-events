"use client";

import { useEffect, useState } from "react";
import { Event } from "@/types/event";

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Upcoming Events</h1>

      {tags.length > 0 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by tag:
          </label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Events</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <p className="text-gray-600">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-gray-600">No events found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-4">{event.description}</p>

              {event.location.coordinates && (
                <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    width="100%"
                    height="200"
                    style={{ border: 0 }}
                    src={`https://maps.google.com/maps?q=${event.location.coordinates.lat},${event.location.coordinates.lng}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map of ${event.location.address}`}
                  />
                </div>
              )}

              <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(event.date)}
              </div>
              <div className="flex items-start text-sm text-gray-500 mb-3">
                <svg
                  className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div className="flex-1">
                  {event.location.coordinates ? (
                    <a
                      href={`https://www.google.com/maps?q=${event.location.coordinates.lat},${event.location.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {event.location.address}
                    </a>
                  ) : (
                    <span>{event.location.address}</span>
                  )}
                </div>
              </div>
              {event.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
