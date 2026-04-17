import type { ReactNode } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { Counterparty } from './Counterparties';

interface CounterpartiesViewProps {
  counterparties: Counterparty[];
  showForm: boolean;
  onToggleForm: () => void;
  onDelete: (id: string) => void;
  form: ReactNode;
}

export function CounterpartiesView({ counterparties, showForm, onToggleForm, onDelete, form }: CounterpartiesViewProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-gray-900">Counterparties</h2>
        <button
          onClick={onToggleForm}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          {showForm ? <Minus className="w-4 h-4" /> : <Plus className='w-4 h-4' />}
          <span>{showForm ? 'Hide Form' : 'Add Counterparty'}</span>
        </button>
      </div>

      {showForm && form}

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
                  onClick={() => onDelete(counterparty.id)}
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
