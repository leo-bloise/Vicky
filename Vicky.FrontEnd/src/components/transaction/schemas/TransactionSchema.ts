import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  date: z.string().min(1, 'Date is required'),
  counterpartyId: z.string().min(1, 'Counterparty is required'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
