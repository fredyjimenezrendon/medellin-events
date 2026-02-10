"use client";

import useSWR, { mutate } from "swr";
import { Event } from "@/types/event";
import { SWR_KEYS } from "@/lib/swr";

export function useEvents(tag?: string, fallbackData?: Event[]) {
  const key = tag ? SWR_KEYS.eventsByTag(tag) : SWR_KEYS.events;

  return useSWR<Event[]>(key, {
    fallbackData,
    revalidateOnMount: !fallbackData,
  });
}

export function useTags(fallbackData?: string[]) {
  return useSWR<string[]>(SWR_KEYS.tags, {
    fallbackData,
    revalidateOnMount: !fallbackData,
  });
}

export function useEvent(id: string, fallbackData?: Event) {
  return useSWR<Event>(SWR_KEYS.eventById(id), {
    fallbackData,
    revalidateOnMount: !fallbackData,
  });
}

export async function invalidateEvents() {
  await mutate(
    (key) => typeof key === "string" && key.startsWith("/api/events"),
    undefined,
    { revalidate: true }
  );
  await mutate(SWR_KEYS.tags, undefined, { revalidate: true });
}
