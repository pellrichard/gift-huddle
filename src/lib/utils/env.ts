export const REQUIRED_ENV = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NEXT_PUBLIC_PLAUSIBLE_DOMAIN",
  "NEXT_PUBLIC_FACEBOOK_URL",
  "NEXT_PUBLIC_LINKEDIN_URL",
];

export function getMissingEnv(): string[] {
  return REQUIRED_ENV.filter((k) => !process.env[k] || String(process.env[k]).trim() === "");
}
