import { useState, useEffect, useMemo } from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank, Plus, PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { FinanceCard } from '@/app/components/FinanceCard';
import { TransactionDialog, type Transaction } from '@/app/components/TransactionDialog';
import { TransactionsTable } from '@/app/components/TransactionsTable';
import { BudgetAlerts, type BudgetAlert } from '@/app/components/BudgetAlert';
import { BudgetManager, type CategoryBudget } from '@/app/components/BudgetManager';
import { Navbar } from '@/app/components/Navbar';
import { api } from './services/api';

const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Lazer',
  'Educação',
  'Moradia',
  'Saúde',
  'Outros',
];

const CATEGORY_COLORS: Record<string, string> = {
  'Alimentação': '#ef4444',
  'Transporte': '#f59e0b',
  'Lazer': '#8b5cf6',
  'Educação': '#3b82f6',
  'Moradia': '#10b981',
  'Saúde': '#ec4899',
  'Outros': '#6b7280',
};

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<CategoryBudget[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');
  const API_BASE = (import.meta as any).env.VITE_API_BASE || 'http://localhost:5000';

// Carregar dados
useEffect(() => {
  async function load() {
    try {
      const [tRes, bRes] = await Promise.all([
        api.get('/api/transactions'),
        api.get('/api/budgets')
      ]);

      if (tRes.ok) setTransactions(await tRes.json());
      if (bRes.ok) setBudgets(await bRes.json());
    } catch (err) {
      console.error("Erro ao carager dados", err);
    }
  }
  load();
}, []);

// Salvar transação
const handleSaveTransaction = async (transactionData: Omit<Transaction, 'id'>) => {
  try {
    let res;
    if (editingTransaction) {
      res = await api.put(`/api/transactions/${editingTransaction.id}`, transactionData);
    } else {
      res = await api.post('/api/transactions', transactionData);
    }

    if (res.ok) {
      const saved = await res.json();
      setTransactions(prev => editingTransaction 
        ? prev.map(t => t.id === saved.id ? saved : t)
        : [...prev, saved]
      );
    }
  } catch (err) {
    console.error("Erro ao salvar", err);
  } finally {
    setIsDialogOpen(false);
    setEditingTransaction(undefined);
  }
};

// Deletar transação
const handleDeleteTransaction = async (id: string) => {
  const res = await api.delete(`/api/transactions/${id}`);
  if (res.ok) {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }
};

  // Persist changes to backend when transactions or budgets change is handled
  // by the respective handlers (create/update/delete). No localStorage here.

  // Calculate totals
  const { totalIncome, totalExpenses, balance, expensesByCategory } = useMemo(() => {
    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const byCategory = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses,
      expensesByCategory: byCategory,
    };
  }, [transactions]);

  // Generate budget alerts
  const budgetAlerts = useMemo(() => {
    const alerts: BudgetAlert[] = [];

    budgets.forEach((budget) => {
      const spent = expensesByCategory[budget.category] || 0;
      const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

      if (percentage >= 80) {
        const alertId = `${budget.category}-${Math.floor(percentage)}`;
        if (!dismissedAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            category: budget.category,
            budgetLimit: budget.limit,
            currentSpent: spent,
            percentage,
          });
        }
      }
    });

    return alerts.sort((a, b) => b.percentage - a.percentage);
  }, [budgets, expensesByCategory, dismissedAlerts]);

  // Prepare chart data
  const pieChartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      color: CATEGORY_COLORS[category] || '#6b7280',
    }))
    .sort((a, b) => b.value - a.value);

  const barChartData = Object.entries(expensesByCategory)
    .map(([category, amount]) => {
      const budget = budgets.find((b) => b.category === category);
      return {
        category,
        gasto: amount,
        orçamento: budget?.limit || 0,
      };
    })

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTransaction(undefined);
  };

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts((prev) => new Set([...prev, id]));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Budget Alerts */}
        {budgetAlerts.length > 0 && (
          <div className="mb-6">
            <BudgetAlerts alerts={budgetAlerts} onDismiss={handleDismissAlert} />
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <FinanceCard
            title="Saldo Total"
            value={balance}
            icon={Wallet}
            variant={balance >= 0 ? 'success' : 'danger'}
          />
          <FinanceCard title="Receitas" value={totalIncome} icon={TrendingUp} variant="success" />
          <FinanceCard title="Despesas" value={totalExpenses} icon={TrendingDown} variant="danger" />
          <FinanceCard
            title="Economia"
            value={totalIncome - totalExpenses}
            icon={PiggyBank}
            variant="default"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Gastos por Categoria</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setChartType('pie')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'pie'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <PieChartIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`p-2 rounded-lg transition-colors ${
                    chartType === 'bar'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {pieChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                {chartType === 'pie' ? (
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }: { name?: string; percent?: number }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  </PieChart>
                ) : (
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="gasto" fill="#ef4444" name="Gasto" />
                    <Bar dataKey="orçamento" fill="#3b82f6" name="Orçamento" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                Nenhuma despesa registrada
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Resumo por Categoria</h2>
            <div className="space-y-4">
              {Object.entries(expensesByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  const budget = budgets.find((b) => b.category === category);
                  const budgetPercentage = budget?.limit ? (amount / budget.limit) * 100 : 0;

                  return (
                    <div key={category}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: CATEGORY_COLORS[category] }}
                          />
                          <span className="text-sm font-medium text-gray-900">{category}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-gray-900">
                            {formatCurrency(amount)}
                          </span>
                          {budget && (
                            <span className="text-xs text-gray-500 ml-2">
                              / {formatCurrency(budget.limit)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            budgetPercentage > 100
                              ? 'bg-red-600'
                              : budgetPercentage >= 80
                              ? 'bg-yellow-600'
                              : 'bg-blue-600'
                          }`}
                          style={{
                            width: `${budget?.limit ? Math.min(budgetPercentage, 100) : percentage}%`,
                          }}
                        />
                      </div>
                      {budget && (
                        <p className="text-xs text-gray-500 mt-1">
                          {budgetPercentage.toFixed(0)}% do orçamento
                        </p>
                      )}
                    </div>
                  );
                })}

              {Object.keys(expensesByCategory).length === 0 && (
                <p className="text-center text-gray-500 py-8">Nenhuma despesa registrada</p>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>

          <BudgetManager
            budgets={budgets}
            categories={CATEGORIES}
            onSave={async (newBudgets: CategoryBudget[]) => {
              try {
                const res = await fetch(`${API_BASE}/api/budgets`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newBudgets),
                });
                if (res.ok) {
                  const saved = await res.json();
                  setBudgets(saved);
                }
              } catch (err) {
                console.error('Erro ao salvar orçamentos', err);
              }
            }}
          />
        </div>

        {/* Transactions Table */}
        <TransactionsTable
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          categories={CATEGORIES}
        />

        {/* Transaction Dialog */}
        <TransactionDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onSave={handleSaveTransaction}
          transaction={editingTransaction}
          categories={CATEGORIES}
        />
      </div>
    </div>
  );
}

export default App;
