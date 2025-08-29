// src/store/useStore.ts
import { create } from 'zustand';
import { Expense, Trip, User, ExchangeRate } from '@/types';
import { db } from '@/lib/firebase';
import {
  collection, doc, onSnapshot, addDoc, deleteDoc, updateDoc, setDoc,
  serverTimestamp, Timestamp, query, orderBy
} from 'firebase/firestore';

interface AppState {
  trip: Trip;
  users: User[];
  expenses: Expense[];
  exchangeRates: ExchangeRate[];

  // Actions
  init: (tripId: string) => () => void; // מחזיר unsubscribe
  addExpense: (tripId: string, expense: Omit<Expense, 'id' | 'createdAt' | 'amountILS' | 'isShared'>) => Promise<void>;
  deleteExpense: (tripId: string, expenseId: string) => Promise<void>;
  updateTrip: (tripId: string, trip: Partial<Trip>) => Promise<void>;
  updateExchangeRate: (currency: string, rate: number) => Promise<void>;
  calculateBalances: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  trip: { id: '', name: '', budget: 0, totalExpenses: 0, remainingBudget: 0 },
  users: [],
  expenses: [],
  exchangeRates: [],

  // 1) התחברות ל־onSnapshot (טריפ, יוזרים, הוצאות, שערים)
  init: (tripId: string) => {
    const tripRef = doc(db, 'trips', tripId);
    const usersRef = collection(db, 'trips', tripId, 'users');
    const expensesRef = collection(db, 'trips', tripId, 'expenses');
    const ratesRef = doc(db, 'exchangeRates', 'ILS');

    const unsubTrip = onSnapshot(tripRef, (snap) => {
      const data = snap.data();
      if (data) {
        set((state) => ({
          trip: {
            id: tripId,
            name: data.name || state.trip.name,
            budget: data.budget ?? state.trip.budget,
            totalExpenses: data.totalExpenses ?? state.trip.totalExpenses,
            remainingBudget: data.remainingBudget ?? state.trip.remainingBudget,
          }
        }));
      }
    });

    const unsubUsers = onSnapshot(usersRef, (snap) => {
      const users: User[] = [];
      snap.forEach((doc) => {
        const d = doc.data() as any;
        users.push({
          id: doc.id,
          name: d.name || '',
          hebName: d.hebName || '',
          totalPaid: d.totalPaid || 0,      // אפשר להשאיר 0 ולחשב בצד לקוח
          totalOwed: d.totalOwed || 0,      // כנ"ל
          netBalance: d.netBalance || 0,    // כנ"ל
          color: d.color || 'primary'
        });
      });
      set({ users });
      // אפשר לקרוא calculateBalances כאן אם רוצים תמיד עדכני
      get().calculateBalances();
    });

    const unsubExpenses = onSnapshot(query(expensesRef, orderBy('createdAt', 'desc')), (snap) => {
      const expenses: Expense[] = [];
      snap.forEach((doc) => {
        const d = doc.data() as any;
        expenses.push({
          id: doc.id,
          createdAt: d.createdAt?.toDate?.() || new Date(),
          date: d.date?.toDate?.() || new Date(),
          merchant: d.merchant,
          category: d.category,
          amountOriginal: d.amountOriginal,
          currencyOriginal: d.currencyOriginal,
          amountILS: d.amountILS,
          payer: d.payer,
          hebpayer: d.hebpayer,
          splitType: d.splitType,
          isShared: d.isShared,
          notes: d.notes || '',
          country: d.country
        });
      });
      set({ expenses });
      get().calculateBalances();
    });

    const unsubRates = onSnapshot(ratesRef, (snap) => {
      const d = snap.data() as any;
      if (!d?.rates) return;
      // ממפה לפורמט ExchangeRate[]
      const arr: ExchangeRate[] = Object.keys(d.rates).map((k) => ({
        currency: k.toUpperCase(),
        rate: Number(d.rates[k]),
        lastUpdated: d.lastUpdated?.toDate?.() || new Date()
      }));
      set({ exchangeRates: arr });
    });

    return () => {
      unsubTrip();
      unsubUsers();
      unsubExpenses();
      unsubRates();
    };
  },

  // 2) פעולות כתיבה
  addExpense: async (tripId, expenseData) => {
    const state = get();
    const rate = state.exchangeRates.find(r => r.currency === expenseData.currencyOriginal.toUpperCase())?.rate || 1;
    const isILS = expenseData.currencyOriginal.toUpperCase() === 'ILS';
    const amountILS = isILS ? expenseData.amountOriginal : expenseData.amountOriginal * rate;

    const expensesRef = collection(db, 'trips', tripId, 'expenses');
    await addDoc(expensesRef, {
      ...expenseData,
      currencyOriginal: expenseData.currencyOriginal.toUpperCase(),
      createdAt: serverTimestamp(),
      date: Timestamp.fromDate(expenseData.date || new Date()),
      amountILS: Math.round(amountILS),
      isShared: expenseData.splitType === 'equal',
      hebpayer: expenseData.payer === 'Omri' ? 'עמרי' : 'נועה',
      country: expenseData.country
    });
  },

  deleteExpense: async (tripId, expenseId) => {
    const ref = doc(db, 'trips', tripId, 'expenses', expenseId);
    await deleteDoc(ref);
  },

  updateTrip: async (tripId, tripData) => {
    const ref = doc(db, 'trips', tripId);
    await updateDoc(ref, {
      ...tripData
    });
  },

  updateExchangeRate: async (currency, rate) => {
    // נעדכן מסמך שערים מרכזי: exchangeRates/ILS
    const ratesDoc = doc(db, 'exchangeRates', 'ILS');
    await setDoc(ratesDoc, {
      rates: { [currency.toUpperCase()]: rate },
      lastUpdated: serverTimestamp()
    }, { merge: true });
  },

  // 3) חישובים מקומיים (כמו שהיה)
  calculateBalances: () => {
    const state = get();
    const { expenses } = state;

    const omriStats = { totalPaid: 0, totalOwed: 0 };
    const noaStats = { totalPaid: 0, totalOwed: 0 };

    expenses.forEach(expense => {
      if (expense.payer === 'Omri') {
        omriStats.totalPaid += expense.amountILS;
        if (expense.isShared) omriStats.totalOwed += expense.amountILS;
      } else {
        noaStats.totalPaid += expense.amountILS;
        if (expense.isShared) noaStats.totalOwed += expense.amountILS;
      }
    });

    const totalExpenses = omriStats.totalPaid + noaStats.totalPaid;

    set(state => ({
      users: [
        {
          id: '1',
          name: 'Omri',
          hebName: 'עמרי',
          totalPaid: omriStats.totalPaid,
          totalOwed: omriStats.totalOwed,
          netBalance: Math.max(omriStats.totalOwed - noaStats.totalOwed, 0),
          color: 'primary'
        },
        {
          id: '2',
          name: 'Noa',
          hebName: 'נועה',
          totalPaid: noaStats.totalPaid,
          totalOwed: noaStats.totalOwed,
          netBalance: Math.max(noaStats.totalOwed - omriStats.totalOwed, 0),
          color: 'accent'
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
