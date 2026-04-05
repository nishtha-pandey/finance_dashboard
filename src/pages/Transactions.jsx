import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { format, parseISO } from 'date-fns';
import { Search, Plus, Trash2 } from 'lucide-react';
import { categories } from '../data/mockData';

const Transactions = () => {
  const { transactions, deleteTransaction, addTransaction, role } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState('date-desc');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newTx, setNewTx] = useState({ amount: '', category: categories[0], type: 'expense', date: new Date().toISOString().split('T')[0] });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newTx.amount) return;
    addTransaction({
      amount: parseFloat(newTx.amount),
      category: newTx.category,
      type: newTx.type,
      date: new Date(newTx.date).toISOString()
    });
    setNewTx({ amount: '', category: categories[0], type: 'expense', date: new Date().toISOString().split('T')[0] });
    setShowAddForm(false);
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    if (filterType !== 'all') {
      result = result.filter(t => t.type === filterType);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(t => 
        t.category.toLowerCase().includes(lower) || 
        t.amount.toString().includes(lower)
      );
    }

    result.sort((a, b) => {
      if (sortOrder === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortOrder === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortOrder === 'amount-desc') return b.amount - a.amount;
      if (sortOrder === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

    return result;
  }, [transactions, filterType, searchTerm, sortOrder]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Transactions</h2>
        {role === 'Admin' && (
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 bg-indigo-600/90 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-600 transition-colors shadow-lg shadow-indigo-600/20"
          >
            <Plus size={20} />
            <span className="font-medium">Add Transaction</span>
          </button>
        )}
      </div>

      {showAddForm && role === 'Admin' && (
        <form onSubmit={handleAdd} className="bg-slate-900/50 p-6 rounded-2xl shadow-lg border border-slate-800 flex flex-wrap gap-4 items-end animate-in slide-in-from-top-4 duration-300 backdrop-blur-sm">
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Date</label>
            <input type="date" required value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 outline-none transition-shadow" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Amount</label>
            <input type="number" min="0" step="0.01" required value={newTx.amount} onChange={e => setNewTx({...newTx, amount: e.target.value})} className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-2.5 outline-none placeholder-slate-600 transition-shadow" placeholder="0.00" />
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Type</label>
            <select value={newTx.type} onChange={e => setNewTx({...newTx, type: e.target.value})} className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-3 outline-none transition-shadow">
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div className="flex-1 min-w-[150px]">
            <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">Category</label>
            <select value={newTx.category} onChange={e => setNewTx({...newTx, category: e.target.value})} className="w-full bg-slate-800/80 border border-slate-700 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 p-3 outline-none transition-shadow">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="bg-emerald-500 text-slate-900 px-6 py-2.5 rounded-xl hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20 font-bold w-full sm:w-auto">Save Transaction</button>
        </form>
      )}

      {/* Filters/Controls */}
      <div className="bg-slate-900 p-4 rounded-xl shadow-md border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-2.5 bg-slate-950/50 border border-slate-700 text-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none placeholder-slate-500 transition-all"
            placeholder="Search category or amount..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <select 
            className="flex-1 md:flex-none bg-slate-950/50 border border-slate-700 text-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none cursor-pointer text-sm font-medium"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <select 
            className="flex-1 md:flex-none bg-slate-950/50 border border-slate-700 text-slate-300 rounded-xl p-2.5 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none cursor-pointer text-sm font-medium"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Amount: High to Low</option>
            <option value="amount-asc">Amount: Low to High</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800/80">
            <thead className="bg-slate-950/40">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Type</th>
                {role === 'Admin' && <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-slate-900 divide-y divide-slate-800/60">
              {filteredAndSorted.length > 0 ? (
                filteredAndSorted.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {format(parseISO(t.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-200 font-medium">
                      {t.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      <span className={t.type === 'income' ? 'text-emerald-400' : 'text-slate-200'}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1.5 inline-flex text-xs font-bold rounded-lg ${
                        t.type === 'income' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {t.type.toUpperCase()}
                      </span>
                    </td>
                    {role === 'Admin' && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => deleteTransaction(t.id)} className="text-slate-500 hover:text-rose-400 p-2 rounded-lg transition-all hover:bg-rose-500/10 opacity-0 group-hover:opacity-100">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={role === 'Admin' ? 5 : 4} className="px-6 py-16 text-center text-slate-500 text-lg">
                    No transactions found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
