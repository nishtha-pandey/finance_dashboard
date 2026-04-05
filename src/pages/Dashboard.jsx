import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { ArrowUpRight, ArrowDownRight, DollarSign, LineChart as LineChartIcon } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#818cf8', '#34d399', '#fbbf24', '#f87171', '#a78bfa', '#f472b6', '#2dd4bf', '#fb923c'];

const Dashboard = () => {
  const { transactions } = useFinance();

  const { income, expenses, balance } = useMemo(() => {
    let inc = 0;
    let exp = 0;
    transactions.forEach(t => {
      if (t.type === 'income') inc += t.amount;
      if (t.type === 'expense') exp += t.amount;
    });
    return { income: inc, expenses: exp, balance: inc - exp };
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expensesMap = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});
    return Object.entries(expensesMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const trendData = useMemo(() => {
    const dataMap = {};
    const sorted = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));
    sorted.forEach(t => {
      const day = format(parseISO(t.date), 'MMM dd');
      if (!dataMap[day]) dataMap[day] = { date: day, income: 0, expense: 0 };
      if (t.type === 'income') dataMap[day].income += t.amount;
      if (t.type === 'expense') dataMap[day].expense += t.amount;
    });
    return Object.values(dataMap);
  }, [transactions]);

  const Card = ({ title, amount, icon: Icon, type }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex items-center justify-between shadow-lg shadow-black/20 hover:shadow-indigo-500/5 transition-all duration-300 group">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1 tracking-wide">{title}</p>
        <h3 className="text-3xl font-bold text-slate-50">${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
      </div>
      <div className={`p-4 rounded-2xl transition-transform group-hover:scale-110 ${
        type === 'income' ? 'bg-emerald-500/10 text-emerald-400' :
        type === 'expense' ? 'bg-rose-500/10 text-rose-400' :
        'bg-indigo-500/10 text-indigo-400'
      }`}>
        <Icon size={28} />
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-100 tracking-tight">Financial Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card title="TOTAL BALANCE" amount={balance} icon={DollarSign} type="balance" />
        <Card title="TOTAL INCOME" amount={income} icon={ArrowUpRight} type="income" />
        <Card title="TOTAL EXPENSES" amount={expenses} icon={ArrowDownRight} type="expense" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg shadow-black/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none text-slate-100">
            <LineChartIcon size={150} />
          </div>
          <h3 className="text-lg font-semibold text-slate-200 mb-6 relative z-10">Cashflow Trend</h3>
          <div className="h-[300px] relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dx={-10} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#f8fafc' }}
                  formatter={(value) => [`$${value}`, undefined]}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#34d399" strokeWidth={3} dot={{ r: 4, fill: '#34d399' }} activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2 }} />
                <Line type="monotone" dataKey="expense" name="Expenses" stroke="#f87171" strokeWidth={3} dot={{ r: 4, fill: '#f87171' }} activeDot={{ r: 6, stroke: '#0f172a', strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg shadow-black/20">
          <h3 className="text-lg font-semibold text-slate-200 mb-6">Spending Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value}`, undefined]}
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px', color: '#f8fafc', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
