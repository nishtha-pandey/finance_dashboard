import { subDays } from 'date-fns';

export const mockTransactions = [
  { id: '1', date: subDays(new Date(), 1).toISOString(), amount: 3000, category: 'Salary', type: 'income' },
  { id: '2', date: subDays(new Date(), 2).toISOString(), amount: 150, category: 'Groceries', type: 'expense' },
  { id: '3', date: subDays(new Date(), 2).toISOString(), amount: 60, category: 'Transport', type: 'expense' },
  { id: '4', date: subDays(new Date(), 5).toISOString(), amount: 120, category: 'Utilities', type: 'expense' },
  { id: '5', date: subDays(new Date(), 6).toISOString(), amount: 50, category: 'Entertainment', type: 'expense' },
  { id: '6', date: subDays(new Date(), 8).toISOString(), amount: 800, category: 'Rent', type: 'expense' },
  { id: '7', date: subDays(new Date(), 10).toISOString(), amount: 500, category: 'Freelance', type: 'income' },
  { id: '8', date: subDays(new Date(), 15).toISOString(), amount: 200, category: 'Groceries', type: 'expense' },
];

export const categories = [
  'Salary', 'Freelance', 'Groceries', 'Transport', 'Utilities', 'Entertainment', 'Rent', 'Other'
];
