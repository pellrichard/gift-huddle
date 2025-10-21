export function parseAcceptLanguage(header: string | null | undefined): string[] {
  if (!header) return [];
  // Simple parse: split by comma, strip q= weights
  return header.split(',').map(p => p.split(';')[0].trim()).filter(Boolean);
}

export function defaultCurrencyFromAcceptLanguage(header: string | null | undefined): string {
  const tags = parseAcceptLanguage(header);
  // Prefer GBP if any tag includes region GB / UK
  if (tags.some(t => /-GB\b/i.test(t) || /\bGB\b/i.test(t) || /-UK\b/i.test(t))) return "GBP";
  // US → USD
  if (tags.some(t => /-US\b/i.test(t))) return "USD";
  // Otherwise fallback to GBP per project preference
  return "GBP";
}
