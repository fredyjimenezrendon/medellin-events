"use client";

interface EventFilterProps {
  tags: string[];
  selectedTag: string;
  onTagChange: (tag: string) => void;
}

export default function EventFilter({
  tags,
  selectedTag,
  onTagChange,
}: EventFilterProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Filter by tag:
      </label>
      <select
        value={selectedTag}
        onChange={(e) => onTagChange(e.target.value)}
        className="block w-full md:w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">All Events</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    </div>
  );
}
