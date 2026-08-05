import {auth} from "@/auth.config";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session =  await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
    

      <main className="flex-1 p-6 md:ml-0">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-gray-900">Hi, {session.user.firstName}</h1>
          <p className="mt-2 text-sm text-gray-600">
            Your dashboard overview will appear here.
          </p>
        </div>
      </main>
    </div>
  );
}