export function parseAcceptLanguage(
  header: string | null | undefined
): string[] {
  if (!header) return []
  return header
    .split(',')
    .map((p) => p.split(';')[0].trim())
    .filter(Boolean)
}

function regionFromTag(tag: string): string | null {
  const m = tag.match(/[-_](\w{2})$/)
  return m ? m[1].toUpperCase() : null
}

const REGION_TO_CURRENCY: Record<string, string> = {
  GB: 'GBP',
  UK: 'GBP',
  IE: 'EUR',
  FR: 'EUR',
  DE: 'EUR',
  ES: 'EUR',
  IT: 'EUR',
  PT: 'EUR',
  NL: 'EUR',
  BE: 'EUR',
  LU: 'EUR',
  AT: 'EUR',
  FI: 'EUR',
  GR: 'EUR',
  SK: 'EUR',
  SI: 'EUR',
  LV: 'EUR',
  LT: 'EUR',
  EE: 'EUR',
  CY: 'EUR',
  MT: 'EUR',
  US: 'USD',
  CA: 'CAD',
  AU: 'AUD',
  NZ: 'NZD',
  SG: 'SGD',
  HK: 'HKD',
  JP: 'JPY',
  CN: 'CNY',
  KR: 'KRW',
  IN: 'INR',
  CH: 'CHF',
  NO: 'NOK',
  SE: 'SEK',
  DK: 'DKK',
  IS: 'ISK',
  ZA: 'ZAR',
  BR: 'BRL',
  MX: 'MXN',
  AR: 'ARS',
}

export function defaultCurrencyFromAcceptLanguage(
  header: string | null | undefined
): string {
  const tags = parseAcceptLanguage(header)
  for (const t of tags) {
    const r = regionFromTag(t)
    if (r && REGION_TO_CURRENCY[r]) return REGION_TO_CURRENCY[r]
  }
  return 'GBP'
}
