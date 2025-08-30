export interface Expense {
  id: string;
  createdAt: Date;
  date: Date;
  merchant: string;
  notes?: string;
  category: 'מסעדות' | 'אטרקציות' | 'תחבורה' | 'לינה' | 'קניות' | 'אחר';
  amountOriginal: number;
  currencyOriginal: string;
  amountILS: number;
  payer: string;
  hebpayer: string;
  splitType: 'equal' | 'personal';
  isShared: boolean;
  country : string
}

export interface User {
  id: string;
  name: string;
  hebName: string;
  totalPaid: number;
  totalOwed: number;
  netBalance: number;
  color: string;
  picture: string;
  email: string;
}

export interface Trip {
  id: string;
  name: string;
  budget: number;
  totalExpenses: number;
  remainingBudget: number;
}

export interface ExchangeRate {
  currency: string;
  rate: number;

}

export const CURRENCIES = [
  { code: 'ILS', symbol: '₪', name: 'ישראלי שקל' },
  { code: 'JPY', symbol: '¥', name: 'יפני ין' },
  { code: 'KRW', symbol: '₩', name: 'קוריאני וון' },
  { code: 'CNY', symbol: '¥', name: 'סיני יואן' },
  { code: 'HKD', symbol: 'HK$', name: 'הונג קונגי דולר' },
  { code: 'TWD', symbol: 'NT$', name: 'טייוואני דולר' },
  { code: 'THB', symbol: '฿', name: 'תאילנדי באט' },
  { code: 'VND', symbol: '₫', name: 'ויטנאמי דונג' },
  { code: 'PHP', symbol: '₱', name: 'פיליפיני פסו' },
  { code: 'SGD', symbol: 'S$', name: 'סינגפורי דולר' },
  { code: 'MYR', symbol: 'RM', name: 'מלזי רינגיט' },
  { code: 'EUR', symbol: '€', name: 'אורו' },
  { code: 'USD', symbol: '$', name: 'אמריקני דולר' },
] as const;

export const CATEGORIES = [
  { key: 'מסעדות', emoji: '🍜', color: 'bg-orange-100 text-orange-800' },
  { key: 'אטרקציות', emoji: '🎌', color: 'bg-pink-100 text-pink-800' },
  { key: 'תחבורה', emoji: '🚅', color: 'bg-blue-100 text-blue-800' },
  { key: 'לינה', emoji: '🏯', color: 'bg-purple-100 text-purple-800' },
  { key: 'קניות', emoji: '🛍️', color: 'bg-green-100 text-green-800' },
  { key: 'אחר', emoji: '📋', color: 'bg-gray-100 text-gray-800' },
] as const;

export const COUNTRYS = [
  { key: 'ישראל', emoji: '🇮🇱', },
 { key: 'יפן', emoji: '🇯🇵', },
 { key: 'קוריאה', emoji: '🇰🇷', },
 { key: 'סינה', emoji: '🇨🇳', },
 { key: 'טייוואן', emoji: '🇹🇼', },
 { key: 'תאילנד', emoji: '🇹🇭', },
 { key: 'ויטנאם', emoji: '🇻🇳', },
 { key: 'פיליפינה', emoji: '🇵🇭', },
 { key: 'סינגפור', emoji: '🇸🇬', },
 { key: 'קמבודיה', emoji: '🇲🇨', },
 {key: 'לאוס', emoji: '🇧🇪', },

]