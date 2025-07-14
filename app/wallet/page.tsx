"use client";

import React, { useState } from "react";
import {
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter,
  CreditCard,
  Smartphone,
  Users,
  Banknote
} from "lucide-react";
import { walletAccounts, transactions, defaultIncomeCategories, defaultExpenseCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { TransactionType } from "@/lib/types";

/**
 * Account card component
 */
function AccountCard({ account }: { account: typeof walletAccounts[0] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const accountIcons = {
    'cash': Banknote,
    'bank': CreditCard,
    'mobile-wallet': Smartphone,
    'with-person': Users
  };

  const Icon = accountIcons[account.type];

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">{account.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {account.type.replace('-', ' ')}
            </p>
          </div>
        </div>
        {account.isDefault && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
            Default
          </span>
        )}
      </div>
      <p className="text-2xl font-bold">{formatCurrency(account.balance)}</p>
    </div>
  );
}

/**
 * Transaction row component
 */
function TransactionRow({ transaction }: { transaction: typeof transactions[0] }) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const category = [...defaultIncomeCategories, ...defaultExpenseCategories]
    .find(c => c.id === transaction.categoryId);
  
  const account = walletAccounts.find(a => a.id === transaction.accountId);

  return (
    <tr className="border-b border-border hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-lg",
            transaction.type === 'income' 
              ? "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400"
          )}>
            {transaction.type === 'income' 
              ? <ArrowDownRight className="h-4 w-4" />
              : <ArrowUpRight className="h-4 w-4" />
            }
          </div>
          <div>
            <p className="font-medium">{transaction.description || category?.name}</p>
            {transaction.notes && (
              <p className="text-sm text-muted-foreground">{transaction.notes}</p>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <span 
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
          style={{ 
            backgroundColor: category?.color + '20',
            color: category?.color 
          }}
        >
          {category?.name}
        </span>
      </td>
      <td className="px-4 py-3 text-sm">
        {account?.name}
      </td>
      <td className="px-4 py-3 text-sm">
        {transaction.date.toLocaleDateString()}
      </td>
      <td className={cn(
        "px-4 py-3 font-medium text-right",
        transaction.type === 'income' 
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      )}>
        {transaction.type === 'income' ? '+' : '-'}
        {formatCurrency(transaction.amount)}
      </td>
    </tr>
  );
}

export default function WalletPage() {
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('income');
  const [filterType, setFilterType] = useState<'all' | TransactionType>('all');

  const totalBalance = walletAccounts.reduce((sum, acc) => sum + acc.balance, 0);
  
  const thisMonthIncome = transactions
    .filter(t => t.type === 'income' && 
      t.date.getMonth() === new Date().getMonth() &&
      t.date.getFullYear() === new Date().getFullYear()
    )
    .reduce((sum, t) => sum + t.amount, 0);
    
  const thisMonthExpenses = transactions
    .filter(t => t.type === 'expense' && 
      t.date.getMonth() === new Date().getMonth() &&
      t.date.getFullYear() === new Date().getFullYear()
    )
    .reduce((sum, t) => sum + t.amount, 0);

  const filteredTransactions = transactions
    .filter(t => filterType === 'all' || t.type === filterType)
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground mt-2">
            Manage your finances and track transactions
          </p>
        </div>
        <button
          onClick={() => setShowTransactionModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add Transaction
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Net Worth</h3>
          </div>
          <p className="text-2xl font-bold">{formatCurrency(totalBalance)}</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="font-semibold">This Month Income</h3>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            +{formatCurrency(thisMonthIncome)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
            <h3 className="font-semibold">This Month Expenses</h3>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">
            -{formatCurrency(thisMonthExpenses)}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Monthly Balance</h3>
          </div>
          <p className={cn(
            "text-2xl font-bold",
            thisMonthIncome - thisMonthExpenses >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          )}>
            {thisMonthIncome - thisMonthExpenses >= 0 ? '+' : ''}
            {formatCurrency(thisMonthIncome - thisMonthExpenses)}
          </p>
        </div>
      </div>

      {/* Accounts */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Accounts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {walletAccounts.map(account => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold">Transaction History</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  filterType === 'all' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  filterType === 'income' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={cn(
                  "px-3 py-1 rounded-md text-sm transition-colors",
                  filterType === 'expense' 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                )}
              >
                Expenses
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Description</th>
                <th className="text-left px-4 py-3 font-medium">Category</th>
                <th className="text-left px-4 py-3 font-medium">Account</th>
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-right px-4 py-3 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <TransactionRow key={transaction.id} transaction={transaction} />
              ))}
            </tbody>
          </table>
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <Wallet className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}