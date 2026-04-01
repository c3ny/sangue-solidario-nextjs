import { redirect } from "next/navigation";
import { getCurrentUser, getAuthToken } from "@/utils/auth";
import { logger } from "@/utils/logger";

interface ServerAuthWrapperProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Server-side authentication wrapper component
 * This component checks if the user is authenticated on the server side
 * Use this for server components that need authentication
 */
export async function ServerAuthWrapper({
  children,
  redirectTo = "/login",
}: ServerAuthWrapperProps) {
  let user = null;
  let token = null;

  try {
    user = await getCurrentUser();
    token = await getAuthToken();
  } catch (error) {
    logger.error("Error checking authentication:", error);
  }

  if (!user || !token) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
