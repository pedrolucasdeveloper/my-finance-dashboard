import { LayoutDashboard } from 'lucide-react';

export function Navbar() {

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-gray-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-lg font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                Dashboard Financeiro
              </h1>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 leading-tight">
                Gerencie suas finanças de forma simples e eficiente
              </p>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}