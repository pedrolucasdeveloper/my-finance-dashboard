const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

async function readData() {
  try {
    const txt = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(txt);
  } catch (err) {
    return { transactions: [], budgets: [] };
  }
}

async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

app.get('/', (req, res) => {
  res.send('Servidor Backend Rodando');
});

// Transactions
app.get('/api/transactions', async (req, res) => {
  const data = await readData();
  res.json(data.transactions || []);
});

app.post('/api/transactions', async (req, res) => {
  const { type, amount, category, description, date } = req.body;
  if (!type || typeof amount !== 'number') {
    return res.status(400).json({ error: 'Dados de transação inválidos' });
  }

  const data = await readData();
  const newTransaction = {
    id: Date.now().toString(),
    type,
    amount,
    category: category || 'Outros',
    description: description || '',
    date: date || new Date().toISOString().slice(0, 10),
  };
  data.transactions = data.transactions || [];
  data.transactions.push(newTransaction);
  await writeData(data);
  res.status(201).json(newTransaction);
});

app.put('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const data = await readData();
  const idx = (data.transactions || []).findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Transação não encontrada' });
  data.transactions[idx] = { ...data.transactions[idx], ...payload };
  await writeData(data);
  res.json(data.transactions[idx]);
});

app.delete('/api/transactions/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readData();
  const before = data.transactions || [];
  const after = before.filter((t) => t.id !== id);
  if (after.length === before.length) return res.status(404).json({ error: 'Transação não encontrada' });
  data.transactions = after;
  await writeData(data);
  res.status(204).end();
});

// Budgets
app.get('/api/budgets', async (req, res) => {
  const data = await readData();
  res.json(data.budgets || []);
});

app.put('/api/budgets', async (req, res) => {
  const budgets = req.body;
  if (!Array.isArray(budgets)) return res.status(400).json({ error: 'Orçamentos inválidos' });
  const data = await readData();
  data.budgets = budgets;
  await writeData(data);
  res.json(data.budgets);
});

// Alerts - compute server-side alerts where spent >= 80% of budget
app.get('/api/alerts', async (req, res) => {
  const data = await readData();
  const transactions = data.transactions || [];
  const budgets = data.budgets || [];

  const expensesByCategory = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});

  const alerts = [];
  budgets.forEach((budget) => {
    const spent = expensesByCategory[budget.category] || 0;
    const percentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;
    if (percentage >= 80) {
      alerts.push({
        id: `${budget.category}-${Math.floor(percentage)}`,
        category: budget.category,
        budgetLimit: budget.limit,
        currentSpent: spent,
        percentage,
      });
    }
  });

  res.json(alerts.sort((a, b) => b.percentage - a.percentage));
});

app.listen(port, () => {
  console.log(`Servidor Backend rodando em http://localhost:${port}`);
});