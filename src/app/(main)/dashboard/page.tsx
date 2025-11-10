import { redirect } from "next/navigation";
import { getCurrentUser } from "@/utils/auth";
import { DashboardClient } from "@/app/(main)/dashboard/DashboardClient";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  if (user.personType !== "COMPANY") {
    redirect("/");
  }

  return <DashboardClient userId={user.id} />;
}
