import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UIEventHandler, ChangeEventHandler } from 'react';
import { Transactions } from './Transactions';
import { TransactionFormContainer } from './TransactionFormContainer';
import type { TransactionFormData } from './schemas/TransactionSchema';
import { useAuth } from '../../contexts/AuthContext';
import type { CounterpartyListItem } from '../../services/counterparties/types';
import useDebounce from '../../hooks/useDebounce';
import usePagination from '../../hooks/usePagination';

interface Transaction {
  id: string;
  userId: string;
  amount: number;
  date: string;
  counterparty: string;
}

export function TransactionsContainer() {
  const { state: { user }, clientFactory } = useAuth();
  
  const transactionsClient = useMemo(() => clientFactory.createTransactionsClient(), [clientFactory]);
  const counterpartiesClient = useMemo(() => clientFactory.createCounterpartiesClient(), [clientFactory]);

  const [counterparties, setCounterparties] = useState<CounterpartyListItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [continuationToken, setContinuationToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchInitialCounterparties = useCallback(async (query: string) => {
    try {
      const response = await counterpartiesClient.getCursor({ limit: 100, name: query });
      setCounterparties(response.data.data);
      setContinuationToken(response.data.continuationToken);
      return response.data.data;
    } catch (err) {
      console.error('Failed to load initial counterparties', err);
      return [];
    }
  }, [counterpartiesClient]);

  const fetchMoreCounterparties = useCallback(async () => {
    if (!continuationToken || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      const response = await counterpartiesClient.getCursor({ 
        limit: 20, 
        continuationToken,
        name: debouncedSearchQuery 
      });
      setCounterparties(prev => [...prev, ...response.data.data]);
      setContinuationToken(response.data.continuationToken);
    } catch (err) {
      console.error('Failed to load more counterparties', err);
    } finally {
      setIsLoadingMore(false);
    }
  }, [counterpartiesClient, continuationToken, isLoadingMore, debouncedSearchQuery]);

  const pageProvider = useCallback(async (pageNumber: number, pageSize: number) => {
    if (!user) {
        return { currentPage: 1, totalPages: 0, pageSize, data: [] };
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

    const response = await transactionsClient.getPaged({
      pageNumber,
      pageSize,
      startDate: startOfMonth.toISOString(),
      endDate: endOfDay.toISOString()
    });

    const mappedData = response.data.data.map(t => {
       const cp = counterparties.find(c => c.id === t.counterpartyId);
       return {
         id: t.id,
         userId: user.username,
         amount: t.amount,
         date: t.transactionDate,
         counterparty: cp ? cp.name : t.counterpartyId 
       };
    });

    return {
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
      pageSize,
      data: mappedData
    };
  }, [transactionsClient, user, counterparties]);

  const {
    data: transactions,
    currentPage,
    totalPages,
    pageSize,
    hasNext,
    hasPrevious,
    handleNext,
    handlePrevious,
    loadPage,
    setPageSize,
    isLoading: isTransactionsLoading
  } = usePagination<Transaction>({
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    data: []
  }, pageProvider);

  const handleScroll: UIEventHandler<HTMLDivElement> = (event) => {    
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 10) {
      fetchMoreCounterparties();
    }
  };

  const handleSearchChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    fetchInitialCounterparties(query);
  };

  useEffect(() => {
    if (user) {
      fetchInitialCounterparties('');
    }
  }, [user, fetchInitialCounterparties]);

  useEffect(() => {
    if (user && counterparties.length > 0) {
      loadPage();
    }
  }, [user, counterparties.length, loadPage]);

  const handleSubmit = async (data: TransactionFormData) => {
    if (!user) return;

    try {
      await transactionsClient.create({
        amount: data.amount,
        counterpartyId: data.counterpartyId,
        transactionDate: new Date(data.date).toISOString()
      });

      setShowForm(false);
      loadPage();
    } catch (err) {
      console.error('Failed to create transaction', err);
    }
  };

  const handleDelete = async (_id: string) => {
    console.warn('Delete not implemented in backend');
  };

  const toggleForm = () => setShowForm(!showForm);

  return (
    <Transactions
      transactions={transactions}
      showForm={showForm}
      form={
        <TransactionFormContainer
          counterparties={counterparties}
          onSubmit={handleSubmit}
          onCancel={toggleForm}
          onScroll={handleScroll}
          isLoadingMore={isLoadingMore}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />
      }
      onToggleForm={toggleForm}
      onDelete={handleDelete}
      currentPage={currentPage}
      totalPages={totalPages}
      pageSize={pageSize}
      onNextPage={handleNext}
      onPreviousPage={handlePrevious}
      onPageSizeChange={setPageSize}
      hasNext={hasNext}
      hasPrevious={hasPrevious}
      isLoading={isTransactionsLoading}
    />
  );
}
