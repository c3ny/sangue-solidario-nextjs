export function maskEmail(email: string): string {
  if (!email || typeof email !== "string") {
    return email || "";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return email;
  }

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 1) {
    return email;
  }

  const maskedLocalPart = localPart.charAt(0) + "***";

  return `${maskedLocalPart}@${domain}`;
}

export function maskEmailAggressive(email: string): string {
  if (!email || typeof email !== "string") {
    return email || "";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return email;
  }

  const [, domain] = email.split("@");
  return `***@${domain}`;
}

export function maskEmailCustom(
  email: string,
  pattern: string = "***"
): string {
  if (!email || typeof email !== "string") {
    return email || "";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return email;
  }

  const [localPart, domain] = email.split("@");

  if (localPart.length <= 1) {
    return email;
  }

  const maskedLocalPart = localPart.charAt(0) + pattern;
  return `${maskedLocalPart}@${domain}`;
}

export function isEmailMasked(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }

  const maskedPatterns = [
    /^[a-zA-Z]\*\*\*@/,
    /^\*\*\*@/, // ***@example.com
    /^[a-zA-Z]\.\.\.@/,
    /^\.\.\.@/,
  ];

  return maskedPatterns.some((pattern) => pattern.test(email));
}

export function unmaskEmail(
  maskedEmail: string,
  originalEmail?: string
): string {
  return originalEmail || maskedEmail;
}
