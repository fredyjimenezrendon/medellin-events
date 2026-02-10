import { getAllEvents, getAllTags } from "@/lib/events";
import EventsPageClient from "@/components/EventsPageClient";

export default async function Home() {
  const [events, tags] = await Promise.all([getAllEvents(), getAllTags()]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Upcoming Events
      </h1>
      <EventsPageClient initialEvents={events} initialTags={tags} />
    </div>
  );
}
