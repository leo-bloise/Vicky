import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CounterpartyFormContainer } from './CounterpartyFormContainer';
import { CounterpartiesView } from './CounterpartiesView';
import type { CounterpartyFormData } from './CounterpartyFormContainer';
import type { CreateCounterpartyRequest } from '../../services/requests/create-counterparty-request';
import type { CounterpartyListItem } from '../../services/counterparties/types';

export interface Counterparty {
  id: string;
  userId: string;
  name: string;
}

export function Counterparties() {
  const {
    state: { user },
    clientFactory
  } = useAuth();

  const counterpartiesClient = useMemo(() => clientFactory.createCounterpartiesClient(), [clientFactory]);
  
  const [counterparties, setCounterparties] = useState<CounterpartyListItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCounterparties, setIsLoadingCounterparties] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 20;
  
  useEffect(() => {
    loadCounterparties(1);
  }, [user]);

  const loadCounterparties = async (pageNumber: number = currentPage) => {
    if (!user || isLoadingCounterparties) return;

    setIsLoadingCounterparties(true);
    const loadingStartTime = Date.now();

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const request = {
        pageNumber,
        pageSize,
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfDay.toISOString().split('T')[0]
      };

      const response = await counterpartiesClient.get(request);

      const { data } = response;

      setCounterparties(data.data);
      setCurrentPage(data.currentPage);
      setTotalCount(data.totalPages);

      setTimeout(() => {
        setIsLoadingCounterparties(false);
      }, Math.max(0, 300 - (Date.now() - (loadingStartTime || Date.now()))));

    } catch (err) {
      setCounterparties([]);

      setTimeout(() => {
        setIsLoadingCounterparties(false);
      }, Math.max(0, 300 - (Date.now() - (loadingStartTime || Date.now()))));
    }
  };

  const handleAdd = async ({ name }: CounterpartyFormData) => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const request: CreateCounterpartyRequest = { name };
      await counterpartiesClient.create(request);

      setShowForm(false);
      loadCounterparties(currentPage);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create counterparty';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const hasNext = (currentPage * pageSize) < totalCount;
  const hasPrevious = currentPage > 1;

  const handleNext = () => {
    if (hasNext) {
      loadCounterparties(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (hasPrevious) {
      loadCounterparties(currentPage - 1);
    }
  };

  return (
    <div>
      <CounterpartiesView
        counterparties={counterparties}
        showForm={showForm}
        onToggleForm={() => {
          setShowForm((value) => !value);
          setError(null);
        }}
        onDelete={() => {}}
        form={<CounterpartyFormContainer onSubmit={handleAdd} onCancel={() => {
          setShowForm(false);
          setError(null);
        }} disabled={isLoading} />}
        isLoading={isLoadingCounterparties}
        error={error}
      />
      {totalCount > pageSize && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevious}
            disabled={!hasPrevious || isLoadingCounterparties}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {Math.ceil(totalCount / pageSize)} ({totalCount} total items)
          </span>
          <button
            onClick={handleNext}
            disabled={!hasNext || isLoadingCounterparties}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
