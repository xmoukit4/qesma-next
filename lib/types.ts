export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  paidBy: string;
  split: 'equally' | 'custom';
  customSplit?: { [key: string]: number };
  members: string[];
  receipt?: string;
  createdAt: Date;
  tags?: string[];
}
