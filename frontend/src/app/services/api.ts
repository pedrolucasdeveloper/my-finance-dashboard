import { supabase } from './supabaseClient';
import type { Transaction } from '../components/TransactionDialog';
import type { CategoryBudget } from '../components/BudgetManager';

type TransactionInput = Omit<Transaction, 'id'>;
type TransactionRow = Omit<Transaction, 'amount'> & { amount: number | string };
type BudgetRow = Omit<CategoryBudget, 'limit'> & { limit: number | string };

async function getCurrentUserId() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error('Sua sessão expirou. Entre novamente.');
  }

  return session.user.id;
}

function normalizeTransaction(row: TransactionRow): Transaction {
  return {
    ...row,
    amount: Number(row.amount),
  };
}

function normalizeBudget(row: BudgetRow): CategoryBudget {
  return {
    ...row,
    limit: Number(row.limit),
  };
}

export const api = {
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, type, amount, category, description, date')
      .order('date', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data as TransactionRow[]).map(normalizeTransaction);
  },

  async createTransaction(transaction: TransactionInput): Promise<Transaction> {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...transaction, user_id: userId })
      .select('id, type, amount, category, description, date')
      .single();

    if (error) throw new Error(error.message);

    return normalizeTransaction(data as TransactionRow);
  },

  async updateTransaction(id: string, transaction: TransactionInput): Promise<Transaction> {
    const userId = await getCurrentUserId();
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction)
      .eq('id', id)
      .eq('user_id', userId)
      .select('id, type, amount, category, description, date')
      .single();

    if (error) throw new Error(error.message);

    return normalizeTransaction(data as TransactionRow);
  },

  async deleteTransaction(id: string): Promise<void> {
    const userId = await getCurrentUserId();
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
  },

  async getBudgets(): Promise<CategoryBudget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('category, limit')
      .order('category');

    if (error) throw new Error(error.message);

    return (data as BudgetRow[]).map(normalizeBudget);
  },

  async saveBudgets(budgets: CategoryBudget[]): Promise<CategoryBudget[]> {
    const userId = await getCurrentUserId();
    const budgetsToSave = budgets
      .filter((budget) => Number.isFinite(budget.limit) && budget.limit > 0)
      .map((budget) => ({
        category: budget.category,
        limit: budget.limit,
        user_id: userId,
      }));

    const { data: existing, error: existingError } = await supabase
      .from('budgets')
      .select('category')
      .eq('user_id', userId);

    if (existingError) throw new Error(existingError.message);

    if (budgetsToSave.length > 0) {
      const { error: upsertError } = await supabase
        .from('budgets')
        .upsert(budgetsToSave, { onConflict: 'user_id,category' });

      if (upsertError) throw new Error(upsertError.message);
    }

    const categoriesToKeep = new Set(budgetsToSave.map((budget) => budget.category));
    const categoriesToDelete = (existing ?? [])
      .map((budget) => budget.category)
      .filter((category) => !categoriesToKeep.has(category));

    if (categoriesToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('budgets')
        .delete()
        .eq('user_id', userId)
        .in('category', categoriesToDelete);

      if (deleteError) throw new Error(deleteError.message);
    }

    return api.getBudgets();
  },
};
