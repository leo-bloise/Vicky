import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionForm } from './TransactionForm';
import type { CounterpartyListItem } from '../../services/counterparties/types';
import { transactionSchema, type TransactionFormData } from './schemas/TransactionSchema';
import type { UIEventHandler, ChangeEventHandler } from 'react';

interface TransactionFormContainerProps {
  counterparties: CounterpartyListItem[];
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
  onScroll?: UIEventHandler<HTMLDivElement>;
  isLoadingMore?: boolean;
  onSearchChange?: ChangeEventHandler<HTMLInputElement>;
  searchQuery?: string;
}

export function TransactionFormContainer({
  counterparties,
  onSubmit,
  onCancel,
  onScroll,
  isLoadingMore,
  onSearchChange,
  searchQuery
}: TransactionFormContainerProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      counterpartyId: '',
    },
  });

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset();
  });

  return (
    <TransactionForm
      counterparties={counterparties}
      register={register}
      control={control}
      errors={errors}
      onSubmit={onFormSubmit}
      onCancel={onCancel}
      onScroll={onScroll}
      isLoadingMore={isLoadingMore}
      onSearchChange={onSearchChange}
      searchQuery={searchQuery}
    />
  );
}
