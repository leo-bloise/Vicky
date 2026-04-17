import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { TransactionForm } from './TransactionForm';

export const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  counterparty: z.string().min(1, 'Counterparty is required'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormContainerProps {
  counterparties: string[];
  onSubmit: (data: TransactionFormData) => void;
  onCancel: () => void;
}

export function TransactionFormContainer({ counterparties, onSubmit, onCancel }: TransactionFormContainerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split('T')[0],
      counterparty: '',
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
      errors={errors}
      onSubmit={onFormSubmit}
      onCancel={onCancel}
    />
  );
}
