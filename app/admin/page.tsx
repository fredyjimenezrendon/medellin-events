import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getAllEvents } from "@/lib/events";
import AdminEventsClient from "@/components/AdminEventsClient";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/login");
  }

  const events = await getAllEvents();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AdminEventsClient initialEvents={events} />
    </div>
  );
}
