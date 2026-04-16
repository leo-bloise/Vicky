import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Trash2 } from 'lucide-react';

interface Counterparty {
  id: string;
  userId: string;
  name: string;
}

export function Counterparties() {
  const { state: { user } } = useAuth();
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [newCounterparty, setNewCounterparty] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCounterparties();
  }, [user]);

  const loadCounterparties = () => {
    const all = JSON.parse(localStorage.getItem('vickyCounterparties') || '[]');
    const userCounterparties = all.filter((c: Counterparty) => c.userId === user?.username);
    setCounterparties(userCounterparties);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCounterparty.trim()) return;

    const counterparty: Counterparty = {
      id: Date.now().toString(),
      userId: user!.username,
      name: newCounterparty.trim(),
    };

    const all = JSON.parse(localStorage.getItem('vickyCounterparties') || '[]');
    all.push(counterparty);
    localStorage.setItem('vickyCounterparties', JSON.stringify(all));

    setNewCounterparty('');
    setShowForm(false);
    loadCounterparties();
  };

  const handleDelete = (id: string) => {
    const all = JSON.parse(localStorage.getItem('vickyCounterparties') || '[]');
    const updated = all.filter((c: Counterparty) => c.id !== id);
    localStorage.setItem('vickyCounterparties', JSON.stringify(updated));
    loadCounterparties();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-gray-900">Counterparties</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Counterparty</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm mb-2 text-gray-700">
                Counterparty Name
              </label>
              <input
                type="text"
                id="name"
                value={newCounterparty}
                onChange={(e) => setNewCounterparty(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Amazon, John Doe, Grocery Store"
                required
              />
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
        {counterparties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No counterparties yet. Add one to get started!
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {counterparties.map((counterparty) => (
              <div
                key={counterparty.id}
                className="flex justify-between items-center p-4 hover:bg-gray-50 transition-colors"
              >
                <span className="text-gray-900">{counterparty.name}</span>
                <button
                  onClick={() => handleDelete(counterparty.id)}
                  className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
