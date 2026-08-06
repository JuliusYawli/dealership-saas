import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { NavBar } from "@/components/nav-bar";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");

  const dealership = await db.dealership.findUnique({
    where: { id: session.user.dealershipId },
    select: { name: true }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar dealershipName={dealership?.name ?? "Dealership"} userName={session.user.name ?? session.user.email ?? ""} />
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
