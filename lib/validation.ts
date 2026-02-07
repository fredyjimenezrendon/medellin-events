import { CreateEventInput, UpdateEventInput } from "@/types/event";

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
export function sanitizeString(input: string, maxLength: number = 1000): string {
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
export function sanitizeTag(tag: string): string {
  const sanitized = tag.trim().toLowerCase().slice(0, 50);

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

  // Validate tags
  let tags: string[] = [];
  if (input.tags) {
    if (!Array.isArray(input.tags)) {
      errors.push({ field: "tags", message: "Tags must be an array" });
    } else if (input.tags.length > 20) {
      errors.push({ field: "tags", message: "Maximum 20 tags allowed" });
    } else {
      try {
        tags = input.tags.map((tag: any) => sanitizeTag(String(tag)));
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

  return { title, description, date, tags };
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

  // Validate tags if provided
  if (input.tags !== undefined) {
    if (!Array.isArray(input.tags)) {
      errors.push({ field: "tags", message: "Tags must be an array" });
    } else if (input.tags.length > 20) {
      errors.push({ field: "tags", message: "Maximum 20 tags allowed" });
    } else {
      try {
        update.tags = input.tags.map((tag: any) => sanitizeTag(String(tag)));
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
