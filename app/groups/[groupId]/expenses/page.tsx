'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, DocumentData } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { AddExpenseForm } from '@/components/AddExpenseForm';

interface Expense extends DocumentData {
  id: string;
  description: string;
  amount: number;
}

export default function GroupExpensesPage({ params }: { params: { groupId: string } }) {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const q = query(collection(firestore, 'expenses'), where('groupId', '==', params.groupId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newExpenses = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenses(newExpenses);
    });

    return () => unsubscribe();
  }, [params.groupId]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Group Expenses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Expenses</h2>
          <ul className="space-y-4">
            {expenses.map((expense) => (
              <li key={expense.id} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="font-semibold">{expense.description}</p>
                <p className="text-sm text-gray-500">Amount: {expense.amount}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add New Expense</h2>
          <AddExpenseForm groupId={params.groupId} />
        </div>
      </div>
    </div>
  );
}
