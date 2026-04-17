import type { FormEventHandler } from 'react';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { CounterpartyFormData } from './CounterpartyFormContainer';

interface CounterpartyFormProps {
  register: UseFormRegister<CounterpartyFormData>;
  errors: FieldErrors<CounterpartyFormData>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  disabled?: boolean;
}

export function CounterpartyForm({ register, errors, onSubmit, onCancel, disabled = false }: CounterpartyFormProps) {
  return (
    <form onSubmit={onSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm mb-2 text-gray-700">
            Counterparty Name
          </label>
          <input
            type="text"
            id="name"
            {...register('name')}
            disabled={disabled}
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            placeholder="e.g., Amazon, John Doe, Grocery Store"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={disabled}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {disabled ? 'Creating...' : 'Add'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={disabled}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
}
