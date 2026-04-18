import type { ReactNode } from 'react';
import { Minus, Plus, Trash2, Search } from 'lucide-react';
import type { CounterpartyListItem } from '../../services/counterparties/types';
import { Loader } from '../ui/loader';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface CounterpartiesViewProps {
  counterparties: CounterpartyListItem[];
  showForm: boolean;
  onToggleForm: () => void;
  onDelete: (id: string) => void;
  form: ReactNode;
  isLoading?: boolean;
  error?: string | null;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onNextPage: () => void;
  onPreviousPage: () => void;
  onPageSizeChange: (pageSize: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function CounterpartiesView({
  counterparties,
  showForm,
  onToggleForm,
  onDelete,
  form,
  isLoading = false,
  error,
  currentPage,
  totalPages,
  pageSize,
  onNextPage,
  onPreviousPage,
  onPageSizeChange,
  hasNext,
  hasPrevious,
  searchQuery,
  onSearchChange
}: CounterpartiesViewProps) {
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

      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search counterparties by name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {isLoading ? (
          <div className="p-8">
            <Loader />
          </div>
        ) : counterparties.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchQuery ? 'No counterparties match your search.' : 'No counterparties yet. Add one to get started!'}
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

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-[70px] cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="5">5</SelectItem>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="10">10</SelectItem>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="20">20</SelectItem>
              <SelectItem className='hover:bg-gray-300 cursor-pointer' value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasPrevious && !isLoading) onPreviousPage();
                  }}
                  className={!hasPrevious || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              <PaginationItem>
                <PaginationLink isActive>
                  {currentPage}
                </PaginationLink>
              </PaginationItem>

              <PaginationItem>
                <span className="px-4 text-sm text-gray-600">
                  of {totalPages}
                </span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext 
                  onClick={(e) => {
                    e.preventDefault();
                    if (hasNext && !isLoading) onNextPage();
                  }}
                  className={!hasNext || isLoading ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
