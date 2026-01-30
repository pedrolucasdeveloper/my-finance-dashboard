import { useState } from 'react';
import { Settings, Save, X, Target, Wallet } from 'lucide-react';

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
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-300 shadow-sm transition-all active:scale-95"
      >
        <Settings className="w-4 h-4 text-indigo-500" />
        Gerenciar Orçamentos
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Glassmorphism */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)} 
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-500" />
              Metas de Gastos
            </h2>
            <p className="text-sm text-gray-500">Controle seu teto mensal por categoria</p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 bg-gray-50/50">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs text-indigo-700 leading-relaxed font-medium">
              💡 Dica: Defina limites realistas. Avisaremos você quando os gastos atingirem 80% do valor estipulado.
            </p>
          </div>

          <div className="space-y-3">
            {categories.map((category) => (
              <div 
                key={category} 
                className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                    <Wallet className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">
                    {category}
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={getBudgetLimit(category) || ''}
                    onChange={(e) => updateBudget(category, parseFloat(e.target.value) || 0)}
                    className="w-32 pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:border-indigo-500 outline-none transition-all text-sm text-right font-semibold text-gray-800"
                    placeholder="0,00"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-100 bg-white">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 px-4 py-3 text-sm font-bold text-gray-500 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-[2] px-4 py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </button>
        </div>
      </div>
    </div>
  );
}