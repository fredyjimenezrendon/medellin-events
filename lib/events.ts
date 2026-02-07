import { redis } from "./redis";
import { Event, CreateEventInput, UpdateEventInput } from "@/types/event";

const EVENTS_KEY = "events";
const EVENT_ID_COUNTER = "event:id:counter";

export async function createEvent(input: CreateEventInput): Promise<Event> {
  const id = await redis.incr(EVENT_ID_COUNTER);
  const eventId = `event:${id}`;

  const now = new Date().toISOString();
  const event: Event = {
    id: eventId,
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await redis.hset(EVENTS_KEY, { [eventId]: event });

  // Index by tags
  for (const tag of input.tags) {
    await redis.sadd(`tag:${tag}`, eventId);
  }

  // Index by date
  await redis.zadd(`events:by:date`, { score: new Date(input.date).getTime(), member: eventId });

  return event;
}

export async function getAllEvents(): Promise<Event[]> {
  const eventsData = await redis.hgetall<Record<string, Event>>(EVENTS_KEY);

  if (!eventsData) {
    return [];
  }

  const events = Object.values(eventsData)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return events;
}

export async function getEventById(id: string): Promise<Event | null> {
  const event = await redis.hget<Event>(EVENTS_KEY, id);

  if (!event) {
    return null;
  }

  return event;
}

export async function updateEvent(id: string, updates: UpdateEventInput): Promise<Event | null> {
  const event = await getEventById(id);

  if (!event) {
    return null;
  }

  // If tags are being updated, update the tag indexes
  if (updates.tags) {
    // Remove from old tag indexes
    for (const tag of event.tags) {
      await redis.srem(`tag:${tag}`, id);
    }

    // Add to new tag indexes
    for (const tag of updates.tags) {
      await redis.sadd(`tag:${tag}`, id);
    }
  }

  // If date is being updated, update the date index
  if (updates.date) {
    await redis.zadd(`events:by:date`, { score: new Date(updates.date).getTime(), member: id });
  }

  const updatedEvent: Event = {
    ...event,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  await redis.hset(EVENTS_KEY, { [id]: updatedEvent });

  return updatedEvent;
}

export async function deleteEvent(id: string): Promise<boolean> {
  const event = await getEventById(id);

  if (!event) {
    return false;
  }

  // Remove from tag indexes
  for (const tag of event.tags) {
    await redis.srem(`tag:${tag}`, id);
  }

  // Remove from date index
  await redis.zrem(`events:by:date`, id);

  // Remove the event itself
  await redis.hdel(EVENTS_KEY, id);

  return true;
}

export async function getEventsByTag(tag: string): Promise<Event[]> {
  const eventIds = await redis.smembers(`tag:${tag}`);

  if (!eventIds || eventIds.length === 0) {
    return [];
  }

  const events = await Promise.all(
    eventIds.map(id => getEventById(id as string))
  );

  return events
    .filter((event): event is Event => event !== null)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

export async function getEventsByDateRange(startDate: string, endDate: string): Promise<Event[]> {
  const eventIds = await redis.zrange(
    `events:by:date`,
    new Date(startDate).getTime(),
    new Date(endDate).getTime(),
    { byScore: true }
  );

  if (!eventIds || eventIds.length === 0) {
    return [];
  }

  const events = await Promise.all(
    eventIds.map(id => getEventById(id as string))
  );

  return events.filter((event): event is Event => event !== null);
}

export async function getAllTags(): Promise<string[]> {
  const events = await getAllEvents();
  const tagsSet = new Set<string>();

  events.forEach(event => {
    event.tags.forEach(tag => tagsSet.add(tag));
  });

  return Array.from(tagsSet).sort();
}
