import { create } from 'zustand';
import { Expense, Trip, User, ExchangeRate } from '@/types';

interface AppState {
  trip: Trip;
  users: User[];
  expenses: Expense[];
  exchangeRates: ExchangeRate[];
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'amountILS' | 'isShared'>) => void;
  updateTrip: (trip: Partial<Trip>) => void;
  updateExchangeRate: (currency: string, rate: number) => void;
  calculateBalances: () => void;
}

// Mock exchange rates
const mockRates: ExchangeRate[] = [
  { currency: 'JPY', rate: 0.024, lastUpdated: new Date() },
  { currency: 'KRW', rate: 0.0027, lastUpdated: new Date() },
  { currency: 'CNY', rate: 0.50, lastUpdated: new Date() },
  { currency: 'HKD', rate: 0.47, lastUpdated: new Date() },
  { currency: 'TWD', rate: 0.11, lastUpdated: new Date() },
  { currency: 'THB', rate: 0.10, lastUpdated: new Date() },
  { currency: 'VND', rate: 0.00014, lastUpdated: new Date() },
  { currency: 'PHP', rate: 0.063, lastUpdated: new Date() },
  { currency: 'SGD', rate: 2.65, lastUpdated: new Date() },
  { currency: 'MYR', rate: 0.81, lastUpdated: new Date() },
  { currency: 'IDR', rate: 0.00024, lastUpdated: new Date() },
];

// Mock expenses
const mockExpenses: Expense[] = [
  {
    id: '1',
    createdAt: new Date('2024-12-01'),
    date: new Date('2024-12-01'),
    merchant: 'רמן איצ׳ירן - טוקיו',
    category: 'מסעדות',
    amountOriginal: 2400,
    currencyOriginal: 'JPY',
    amountILS: 58,
    payer: 'Omri',
    splitType: 'equal',
    isShared: true,
    notes: 'ארוחת צהריים טעימה'
  },
  {
    id: '2',
    createdAt: new Date('2024-12-02'),
    date: new Date('2024-12-02'),
    merchant: 'JR יאמנוטה ליין',
    category: 'תחבורה',
    amountOriginal: 160,
    currencyOriginal: 'JPY',
    amountILS: 4,
    payer: 'Noa',
    splitType: 'equal',
    isShared: true,
  },
  {
    id: '3',
    createdAt: new Date('2024-12-03'),
    date: new Date('2024-12-03'),
    merchant: 'אוניקלו שיבויה',
    category: 'קניות',
    amountOriginal: 5500,
    currencyOriginal: 'JPY',
    amountILS: 132,
    payer: 'Noa',
    splitType: 'personal',
    isShared: false,
    notes: 'חולצות חורף'
  },
  {
    id: '4',
    createdAt: new Date('2024-12-04'),
    date: new Date('2024-12-04'),
    merchant: 'טוקיו סקאיטרי',
    category: 'אטרקציות',
    amountOriginal: 3100,
    currencyOriginal: 'JPY',
    amountILS: 74,
    payer: 'Omri',
    splitType: 'equal',
    isShared: true,
  }
];

export const useStore = create<AppState>((set, get) => ({
  trip: {
    id: '1',
    name: 'יפן 2025-2026',
    budget: 70000,
    totalExpenses: 268,
    remainingBudget: 69732
  },
  
  users: [
    { id: '1', name: 'Omri', totalPaid: 132, totalOwed: 66, netBalance: 66 },
    { id: '2', name: 'Noa', totalPaid: 136, totalOwed: 70, netBalance: 66 }
  ],
  
  expenses: mockExpenses,
  exchangeRates: mockRates,

  addExpense: (expenseData) => {
    const state = get();
    const rate = state.exchangeRates.find(r => r.currency === expenseData.currencyOriginal)?.rate || 1;
    const amountILS = expenseData.currencyOriginal === 'ILS' ? expenseData.amountOriginal : expenseData.amountOriginal * rate;
    
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date(),
      amountILS: Math.round(amountILS),
      isShared: expenseData.splitType === 'equal'
    };

    set(state => ({
      expenses: [...state.expenses, expense]
    }));

    get().calculateBalances();
  },

  updateTrip: (tripData) => {
    set(state => ({
      trip: { ...state.trip, ...tripData }
    }));
  },

  updateExchangeRate: (currency, rate) => {
    set(state => ({
      exchangeRates: state.exchangeRates.map(r => 
        r.currency === currency ? { ...r, rate, lastUpdated: new Date() } : r
      )
    }));
  },

  calculateBalances: () => {
    const state = get();
    const { expenses } = state;
    
    const omriStats = { totalPaid: 0, totalOwed: 0 };
    const noaStats = { totalPaid: 0, totalOwed: 0 };
    
    let totalSharedExpenses = 0;

    expenses.forEach(expense => {
      if (expense.payer === 'Omri') {
        omriStats.totalPaid += expense.amountILS;
      } else {
        noaStats.totalPaid += expense.amountILS;
      }

      if (expense.isShared) {
        totalSharedExpenses += expense.amountILS;
      }
    });

    // Calculate what each person owes (50% of shared expenses)
    const sharedPerPerson = totalSharedExpenses / 2;
    omriStats.totalOwed = sharedPerPerson;
    noaStats.totalOwed = sharedPerPerson;

    const totalExpenses = omriStats.totalPaid + noaStats.totalPaid;

    set(state => ({
      users: [
        { 
          id: '1', 
          name: 'Omri', 
          totalPaid: omriStats.totalPaid, 
          totalOwed: omriStats.totalOwed,
          netBalance: omriStats.totalPaid - omriStats.totalOwed
        },
        { 
          id: '2', 
          name: 'Noa', 
          totalPaid: noaStats.totalPaid, 
          totalOwed: noaStats.totalOwed,
          netBalance: noaStats.totalPaid - noaStats.totalOwed
        }
      ],
      trip: {
        ...state.trip,
        totalExpenses,
        remainingBudget: state.trip.budget - totalExpenses
      }
    }));
  }
}));