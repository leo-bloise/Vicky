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
  
  useEffect(() => {
    loadCounterparties();
  }, [user]);

  const loadCounterparties = async () => {
    if (!user || isLoadingCounterparties) return;

    setIsLoadingCounterparties(true);

    try {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

      const request = {
        pageNumber: 1,
        pageSize: 20,
        startDate: startOfMonth.toISOString().split('T')[0],
        endDate: endOfDay.toISOString().split('T')[0]
      };

      const response = await counterpartiesClient.get(request);
      setCounterparties(response.data);
    } catch (err) {
      setCounterparties([]);
    } finally {
      setIsLoadingCounterparties(false);
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
      loadCounterparties();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create counterparty';
      setError(errorMessage);
      throw err; // Re-throw so the form container knows it failed
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CounterpartiesView
      counterparties={counterparties}
      showForm={showForm}
      onToggleForm={() => {
        setShowForm((value) => !value);
        setError(null); // Clear error when toggling form
      }}
      onDelete={() => {}} // TODO: Implement delete API
      form={<CounterpartyFormContainer onSubmit={handleAdd} onCancel={() => {
        setShowForm(false);
        setError(null); // Clear error when canceling
      }} disabled={isLoading} />}
      isLoading={isLoadingCounterparties}
      error={error}
    />
  );
}
