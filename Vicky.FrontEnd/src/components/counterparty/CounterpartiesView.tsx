import type { ReactNode } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CounterpartyListItem } from '../../services/counterparties/types';
import { Loader } from '../ui/loader';

interface CounterpartiesViewProps {
  counterparties: CounterpartyListItem[];
  showForm: boolean;
  onToggleForm: () => void;
  onDelete: (id: string) => void;
  form: ReactNode;
  isLoading?: boolean;
  error?: string | null;
}

export function CounterpartiesView({ counterparties, showForm, onToggleForm, onDelete, form, isLoading = false, error }: CounterpartiesViewProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-gray-900">Counterparties</h2>
        <button
          onClick={onToggleForm}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
          disabled={isLoading}
        >
          {showForm ? <Minus className="w-4 h-4" /> : <Plus className='w-4 h-4' />}
          <span>{showForm ? 'Hide Form' : 'Add Counterparty'}</span>
        </button>
      </div>

      {showForm && form}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error creating counterparty
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="p-8">
            <Loader />
          </div>
        ) : counterparties.length === 0 ? (
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
