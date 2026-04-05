import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { LayoutDashboard, Receipt, LineChart, Menu, X, UserCog, Wallet } from 'lucide-react';

const Layout = ({ currentView, setCurrentView, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, setRole } = useFinance();

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'insights', label: 'Insights', icon: LineChart },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 bg-slate-800 w-64 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out z-50 flex flex-col border-r border-slate-700/50`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          <div className="flex items-center space-x-3 text-indigo-400">
            <Wallet size={28} className="drop-shadow-lg" />
            <h1 className="text-2xl font-bold tracking-tight text-white">FinDash</h1>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white transition-colors" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-6">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 ${isActive ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-inner' : 'text-slate-400 hover:bg-slate-700/50 hover:text-white border border-transparent'}`}
              >
                <Icon size={20} className={isActive ? 'text-indigo-400' : 'text-slate-500'} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-950">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-4 flex items-center justify-between z-30 sticky top-0 shadow-sm">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-400 hover:text-white mr-4 transition-colors">
              <Menu size={24} />
            </button>
            <h2 className="font-semibold text-xl text-white hidden sm:block tracking-tight">
              {navItems.find(i => i.id === currentView)?.label}
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800 rounded-lg p-1.5 border border-slate-700 shadow-inner">
              <UserCog size={18} className="text-indigo-400 ml-2" />
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-slate-200 text-sm font-medium focus:ring-0 focus:outline-none cursor-pointer pr-2 appearance-none"
              >
                <option value="Viewer" className="bg-slate-800">Viewer Mode</option>
                <option value="Admin" className="bg-slate-800">Admin Mode</option>
              </select>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
