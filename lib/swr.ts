export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.");
  }
  return res.json();
};

export const SWR_KEYS = {
  events: "/api/events",
  tags: "/api/tags",
  eventsByTag: (tag: string) => `/api/events?tag=${tag}`,
  eventById: (id: string) => `/api/events/${id}`,
} as const;
