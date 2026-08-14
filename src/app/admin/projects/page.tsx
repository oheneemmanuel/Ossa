import { auth } from "@/auth.config";
import { redirect } from "next/navigation";
import ProjectsTable from "@/components/ui/admin/ProjectsTable";

export default async function ProjectsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return <ProjectsTable />;
}