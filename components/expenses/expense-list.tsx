'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Expense, defaultExpenseCategories } from '@/lib/types';
import { Group } from '@/lib/types';

interface ExpenseListProps {
  expenses: Expense[];
  group: Group;
}

export default function ExpenseList({ expenses, group }: ExpenseListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Expenses</CardTitle>
        <CardDescription>A list of all expenses in this group.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {expenses.map((expense) => (
            <li key={expense.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center">
              <span className="text-2xl mr-4">
                {defaultExpenseCategories[group.category][expense.category]?.icon}
              </span>
              <div>
                <p className="font-semibold">{expense.description}</p>
                <p className="text-sm text-gray-500">Amount: {expense.amount}</p>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
