import { Event } from "@/types/event";
import { formatDate } from "@/lib/date";
import CalendarIcon from "./icons/CalendarIcon";
import LocationIcon from "./icons/LocationIcon";

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
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
        <CalendarIcon className="w-4 h-4 mr-2" />
        {formatDate(event.date)}
      </div>

      <div className="flex items-start text-sm text-gray-500 mb-3">
        <LocationIcon className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
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
  );
}
