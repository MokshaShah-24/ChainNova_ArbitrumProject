export type Theme = 'light' | 'dark';

export interface CryptoCoin {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  high_24h?: number;
  low_24h?: number;
  market_cap?: number;
  total_volume?: number;
}

export interface BlockData {
  index: number;
  data: string;
  previousHash: string;
  nonce: number;
  hash: string;
  isValid: boolean;
  isMining: boolean;
  miningTime: number; // in ms
}

export interface ConceptComparison {
  id: string;
  title: string;
  iconName: 'web' | 'currency' | 'key' | 'database';
  badge: string;
  desc: string;
  web2Title: string;
  web2Desc: string;
  web2Color: string;
  web3Title: string;
  web3Desc: string;
  web3Color: string;
  learnMoreText: string;
  bullets: string[];
}
