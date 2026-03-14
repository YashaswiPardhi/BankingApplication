/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Wallet, 
  CreditCard, 
  History, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  Bell,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBankStore, Transaction, Account } from './store';
import { format } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const login = useBankStore((state) => state.login);

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-[32px] shadow-sm max-w-md w-full border border-black/5"
      >
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Nexus Bank</h1>
        </div>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-medium mb-1">Welcome back</h2>
            <p className="text-neutral-500 text-sm">Enter your email to access your account</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 rounded-xl bg-neutral-50 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
              />
            </div>
            <button 
              onClick={() => email && login(email)}
              className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-neutral-800 transition-colors"
            >
              Sign In
            </button>
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs text-neutral-400">
              By signing in, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl w-full transition-all duration-200",
      active ? "bg-black text-white shadow-md" : "text-neutral-500 hover:bg-neutral-100"
    )}
  >
    <Icon size={20} />
    <span className="font-medium">{label}</span>
  </button>
);

const StatCard = ({ label, value, trend, icon: Icon }: { label: string, value: string, trend?: number, icon: any }) => (
  <div className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-neutral-50 rounded-lg">
        <Icon size={20} className="text-neutral-600" />
      </div>
      {trend !== undefined && (
        <div className={cn(
          "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
          trend > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
        )}>
          {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <p className="text-neutral-500 text-sm font-medium mb-1">{label}</p>
    <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
  </div>
);

function TransactionItem({ transaction }: { transaction: Transaction }) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-neutral-50 rounded-2xl transition-colors cursor-pointer group">
      <div className="flex items-center gap-4">
        <div className={cn(
          "w-12 h-12 rounded-full flex items-center justify-center",
          transaction.type === 'income' ? "bg-emerald-50 text-emerald-600" : "bg-neutral-100 text-neutral-600"
        )}>
          {transaction.type === 'income' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
        </div>
        <div>
          <p className="font-semibold text-neutral-900">{transaction.merchant}</p>
          <p className="text-xs text-neutral-500 font-medium">{transaction.category} • {format(new Date(transaction.date), 'MMM d, h:mm a')}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={cn(
          "font-bold tracking-tight",
          transaction.type === 'income' ? "text-emerald-600" : "text-neutral-900"
        )}>
          {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
        <div className="flex items-center justify-end text-neutral-400 group-hover:text-neutral-600 transition-colors">
          <ChevronRight size={14} />
        </div>
      </div>
    </div>
  );
}

const Dashboard = () => {
  const { user, accounts, transactions, logout } = useBankStore();
  const totalBalance = accounts.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="flex min-h-screen bg-[#f8f8f8]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-black/5 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Wallet className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Nexus</h1>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" active />
          <SidebarItem icon={CreditCard} label="Accounts" />
          <SidebarItem icon={History} label="Transactions" />
          <SidebarItem icon={TrendingUp} label="Investments" />
          <SidebarItem icon={Settings} label="Settings" />
        </nav>

        <div className="pt-6 border-t border-black/5">
          <SidebarItem icon={LogOut} label="Logout" onClick={logout} />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Hello, {user?.name}</h2>
            <p className="text-neutral-500 font-medium">Welcome back to your financial hub.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-neutral-500 hover:bg-neutral-100 rounded-xl transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-black/5">
              <img src={user?.avatar} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            label="Total Balance" 
            value={`$${totalBalance.toLocaleString()}`} 
            trend={2.4} 
            icon={DollarSign} 
          />
          <StatCard 
            label="Monthly Income" 
            value="$4,250.00" 
            trend={12.5} 
            icon={TrendingUp} 
          />
          <StatCard 
            label="Monthly Spending" 
            value="$2,120.45" 
            trend={-5.2} 
            icon={TrendingDown} 
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Accounts Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Your Accounts</h3>
                <button className="text-sm font-semibold text-neutral-500 hover:text-black flex items-center gap-1">
                  View all <ChevronRight size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {accounts.map((acc) => (
                  <motion.div 
                    key={acc.id}
                    whileHover={{ y: -4 }}
                    className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-10 h-10 bg-neutral-50 rounded-xl flex items-center justify-center">
                        {acc.type === 'checking' ? <CreditCard size={20} /> : <TrendingUp size={20} />}
                      </div>
                      <p className="text-xs font-mono text-neutral-400">{acc.accountNumber}</p>
                    </div>
                    <p className="text-neutral-500 text-sm font-medium mb-1">{acc.name}</p>
                    <h4 className="text-xl font-bold tracking-tight">${acc.balance.toLocaleString()}</h4>
                  </motion.div>
                ))}
                <button className="border-2 border-dashed border-neutral-200 rounded-[24px] p-6 flex flex-col items-center justify-center text-neutral-400 hover:border-neutral-300 hover:text-neutral-500 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-neutral-50 flex items-center justify-center mb-2 group-hover:bg-neutral-100 transition-colors">
                    <Plus size={20} />
                  </div>
                  <span className="text-sm font-semibold">Add Account</span>
                </button>
              </div>
            </section>

            {/* Transactions Section */}
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">Recent Activity</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="pl-9 pr-4 py-1.5 bg-neutral-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-black/5 w-40"
                    />
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-[24px] border border-black/5 shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-50">
                  {transactions.map((t) => (
                    <div key={t.id}>
                      <TransactionItem transaction={t} />
                    </div>
                  ))}
                </div>
                <button className="w-full py-4 text-sm font-semibold text-neutral-500 hover:bg-neutral-50 transition-colors border-t border-neutral-50">
                  View Full History
                </button>
              </div>
            </section>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <section className="bg-black text-white p-8 rounded-[32px] shadow-lg">
              <h3 className="text-lg font-bold mb-6">Quick Transfer</h3>
              <div className="space-y-4">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-shrink-0 text-center space-y-2 cursor-pointer">
                      <div className="w-12 h-12 rounded-full border-2 border-white/20 p-0.5">
                        <img 
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} 
                          alt="User" 
                          className="w-full h-full rounded-full bg-neutral-800"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[10px] font-medium opacity-60">User {i}</p>
                    </div>
                  ))}
                  <button className="w-12 h-12 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center flex-shrink-0 hover:border-white/40 transition-colors">
                    <Plus size={20} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      className="w-full bg-white/10 border border-white/10 rounded-2xl py-4 pl-10 pr-4 text-xl font-bold focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/20"
                    />
                  </div>
                </div>

                <button className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-neutral-100 transition-colors shadow-xl">
                  Send Money
                </button>
              </div>
            </section>

            {/* Spending Insights */}
            <section className="bg-white p-6 rounded-[24px] border border-black/5 shadow-sm">
              <h3 className="text-lg font-bold mb-4">Spending Insights</h3>
              <div className="space-y-4">
                {[
                  { category: 'Food & Drinks', amount: 850, color: 'bg-orange-400', percent: 40 },
                  { category: 'Shopping', amount: 420, color: 'bg-indigo-400', percent: 20 },
                  { category: 'Transport', amount: 315, color: 'bg-emerald-400', percent: 15 },
                  { category: 'Others', amount: 535, color: 'bg-neutral-400', percent: 25 },
                ].map((item) => (
                  <div key={item.category} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-neutral-500 uppercase tracking-wider">{item.category}</span>
                      <span>${item.amount}</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percent}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn("h-full rounded-full", item.color)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const user = useBankStore((state) => state.user);

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <LoginScreen key="login" />
      ) : (
        <Dashboard key="dashboard" />
      )}
    </AnimatePresence>
  );
}
