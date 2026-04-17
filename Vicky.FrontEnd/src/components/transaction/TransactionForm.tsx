import type { FormEventHandler } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { TransactionFormData } from './TransactionFormContainer';

interface TransactionFormProps {
  counterparties: string[];
  register: UseFormRegister<TransactionFormData>;
  errors: FieldErrors<TransactionFormData>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
}

export function TransactionForm({ counterparties, register, errors, onSubmit, onCancel }: TransactionFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm mb-2 text-gray-700">
            Amount (positive for incoming, negative for outgoing)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            {...register('amount', { valueAsNumber: true })}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 100 or -50"
          />
          {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>}
        </div>

        <div>
          <label htmlFor="date" className="block text-sm mb-2 text-gray-700">
            Transaction Date
          </label>
          <input
            type="date"
            id="date"
            {...register('date')}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>}
        </div>

        <div>
          <label htmlFor="counterparty" className="block text-sm mb-2 text-gray-700">
            Counterparty
          </label>
          <input
            type="text"
            id="counterparty"
            list="counterparties"
            {...register('counterparty')}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type or select a counterparty"
          />
          <datalist id="counterparties">
            {counterparties.map((cp) => (
              <option key={cp} value={cp} />
            ))}
          </datalist>
          {errors.counterparty && <p className="text-red-500 text-sm mt-1">{errors.counterparty.message}</p>}
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
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}