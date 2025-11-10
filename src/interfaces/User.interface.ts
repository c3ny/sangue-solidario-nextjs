/**
 * Authenticated user interface
 * Represents a logged-in user with full details
 */
export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  bloodType?: string;
  type?: string;
  personType?: string;
  avatarPath?: string | null;
}

/**
 * Type guard to check if user has required authentication properties
 */
export function isAuthUser(user: any): user is IAuthUser {
  return (
    user &&
    typeof user.id === "string" &&
    typeof user.name === "string" &&
    typeof user.email === "string"
  );
}
