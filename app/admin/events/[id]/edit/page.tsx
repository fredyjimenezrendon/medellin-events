import { redirect, notFound } from "next/navigation";
import { getSession } from "@/lib/session";
import { getEventById } from "@/lib/events";
import EditEventClient from "@/components/EditEventClient";

interface EditEventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/login");
  }

  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Event</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <EditEventClient event={event} />
      </div>
    </div>
  );
}
