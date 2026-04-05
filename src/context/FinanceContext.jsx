import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockTransactions } from '../data/mockData';

const FinanceContext = createContext();

export const useFinance = () => useContext(FinanceContext);

export const FinanceProvider = ({ children }) => {
  const [transactions, setTransactions] = useState(null);
  const [role, setRole] = useState('Viewer'); // 'Viewer' or 'Admin'

  useEffect(() => {
    // Fake loading delay to demonstrate loading state
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const addTransaction = (transaction) => {
    setTransactions(prev => [{ ...transaction, id: Date.now().toString() }, ...prev]);
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    role,
    setRole
  };

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  );
};
