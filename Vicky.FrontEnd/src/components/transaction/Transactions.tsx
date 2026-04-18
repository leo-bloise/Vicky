import type { ReactNode } from 'react';
import { Minus, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { TransactionList } from './TransactionList';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

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
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageSizeChange: (pageSize: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoading: boolean;
}

export function Transactions({
  transactions,
  showForm,
  form,
  onToggleForm,
  onDelete,
  currentPage,
  totalPages,
  pageSize,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
  hasNext,
  hasPrevious,
  isLoading,
}: TransactionsProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl text-gray-900">Transactions</h2>
        <button
          onClick={onToggleForm}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
        >
          {showForm ? <>
            <Minus className="w-4 h-4" />
            <span>Add Transaction</span>
          </> : <>
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </>}

        </button>
      </div>

      {showForm && form}

      <div className={isLoading ? 'opacity-50 pointer-events-none' : ''}>
        <TransactionList transactions={transactions} onDelete={onDelete} />
      </div>

      <div className="flex justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-17.5 cursor-pointer bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className='bg-white'>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="5">5</SelectItem>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="10">10</SelectItem>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="20">20</SelectItem>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center space-x-4">
            <button
              onClick={onPreviousPage}
              disabled={!hasPrevious || isLoading}
              className="flex items-center space-x-1 px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={onNextPage}
              disabled={!hasNext || isLoading}
              className="flex items-center space-x-1 px-3 py-1 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
