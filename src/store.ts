import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  merchant: string;
  date: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'investment';
  balance: number;
  accountNumber: string;
}

interface BankState {
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  accounts: Account[];
  transactions: Transaction[];
  login: (email: string) => void;
  logout: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  transfer: (fromId: string, toId: string, amount: number) => void;
}

export const useBankStore = create<BankState>()(
  persist(
    (set) => ({
      user: null,
      accounts: [
        { id: '1', name: 'Main Checking', type: 'checking', balance: 5420.50, accountNumber: '**** 4291' },
        { id: '2', name: 'Emergency Fund', type: 'savings', balance: 12000.00, accountNumber: '**** 8820' },
        { id: '3', name: 'Stock Portfolio', type: 'investment', balance: 45210.75, accountNumber: '**** 1102' },
      ],
      transactions: [
        { id: '1', type: 'expense', amount: 45.20, category: 'Food', merchant: 'Whole Foods', date: new Date(Date.now() - 86400000).toISOString() },
        { id: '2', type: 'income', amount: 2500.00, category: 'Salary', merchant: 'Tech Corp Inc', date: new Date(Date.now() - 172800000).toISOString() },
        { id: '3', type: 'expense', amount: 120.00, category: 'Utilities', merchant: 'Electric Co', date: new Date(Date.now() - 259200000).toISOString() },
        { id: '4', type: 'expense', amount: 12.99, category: 'Entertainment', merchant: 'Netflix', date: new Date(Date.now() - 345600000).toISOString() },
        { id: '5', type: 'expense', amount: 65.00, category: 'Transport', merchant: 'Uber', date: new Date(Date.now() - 432000000).toISOString() },
      ],
      login: (email: string) => set({ 
        user: { 
          name: email.split('@')[0], 
          email, 
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}` 
        } 
      }),
      logout: () => set({ user: null }),
      addTransaction: (t) => set((state) => ({
        transactions: [
          { ...t, id: Math.random().toString(36).substr(2, 9), date: new Date().toISOString() },
          ...state.transactions
        ]
      })),
      transfer: (fromId, toId, amount) => set((state) => {
        const newAccounts = state.accounts.map(acc => {
          if (acc.id === fromId) return { ...acc, balance: acc.balance - amount };
          if (acc.id === toId) return { ...acc, balance: acc.balance + amount };
          return acc;
        });
        
        const fromAcc = state.accounts.find(a => a.id === fromId);
        const toAcc = state.accounts.find(a => a.id === toId);

        const newTransaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          type: 'expense',
          amount: amount,
          category: 'Transfer',
          merchant: `Transfer to ${toAcc?.name}`,
          date: new Date().toISOString()
        };

        return { 
          accounts: newAccounts,
          transactions: [newTransaction, ...state.transactions]
        };
      }),
    }),
    {
      name: 'nexus-bank-storage',
    }
  )
);
