"use client";

import { useState } from "react";
import { Event, CreateEventInput } from "@/types/event";
import LocationPicker from "./LocationPicker";

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: CreateEventInput) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function EventForm({
  initialData,
  onSubmit,
  onCancel,
  submitLabel = "Save Event",
}: EventFormProps) {
  const [formData, setFormData] = useState<CreateEventInput>(
    initialData
      ? {
          title: initialData.title,
          description: initialData.description,
          date: initialData.date,
          location: initialData.location,
          tags: initialData.tags,
        }
      : {
          title: "",
          description: "",
          date: "",
          location: { address: "" },
          tags: [],
        }
  );
  const [tagInput, setTagInput] = useState("");
  const [loading, setLoading] = useState(false);

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Title
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          rows={4}
          required
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={loading}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location Address
        </label>
        <input
          type="text"
          value={formData.location.address}
          onChange={(e) =>
            setFormData({
              ...formData,
              location: { ...formData.location, address: e.target.value },
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., 123 Main St, City, Country"
          required
          disabled={loading}
        />
        <p className="mt-1 text-sm text-gray-500">
          Enter the full address where the event will take place
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Location on Map (Optional)
        </label>
        <LocationPicker
          onLocationSelect={(lat, lng) => {
            setFormData({
              ...formData,
              location: {
                ...formData.location,
                coordinates: lat && lng ? { lat, lng } : undefined,
              },
            });
          }}
          initialLat={formData.location.coordinates?.lat}
          initialLng={formData.location.coordinates?.lng}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a tag"
            disabled={loading}
          />
          <button
            type="button"
            onClick={addTag}
            className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
            disabled={loading}
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-2 text-blue-600 hover:text-blue-800"
                disabled={loading}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
