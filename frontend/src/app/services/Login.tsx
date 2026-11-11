import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import { useAuth } from './AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && user) navigate('/dashboard', { replace: true });
  }, [isLoading, navigate, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (mode === 'login') {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
      } else if (data.user) {
        navigate('/dashboard', { replace: true });
      }
    } else {
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });

      if (authError) {
        setError(authError.message);
      } else if (data.session) {
        navigate('/dashboard', { replace: true });
      } else {
        setMessage('Conta criada. Confira seu e-mail para confirmar o cadastro.');
      }
    }

    setLoading(false);
  };

  const switchMode = () => {
    setMode((current) => current === 'login' ? 'signup' : 'login');
    setError(null);
    setMessage(null);
  };

  return (
    <div className="min-h-[calc(100-80px)] flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-950">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {mode === 'login' ? 'Bem-vindo' : 'Crie sua conta'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                {mode === 'login'
                  ? 'Entre com sua conta para gerenciar suas finanças'
                  : 'Seus dados ficam isolados e protegidos por usuário'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-gray-900 dark:text-white"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Mensagem de Erro */}
              {error && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {message && (
                <div className="flex items-center gap-2 p-3 text-sm text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <p>{message}</p>
                </div>
              )}

              {/* Botão de Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === 'login'
                      ? <LogIn className="w-5 h-5" />
                      : <UserPlus className="w-5 h-5" />}
                    {mode === 'login' ? 'Entrar' : 'Criar conta'}
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={switchMode}
                className="w-full text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                {mode === 'login'
                  ? 'Ainda não tenho uma conta'
                  : 'Já tenho uma conta'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
