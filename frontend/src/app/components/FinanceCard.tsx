import type { LucideIcon } from 'lucide-react';

interface FinanceCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  trend?: number;
  variant?: 'default' | 'success' | 'danger';
}

export function FinanceCard({ title, value, icon: Icon, trend, variant = 'default' }: FinanceCardProps) {
  const variantColors = {
    default: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    danger: 'bg-red-50 text-red-600',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-semibold text-gray-900">{formatCurrency(value)}</h3>
          {trend !== undefined && (
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(1)}% este mês
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${variantColors[variant]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}