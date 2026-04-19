export interface Transaction {
  id: string;
  amount: number;
  counterpartyId: string;
  transactionDate: string;
  userId: string;
}

export interface Report {
  incoming: number;
  outgoing: number;
  balance: number;
  transactionsByDate: Record<string, Transaction[]>;
}
