import { useState } from 'react';
import { Settings, Save, X } from 'lucide-react';

export interface CategoryBudget {
  category: string;
  limit: number;
}

interface BudgetManagerProps {
  budgets: CategoryBudget[];
  categories: string[];
  onSave: (budgets: CategoryBudget[]) => void;
}

export function BudgetManager({ budgets, categories, onSave }: BudgetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localBudgets, setLocalBudgets] = useState<CategoryBudget[]>(budgets);

  const handleOpen = () => {
    setLocalBudgets(budgets);
    setIsOpen(true);
  };

  const handleSave = () => {
    onSave(localBudgets);
    setIsOpen(false);
  };

  const updateBudget = (category: string, limit: number) => {
    setLocalBudgets((prev) => {
      const existing = prev.find((b) => b.category === category);
      if (existing) {
        return prev.map((b) => (b.category === category ? { ...b, limit } : b));
      } else {
        return [...prev, { category, limit }];
      }
    });
  };

  const getBudgetLimit = (category: string) => {
    return localBudgets.find((b) => b.category === category)?.limit || 0;
  };

  if (!isOpen) {
    return (
      <button
        onClick={handleOpen}
        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
      >
        <Settings className="w-4 h-4" />
        Gerenciar Orçamentos
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Gerenciar Orçamentos por Categoria</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <p className="text-sm text-gray-600 mb-4">
            Defina limites de gastos mensais para cada categoria. Você receberá alertas quando atingir 80% do limite ou ultrapassá-lo.
          </p>

          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category} className="flex items-center gap-4">
                <label className="flex-1 text-sm font-medium text-gray-700">
                  {category}
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={getBudgetLimit(category) || ''}
                    onChange={(e) => updateBudget(category, parseFloat(e.target.value) || 0)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0,00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Orçamentos
          </button>
        </div>
      </div>
    </div>
  );
}