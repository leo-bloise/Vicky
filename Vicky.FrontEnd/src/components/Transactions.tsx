import { Plus } from 'lucide-react';
import { TransactionForm } from './TransactionForm';
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
  counterparties: string[];
  showForm: boolean;
  onToggleForm: () => void;
  onSubmit: (data: { amount: number; date: string; counterparty: string }) => void;
  onDelete: (id: string) => void;
}

export function Transactions({
  transactions,
  counterparties,
  showForm,
  onToggleForm,
  onSubmit,
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

      {showForm && (
        <TransactionForm
          counterparties={counterparties}
          onSubmit={onSubmit}
          onCancel={onToggleForm}
        />
      )}

      <TransactionList transactions={transactions} onDelete={onDelete} />
    </div>
  );
}
