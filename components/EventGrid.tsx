import { Event } from "@/types/event";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";

interface EventGridProps {
  events: Event[];
  loading: boolean;
}

export default function EventGrid({ events, loading }: EventGridProps) {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return <p className="text-gray-600">No events found.</p>;
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
