import { useState, useEffect, useCallback, useMemo } from 'react';
import type { UIEventHandler, ChangeEventHandler } from 'react';
import { Transactions } from './Transactions';
import { TransactionFormContainer } from './TransactionFormContainer';
import type { TransactionFormData } from './schemas/TransactionSchema';
import { useAuth } from '../../contexts/AuthContext';
import type { CounterpartyListItem } from '../../services/counterparties/types';
import useDebounce from '../../hooks/useDebounce';

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

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [counterparties, setCounterparties] = useState<CounterpartyListItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [continuationToken, setContinuationToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const fetchInitialCounterparties = useCallback(async (query: string) => {
    try {
      const response = await counterpartiesClient.getCursor({ limit: 20, name: query });
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

  const loadTransactions = useCallback(async (currentCounterparties: CounterpartyListItem[]) => {
    if (!user) return;

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const response = await transactionsClient.get({
        startDate: startOfMonth.toISOString(),
        endDate: endOfDay.toISOString()
      });

      const mappedTransactions = response.data.map(t => {
        const cp = currentCounterparties.find(c => c.id === t.counterpartyId);
        return {
          id: t.id,
          userId: user.username,
          amount: t.amount,
          date: t.transactionDate,
          counterparty: cp ? cp.name : t.counterpartyId 
        };
      });

      mappedTransactions.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setTransactions(mappedTransactions);
    } catch (err) {
      console.error('Failed to load transactions', err);
    }
  }, [user, transactionsClient]);

  useEffect(() => {
    if (user) {
      fetchInitialCounterparties('').then(cps => {
        loadTransactions(cps);
      });
    }
  }, [user, fetchInitialCounterparties, loadTransactions]);

  const handleSubmit = async (data: TransactionFormData) => {
    if (!user) return;

    try {
      await transactionsClient.create({
        amount: data.amount,
        counterpartyId: data.counterpartyId,
        transactionDate: new Date(data.date).toISOString()
      });

      setShowForm(false);
      loadTransactions(counterparties);
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
    />
  );
}
