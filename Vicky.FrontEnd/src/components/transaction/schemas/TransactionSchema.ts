import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().refine(n => n !== 0, { error: 'Amount must be different from 0'}),
  date: z.string().min(1, 'Date is required'),
  counterpartyId: z.string().min(1, 'Counterparty is required'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
