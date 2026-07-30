import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

import { INITIAL_ACCOUNTS, INITIAL_TRANSACTIONS, INITIAL_BUDGETS, INITIAL_CONTACTS } from './src/data/mockData.js';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middleware for parsing JSON requests
  app.use(express.json());

  // Database Path
  const DB_PATH = path.join(process.cwd(), 'src', 'data', 'db.json');

  // Helper functions for reading/writing our file-based JSON DB
  function readDb() {
    try {
      if (fs.existsSync(DB_PATH)) {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
      }
    } catch (err) {
      console.error('Error reading database file, using defaults:', err);
    }
    return {
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
      budgets: INITIAL_BUDGETS,
      contacts: INITIAL_CONTACTS
    };
  }

  function writeDb(data: any) {
    try {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error writing database file:', err);
    }
  }

  // API: Get health status
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development' });
  });

  // API: Get all accounts
  app.get('/api/accounts', (req, res) => {
    const db = readDb();
    res.json(db.accounts);
  });

  // API: Create new bank account
  app.post('/api/accounts', (req, res) => {
    const db = readDb();
    const newAccount = req.body;
    if (!newAccount.bankName || !newAccount.accountName) {
      return res.status(400).json({ error: 'Missing required account fields' });
    }
    db.accounts.push(newAccount);
    writeDb(db);
    res.status(201).json(newAccount);
  });

  // API: Delete bank account
  app.delete('/api/accounts/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    db.accounts = db.accounts.filter((a: any) => a.id !== id);
    db.transactions = db.transactions.filter((t: any) => t.accountId !== id);
    writeDb(db);
    res.json({ success: true });
  });

  // API: Sync bank account with new simulated transactions
  app.post('/api/accounts/:id/sync', (req, res) => {
    const db = readDb();
    const accountId = req.params.id;
    const account = db.accounts.find((a: any) => a.id === accountId);
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    // Mock real-time merchant feeds for dynamic balance and transactions
    const merchants = [
      { name: 'Apple Subscription', category: 'Entertainment', amount: -9.99 },
      { name: 'Uber Eats', category: 'Food & Dining', amount: -24.50 },
      { name: 'ATM Cash Deposit', category: 'Income', amount: 100.00 },
      { name: 'Amazon Prime', category: 'Shopping', amount: -14.99 },
      { name: 'Shell Gas Station', category: 'Travel & Transport', amount: -38.00 },
      { name: 'Whole Foods Market', category: 'Food & Dining', amount: -42.80 },
      { name: 'Starbucks Coffee', category: 'Food & Dining', amount: -5.75 },
      { name: 'Netflix', category: 'Entertainment', amount: -15.49 },
      { name: 'Gym Membership', category: 'Bills & Utilities', amount: -29.99 }
    ];

    const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
    const newTx = {
      id: `tx-sync-${Date.now()}`,
      date: new Date().toISOString(),
      description: randomMerchant.name,
      amount: randomMerchant.amount,
      category: randomMerchant.category,
      accountId: accountId,
      status: 'completed'
    };

    // Update account balance
    account.balance = parseFloat((account.balance + randomMerchant.amount).toFixed(2));

    db.transactions.unshift(newTx);
    writeDb(db);

    res.json({
      account,
      newTransaction: newTx
    });
  });

  // API: Get all transactions
  app.get('/api/transactions', (req, res) => {
    const db = readDb();
    res.json(db.transactions);
  });

  // API: Create transaction
  app.post('/api/transactions', (req, res) => {
    const db = readDb();
    const tx = req.body;
    if (!tx.accountId || !tx.amount || !tx.description) {
      return res.status(400).json({ error: 'Missing required transaction fields' });
    }

    db.transactions.unshift(tx);

    const account = db.accounts.find((a: any) => a.id === tx.accountId);
    if (account) {
      // Outgoing transaction reduces balance, incoming increases balance
      account.balance = parseFloat((account.balance + tx.amount).toFixed(2));
    }

    writeDb(db);
    res.status(201).json({ transaction: tx, account });
  });

  // API: Delete/Refund transaction
  app.delete('/api/transactions/:id', (req, res) => {
    const db = readDb();
    const { id } = req.params;
    const txToDelete = db.transactions.find((t: any) => t.id === id);
    if (txToDelete) {
      db.transactions = db.transactions.filter((t: any) => t.id !== id);
      const account = db.accounts.find((a: any) => a.id === txToDelete.accountId);
      if (account) {
        account.balance = parseFloat((account.balance - txToDelete.amount).toFixed(2));
      }
      writeDb(db);
      res.json({ success: true, account });
    } else {
      res.status(404).json({ error: 'Transaction not found' });
    }
  });

  // API: Get budgets
  app.get('/api/budgets', (req, res) => {
    const db = readDb();
    res.json(db.budgets);
  });

  // API: Update or create budget
  app.post('/api/budgets', (req, res) => {
    const db = readDb();
    const budget = req.body;
    if (!budget.category || budget.limit === undefined) {
      return res.status(400).json({ error: 'Missing required budget fields' });
    }

    const index = db.budgets.findIndex((b: any) => b.id === budget.id || b.category === budget.category);
    if (index !== -1) {
      db.budgets[index] = { ...db.budgets[index], ...budget };
    } else {
      db.budgets.push(budget);
    }

    writeDb(db);
    res.json(db.budgets);
  });

  // API: Reset sandbox
  app.post('/api/reset', (req, res) => {
    const defaultDb = {
      accounts: INITIAL_ACCOUNTS,
      transactions: INITIAL_TRANSACTIONS,
      budgets: INITIAL_BUDGETS,
      contacts: INITIAL_CONTACTS
    };
    writeDb(defaultDb);
    res.json(defaultDb);
  });

  // Vite development / Static production handler
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
