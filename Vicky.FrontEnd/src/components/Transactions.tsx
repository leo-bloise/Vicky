import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  counterparty: string;
}

export function Transactions() {
  const { state: { user } } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [counterparties, setCounterparties] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    counterparty: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transaction: Transaction = {
      id: Date.now().toString(),
      userId: user!.username,
      amount: parseFloat(formData.amount),
      date: formData.date,
      counterparty: formData.counterparty,
    };

    const all = JSON.parse(localStorage.getItem('vickyTransactions') || '[]');
    all.push(transaction);
    localStorage.setItem('vickyTransactions', JSON.stringify(all));

    setFormData({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      counterparty: '',
    });
    setShowForm(false);
    loadTransactions();
  };

  const handleDelete = (id: string) => {
    const all = JSON.parse(localStorage.getItem('vickyTransactions') || '[]');
    const updated = all.filter((t: Transaction) => t.id !== id);
    localStorage.setItem('vickyTransactions', JSON.stringify(updated));
    loadTransactions();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-gray-900">Transactions</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-sm mb-2 text-gray-700">
                Amount (positive for incoming, negative for outgoing)
              </label>
              <input
                type="number"
                id="amount"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 100 or -50"
                required
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm mb-2 text-gray-700">
                Transaction Date
              </label>
              <input
                type="date"
                id="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="counterparty" className="block text-sm mb-2 text-gray-700">
                Counterparty
              </label>
              <input
                type="text"
                id="counterparty"
                list="counterparties"
                value={formData.counterparty}
                onChange={(e) => setFormData({ ...formData, counterparty: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type or select a counterparty"
                required
              />
              <datalist id="counterparties">
                {counterparties.map((cp) => (
                  <option key={cp} value={cp} />
                ))}
              </datalist>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {transactions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No transactions yet. Add one to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {transaction.amount > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="text-gray-900">{transaction.counterparty}</div>
                    <div className="text-sm text-gray-500">{formatDate(transaction.date)}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className={`text-lg ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </span>
                  <button
                    onClick={() => handleDelete(transaction.id)}
                    className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
