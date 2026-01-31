const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("ERRO CRÍTICO: Chaves do Supabase não encontradas!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());
app.use(express.json());

// --- MIDDLEWARE DE AUTENTICAÇÃO ---
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    console.warn(`[${new Date().toISOString()}] Bloqueado: Token não fornecido`);
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.warn(`[${new Date().toISOString()}] Bloqueado: Token inválido`);
      return res.status(401).json({ error: 'Sessão inválida' });
    }

    // Injetamos o ID do usuário na requisição para usar nas consultas
    req.userId = user.id;
    console.log(`[${new Date().toISOString()}] Usuário autenticado: ${user.email}`);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Falha na autenticação' });
  }
};

// --- TRANSACTIONS ---

app.get('/api/transactions', authMiddleware, async (req, res) => {
  // Filtramos pelo user_id do usuário logado
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', req.userId)
    .order('date', { ascending: false });

  if (error) return res.status(500).json(error);
  res.json(data);
});

app.post('/api/transactions', authMiddleware, async (req, res) => {
  const { type, amount, category, description, date } = req.body;

  if (!type || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Dados inválidos' });
  }

  // O user_id é injetado automaticamente pelo authMiddleware
  const { data, error } = await supabase
    .from('transactions')
    .insert([{ 
      type, 
      amount, 
      category: category || 'Outros', 
      description: description || '', 
      date: date || new Date().toISOString().slice(0, 10),
      user_id: req.userId 
    }])
    .select();

  if (error) {
    console.error("Erro no POST:", error.message);
    return res.status(500).json(error);
  }
  res.status(201).json(data[0]);
});

app.put('/api/transactions/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  // Garantimos que o usuário só atualiza o que é dele
  const { data, error } = await supabase
    .from('transactions')
    .update(req.body)
    .eq('id', id)
    .eq('user_id', req.userId)
    .select();

  if (error) return res.status(500).json(error);
  res.json(data[0]);
});

app.delete('/api/transactions/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', req.userId);

  if (error) return res.status(500).json(error);
  res.status(204).end();
});

// --- BUDGETS ---

app.get('/api/budgets', authMiddleware, async (req, res) => {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', req.userId);
    
  if (error) return res.status(500).json(error);
  res.json(data);
});

app.put('/api/budgets', authMiddleware, async (req, res) => {
  // Adicionamos o user_id em cada item do array antes do upsert
  const budgets = req.body.map(b => ({ ...b, user_id: req.userId }));

  const { data, error } = await supabase
    .from('budgets')
    .upsert(budgets, { onConflict: 'category,user_id' }) // Conflito deve considerar usuário e categoria
    .select();

  if (error) return res.status(500).json(error);
  res.json(data);
});

// --- ALERTS ---

app.get('/api/alerts', authMiddleware, async (req, res) => {
  // Buscamos apenas os dados do usuário atual para calcular os alertas
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', req.userId);
    
  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', req.userId);

  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const alerts = budgets.map((budget) => {
    const spent = expensesByCategory[budget.category] || 0;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    return {
      id: `${budget.category}-${Math.floor(percentage)}`,
      category: budget.category,
      budgetLimit: budget.limit,
      currentSpent: spent,
      percentage,
    };
  }).filter(a => a.percentage >= 80);

  res.json(alerts.sort((a, b) => b.percentage - a.percentage));
});

app.listen(port, () => {
  console.log(`\n🚀 Servidor com Autenticação rodando em http://localhost:${port}`);
});