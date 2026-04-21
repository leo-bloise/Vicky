import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CounterpartyForm } from './CounterpartyForm';

export const counterpartySchema = z.object({
  name: z.string().trim().min(1, 'Counterparty name is required'),
});

export type CounterpartyFormData = z.infer<typeof counterpartySchema>;

interface CounterpartyFormContainerProps {
  onSubmit: (data: CounterpartyFormData) => Promise<void>;
  onCancel: () => void;
  disabled?: boolean;
}

export function CounterpartyFormContainer({ onSubmit, onCancel, disabled = false }: CounterpartyFormContainerProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CounterpartyFormData>({
    resolver: zodResolver(counterpartySchema),
    defaultValues: {
      name: '',
    },
  });

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      // Don't reset on error - let the user correct and try again
    }
  });

  return <CounterpartyForm register={register} errors={errors} onSubmit={onFormSubmit} onCancel={onCancel} disabled={disabled} />;;
}
