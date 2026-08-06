import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const session = await getAuthSession();
  if (session) redirect("/dashboard");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-3xl font-bold">Dealership SaaS</h1>
      <p className="max-w-md text-gray-600">
        Replace spreadsheets with a single, secure workspace for your dealership&apos;s inventory and daily
        workflow.
      </p>
      <div className="flex gap-3">
        <a href="/signup">
          <Button>Get started</Button>
        </a>
        <a href="/login">
          <Button variant="secondary">Log in</Button>
        </a>
      </div>
    </main>
  );
}
