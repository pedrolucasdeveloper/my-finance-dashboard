import { LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../services/AuthContext'; 
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <nav className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-20">
        
        {/* LADO ESQUERDO: Logo e Título */}
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

        {/* LADO DIREITO: Área do Usuário ou Login */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-300 hidden sm:block font-medium">
                {user.email}
              </span>
              <button 
                onClick={handleLogout}
                className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md active:scale-95"
            >
              <LogIn className="w-4 h-4" />
              <span className="font-medium">Entrar</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}