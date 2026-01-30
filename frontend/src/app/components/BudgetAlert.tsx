import { AlertCircle, TrendingUp, X } from 'lucide-react';

export interface BudgetAlert {
  id: string;
  category: string;
  budgetLimit: number;
  currentSpent: number;
  percentage: number;
}

interface BudgetAlertProps {
  alerts: BudgetAlert[];
  onDismiss: (id: string) => void;
}

export function BudgetAlerts({ alerts, onDismiss }: BudgetAlertProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert) => {
        const isOverBudget = alert.percentage > 100;

        return (
          <div
            key={alert.id}
            className={`rounded-lg border p-4 ${
              isOverBudget
                ? 'bg-red-50 border-red-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  isOverBudget ? 'bg-red-100' : 'bg-yellow-100'
                }`}
              >
                {isOverBudget ? (
                  <AlertCircle className="w-5 h-5 text-red-600" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-yellow-600" />
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4
                      className={`font-medium ${
                        isOverBudget ? 'text-red-900' : 'text-yellow-900'
                      }`}
                    >
                      {isOverBudget
                        ? `Orçamento ultrapassado: ${alert.category}`
                        : `Atenção: ${alert.category}`}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${
                        isOverBudget ? 'text-red-700' : 'text-yellow-700'
                      }`}
                    >
                      Você já gastou {formatCurrency(alert.currentSpent)} de{' '}
                      {formatCurrency(alert.budgetLimit)} ({alert.percentage.toFixed(0)}%)
                    </p>
                  </div>
                  <button
                    onClick={() => onDismiss(alert.id)}
                    className={`${
                      isOverBudget
                        ? 'text-red-600 hover:text-red-800'
                        : 'text-yellow-600 hover:text-yellow-800'
                    } transition-colors`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        isOverBudget ? 'bg-red-600' : 'bg-yellow-600'
                      }`}
                      style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}