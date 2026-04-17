import { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CounterpartyFormContainer } from './CounterpartyFormContainer';
import { CounterpartiesView } from './CounterpartiesView';
import usePagination from '../../hooks/usePagination';
import type { CounterpartyFormData } from './CounterpartyFormContainer';
import type { CreateCounterpartyRequest } from '../../services/requests/create-counterparty-request';
import type { CounterpartyListItem } from '../../services/counterparties/types';
import useDebounce from '../../hooks/useDebounce';

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
  
  const [showForm, setShowForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchCounterparties = useCallback(async (pageNumber: number, pageSize: number) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const request = {
      pageNumber,
      pageSize,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfDay.toISOString().split('T')[0],
      name: debouncedSearchQuery
    };

    const response = await counterpartiesClient.get(request);
    const { data } = response;
    
    return {
      data: data.data,
      currentPage: data.currentPage,
      totalPages: data.totalPages,
      pageSize: pageSize
    };
  }, [counterpartiesClient, debouncedSearchQuery]);

  const {
    currentPage,
    totalPages,
    pageSize,
    data: counterparties,
    hasNext,
    hasPrevious,
    handleNext,
    handlePrevious,
    loadPage,
    setPageSize,
    isLoading
  } = usePagination<CounterpartyListItem>({
    currentPage: 1,
    totalPages: 0,
    pageSize: 5,
    data: []
  }, fetchCounterparties);
  
  useEffect(() => {
    if (user) {
      loadPage();
    }
  }, [user, loadPage]);

  const handleAdd = async ({ name }: CounterpartyFormData) => {
    if (!user) return;

    setIsCreating(true);
    setError(null);

    try {
      const request: CreateCounterpartyRequest = { name };
      await counterpartiesClient.create(request);

      setShowForm(false);
      loadPage();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create counterparty';
      setError(errorMessage);
      throw err;
    } finally {
      setIsCreating(false);
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
        }} disabled={isCreating} />}
        isLoading={isLoading}
        error={error}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        onNextPage={handleNext}
        onPreviousPage={handlePrevious}
        onPageSizeChange={setPageSize}
        hasNext={hasNext}
        hasPrevious={hasPrevious}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
