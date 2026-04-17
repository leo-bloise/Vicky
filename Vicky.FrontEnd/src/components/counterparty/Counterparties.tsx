import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { CounterpartyFormContainer } from './CounterpartyFormContainer';
import { CounterpartiesView } from './CounterpartiesView';
import type { CounterpartyFormData } from './CounterpartyFormContainer';

export interface Counterparty {
  id: string;
  userId: string;
  name: string;
}

export function Counterparties() {
  const {
    state: { user },
  } = useAuth();
  const [counterparties, setCounterparties] = useState<Counterparty[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadCounterparties();
  }, [user]);

  const loadCounterparties = () => {
    const stored = localStorage.getItem('vickyCounterparties');
    const all = stored ? JSON.parse(stored) as Counterparty[] : [];
    const userCounterparties = all.filter((c) => c.userId === user?.username);
    setCounterparties(userCounterparties);
  };

  const handleAdd = ({ name }: CounterpartyFormData) => {
    if (!user) return;

    const counterparty: Counterparty = {
      id: Date.now().toString(),
      userId: user.username,
      name: name.trim(),
    };

    const stored = localStorage.getItem('vickyCounterparties');
    const all = stored ? JSON.parse(stored) as Counterparty[] : [];
    all.push(counterparty);
    localStorage.setItem('vickyCounterparties', JSON.stringify(all));

    setShowForm(false);
    loadCounterparties();
  };

  const handleDelete = (id: string) => {
    const stored = localStorage.getItem('vickyCounterparties');
    const all = stored ? JSON.parse(stored) as Counterparty[] : [];
    const updated = all.filter((c) => c.id !== id);
    localStorage.setItem('vickyCounterparties', JSON.stringify(updated));
    loadCounterparties();
  };

  return (
    <CounterpartiesView
      counterparties={counterparties}
      showForm={showForm}
      onToggleForm={() => setShowForm((value) => !value)}
      onDelete={handleDelete}
      form={<CounterpartyFormContainer onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}
    />
  );
}
