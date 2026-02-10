import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import NewEventClient from "@/components/NewEventClient";

export default async function NewEventPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Create New Event
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <NewEventClient />
      </div>
    </div>
  );
}
