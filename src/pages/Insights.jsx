import React, { useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Lightbulb, Target, AlertTriangle, TrendingDown, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { startOfMonth, subMonths, isAfter, isBefore } from 'date-fns';

const Insights = () => {
  const { transactions } = useFinance();

  const insights = useMemo(() => {
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) return null;

    const categoryTotals = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {});
    
    const highestCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b);
    
    const biggestExpense = expenses.reduce((max, t) => t.amount > max.amount ? t : max, expenses[0]);

    const avgExpense = expenses.reduce((sum, t) => sum + t.amount, 0) / expenses.length;

    // Monthly Comparison
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const lastMonthStart = startOfMonth(subMonths(now, 1));

    const currentMonthExpenses = expenses
      .filter(t => isAfter(new Date(t.date), currentMonthStart) || new Date(t.date).getTime() === currentMonthStart.getTime())
      .reduce((sum, t) => sum + t.amount, 0);

    const lastMonthExpenses = expenses
      .filter(t => (isAfter(new Date(t.date), lastMonthStart) || new Date(t.date).getTime() === lastMonthStart.getTime()) && isBefore(new Date(t.date), currentMonthStart))
      .reduce((sum, t) => sum + t.amount, 0);

    let monthlyChange = 0;
    if (lastMonthExpenses > 0) {
      monthlyChange = ((currentMonthExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;
    }

    return {
      highestCategory: { name: highestCategory, amount: categoryTotals[highestCategory] },
      biggestExpense,
      avgExpense,
      monthlyComparison: {
        current: currentMonthExpenses,
        last: lastMonthExpenses,
        changePercentage: monthlyChange
      }
    };
  }, [transactions]);

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-slate-500 min-h-[400px] border border-dashed border-slate-700 rounded-3xl m-4">
        <Lightbulb size={64} className="mb-4 text-slate-700 animate-pulse" />
        <h3 className="text-xl font-medium text-slate-300">Not enough data</h3>
        <p className="mt-2 text-slate-500">Add some expenses to see your insights.</p>
      </div>
    );
  }

  const InsightCard = ({ title, value, subtitle, icon: Icon, colorClass, bgColorClass }) => (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl shadow-lg shadow-black/20 flex flex-col hover:-translate-y-1 transition-transform duration-300 group relative overflow-hidden">
      <div className={`p-4 rounded-2xl w-fit ${bgColorClass} ${colorClass} mb-4 transition-transform group-hover:scale-110`}>
        <Icon size={28} />
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 mb-2 tracking-widest uppercase">{title}</p>
        <h3 className="text-2xl font-black text-slate-50 flex items-center">{value}</h3>
        {subtitle && <p className="text-sm font-medium text-slate-500 mt-2">{subtitle}</p>}
      </div>
      <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-3xl opacity-20 rounded-full ${bgColorClass}`} />
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold text-slate-100 tracking-tight pl-2">Financial Insights</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <InsightCard 
          title="TOP SPENDING CATEGORY"
          value={insights.highestCategory.name}
          subtitle={`$${insights.highestCategory.amount.toLocaleString(undefined, {minimumFractionDigits: 2})} total spent`}
          icon={Target}
          colorClass="text-indigo-400"
          bgColorClass="bg-indigo-500/20"
        />
        
        <InsightCard 
          title="MONTHLY COMPARISON"
          value={<>
            ${insights.monthlyComparison.current.toLocaleString(undefined, {minimumFractionDigits: 2})}
            {insights.monthlyComparison.changePercentage !== 0 && (
              <span className={`ml-2 text-sm flex items-center px-2 py-1 rounded-full ${insights.monthlyComparison.changePercentage > 0 ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {insights.monthlyComparison.changePercentage > 0 ? <ArrowUpIcon size={14} className="mr-0.5" /> : <ArrowDownIcon size={14} className="mr-0.5" />}
                {Math.abs(insights.monthlyComparison.changePercentage).toFixed(1)}%
              </span>
            )}
          </>}
          subtitle={`vs $${insights.monthlyComparison.last.toLocaleString(undefined, {minimumFractionDigits: 2})} last month`}
          icon={TrendingDown}
          colorClass="text-amber-400"
          bgColorClass="bg-amber-500/20"
        />

        <InsightCard 
          title="BIGGEST SINGLE EXPENSE"
          value={`$${insights.biggestExpense.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
          subtitle={`on ${insights.biggestExpense.category} (${new Date(insights.biggestExpense.date).toLocaleDateString()})`}
          icon={AlertTriangle}
          colorClass="text-rose-400"
          bgColorClass="bg-rose-500/20"
        />

        <InsightCard 
          title="AVERAGE EXPENSE"
          value={`$${insights.avgExpense.toLocaleString(undefined, {minimumFractionDigits: 2})}`}
          subtitle="per transaction"
          icon={TrendingDown}
          colorClass="text-emerald-400"
          bgColorClass="bg-emerald-500/20"
        />
      </div>

      <div className="bg-gradient-to-br from-indigo-900/80 via-purple-900/80 to-slate-900 border border-indigo-500/30 rounded-3xl p-8 sm:p-10 text-white shadow-2xl mt-12 relative overflow-hidden backdrop-blur-md">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="p-6 bg-indigo-500/20 rounded-full shrink-0 border border-indigo-400/30 shadow-inner">
            <Lightbulb className="text-indigo-300 animate-pulse" size={48} />
          </div>
          <div>
            <h3 className="text-2xl font-bold tracking-tight text-indigo-100 mb-4">Smart Observation</h3>
            <p className="text-indigo-200/90 text-lg leading-relaxed max-w-3xl">
              You are spending the most on <strong className="text-white font-semibold">{insights.highestCategory.name}</strong>. 
              {insights.monthlyComparison.changePercentage > 0 ? (
                <> Your expenses are <strong className="text-rose-400 font-semibold">up by {Math.abs(insights.monthlyComparison.changePercentage).toFixed(1)}%</strong> compared to last month. Consider reviewing your <strong className="text-white">{insights.biggestExpense.category}</strong> expenses to manage your budget better.</>
              ) : insights.monthlyComparison.changePercentage < 0 ? (
                <> Great job! Your expenses are <strong className="text-emerald-400 font-semibold">down by {Math.abs(insights.monthlyComparison.changePercentage).toFixed(1)}%</strong> compared to last month. Keep up the good work!</>
              ) : (
                <> Your expenses are roughly the same as last month.</>
              )}
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
};

export default Insights;
