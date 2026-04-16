import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Transactions } from './Transactions';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  counterparty: string;
}

export function TransactionsContainer() {
  const { state: { user } } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [counterparties, setCounterparties] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTransactions();
    loadCounterparties();
  }, [user]);

  const loadTransactions = () => {
    const all = JSON.parse(localStorage.getItem('vickyTransactions') || '[]');
    const userTransactions = all.filter((t: Transaction) => t.userId === user?.username);
    // Sort by date descending
    userTransactions.sort((a: Transaction, b: Transaction) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setTransactions(userTransactions);
  };

  const loadCounterparties = () => {
    const all = JSON.parse(localStorage.getItem('vickyCounterparties') || '[]');
    const userCounterparties = all.filter((c: any) => c.userId === user?.username);
    setCounterparties(userCounterparties.map((c: any) => c.name));
  };

  const handleSubmit = (data: { amount: number; date: string; counterparty: string }) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: user!.username,
      amount: data.amount,
      date: data.date,
      counterparty: data.counterparty,
    };

    const all = JSON.parse(localStorage.getItem('vickyTransactions') || '[]');
    all.push(transaction);
    localStorage.setItem('vickyTransactions', JSON.stringify(all));

    setShowForm(false);
    loadTransactions();
  };

  const handleDelete = (id: string) => {
    const all = JSON.parse(localStorage.getItem('vickyTransactions') || '[]');
    const updated = all.filter((t: Transaction) => t.id !== id);
    localStorage.setItem('vickyTransactions', JSON.stringify(updated));
    loadTransactions();
  };

  const toggleForm = () => setShowForm(!showForm);

  return (
    <Transactions
      transactions={transactions}
      counterparties={counterparties}
      showForm={showForm}
      onToggleForm={toggleForm}
      onSubmit={handleSubmit}
      onDelete={handleDelete}
    />
  );
}