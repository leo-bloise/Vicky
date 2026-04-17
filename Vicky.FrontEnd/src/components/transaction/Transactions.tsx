import type { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { TransactionList } from './TransactionList';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  counterparty: string;
}

interface TransactionsProps {
  transactions: Transaction[];
  showForm: boolean;
  form: ReactNode;
  onToggleForm: () => void;
  onDelete: (id: string) => void;
}

export function Transactions({
  transactions,
  showForm,
  form,
  onToggleForm,
  onDelete,
}: TransactionsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-gray-900">Transactions</h2>
        <button
          onClick={onToggleForm}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {showForm && form}

      <TransactionList transactions={transactions} onDelete={onDelete} />
    </div>
  );
}
