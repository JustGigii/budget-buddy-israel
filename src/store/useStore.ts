import { create } from 'zustand';
import { Expense, Trip, User, ExchangeRate } from '@/types';
import axios from 'axios';


interface AppState {
  trip: Trip;
  users: User[];
  expenses: Expense[];
  exchangeRates: ExchangeRate[];
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'amountILS' | 'isShared'>) => void;
  deleteExpense: (expenseId: string) => void;
  updateTrip: (trip: Partial<Trip>) => void;
  updateExchangeRate: (currency: string, rate: number) => void;
  calculateBalances: () => void;
}




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
    amountILS: 5800,
    payer: 'Omri',
    hebpayer: 'עמרי',
    splitType: 'equal',
    isShared: true,
    notes: 'ארוחת צהריים טעימה'
  },
  //   {
  //   id: '2',
  //   createdAt: new Date('2024-12-01'),
  //   date: new Date('2024-12-01'),
  //   merchant: 'רמן איצ׳ירן - טוקיו',
  //   category: 'מסעדות',
  //   amountOriginal: 24000,
  //   currencyOriginal: 'JPY',
  //   amountILS: 588,
  //   payer: 'noa',
  //   splitType: 'equal',
  //   isShared: true,
  //   notes: 'ארוחת צהריים טעימה'
  // },
  
];

export const useStore = create<AppState>((set, get) => ({
  
  trip: {
    id: '1',
    name: 'טיול גודל',
    budget: 70000,
    totalExpenses: 268,
    remainingBudget: 69732
  },
  
  users: [
    { id: '1', name: '',hebName: '',  totalPaid: 0, totalOwed: 0, netBalance: 0,color: 'primary' },
    { id: '2', name: '',hebName: '',  totalPaid: 0, totalOwed: 0, netBalance: 0,color: 'accent' },
  ],
  
  expenses: mockExpenses,
  exchangeRates:exchangerate() ,

  addExpense: (expenseData) => {
    const state = get();
    const rate = state.exchangeRates.find(r => r.currency === expenseData.currencyOriginal)?.rate || 1;
    const amountILS = expenseData.currencyOriginal === 'ils' ? expenseData.amountOriginal : expenseData.amountOriginal * rate;
    
    const expense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date(),
      amountILS: Math.round(amountILS),
      isShared: expenseData.splitType === 'equal',
      hebpayer: expenseData.payer === 'Omri' ? 'עמרי' : 'נועה'
    };

    set(state => ({
      expenses: [...state.expenses, expense]
    }));

    get().calculateBalances();
  },

  deleteExpense: (expenseId) => {
    set(state => ({
      expenses: state.expenses.filter(expense => expense.id !== expenseId)
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
        if (expense.isShared)
           omriStats.totalOwed += expense.amountILS;
      } else {
        noaStats.totalPaid += expense.amountILS;
            if (expense.isShared)
         noaStats.totalOwed += expense.amountILS;
 
      }


    });

    // Calculate what each person owes (50% of shared expenses)
   


    const totalExpenses = omriStats.totalPaid + noaStats.totalPaid;

    set(state => ({
      users: [
        { 
          id: '1', 
          name: 'Omri',
          hebName: 'עמרי', 
          totalPaid: omriStats.totalPaid, 
          totalOwed: omriStats.totalOwed,
          netBalance: omriStats.totalOwed-noaStats.totalOwed  > 0 ? omriStats.totalOwed- noaStats.totalOwed  : 0,
          color : 'primary'
        },
        { 
          id: '2', 
          name: 'Noa',
          hebName: 'נועה', 
          totalPaid: noaStats.totalPaid, 
          totalOwed: noaStats.totalOwed,
          netBalance: noaStats.totalOwed- omriStats.totalOwed > 0 ? (noaStats.totalOwed- omriStats.totalOwed) : 0,
          color : 'accent'
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

function exchangerate(): ExchangeRate[] {
   let rate = [];

  const contry = ['JPY','KRW','CNY','HKD','TWD','THB','VND','PHP','SGD','MYR','IDR','EUR','USD','ILS'];
      axios.get('https://latest.currency-api.pages.dev/v1/currencies/ils.json').then(res => {
              contry.forEach(element => {
                rate.push({currency:element,rate:1/res.data.ils[element.toLowerCase()]})
        })
      })

   return rate;
   }

