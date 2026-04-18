import type { FormEventHandler, UIEventHandler, ChangeEventHandler } from 'react';
import { Controller } from 'react-hook-form';
import type { Control, FieldErrors, UseFormRegister } from 'react-hook-form';
import type { TransactionFormData } from './schemas/TransactionSchema';
import type { CounterpartyListItem } from '../../services/counterparties/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSearch,
} from "../ui/select";
import { Loader } from '../ui/loader';

interface TransactionFormProps {
  counterparties: CounterpartyListItem[];
  register: UseFormRegister<TransactionFormData>;
  control: Control<TransactionFormData>;
  errors: FieldErrors<TransactionFormData>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  onCancel: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  isLoadingMore?: boolean;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
  searchQuery?: string;
}

export function TransactionForm({
  counterparties,
  register,
  control,
  errors,
  onSubmit,
  onCancel,
  onScroll,
  isLoadingMore,
  onSearchChange,
  searchQuery
}: TransactionFormProps) {
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
          <label htmlFor="counterpartyId" className="block text-sm mb-2 text-gray-700">
            Counterparty
          </label>
          <Controller
            name="counterpartyId"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a counterparty" />
                </SelectTrigger>
                <SelectContent className='bg-white' onScroll={onScroll}>
                  <SelectSearch 
                    placeholder="Search counterparties..." 
                    value={searchQuery}
                    onChange={onSearchChange}
                  />
                  {counterparties.map((cp) => (
                    <SelectItem key={cp.id} value={cp.id}>
                      {cp.name}
                    </SelectItem>
                  ))}
                  {isLoadingMore && (
                    <div className="flex justify-center p-2">
                      <Loader className="scale-50 h-8" />
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          />
          {errors.counterpartyId && <p className="text-red-500 text-sm mt-1">{errors.counterpartyId.message}</p>}
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
