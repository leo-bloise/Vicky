import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  counterparty: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export function TransactionList({ transactions, onDelete }: TransactionListProps) {
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

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-8 text-center text-gray-500">
          No transactions yet. Add one to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                onClick={() => onDelete(transaction.id)}
                className="text-red-500 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}