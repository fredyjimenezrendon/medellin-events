import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { createEvent, getAllEvents, getEventsByTag, getEventsByDateRange } from "@/lib/events";
import { validateCreateEvent, ValidationException } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    let events;

    if (tag) {
      // Sanitize tag input
      const sanitizedTag = tag.trim().toLowerCase().slice(0, 50);
      events = await getEventsByTag(sanitizedTag);
    } else if (startDate && endDate) {
      events = await getEventsByDateRange(startDate, endDate);
    } else {
      events = await getAllEvents();
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isAdmin) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate and sanitize input
    const validatedInput = validateCreateEvent(body);

    const event = await createEvent(validatedInput);

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationException) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
