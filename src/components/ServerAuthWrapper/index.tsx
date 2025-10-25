import { redirect } from "next/navigation";
import { getCurrentUser, getAuthToken } from "@/utils/auth";

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
  try {
    // Check authentication on server side
    const user = await getCurrentUser();
    const token = await getAuthToken();

    const isAuthenticated = !!(user && token);

    if (!isAuthenticated) {
      // Redirect to login with current path as redirect parameter
      redirect(`${redirectTo}?redirect=${encodeURIComponent(redirectTo)}`);
    }

    // Return children if authenticated
    return <>{children}</>;
  } catch (error) {
    console.error("Error checking authentication:", error);
    redirect(redirectTo);
  }
}
