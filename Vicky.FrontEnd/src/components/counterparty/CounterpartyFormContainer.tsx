import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { CounterpartyForm } from './CounterpartyForm';

export const counterpartySchema = z.object({
  name: z.string().trim().min(1, 'Counterparty name is required'),
});

export type CounterpartyFormData = z.infer<typeof counterpartySchema>;

interface CounterpartyFormContainerProps {
  onSubmit: (data: CounterpartyFormData) => void;
  onCancel: () => void;
}

export function CounterpartyFormContainer({ onSubmit, onCancel }: CounterpartyFormContainerProps) {
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

  const onFormSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset();
  });

  return <CounterpartyForm register={register} errors={errors} onSubmit={onFormSubmit} onCancel={onCancel} />;
}
