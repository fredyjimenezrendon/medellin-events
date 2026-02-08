import { CreateEventInput, UpdateEventInput, Location } from "@/types/event";

export interface ValidationError {
  field: string;
  message: string;
}

export class ValidationException extends Error {
  constructor(public errors: ValidationError[]) {
    super("Validation failed");
    this.name = "ValidationException";
  }
}

// Sanitize string input - remove potential XSS
export function sanitizeString(input: any, maxLength: number = 1000): string {
  if (typeof input !== "string") {
    throw new ValidationException([{ field: "input", message: "Must be a string" }]);
  }

  // Trim and limit length
  const sanitized = input.trim().slice(0, maxLength);

  // Check for empty after trimming
  if (sanitized.length === 0) {
    throw new ValidationException([{ field: "input", message: "Cannot be empty" }]);
  }

  return sanitized;
}

// Validate and sanitize tag
export function sanitizeTag(tag: any): string {
  if (typeof tag !== "string") {
    throw new ValidationException([{ field: "tag", message: "Tag must be a string" }]);
  }

  const sanitized = tag.trim().toLowerCase().slice(0, 50);

  if (sanitized.length === 0) {
    throw new ValidationException([{ field: "tag", message: "Tag cannot be empty" }]);
  }

  // Tags should only contain alphanumeric, hyphens, and underscores
  if (!/^[a-z0-9_-]+$/.test(sanitized)) {
    throw new ValidationException([
      { field: "tag", message: "Tags can only contain letters, numbers, hyphens, and underscores" }
    ]);
  }

  return sanitized;
}

// Validate date string
export function validateDate(dateStr: string): string {
  const date = new Date(dateStr);

  if (isNaN(date.getTime())) {
    throw new ValidationException([{ field: "date", message: "Invalid date format" }]);
  }

  // Return ISO string for consistency
  return date.toISOString();
}

// Validate location
export function validateLocation(location: any): Location {
  const errors: ValidationError[] = [];

  // Check if location object exists
  if (!location || typeof location !== "object") {
    throw new ValidationException([{ field: "location", message: "Location is required" }]);
  }

  // Validate address
  let address: string;
  try {
    if (!location.address) {
      errors.push({ field: "location.address", message: "Address is required" });
      address = "";
    } else {
      address = sanitizeString(location.address, 500);
    }
  } catch (e) {
    if (e instanceof ValidationException) {
      errors.push({ field: "location.address", message: e.errors[0].message });
    }
    address = "";
  }

  // Validate coordinates if provided
  let coordinates: { lat: number; lng: number } | undefined;
  if (location.coordinates) {
    if (typeof location.coordinates !== "object") {
      errors.push({ field: "location.coordinates", message: "Coordinates must be an object" });
    } else {
      const { lat, lng } = location.coordinates;

      // Validate latitude
      if (lat !== undefined) {
        const latNum = Number(lat);
        if (isNaN(latNum) || latNum < -90 || latNum > 90) {
          errors.push({ field: "location.coordinates.lat", message: "Latitude must be between -90 and 90" });
        } else {
          // Validate longitude
          if (lng !== undefined) {
            const lngNum = Number(lng);
            if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
              errors.push({ field: "location.coordinates.lng", message: "Longitude must be between -180 and 180" });
            } else {
              coordinates = { lat: latNum, lng: lngNum };
            }
          }
        }
      }
    }
  }

  // Validate placeId if provided
  let placeId: string | undefined;
  if (location.placeId) {
    if (typeof location.placeId !== "string") {
      errors.push({ field: "location.placeId", message: "Place ID must be a string" });
    } else {
      placeId = location.placeId.trim().slice(0, 200);
    }
  }

  if (errors.length > 0) {
    throw new ValidationException(errors);
  }

  return { address, coordinates, placeId };
}

// Validate event creation input
export function validateCreateEvent(input: any): CreateEventInput {
  const errors: ValidationError[] = [];

  // Validate title
  let title: string;
  try {
    if (!input.title) {
      errors.push({ field: "title", message: "Title is required" });
      title = "";
    } else {
      title = sanitizeString(input.title, 200);
    }
  } catch (e) {
    if (e instanceof ValidationException) {
      errors.push({ field: "title", message: e.errors[0].message });
    }
    title = "";
  }

  // Validate description
  let description: string;
  try {
    if (!input.description) {
      errors.push({ field: "description", message: "Description is required" });
      description = "";
    } else {
      description = sanitizeString(input.description, 5000);
    }
  } catch (e) {
    if (e instanceof ValidationException) {
      errors.push({ field: "description", message: e.errors[0].message });
    }
    description = "";
  }

  // Validate date
  let date: string;
  try {
    if (!input.date) {
      errors.push({ field: "date", message: "Date is required" });
      date = "";
    } else {
      date = validateDate(input.date);
    }
  } catch (e) {
    if (e instanceof ValidationException) {
      errors.push({ field: "date", message: e.errors[0].message });
    }
    date = "";
  }

  // Validate location
  let location: Location = { address: "" };
  try {
    location = validateLocation(input.location);
  } catch (e) {
    if (e instanceof ValidationException) {
      errors.push(...e.errors);
    }
  }

  // Validate tags
  let tags: string[] = [];
  if (input.tags) {
    if (!Array.isArray(input.tags)) {
      errors.push({ field: "tags", message: "Tags must be an array" });
    } else if (input.tags.length > 20) {
      errors.push({ field: "tags", message: "Maximum 20 tags allowed" });
    } else {
      try {
        tags = input.tags.map((tag: any) => sanitizeTag(tag));
        // Remove duplicates
        tags = Array.from(new Set(tags));
      } catch (e) {
        if (e instanceof ValidationException) {
          errors.push({ field: "tags", message: e.errors[0].message });
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationException(errors);
  }

  return { title, description, date, location, tags };
}

// Validate event update input
export function validateUpdateEvent(input: any): UpdateEventInput {
  const errors: ValidationError[] = [];
  const update: UpdateEventInput = {};

  // Validate title if provided
  if (input.title !== undefined) {
    try {
      update.title = sanitizeString(input.title, 200);
    } catch (e) {
      if (e instanceof ValidationException) {
        errors.push({ field: "title", message: e.errors[0].message });
      }
    }
  }

  // Validate description if provided
  if (input.description !== undefined) {
    try {
      update.description = sanitizeString(input.description, 5000);
    } catch (e) {
      if (e instanceof ValidationException) {
        errors.push({ field: "description", message: e.errors[0].message });
      }
    }
  }

  // Validate date if provided
  if (input.date !== undefined) {
    try {
      update.date = validateDate(input.date);
    } catch (e) {
      if (e instanceof ValidationException) {
        errors.push({ field: "date", message: e.errors[0].message });
      }
    }
  }

  // Validate location if provided
  if (input.location !== undefined) {
    try {
      update.location = validateLocation(input.location);
    } catch (e) {
      if (e instanceof ValidationException) {
        errors.push(...e.errors);
      }
    }
  }

  // Validate tags if provided
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.push({ field: "tags", message: "Tags must be an array" });
    } else if (input.tags.length > 20) {
      errors.push({ field: "tags", message: "Maximum 20 tags allowed" });
    } else {
      try {
        update.tags = input.tags.map((tag: any) => sanitizeTag(tag));
        // Remove duplicates
        update.tags = Array.from(new Set(update.tags));
      } catch (e) {
        if (e instanceof ValidationException) {
          errors.push({ field: "tags", message: e.errors[0].message });
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new ValidationException(errors);
  }

  return update;
}
