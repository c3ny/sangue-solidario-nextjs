/**
 * Authenticated user interface
 * Represents a logged-in user with full details
 */
export interface IAuthUser {
  id: number;
  name: string;
  email: string;
  bloodType?: string;
  type?: string;
  personType?: string;
}

/**
 * Type guard to check if user has required authentication properties
 */
export function isAuthUser(user: any): user is IAuthUser {
  return (
    user &&
    typeof user.id === "number" &&
    typeof user.name === "string" &&
    typeof user.email === "string"
  );
}
