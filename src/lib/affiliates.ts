export type Network = 'amazon' | 'awin' | 'impact' | 'cj' | 'rakuten'

export type Shop = {
  id: string
  name: string
  network: Network
  programId?: string
  baseUrl: string
  affiliateParam?: string
}

export const shops: Shop[] = [
  {
    id: 'amazon-uk',
    name: 'Amazon UK',
    network: 'amazon',
    baseUrl: 'https://www.amazon.co.uk',
    affiliateParam: 'tag=YOURTAG-21',
  },
  {
    id: 'john-lewis',
    name: 'John Lewis',
    network: 'awin',
    baseUrl: 'https://www.johnlewis.com',
    programId: '12345',
  },
  {
    id: 'argoss',
    name: 'Argos',
    network: 'impact',
    baseUrl: 'https://www.argos.co.uk',
    programId: '99999',
  },
]
